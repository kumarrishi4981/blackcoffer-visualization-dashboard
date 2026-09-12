import React from 'react';
import './chartSetup';
import { Bubble } from 'react-chartjs-2';
import { HelpCircle } from 'lucide-react';

export default function BubbleMatrixChart({ scatterData = [], darkMode }) {
  const chartData = {
    datasets: [
      {
        label: 'Insights Matrix',
        data: scatterData.map(item => ({
          x: item.x, // Likelihood
          y: item.y, // Intensity
          r: item.r, // Radius (Relevance scaled)
          raw: item
        })),
        backgroundColor: darkMode ? 'rgba(99, 102, 241, 0.6)' : 'rgba(79, 70, 229, 0.55)',
        borderColor: darkMode ? '#818cf8' : '#4f46e5',
        borderWidth: 1.5,
        hoverBackgroundColor: '#ec4899',
        hoverBorderColor: '#db2777',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          title: (items) => {
            const raw = items[0]?.raw?.raw;
            return raw?.title || 'Insight Details';
          },
          label: (context) => {
            const raw = context.raw.raw;
            return [
              `Likelihood: ${context.raw.x}`,
              `Intensity: ${context.raw.y}`,
              `Relevance: ${raw?.relevance || 0}`,
              `Topic: ${raw?.topic || 'N/A'}`,
              `Sector: ${raw?.sector || 'N/A'}`,
              `Country: ${raw?.country || 'N/A'}`
            ];
          }
        },
        padding: 12,
        backgroundColor: darkMode ? '#1e293b' : '#0f172a',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 11 },
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Likelihood (Probability of Occurrence)',
          color: darkMode ? '#94a3b8' : '#64748b',
          font: { weight: '600', size: 11 }
        },
        grid: {
          color: darkMode ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)'
        },
        ticks: {
          color: darkMode ? '#94a3b8' : '#64748b',
          stepSize: 1
        },
        min: 0,
        max: 5.5
      },
      y: {
        title: {
          display: true,
          text: 'Intensity (Impact Score)',
          color: darkMode ? '#94a3b8' : '#64748b',
          font: { weight: '600', size: 11 }
        },
        grid: {
          color: darkMode ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)'
        },
        ticks: {
          color: darkMode ? '#94a3b8' : '#64748b'
        },
        min: 0
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-1.5">
            <span>Intensity vs Likelihood Matrix</span>
            <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              Bubble size = Relevance
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cross-variable strategic assessment mapping impact risk against likelihood.
          </p>
        </div>
      </div>

      <div className="h-72 w-full">
        {scatterData.length > 0 ? (
          <Bubble data={chartData} options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            No data available for selected filters
          </div>
        )}
      </div>
    </div>
  );
}
