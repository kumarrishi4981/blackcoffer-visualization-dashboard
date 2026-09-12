import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Eye, 
  ArrowUpDown,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

export default function DataTable({ 
  insights = [], 
  total = 0, 
  page = 1, 
  limit = 10, 
  setPage, 
  sortBy, 
  setSortBy, 
  order, 
  setOrder, 
  onSelectInsight, 
  loading 
}) {
  const totalPages = Math.ceil(total / limit) || 1;

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('desc');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
            <span>Data Records Explorer</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {total.toLocaleString()} total
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Detailed view of intelligence records loaded from MongoDB. Click any row to view full details.
          </p>
        </div>

        {/* Quick Sorting Dropdown */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-primary-500 focus:outline-none"
          >
            <option value="added">Date Added</option>
            <option value="intensity">Intensity</option>
            <option value="likelihood">Likelihood</option>
            <option value="relevance">Relevance</option>
            <option value="end_year">End Year</option>
          </select>

          <button
            onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            title="Toggle sort order"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50/80 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4 min-w-[280px]">Insight & Title</th>
              <th className="py-3 px-4">Topic / Sector</th>
              <th className="py-3 px-4">Region / Country</th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 select-none text-center"
                onClick={() => handleSort('intensity')}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Intensity</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 select-none text-center"
                onClick={() => handleSort('likelihood')}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Likelihood</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 select-none text-center"
                onClick={() => handleSort('relevance')}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Relevance</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 text-center">End Year</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
            {loading ? (
              <tr>
                <td colSpan="9" className="py-12 text-center text-slate-400">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading insights from MongoDB...</span>
                  </div>
                </td>
              </tr>
            ) : insights.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-12 text-center text-slate-400">
                  No records match your selected filters. Try clearing or relaxing filters.
                </td>
              </tr>
            ) : (
              insights.map((item, index) => {
                const globalIndex = (page - 1) * limit + index + 1;
                return (
                  <tr
                    key={item._id || index}
                    onClick={() => onSelectInsight(item)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition"
                  >
                    <td className="py-3.5 px-4 text-center font-mono text-slate-400 text-[11px]">
                      {globalIndex}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 hover:text-primary-600 dark:hover:text-primary-400">
                        {item.title || item.insight || 'Untitled Insight'}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {item.insight || item.title}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {item.topic && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                            {item.topic}
                          </span>
                        )}
                        {item.sector && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {item.sector}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 dark:text-slate-200 font-medium">
                        {item.country || 'Global'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.region || 'Worldwide'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block font-bold text-amber-600 dark:text-amber-400">
                        {item.intensity || 0}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block font-semibold text-blue-600 dark:text-blue-400">
                        {item.likelihood || 0}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block font-semibold text-purple-600 dark:text-purple-400">
                        {item.relevance || 0}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono text-slate-600 dark:text-slate-400">
                      {item.end_year || '—'}
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onSelectInsight(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="View Full Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Open Source Document"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div>
          Showing {Math.min(total, (page - 1) * limit + 1)} to {Math.min(total, page * limit)} of {total.toLocaleString()} entries
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 font-semibold text-slate-700 dark:text-slate-300">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
