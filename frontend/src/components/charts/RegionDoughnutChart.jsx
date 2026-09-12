import React from 'react';
import './chartSetup';
import { Doughnut } from 'react-chartjs-2';

export default function RegionDoughnutChart({ regions = [], darkMode }) {
  const topRegions = regions.slice(0, 7);
  const labels = topRegions.map(r => r.region);
  const counts = topRegions.map(r => r.count);

  const colors = [
    '#6366f1', // indigo
    '#38bdf8', // sky
    '#34d399', // emerald
    '#f59e0b', // amber
    '#ec4899', // pink
    '#a855f7', // purple
    '#94a3b8'  // slate
  ];

  const data = {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: colors,
        borderColor: darkMode ? '#0f172a' : '#ffffff',
        borderWidth: 2,
        hoverOffset: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: darkMode ? '#cbd5e1' : '#475569',
          font: { size: 10, weight: '500' },
          boxWidth: 8,
          usePointStyle: true
        }
      },
      tooltip: {
        padding: 10,
        backgroundColor: darkMode ? '#1e293b' : '#0f172a',
        titleFont: { size: 11, weight: 'bold' },
        bodyFont: { size: 11 },
        cornerRadius: 8,
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Regional Footprint
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Geographic proportion across top reporting continents and regions.
          </p>
        </div>
      </div>

      <div className="h-72 w-full flex items-center justify-center">
        {topRegions.length > 0 ? (
          <Doughnut data={data} options={options} />
        ) : (
          <div className="text-xs text-slate-400">
            No regional data available
          </div>
        )}
      </div>
    </div>
  );
}
