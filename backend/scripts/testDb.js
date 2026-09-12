const { connectDB } = require('../config/db');
const Insight = require('../models/Insight');

async function test() {
  console.log('Testing DB boot & seed...');
  try {
    await connectDB();
    const count = await Insight.countDocuments();
    console.log('Total insights in DB:', count);
    const sample = await Insight.findOne({ intensity: { $gt: 0 } }).lean();
    console.log('Sample record loaded:', sample ? { title: sample.title, intensity: sample.intensity, topic: sample.topic, sector: sample.sector } : null);
    console.log('Test completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  }
}

test();
