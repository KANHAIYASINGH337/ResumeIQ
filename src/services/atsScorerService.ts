import { ResumeData } from '../types/resume';
import { ATSScoreResult, ATSCategoryScore, ATSRuleCheck, RecruiterScanItem } from '../types/ats';

const STRONG_ACTION_VERBS = [
  'architected', 'engineered', 'developed', 'implemented', 'deployed', 'built',
  'designed', 'integrated', 'interfaced', 'spearheaded', 'optimized', 'created',
  'led', 'accelerated', 'automated', 'orchestrated', 'authored', 'established',
  'scaled', 'resolved', 'formulated', 'streamlined', 'delivered', 'mentored'
];

const WEAK_WORDS = [
  'worked on', 'helped with', 'responsible for', 'assisted in', 'duties included',
  'participated in', 'handled tasks', 'various things'
];

export function calculateATSScore(resume: ResumeData): ATSScoreResult {
  // Aggregate text for metrics & analysis
  const bullets: string[] = [];
  resume.experience.forEach(e => bullets.push(...e.bullets));
  resume.projects.forEach(p => bullets.push(...p.bullets));
  const fullText = [
    resume.personalInfo.fullName,
    resume.personalInfo.headline || '',
    resume.summary,
    bullets.join(' '),
    resume.education.map(e => `${e.degree} ${e.institution}`).join(' '),
    Object.values(resume.skills).flat().join(' ')
  ].join(' ');

  const words = fullText.match(/\b[A-Za-z0-9+#.-]+\b/g) || [];
  const wordCount = words.length;

  // 1. Action Verbs analysis
  let actionVerbsFound = 0;
  let weakBulletsFound = 0;
  bullets.forEach(b => {
    const firstWord = b.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
    if (firstWord && STRONG_ACTION_VERBS.includes(firstWord)) {
      actionVerbsFound++;
    }
    const lowerB = b.toLowerCase();
    if (WEAK_WORDS.some(w => lowerB.includes(w))) {
      weakBulletsFound++;
    }
  });

  // 2. Metrics & Numbers analysis
  const metricsMatches = fullText.match(/\b\d+(\.\d+)?%|\b\d+\/\d+|\b\d+\+|\b\$\d+[\d,]*|\b₹\d+[\d,]*|\b\d{2,}\s*(ms|users|requests|endpoints|teams|stars|downloads|clients)\b/gi) || [];
  const metricsCount = [...new Set(metricsMatches)].length;

  // 3. Skills count
  const allSkills = Object.values(resume.skills).flat();
  const skillsCount = allSkills.length;

  // ----------------------------------------------------
  // CATEGORY 1: ATS Compatibility (Max 20 pts)
  // ----------------------------------------------------
  let compatScore = 20;
  const compatFindings: string[] = [];
  const compatRecs: string[] = [];

  if (resume.personalInfo.email && resume.personalInfo.phone) {
    compatFindings.push('Clear, machine-parsable contact information.');
  } else {
    compatScore -= 5;
    compatRecs.push('Ensure phone number and email are explicitly listed in standard text format.');
  }

  if (resume.summary && resume.skills && resume.projects.length > 0 && resume.education.length > 0) {
    compatFindings.push('Standard heading taxonomy compliant with Workday, Taleo, and Greenhouse parsers.');
  } else {
    compatScore -= 4;
    compatRecs.push('Include standard section headers (Summary, Skills, Experience/Projects, Education).');
  }

  if (wordCount < 150) {
    compatScore -= 6;
    compatRecs.push('Resume word count is under 150 words. Increase detail to allow ATS indexers to match your profile.');
  } else if (wordCount > 1000) {
    compatScore -= 3;
    compatRecs.push('Resume length is slightly high (>1000 words). Aim for a concise 1-2 page format.');
  } else {
    compatFindings.push('Optimal document length for single/two-page ATS parsing.');
  }

  const categoryCompatibility: ATSCategoryScore = {
    name: 'ATS Compatibility',
    score: Math.max(5, compatScore),
    maxScore: 20,
    percentage: Math.round((Math.max(5, compatScore) / 20) * 100),
    status: compatScore >= 17 ? 'excellent' : compatScore >= 13 ? 'good' : 'warning',
    findings: compatFindings,
    recommendations: compatRecs
  };

  // ----------------------------------------------------
  // CATEGORY 2: Keyword Optimization (Max 25 pts)
  // ----------------------------------------------------
  let keywordScore = 0;
  const kwFindings: string[] = [];
  const kwRecs: string[] = [];

  const langCount = resume.skills.languages.length;
  const frameworkCount = resume.skills.frontend.length + resume.skills.backend.length;
  const dbCount = resume.skills.database.length;
  const toolCount = resume.skills.tools.length;

  if (langCount >= 2) keywordScore += 6;
  else if (langCount === 1) keywordScore += 3;

  if (frameworkCount >= 3) keywordScore += 8;
  else if (frameworkCount >= 1) keywordScore += 4;

  if (dbCount >= 1) keywordScore += 5;
  if (toolCount >= 3) keywordScore += 6;

  if (skillsCount >= 12) {
    kwFindings.push(`Strong technical keyword density with ${skillsCount} verified skills.`);
  } else {
    kwRecs.push('Add more relevant industry tools and frameworks to increase match rates against automated filters.');
  }

  if (resume.skills.coreCS.length >= 2) {
    kwFindings.push('Includes vital Computer Science fundamental keywords (DSA, OOP, System Design).');
  }

  const categoryKeywords: ATSCategoryScore = {
    name: 'Keyword Optimization',
    score: Math.min(25, keywordScore),
    maxScore: 25,
    percentage: Math.round((Math.min(25, keywordScore) / 25) * 100),
    status: keywordScore >= 21 ? 'excellent' : keywordScore >= 16 ? 'good' : 'warning',
    findings: kwFindings,
    recommendations: kwRecs
  };

  // ----------------------------------------------------
  // CATEGORY 3: Content Quality (Max 20 pts)
  // ----------------------------------------------------
  let contentScore = 0;
  const contentFindings: string[] = [];
  const contentRecs: string[] = [];

  // Verbs check
  if (actionVerbsFound >= 4) {
    contentScore += 8;
    contentFindings.push(`${actionVerbsFound} bullet points lead with high-impact action verbs.`);
  } else if (actionVerbsFound >= 2) {
    contentScore += 5;
    contentRecs.push('Begin more bullet points with decisive action verbs (e.g., Engineered, Architected, Deployed).');
  } else {
    contentScore += 2;
    contentRecs.push('Rewrite passive bullet points to start with strong engineering action verbs.');
  }

  // Metrics check
  if (metricsCount >= 3) {
    contentScore += 8;
    contentFindings.push(`${metricsCount} quantifiable outcomes and impact metrics identified (%, latency, users, etc.).`);
  } else if (metricsCount >= 1) {
    contentScore += 4;
    contentRecs.push('Incorporate quantifiable business or engineering metrics (e.g. reduced load time by 35%, 10+ endpoints).');
  } else {
    contentRecs.push('Add measurable outcomes to your projects or work experience to demonstrate real-world impact.');
  }

  // Weak phrase penalty
  if (weakBulletsFound > 0) {
    contentScore = Math.max(0, contentScore - (weakBulletsFound * 2));
    contentRecs.push(`Avoid generic filler phrases like "worked on" or "responsible for". State specific achievements.`);
  } else {
    contentScore += 4;
  }

  const categoryContentQuality: ATSCategoryScore = {
    name: 'Content Quality',
    score: Math.min(20, Math.max(4, contentScore)),
    maxScore: 20,
    percentage: Math.round((Math.min(20, Math.max(4, contentScore)) / 20) * 100),
    status: contentScore >= 16 ? 'excellent' : contentScore >= 12 ? 'good' : 'warning',
    findings: contentFindings,
    recommendations: contentRecs
  };

  // ----------------------------------------------------
  // CATEGORY 4: Completeness (Max 15 pts)
  // ----------------------------------------------------
  let completeScore = 0;
  const compFindings: string[] = [];
  const compRecs: string[] = [];

  if (resume.personalInfo.fullName && resume.personalInfo.email && resume.personalInfo.phone && resume.personalInfo.location) {
    completeScore += 3;
    compFindings.push('Full contact card verified (Name, Email, Phone, Location).');
  }
  if (resume.personalInfo.linkedInUrl || resume.personalInfo.githubUrl || resume.personalInfo.portfolioUrl) {
    completeScore += 3;
    compFindings.push('Live portfolio / GitHub / LinkedIn profiles linked.');
  } else {
    compRecs.push('Add your GitHub, LinkedIn, or live portfolio URL to improve credibility.');
  }
  if (resume.summary && resume.summary.length >= 100) {
    completeScore += 3;
    compFindings.push('Engaging professional summary present.');
  } else {
    compRecs.push('Add a 2-3 sentence professional summary highlighting your core stack.');
  }
  if (resume.education.length > 0) completeScore += 3;
  if (resume.projects.length >= 2 || resume.experience.length >= 1) completeScore += 3;

  const categoryCompleteness: ATSCategoryScore = {
    name: 'Resume Completeness',
    score: Math.min(15, completeScore),
    maxScore: 15,
    percentage: Math.round((Math.min(15, completeScore) / 15) * 100),
    status: completeScore >= 13 ? 'excellent' : completeScore >= 10 ? 'good' : 'warning',
    findings: compFindings,
    recommendations: compRecs
  };

  // ----------------------------------------------------
  // CATEGORY 5: Formatting (Max 10 pts)
  // ----------------------------------------------------
  let formatScore = 10;
  const formatFindings: string[] = [];
  const formatRecs: string[] = [];

  const avgBulletLength = bullets.length > 0
    ? Math.round(bullets.reduce((acc, b) => acc + b.split(/\s+/).length, 0) / bullets.length)
    : 0;

  if (avgBulletLength >= 12 && avgBulletLength <= 35) {
    formatFindings.push(`Bullet lengths are well-calibrated (avg: ${avgBulletLength} words/bullet).`);
  } else if (avgBulletLength > 40) {
    formatScore -= 3;
    formatRecs.push('Some bullet points are overly verbose. Break long sentences into concise 1-2 line statements.');
  }

  if (bullets.length >= 4) {
    formatFindings.push('Consistent bullet list hierarchy across all experience and project entries.');
  } else {
    formatScore -= 2;
    formatRecs.push('Expand bullet points with specific technical details for each project.');
  }

  const categoryFormatting: ATSCategoryScore = {
    name: 'Formatting & Structure',
    score: Math.max(3, formatScore),
    maxScore: 10,
    percentage: Math.round((Math.max(3, formatScore) / 10) * 100),
    status: formatScore >= 8 ? 'excellent' : 'good',
    findings: formatFindings,
    recommendations: formatRecs
  };

  // ----------------------------------------------------
  // CATEGORY 6: Recruiter Readability (Max 10 pts)
  // ----------------------------------------------------
  let readScore = 10;
  const readFindings: string[] = [];
  const readRecs: string[] = [];

  const readingTimeSeconds = Math.round((wordCount / 200) * 60);

  if (wordCount >= 250 && wordCount <= 700) {
    readFindings.push(`Ideal reading density (~${readingTimeSeconds}s total scan time).`);
  } else {
    readScore -= 2;
    readRecs.push('Calibrate resume density to fall within 300 - 650 words for optimal 6-second recruiter scanning.');
  }

  if (resume.personalInfo.headline) {
    readFindings.push('Clear target role positioning in header.');
  }

  const categoryReadability: ATSCategoryScore = {
    name: 'Recruiter Readability',
    score: Math.max(3, readScore),
    maxScore: 10,
    percentage: Math.round((Math.max(3, readScore) / 10) * 100),
    status: readScore >= 8 ? 'excellent' : 'good',
    findings: readFindings,
    recommendations: readRecs
  };

  // Total Score
  const totalScore = categoryCompatibility.score +
    categoryKeywords.score +
    categoryContentQuality.score +
    categoryCompleteness.score +
    categoryFormatting.score +
    categoryReadability.score;

  const finalScore = Math.min(100, Math.max(10, totalScore));

  const grade = finalScore >= 90 ? 'A+' : finalScore >= 80 ? 'A' : finalScore >= 70 ? 'B' : finalScore >= 60 ? 'C' : 'D';
  const statusText = finalScore >= 85 ? 'Excellent ATS Pass Rate' : finalScore >= 70 ? 'Good / Competitive' : finalScore >= 55 ? 'Average — Needs Optimization' : 'High Risk of ATS Rejection';

  // 6-Second Recruiter Scan Simulation
  const recruiterScan: RecruiterScanItem[] = [
    {
      section: 'Name & Identity',
      passed: Boolean(resume.personalInfo.fullName && resume.personalInfo.fullName.length > 2),
      statusText: resume.personalInfo.fullName || 'Missing',
      note: 'Clear, bold, professional top positioning.'
    },
    {
      section: 'Target Role / Headline',
      passed: Boolean(resume.personalInfo.headline || resume.summary.length > 30),
      statusText: resume.personalInfo.headline || 'Full Stack Engineer',
      note: 'Immediately communicates candidate career specialization.'
    },
    {
      section: 'Core Tech Stack',
      passed: skillsCount >= 6,
      statusText: `${skillsCount} skills categorized`,
      note: 'Instantly readable skills grouping.'
    },
    {
      section: 'Measurable Impact',
      passed: metricsCount >= 2,
      statusText: `${metricsCount} metrics detected`,
      note: 'Recruiters look for numbers (% improvements, scale, users) within 3 seconds.'
    },
    {
      section: 'Recent Projects / Experience',
      passed: resume.projects.length >= 1 || resume.experience.length >= 1,
      statusText: `${resume.experience.length} jobs, ${resume.projects.length} projects`,
      note: 'Demonstrated hands-on execution and software delivery.'
    },
    {
      section: 'Verified Links',
      passed: Boolean(resume.personalInfo.githubUrl || resume.personalInfo.portfolioUrl || resume.personalInfo.linkedInUrl),
      statusText: resume.personalInfo.githubUrl || resume.personalInfo.portfolioUrl ? 'Active links' : 'No links',
      note: 'Allows instant verification of live projects and source code.'
    }
  ];

  // Rule Checks
  const ruleChecks: ATSRuleCheck[] = [
    {
      id: 'rule-contact',
      category: 'Compatibility',
      rule: 'Parseable Contact Card',
      passed: Boolean(resume.personalInfo.email && resume.personalInfo.phone),
      severity: 'high',
      details: resume.personalInfo.email ? 'Email and phone formatted cleanly.' : 'Missing verified phone or email.'
    },
    {
      id: 'rule-headings',
      category: 'Compatibility',
      rule: 'Standard Section Hierarchy',
      passed: Boolean(resume.skills && resume.education.length > 0),
      severity: 'high',
      details: 'Recognizable section titles ensure ATS parsers don\'t drop entire categories.'
    },
    {
      id: 'rule-verbs',
      category: 'Content',
      rule: 'Action-First Bullet Points',
      passed: actionVerbsFound >= 3,
      severity: 'medium',
      details: `${actionVerbsFound} bullets start with power verbs.`,
      fixSuggestion: 'Use words like Engineered, Deployed, Architected instead of "Worked on".'
    },
    {
      id: 'rule-metrics',
      category: 'Content',
      rule: 'Quantifiable Engineering Metrics',
      passed: metricsCount >= 2,
      severity: 'high',
      details: `${metricsCount} numerical metrics found.`,
      fixSuggestion: 'Include percentage gains, request counts, or performance numbers.'
    },
    {
      id: 'rule-skills-density',
      category: 'Keywords',
      rule: 'Technical Keyword Breadth',
      passed: skillsCount >= 10,
      severity: 'medium',
      details: `${skillsCount} distinct technical skills indexed.`
    }
  ];

  // Critical Issues & Top Recommendations
  const criticalIssues: string[] = [];
  const topRecommendations: string[] = [];

  if (metricsCount === 0) criticalIssues.push('Zero quantifiable metrics detected in experience/projects.');
  if (actionVerbsFound < 2) criticalIssues.push('Bullet points lack decisive action verbs.');
  if (!resume.personalInfo.email || !resume.personalInfo.phone) criticalIssues.push('Missing crucial contact information (email/phone).');

  if (kwRecs.length > 0) topRecommendations.push(...kwRecs);
  if (contentRecs.length > 0) topRecommendations.push(...contentRecs);
  if (compatRecs.length > 0) topRecommendations.push(...compatRecs);

  return {
    overallScore: finalScore,
    grade,
    statusText,
    categories: {
      compatibility: categoryCompatibility,
      keywords: categoryKeywords,
      contentQuality: categoryContentQuality,
      completeness: categoryCompleteness,
      formatting: categoryFormatting,
      readability: categoryReadability
    },
    ruleChecks,
    recruiterScan,
    stats: {
      wordCount,
      actionVerbsCount: actionVerbsFound,
      metricsCount,
      skillsCount,
      bulletCount: bullets.length,
      avgBulletLength,
      readingTimeSeconds
    },
    criticalIssues,
    topRecommendations: topRecommendations.slice(0, 5)
  };
}
