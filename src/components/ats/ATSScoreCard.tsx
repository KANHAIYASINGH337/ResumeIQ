import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, ChevronDown, ChevronUp, Layers, Code, Zap, FileText, Layout, Eye } from 'lucide-react';
import { ATSScoreResult, ATSCategoryScore } from '../../types/ats';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';

interface ATSScoreCardProps {
  atsResult: ATSScoreResult;
}

export const ATSScoreCard: React.FC<ATSScoreCardProps> = ({ atsResult }) => {
  const { categories } = atsResult;
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Compatibility');

  const categoryConfigs: { key: keyof typeof categories; icon: React.ReactNode; color: string }[] = [
    { key: 'compatibility', icon: <Layers className="w-4 h-4 text-emerald-400" />, color: 'bg-emerald-500' },
    { key: 'keywords', icon: <Code className="w-4 h-4 text-brand-400" />, color: 'bg-brand-500' },
    { key: 'contentQuality', icon: <Zap className="w-4 h-4 text-sky-400" />, color: 'bg-sky-500' },
    { key: 'completeness', icon: <FileText className="w-4 h-4 text-indigo-400" />, color: 'bg-indigo-500' },
    { key: 'formatting', icon: <Layout className="w-4 h-4 text-purple-400" />, color: 'bg-purple-500' },
    { key: 'readability', icon: <Eye className="w-4 h-4 text-amber-400" />, color: 'bg-amber-500' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">ATS Category Audits & Diagnostics</h3>
          <p className="text-xs text-slate-400">Detailed inspection across 6 algorithmic screening vectors</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categoryConfigs.map(({ key, icon, color }) => {
          const cat = categories[key];
          const isExpanded = expandedCategory === cat.name;

          return (
            <div
              key={key}
              className="p-5 rounded-2xl bg-slate-850 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4 shadow-lg"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    {icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{cat.name}</h4>
                    <span className="text-[11px] font-mono text-slate-400">
                      {cat.score} / {cat.maxScore} points
                    </span>
                  </div>
                </div>

                <Badge
                  variant={cat.status === 'excellent' ? 'success' : cat.status === 'good' ? 'brand' : 'warning'}
                  size="sm"
                >
                  {cat.percentage}%
                </Badge>
              </div>

              {/* Progress Bar */}
              <ProgressBar
                value={cat.score}
                max={cat.maxScore}
                colorClass={color}
                showPercentage={false}
              />

              {/* Findings & Recommendations Collapsible */}
              <div className="space-y-2 pt-1 border-t border-slate-800/80">
                <div className="space-y-1.5 text-xs">
                  {cat.findings.map((f, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[11.5px] leading-relaxed">{f}</span>
                    </div>
                  ))}

                  {cat.recommendations.map((r, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-amber-300/90">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span className="text-[11.5px] leading-relaxed">{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
