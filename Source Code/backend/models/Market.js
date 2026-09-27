const mongoose = require('mongoose');
const { isMongo, getStore } = require('../db/connection');

const marketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, default: 'Green Valley' },
  operatingDays: [{ type: String }], // e.g. ['Wednesday', 'Saturday', 'Sunday']
  timings: { type: String, default: '07:30 AM - 01:30 PM' },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  map_provider: { type: String, default: 'OpenStreetMap' },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  stallCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const MongooseMarket = mongoose.models.Market || mongoose.model('Market', marketSchema);

const MarketModel = {
  find: (query) => isMongo() ? MongooseMarket.find(query).lean() : getStore('Market').find(query),
  findOne: (query) => isMongo() ? MongooseMarket.findOne(query).lean() : getStore('Market').findOne(query),
  findById: (id) => isMongo() ? MongooseMarket.findById(id).lean() : getStore('Market').findById(id),
  create: (doc) => isMongo() ? MongooseMarket.create(doc) : getStore('Market').create(doc),
  insertMany: (docs) => isMongo() ? MongooseMarket.insertMany(docs) : getStore('Market').insertMany(docs),
  findByIdAndUpdate: (id, update, opt) => isMongo() ? MongooseMarket.findByIdAndUpdate(id, update, opt || { new: true }).lean() : getStore('Market').findByIdAndUpdate(id, update, opt),
  findByIdAndDelete: (id) => isMongo() ? MongooseMarket.findByIdAndDelete(id).lean() : getStore('Market').findByIdAndDelete(id),
  countDocuments: (query) => isMongo() ? MongooseMarket.countDocuments(query) : getStore('Market').countDocuments(query),
  schema: marketSchema
};

module.exports = MarketModel;
