import React, { useState } from 'react';
import './chartSetup';
import { Bar } from 'react-chartjs-2';

export default function SourceBarChart({ sources = [], countries = [], darkMode }) {
  const [mode, setMode] = useState('sources'); // 'sources' | 'countries'

  const activeList = mode === 'sources' ? sources : countries;
  const labels = activeList.map(item => (mode === 'sources' ? item.source : item.country));
  const counts = activeList.map(item => item.count);

  const data = {
    labels,
    datasets: [
      {
        label: mode === 'sources' ? 'Source Citation Count' : 'Country Insights Count',
        data: counts,
        backgroundColor: darkMode ? '#818cf8' : '#6366f1',
        borderRadius: 6,
      }
    ]
  };

  const options = {
    indexAxis: 'y', // Horizontal bars for clean text labeling
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        padding: 10,
        backgroundColor: darkMode ? '#1e293b' : '#0f172a',
        titleFont: { size: 11, weight: 'bold' },
        bodyFont: { size: 11 },
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: {
          color: darkMode ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)'
        },
        ticks: {
          color: darkMode ? '#94a3b8' : '#64748b',
          font: { size: 10 }
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          color: darkMode ? '#94a3b8' : '#64748b',
          font: { size: 10 }
        }
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {mode === 'sources' ? 'Top Intelligence Sources' : 'Top Countries Ranked'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Publication authority and territorial breakdown.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setMode('sources')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
              mode === 'sources'
                ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Sources
          </button>
          <button
            onClick={() => setMode('countries')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
              mode === 'countries'
                ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Countries
          </button>
        </div>
      </div>

      <div className="h-72 w-full">
        {activeList.length > 0 ? (
          <Bar data={data} options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            No data available
          </div>
        )}
      </div>
    </div>
  );
}
