import React from 'react';
import { FileText, Bolt, PieChart, Code2, AlertTriangle, Clock } from 'lucide-react';
import { ATSScoreResult } from '../../types/ats';

interface QuickMetricsProps {
  stats: ATSScoreResult['stats'];
  criticalIssuesCount: number;
  onNavigateTab: (tab: any) => void;
}

export const QuickMetrics: React.FC<QuickMetricsProps> = ({
  stats,
  criticalIssuesCount,
  onNavigateTab
}) => {
  const metricCards = [
    {
      label: 'Indexed Skills',
      value: stats.skillsCount,
      subtext: 'Technologies found',
      icon: <Code2 className="w-4 h-4 text-brand-400" />,
      actionTab: 'ats'
    },
    {
      label: 'Action Verbs',
      value: stats.actionVerbsCount,
      subtext: 'Power verbs leading bullets',
      icon: <Bolt className="w-4 h-4 text-amber-400" />,
      actionTab: 'ai'
    },
    {
      label: 'Metrics & Data',
      value: stats.metricsCount,
      subtext: 'Quantifiable metrics (%, $, ms)',
      icon: <PieChart className="w-4 h-4 text-emerald-400" />,
      actionTab: 'ats'
    },
    {
      label: 'Word Count',
      value: stats.wordCount,
      subtext: `~${stats.readingTimeSeconds}s recruiter scan time`,
      icon: <Clock className="w-4 h-4 text-sky-400" />,
      actionTab: 'ats'
    },
    {
      label: 'Critical Issues',
      value: criticalIssuesCount,
      subtext: criticalIssuesCount === 0 ? 'Zero flags' : 'Needs attention',
      icon: <AlertTriangle className={`w-4 h-4 ${criticalIssuesCount === 0 ? 'text-emerald-400' : 'text-rose-400'}`} />,
      actionTab: 'ats'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {metricCards.map((card, idx) => (
        <div
          key={idx}
          onClick={() => onNavigateTab(card.actionTab)}
          className="p-4 rounded-xl bg-slate-850/80 border border-slate-800 hover:border-slate-700 transition cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">{card.label}</span>
            <div className="p-1.5 rounded-lg bg-slate-800 group-hover:scale-110 transition-transform">
              {card.icon}
            </div>
          </div>

          <div className="mt-3">
            <span className="text-2xl font-black text-white tracking-tight">{card.value}</span>
            <p className="text-[10.5px] text-slate-400 mt-0.5 truncate">{card.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
