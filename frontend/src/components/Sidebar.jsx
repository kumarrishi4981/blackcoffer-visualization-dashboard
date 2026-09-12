import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Globe2, 
  Table2, 
  PieChart, 
  Layers, 
  HelpCircle,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, counts = {} }) {
  const menuItems = [
    { id: 'overview', label: 'Executive Dashboard', icon: LayoutDashboard, badge: 'Main' },
    { id: 'charts', label: 'Visual Analytics', icon: TrendingUp },
    { id: 'sectors', label: 'Sectors & PESTLE', icon: Layers },
    { id: 'geo', label: 'Regions & Countries', icon: Globe2 },
    { id: 'table', label: 'Data Explorer', icon: Table2, badge: counts.total || '1,000' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between hidden md:flex transition-colors">
      <div className="p-4">
        <div className="text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-3 mb-2">
          Navigation
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  const el = document.getElementById(item.id);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 shadow-sm border border-primary-100 dark:border-primary-900/40'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    isActive 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Assignment Specs info card */}
        <div className="mt-8 p-3.5 rounded-xl bg-gradient-to-br from-slate-50 to-indigo-50/40 dark:from-slate-800/60 dark:to-slate-800/30 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
            <PieChart className="w-3.5 h-3.5 text-primary-500" />
            <span>Blackcoffer Scope</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Visualizing Intensity, Likelihood, Relevance, Years, Sectors, Topics, PESTLE & Regions from MongoDB.
          </p>
        </div>
      </div>

      {/* Footer / System Status */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Database Engine</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">Mongoose / Mongo</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
          <span>Design Architecture</span>
          <span className="font-medium text-slate-700 dark:text-slate-300">Vuexy Inspired</span>
        </div>
      </div>
    </aside>
  );
}
