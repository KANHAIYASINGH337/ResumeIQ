import React from 'react';
import { History, Calendar, Trash2, ArrowUpRight, GitCompare, CheckCircle2, AlertTriangle } from 'lucide-react';
import { AnalysisHistoryItem } from '../../types/ai';
import { Badge } from '../ui/Badge';

interface AnalysisHistoryProps {
  history: AnalysisHistoryItem[];
  onLoadItem: (item: AnalysisHistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onCompareWithCurrent: (item: AnalysisHistoryItem) => void;
}

export const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({
  history,
  onLoadItem,
  onDeleteItem,
  onCompareWithCurrent
}) => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-white tracking-tight">Analysis History & Saved Audits</h3>
        <p className="text-xs text-slate-400">
          Review previous ATS scans, compare score improvements, and restore earlier resume versions
        </p>
      </div>

      {history.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-850 border border-slate-800 text-center space-y-3">
          <History className="w-10 h-10 text-slate-500 mx-auto" />
          <h4 className="text-sm font-bold text-white">No Previous Scans Found</h4>
          <p className="text-xs text-slate-400">Your analysis history will automatically be saved here as you scan resumes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {history.map(item => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-850 border border-slate-800 hover:border-slate-700 transition shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{item.resumeName}</h4>
                  {item.jobTitleTarget && (
                    <Badge variant="brand" size="sm">{item.jobTitleTarget}</Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span>ATS: <b className="text-emerald-400">{item.atsScore}%</b></span>
                  {item.jdMatchScore !== undefined && (
                    <span>JD Match: <b className="text-brand-400">{item.jdMatchScore}%</b></span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onCompareWithCurrent(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                  title="Compare with active resume"
                >
                  <GitCompare className="w-3.5 h-3.5 text-brand-400" />
                  <span>Compare</span>
                </button>

                <button
                  onClick={() => onLoadItem(item)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Load Version</span>
                </button>

                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
                  title="Delete scan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
