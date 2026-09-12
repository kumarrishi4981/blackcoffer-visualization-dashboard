const mongoose = require('mongoose');
const Insight = require('../models/Insight');
const memoryFallback = require('./memoryFallback');

/**
 * Builds MongoDB query object based on query parameters.
 */
function buildFilterQuery(queryParams) {
  const filter = {};

  if (queryParams.end_year) {
    const years = queryParams.end_year.split(',').map(y => y.trim()).filter(Boolean);
    if (years.length > 0) {
      filter.end_year = { $in: years };
    }
  }

  if (queryParams.topic) {
    const topics = queryParams.topic.split(',').map(t => t.trim()).filter(Boolean);
    if (topics.length > 0) {
      filter.topic = { $in: topics.map(t => new RegExp(`^${t}$`, 'i')) };
    }
  }

  if (queryParams.sector) {
    const sectors = queryParams.sector.split(',').map(s => s.trim()).filter(Boolean);
    if (sectors.length > 0) {
      filter.sector = { $in: sectors.map(s => new RegExp(`^${s}$`, 'i')) };
    }
  }

  if (queryParams.region) {
    const regions = queryParams.region.split(',').map(r => r.trim()).filter(Boolean);
    if (regions.length > 0) {
      filter.region = { $in: regions.map(r => new RegExp(`^${r}$`, 'i')) };
    }
  }

  if (queryParams.pestle) {
    const pestles = queryParams.pestle.split(',').map(p => p.trim()).filter(Boolean);
    if (pestles.length > 0) {
      filter.pestle = { $in: pestles.map(p => new RegExp(`^${p}$`, 'i')) };
    }
  }

  if (queryParams.source) {
    const sources = queryParams.source.split(',').map(s => s.trim()).filter(Boolean);
    if (sources.length > 0) {
      filter.source = { $in: sources.map(s => new RegExp(`^${s}$`, 'i')) };
    }
  }

  if (queryParams.country) {
    const countries = queryParams.country.split(',').map(c => c.trim()).filter(Boolean);
    if (countries.length > 0) {
      filter.country = { $in: countries.map(c => new RegExp(`^${c}$`, 'i')) };
    }
  }

  if (queryParams.city) {
    const cities = queryParams.city.split(',').map(c => c.trim()).filter(Boolean);
    if (cities.length > 0) {
      filter.city = { $in: cities.map(c => new RegExp(`^${c}$`, 'i')) };
    }
  }

  // SWOT / Keyword search
  const keyword = queryParams.search || queryParams.swot;
  if (keyword && keyword.trim() !== '') {
    const regex = new RegExp(keyword.trim(), 'i');
    filter.$or = [
      { title: regex },
      { insight: regex },
      { topic: regex },
      { sector: regex },
      { pestle: regex },
      { source: regex }
    ];
  }

  return filter;
}

// GET /api/data - Paginated and filtered insights list
exports.getInsights = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return memoryFallback.getInsights(req, res);
  }
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || 'added';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;

    const filter = buildFilterQuery(req.query);

    const [total, items] = await Promise.all([
      Insight.countDocuments(filter),
      Insight.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean()
    ]);

    return res.json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      data: items
    });
  } catch (error) {
    console.error('Error in getInsights:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving insights', error: error.message });
  }
};

