const express = require('express');
const router = express.Router();
const MarketModel = require('../models/Market');
const UserModel = require('../models/User');
const ProductModel = require('../models/Product');
const { requireAuth, requireRole } = require('../middleware/auth');

// Get All Markets with optional query filters (day, search)
router.get('/', async (req, res) => {
  try {
    const { day, search } = req.query;
    let markets = await MarketModel.find();

    if (day && day !== 'All') {
      markets = markets.filter(m => m.operatingDays && m.operatingDays.includes(day));
    }

    if (search) {
      const q = search.toLowerCase();
      markets = markets.filter(m => 
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.address && m.address.toLowerCase().includes(q)) ||
        (m.city && m.city.toLowerCase().includes(q))
      );
    }

    res.json(markets);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving markets.' });
  }
});

// Get Single Market by ID with its Vendors and Products
router.get('/:id', async (req, res) => {
  try {
    const market = await MarketModel.findById(req.params.id);
    if (!market) {
      return res.status(404).json({ message: 'Market not found.' });
    }

    // Get farmers selling at this market
    const allFarmers = await UserModel.find({ role: 'farmer', status: 'active' });
    const marketFarmers = allFarmers.filter(f => 
      f.marketsSellingAt && f.marketsSellingAt.includes(req.params.id)
    ).map(f => {
      const copy = { ...f };
      delete copy.password_hash;
      return copy;
    });

    // Get products available at this market
    const allProducts = await ProductModel.find();
    const marketProducts = allProducts.filter(p => p.marketId === req.params.id && !p.isSoldOut);

    res.json({
      market,
      farmers: marketFarmers,
      products: marketProducts
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving market details.' });
  }
});

// Admin Create Market
router.post('/', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const { name, address, city, operatingDays, timings, latitude, longitude, image, description } = req.body;
    if (!name || !address || !latitude || !longitude) {
      return res.status(400).json({ message: 'Name, address, latitude, and longitude are required.' });
    }

    const newMarket = await MarketModel.create({
      name,
      address,
      city: city || 'San Francisco',
      operatingDays: operatingDays || ['Saturday', 'Sunday'],
      timings: timings || '08:00 AM - 01:30 PM',
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      map_provider: 'OpenStreetMap',
      image: image || 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80',
      description: description || 'Local community farmers market.',
      stallCount: 15,
      featured: false
    });

    res.status(201).json(newMarket);
  } catch (err) {
    res.status(500).json({ message: 'Error creating market.' });
  }
});

// Admin Update Market
router.put('/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const updated = await MarketModel.findByIdAndUpdate(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Market not found.' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating market.' });
  }
});

// Admin Delete Market
router.delete('/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const deleted = await MarketModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Market not found.' });
    res.json({ message: 'Market deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting market.' });
  }
});

module.exports = router;
