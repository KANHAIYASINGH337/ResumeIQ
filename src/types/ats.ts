export interface ATSCategoryScore {
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  findings: string[];
  recommendations: string[];
}

export interface ATSRuleCheck {
  id: string;
  category: string;
  rule: string;
  passed: boolean;
  severity: 'high' | 'medium' | 'low';
  details: string;
  fixSuggestion?: string;
}

export interface RecruiterScanItem {
  section: string;
  passed: boolean;
  statusText: string;
  note: string;
}

export interface ATSStats {
  wordCount: number;
  actionVerbsCount: number;
  metricsCount: number;
  skillsCount: number;
  bulletCount: number;
  avgBulletLength: number;
  readingTimeSeconds: number;
}

export interface ATSScoreResult {
  overallScore: number; // 0 - 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  statusText: string;
  categories: {
    compatibility: ATSCategoryScore;  // max 20
    keywords: ATSCategoryScore;       // max 25
    contentQuality: ATSCategoryScore; // max 20
    completeness: ATSCategoryScore;   // max 15
    formatting: ATSCategoryScore;     // max 10
    readability: ATSCategoryScore;    // max 10
  };
  ruleChecks: ATSRuleCheck[];
  recruiterScan: RecruiterScanItem[];
  stats: ATSStats;
  criticalIssues: string[];
  topRecommendations: string[];
}
