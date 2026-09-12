require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Insight = require('../models/Insight');

async function runSeed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/blackcoffer';
  console.log(`Connecting to MongoDB at: ${uri}`);

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB successfully.');

    const dataPath = path.join(__dirname, '../data/jsondata.json');
    if (!fs.existsSync(dataPath)) {
      throw new Error(`Data file not found at: ${dataPath}`);
    }

    const raw = fs.readFileSync(dataPath, 'utf8');
    const json = JSON.parse(raw);

    console.log(`Clearing existing records...`);
    await Insight.deleteMany({});

    console.log(`Sanitizing and inserting ${json.length} records...`);
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

    const inserted = await Insight.insertMany(sanitized);
    console.log(`Successfully seeded ${inserted.length} records into database.`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

runSeed();
