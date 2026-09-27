const express = require('express');
const router = express.Router();
const UserModel = require('../models/User');
const MarketModel = require('../models/Market');
const ProductModel = require('../models/Product');
const OrderModel = require('../models/Order');
const ReviewModel = require('../models/Review');
const CategoryModel = require('../models/Category');
const AnnouncementModel = require('../models/Announcement');
const { requireAuth, requireRole } = require('../middleware/auth');

// All admin routes require admin role
router.use(requireAuth, requireRole(['admin']));

// Admin Dashboard Summary Metrics & Platform Analytics
router.get('/metrics', async (req, res) => {
  try {
    const allUsers = await UserModel.find();
    const farmers = allUsers.filter(u => u.role === 'farmer');
    const customers = allUsers.filter(u => u.role === 'customer');
    const pendingFarmers = farmers.filter(f => f.status === 'pending');

    const markets = await MarketModel.find();
    const products = await ProductModel.find();
    const orders = await OrderModel.find();

    const totalRevenue = orders.reduce((sum, ord) => sum + (ord.order_status !== 'cancelled' ? ord.total_amount : 0), 0);

    // Orders status breakdown
    const statusCounts = {
      placed: orders.filter(o => o.order_status === 'placed').length,
      accepted: orders.filter(o => o.order_status === 'accepted').length,
      ready_for_pickup: orders.filter(o => o.order_status === 'ready_for_pickup').length,
      completed: orders.filter(o => o.order_status === 'completed').length,
      cancelled: orders.filter(o => o.order_status === 'cancelled').length
    };

    // Revenue by Market
    const marketRevenue = {};
    markets.forEach(m => { marketRevenue[m.name] = 0; });
    orders.forEach(o => {
      if (o.order_status !== 'cancelled' && o.marketName) {
        marketRevenue[o.marketName] = (marketRevenue[o.marketName] || 0) + o.total_amount;
      }
    });

    // Top active farmers
    const farmerSales = {};
    orders.forEach(o => {
      if (o.order_status !== 'cancelled' && o.farmerName) {
        farmerSales[o.farmerName] = (farmerSales[o.farmerName] || 0) + o.total_amount;
      }
    });
    const topFarmers = Object.entries(farmerSales)
      .map(([name, sales]) => ({ name, sales: parseFloat(sales.toFixed(2)) }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    res.json({
      totalFarmers: farmers.length,
      pendingFarmers: pendingFarmers.length,
      totalCustomers: customers.length,
      totalMarkets: markets.length,
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      statusCounts,
      marketRevenue,
      topFarmers
    });
  } catch (err) {
    console.error('Error generating metrics:', err);
    res.status(500).json({ message: 'Error generating platform metrics.' });
  }
});

// Manage Users (Farmers & Customers)
router.get('/users', async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await UserModel.find(filter);
    const safeUsers = users.map(u => {
      const copy = { ...u };
      delete copy.password_hash;
      return copy;
    });
    res.json(safeUsers);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving users.' });
  }
});

// Update User Status (Approve Farmer, Suspend, Activate)
router.patch('/users/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'pending', 'suspended'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const updated = await UserModel.findByIdAndUpdate(req.params.id, { status });
    if (!updated) return res.status(404).json({ message: 'User not found.' });

    const safeUser = { ...updated };
    delete safeUser.password_hash;
    res.json({ message: `User status changed to ${status}`, user: safeUser });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user status.' });
  }
});

// Content Moderation: Products
router.get('/content/products', async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving products for moderation.' });
  }
});

router.delete('/content/products/:id', async (req, res) => {
  try {
    const removed = await ProductModel.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Product removed by admin moderation.' });
  } catch (err) {
    res.status(500).json({ message: 'Error moderating product.' });
  }
});

// Content Moderation: Reviews
router.get('/content/reviews', async (req, res) => {
  try {
    const reviews = await ReviewModel.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving reviews for moderation.' });
  }
});

router.delete('/content/reviews/:id', async (req, res) => {
  try {
    const removed = await ReviewModel.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Review not found.' });
    res.json({ message: 'Review removed by admin moderation.' });
  } catch (err) {
    res.status(500).json({ message: 'Error moderating review.' });
  }
});

// Master Data: Categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving categories.' });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const { name, description, icon, color, badgeText } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required.' });

    const newCat = await CategoryModel.create({
      name,
      description: description || '',
      icon: icon || 'bi-basket',
      color: color || '#2e7d32',
      badgeText: badgeText || 'Farm Fresh'
    });

    res.status(201).json(newCat);
  } catch (err) {
    res.status(500).json({ message: 'Error creating category.' });
  }
});

// Platform Announcements
router.get('/announcements', async (req, res) => {
  try {
    const list = await AnnouncementModel.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving announcements.' });
  }
});

router.post('/announcements', async (req, res) => {
  try {
    const { title, message, type, audience } = req.body;
    if (!title || !message) return res.status(400).json({ message: 'Title and message are required.' });

    const newAnn = await AnnouncementModel.create({
      title,
      message,
      type: type || 'info',
      audience: audience || 'all',
      active: true
    });

    res.status(201).json(newAnn);
  } catch (err) {
    res.status(500).json({ message: 'Error creating announcement.' });
  }
});

router.delete('/announcements/:id', async (req, res) => {
  try {
    await AnnouncementModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting announcement.' });
  }
});

module.exports = router;
