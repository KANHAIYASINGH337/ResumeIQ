import React from 'react';
import { ShieldCheck, CheckCircle2, XCircle, AlertCircle, Sparkles } from 'lucide-react';
import { ATSRuleCheck } from '../../types/ats';
import { Badge } from '../ui/Badge';

interface ATSRulesCheckProps {
  rules: ATSRuleCheck[];
  onFixWithAI: () => void;
}

export const ATSRulesCheck: React.FC<ATSRulesCheckProps> = ({ rules, onFixWithAI }) => {
  return (
    <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">ATS Compliance & Safety Audit</h4>
            <p className="text-xs text-slate-400">Verifies compatibility with Workday, Taleo, iCIMS, and Greenhouse</p>
          </div>
        </div>

        <button
          onClick={onFixWithAI}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 border border-brand-500/30 text-xs font-semibold transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Auto-Fix with AI</span>
        </button>
      </div>

      <div className="divide-y divide-slate-800/80">
        {rules.map(rule => (
          <div key={rule.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {rule.passed ? (
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                  <XCircle className="w-4 h-4" />
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{rule.rule}</span>
                  <Badge variant={rule.severity === 'high' ? 'danger' : 'warning'} size="sm">
                    {rule.category}
                  </Badge>
                </div>
                <p className="text-[11.5px] text-slate-300">{rule.details}</p>
                {rule.fixSuggestion && !rule.passed && (
                  <p className="text-[11px] text-brand-300 flex items-center gap-1">
                    <span className="font-semibold">💡 Recommendation:</span> {rule.fixSuggestion}
                  </p>
                )}
              </div>
            </div>

            <Badge variant={rule.passed ? 'success' : 'danger'} size="sm">
              {rule.passed ? 'Passed' : 'Action Needed'}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};
