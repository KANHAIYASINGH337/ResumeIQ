import React, { useState } from 'react';
import { GitCompare, TrendingUp, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { AnalysisHistoryItem } from '../../types/ai';
import { ResumeData } from '../../types/resume';
import { Badge } from '../ui/Badge';

interface VersionCompareProps {
  currentResume: ResumeData;
  currentAtsScore: number;
  currentJdScore?: number;
  history: AnalysisHistoryItem[];
}

export const VersionCompare: React.FC<VersionCompareProps> = ({
  currentResume,
  currentAtsScore,
  currentJdScore,
  history
}) => {
  const [selectedHistoryId, setSelectedHistoryId] = useState<string>(
    history.length > 0 ? history[0].id : ''
  );

  const selectedItem = history.find(h => h.id === selectedHistoryId);

  const atsDelta = selectedItem ? currentAtsScore - selectedItem.atsScore : 0;
  const jdDelta = (currentJdScore !== undefined && selectedItem?.jdMatchScore !== undefined)
    ? currentJdScore - selectedItem.jdMatchScore
    : 0;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Resume Version Comparison & Gains</h3>
          <p className="text-xs text-slate-400">
            Compare your active optimized resume against previous iterations to measure score improvements
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Compare with:</span>
            <select
              value={selectedHistoryId}
              onChange={e => setSelectedHistoryId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-brand-500"
            >
              {history.map(h => (
                <option key={h.id} value={h.id}>
                  {h.resumeName} ({new Date(h.timestamp).toLocaleDateString()}) - {h.atsScore}%
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {history.length === 0 || !selectedItem ? (
        <div className="p-12 rounded-2xl bg-slate-850 border border-slate-800 text-center space-y-2">
          <GitCompare className="w-10 h-10 text-slate-500 mx-auto" />
          <h4 className="text-sm font-bold text-white">No Previous Versions to Compare</h4>
          <p className="text-xs text-slate-400">Make edits or scan multiple resumes to unlock side-by-side progression tracking.</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Top Score Diff Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Version 1 (Baseline) */}
            <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Version A (Baseline Scan)</span>
                <Badge variant="neutral" size="sm">
                  {new Date(selectedItem.timestamp).toLocaleDateString()}
                </Badge>
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">{selectedItem.resumeName}</h4>
                <p className="text-xs text-slate-400">{selectedItem.jobTitleTarget || 'General Profile'}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-2xl font-black text-slate-300">{selectedItem.atsScore}%</span>
                  <p className="text-[11px] text-slate-400 font-medium">ATS Pass Score</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-2xl font-black text-slate-300">{selectedItem.jdMatchScore ?? 'N/A'}%</span>
                  <p className="text-[11px] text-slate-400 font-medium">Job Match</p>
                </div>
              </div>
            </div>

            {/* Version 2 (Current Optimized) */}
            <div className="p-6 rounded-2xl bg-brand-950/20 border border-brand-500/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-300">Version B (Current Active)</span>
                <Badge variant="brand" size="sm">
                  <Sparkles className="w-3 h-3" /> Live Optimized
                </Badge>
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">{currentResume.versionName}</h4>
                <p className="text-xs text-slate-300">Optimized with AI & ATS Fixes</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-brand-900/40 border border-brand-500/30 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-2xl font-black text-emerald-400">{currentAtsScore}%</span>
                    {atsDelta > 0 && (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        +{atsDelta}%
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium">ATS Pass Score</p>
                </div>

                <div className="p-3 rounded-xl bg-brand-900/40 border border-brand-500/30 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-2xl font-black text-brand-300">{currentJdScore ?? 80}%</span>
                    {jdDelta > 0 && (
                      <span className="text-xs font-bold text-brand-300 bg-brand-500/10 px-1.5 py-0.5 rounded">
                        +{jdDelta}%
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium">Job Match</p>
                </div>
              </div>
            </div>

          </div>

          {/* Key Improvements Highlights */}
          <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">Measurable Progression Highlights</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-emerald-400">
                  {atsDelta >= 0 ? `+${atsDelta}% ATS Pass Rate` : `${atsDelta}% Score`}
                </span>
                <p className="text-[11px] text-slate-400">
                  Action verb enhancements and keyword density improvements.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-brand-400">Action Verbs Aligned</span>
                <p className="text-[11px] text-slate-400">
                  Transformed passive phrases into XYZ accomplishment statements.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-purple-400">Multi-Template Portability</span>
                <p className="text-[11px] text-slate-400">
                  Seamlessly exported across 4 ATS-compliant typography styles.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
