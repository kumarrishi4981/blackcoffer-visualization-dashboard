import React, { useState } from 'react';
import { 
  Filter, 
  RotateCcw, 
  Calendar, 
  Tag, 
  Briefcase, 
  Globe, 
  ShieldAlert, 
  FileText, 
  MapPin,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function FilterBar({ 
  filters, 
  setFilters, 
  filterOptions = {}, 
  onResetFilters,
  activeCount
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearSingleFilter = (key) => {
    setFilters(prev => ({
      ...prev,
      [key]: ''
    }));
  };

  const filterFields = [
    {
      key: 'end_year',
      label: 'End Year',
      icon: Calendar,
      options: filterOptions.end_years || [],
      placeholder: 'All Years'
    },
    {
      key: 'topic',
      label: 'Topic',
      icon: Tag,
      options: filterOptions.topics || [],
      placeholder: 'All Topics'
    },
    {
      key: 'sector',
      label: 'Sector',
      icon: Briefcase,
      options: filterOptions.sectors || [],
      placeholder: 'All Sectors'
    },
    {
      key: 'region',
      label: 'Region',
      icon: Globe,
      options: filterOptions.regions || [],
      placeholder: 'All Regions'
    },
    {
      key: 'pestle',
      label: 'PESTLE',
      icon: ShieldAlert,
      options: filterOptions.pestles || [],
      placeholder: 'All Factors'
    },
    {
      key: 'source',
      label: 'Source',
      icon: FileText,
      options: filterOptions.sources || [],
      placeholder: 'All Sources'
    },
    {
      key: 'country',
      label: 'Country',
      icon: MapPin,
      options: filterOptions.countries || [],
      placeholder: 'All Countries'
    },
    {
      key: 'city',
      label: 'City',
      icon: MapPin,
      options: filterOptions.cities || [],
      placeholder: 'All Cities'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400">
            <Filter className="w-4 h-4" />
          </div>
          <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
            Assignment Filters
          </span>
          {activeCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary-600 text-white font-medium">
              {activeCount} active
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {activeCount > 0 && (
            <button
              onClick={onResetFilters}
              className="flex items-center space-x-1 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 font-medium px-2 py-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Filter Inputs Grid */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3.5 pt-4">
          {filterFields.map((field) => {
            const Icon = field.icon;
            const activeValue = filters[field.key] || '';

            return (
              <div key={field.key} className="relative">
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-between">
                  <span className="flex items-center space-x-1">
                    <Icon className="w-3 h-3 text-slate-400" />
                    <span>{field.label}</span>
                  </span>
                  {activeValue && (
                    <button
                      onClick={() => clearSingleFilter(field.key)}
                      className="text-[10px] text-primary-500 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </label>
                <div className="relative">
                  <select
                    value={activeValue}
                    onChange={(e) => handleFilterChange(field.key, e.target.value)}
                    className={`w-full text-xs py-2 pl-3 pr-8 rounded-xl bg-slate-50 dark:bg-slate-800 border transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-800 dark:text-slate-200 ${
                      activeValue 
                        ? 'border-primary-400 dark:border-primary-600 font-medium bg-primary-50/20 dark:bg-primary-950/20' 
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <option value="">{field.placeholder}</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Active Filter Tags */}
      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-medium mr-1">Active filters:</span>
          {Object.entries(filters).map(([k, v]) => {
            if (!v) return null;
            return (
              <span
                key={k}
                className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
              >
                <span className="capitalize">{k.replace('_', ' ')}:</span>
                <span className="font-semibold">{v}</span>
                <button
                  onClick={() => clearSingleFilter(k)}
                  className="hover:text-rose-600 ml-1 font-bold text-xs"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
