import React from 'react';
import { Lightbulb, ArrowRight, CheckCircle2 } from 'lucide-react';

interface TopRecommendationsProps {
  recommendations: string[];
  onNavigateTab: (tab: any) => void;
}

export const TopRecommendations: React.FC<TopRecommendationsProps> = ({
  recommendations,
  onNavigateTab
}) => {
  return (
    <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white tracking-tight">Top High-Impact Recommendations</h4>
          <p className="text-xs text-slate-400">Prioritized adjustments to maximize your interview callbacks</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {recommendations.length === 0 ? (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>Outstanding resume! No high-priority structural issues detected.</span>
          </div>
        ) : (
          recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition group"
            >
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">{rec}</p>
              </div>

              <button
                onClick={() => onNavigateTab('ai')}
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-brand-400 group-hover:text-brand-300 shrink-0 transition"
              >
                <span>Fix with AI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
