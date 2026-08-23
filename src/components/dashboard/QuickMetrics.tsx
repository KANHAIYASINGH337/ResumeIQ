import React from 'react';
import { FileText, Award, AlertTriangle, Briefcase, Code } from 'lucide-react';
import { ATSStats } from '../../types/ats';
import { NavTab } from '../layout/Sidebar';

interface QuickMetricsProps {
  stats: ATSStats;
  criticalIssuesCount: number;
  onNavigateTab: (tab: NavTab) => void;
}

export const QuickMetrics: React.FC<QuickMetricsProps> = ({
  stats,
  criticalIssuesCount,
  onNavigateTab
}) => {
  const metricCards = [
    {
      label: 'Technical Skills',
      value: stats.skillsCount,
      subtext: `${stats.skillsCount >= 10 ? 'Strong' : 'Add more'} diversity`,
      icon: <Code className="w-4 h-4 text-brand-400" />,
      color: 'border-brand-500/20 bg-brand-950/10',
      tab: 'ats' as NavTab
    },
    {
      label: 'Action Verbs',
      value: stats.actionVerbsCount,
      subtext: 'Leadership phrases',
      icon: <Award className="w-4 h-4 text-emerald-400" />,
      color: 'border-emerald-500/20 bg-emerald-950/10',
      tab: 'ai' as NavTab
    },
    {
      label: 'Quantified Metrics',
      value: stats.quantifiableBulletsCount,
      subtext: 'Impact statements',
      icon: <FileText className="w-4 h-4 text-sky-400" />,
      color: 'border-sky-500/20 bg-sky-950/10',
      tab: 'ai' as NavTab
    },
    {
      label: 'Total Words',
      value: stats.wordCount,
      subtext: stats.wordCount > 750 ? 'Slightly long' : stats.wordCount < 250 ? 'Too short' : 'Ideal 1-2 pages',
      icon: <Briefcase className="w-4 h-4 text-purple-400" />,
      color: 'border-purple-500/20 bg-purple-950/10',
      tab: 'builder' as NavTab
    },
    {
      label: 'Critical Gaps',
      value: criticalIssuesCount,
      subtext: criticalIssuesCount === 0 ? 'All checks pass' : 'Requires fixes',
      icon: <AlertTriangle className={`w-4 h-4 ${criticalIssuesCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`} />,
      color: criticalIssuesCount > 0 ? 'border-rose-500/20 bg-rose-950/10' : 'border-emerald-500/20 bg-emerald-950/10',
      tab: 'ats' as NavTab
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
      {metricCards.map((card, idx) => (
        <div
          key={idx}
          onClick={() => onNavigateTab(card.tab)}
          className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border ${card.color} hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400 truncate mr-1">{card.label}</span>
            {card.icon}
          </div>
          <div className="mt-2 sm:mt-3">
            <span className="text-xl sm:text-2xl font-black text-white">{card.value}</span>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">{card.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
