import React from 'react';
import { ShieldCheck, TrendingUp, Sparkles } from 'lucide-react';
import { ATSScoreResult } from '../../types/ats';
import { CircularScore } from '../ui/CircularScore';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';

interface HealthCardProps {
  atsResult: ATSScoreResult;
  onNavigateTab: (tab: any) => void;
}

export const HealthCard: React.FC<HealthCardProps> = ({
  atsResult,
  onNavigateTab
}) => {
  const { overallScore, grade, statusText, categories } = atsResult;

  return (
    <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white tracking-tight">Resume Health & ATS Pass Rate</h3>
            <Badge
              variant={grade === 'A+' || grade === 'A' ? 'success' : grade === 'B' ? 'brand' : 'warning'}
              size="sm"
            >
              Grade {grade}
            </Badge>
          </div>
          <p className="text-xs text-slate-400">
            Computed by transparent multi-vector ATS recruitment audit
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('ats')}
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition"
          >
            View Full Breakdown →
          </button>
        </div>
      </div>

      {/* Main Score Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Big Circular Score */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <CircularScore
            score={overallScore}
            size={140}
            strokeWidth={10}
            label="ATS Score"
          />
          <div className="text-center mt-3">
            <span className={`text-xs font-bold ${
              overallScore >= 80 ? 'text-emerald-400' : overallScore >= 65 ? 'text-brand-400' : 'text-amber-400'
            }`}>
              {statusText}
            </span>
          </div>
        </div>

        {/* 6 Category Progress Bars */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ProgressBar
            label="ATS Compatibility"
            value={categories.compatibility.score}
            max={categories.compatibility.maxScore}
            colorClass="bg-emerald-500"
            subLabel="Standard headings & machine readability"
          />

          <ProgressBar
            label="Keyword Optimization"
            value={categories.keywords.score}
            max={categories.keywords.maxScore}
            colorClass="bg-brand-500"
            subLabel="Technical stack & CS depth"
          />

          <ProgressBar
            label="Content Quality"
            value={categories.contentQuality.score}
            max={categories.contentQuality.maxScore}
            colorClass="bg-sky-500"
            subLabel="Action verbs & measurable outcomes"
          />

          <ProgressBar
            label="Resume Completeness"
            value={categories.completeness.score}
            max={categories.completeness.maxScore}
            colorClass="bg-indigo-500"
            subLabel="Contact, links & project depth"
          />

          <ProgressBar
            label="Formatting & Layout"
            value={categories.formatting.score}
            max={categories.formatting.maxScore}
            colorClass="bg-purple-500"
            subLabel="Bullet consistency & density"
          />

          <ProgressBar
            label="Recruiter Readability"
            value={categories.readability.score}
            max={categories.readability.maxScore}
            colorClass="bg-amber-500"
            subLabel="6-second scan optimization"
          />
        </div>

      </div>
    </div>
  );
};
