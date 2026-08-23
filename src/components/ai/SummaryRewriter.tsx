import React from 'react';
import { Sparkles, Check, X, FileText } from 'lucide-react';
import { SummaryOptimization } from '../../types/ai';
import { Badge } from '../ui/Badge';

interface SummaryRewriterProps {
  summaryOpt?: SummaryOptimization;
  onApplySummary: (improvedSummary: string) => void;
}

export const SummaryRewriter: React.FC<SummaryRewriterProps> = ({
  summaryOpt,
  onApplySummary
}) => {
  if (!summaryOpt) return null;

  return (
    <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">Professional Summary AI Enhancer</h4>
            <p className="text-xs text-slate-400">Front-loads your core stack and eliminates generic career statements</p>
          </div>
        </div>

        {summaryOpt.status === 'accepted' ? (
          <Badge variant="success" size="sm">
            <Check className="w-3 h-3" /> Summary Applied
          </Badge>
        ) : (
          <button
            onClick={() => onApplySummary(summaryOpt.improvedSummary)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply to Resume</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Current Summary</span>
          <p className="text-xs text-slate-300 leading-relaxed">
            {summaryOpt.originalSummary || 'No summary currently provided.'}
          </p>
        </div>

        {/* AI Suggestion */}
        <div className="p-4 rounded-xl bg-brand-950/20 border border-brand-500/30 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-brand-300 uppercase tracking-wider">
            <span>Enhanced Positioning</span>
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          </div>
          <p className="text-xs font-medium text-white leading-relaxed">
            {summaryOpt.improvedSummary}
          </p>
        </div>
      </div>

      {/* Critique Bullets */}
      <div className="pt-2 border-t border-slate-800/80">
        <div className="flex flex-wrap gap-2 text-xs">
          {summaryOpt.critique.map((c, idx) => (
            <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-[11.5px]">
              ✓ {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
