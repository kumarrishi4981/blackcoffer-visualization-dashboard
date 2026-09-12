const fs = require('fs');
const path = require('path');

let cachedData = null;

function loadData() {
  if (!cachedData) {
    const dataPath = path.join(__dirname, '../data/jsondata.json');
    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, 'utf8');
      const json = JSON.parse(raw);
      cachedData = json.map(item => ({
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
    } else {
      cachedData = [];
    }
  }
  return cachedData;
}

function filterItems(queryParams) {
  const data = loadData();
  const endYears = queryParams.end_year ? queryParams.end_year.split(',').map(y => y.trim().toLowerCase()).filter(Boolean) : null;
  const topics = queryParams.topic ? queryParams.topic.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : null;
  const sectors = queryParams.sector ? queryParams.sector.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) : null;
  const regions = queryParams.region ? queryParams.region.split(',').map(r => r.trim().toLowerCase()).filter(Boolean) : null;
  const pestles = queryParams.pestle ? queryParams.pestle.split(',').map(p => p.trim().toLowerCase()).filter(Boolean) : null;
  const sources = queryParams.source ? queryParams.source.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) : null;
  const countries = queryParams.country ? queryParams.country.split(',').map(c => c.trim().toLowerCase()).filter(Boolean) : null;
  const cities = queryParams.city ? queryParams.city.split(',').map(c => c.trim().toLowerCase()).filter(Boolean) : null;
  const search = (queryParams.search || queryParams.swot || '').trim().toLowerCase();

  return data.filter(item => {
    if (endYears && !endYears.includes(item.end_year.toLowerCase())) return false;
    if (topics && !topics.includes(item.topic.toLowerCase())) return false;
    if (sectors && !sectors.includes(item.sector.toLowerCase())) return false;
    if (regions && !regions.includes(item.region.toLowerCase())) return false;
    if (pestles && !pestles.includes(item.pestle.toLowerCase())) return false;
    if (sources && !sources.includes(item.source.toLowerCase())) return false;
    if (countries && !countries.includes(item.country.toLowerCase())) return false;
    if (cities && !cities.includes(item.city.toLowerCase())) return false;

    if (search) {
      const match = (
        item.title.toLowerCase().includes(search) ||
        item.insight.toLowerCase().includes(search) ||
        item.topic.toLowerCase().includes(search) ||
        item.sector.toLowerCase().includes(search) ||
        item.pestle.toLowerCase().includes(search) ||
        item.source.toLowerCase().includes(search)
      );
      if (!match) return false;
    }

    return true;
  });
}

exports.getInsights = (req, res) => {
  const filtered = filterItems(req.query);
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
  const skip = (page - 1) * limit;

  const sortBy = req.query.sortBy || 'added';
  const sortOrder = req.query.order === 'asc' ? 1 : -1;

  filtered.sort((a, b) => {
    const valA = a[sortBy] ?? '';
    const valB = b[sortBy] ?? '';
    if (typeof valA === 'number' && typeof valB === 'number') {
      return (valA - valB) * sortOrder;
    }
    return String(valA).localeCompare(String(valB), undefined, { numeric: true }) * sortOrder;
  });

  const paged = filtered.slice(skip, skip + limit);

  return res.json({
    success: true,
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit) || 1,
    data: paged
  });
};

