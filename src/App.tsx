import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { HeroSection } from './components/landing/HeroSection';
import { HealthCard } from './components/dashboard/HealthCard';
import { QuickMetrics } from './components/dashboard/QuickMetrics';
import { RecruiterScanWidget } from './components/dashboard/RecruiterScanWidget';
import { TopRecommendations } from './components/dashboard/TopRecommendations';
import { ATSScoreCard } from './components/ats/ATSScoreCard';
import { ATSRulesCheck } from './components/ats/ATSRulesCheck';
import { JDMatcher } from './components/jd/JDMatcher';
import { BulletOptimizer } from './components/ai/BulletOptimizer';
import { SummaryRewriter } from './components/ai/SummaryRewriter';
import { ProjectStrength } from './components/ai/ProjectStrength';
import { ResumeBuilder } from './components/builder/ResumeBuilder';
import { AnalysisHistory } from './components/history/AnalysisHistory';
import { VersionCompare } from './components/history/VersionCompare';
import { ExtractedReviewModal } from './components/upload/ExtractedReviewModal';
import { ApiKeyModal } from './components/modals/ApiKeyModal';
import { ExportModal } from './components/modals/ExportModal';

import { ResumeData } from './types/resume';
import { ATSScoreResult } from './types/ats';
import { JDAnalysisResult } from './types/jd';
import { AIOptimizationResult, AnalysisHistoryItem } from './types/ai';

import { SAMPLE_RESUME, SAMPLE_JOB_DESCRIPTION } from './data/sampleResume';
import { extractTextFromFile, parseResumeText } from './services/parserService';
import { calculateATSScore } from './services/atsScorerService';
import { analyzeJobDescription } from './services/jdMatcherService';
import { generateAIOptimizations } from './services/aiOptimizerService';
import {
  getAnalysisHistory,
  saveAnalysisToHistory,
  deleteAnalysisItem,
  saveActiveResumeDraft,
  loadActiveResumeDraft,
  clearActiveResumeDraft,
  loadApiConfig
} from './services/storageService';

