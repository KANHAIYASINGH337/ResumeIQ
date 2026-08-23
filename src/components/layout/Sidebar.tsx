import React from 'react';
import {
  LayoutDashboard,
  ShieldCheck,
  Target,
  Sparkles,
  FileEdit,
  History,
  GitCompare,
  X
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
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  atsScore,
  jdMatchScore,
  criticalIssuesCount = 0,
  pendingSuggestionsCount = 0,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Overview & Health',
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: atsScore !== undefined ? `${atsScore}%` : undefined,
      badgeVariant: (atsScore ?? 0) >= 80 ? 'success' : (atsScore ?? 0) >= 60 ? 'warning' : 'danger'
    },
    {
      id: 'ats',
      label: 'ATS Analysis',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: criticalIssuesCount > 0 ? `${criticalIssuesCount} alerts` : 'Passing',
      badgeVariant: criticalIssuesCount > 0 ? 'danger' : 'success'
    },
    {
      id: 'jd',
      label: 'Job Matcher & Keywords',
      icon: <Target className="w-4 h-4" />,
      badge: jdMatchScore !== undefined ? `${jdMatchScore}%` : 'Unmatched',
      badgeVariant: jdMatchScore !== undefined ? 'brand' : 'neutral'
    },
    {
      id: 'ai',
      label: 'AI Bullet Optimizer',
      icon: <Sparkles className="w-4 h-4" />,
      badge: pendingSuggestionsCount > 0 ? `${pendingSuggestionsCount} fixes` : undefined,
      badgeVariant: 'brand'
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

  const handleTabClick = (id: NavTab) => {
    onSelectTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  const navContent = (
    <div className="space-y-6">
      <div className="space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
          Navigation
        </span>
        <div className="space-y-1">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id as NavTab)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-600/15 text-brand-400 border border-brand-500/30 shadow-sm shadow-brand-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-brand-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <Badge variant={item.badgeVariant as any} size="sm">
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mini Diagnostic Widget */}
      <div className="p-3.5 rounded-2xl bg-slate-850/80 border border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300">ATS Status</span>
          <span className={`text-[11px] font-bold ${
            (atsScore ?? 0) >= 80 ? 'text-emerald-400' : (atsScore ?? 0) >= 60 ? 'text-amber-400' : 'text-rose-400'
          }`}>
            {(atsScore ?? 0) >= 80 ? 'Optimal' : (atsScore ?? 0) >= 60 ? 'Needs Work' : 'Critical Gaps'}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {criticalIssuesCount > 0
            ? `${criticalIssuesCount} structural ATS formatting issues detected.`
            : 'Your resume passes critical ATS parsing rules with high readability.'}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. DESKTOP SIDEBAR (Visible on md and above) */}
      <aside className="hidden md:block w-64 lg:w-72 shrink-0 p-4 border-r border-slate-800 bg-slate-900/60 min-h-[calc(100vh-4rem)] no-print">
        {navContent}
      </aside>

      {/* 2. MOBILE DRAWER (Slide-over when hamburger is tapped) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
          />
          
          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-slate-900 border-r border-slate-800 h-full p-4 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <span className="text-sm font-bold text-white">Menu Navigation</span>
                <button
                  onClick={onCloseMobile}
                  className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {navContent}
            </div>

            <div className="pt-4 text-center text-[10px] text-slate-500">
              ResumeIQ • Client-Side Architecture
            </div>
          </div>
        </div>
      )}
    </>
  );
};
