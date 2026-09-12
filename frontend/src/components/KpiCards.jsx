import React from 'react';
import { Zap, Target, Award, Database, Globe, Briefcase } from 'lucide-react';

export default function KpiCards({ kpis = {}, loading }) {
  const cards = [
    {
      title: 'Average Intensity',
      value: kpis.avgIntensity || 0,
      suffix: '/ 100',
      subtitle: 'Impact strength',
      icon: Zap,
      gradient: 'from-amber-500 to-orange-500',
      bgGlow: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    {
      title: 'Average Likelihood',
      value: kpis.avgLikelihood || 0,
      suffix: '/ 5',
      subtitle: 'Occurrence probability',
      icon: Target,
      gradient: 'from-blue-500 to-indigo-600',
      bgGlow: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Average Relevance',
      value: kpis.avgRelevance || 0,
      suffix: '/ 7',
      subtitle: 'Strategic importance',
      icon: Award,
      gradient: 'from-purple-500 to-violet-600',
      bgGlow: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Total Insights',
      value: kpis.total || 0,
      suffix: 'records',
      subtitle: 'Filtered dataset',
      icon: Database,
      gradient: 'from-emerald-500 to-teal-600',
      bgGlow: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Global Footprint',
      value: kpis.totalCountries || 0,
      suffix: 'countries',
      subtitle: `${kpis.totalSectors || 0} active sectors`,
      icon: Globe,
      gradient: 'from-pink-500 to-rose-600',
      bgGlow: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
          >
            {/* Soft accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient}`} />

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl ${card.bgGlow} transition-transform group-hover:scale-110`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline space-x-1.5">
              <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {loading ? '...' : card.value}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {card.suffix}
              </span>
            </div>

            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {card.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
}
