import React from 'react';
import { Layers, CheckCircle2, AlertTriangle, Lightbulb, ExternalLink, Code2 } from 'lucide-react';
import { ProjectAnalysis } from '../../types/ai';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';

interface ProjectStrengthProps {
  analyses: ProjectAnalysis[];
}

export const ProjectStrength: React.FC<ProjectStrengthProps> = ({ analyses }) => {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-base font-bold text-white tracking-tight">Software Engineering Project Quality Audits</h4>
        <p className="text-xs text-slate-400">
          Evaluates architectural depth, full-stack completeness, deployment readiness, and API documentation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analyses.map(item => (
          <div
            key={item.projectId}
            className="p-5 rounded-2xl bg-slate-850 border border-slate-800 shadow-lg space-y-3.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <h5 className="text-sm font-bold text-white leading-snug">{item.title}</h5>
                <div className="flex flex-wrap gap-1">
                  {item.techStackEvaluated.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10.5px] border border-slate-700 font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <Badge
                variant={item.score >= 85 ? 'success' : item.score >= 70 ? 'brand' : 'warning'}
                size="sm"
              >
                {item.score}/100 Quality
              </Badge>
            </div>

            {/* Strengths */}
            <div className="space-y-1 text-xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Verified Strengths</span>
              {item.strengths.map((s, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-emerald-300/90 text-[11.5px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
            </div>

            {/* Suggestions */}
            {item.suggestions.length > 0 && (
              <div className="pt-2 border-t border-slate-800 space-y-1 text-xs">
                <span className="text-[11px] font-semibold text-amber-400/90 uppercase tracking-wider">Engineering Advice</span>
                {item.suggestions.map((s, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-slate-300 text-[11.5px]">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};
