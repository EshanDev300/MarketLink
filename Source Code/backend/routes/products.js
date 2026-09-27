const express = require('express');
const router = express.Router();
const ProductModel = require('../models/Product');
const UserModel = require('../models/User');
const MarketModel = require('../models/Market');
const { requireAuth, requireRole } = require('../middleware/auth');

// Browse & filter products
router.get('/', async (req, res) => {
  try {
    const { category, market, day, minPrice, maxPrice, search, farmer, inStockOnly, sort } = req.query;
    let products = await ProductModel.find();

    // Search filter
    if (search && search !== 'undefined' && search.trim()) {
      const q = search.trim().toLowerCase();
      products = products.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.farmerName && p.farmerName.toLowerCase().includes(q)) ||
        (p.stallName && p.stallName.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (category && category !== 'All' && category !== 'undefined') {
      products = products.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
    }

    // Market filter
    if (market && market !== 'All' && market !== 'undefined') {
      products = products.filter(p => p.marketId === market || p.marketName === market);
    }

    // Day filter
    if (day && day !== 'All' && day !== 'undefined') {
      const d = day.toLowerCase();
      products = products.filter(p => (p.harvestDay && p.harvestDay.toLowerCase().includes(d)));
    }

    // Farmer filter
    if (farmer && farmer !== 'undefined') {
      products = products.filter(p => p.farmerId === farmer);
    }

    // Stock filter
    if (inStockOnly === 'true' || inStockOnly === true) {
      products = products.filter(p => !p.isSoldOut && p.stock_quantity > 0);
    }

    // Price range filter
    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }

    // Sorting
    if (sort === 'price_asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      products.sort((a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0));
    } else if (sort === 'stock') {
      products.sort((a, b) => b.stock_quantity - a.stock_quantity);
    } else {
      // Default newest
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving products.' });
  }
});

// Single Product Details
router.get('/:id', async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    // Fetch associated farmer
    const farmer = await UserModel.findById(product.farmerId);
    let safeFarmer = null;
    if (farmer) {
      safeFarmer = { ...farmer };
      delete safeFarmer.password_hash;
    }

    res.json({
      product,
      farmer: safeFarmer
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving product.' });
  }
});

// Farmer create product
router.post('/', requireAuth, requireRole(['farmer', 'admin']), async (req, res) => {
  try {
    const { name, category, price, unit, stock_quantity, description, image, marketId, isRecurringTemplate, harvestDay } = req.body;

    if (!name || !category || price === undefined || !unit || stock_quantity === undefined) {
      return res.status(400).json({ message: 'Name, category, price, unit, and stock quantity are required.' });
    }

    // Farmer details from authenticated user
    const farmerUser = await UserModel.findById(req.user.id);
    let marketName = 'Downtown Green Farmers Market';
    if (marketId) {
      const market = await MarketModel.findById(marketId);
      if (market) marketName = market.name;
    }

    const newProduct = await ProductModel.create({
      farmerId: req.user.id,
      farmerName: farmerUser ? farmerUser.name : req.user.name,
      stallName: farmerUser ? farmerUser.stallName : '',
      marketId: marketId || (farmerUser && farmerUser.marketsSellingAt ? farmerUser.marketsSellingAt[0] : 'mkt_01'),
      marketName: marketName,
      name,
      category,
      price: parseFloat(price),
      unit,
      stock_quantity: parseInt(stock_quantity, 10),
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      isSoldOut: parseInt(stock_quantity, 10) === 0,
      isRecurringTemplate: !!isRecurringTemplate,
      harvestDay: harvestDay || 'Friday Morning',
      ratingAverage: 5.0,
      reviewsCount: 0
    });

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: 'Error adding product.' });
  }
});

// Farmer update product
router.put('/:id', requireAuth, requireRole(['farmer', 'admin']), async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    // Farmers can only edit their own products unless admin
    if (req.user.role !== 'admin' && product.farmerId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to edit this product.' });
    }

    const updates = { ...req.body };
    if (updates.price !== undefined) updates.price = parseFloat(updates.price);
    if (updates.stock_quantity !== undefined) {
      updates.stock_quantity = parseInt(updates.stock_quantity, 10);
      if (updates.stock_quantity === 0) updates.isSoldOut = true;
    }

    const updated = await ProductModel.findByIdAndUpdate(req.params.id, updates);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating product.' });
  }
});

// Toggle Sold Out / Available
router.patch('/:id/toggle-soldout', requireAuth, requireRole(['farmer', 'admin']), async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    if (req.user.role !== 'admin' && product.farmerId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to modify this product.' });
    }

    const newSoldOutState = !product.isSoldOut;
    const updated = await ProductModel.findByIdAndUpdate(req.params.id, {
      isSoldOut: newSoldOutState
    });

    res.json({
      message: newSoldOutState ? 'Marked as Sold Out' : 'Marked as Available',
      product: updated
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating product status.' });
  }
});

// Farmer Delete Product
router.delete('/:id', requireAuth, requireRole(['farmer', 'admin']), async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    if (req.user.role !== 'admin' && product.farmerId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this product.' });
    }

    await ProductModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product.' });
  }
});

module.exports = router;
