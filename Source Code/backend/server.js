const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const { connectDB, isMongo, readDbFile, writeDbFile } = require('./db/connection');
const { 
  seedUsers, 
  seedMarkets, 
  seedCategories, 
  seedProducts, 
  seedOrders, 
  seedReviews, 
  seedAnnouncements 
} = require('./data/seedData');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Seed initialization
async function autoSeedDatabase() {
  const currentDb = readDbFile();
  let needsSave = false;

  if (!currentDb.users || currentDb.users.length === 0) {
    currentDb.users = seedUsers;
    needsSave = true;
  }
  if (!currentDb.markets || currentDb.markets.length === 0) {
    currentDb.markets = seedMarkets;
    needsSave = true;
  }
  if (!currentDb.categories || currentDb.categories.length === 0) {
    currentDb.categories = seedCategories;
    needsSave = true;
  }
  if (!currentDb.products || currentDb.products.length === 0) {
    currentDb.products = seedProducts;
    needsSave = true;
  }
  if (!currentDb.orders || currentDb.orders.length === 0) {
    currentDb.orders = seedOrders;
    needsSave = true;
  }
  if (!currentDb.reviews || currentDb.reviews.length === 0) {
    currentDb.reviews = seedReviews;
    needsSave = true;
  }
  if (!currentDb.announcements || currentDb.announcements.length === 0) {
    currentDb.announcements = seedAnnouncements;
    needsSave = true;
  }

  if (needsSave) {
    writeDbFile(currentDb);
    console.log('🌱 Seed database loaded with complete TechWiz test data!');
  }
}

// REST API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/markets', require('./routes/markets'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/notifications', require('./routes/notifications'));

// System Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    project: 'MarketLink - Farm Fresh Just a Click Away',
    theme: 'eGreen Basket',
    databaseMode: isMongo() ? 'MongoDB Native' : 'JSON Persistent Memory Engine',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend build if available
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Start Server
async function startServer() {
  await connectDB();
  await autoSeedDatabase();

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 MarketLink Server running on: http://localhost:${PORT}`);
    console.log(`🌱 Theme: eGreen Basket | Aptech TechWiz Specification`);
    console.log(`=======================================================`);
  });
}

if (!process.env.VERCEL) {
  startServer();
} else {
  connectDB();
  autoSeedDatabase();
}

module.exports = app;
