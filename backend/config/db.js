const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Insight = require('../models/Insight');

let mongod = null;

async function seedInitialData() {
  try {
    const count = await Insight.countDocuments();
    if (count === 0) {
      console.log('Database empty. Reading jsondata.json to seed records...');
      const dataPath = path.join(__dirname, '../data/jsondata.json');
      if (fs.existsSync(dataPath)) {
        const raw = fs.readFileSync(dataPath, 'utf8');
        const json = JSON.parse(raw);
        
        const sanitized = json.map(item => ({
          end_year: item.end_year ? String(item.end_year).trim() : '',
          intensity: typeof item.intensity === 'number' ? item.intensity : Number(item.intensity) || 0,
          sector: item.sector ? String(item.sector).trim() : '',
          topic: item.topic ? String(item.topic).trim() : '',
          insight: item.insight ? String(item.insight).trim() : '',
          url: item.url ? String(item.url).trim() : '',
          region: item.region ? String(item.region).trim() : '',
          start_year: item.start_year ? String(item.start_year).trim() : '',
          impact: item.impact ? String(item.impact).trim() : '',
          added: item.added ? String(item.added).trim() : '',
          published: item.published ? String(item.published).trim() : '',
          country: item.country ? String(item.country).trim() : '',
          relevance: typeof item.relevance === 'number' ? item.relevance : Number(item.relevance) || 0,
          pestle: item.pestle ? String(item.pestle).trim() : '',
          source: item.source ? String(item.source).trim() : '',
          title: item.title ? String(item.title).trim() : '',
          likelihood: typeof item.likelihood === 'number' ? item.likelihood : Number(item.likelihood) || 0,
          city: item.city ? String(item.city).trim() : ''
        }));

        await Insight.insertMany(sanitized);
        console.log(`Successfully seeded ${sanitized.length} records into MongoDB!`);
      } else {
        console.warn(`Data file not found at ${dataPath}`);
      }
    } else {
      console.log(`Database already populated with ${count} records.`);
    }
  } catch (err) {
    console.error('Error during data seeding:', err.message);
  }
}

async function connectDB() {
  let uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      console.log(`Attempting to connect to provided MongoDB URI: ${uri}`);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log('MongoDB Connected to external instance!');
      await seedInitialData();
      return;
    } catch (err) {
      console.warn(`Could not connect to external MongoDB: ${err.message}. Falling back to embedded MongoDB.`);
    }
  }

  // Fallback to in-memory embedded MongoDB
  try {
    console.log('Starting embedded in-memory MongoDB server...');
    mongod = await MongoMemoryServer.create();
    const memUri = mongod.getUri();
    await mongoose.connect(memUri);
    console.log(`MongoDB Connected successfully to embedded instance at: ${memUri}`);
    await seedInitialData();
  } catch (err) {
    console.error('Fatal error starting MongoDB:', err);
    process.exit(1);
  }
}

module.exports = { connectDB, seedInitialData };
