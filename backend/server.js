require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Root greeting
app.get('/', (req, res) => {
  res.json({
    message: 'Blackcoffer Data Visualization Dashboard API',
    endpoints: {
      health: '/api/health',
      data: '/api/data',
      filters: '/api/filters/options',
      kpis: '/api/analytics/kpis',
      charts: '/api/analytics/charts'
    }
  });
});

// Start server after DB connection
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

startServer();
