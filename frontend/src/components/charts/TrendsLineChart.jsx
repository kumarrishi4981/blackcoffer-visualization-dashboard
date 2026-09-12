import React from 'react';
import './chartSetup';
import { Line } from 'react-chartjs-2';

export default function TrendsLineChart({ trends = [], darkMode }) {
  const labels = trends.map(t => t.year);

  const data = {
    labels,
    datasets: [
      {
        label: 'Average Intensity',
        data: trends.map(t => t.avgIntensity),
        borderColor: '#f59e0b', // amber
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.35,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: 'y'
      },
      {
        label: 'Average Likelihood',
        data: trends.map(t => t.avgLikelihood),
        borderColor: '#6366f1', // indigo
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.35,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: 'y1'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
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
          color: darkMode ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)'
        },
        ticks: {
          color: darkMode ? '#94a3b8' : '#64748b',
          font: { size: 10 }
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Avg Intensity',
          color: '#f59e0b',
          font: { size: 10, weight: '600' }
        },
        grid: {
          color: darkMode ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.6)'
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
          text: 'Avg Likelihood',
          color: '#6366f1',
          font: { size: 10, weight: '600' }
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: darkMode ? '#94a3b8' : '#64748b'
        },
        min: 0,
        max: 5
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Yearly Projection Trajectory
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Temporal shift in intensity and likelihood across target forecast years.
          </p>
        </div>
      </div>

      <div className="h-72 w-full">
        {trends.length > 0 ? (
          <Line data={data} options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            No yearly trend data available
          </div>
        )}
      </div>
    </div>
  );
}
