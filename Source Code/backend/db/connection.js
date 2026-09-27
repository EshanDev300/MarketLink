const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isMongoConnected = false;
const DATA_FILE = path.join(__dirname, '..', 'data', 'database.json');

// Initialize database file if it doesn't exist
const initialData = {
  users: [],
  markets: [],
  products: [],
  orders: [],
  reviews: [],
  categories: [],
  announcements: [],
  notifications: []
};

function readDbFile() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB JSON file:', err);
    return initialData;
  }
}

function writeDbFile(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error saving DB JSON file:', err);
  }
}

// Memory/File-backed Collection Adapter that mirrors basic Mongoose/MongoDB methods
class JsonCollection {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  async find(filter = {}) {
    const data = readDbFile();
    const list = data[this.collectionName] || [];
    return list.filter(item => {
      for (const key of Object.keys(filter)) {
        if (filter[key] !== undefined && filter[key] !== null) {
          if (typeof filter[key] === 'object' && filter[key].$regex) {
            const regex = new RegExp(filter[key].$regex, filter[key].$options || 'i');
            if (!regex.test(item[key] || '')) return false;
          } else if (typeof filter[key] === 'object' && filter[key].$in) {
            if (!filter[key].$in.includes(item[key])) return false;
          } else if (item[key] !== filter[key]) {
            return false;
          }
        }
      }
      return true;
    });
  }

  async findOne(filter = {}) {
    const list = await this.find(filter);
    return list[0] || null;
  }

  async findById(id) {
    const data = readDbFile();
    const list = data[this.collectionName] || [];
    return list.find(item => item._id === id || item.id === id) || null;
  }

  async create(doc) {
    const data = readDbFile();
    const list = data[this.collectionName] || [];
    const newDoc = {
      _id: 'ML_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc
    };
    list.push(newDoc);
    data[this.collectionName] = list;
    writeDbFile(data);
    return newDoc;
  }

  async insertMany(docs) {
    const data = readDbFile();
    const list = data[this.collectionName] || [];
    const createdDocs = docs.map((doc, idx) => ({
      _id: 'ML_' + (Date.now() + idx) + '_' + Math.random().toString(36).substring(2, 8),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc
    }));
    list.push(...createdDocs);
    data[this.collectionName] = list;
    writeDbFile(data);
    return createdDocs;
  }

  async findByIdAndUpdate(id, update, options = { new: true }) {
    const data = readDbFile();
    const list = data[this.collectionName] || [];
    const index = list.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;

    const updatedItem = {
      ...list[index],
      ...update,
      updatedAt: new Date().toISOString()
    };
    list[index] = updatedItem;
    data[this.collectionName] = list;
    writeDbFile(data);
    return updatedItem;
  }

  async findByIdAndDelete(id) {
    const data = readDbFile();
    let list = data[this.collectionName] || [];
    const index = list.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;
    const removed = list.splice(index, 1)[0];
    data[this.collectionName] = list;
    writeDbFile(data);
    return removed;
  }

  async countDocuments(filter = {}) {
    const items = await this.find(filter);
    return items.length;
  }
}

const memoryStore = {
  User: new JsonCollection('users'),
  Market: new JsonCollection('markets'),
  Product: new JsonCollection('products'),
  Order: new JsonCollection('orders'),
  Review: new JsonCollection('reviews'),
  Category: new JsonCollection('categories'),
  Announcement: new JsonCollection('announcements'),
  Notification: new JsonCollection('notifications')
};

async function connectDB() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/marketlink';
  try {
    // Attempt Mongoose connection with 3s timeout
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2500 });
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB at:', mongoUri);
  } catch (err) {
    isMongoConnected = false;
    console.log('ℹ️ MongoDB daemon not active locally. Activated Seamless File/Memory Database Engine.');
    console.log('📁 Data persistent at:', DATA_FILE);
  }
}

module.exports = {
  connectDB,
  isMongo: () => isMongoConnected,
  getStore: (name) => {
    if (!memoryStore[name]) {
      const colName = (name.toLowerCase() + 's');
      memoryStore[name] = new JsonCollection(colName);
    }
    return memoryStore[name];
  },
  readDbFile,
  writeDbFile
};
