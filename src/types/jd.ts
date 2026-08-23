export interface KeywordMatch {
  keyword: string;
  category: 'programming' | 'framework' | 'backend' | 'frontend' | 'database' | 'tool' | 'cloud' | 'concept' | 'soft_skill';
  foundInResume: boolean;
  resumeFrequency: number;
  jdFrequency: number;
  importance: 'required' | 'preferred' | 'bonus';
  status: 'matched' | 'missing' | 'weak';
  recommendation?: string;
}

export interface JDAnalysisResult {
  jobTitle?: string;
  matchPercentage: number;
  totalJdKeywords: number;
  matchedCount: number;
  missingCount: number;
  weakCount: number;
  keywords: KeywordMatch[];
  matchedKeywords: KeywordMatch[];
  missingKeywords: KeywordMatch[];
  weakKeywords: KeywordMatch[];
  skillsGapSummary: string[];
  tailoringTips: string[];
}
