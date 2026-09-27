const mongoose = require('mongoose');
const { isMongo, getStore } = require('../db/connection');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'warning', 'success', 'urgent'], default: 'info' },
  audience: { type: String, enum: ['all', 'farmers', 'customers'], default: 'all' },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const MongooseAnnouncement = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);

const AnnouncementModel = {
  find: (query) => isMongo() ? MongooseAnnouncement.find(query).sort({ createdAt: -1 }).lean() : getStore('Announcement').find(query),
  findOne: (query) => isMongo() ? MongooseAnnouncement.findOne(query).lean() : getStore('Announcement').findOne(query),
  findById: (id) => isMongo() ? MongooseAnnouncement.findById(id).lean() : getStore('Announcement').findById(id),
  create: (doc) => isMongo() ? MongooseAnnouncement.create(doc) : getStore('Announcement').create(doc),
  insertMany: (docs) => isMongo() ? MongooseAnnouncement.insertMany(docs) : getStore('Announcement').insertMany(docs),
  findByIdAndUpdate: (id, update, opt) => isMongo() ? MongooseAnnouncement.findByIdAndUpdate(id, update, opt || { new: true }).lean() : getStore('Announcement').findByIdAndUpdate(id, update, opt),
  findByIdAndDelete: (id) => isMongo() ? MongooseAnnouncement.findByIdAndDelete(id).lean() : getStore('Announcement').findByIdAndDelete(id),
  countDocuments: (query) => isMongo() ? MongooseAnnouncement.countDocuments(query) : getStore('Announcement').countDocuments(query),
  schema: announcementSchema
};

module.exports = AnnouncementModel;
