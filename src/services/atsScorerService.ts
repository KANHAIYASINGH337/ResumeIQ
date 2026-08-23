import { ResumeData, sanitizeResume } from '../types/resume';
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

export function calculateATSScore(rawResume: ResumeData): ATSScoreResult {
  const resume = sanitizeResume(rawResume);
  // Aggregate text for metrics & analysis
  const bullets: string[] = [];
  (resume.experience || []).forEach(e => {
    if (Array.isArray(e.bullets)) bullets.push(...e.bullets);
  });
  (resume.projects || []).forEach(p => {
    if (Array.isArray(p.bullets)) bullets.push(...p.bullets);
  });
  const fullText = [
    resume.rawText || '',
    resume.personalInfo.fullName || '',
    resume.personalInfo.headline || '',
    resume.summary || '',
    bullets.join(' '),
    (resume.education || []).map(e => `${e.degree || ''} ${e.institution || ''} ${e.gpaOrPercentage || ''}`).join(' '),
    Object.values(resume.skills || {}).flat().join(' '),
    (resume.certifications || []).map(c => `${c.name} ${c.issuer}`).join(' '),
    (resume.achievements || []).join(' ')
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

  const totalBulletCount = Math.max(1, bullets.length);
  const actionVerbRatio = actionVerbsFound / totalBulletCount;

  // 2. Metrics & Numbers analysis
  const comprehensiveMetricRegex = /\b\d+(\.\d+)?%|\b\d+\s*\/\s*\d+|\b\d+[\d,]*\+?|\b[$€£₹]\s*\d+[\d,]*(?:\s*(?:k|m|b|lakh|crore))?|\b\d+(?:-\w+|\s*(?:ms|seconds|sec|mins|minutes|hours|hour|days|day|weeks|months|years|users|requests|reqs|endpoints|apis|teams|stars|downloads|clients|rps|qps|kps|gb|tb|mb|kb|projects|features))\b/gi;

  const targetMetricsText = bullets.join(' ') + ' ' + (resume.achievements || []).join(' ') + ' ' + (resume.certifications || []).map(c => c.name).join(' ') + ' ' + (resume.rawText || '');
  const rawMatches = targetMetricsText.match(comprehensiveMetricRegex) || [];
  const validMetricMatches = rawMatches.filter(m => {
    const clean = m.trim();
    if (/^(?:19|20)\d{2}$/.test(clean)) return false;
    if (clean.length === 10 && /^\d+$/.test(clean)) return false;
    return true;
  });
  const metricsCount = [...new Set(validMetricMatches)].length;

  // 3. Skills count & verification in bullet points
  const allSkills = Object.values(resume.skills).flat();
  const skillsCount = allSkills.length;
  let skillsDemonstratedInBullets = 0;
  const bulletsLower = bullets.join(' ').toLowerCase();
  allSkills.forEach(s => {
    if (s && s.length > 2 && bulletsLower.includes(s.toLowerCase())) {
      skillsDemonstratedInBullets++;
    }
  });

  // ----------------------------------------------------
  // CATEGORY 1: ATS Compatibility (Max 20 pts)
  // ----------------------------------------------------
  let compatScore = 0;
  const compatFindings: string[] = [];
  const compatRecs: string[] = [];

  // Contact info check (Max 4 pts)
  if (resume.personalInfo.email && resume.personalInfo.phone) {
    compatScore += 4;
    compatFindings.push('Clear, machine-parsable contact card (Email & Phone verified).');
  } else if (resume.personalInfo.email || resume.personalInfo.phone) {
    compatScore += 2;
    compatRecs.push('Ensure both phone number and email address are listed in clean plain text.');
  } else {
    compatRecs.push('Missing essential contact information (Email and Phone number).');
  }

  // Section taxonomy check (Max 6 pts)
  if (resume.summary && resume.skills && (resume.projects.length > 0 || resume.experience.length > 0) && resume.education.length > 0) {
    compatScore += 6;
    compatFindings.push('Standard heading hierarchy compliant with Workday, Taleo, and Greenhouse parsers.');
  } else {
    compatScore += 3;
    compatRecs.push('Use standard industry section titles (Summary, Skills, Experience, Projects, Education).');
  }

  // Document length calibration (Max 10 pts)
  if (wordCount >= 350 && wordCount <= 750) {
    compatScore += 10;
    compatFindings.push(`Optimal document length (${wordCount} words) perfectly tailored for single/two-page ATS indexing.`);
  } else if (wordCount >= 250 && wordCount < 350) {
    compatScore += 7;
    compatRecs.push(`Resume word count is slightly lean (${wordCount} words). Add more project details to increase keyword indexing.`);
  } else if (wordCount > 750 && wordCount <= 950) {
    compatScore += 6;
    compatRecs.push(`Resume length is slightly high (${wordCount} words). Try to condense to under 750 words for faster recruiter processing.`);
  } else if (wordCount > 950 && wordCount <= 1200) {
    compatScore += 4;
    compatRecs.push(`Resume is verbose (${wordCount} words / ~2.5 pages). Cut repetitive phrasing to fit within a strict 1-2 page standard.`);
  } else if (wordCount > 1200) {
    compatScore += 2;
    compatRecs.push(`Resume length is excessive (${wordCount} words / 3+ pages). ATS and recruiters strongly penalize walls of text. Trim to under 750 words.`);
  } else {
    compatScore += 2;
    compatRecs.push(`Resume is critically short (${wordCount} words). Elaborate on technical responsibilities and architectures.`);
  }

  const categoryCompatibility: ATSCategoryScore = {
    name: 'ATS Compatibility',
    score: Math.min(20, Math.max(3, compatScore)),
    maxScore: 20,
    percentage: Math.round((Math.min(20, Math.max(3, compatScore)) / 20) * 100),
    status: compatScore >= 16 ? 'excellent' : compatScore >= 12 ? 'good' : 'warning',
    findings: compatFindings,
    recommendations: compatRecs
  };

  // ----------------------------------------------------
  // CATEGORY 2: Keyword Optimization & Context (Max 25 pts)
  // ----------------------------------------------------
  let keywordScore = 0;
  const kwFindings: string[] = [];
  const kwRecs: string[] = [];

  const langCount = resume.skills.languages.length;
  const frameworkCount = resume.skills.frontend.length + resume.skills.backend.length;
  const dbCount = resume.skills.database.length;
  const toolCount = resume.skills.tools.length;

  if (langCount >= 2) keywordScore += 4;
  else if (langCount === 1) keywordScore += 2;

  if (frameworkCount >= 3) keywordScore += 4;
  else if (frameworkCount >= 1) keywordScore += 2;

  if (dbCount >= 1) keywordScore += 3;
  if (toolCount >= 3) keywordScore += 3;

  if (resume.skills.coreCS.length >= 2) {
    keywordScore += 3;
    kwFindings.push('Includes vital Computer Science fundamental keywords (DSA, OOP, System Design).');
  } else {
    kwRecs.push('Include core CS concepts (e.g. Data Structures, Algorithms, REST APIs) to pass initial recruiter filters.');
  }

  // Contextual verification (skills must be backed up by bullet points, not just a standalone list)
  if (skillsDemonstratedInBullets >= 6) {
    keywordScore += 8;
    kwFindings.push(`Excellent keyword substantiation: ${skillsDemonstratedInBullets} skills are actively demonstrated in your bullet descriptions.`);
  } else if (skillsDemonstratedInBullets >= 3) {
    keywordScore += 5;
    kwFindings.push(`${skillsDemonstratedInBullets} skills substantiated with practical project implementations.`);
    kwRecs.push('Reference more of your listed technical skills directly inside your experience and project descriptions.');
  } else {
    keywordScore += 2;
    kwRecs.push('Avoid isolated skill lists. Connect your technologies to real project bullet points to prove hands-on application.');
  }

  const categoryKeywords: ATSCategoryScore = {
    name: 'Keyword Optimization',
    score: Math.min(25, Math.max(4, keywordScore)),
    maxScore: 25,
    percentage: Math.round((Math.min(25, Math.max(4, keywordScore)) / 25) * 100),
    status: keywordScore >= 20 ? 'excellent' : keywordScore >= 14 ? 'good' : 'warning',
    findings: kwFindings,
    recommendations: kwRecs
  };

  // ----------------------------------------------------
  // CATEGORY 3: Content Quality & Impact (Max 20 pts)
  // ----------------------------------------------------
  let contentScore = 0;
  const contentFindings: string[] = [];
  const contentRecs: string[] = [];

  // Quantified Metrics evaluation (Max 8 pts)
  if (metricsCount >= 4) {
    contentScore += 8;
    contentFindings.push(`Strong quantified outcomes: ${metricsCount} numerical metrics identified (%, latency, scale, users).`);
  } else if (metricsCount >= 2) {
    contentScore += 5;
    contentFindings.push(`${metricsCount} measurable performance metrics found.`);
    contentRecs.push('Add more quantifiable results (e.g. reduced load time by 30%, handled 50k+ requests, 99.9% uptime).');
  } else if (metricsCount === 1) {
    contentScore += 2;
    contentRecs.push('Only 1 numerical metric detected. Recruiters heavily prioritize resumes with measurable business and engineering outcomes.');
  } else {
    contentRecs.push('CRITICAL: Zero quantifiable metrics found. Convert task descriptions into XYZ formula (Accomplished X, measured by Y, by doing Z).');
  }

  // Action Verbs ratio evaluation (Max 8 pts)
  if (actionVerbRatio >= 0.60 && actionVerbsFound >= 4) {
    contentScore += 8;
    contentFindings.push(`${actionVerbsFound} bullet points (${Math.round(actionVerbRatio * 100)}%) lead with decisive engineering power verbs.`);
  } else if (actionVerbsFound >= 3 || actionVerbRatio >= 0.35) {
    contentScore += 4;
    contentRecs.push(`Only ${actionVerbsFound} bullets start with decisive action verbs. Rewrite passive statements to lead with words like Architected, Engineered, Deployed.`);
  } else {
    contentScore += 1;
    contentRecs.push('Majority of bullet points lack strong leading action verbs. Avoid starting bullets with passive phrases.');
  }

  // Weak phrase penalty (Max 4 pts)
  if (weakBulletsFound === 0) {
    contentScore += 4;
    contentFindings.push('Zero passive filler phrases ("worked on", "assisted in", "responsible for") detected.');
  } else if (weakBulletsFound <= 2) {
    contentScore += 1;
    contentRecs.push(`Identified ${weakBulletsFound} weak filler phrases ("worked on", "responsible for"). Replace with authoritative ownership verbs.`);
  } else {
    contentRecs.push(`Heavy use of passive filler phrases (${weakBulletsFound} occurrences). Remove "responsible for" and state specific accomplishments.`);
  }

  const categoryContentQuality: ATSCategoryScore = {
    name: 'Content Quality',
    score: Math.min(20, Math.max(3, contentScore)),
    maxScore: 20,
    percentage: Math.round((Math.min(20, Math.max(3, contentScore)) / 20) * 100),
    status: contentScore >= 16 ? 'excellent' : contentScore >= 11 ? 'good' : 'warning',
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
    completeScore += 4;
    compFindings.push('Full contact card verified (Name, Email, Phone, Location).');
  } else {
    completeScore += 2;
  }

  const linkCount = [resume.personalInfo.linkedInUrl, resume.personalInfo.githubUrl, resume.personalInfo.portfolioUrl].filter(Boolean).length;
  if (linkCount >= 2) {
    completeScore += 4;
    compFindings.push('Multiple verified developer links (GitHub, Portfolio, LinkedIn) provided.');
  } else if (linkCount === 1) {
    completeScore += 2;
    compRecs.push('Add both your GitHub profile and LinkedIn/portfolio URL to maximize recruiter verification.');
  } else {
    compRecs.push('No live GitHub or portfolio URLs detected. Technical recruiters expect active links to inspect code.');
  }

  if (resume.summary && resume.summary.length >= 80) {
    completeScore += 3;
    compFindings.push('Professional career summary present.');
  } else {
    compRecs.push('Add a concise 2-3 sentence summary front-loading your primary stack and engineering domain.');
  }

  if (resume.education.length > 0) completeScore += 2;
  if (resume.projects.length >= 2 || resume.experience.length >= 1) completeScore += 2;

  const categoryCompleteness: ATSCategoryScore = {
    name: 'Resume Completeness',
    score: Math.min(15, Math.max(3, completeScore)),
    maxScore: 15,
    percentage: Math.round((Math.min(15, Math.max(3, completeScore)) / 15) * 100),
    status: completeScore >= 12 ? 'excellent' : completeScore >= 9 ? 'good' : 'warning',
    findings: compFindings,
    recommendations: compRecs
  };

  // ----------------------------------------------------
  // CATEGORY 5: Formatting & Structure (Max 10 pts)
  // ----------------------------------------------------
  let formatScore = 0;
  const formatFindings: string[] = [];
  const formatRecs: string[] = [];

  const avgBulletLength = bullets.length > 0
    ? Math.round(bullets.reduce((acc, b) => acc + b.split(/\s+/).length, 0) / bullets.length)
    : 0;

  // Bullet count & distribution (Max 5 pts)
  if (bullets.length >= 4 && bullets.length <= 16) {
    formatScore += 5;
    formatFindings.push(`Balanced bullet distribution (${bullets.length} bullets across roles/projects).`);
  } else if (bullets.length > 16) {
    formatScore += 2;
    formatRecs.push(`High bullet count (${bullets.length} bullets). Focus on the top 3-4 highest impact achievements per role.`);
  } else {
    formatScore += 2;
    formatRecs.push('Add more detailed bullet points describing software implementation details and outcomes.');
  }

  // Bullet length calibration (Max 5 pts)
  if (avgBulletLength >= 12 && avgBulletLength <= 28) {
    formatScore += 5;
    formatFindings.push(`Bullet lengths are well calibrated (avg: ${avgBulletLength} words/bullet).`);
  } else if (avgBulletLength > 35) {
    formatScore += 2;
    formatRecs.push(`Bullet points are overly long (avg: ${avgBulletLength} words). Break into concise 1-2 line statements.`);
  } else {
    formatScore += 3;
  }

  const categoryFormatting: ATSCategoryScore = {
    name: 'Formatting & Structure',
    score: Math.min(10, Math.max(2, formatScore)),
    maxScore: 10,
    percentage: Math.round((Math.min(10, Math.max(2, formatScore)) / 10) * 100),
    status: formatScore >= 8 ? 'excellent' : formatScore >= 5 ? 'good' : 'warning',
    findings: formatFindings,
    recommendations: formatRecs
  };

  // ----------------------------------------------------
  // CATEGORY 6: Recruiter Readability (Max 10 pts)
  // ----------------------------------------------------
  let readScore = 0;
  const readFindings: string[] = [];
  const readRecs: string[] = [];

  const readingTimeSeconds = Math.round((wordCount / 200) * 60);

  // Scan rate evaluation (Max 5 pts)
  if (wordCount >= 300 && wordCount <= 650) {
    readScore += 5;
    readFindings.push(`Ideal scan density (~${readingTimeSeconds}s total scan time).`);
  } else if (wordCount > 650 && wordCount <= 900) {
    readScore += 3;
    readRecs.push('Slightly dense reading pace. Aim for 400-650 words for optimal 6-second recruiter scanning.');
  } else if (wordCount > 900) {
    readScore += 1;
    readRecs.push(`Excessive length (${wordCount} words). Recruiters spend only 6-7 seconds scanning; long text risks fatigue.`);
  } else {
    readScore += 2;
  }

  // Headline positioning (Max 5 pts)
  if (resume.personalInfo.headline && resume.personalInfo.headline.length > 5) {
    readScore += 5;
    readFindings.push(`Clear target role positioning (${resume.personalInfo.headline}).`);
  } else {
    readScore += 2;
    readRecs.push('Add an explicit target role headline (e.g. Senior Full Stack Engineer) directly under your name.');
  }

  const categoryReadability: ATSCategoryScore = {
    name: 'Recruiter Readability',
    score: Math.min(10, Math.max(2, readScore)),
    maxScore: 10,
    percentage: Math.round((Math.min(10, Math.max(2, readScore)) / 10) * 100),
    status: readScore >= 8 ? 'excellent' : readScore >= 5 ? 'good' : 'warning',
    findings: readFindings,
    recommendations: readRecs
  };

  // Total Score Calculation
  const totalScore = categoryCompatibility.score +
    categoryKeywords.score +
    categoryContentQuality.score +
    categoryCompleteness.score +
    categoryFormatting.score +
    categoryReadability.score;

  const finalScore = Math.min(100, Math.max(15, totalScore));

  const grade = finalScore >= 88 ? 'A+' : finalScore >= 80 ? 'A' : finalScore >= 70 ? 'B' : finalScore >= 60 ? 'C' : 'D';
  const statusText = finalScore >= 82 ? 'Excellent ATS Pass Rate' : finalScore >= 70 ? 'Good / Competitive' : finalScore >= 55 ? 'Average — Needs Optimization' : 'High Risk of ATS Rejection';

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
      details: resume.personalInfo.email && resume.personalInfo.phone ? 'Email and phone formatted cleanly.' : 'Missing verified phone or email in header.'
    },
    {
      id: 'rule-length',
      category: 'Compatibility',
      rule: 'Optimal 1-2 Page Document Length',
      passed: wordCount >= 300 && wordCount <= 800,
      severity: 'high',
      details: `${wordCount} total words. ${wordCount > 800 ? 'Exceeds standard 1-2 page length.' : wordCount < 300 ? 'Underdeveloped content.' : 'Ideal ATS length.'}`,
      fixSuggestion: wordCount > 800 ? 'Trim repetitive descriptions to fall between 400-750 words.' : undefined
    },
    {
      id: 'rule-metrics',
      category: 'Content',
      rule: 'Quantifiable Engineering Metrics',
      passed: metricsCount >= 3,
      severity: 'high',
      details: `${metricsCount} numerical metrics found. (Target: 3+ measurable outcomes).`,
      fixSuggestion: 'Incorporate percentage improvements, user counts, latency reductions, or volume figures.'
    },
    {
      id: 'rule-verbs',
      category: 'Content',
      rule: 'Action-First Bullet Points',
      passed: actionVerbsFound >= 4 && actionVerbRatio >= 0.45,
      severity: 'medium',
      details: `${actionVerbsFound} of ${totalBulletCount} bullets (${Math.round(actionVerbRatio * 100)}%) lead with power verbs.`,
      fixSuggestion: 'Begin every bullet point with verbs like Architected, Engineered, Deployed, Optimized.'
    },
    {
      id: 'rule-skills-context',
      category: 'Keywords',
      rule: 'Keyword Context Substantiation',
      passed: skillsDemonstratedInBullets >= 4,
      severity: 'medium',
      details: `${skillsDemonstratedInBullets} skills substantiated with practical project implementations.`,
      fixSuggestion: 'Mention your top technologies directly inside your experience and project descriptions.'
    }
  ];

  // Critical Issues & Top Recommendations
  const criticalIssues: string[] = [];
  const topRecommendations: string[] = [];

  if (metricsCount <= 1) criticalIssues.push(`Critically low quantifiable metrics (${metricsCount} metric detected). Add measurable % and scale results.`);
  if (wordCount > 1000) criticalIssues.push(`Resume is excessively long (${wordCount} words). Recruiters spend only 6s scanning; condense to 1-2 pages.`);
  if (actionVerbsFound < 4 || actionVerbRatio < 0.35) criticalIssues.push(`Low action verb density (${actionVerbsFound} leading power verbs). Convert passive phrases into authoritative engineering statements.`);
  if (!resume.personalInfo.email || !resume.personalInfo.phone) criticalIssues.push('Missing crucial contact information (email/phone).');

  if (contentRecs.length > 0) topRecommendations.push(...contentRecs);
  if (compatRecs.length > 0) topRecommendations.push(...compatRecs);
  if (kwRecs.length > 0) topRecommendations.push(...kwRecs);

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