export function App() {
  // State
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [atsResult, setAtsResult] = useState<ATSScoreResult | null>(null);
  const [jdResult, setJdResult] = useState<JDAnalysisResult | null>(null);
  const [aiResult, setAiResult] = useState<AIOptimizationResult | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Modals
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Initialize draft / history on mount
  useEffect(() => {
    const savedHistory = getAnalysisHistory();
    setHistory(savedHistory);

    const savedDraft = loadActiveResumeDraft();
    if (savedDraft) {
      processResumeData(savedDraft, false);
    }
  }, []);

  // Process & Score Resume
  const processResumeData = async (data: ResumeData, shouldSaveHistory: boolean = true) => {
    setResume(data);
    saveActiveResumeDraft(data);

    const ats = calculateATSScore(data);
    setAtsResult(ats);

    const apiConfig = loadApiConfig();
    const ai = await generateAIOptimizations(data, apiConfig);
    setAiResult(ai);

    if (shouldSaveHistory) {
      saveAnalysisToHistory(
        data,
        ats.overallScore,
        ats.overallScore,
        jdResult ? jdResult.matchPercentage : undefined,
        ats.criticalIssues.length,
        jdResult?.jobTitle
      );
      setHistory(getAnalysisHistory());
    }
  };

  // Upload File Handler
  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    try {
      const rawText = await extractTextFromFile(file);
      const parsedResume = parseResumeText(rawText, file.name);
      setResume(parsedResume);
      const ats = calculateATSScore(parsedResume);
      setAtsResult(ats);
      setIsReviewModalOpen(true);
    } catch (err) {
      console.error('File parsing failed:', err);
      alert('Could not parse resume file. Please ensure it is a valid PDF, DOCX, or TXT format.');
    } finally {
      setIsLoading(false);
    }
  };

  // Confirm extracted data from modal
  const handleConfirmExtractedData = (updated: ResumeData) => {
    setIsReviewModalOpen(false);
    processResumeData(updated, true);
    setActiveTab('dashboard');
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    if (resume) {
      processResumeData(resume, true);
    }
  };

  // Try Demo Handler
  const handleTryDemo = () => {
    const demoData = JSON.parse(JSON.stringify(SAMPLE_RESUME));
    processResumeData(demoData, true);

    const jdRes = analyzeJobDescription(SAMPLE_JOB_DESCRIPTION, demoData);
    setJdResult(jdRes);

    setActiveTab('dashboard');
  };

  // Reset to Landing / Upload fresh
  const handleResetToLanding = () => {
    clearActiveResumeDraft();
    setResume(null);
    setAtsResult(null);
    setJdResult(null);
    setAiResult(null);
  };

  // Update Resume in Builder
  const handleUpdateResume = (updated: ResumeData) => {
    setResume(updated);
    saveActiveResumeDraft(updated);
    const ats = calculateATSScore(updated);
    setAtsResult(ats);
  };

  // Accept AI Bullet Suggestion
  const handleAcceptBullet = (suggestionId: string) => {
    if (!aiResult || !resume) return;

    const suggestion = aiResult.bulletSuggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;

    const copy = JSON.parse(JSON.stringify(resume)) as ResumeData;

    // Update in experience
    copy.experience.forEach(exp => {
      exp.bullets = exp.bullets.map(b => b === suggestion.originalText ? suggestion.suggestedText : b);
    });

    // Update in projects
    copy.projects.forEach(proj => {
      proj.bullets = proj.bullets.map(b => b === suggestion.originalText ? suggestion.suggestedText : b);
    });

    // Mark as accepted in AI result
    const updatedSuggestions = aiResult.bulletSuggestions.map(s =>
      s.id === suggestionId ? { ...s, status: 'accepted' as const } : s
    );
    setAiResult({ ...aiResult, bulletSuggestions: updatedSuggestions });

    handleUpdateResume(copy);
  };

  // Reject AI Bullet Suggestion
  const handleRejectBullet = (suggestionId: string) => {
    if (!aiResult) return;
    const updatedSuggestions = aiResult.bulletSuggestions.map(s =>
      s.id === suggestionId ? { ...s, status: 'rejected' as const } : s
    );
    setAiResult({ ...aiResult, bulletSuggestions: updatedSuggestions });
  };

  // Accept All Pending Bullet Suggestions
  const handleAcceptAllBullets = () => {
    if (!aiResult || !resume) return;
    const copy = JSON.parse(JSON.stringify(resume)) as ResumeData;

    aiResult.bulletSuggestions.forEach(s => {
      if (s.status === 'pending') {
        copy.experience.forEach(exp => {
          exp.bullets = exp.bullets.map(b => b === s.originalText ? s.suggestedText : b);
        });
        copy.projects.forEach(proj => {
          proj.bullets = proj.bullets.map(b => b === s.originalText ? s.suggestedText : b);
        });
      }
    });

    const updatedSuggestions = aiResult.bulletSuggestions.map(s => ({
      ...s,
      status: 'accepted' as const
    }));
    setAiResult({ ...aiResult, bulletSuggestions: updatedSuggestions });

    handleUpdateResume(copy);
  };

  // Apply AI Enhanced Summary
  const handleApplySummary = (improvedSummary: string) => {
    if (!resume) return;
    const copy = { ...resume, summary: improvedSummary };
    if (aiResult?.summaryOpt) {
      setAiResult({
        ...aiResult,
        summaryOpt: { ...aiResult.summaryOpt, status: 'accepted' }
      });
    }
    handleUpdateResume(copy);
  };

  // Update JD Result
  const handleUpdateJDResult = (result: JDAnalysisResult, jdText: string) => {
    setJdResult(result);
    if (resume && atsResult) {
      saveAnalysisToHistory(
        resume,
        atsResult.overallScore,
        atsResult.overallScore,
        result.matchPercentage,
        atsResult.criticalIssues.length,
        result.jobTitle
      );
      setHistory(getAnalysisHistory());
    }
  };

  // Load from History
  const handleLoadHistoryItem = (item: AnalysisHistoryItem) => {
    processResumeData(item.resumeData, false);
    setActiveTab('dashboard');
  };

  // Delete from History
  const handleDeleteHistoryItem = (id: string) => {
    const updated = deleteAnalysisItem(id);
    setHistory(updated);
  };

  const pendingBulletCount = aiResult ? aiResult.bulletSuggestions.filter(s => s.status === 'pending').length : 0;

  const mobileNavPills: { id: NavTab; label: string }[] = [
    { id: 'dashboard', label: 'Overview' },
    { id: 'ats', label: 'ATS Breakdown' },
    { id: 'jd', label: 'Job Matcher' },
    { id: 'ai', label: 'AI Optimizer' },
    { id: 'builder', label: 'Resume Builder' },
    { id: 'history', label: 'History' },
    { id: 'compare', label: 'Compare' }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white overflow-x-hidden">
      
      {/* Top Navigation Bar */}
      <Navbar
        hasResume={Boolean(resume)}
        resumeName={resume?.versionName}
        onTryDemo={handleTryDemo}
        onUploadClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.pdf,.docx,.txt';
          input.onchange = (e: any) => {
            if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
          };
          input.click();
        }}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenSettings={() => setIsApiKeyModalOpen(true)}
        onResetToLanding={handleResetToLanding}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Mobile Horizontal Quick-Nav Scroll Bar */}
      {resume && (
        <div className="md:hidden sticky top-14 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-2 py-2 overflow-x-auto no-scrollbar flex gap-1.5 shadow-md">
          {mobileNavPills.map(pill => (
            <button
              key={pill.id}
              onClick={() => setActiveTab(pill.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === pill.id
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Layout Body */}
      {!resume ? (
        // Landing Hero View if no resume loaded
        <main className="flex-1">
          <HeroSection
            onFileSelect={handleFileSelect}
            onTryDemo={handleTryDemo}
            isLoading={isLoading}
          />
        </main>
      ) : (
        // Dashboard / Workspace View
        <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
          
          {/* Left Sidebar Navigation (Desktop + Mobile Drawer) */}
          <Sidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            atsScore={atsResult?.overallScore}
            jdMatchScore={jdResult?.matchPercentage}
            criticalIssuesCount={atsResult?.criticalIssues.length || 0}
            pendingSuggestionsCount={pendingBulletCount}
            isOpenMobile={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />

          {/* Center Workspace Content Area */}
          <main className="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-y-auto space-y-6 max-w-full">
            
            {/* 1. OVERVIEW & HEALTH DASHBOARD */}
            {activeTab === 'dashboard' && atsResult && (
              <div className="space-y-5 sm:space-y-6 animate-in fade-in">
                <HealthCard
                  atsResult={atsResult}
                  onNavigateTab={setActiveTab}
                />

                <QuickMetrics
                  stats={atsResult.stats}
                  criticalIssuesCount={atsResult.criticalIssues.length}
                  onNavigateTab={setActiveTab}
                />

                <RecruiterScanWidget items={atsResult.recruiterScan} />

                <TopRecommendations
                  recommendations={atsResult.topRecommendations}
                  onNavigateTab={setActiveTab}
                />
              </div>
            )}

            {/* 2. ATS ANALYSIS DEEP DIVE */}
            {activeTab === 'ats' && atsResult && (
              <div className="space-y-5 sm:space-y-6 animate-in fade-in">
                <ATSScoreCard atsResult={atsResult} />
                <ATSRulesCheck
                  rules={atsResult.ruleChecks}
                  onFixWithAI={() => setActiveTab('ai')}
                />
              </div>
            )}

            {/* 3. JOB DESCRIPTION MATCHER */}
            {activeTab === 'jd' && (
              <div className="animate-in fade-in">
                <JDMatcher
                  resume={resume}
                  jdResult={jdResult}
                  onUpdateJDResult={handleUpdateJDResult}
                  onNavigateTab={setActiveTab}
                />
              </div>
            )}

            {/* 4. AI OPTIMIZER & BULLETS */}
            {activeTab === 'ai' && aiResult && (
              <div className="space-y-5 sm:space-y-6 animate-in fade-in">
                <SummaryRewriter
                  summaryOpt={aiResult.summaryOpt}
                  onApplySummary={handleApplySummary}
                />

                <BulletOptimizer
                  suggestions={aiResult.bulletSuggestions}
                  onAccept={handleAcceptBullet}
                  onReject={handleRejectBullet}
                  onAcceptAll={handleAcceptAllBullets}
                />

                <ProjectStrength analyses={aiResult.projectAnalyses} />
              </div>
            )}

            {/* 5. RESUME BUILDER & TEMPLATES */}
            {activeTab === 'builder' && (
              <div className="animate-in fade-in">
                <ResumeBuilder
                  resume={resume}
                  onUpdateResume={handleUpdateResume}
                />
              </div>
            )}

            {/* 6. ANALYSIS HISTORY */}
            {activeTab === 'history' && (
              <div className="animate-in fade-in">
                <AnalysisHistory
                  history={history}
                  onLoadItem={handleLoadHistoryItem}
                  onDeleteItem={handleDeleteHistoryItem}
                  onCompareWithCurrent={() => {
                    setActiveTab('compare');
                  }}
                />
              </div>
            )}

            {/* 7. VERSION COMPARISON */}
            {activeTab === 'compare' && atsResult && (
              <div className="animate-in fade-in">
                <VersionCompare
                  currentResume={resume}
                  currentAtsScore={atsResult.overallScore}
                  currentJdScore={jdResult?.matchPercentage}
                  history={history}
                />
              </div>
            )}

          </main>

        </div>
      )}

      {/* Review Extracted Data Modal */}
      {resume && (
        <ExtractedReviewModal
          resume={resume}
          isOpen={isReviewModalOpen}
          onClose={handleCloseReviewModal}
          onSaveAndAnalyze={handleConfirmExtractedData}
        />
      )}

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSaved={() => {
          if (resume) processResumeData(resume, false);
        }}
      />

      {/* Export Modal */}
      {resume && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          resume={resume}
        />
      )}

    </div>
  );
}
