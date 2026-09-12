import React from 'react';
import './chartSetup';
import { Radar } from 'react-chartjs-2';

export default function PestleRadarChart({ pestleData = [], darkMode }) {
  const labels = pestleData.map(p => p.factor);
  const counts = pestleData.map(p => p.count);
  const intensities = pestleData.map(p => p.avgIntensity);

  const data = {
    labels,
    datasets: [
      {
        label: 'Factor Volume',
        data: counts,
        backgroundColor: darkMode ? 'rgba(99, 102, 241, 0.25)' : 'rgba(79, 70, 229, 0.2)',
        borderColor: '#6366f1',
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#6366f1'
      },
      {
        label: 'Average Intensity',
        data: intensities,
        backgroundColor: darkMode ? 'rgba(236, 72, 153, 0.25)' : 'rgba(219, 39, 119, 0.2)',
        borderColor: '#ec4899',
        pointBackgroundColor: '#ec4899',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#ec4899'
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
      r: {
        angleLines: {
          color: darkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.8)'
        },
        grid: {
          color: darkMode ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)'
        },
        pointLabels: {
          color: darkMode ? '#94a3b8' : '#64748b',
          font: { size: 10, weight: '600' }
        },
        ticks: {
          backdropColor: 'transparent',
          color: darkMode ? '#94a3b8' : '#64748b',
          font: { size: 9 }
        }
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            PESTLE Framework Analysis
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Macro-environmental forces shaping industry trends.
          </p>
        </div>
      </div>

      <div className="h-72 w-full">
        {pestleData.length > 0 ? (
          <Radar data={data} options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            No PESTLE data available
          </div>
        )}
      </div>
    </div>
  );
}
