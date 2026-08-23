import React from 'react';
import { Sparkles, Check, X, ArrowRight, CheckCircle2, XCircle, AlertCircle, Wand2 } from 'lucide-react';
import { BulletSuggestion } from '../../types/ai';
import { Badge } from '../ui/Badge';

interface BulletOptimizerProps {
  suggestions: BulletSuggestion[];
  onAccept: (suggestionId: string) => void;
  onReject: (suggestionId: string) => void;
  onAcceptAll: () => void;
}

export const BulletOptimizer: React.FC<BulletOptimizerProps> = ({
  suggestions,
  onAccept,
  onReject,
  onAcceptAll
}) => {
  const pendingCount = suggestions.filter(s => s.status === 'pending').length;
  const acceptedCount = suggestions.filter(s => s.status === 'accepted').length;
  const rejectedCount = suggestions.filter(s => s.status === 'rejected').length;

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white tracking-tight">AI Bullet Point Optimizer</h3>
            <Badge variant="brand" size="sm">
              <Sparkles className="w-3 h-3" /> XYZ Impact Formula
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Converts passive phrasing into high-impact engineering accomplishments without fabricating facts
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <button
              onClick={onAcceptAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 transition"
            >
              <Check className="w-4 h-4" />
              <span>Accept All ({pendingCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Status Counters */}
      <div className="flex items-center gap-3 text-xs font-semibold">
        <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
          Total: {suggestions.length}
        </span>
        <span className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20">
          Pending: {pendingCount}
        </span>
        <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
          Accepted: {acceptedCount}
        </span>
        <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 border border-slate-700">
          Rejected: {rejectedCount}
        </span>
      </div>

      {/* Suggestion Cards */}
      <div className="space-y-4">
        {suggestions.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-850 border border-slate-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">All Bullet Points are Optimized</h4>
            <p className="text-xs text-slate-400">Your bullet points already start with strong action verbs and clear scope.</p>
          </div>
        ) : (
          suggestions.map((item, idx) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all space-y-4 shadow-xl ${
                item.status === 'accepted'
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : item.status === 'rejected'
                  ? 'bg-slate-900/40 border-slate-800 opacity-60'
                  : 'bg-slate-850 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-400">{item.parentTitle}</span>
                  <Badge variant="neutral" size="sm">{item.section}</Badge>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.status === 'accepted' && (
                    <Badge variant="success" size="sm">
                      <Check className="w-3 h-3" /> Applied to Resume
                    </Badge>
                  )}
                  {item.status === 'rejected' && (
                    <Badge variant="neutral" size="sm">
                      <X className="w-3 h-3" /> Original Kept
                    </Badge>
                  )}
                </div>
              </div>

              {/* Diff View Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Original */}
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase">
                    <span>Original Phrasing</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed line-through opacity-75">
                    {item.originalText}
                  </p>
                </div>

                {/* AI Suggestion */}
                <div className="p-3.5 rounded-xl bg-brand-950/20 border border-brand-500/30 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-brand-300 uppercase">
                    <span>AI Enhanced Version</span>
                    <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                  </div>
                  <p className="text-xs font-medium text-white leading-relaxed">
                    {item.suggestedText}
                  </p>
                </div>

              </div>

              {/* Rationale & Actions Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">Why this is better:</span>
                  {item.rationale.map((r, rIdx) => (
                    <span key={rIdx} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      ✓ {r}
                    </span>
                  ))}
                </div>

                {item.status === 'pending' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onReject(item.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition"
                    >
                      Ignore
                    </button>
                    <button
                      onClick={() => onAccept(item.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Apply Change</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
