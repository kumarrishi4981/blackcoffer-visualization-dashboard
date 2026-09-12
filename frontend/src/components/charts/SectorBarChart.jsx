import React, { useState } from 'react';
import './chartSetup';
import { Bar } from 'react-chartjs-2';

export default function SectorBarChart({ sectors = [], topics = [], darkMode }) {
  const [viewMode, setViewMode] = useState('sectors'); // 'sectors' | 'topics'

  const activeList = viewMode === 'sectors' ? sectors : topics;
  const labels = activeList.map(item => (viewMode === 'sectors' ? item.sector : item.topic));
  const counts = activeList.map(item => item.count);
  const intensities = activeList.map(item => item.avgIntensity);

  const data = {
    labels,
    datasets: [
      {
        label: 'Insight Volume',
        data: counts,
        backgroundColor: darkMode ? '#6366f1' : '#4f46e5',
        borderRadius: 6,
        yAxisID: 'y'
      },
      {
        label: 'Avg Intensity',
        data: intensities,
        backgroundColor: darkMode ? '#38bdf8' : '#0284c7',
        borderRadius: 6,
        yAxisID: 'y1'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: darkMode ? '#cbd5e1' : '#475569',
          font: { size: 11, weight: '500' },
          usePointStyle: true,
          boxWidth: 6
        }
      },
      tooltip: {
        padding: 10,
        backgroundColor: darkMode ? '#1e293b' : '#0f172a',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 11 },
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: darkMode ? '#94a3b8' : '#64748b',
          font: { size: 10 },
          maxRotation: 45,
          minRotation: 25
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Volume',
          color: darkMode ? '#94a3b8' : '#64748b',
          font: { size: 10 }
        },
        grid: {
          color: darkMode ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)'
        },
        ticks: {
          color: darkMode ? '#94a3b8' : '#64748b'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Avg Intensity',
          color: darkMode ? '#38bdf8' : '#0284c7',
          font: { size: 10 }
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: darkMode ? '#94a3b8' : '#64748b'
        }
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {viewMode === 'sectors' ? 'Top Sectors Distribution' : 'Top Topics Distribution'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Concentration of insights and respective impact strength.
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setViewMode('sectors')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
              viewMode === 'sectors'
                ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Sectors
          </button>
          <button
            onClick={() => setViewMode('topics')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
              viewMode === 'topics'
                ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Topics
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
