import React from 'react';
import { ShieldCheck, AlertCircle, ArrowUpRight, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { ATSScoreResult } from '../../types/ats';
import { CircularScore } from '../ui/CircularScore';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { NavTab } from '../layout/Sidebar';

interface HealthCardProps {
  atsResult: ATSScoreResult;
  onNavigateTab: (tab: NavTab) => void;
}

export const HealthCard: React.FC<HealthCardProps> = ({
  atsResult,
  onNavigateTab
}) => {
  const { overallScore, categories, criticalIssues } = atsResult;

  const getScoreVariant = (score: number) => {
    if (score >= 80) return { label: 'Optimal', color: 'text-emerald-400', badge: 'success' };
    if (score >= 60) return { label: 'Needs Improvement', color: 'text-amber-400', badge: 'warning' };
    return { label: 'High Risk', color: 'text-rose-400', badge: 'danger' };
  };

  const scoreMeta = getScoreVariant(overallScore);

  return (
    <div className="p-4 sm:p-6 lg:p-7 rounded-2xl bg-gradient-to-b from-slate-850 to-slate-900 border border-slate-800 shadow-xl space-y-6">
      
      {/* Top Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Resume Health & ATS Pass Rate</h2>
            <Badge variant={scoreMeta.badge as any} size="sm">{scoreMeta.label}</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluated by algorithmic ATS screening across 6 core criteria
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('ats')}
          className="self-start sm:self-auto inline-flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300 transition"
        >
          <span>View Full Breakdown</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Score Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Circular Overall Score */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 text-center shadow-inner">
          <CircularScore score={overallScore} size={130} strokeWidth={10} />
          <span className="text-xs font-bold text-slate-300 mt-2">Overall ATS Score</span>
          <p className="text-[11px] text-slate-400 max-w-[200px] mt-0.5">
            {overallScore >= 80
              ? 'Your resume is highly optimized for recruitment systems.'
              : overallScore >= 60
              ? 'Good foundation with key opportunities for keyword & verb optimization.'
              : 'Critical formatting and keyword gaps are reducing your interview shortlist rate.'}
          </p>
        </div>

        {/* Right 6 Category Progress Bars */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => onNavigateTab('ats')}
              className="p-3 sm:p-3.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 transition cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-200 group-hover:text-brand-300 transition-colors truncate">
                  {cat.name}
                </span>
                <span className="font-mono text-slate-400 text-[11px] shrink-0 ml-2">
                  {cat.score} / {cat.maxScore} pts
                </span>
              </div>
              <ProgressBar
                value={cat.score}
                max={cat.maxScore}
                variant={cat.percentage >= 80 ? 'success' : cat.percentage >= 60 ? 'warning' : 'danger'}
                size="sm"
              />
              <p className="text-[10.5px] text-slate-400 mt-1 line-clamp-1">
                {cat.summary}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* Critical Issues Alert Banner */}
      {criticalIssues.length > 0 && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-rose-300">
                {criticalIssues.length} Critical ATS Formatting Warning{criticalIssues.length > 1 ? 's' : ''}
              </h4>
              <p className="text-[11px] text-rose-200/80 mt-0.5">
                {criticalIssues[0]} {criticalIssues.length > 1 && `(+${criticalIssues.length - 1} more issues)`}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('ai')}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition shrink-0 self-start sm:self-auto"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Fix with AI</span>
          </button>
        </div>
      )}

    </div>
  );
};
