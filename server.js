// server.js
import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
const MONGO_URI = 'mongodb://127.0.0.1:27017'; // MongoDB URI
const DB_NAME = 'orbitron';
const COLLECTION_NAME = 'satellites';

let collection;

// Connect to MongoDB
const client = new MongoClient(MONGO_URI);
try {
  await client.connect();
  console.log('✅ MongoDB connected successfully');
  const db = client.db(DB_NAME);
  collection = db.collection(COLLECTION_NAME);
} catch (err) {
  console.error('❌ MongoDB connection failed:', err);
}

// API endpoint to get all satellites
app.get('/api/satellites', async (req, res) => {
  try {
    if (!collection) {
      return res.status(500).json({ error: 'MongoDB not connected' });
    }
    const satellites = await collection.find({}).toArray();
    res.json(satellites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch satellites' });
  }
});

// Simple health check
app.get('/api/health', (req, res) => {
  if (collection) {
    res.json({ status: 'MongoDB running ✅' });
  } else {
    res.status(500).json({ status: 'MongoDB not connected ❌' });
  }
});

app.listen(PORT, () => {
  console.log(`🌐 Server running at http://localhost:${PORT}`);
});
