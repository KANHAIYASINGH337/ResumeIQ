import React, { useState } from 'react';
import { Target, Sparkles, CheckCircle2, XCircle, AlertTriangle, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { ResumeData } from '../../types/resume';
import { JDAnalysisResult } from '../../types/jd';
import { analyzeJobDescription } from '../../services/jdMatcherService';
import { SAMPLE_JOB_DESCRIPTION } from '../../data/sampleResume';
import { CircularScore } from '../ui/CircularScore';
import { Badge } from '../ui/Badge';

interface JDMatcherProps {
  resume: ResumeData;
  jdResult: JDAnalysisResult | null;
  onUpdateJDResult: (result: JDAnalysisResult, jdText: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const JDMatcher: React.FC<JDMatcherProps> = ({
  resume,
  jdResult,
  onUpdateJDResult,
  onNavigateTab
}) => {
  const [jdInputText, setJdInputText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const handleAnalyze = () => {
    if (!jdInputText.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = analyzeJobDescription(jdInputText, resume);
      onUpdateJDResult(result, jdInputText);
      setIsAnalyzing(false);
    }, 400);
  };

  const handleLoadSampleJD = () => {
    setJdInputText(SAMPLE_JOB_DESCRIPTION);
    const result = analyzeJobDescription(SAMPLE_JOB_DESCRIPTION, resume);
    onUpdateJDResult(result, SAMPLE_JOB_DESCRIPTION);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Job Description Matcher & Keyword Gap</h3>
          <p className="text-xs text-slate-400">
            Compare your resume against a target role to identify matched, missing, and underrepresented skills
          </p>
        </div>

        <button
          onClick={handleLoadSampleJD}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold transition"
        >
          <BookOpen className="w-3.5 h-3.5 text-brand-400" />
          <span>Load Sample Tech Job Description</span>
        </button>
      </div>

      {/* Input Form Card */}
      <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 shadow-xl space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
          Target Job Description / Requirements
        </label>

        <textarea
          rows={5}
          value={jdInputText}
          onChange={e => setJdInputText(e.target.value)}
          placeholder="Paste the full job posting, key responsibilities, and technical requirements here..."
          className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {jdInputText.split(/\s+/).filter(Boolean).length} words entered
          </span>

          <button
            onClick={handleAnalyze}
            disabled={!jdInputText.trim() || isAnalyzing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-brand-600/30 transition"
          >
            <Target className="w-4 h-4" />
            <span>{isAnalyzing ? 'Matching Keywords...' : 'Analyze Match & Keywords'}</span>
          </button>
        </div>
      </div>

      {/* Analysis Results View */}
      {jdResult && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Top Score Banner */}
          <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <CircularScore
                score={jdResult.matchPercentage}
                size={130}
                strokeWidth={9}
                label="Job Match"
              />
              <div className="text-center mt-2">
                <span className={`text-xs font-bold ${
                  jdResult.matchPercentage >= 75 ? 'text-emerald-400' : jdResult.matchPercentage >= 55 ? 'text-brand-400' : 'text-amber-400'
                }`}>
                  {jdResult.matchPercentage >= 75 ? 'Strong Role Alignment' : 'Moderate Match — Skill Gaps'}
                </span>
              </div>
            </div>

            <div className="md:col-span-8 space-y-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Analyzed Target Role</span>
                <h4 className="text-base font-bold text-white mt-0.5">{jdResult.jobTitle || 'Software Engineer'}</h4>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <span className="text-xl font-bold text-emerald-400">{jdResult.matchedCount}</span>
                  <p className="text-[11px] text-slate-400 font-medium">Matched Skills</p>
                </div>
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
                  <span className="text-xl font-bold text-rose-400">{jdResult.missingCount}</span>
                  <p className="text-[11px] text-slate-400 font-medium">Missing Keywords</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                  <span className="text-xl font-bold text-amber-400">{jdResult.weakCount}</span>
                  <p className="text-[11px] text-slate-400 font-medium">Underrepresented</p>
                </div>
              </div>

              {/* Anti-Stuffing Warning Notice */}
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-sky-400" />
                <span>
                  <b>Ethical ATS Rule:</b> Only incorporate missing keywords if you have genuine experience with them. Never fabricate skills.
                </span>
              </div>
            </div>

          </div>

          {/* Keywords Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Matched Keywords (Green) */}
            <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white">Matched Keywords ({jdResult.matchedKeywords.length})</h4>
                </div>
                <Badge variant="success" size="sm">Present in Resume</Badge>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {jdResult.matchedKeywords.length === 0 ? (
                  <p className="text-xs text-slate-400">No overlapping keywords found with JD.</p>
                ) : (
                  jdResult.matchedKeywords.map((k, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold"
                    >
                      <span>{k.keyword}</span>
                      <span className="text-[10px] opacity-70 font-mono">({k.resumeFrequency}x in resume)</span>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Missing Keywords (Red) */}
            <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <h4 className="text-sm font-bold text-white">Missing Keywords ({jdResult.missingKeywords.length})</h4>
                </div>
                <Badge variant="danger" size="sm">Missing in Resume</Badge>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {jdResult.missingKeywords.length === 0 ? (
                  <p className="text-xs text-emerald-400 font-medium">Awesome! Zero critical skill gaps identified.</p>
                ) : (
                  jdResult.missingKeywords.map((k, idx) => (
                    <div
                      key={idx}
                      className="group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold"
                      title={k.recommendation}
                    >
                      <span>{k.keyword}</span>
                      <span className="text-[10px] opacity-70 font-mono">({k.jdFrequency}x in JD)</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Underrepresented Keywords */}
          {jdResult.weakKeywords.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white">Underrepresented Keywords</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {jdResult.weakKeywords.map((k, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-amber-300">
                      <span>{k.keyword}</span>
                      <span className="text-[11px] font-mono text-slate-400">{k.resumeFrequency}x resume vs {k.jdFrequency}x in JD</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{k.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
