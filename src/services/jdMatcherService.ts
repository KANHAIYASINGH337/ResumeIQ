import { ResumeData } from '../types/resume';
import { JDAnalysisResult, KeywordMatch } from '../types/jd';

// Comprehensive Dictionary of Keywords categorized
const JD_KEYWORDS_DB = [
  { keyword: 'React', category: 'framework' as const, aliases: ['react.js', 'reactjs'] },
  { keyword: 'TypeScript', category: 'programming' as const, aliases: ['ts'] },
  { keyword: 'JavaScript', category: 'programming' as const, aliases: ['js', 'es6'] },
  { keyword: 'Node.js', category: 'backend' as const, aliases: ['node', 'nodejs'] },
  { keyword: 'Express.js', category: 'backend' as const, aliases: ['express'] },
  { keyword: 'FastAPI', category: 'backend' as const, aliases: [] },
  { keyword: 'Python', category: 'programming' as const, aliases: ['py'] },
  { keyword: 'Java', category: 'programming' as const, aliases: [] },
  { keyword: 'Go', category: 'programming' as const, aliases: ['golang'] },
  { keyword: 'SQL', category: 'database' as const, aliases: ['rdbms'] },
  { keyword: 'PostgreSQL', category: 'database' as const, aliases: ['postgres'] },
  { keyword: 'MongoDB', category: 'database' as const, aliases: ['mongo'] },
  { keyword: 'Redis', category: 'database' as const, aliases: ['cache', 'caching'] },
  { keyword: 'Docker', category: 'tool' as const, aliases: ['container', 'containers'] },
  { keyword: 'Kubernetes', category: 'tool' as const, aliases: ['k8s'] },
  { keyword: 'AWS', category: 'tool' as const, aliases: ['amazon web services', 's3', 'ec2', 'lambda'] },
  { keyword: 'GCP', category: 'tool' as const, aliases: ['google cloud'] },
  { keyword: 'Azure', category: 'tool' as const, aliases: ['microsoft azure'] },
  { keyword: 'GraphQL', category: 'framework' as const, aliases: [] },
  { keyword: 'REST API', category: 'framework' as const, aliases: ['rest', 'restful', 'apis'] },
  { keyword: 'WebSockets', category: 'framework' as const, aliases: ['websocket'] },
  { keyword: 'Microservices', category: 'concept' as const, aliases: ['distributed systems'] },
  { keyword: 'System Design', category: 'concept' as const, aliases: ['architecture', 'high-level design'] },
  { keyword: 'CI/CD', category: 'tool' as const, aliases: ['continuous integration', 'github actions', 'jenkins'] },
  { keyword: 'Git', category: 'tool' as const, aliases: ['github', 'version control'] },
  { keyword: 'Tailwind CSS', category: 'framework' as const, aliases: ['tailwind'] },
  { keyword: 'Next.js', category: 'framework' as const, aliases: ['nextjs'] },
  { keyword: 'Unit Testing', category: 'tool' as const, aliases: ['jest', 'cypress', 'testing', 'tdd'] },
  { keyword: 'Data Structures', category: 'concept' as const, aliases: ['dsa', 'algorithms'] },
  { keyword: 'Agile', category: 'soft_skill' as const, aliases: ['scrum', 'sprint'] },
  { keyword: 'Communication', category: 'soft_skill' as const, aliases: ['collaboration', 'cross-functional'] },
  { keyword: 'Problem Solving', category: 'soft_skill' as const, aliases: ['analytical'] }
];