// GET /api/filters/options - Returns distinct values for dropdown selectors
exports.getFilterOptions = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return memoryFallback.getFilterOptions(req, res);
  }
  try {
    const [end_years, topics, sectors, regions, pestles, sources, countries, cities] = await Promise.all([
      Insight.distinct('end_year', { end_year: { $nin: ['', null] } }),
      Insight.distinct('topic', { topic: { $nin: ['', null] } }),
      Insight.distinct('sector', { sector: { $nin: ['', null] } }),
      Insight.distinct('region', { region: { $nin: ['', null] } }),
      Insight.distinct('pestle', { pestle: { $nin: ['', null] } }),
      Insight.distinct('source', { source: { $nin: ['', null] } }),
      Insight.distinct('country', { country: { $nin: ['', null] } }),
      Insight.distinct('city', { city: { $nin: ['', null] } })
    ]);

    // Natural sort helper
    const sortAlpha = arr => arr.filter(Boolean).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    return res.json({
      success: true,
      data: {
        end_years: sortAlpha(end_years),
        topics: sortAlpha(topics),
        sectors: sortAlpha(sectors),
        regions: sortAlpha(regions),
        pestles: sortAlpha(pestles),
        sources: sortAlpha(sources),
        countries: sortAlpha(countries),
        cities: sortAlpha(cities)
      }
    });
  } catch (error) {
    console.error('Error in getFilterOptions:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving filter options', error: error.message });
  }
};

// GET /api/analytics/kpis - Key summary metrics for filtered dataset
exports.getKpis = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return memoryFallback.getKpis(req, res);
  }
  try {
    const filter = buildFilterQuery(req.query);

    const result = await Insight.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          avgIntensity: { $avg: '$intensity' },
          avgLikelihood: { $avg: '$likelihood' },
          avgRelevance: { $avg: '$relevance' },
          uniqueCountries: { $addToSet: '$country' },
          uniqueSectors: { $addToSet: '$sector' },
          uniqueTopics: { $addToSet: '$topic' }
        }
      }
    ]);

    if (!result || result.length === 0) {
      return res.json({
        success: true,
        data: {
          total: 0,
          avgIntensity: 0,
          avgLikelihood: 0,
          avgRelevance: 0,
          totalCountries: 0,
          totalSectors: 0,
          totalTopics: 0
        }
      });
    }

    const row = result[0];
    return res.json({
      success: true,
      data: {
        total: row.total,
        avgIntensity: Number((row.avgIntensity || 0).toFixed(2)),
        avgLikelihood: Number((row.avgLikelihood || 0).toFixed(2)),
        avgRelevance: Number((row.avgRelevance || 0).toFixed(2)),
        totalCountries: (row.uniqueCountries || []).filter(c => c && c.trim() !== '').length,
        totalSectors: (row.uniqueSectors || []).filter(s => s && s.trim() !== '').length,
        totalTopics: (row.uniqueTopics || []).filter(t => t && t.trim() !== '').length
      }
    });
  } catch (error) {
    console.error('Error in getKpis:', error);
    return res.status(500).json({ success: false, message: 'Server error computing KPIs', error: error.message });
  }
};

