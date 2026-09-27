const mongoose = require('mongoose');
const { isMongo, getStore } = require('../db/connection');

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['order', 'restock', 'system', 'approval'], default: 'order' },
  read: { type: Boolean, default: false },
  link: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const MongooseNotification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

const NotificationModel = {
  find: (query) => isMongo() ? MongooseNotification.find(query).sort({ createdAt: -1 }).lean() : getStore('Notification').find(query),
  findOne: (query) => isMongo() ? MongooseNotification.findOne(query).lean() : getStore('Notification').findOne(query),
  findById: (id) => isMongo() ? MongooseNotification.findById(id).lean() : getStore('Notification').findById(id),
  create: (doc) => isMongo() ? MongooseNotification.create(doc) : getStore('Notification').create(doc),
  insertMany: (docs) => isMongo() ? MongooseNotification.insertMany(docs) : getStore('Notification').insertMany(docs),
  findByIdAndUpdate: (id, update, opt) => isMongo() ? MongooseNotification.findByIdAndUpdate(id, update, opt || { new: true }).lean() : getStore('Notification').findByIdAndUpdate(id, update, opt),
  findByIdAndDelete: (id) => isMongo() ? MongooseNotification.findByIdAndDelete(id).lean() : getStore('Notification').findByIdAndDelete(id),
  countDocuments: (query) => isMongo() ? MongooseNotification.countDocuments(query) : getStore('Notification').countDocuments(query),
  schema: notificationSchema
};

module.exports = NotificationModel;
