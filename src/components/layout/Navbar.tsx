import React, { useState } from 'react';
import { FileText, Sparkles, UploadCloud, Download, Settings, Play, Menu, X, RotateCcw } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface NavbarProps {
  hasResume: boolean;
  resumeName?: string;
  onTryDemo: () => void;
  onUploadClick: () => void;
  onOpenExport: () => void;
  onOpenSettings: () => void;
  onResetToLanding?: () => void;
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  hasResume,
  resumeName,
  onTryDemo,
  onUploadClick,
  onOpenExport,
  onOpenSettings,
  onResetToLanding,
  onToggleMobileMenu,
  isMobileMenuOpen
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        
        {/* Left Brand / Logo & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {hasResume && onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          )}

          <div
            onClick={onResetToLanding}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center shadow-lg shadow-brand-500/20 text-white group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-bold text-white tracking-tight">ResumeIQ</span>
                <Badge variant="brand" size="sm" className="hidden sm:inline-flex">AI ATS v3.0</Badge>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Analyze. Optimize. Get shortlisted.</p>
            </div>
          </div>
        </div>

        {/* Center / Active Resume Indicator (Desktop) */}
        {hasResume && resumeName && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
            <FileText className="w-3.5 h-3.5 text-brand-400 shrink-0" />
            <span className="text-slate-300 font-medium max-w-[160px] truncate">{resumeName}</span>
            <Badge variant="success" size="sm">Active</Badge>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {!hasResume ? (
            <button
              onClick={onTryDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all active:scale-95"
            >
              <Play className="w-3 h-3 text-brand-400 fill-brand-400" />
              <span className="text-[11px] sm:text-xs">Try Demo</span>
            </button>
          ) : (
            <button
              onClick={onResetToLanding}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs border border-slate-800 transition"
              title="Upload new resume or start over"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">New Resume</span>
            </button>
          )}

          <button
            onClick={onUploadClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium transition active:scale-95"
          >
            <UploadCloud className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          {hasResume && (
            <button
              onClick={onOpenExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="p-1.5 sm:p-2 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition"
            title="Configure AI API & Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
