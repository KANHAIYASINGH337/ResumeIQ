import { ResumeData } from '../types/resume';
import { AnalysisHistoryItem } from '../types/ai';

const HISTORY_KEY = 'resumeiq_analysis_history';
const DRAFT_KEY = 'resumeiq_active_resume';
const API_CONFIG_KEY = 'resumeiq_api_config';

export function getAnalysisHistory(): AnalysisHistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAnalysisToHistory(
  resume: ResumeData,
  overallScore: number,
  atsScore: number,
  jdMatchScore?: number,
  criticalIssuesCount: number = 0,
  jobTitleTarget?: string
): AnalysisHistoryItem {
  const history = getAnalysisHistory();
  const newItem: AnalysisHistoryItem = {
    id: `history-${Date.now()}`,
    timestamp: new Date().toISOString(),
    resumeName: resume.versionName || resume.personalInfo.fullName || 'Software Engineer Resume',
    jobTitleTarget: jobTitleTarget || 'Target Software Role',
    overallScore,
    atsScore,
    jdMatchScore,
    criticalIssuesCount,
    resumeData: JSON.parse(JSON.stringify(resume))
  };

  // Keep latest 25 scans
  const updated = [newItem, ...history.filter(h => h.id !== newItem.id)].slice(0, 25);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return newItem;
}

export function deleteAnalysisItem(id: string): AnalysisHistoryItem[] {
  const history = getAnalysisHistory().filter(h => h.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return history;
}

export function saveActiveResumeDraft(resume: ResumeData): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(resume));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
}

export function loadActiveResumeDraft(): ResumeData | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export interface VersionComparisonDiff {
  v1: AnalysisHistoryItem;
  v2: AnalysisHistoryItem;
  overallScoreDiff: number;
  atsScoreDiff: number;
  jdMatchDiff: number;
  criticalIssuesDiff: number;
  improvedSummary: string[];
}

export function compareResumeVersions(v1Id: string, v2Id: string): VersionComparisonDiff | null {
  const history = getAnalysisHistory();
  const v1 = history.find(h => h.id === v1Id);
  const v2 = history.find(h => h.id === v2Id);

  if (!v1 || !v2) return null;

  const overallScoreDiff = v2.overallScore - v1.overallScore;
  const atsScoreDiff = v2.atsScore - v1.atsScore;
  const jdMatchDiff = (v2.jdMatchScore || 0) - (v1.jdMatchScore || 0);
  const criticalIssuesDiff = v1.criticalIssuesCount - v2.criticalIssuesCount;

  const improvedSummary: string[] = [];
  if (overallScoreDiff > 0) improvedSummary.push(`Overall Score improved by +${overallScoreDiff}%`);
  if (atsScoreDiff > 0) improvedSummary.push(`ATS Score climbed from ${v1.atsScore}% to ${v2.atsScore}%`);
  if (jdMatchDiff > 0) improvedSummary.push(`Job Match alignment jumped +${jdMatchDiff}%`);
  if (criticalIssuesDiff > 0) improvedSummary.push(`Resolved ${criticalIssuesDiff} critical ATS issues`);

  return {
    v1,
    v2,
    overallScoreDiff,
    atsScoreDiff,
    jdMatchDiff,
    criticalIssuesDiff,
    improvedSummary
  };
}

export function saveApiConfig(provider: 'gemini' | 'openai' | 'offline', apiKey?: string) {
  localStorage.setItem(API_CONFIG_KEY, JSON.stringify({ provider, apiKey }));
}

export function loadApiConfig(): { provider: 'gemini' | 'openai' | 'offline'; apiKey?: string } {
  try {
    const raw = localStorage.getItem(API_CONFIG_KEY);
    return raw ? JSON.parse(raw) : { provider: 'offline' };
  } catch {
    return { provider: 'offline' };
  }
}
