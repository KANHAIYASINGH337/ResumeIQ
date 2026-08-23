import React from 'react';
import { FileText, Sparkles, UploadCloud, Download, Settings, Play } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface NavbarProps {
  hasResume: boolean;
  resumeName?: string;
  onTryDemo: () => void;
  onUploadClick: () => void;
  onOpenExport: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  hasResume,
  resumeName,
  onTryDemo,
  onUploadClick,
  onOpenExport,
  onOpenSettings
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center shadow-lg shadow-brand-500/20 text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white tracking-tight">ResumeIQ</span>
              <Badge variant="brand" size="sm">AI ATS v3.0</Badge>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Analyze. Optimize. Get shortlisted.</p>
          </div>
        </div>

        {/* Center / Active Resume Indicator */}
        {hasResume && resumeName && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
            <FileText className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-slate-300 font-medium max-w-[200px] truncate">{resumeName}</span>
            <Badge variant="success" size="sm">Active</Badge>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {!hasResume ? (
            <button
              onClick={onTryDemo}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all"
            >
              <Play className="w-3.5 h-3.5 text-brand-400" />
              <span>Try Demo Resume</span>
            </button>
          ) : (
            <button
              onClick={onTryDemo}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition"
              title="Reset with sample developer data"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Load Demo Data</span>
            </button>
          )}

          <button
            onClick={onUploadClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition"
          >
            <UploadCloud className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Upload Resume</span>
          </button>

          {hasResume && (
            <button
              onClick={onOpenExport}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/20 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
            title="Configure AI API & Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
