import React from 'react';
import {
  LayoutDashboard,
  ShieldCheck,
  Target,
  Wand2,
  FileEdit,
  History,
  GitCompare,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Badge } from '../ui/Badge';

export type NavTab = 'dashboard' | 'ats' | 'jd' | 'ai' | 'builder' | 'history' | 'compare';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  atsScore?: number;
  jdMatchScore?: number;
  criticalIssuesCount?: number;
  pendingSuggestionsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  atsScore,
  jdMatchScore,
  criticalIssuesCount = 0,
  pendingSuggestionsCount = 0
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: React.ReactNode }[] = [
    {
      id: 'dashboard',
      label: 'Overview & Health',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'ats',
      label: 'ATS Analysis',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: atsScore ? (
        <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${atsScore >= 80 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
          {atsScore}%
        </span>
      ) : undefined
    },
    {
      id: 'jd',
      label: 'Job Matcher & Keywords',
      icon: <Target className="w-4 h-4" />,
      badge: jdMatchScore ? (
        <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300">
          {jdMatchScore}%
        </span>
      ) : undefined
    },
    {
      id: 'ai',
      label: 'AI Bullet Optimizer',
      icon: <Wand2 className="w-4 h-4" />,
      badge: pendingSuggestionsCount > 0 ? (
        <Badge variant="warning" size="sm">
          {pendingSuggestionsCount}
        </Badge>
      ) : undefined
    },
    {
      id: 'builder',
      label: 'Resume Builder & Styles',
      icon: <FileEdit className="w-4 h-4" />
    },
    {
      id: 'history',
      label: 'Analysis History',
      icon: <History className="w-4 h-4" />
    },
    {
      id: 'compare',
      label: 'Compare Versions',
      icon: <GitCompare className="w-4 h-4" />
    }
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900/70 border-r border-slate-800/80 p-3 sm:p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-1">
        <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </p>

        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-brand-600/15 text-brand-400 border border-brand-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-brand-400' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && <div>{item.badge}</div>}
            </button>
          );
        })}
      </div>

      {/* Mini Diagnostic Pill Card in Sidebar Footer */}
      <div className="mt-6 p-3 rounded-xl bg-slate-850 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-slate-300">
          <span className="flex items-center gap-1.5">
            {criticalIssuesCount === 0 ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            )}
            ATS Status
          </span>
          <span className={criticalIssuesCount === 0 ? 'text-emerald-400' : 'text-rose-400'}>
            {criticalIssuesCount === 0 ? 'Optimal' : `${criticalIssuesCount} issues`}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {criticalIssuesCount === 0
            ? 'Your resume passes critical ATS parsing rules with high readability.'
            : 'Fix flagged critical issues in the ATS tab to avoid automated rejection.'}
        </p>
      </div>
    </aside>
  );
};
