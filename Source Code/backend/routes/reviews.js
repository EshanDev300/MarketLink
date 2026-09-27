const express = require('express');
const router = express.Router();
const ReviewModel = require('../models/Review');
const ProductModel = require('../models/Product');
const UserModel = require('../models/User');
const { requireAuth, requireRole } = require('../middleware/auth');

// Get Reviews for a Product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await ReviewModel.find({ productId: req.params.productId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving reviews.' });
  }
});

// Get Reviews for a Farmer
router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const reviews = await ReviewModel.find({ farmerId: req.params.farmerId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving reviews.' });
  }
});

// Submit a Review (Customer)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { productId, farmerId, rating, comment } = req.body;

    if (!farmerId || !rating || !comment) {
      return res.status(400).json({ message: 'Farmer ID, rating, and comment are required.' });
    }

    const customer = await UserModel.findById(req.user.id);
    let productName = '';
    let farmerName = '';

    if (productId) {
      const prod = await ProductModel.findById(productId);
      if (prod) productName = prod.name;
    }

    const farmer = await UserModel.findById(farmerId);
    if (farmer) farmerName = farmer.name;

    const newReview = await ReviewModel.create({
      productId: productId || '',
      productName,
      farmerId,
      farmerName,
      customerId: req.user.id,
      customerName: customer ? customer.name : req.user.name,
      rating: parseInt(rating, 10),
      comment
    });

    // Update Product average rating if product specified
    if (productId) {
      const allProductReviews = await ReviewModel.find({ productId });
      const avg = allProductReviews.reduce((sum, r) => sum + r.rating, 0) / allProductReviews.length;
      await ProductModel.findByIdAndUpdate(productId, {
        ratingAverage: parseFloat(avg.toFixed(1)),
        reviewsCount: allProductReviews.length
      });
    }

    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ message: 'Error submitting review.' });
  }
});

// Farmer reply to review
router.patch('/:id/reply', requireAuth, requireRole(['farmer', 'admin']), async (req, res) => {
  try {
    const { reply } = req.body;
    const review = await ReviewModel.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found.' });

    if (req.user.role !== 'admin' && review.farmerId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to reply to this review.' });
    }

    const updated = await ReviewModel.findByIdAndUpdate(req.params.id, {
      farmerReply: reply,
      farmerReplyAt: new Date().toISOString()
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error replying to review.' });
  }
});

module.exports = router;