exports.getFilterOptions = (req, res) => {
  const data = loadData();
  const getDistinct = (key) => {
    const set = new Set();
    data.forEach(item => {
      if (item[key] && item[key].trim() !== '') set.add(item[key].trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  };

  return res.json({
    success: true,
    data: {
      end_years: getDistinct('end_year'),
      topics: getDistinct('topic'),
      sectors: getDistinct('sector'),
      regions: getDistinct('region'),
      pestles: getDistinct('pestle'),
      sources: getDistinct('source'),
      countries: getDistinct('country'),
      cities: getDistinct('city')
    }
  });
};

exports.getKpis = (req, res) => {
  const filtered = filterItems(req.query);
  if (filtered.length === 0) {
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

  let sumIntensity = 0;
  let sumLikelihood = 0;
  let sumRelevance = 0;
  const countries = new Set();
  const sectors = new Set();
  const topics = new Set();

  filtered.forEach(item => {
    sumIntensity += item.intensity;
    sumLikelihood += item.likelihood;
    sumRelevance += item.relevance;
    if (item.country) countries.add(item.country);
    if (item.sector) sectors.add(item.sector);
    if (item.topic) topics.add(item.topic);
  });

  const count = filtered.length;
  return res.json({
    success: true,
    data: {
      total: count,
      avgIntensity: Number((sumIntensity / count).toFixed(2)),
      avgLikelihood: Number((sumLikelihood / count).toFixed(2)),
      avgRelevance: Number((sumRelevance / count).toFixed(2)),
      totalCountries: countries.size,
      totalSectors: sectors.size,
      totalTopics: topics.size
    }
  });
};

exports.getChartsData = (req, res) => {
  const filtered = filterItems(req.query);

  // 1. Scatter
  const scatter = filtered.slice(0, 300).map(item => ({
    x: item.likelihood || 0,
    y: item.intensity || 0,
    r: Math.max(4, Math.min(22, (item.relevance || 1) * 3.5)),
    relevance: item.relevance || 0,
    topic: item.topic || 'General',
    title: item.title,
    country: item.country || 'Global',
    sector: item.sector || 'Uncategorized'
  }));

  // Helper for grouping
  const groupStats = (key, topN = 0) => {
    const map = {};
    filtered.forEach(item => {
      const val = item[key];
      if (!val) return;
      if (!map[val]) {
        map[val] = { count: 0, sumIntensity: 0, sumLikelihood: 0, sumRelevance: 0 };
      }
      map[val].count++;
      map[val].sumIntensity += item.intensity || 0;
      map[val].sumLikelihood += item.likelihood || 0;
      map[val].sumRelevance += item.relevance || 0;
    });

    let list = Object.keys(map).map(k => ({
      _id: k,
      count: map[k].count,
      avgIntensity: Number((map[k].sumIntensity / map[k].count).toFixed(1)),
      avgLikelihood: Number((map[k].sumLikelihood / map[k].count).toFixed(1)),
      avgRelevance: Number((map[k].sumRelevance / map[k].count).toFixed(1))
    }));

    if (key === 'end_year') {
      list.sort((a, b) => a._id.localeCompare(b._id, undefined, { numeric: true }));
    } else {
      list.sort((a, b) => b.count - a.count);
    }

    if (topN > 0) list = list.slice(0, topN);
    return list;
  };

  const yearlyTrends = groupStats('end_year').map(y => ({
    year: y._id,
    avgIntensity: y.avgIntensity,
    avgLikelihood: y.avgLikelihood,
    avgRelevance: y.avgRelevance,
    count: y.count
  }));

  const sectors = groupStats('sector', 10).map(s => ({
    sector: s._id,
    count: s.count,
    avgIntensity: s.avgIntensity,
    avgLikelihood: s.avgLikelihood
  }));

  const topics = groupStats('topic', 10).map(t => ({
    topic: t._id,
    count: t.count,
    avgIntensity: t.avgIntensity,
    avgRelevance: t.avgRelevance
  }));

  const regions = groupStats('region').map(r => ({
    region: r._id,
    count: r.count,
    avgIntensity: r.avgIntensity
  }));

  const pestle = groupStats('pestle').map(p => ({
    factor: p._id,
    count: p.count,
    avgIntensity: p.avgIntensity,
    avgLikelihood: p.avgLikelihood,
    avgRelevance: p.avgRelevance
  }));

  const sources = groupStats('source', 10).map(s => ({
    source: s._id,
    count: s.count
  }));

  const countries = groupStats('country', 12).map(c => ({
    country: c._id,
    count: c.count,
    avgIntensity: c.avgIntensity
  }));

  return res.json({
    success: true,
    data: {
      scatter,
      yearlyTrends,
      sectors,
      topics,
      regions,
      pestle,
      sources,
      countries
    }
  });
};
