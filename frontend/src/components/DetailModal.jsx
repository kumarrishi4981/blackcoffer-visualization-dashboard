import React from 'react';
import { 
  X, 
  ExternalLink, 
  Calendar, 
  Tag, 
  Briefcase, 
  Globe, 
  ShieldAlert, 
  FileText, 
  Zap, 
  Target, 
  Award,
  Clock
} from 'lucide-react';

export default function DetailModal({ insight, onClose }) {
  if (!insight) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl transition-all p-6 sm:p-7 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {insight.sector && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
              {insight.sector}
            </span>
          )}
          {insight.topic && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {insight.topic}
            </span>
          )}
          {insight.pestle && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              PESTLE: {insight.pestle}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
          {insight.title || insight.insight || 'Intelligence Insight'}
        </h2>

        {/* Extended Insight Quote */}
        {insight.insight && insight.insight !== insight.title && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 italic">
            "{insight.insight}"
          </div>
        )}

        {/* Metric Gauges */}
        <div className="grid grid-cols-3 gap-3 my-5">
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-center">
            <div className="flex items-center justify-center space-x-1 text-xs text-amber-700 dark:text-amber-400 font-semibold mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Intensity</span>
            </div>
            <div className="text-2xl font-bold text-amber-900 dark:text-amber-200">
              {insight.intensity || 0}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 text-center">
            <div className="flex items-center justify-center space-x-1 text-xs text-blue-700 dark:text-blue-400 font-semibold mb-1">
              <Target className="w-3.5 h-3.5" />
              <span>Likelihood</span>
            </div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-200">
              {insight.likelihood || 0}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 text-center">
            <div className="flex items-center justify-center space-x-1 text-xs text-purple-700 dark:text-purple-400 font-semibold mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>Relevance</span>
            </div>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-200">
              {insight.relevance || 0}
            </div>
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <Globe className="w-4 h-4 text-slate-400" />
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Location:</span>{' '}
              {insight.country || 'Worldwide'} ({insight.region || 'Global'})
            </div>
          </div>

          <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <Calendar className="w-4 h-4 text-slate-400" />
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Target Year:</span>{' '}
              {insight.end_year ? `End Year: ${insight.end_year}` : 'Not Specified'}{' '}
              {insight.start_year ? `(Start: ${insight.start_year})` : ''}
            </div>
          </div>

          <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <FileText className="w-4 h-4 text-slate-400" />
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Source:</span>{' '}
              {insight.source || 'Intelligence Report'}
            </div>
          </div>

          <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <Clock className="w-4 h-4 text-slate-400" />
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Published:</span>{' '}
              {insight.published || insight.added || 'Unknown date'}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Close Details
          </button>

          {insight.url && (
            <a
              href={insight.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-500/20 transition"
            >
              <span>Read Original Document</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