export function analyzeJobDescription(jdText: string, resume: ResumeData): JDAnalysisResult {
  const jdLower = jdText.toLowerCase();

  // Aggregate all resume text
  const resumeBullets: string[] = [];
  resume.experience.forEach(e => resumeBullets.push(...e.bullets));
  resume.projects.forEach(p => resumeBullets.push(...p.bullets));
  const resumeFullText = [
    resume.personalInfo.fullName,
    resume.personalInfo.headline || '',
    resume.summary,
    resumeBullets.join(' '),
    resume.education.map(e => `${e.degree} ${e.institution}`).join(' '),
    Object.values(resume.skills).flat().join(' ')
  ].join(' ').toLowerCase();

  // Extract Job Title heuristic
  const firstLine = jdText.split(/\r?\n/)[0]?.trim() || '';
  const titleMatch = firstLine.match(/(?:title|role|position)?[:\s-]*([A-Za-z0-9\s/–—]+)/i);
  const jobTitle = titleMatch ? titleMatch[1].slice(0, 45).trim() : 'Software Engineer';

  // Identify sections in JD (Requirements vs Nice to Have)
  const isRequiredSection = (pos: number) => {
    const textBefore = jdLower.slice(0, pos);
    const lastReq = textBefore.lastIndexOf('requirement');
    const lastMust = textBefore.lastIndexOf('must have');
    const lastNice = textBefore.lastIndexOf('nice to have');
    const lastBonus = textBefore.lastIndexOf('preferred');

    const maxReq = Math.max(lastReq, lastMust);
    const maxBonus = Math.max(lastNice, lastBonus);

    if (maxBonus > maxReq && maxBonus !== -1) return false;
    return true;
  };

  const detectedKeywords: KeywordMatch[] = [];

  JD_KEYWORDS_DB.forEach(item => {
    const allVariations = [item.keyword.toLowerCase(), ...item.aliases.map(a => a.toLowerCase())];
    
    // Check frequency in JD
    let jdCount = 0;
    let firstPos = -1;
    allVariations.forEach(term => {
      const regex = new RegExp(`\\b${escapeRegex(term)}\\b`, 'gi');
      const matches = jdLower.match(regex);
      if (matches) {
        jdCount += matches.length;
        if (firstPos === -1) firstPos = jdLower.indexOf(term);
      }
    });

    if (jdCount > 0) {
      // Check frequency in Resume
      let resumeCount = 0;
      allVariations.forEach(term => {
        const regex = new RegExp(`\\b${escapeRegex(term)}\\b`, 'gi');
        const matches = resumeFullText.match(regex);
        if (matches) resumeCount += matches.length;
      });

      const importance = isRequiredSection(firstPos) ? 'required' : 'preferred';
      const foundInResume = resumeCount > 0;

      let status: 'matched' | 'missing' | 'weak' = 'matched';
      let recommendation: string | undefined;

      if (!foundInResume) {
        status = 'missing';
        recommendation = `Target JD references ${item.keyword} (${jdCount}x). If you have truthful experience with it, highlight it in your skills and projects.`;
      } else if (jdCount >= 3 && resumeCount === 1) {
        status = 'weak';
        recommendation = `${item.keyword} is heavily emphasized in JD (${jdCount}x), but only mentioned once in resume. Emphasize it in bullet points if applicable.`;
      }

      detectedKeywords.push({
        keyword: item.keyword,
        category: item.category,
        foundInResume,
        resumeFrequency: resumeCount,
        jdFrequency: jdCount,
        importance,
        status,
        recommendation
      });
    }
  });

  const matchedKeywords = detectedKeywords.filter(k => k.status === 'matched');
  const missingKeywords = detectedKeywords.filter(k => k.status === 'missing');
  const weakKeywords = detectedKeywords.filter(k => k.status === 'weak');

  // Weighted match score: required keywords carry 75% weight, preferred 25%
  let totalWeight = 0;
  let earnedWeight = 0;

  detectedKeywords.forEach(k => {
    const weight = k.importance === 'required' ? 2 : 1;
    totalWeight += weight;
    if (k.status === 'matched') {
      earnedWeight += weight;
    } else if (k.status === 'weak') {
      earnedWeight += weight * 0.7; // partial credit
    }
  });

  const matchPercentage = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 50;

  // Skills Gap Summary & Tailoring Tips
  const skillsGapSummary: string[] = [];
  if (missingKeywords.length > 0) {
    const topMissing = missingKeywords.slice(0, 4).map(k => k.keyword).join(', ');
    skillsGapSummary.push(`Missing key keywords prioritized in JD: ${topMissing}.`);
  }
  if (weakKeywords.length > 0) {
    const topWeak = weakKeywords.map(k => k.keyword).join(', ');
    skillsGapSummary.push(`Core technologies mentioned with low frequency in resume: ${topWeak}.`);
  }
  if (matchedKeywords.length >= 6) {
    skillsGapSummary.push(`Strong overlap on core stack: ${matchedKeywords.slice(0, 5).map(k => k.keyword).join(', ')}.`);
  }

  const tailoringTips: string[] = [
    'Align the top Professional Summary with the role title and primary requirements in this JD.',
    'Reorder your technical skills so the technologies requested by this job appear first in each category.',
    'Never fabricate technologies or experiences. Only add missing keywords where you have genuine practical knowledge.'
  ];

  return {
    jobTitle,
    matchPercentage,
    totalJdKeywords: detectedKeywords.length,
    matchedCount: matchedKeywords.length,
    missingCount: missingKeywords.length,
    weakCount: weakKeywords.length,
    keywords: detectedKeywords,
    matchedKeywords,
    missingKeywords,
    weakKeywords,
    skillsGapSummary,
    tailoringTips
  };
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
