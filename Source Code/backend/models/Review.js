const mongoose = require('mongoose');
const { isMongo, getStore } = require('../db/connection');

const reviewSchema = new mongoose.Schema({
  productId: { type: String, default: '' },
  productName: { type: String, default: '' },
  farmerId: { type: String, required: true },
  farmerName: { type: String, default: '' },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  farmerReply: { type: String, default: '' },
  farmerReplyAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

const MongooseReview = mongoose.models.Review || mongoose.model('Review', reviewSchema);

const ReviewModel = {
  find: (query) => isMongo() ? MongooseReview.find(query).sort({ createdAt: -1 }).lean() : getStore('Review').find(query),
  findOne: (query) => isMongo() ? MongooseReview.findOne(query).lean() : getStore('Review').findOne(query),
  findById: (id) => isMongo() ? MongooseReview.findById(id).lean() : getStore('Review').findById(id),
  create: (doc) => isMongo() ? MongooseReview.create(doc) : getStore('Review').create(doc),
  insertMany: (docs) => isMongo() ? MongooseReview.insertMany(docs) : getStore('Review').insertMany(docs),
  findByIdAndUpdate: (id, update, opt) => isMongo() ? MongooseReview.findByIdAndUpdate(id, update, opt || { new: true }).lean() : getStore('Review').findByIdAndUpdate(id, update, opt),
  findByIdAndDelete: (id) => isMongo() ? MongooseReview.findByIdAndDelete(id).lean() : getStore('Review').findByIdAndDelete(id),
  countDocuments: (query) => isMongo() ? MongooseReview.countDocuments(query) : getStore('Review').countDocuments(query),
  schema: reviewSchema
};

module.exports = ReviewModel;
