import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import FilterBar from './components/FilterBar';
import KpiCards from './components/KpiCards';
import BubbleMatrixChart from './components/charts/BubbleMatrixChart';
import TrendsLineChart from './components/charts/TrendsLineChart';
import SectorBarChart from './components/charts/SectorBarChart';
import PestleRadarChart from './components/charts/PestleRadarChart';
import RegionDoughnutChart from './components/charts/RegionDoughnutChart';
import SourceBarChart from './components/charts/SourceBarChart';
import DataTable from './components/DataTable';
import DetailModal from './components/DetailModal';
import { 
  fetchFilterOptions, 
  fetchKpis, 
  fetchChartsData, 
  fetchInsights 
} from './services/api';

const initialFilters = {
  end_year: '',
  topic: '',
  sector: '',
  region: '',
  pestle: '',
  source: '',
  country: '',
  city: '',
  search: ''
};

export default function App() {
  // Dark mode
  const [darkMode, setDarkMode] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Active section tab
  const [activeTab, setActiveTab] = useState('overview');

  // Search input & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [filterOptions, setFilterOptions] = useState({});

  // Data States
  const [kpis, setKpis] = useState({});
  const [chartsData, setChartsData] = useState({
    scatter: [],
    yearlyTrends: [],
    sectors: [],
    topics: [],
    regions: [],
    pestle: [],
    sources: [],
    countries: []
  });
  const [insights, setInsights] = useState([]);
  const [totalInsights, setTotalInsights] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('added');
  const [order, setOrder] = useState('desc');

  // Selected Insight for Modal
  const [selectedInsight, setSelectedInsight] = useState(null);

  // Loading States
  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(true);

  // Debounce search term into filters.search
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Load distinct filter options on mount
  useEffect(() => {
    async function loadOptions() {
      try {
        setOptionsLoading(true);
        const res = await fetchFilterOptions();
        if (res.success) {
          setFilterOptions(res.data);
        }
      } catch (err) {
        console.error('Failed to load filter options:', err);
      } finally {
        setOptionsLoading(false);
      }
    }
    loadOptions();
  }, []);

  // Compute active filters count
  const activeFilterCount = useMemo(() => {
    return Object.entries(filters).filter(([k, v]) => v && v.trim() !== '').length;
  }, [filters]);

  // Reset all filters
  const handleResetFilters = useCallback(() => {
    setFilters(initialFilters);
    setSearchTerm('');
    setPage(1);
  }, []);

  // Clean params helper
  const cleanParams = useMemo(() => {
    const params = {};
    for (const key in filters) {
      if (filters[key] && filters[key].trim() !== '') {
        params[key] = filters[key].trim();
      }
    }
    return params;
  }, [filters]);

  // Fetch KPIs & Charts when filters change
  useEffect(() => {
    let isCancelled = false;
    async function loadAnalytics() {
      setLoading(true);
      try {
        const [kpiRes, chartsRes] = await Promise.all([
          fetchKpis(cleanParams),
          fetchChartsData(cleanParams)
        ]);

        if (!isCancelled) {
          if (kpiRes.success) setKpis(kpiRes.data);
          if (chartsRes.success) setChartsData(chartsRes.data);
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadAnalytics();
    return () => {
      isCancelled = true;
    };
  }, [cleanParams]);

  // Fetch paginated table data
  useEffect(() => {
    let isCancelled = false;
    async function loadTable() {
      try {
        const res = await fetchInsights({
          ...cleanParams,
          page,
          limit,
          sortBy,
          order
        });

        if (!isCancelled && res.success) {
          setInsights(res.data);
          setTotalInsights(res.total);
        }
      } catch (err) {
        console.error('Error fetching insights table:', err);
      }
    }

    loadTable();
    return () => {
      isCancelled = true;
    };
  }, [cleanParams, page, limit, sortBy, order]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* Top Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onResetFilters={handleResetFilters}
        activeFilterCount={activeFilterCount}
        totalRecords={totalInsights}
        loading={loading}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          counts={{ total: totalInsights }}
        />

        {/* Dashboard Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Global Filter Bar */}
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            filterOptions={filterOptions}
            onResetFilters={handleResetFilters}
            activeCount={activeFilterCount}
          />

          {/* Section: Executive KPI Cards */}
          <section id="overview">
            <KpiCards kpis={kpis} loading={loading} />
          </section>

          {/* Section: Visual Analytics (Bubble Matrix & Yearly Trends) */}
          <section id="charts" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BubbleMatrixChart 
              scatterData={chartsData.scatter} 
              darkMode={darkMode} 
            />
            <TrendsLineChart 
              trends={chartsData.yearlyTrends} 
              darkMode={darkMode} 
            />
          </section>

          {/* Section: Sectors & PESTLE Framework */}
          <section id="sectors" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SectorBarChart 
              sectors={chartsData.sectors} 
              topics={chartsData.topics} 
              darkMode={darkMode} 
            />
            <PestleRadarChart 
              pestleData={chartsData.pestle} 
              darkMode={darkMode} 
            />
          </section>

          {/* Section: Geographic & Sources Distribution */}
          <section id="geo" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RegionDoughnutChart 
              regions={chartsData.regions} 
              darkMode={darkMode} 
            />
            <SourceBarChart 
              sources={chartsData.sources} 
              countries={chartsData.countries} 
              darkMode={darkMode} 
            />
          </section>

          {/* Section: Full Data Explorer Table */}
          <section id="table">
            <DataTable
              insights={insights}
              total={totalInsights}
              page={page}
              limit={limit}
              setPage={setPage}
              sortBy={sortBy}
              setSortBy={setSortBy}
              order={order}
              setOrder={setOrder}
              onSelectInsight={(item) => setSelectedInsight(item)}
              loading={loading}
            />
          </section>

          {/* Footer note */}
          <footer className="pt-8 pb-4 text-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800/80">
            <p>
              Blackcoffer Visualization Dashboard Test Assignment • Built with MongoDB, Express, React & Chart.js
            </p>
          </footer>
        </main>
      </div>

      {/* Insight Details Modal */}
      <DetailModal
        insight={selectedInsight}
        onClose={() => setSelectedInsight(null)}
      />
    </div>
  );
}
