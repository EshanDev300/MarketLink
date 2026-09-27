const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isMongoConnected = false;
const ORIGINAL_DATA_FILE = path.join(__dirname, '..', 'data', 'database.json');
const TMP_DATA_FILE = path.join('/tmp', 'database.json');

// In-memory cache to guarantee zero downtime even on read-only environments
let inMemoryDb = null;

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

function getActiveDataFile() {
  if (process.env.VERCEL) {
    if (!fs.existsSync(TMP_DATA_FILE)) {
      try {
        if (fs.existsSync(ORIGINAL_DATA_FILE)) {
          fs.copyFileSync(ORIGINAL_DATA_FILE, TMP_DATA_FILE);
        } else {
          fs.writeFileSync(TMP_DATA_FILE, JSON.stringify(initialData, null, 2));
        }
      } catch (e) {
        console.warn('Notice: Serverless /tmp initialization fallback to memory cache');
      }
    }
    return TMP_DATA_FILE;
  }
  return ORIGINAL_DATA_FILE;
}

function readDbFile() {
  try {
    const dataFile = getActiveDataFile();
    if (!fs.existsSync(dataFile)) {
      if (inMemoryDb) return inMemoryDb;
      if (fs.existsSync(ORIGINAL_DATA_FILE)) {
        const raw = fs.readFileSync(ORIGINAL_DATA_FILE, 'utf8');
        inMemoryDb = JSON.parse(raw);
        return inMemoryDb;
      }
      return initialData;
    }
    const raw = fs.readFileSync(dataFile, 'utf8');
    inMemoryDb = JSON.parse(raw);
    return inMemoryDb;
  } catch (err) {
    if (inMemoryDb) return inMemoryDb;
    console.error('Error reading DB JSON file:', err);
    return initialData;
  }
}

function writeDbFile(data) {
  inMemoryDb = data;
  try {
    const dataFile = getActiveDataFile();
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  } catch (err) {
    // In-memory fallback
    console.warn('File write fallback: data kept in memory');
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
