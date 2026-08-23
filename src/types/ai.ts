export interface BulletSuggestion {
  id: string;
  section: 'experience' | 'project';
  parentTitle: string;
  originalText: string;
  suggestedText: string;
  rationale: string[];
  strongVerbsUsed: string[];
  status: 'pending' | 'accepted' | 'rejected';
}

export interface SummaryOptimization {
  originalSummary: string;
  improvedSummary: string;
  critique: string[];
  highlightedStrengths: string[];
  status: 'pending' | 'accepted' | 'rejected';
}

export interface ProjectAnalysis {
  projectId: string;
  title: string;
  score: number; // 0 - 100
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  techStackEvaluated: string[];
}

export interface AIOptimizationResult {
  summaryOpt?: SummaryOptimization;
  bulletSuggestions: BulletSuggestion[];
  projectAnalyses: ProjectAnalysis[];
  overallFeedback: string[];
}

export interface AnalysisHistoryItem {
  id: string;
  timestamp: string;
  resumeName: string;
  jobTitleTarget?: string;
  overallScore: number;
  atsScore: number;
  jdMatchScore?: number;
  criticalIssuesCount: number;
  resumeData: any;
}
