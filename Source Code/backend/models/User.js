const mongoose = require('mongoose');
const { isMongo, getStore } = require('../db/connection');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['customer', 'farmer', 'admin'], default: 'customer' },
  contactNumber: { type: String, default: '' },
  address: { type: String, default: '' },
  status: { type: String, enum: ['active', 'pending', 'suspended'], default: 'active' },
  // Farmer specific fields
  stallName: { type: String, default: '' },
  contactPerson: { type: String, default: '' },
  operatingDays: [{ type: String }],
  pickupTimeWindows: { type: String, default: '8:00 AM - 1:00 PM' },
  orderCutoffHours: { type: Number, default: 4 }, // hours before pickup
  stallLocation: {
    address: { type: String, default: '' },
    latitude: { type: Number, default: 37.7749 },
    longitude: { type: Number, default: -122.4194 }
  },
  marketsSellingAt: [{ type: String }], // Market IDs
  bio: { type: String, default: '' },
  avatar: { type: String, default: '' },
  // Customer specific fields
  favoriteFarmers: [{ type: String }],
  favoriteProducts: [{ type: String }],
  preferredMarkets: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const MongooseUser = mongoose.models.User || mongoose.model('User', userSchema);

const UserModel = {
  find: (query) => isMongo() ? MongooseUser.find(query).lean() : getStore('User').find(query),
  findOne: (query) => isMongo() ? MongooseUser.findOne(query).lean() : getStore('User').findOne(query),
  findById: (id) => isMongo() ? MongooseUser.findById(id).lean() : getStore('User').findById(id),
  create: (doc) => isMongo() ? MongooseUser.create(doc) : getStore('User').create(doc),
  insertMany: (docs) => isMongo() ? MongooseUser.insertMany(docs) : getStore('User').insertMany(docs),
  findByIdAndUpdate: (id, update, opt) => isMongo() ? MongooseUser.findByIdAndUpdate(id, update, opt || { new: true }).lean() : getStore('User').findByIdAndUpdate(id, update, opt),
  findByIdAndDelete: (id) => isMongo() ? MongooseUser.findByIdAndDelete(id).lean() : getStore('User').findByIdAndDelete(id),
  countDocuments: (query) => isMongo() ? MongooseUser.countDocuments(query) : getStore('User').countDocuments(query),
  schema: userSchema
};

module.exports = UserModel;
