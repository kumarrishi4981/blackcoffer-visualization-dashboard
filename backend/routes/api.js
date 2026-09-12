const express = require('express');
const router = express.Router();
const insightController = require('../controllers/insightController');

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Blackcoffer Dashboard API'
  });
});

// Insights list (filtered & paginated)
router.get('/data', insightController.getInsights);

// Filter options (distinct dropdown values)
router.get('/filters/options', insightController.getFilterOptions);

// KPIs summary
router.get('/analytics/kpis', insightController.getKpis);

// Aggregated chart datasets
router.get('/analytics/charts', insightController.getChartsData);

module.exports = router;