// GET /api/analytics/charts - Aggregated chart datasets
exports.getChartsData = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return memoryFallback.getChartsData(req, res);
  }
  try {
    const filter = buildFilterQuery(req.query);

    const [
      scatterData,
      yearlyTrends,
      sectorBreakdown,
      topicBreakdown,
      regionBreakdown,
      pestleBreakdown,
      sourceBreakdown,
      countryBreakdown
    ] = await Promise.all([
      // 1. Intensity vs Likelihood vs Relevance Bubble/Scatter
      Insight.find(filter, {
        intensity: 1,
        likelihood: 1,
        relevance: 1,
        topic: 1,
        title: 1,
        country: 1,
        sector: 1
      })
        .limit(300)
        .lean(),

      // 2. Yearly timeline (end_year)
      Insight.aggregate([
        { $match: { ...filter, end_year: { $nin: ['', null] } } },
        {
          $group: {
            _id: '$end_year',
            avgIntensity: { $avg: '$intensity' },
            avgLikelihood: { $avg: '$likelihood' },
            avgRelevance: { $avg: '$relevance' },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      // 3. Sectors (Top 10)
      Insight.aggregate([
        { $match: { ...filter, sector: { $nin: ['', null] } } },
        {
          $group: {
            _id: '$sector',
            count: { $sum: 1 },
            avgIntensity: { $avg: '$intensity' },
            avgLikelihood: { $avg: '$likelihood' }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),

      // 4. Topics (Top 10)
      Insight.aggregate([
        { $match: { ...filter, topic: { $nin: ['', null] } } },
        {
          $group: {
            _id: '$topic',
            count: { $sum: 1 },
            avgIntensity: { $avg: '$intensity' },
            avgRelevance: { $avg: '$relevance' }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),

      // 5. Regions
      Insight.aggregate([
        { $match: { ...filter, region: { $nin: ['', null] } } },
        {
          $group: {
            _id: '$region',
            count: { $sum: 1 },
            avgIntensity: { $avg: '$intensity' }
          }
        },
        { $sort: { count: -1 } }
      ]),

      // 6. PESTLE Factors
      Insight.aggregate([
        { $match: { ...filter, pestle: { $nin: ['', null] } } },
        {
          $group: {
            _id: '$pestle',
            count: { $sum: 1 },
            avgIntensity: { $avg: '$intensity' },
            avgLikelihood: { $avg: '$likelihood' },
            avgRelevance: { $avg: '$relevance' }
          }
        },
        { $sort: { count: -1 } }
      ]),

      // 7. Top Sources (Top 10)
      Insight.aggregate([
        { $match: { ...filter, source: { $nin: ['', null] } } },
        {
          $group: {
            _id: '$source',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),

      // 8. Countries (Top 12)
      Insight.aggregate([
        { $match: { ...filter, country: { $nin: ['', null] } } },
        {
          $group: {
            _id: '$country',
            count: { $sum: 1 },
            avgIntensity: { $avg: '$intensity' }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 12 }
      ])
    ]);

    return res.json({
      success: true,
      data: {
        scatter: scatterData.map(item => ({
          x: item.likelihood || 0,
          y: item.intensity || 0,
          r: Math.max(4, Math.min(22, (item.relevance || 1) * 3.5)), // Bubble radius based on relevance
          relevance: item.relevance || 0,
          topic: item.topic || 'General',
          title: item.title,
          country: item.country || 'Global',
          sector: item.sector || 'Uncategorized'
        })),
        yearlyTrends: yearlyTrends.map(y => ({
          year: y._id,
          avgIntensity: Number((y.avgIntensity || 0).toFixed(1)),
          avgLikelihood: Number((y.avgLikelihood || 0).toFixed(1)),
          avgRelevance: Number((y.avgRelevance || 0).toFixed(1)),
          count: y.count
        })),
        sectors: sectorBreakdown.map(s => ({
          sector: s._id,
          count: s.count,
          avgIntensity: Number((s.avgIntensity || 0).toFixed(1)),
          avgLikelihood: Number((s.avgLikelihood || 0).toFixed(1))
        })),
        topics: topicBreakdown.map(t => ({
          topic: t._id,
          count: t.count,
          avgIntensity: Number((t.avgIntensity || 0).toFixed(1)),
          avgRelevance: Number((t.avgRelevance || 0).toFixed(1))
        })),
        regions: regionBreakdown.map(r => ({
          region: r._id,
          count: r.count,
          avgIntensity: Number((r.avgIntensity || 0).toFixed(1))
        })),
        pestle: pestleBreakdown.map(p => ({
          factor: p._id,
          count: p.count,
          avgIntensity: Number((p.avgIntensity || 0).toFixed(1)),
          avgLikelihood: Number((p.avgLikelihood || 0).toFixed(1)),
          avgRelevance: Number((p.avgRelevance || 0).toFixed(1))
        })),
        sources: sourceBreakdown.map(s => ({
          source: s._id,
          count: s.count
        })),
        countries: countryBreakdown.map(c => ({
          country: c._id,
          count: c.count,
          avgIntensity: Number((c.avgIntensity || 0).toFixed(1))
        }))
      }
    });
  } catch (error) {
    console.error('Error in getChartsData:', error);
    return res.status(500).json({ success: false, message: 'Server error aggregating charts', error: error.message });
  }
};
