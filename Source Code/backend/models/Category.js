const mongoose = require('mongoose');
const { isMongo, getStore } = require('../db/connection');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  icon: { type: String, default: 'bi-basket' },
  color: { type: String, default: '#2e7d32' },
  badgeText: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const MongooseCategory = mongoose.models.Category || mongoose.model('Category', categorySchema);

const CategoryModel = {
  find: (query) => isMongo() ? MongooseCategory.find(query).lean() : getStore('Category').find(query),
  findOne: (query) => isMongo() ? MongooseCategory.findOne(query).lean() : getStore('Category').findOne(query),
  findById: (id) => isMongo() ? MongooseCategory.findById(id).lean() : getStore('Category').findById(id),
  create: (doc) => isMongo() ? MongooseCategory.create(doc) : getStore('Category').create(doc),
  insertMany: (docs) => isMongo() ? MongooseCategory.insertMany(docs) : getStore('Category').insertMany(docs),
  findByIdAndUpdate: (id, update, opt) => isMongo() ? MongooseCategory.findByIdAndUpdate(id, update, opt || { new: true }).lean() : getStore('Category').findByIdAndUpdate(id, update, opt),
  findByIdAndDelete: (id) => isMongo() ? MongooseCategory.findByIdAndDelete(id).lean() : getStore('Category').findByIdAndDelete(id),
  countDocuments: (query) => isMongo() ? MongooseCategory.countDocuments(query) : getStore('Category').countDocuments(query),
  schema: categorySchema
};

module.exports = CategoryModel;
