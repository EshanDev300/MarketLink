const mongoose = require('mongoose');
const { isMongo, getStore } = require('../db/connection');

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, required: true },
  quantity: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  image: { type: String, default: '' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  farmerId: { type: String, required: true },
  farmerName: { type: String, required: true },
  stallName: { type: String, default: '' },
  marketId: { type: String, default: '' },
  marketName: { type: String, default: '' },
  items: [orderItemSchema],
  total_amount: { type: Number, required: true },
  order_status: { 
    type: String, 
    enum: ['placed', 'accepted', 'ready_for_pickup', 'completed', 'cancelled'], 
    default: 'placed' 
  },
  pickupDate: { type: String, required: true },
  pickupTimeSlot: { type: String, required: true },
  cutoffTime: { type: String, default: '' },
  specialInstructions: { type: String, default: '' },
  paymentStatus: { type: String, default: 'Pay In-Person at Pickup (Cash/Card/UPI)' },
  cancellationReason: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const MongooseOrder = mongoose.models.Order || mongoose.model('Order', orderSchema);

const OrderModel = {
  find: (query) => isMongo() ? MongooseOrder.find(query).sort({ createdAt: -1 }).lean() : getStore('Order').find(query),
  findOne: (query) => isMongo() ? MongooseOrder.findOne(query).lean() : getStore('Order').findOne(query),
  findById: (id) => isMongo() ? MongooseOrder.findById(id).lean() : getStore('Order').findById(id),
  create: (doc) => isMongo() ? MongooseOrder.create(doc) : getStore('Order').create(doc),
  insertMany: (docs) => isMongo() ? MongooseOrder.insertMany(docs) : getStore('Order').insertMany(docs),
  findByIdAndUpdate: (id, update, opt) => isMongo() ? MongooseOrder.findByIdAndUpdate(id, update, opt || { new: true }).lean() : getStore('Order').findByIdAndUpdate(id, update, opt),
  findByIdAndDelete: (id) => isMongo() ? MongooseOrder.findByIdAndDelete(id).lean() : getStore('Order').findByIdAndDelete(id),
  countDocuments: (query) => isMongo() ? MongooseOrder.countDocuments(query) : getStore('Order').countDocuments(query),
  schema: orderSchema
};

module.exports = OrderModel;
