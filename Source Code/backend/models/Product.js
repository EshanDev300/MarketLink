const mongoose = require('mongoose');
const { isMongo, getStore } = require('../db/connection');

const productSchema = new mongoose.Schema({
  farmerId: { type: String, required: true },
  farmerName: { type: String, required: true },
  stallName: { type: String, default: '' },
  marketId: { type: String, default: '' },
  marketName: { type: String, default: '' },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  category: { 
    type: String, 
    required: true,
    enum: ['Vegetables', 'Fruits', 'Dairy & Eggs', 'Bakery', 'Honey & Preserves', 'Herbs & Greens', 'Specialty']
  },
  price: { type: Number, required: true },
  unit: { type: String, required: true, default: 'kg' }, // kg, lb, bunch, dozen, pack, basket, jar
  stock_quantity: { type: Number, required: true, default: 0 },
  image: { type: String, default: '' },
  isSoldOut: { type: Boolean, default: false },
  isRecurringTemplate: { type: Boolean, default: false },
  harvestDay: { type: String, default: 'Friday' },
  ratingAverage: { type: Number, default: 5.0 },
  reviewsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const MongooseProduct = mongoose.models.Product || mongoose.model('Product', productSchema);

const ProductModel = {
  find: (query) => isMongo() ? MongooseProduct.find(query).lean() : getStore('Product').find(query),
  findOne: (query) => isMongo() ? MongooseProduct.findOne(query).lean() : getStore('Product').findOne(query),
  findById: (id) => isMongo() ? MongooseProduct.findById(id).lean() : getStore('Product').findById(id),
  create: (doc) => isMongo() ? MongooseProduct.create(doc) : getStore('Product').create(doc),
  insertMany: (docs) => isMongo() ? MongooseProduct.insertMany(docs) : getStore('Product').insertMany(docs),
  findByIdAndUpdate: (id, update, opt) => isMongo() ? MongooseProduct.findByIdAndUpdate(id, update, opt || { new: true }).lean() : getStore('Product').findByIdAndUpdate(id, update, opt),
  findByIdAndDelete: (id) => isMongo() ? MongooseProduct.findByIdAndDelete(id).lean() : getStore('Product').findByIdAndDelete(id),
  countDocuments: (query) => isMongo() ? MongooseProduct.countDocuments(query) : getStore('Product').countDocuments(query),
  schema: productSchema
};

module.exports = ProductModel;
