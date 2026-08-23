import React from 'react';
import { Sparkles, Shield, CheckCircle2, FileCheck, ArrowRight, Play, Cpu, Lock, Eye } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Dropzone } from '../upload/Dropzone';

interface HeroSectionProps {
  onFileSelect: (file: File) => void;
  onTryDemo: () => void;
  isLoading: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onFileSelect,
  onTryDemo,
  isLoading
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2">
          <Badge variant="brand" size="md">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen ATS & Recruitment Engine
          </Badge>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
          Analyze. Optimize.{' '}
          <span className="bg-gradient-to-r from-brand-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
            Get Shortlisted.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Uncover exactly why your resume gets filtered out by ATS algorithms. Match against target job descriptions, eliminate keyword gaps, and strengthen engineering bullet points without inventing facts.
        </p>

        {/* Quick CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onTryDemo}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Try Demo Developer Resume</span>
          </button>
          
          <a
            href="#upload-zone"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-semibold text-sm transition"
          >
            <span>Upload Your Resume</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Upload Zone Card */}
      <div id="upload-zone" className="mt-12 max-w-2xl mx-auto">
        <Dropzone onFileSelect={onFileSelect} isLoading={isLoading} />
      </div>

      {/* Feature & Security Badges */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <div className="p-4 rounded-xl bg-slate-850/60 border border-slate-800/80 text-center space-y-1.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
            <Lock className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white">100% Client-Side Privacy</h4>
          <p className="text-[11px] text-slate-400">Parsed directly in your browser. Resumes are never stored on external servers.</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-850/60 border border-slate-800/80 text-center space-y-1.5">
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center mx-auto">
            <Shield className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white">6-Category ATS Scoring</h4>
          <p className="text-[11px] text-slate-400">Strict audits covering keywords, layout parsing, action verbs, and structure.</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-850/60 border border-slate-800/80 text-center space-y-1.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto">
            <Cpu className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white">Target JD Matcher</h4>
          <p className="text-[11px] text-slate-400">Compare against real job posts to find matched, missing, and weak skills.</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-850/60 border border-slate-800/80 text-center space-y-1.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
            <Eye className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white">6-Second Recruiter Scan</h4>
          <p className="text-[11px] text-slate-400">Simulates human hiring manager first-pass scanning behavior.</p>
        </div>
      </div>
    </section>
  );
};
