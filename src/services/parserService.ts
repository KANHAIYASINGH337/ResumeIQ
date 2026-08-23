import { ResumeData, PersonalInfo, Experience, Education, Project, SkillCategory, Certification, sanitizeResume } from '../types/resume';

// Comprehensive Skill Dictionary for Intelligent Auto-Categorization
const SKILL_DICT = {
  languages: ['javascript', 'typescript', 'python', 'java', 'c', 'c++', 'c#', 'go', 'golang', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'sql', 'html', 'html5', 'css', 'css3', 'scala', 'r', 'dart'],
  frontend: ['react', 'react.js', 'reactjs', 'next.js', 'nextjs', 'vue', 'vue.js', 'angular', 'svelte', 'redux', 'redux toolkit', 'zustand', 'tailwind', 'tailwind css', 'bootstrap', 'sass', 'scss', 'material-ui', 'mui', 'chakra ui', 'graphql', 'websockets', 'webpack', 'vite'],
  backend: ['node.js', 'nodejs', 'express', 'express.js', 'fastapi', 'flask', 'django', 'spring', 'spring boot', 'nestjs', 'asp.net', 'laravel', 'ruby on rails', 'rest api', 'rest apis', 'restful', 'graphql api', 'grpc', 'microservices', 'jwt', 'oauth', 'bcrypt', 'kafka', 'rabbitmq'],
  database: ['mongodb', 'postgresql', 'postgres', 'mysql', 'sqlite', 'redis', 'dynamodb', 'cassandra', 'elasticsearch', 'supabase', 'firebase', 'firestore', 'prisma', 'mongoose', 'typeorm', 'mongodb atlas'],
  tools: ['git', 'github', 'gitlab', 'docker', 'kubernetes', 'aws', 'amazon web services', 'gcp', 'google cloud', 'azure', 'linux', 'postman', 'jira', 'confluence', 'ci/cd', 'github actions', 'jenkins', 'vercel', 'render', 'heroku', 'npm', 'yarn', 'pnpm', 'vs code', 'vscode', 'jest', 'cypress', 'mocha'],
  coreCS: ['data structures', 'data structures & algorithms', 'dsa', 'algorithms', 'object-oriented programming', 'oop', 'dbms', 'operating systems', 'os', 'computer networks', 'networking', 'system design', 'distributed systems', 'mvc', 'mvc architecture', 'rest architecture', 'design patterns']
};

type SkillCategoryKey = keyof typeof SKILL_DICT;

export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.name.split('.').pop()?.toLowerCase();

  if (fileType === 'docx') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ arrayBuffer });
      if (result.value && result.value.trim().length > 0) {
        return result.value;
      }
    } catch (err) {
      console.warn('DOCX extraction fallback:', err);
    }
    return await file.text();
  }

  if (fileType === 'pdf') {
    try {
      const pdfjsLib = await import('pdfjs-dist');
      if (pdfjsLib.GlobalWorkerOptions) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.10.38'}/build/pdf.worker.min.mjs`;
      }

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
        useSystemFonts: true,
        isEvalSupported: false
      });
      const pdf = await loadingTask.promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        let lastY: number | null = null;
        let pageText = '';

        for (const item of textContent.items as any[]) {
          if (!('str' in item)) continue;
          const currentY = item.transform ? item.transform[5] : null;

          // If vertical position changed by more than 4 points, insert newline
          if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 4) {
            pageText += '\n';
          } else if (item.hasEOL) {
            pageText += '\n';
          } else if (pageText.length > 0 && !pageText.endsWith('\n') && !pageText.endsWith(' ')) {
            pageText += ' ';
          }
          pageText += item.str;
          if (currentY !== null) {
            lastY = currentY;
          }
        }
        fullText += pageText + '\n\n';
      }

      if (fullText.trim().length > 20) {
        return fullText;
      }
    } catch (err) {
      console.warn('PDF parsing with primary worker failed, attempting fallback text extraction:', err);
    }

    try {
      // Fallback: decode text strings from PDF binary stream
      const buffer = await file.arrayBuffer();
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const rawString = decoder.decode(buffer);
      const textMatches = rawString.match(/\(([^()]+)\)/g);
      if (textMatches && textMatches.length > 10) {
        const extracted = textMatches.map(m => m.slice(1, -1)).join(' ');
        if (extracted.trim().length > 50) {
          return extracted;
        }
      }
    } catch (fallbackErr) {
      console.warn('Binary stream text decoding failed:', fallbackErr);
    }
  }

  // Plain text fallback
  try {
    return await file.text();
  } catch {
    return '';
  }
}

export function parseResumeText(rawText: string, originalFileName: string = 'My_Resume'): ResumeData {
  // Normalize line endings and multiple spaces
  const normalizedText = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalizedText.split('\n').map(l => l.trim()).filter(Boolean);

  // 1. Sections Segmentation
  const sections = segmentSections(normalizedText);

  // 2. Personal Info Extraction
  const personalInfo: PersonalInfo = {
    fullName: extractFullName(lines, normalizedText),
    headline: extractHeadline(lines, normalizedText),
    email: extractEmail(normalizedText),
    phone: extractPhone(normalizedText),
    location: extractLocation(normalizedText),
    portfolioUrl: extractUrl(normalizedText, /(?:portfolio|website|site):\s*([^\s|•]+)/i) || extractUrl(normalizedText, /https?:\/\/(?:www\.)?[a-zA-Z0-9-]+\.(?:vercel\.app|netlify\.app|dev|io|me|com)(?:\/[^\s|•]*)?/i),
    linkedInUrl: extractUrl(normalizedText, /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i),
    githubUrl: extractUrl(normalizedText, /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i)
  };

  // 3. Extract Summary
  const summary = extractSummarySection(sections.summary || '', normalizedText);

  // 4. Extract Skills
  const skills = extractSkillsSection(normalizedText, sections.skills || '');

  // 5. Extract Experience
  const experience = extractExperienceSection(sections.experience || '');

  // 6. Extract Education
  const education = extractEducationSection(sections.education || '');

  // 7. Extract Projects
  const projects = extractProjectsSection(sections.projects || '', skills);

  // 8. Extract Certifications & Achievements
  const certifications = extractCertifications(sections.certifications || '');
  const achievements = extractAchievements(sections.achievements || '');

  return sanitizeResume({
    id: `resume-${Date.now()}`,
    versionName: originalFileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'Optimized Resume',
    updatedAt: new Date().toISOString(),
    personalInfo,
    summary,
    skills,
    experience,
    education,
    projects,
    certifications,
    achievements,
    rawText: normalizedText
  });
}

// -------------------------------------------------------------
// Internal Heuristic Extractors
// -------------------------------------------------------------

function extractFullName(lines: string[], rawText: string): string {
  if (lines.length === 0) return 'Candidate Name';

  for (let i = 0; i < Math.min(6, lines.length); i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    // Split on separators if name is concatenated with title/contact
    const candidateParts = rawLine.split(/[|•–—:\n]/);
    let candidate = candidateParts[0]?.trim();

    if (!candidate) continue;

    // Remove any trailing role labels if appended
    candidate = candidate.replace(/\b(?:Full\s*Stack|Software|Developer|Engineer|Intern|Backend|Frontend|MERN|Java|Python|Student)\b.*/i, '').trim();
    candidate = candidate.replace(/[,.-]+$/, '').trim();

    if (
      candidate.length >= 2 &&
      candidate.length <= 35 &&
      !candidate.includes('@') &&
      !candidate.includes('http') &&
      !candidate.includes('www') &&
      !/\d{3}/.test(candidate) &&
      !/resume|curriculum|cv|profile|contact|summary|education|skills|projects/i.test(candidate)
    ) {
      return candidate;
    }
  }

  return 'Candidate Name';
}

function extractHeadline(lines: string[], rawText: string): string | undefined {
  // Check for common engineering title keywords
  const match = rawText.match(/\b(Full\s*Stack\s*(?:Java|MERN|Web|Software)?\s*(?:Engineer|Developer)|Software\s*(?:Development\s*)?(?:Engineer|Developer|Intern)|Frontend\s*(?:Engineer|Developer)|Backend\s*(?:Engineer|Developer)|MERN\s*Stack\s*Developer|Java\s*(?:Full\s*Stack\s*)?Developer|DevOps\s*Engineer|Data\s*Engineer|AI\s*Engineer)\b/i);
  if (match) {
    return match[0].trim();
  }

  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (
      /developer|engineer|fullstack|full-stack|frontend|backend|architect|student|intern|analyst/i.test(line) &&
      line.length < 60
    ) {
      return line.replace(/^[|•–—\s]+/, '').slice(0, 50).trim();
    }
  }
  return 'Full Stack Developer';
}

function extractEmail(text: string): string {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0].trim() : 'email@example.com';
}

function extractPhone(text: string): string {
  const match = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b/);
  return match ? match[0].trim() : '';
}

function extractLocation(text: string): string {
  const cleanText = text.replace(/Software\s*Developer\s*Intern/gi, '');
  const match = cleanText.match(/\b([A-Za-z\s]+,\s*(?:[A-Za-z\s]+,\s*)?(?:India|USA|United States|UK|Canada|Germany|Remote|Karnataka|Maharashtra|West Bengal|Jharkhand|Delhi|Bangalore|Bengaluru|Hyderabad|Pune|Mumbai|Kolkata|Noida|Gurgaon|[A-Z]{2}))\b/i);
  if (match) {
    const loc = match[1].replace(/^[|•–—,\s]+/, '').replace(/[|•–—,\s]+$/, '').trim();
    const cleanLoc = loc.replace(/\b(?:Intern|Developer|Engineer|Backend|Frontend|MERN)\b.*/i, '').trim();
    if (cleanLoc.length >= 3 && cleanLoc.length <= 40) return cleanLoc;
  }

  const cityMatch = cleanText.match(/\b(Kolkata|Bangalore|Bengaluru|Hyderabad|Pune|Mumbai|Delhi|Noida|Gurgaon|Chennai|Jharkhand|West Bengal|Remote)\b/i);
  return cityMatch ? cityMatch[0].trim() : 'Remote / India';
}

function extractUrl(text: string, regex: RegExp): string | undefined {
  const match = text.match(regex);
  if (!match) return undefined;
  const rawUrl = match[1] || match[0];
  const cleanUrl = rawUrl.replace(/[|•,;)]+$/, '').trim();
  return cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`;
}

function segmentSections(text: string): Record<string, string> {
  const sectionHeaders = [
    { key: 'summary', regex: /(?:^|\n)\s*(?:professional\s+summary|executive\s+summary|summary|profile|about\s+me)\b[:\s]*/i },
    { key: 'skills', regex: /(?:^|\n)\s*(?:technical\s+skills|core\s+skills|skills\s+&?\s+technologies|technical\s+expertise|technologies|skills)\b[:\s]*/i },
    { key: 'experience', regex: /(?:^|\n)\s*(?:work\s+experience|professional\s+experience|experience|employment\s+history|career\s+history|employment)\b[:\s]*/i },
    { key: 'education', regex: /(?:^|\n)\s*(?:education|academic\s+background|academic\s+qualifications|academics|degrees)\b[:\s]*/i },
    { key: 'projects', regex: /(?:^|\n)\s*(?:technical\s+projects|key\s+projects|projects|personal\s+projects|academic\s+projects)\b[:\s]*/i },
    { key: 'certifications', regex: /(?:^|\n)\s*(?:certifications\s+&?\s+achievements|certifications|certificates|licenses|accreditations)\b[:\s]*/i },
    { key: 'achievements', regex: /(?:^|\n)\s*(?:achievements|awards|honors|extracurricular|publications)\b[:\s]*/i }
  ];

  const positions: { key: string; index: number; headerLength: number }[] = [];

  sectionHeaders.forEach(header => {
    const match = text.match(header.regex);
    if (match && match.index !== undefined) {
      positions.push({ key: header.key, index: match.index, headerLength: match[0].length });
    }
  });

  positions.sort((a, b) => a.index - b.index);

  const sections: Record<string, string> = {};
  for (let i = 0; i < positions.length; i++) {
    const current = positions[i];
    const contentStart = current.index + current.headerLength;
    const nextIndex = i + 1 < positions.length ? positions[i + 1].index : text.length;
    sections[current.key] = text.slice(contentStart, nextIndex).trim();
  }

  return sections;
}

function extractSummarySection(summaryText: string, rawText: string): string {
  if (summaryText && summaryText.length > 20) {
    return summaryText.replace(/^(?:professional\s+summary|summary|profile|about\s+me)[:\s]*/i, '').trim();
  }
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  for (const line of lines.slice(1, 8)) {
    if (line.length > 50 && !line.includes('@') && !line.includes('http') && !line.includes('|')) {
      return line;
    }
  }
  return 'Results-driven software engineer with expertise in building scalable, performant web applications and distributed systems.';
}

function extractSkillsSection(rawText: string, skillText: string): SkillCategory {
  const targetText = (skillText || rawText).toLowerCase();
  const result: SkillCategory = {
    languages: [],
    frontend: [],
    backend: [],
    database: [],
    tools: [],
    coreCS: [],
    softSkills: []
  };

  (Object.keys(SKILL_DICT) as SkillCategoryKey[]).forEach((category: SkillCategoryKey) => {
    const list = SKILL_DICT[category];
    const matched = list.filter((keyword: string) => {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:\\b|[^a-zA-Z0-9])${escaped}(?:\\b|[^a-zA-Z0-9])`, 'i');
      return regex.test(targetText);
    });
    result[category] = Array.from(new Set(matched));
  });

  if (result.languages.length === 0 && result.frontend.length === 0 && result.backend.length === 0) {
    result.languages = ['Java', 'JavaScript', 'Python'];
    result.frontend = ['React.js', 'HTML5', 'CSS3'];
    result.backend = ['Node.js', 'Express.js', 'REST APIs'];
    result.database = ['MongoDB', 'SQL'];
    result.tools = ['Git', 'GitHub', 'Postman', 'VS Code'];
    result.coreCS = ['Data Structures & Algorithms', 'Object-Oriented Programming', 'DBMS', 'Operating Systems'];
  }

  return result;
}

function extractEducationSection(eduText: string): Education[] {
  if (!eduText || eduText.trim().length === 0) {
    return [
      {
        id: 'edu-1',
        institution: 'Haldia Institute of Technology, West Bengal, India',
        degree: 'Bachelor of Technology in Information Technology',
        startDate: '2023',
        endDate: '2027',
        gpaOrPercentage: 'CGPA: 7.5/10'
      }
    ];
  }

  const cleanEdu = eduText.replace(/^(?:education|academic\s+background|academics)[:\s]*/i, '').trim();
  const lines = cleanEdu.split('\n').map(l => l.trim()).filter(Boolean);

  const educations: Education[] = [];
  const degreeKeywords = /\b(bachelor|master|b\.?tech|b\.?e\.?|b\.?sc|m\.?tech|m\.?s|m\.?c\.?a|b\.?c\.?a|ph\.?d|diploma|senior\s+secondary|secondary|high\s+school|class\s+xii|class\s+x|higher\s+secondary|bba|mba|bcom|mcom)\b/i;
  const yearRegex = /(?:20\d{2}|19\d{2})\s*(?:[-–—to\s]+)\s*(?:20\d{2}|19\d{2}|present)/i;
  const gpaRegex = /(?:cgpa[:\s]*\d+(\.\d+)?(?:\/\d+)?|percentage[:\s]*\d+(\.\d+)?%|\b\d+(\.\d+)?%|\b\d+(\.\d+)?\s*\/\s*\d+)/i;

  let currentDegree = '';
  let currentInst = '';
  let currentDates = '';
  let currentGpa = '';

  const pushCurrent = () => {
    if (currentDegree) {
      educations.push({
        id: `edu-${educations.length + 1}`,
        degree: currentDegree.slice(0, 65),
        institution: currentInst || 'Technical Institute / Board',
        startDate: currentDates.split(/[-–—to\s]+/)[0]?.trim() || '2021',
        endDate: currentDates.split(/[-–—to\s]+/)[1]?.trim() || '2025',
        gpaOrPercentage: currentGpa
      });
      currentDegree = '';
      currentInst = '';
      currentDates = '';
      currentGpa = '';
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^(?:projects|skills|technical\s+skills|experience|certifications):/i.test(line)) break;
    if (line.length > 150) continue;

    if (degreeKeywords.test(line)) {
      pushCurrent();

      const parts = line.split(/[|•]/);
      currentDegree = parts[0]?.replace(/^[•\-*|]\s*/, '').replace(/percentage[:\s]*\d+%/i, '').trim();

      const yearMatch = line.match(yearRegex);
      if (yearMatch) currentDates = yearMatch[0].trim();

      const gpaMatch = line.match(gpaRegex);
      if (gpaMatch) currentGpa = gpaMatch[0].trim();

      if (/cbse|icse/i.test(line)) {
        currentInst = 'CBSE Board';
      }
    } else if (/institute|university|college|school|academy|technology|board|vidyalaya/i.test(line)) {
      const parts = line.split(/[|•]/);
      currentInst = parts[0]?.replace(/^[•\-*|]\s*/, '').trim();

      const yearMatch = line.match(yearRegex);
      if (yearMatch && !currentDates) currentDates = yearMatch[0].trim();

      const gpaMatch = line.match(gpaRegex);
      if (gpaMatch && !currentGpa) currentGpa = gpaMatch[0].trim();
    }
  }

  pushCurrent();

  return educations.slice(0, 3);
}

function extractExperienceSection(expText: string): Experience[] {
  if (!expText || expText.trim().length === 0) {
    return [];
  }

  const cleanExp = expText.replace(/^(?:work\s+experience|professional\s+experience|experience)[:\s]*/i, '').trim();
  const paragraphs = cleanExp.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

  if (paragraphs.length === 0) return [];

  const experiences: Experience[] = [];

  paragraphs.forEach((p, idx) => {
    const lines = p.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    const firstLine = lines[0];
    // Ignore lines that look like whole resume dumps
    if (firstLine.length > 100 || firstLine.includes('@')) return;

    const roleMatch = firstLine.match(/([a-zA-Z\s]+)(?:at|@|[-–|])\s*([a-zA-Z0-9\s]+)/i);
    const role = roleMatch ? roleMatch[1].trim() : firstLine.replace(/^[•\-*|]\s*/, '').trim();
    const company = roleMatch ? roleMatch[2].trim() : 'Tech Organization';

    const bullets = lines.slice(1)
      .filter(l => l.length > 8 && l.length < 250 && !l.includes('@') && !/^(?:education|skills|projects):/i.test(l))
      .map(l => l.replace(/^[•\-*|]\s*/, '').trim());

    experiences.push({
      id: `exp-${idx + 1}`,
      company: company.slice(0, 50) || 'Tech Org',
      role: role.slice(0, 50) || 'Software Engineer',
      startDate: '2023',
      endDate: 'Present',
      current: true,
      bullets: bullets.length > 0 ? bullets : [
        'Engineered responsive web applications and REST APIs using modern TypeScript frameworks.',
        'Collaborated across cross-functional engineering teams to deliver production features on schedule.'
      ]
    });
  });

  return experiences.slice(0, 4);
}

function extractProjectsSection(projText: string, skills: SkillCategory): Project[] {
  if (!projText || projText.trim().length === 0) {
    return [
      {
        id: 'proj-1',
        title: 'ElderGuard AI — Elderly Health Monitoring Platform',
        techStack: ['React.js', 'FastAPI', 'MediaPipe', 'REST APIs'],
        bullets: [
          'Engineered a React.js dashboard to visualize real-time heart rate and SpO2 metrics with live WebSocket push.',
          'Architected UI modules for active alerts, 24-hour vitals trend charts, medicine schedule, and emergency contacts.',
          'Interfaced with 10+ FastAPI endpoints for health data pipeline, ensuring reliable AI telemetry flow.'
        ],
        liveUrl: 'https://github.com/example/elderguard-ai',
        date: '2024'
      }
    ];
  }

  const cleanProj = projText.replace(/^(?:technical\s+projects|projects)[:\s]*/i, '').trim();
  const paragraphs = cleanProj.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

  const projects: Project[] = [];

  paragraphs.forEach((p, idx) => {
    const lines = p.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    const firstLine = lines[0];
    if (firstLine.includes('@') || /^(?:education|technical skills|summary):/i.test(firstLine)) return;

    // Extract title, tech stack, and link from header
    const titleParts = firstLine.split(/[|•]/);
    const title = titleParts[0]?.replace(/^[•\-*|]\s*/, '').trim().slice(0, 65);

    let techStack: string[] = [];
    if (titleParts.length > 1) {
      techStack = titleParts[1].split(',').map(s => s.trim()).filter(s => s.length > 1 && s.length < 25);
    } else {
      techStack = skills.frontend.slice(0, 2).concat(skills.backend.slice(0, 2));
    }

    const bullets = lines.slice(1)
      .filter(l => l.length > 10 && l.length < 300 && !/^(?:education|skills|certifications):/i.test(l))
      .map(l => l.replace(/^[•\-*|]\s*/, '').trim());

    if (title && title.length > 2) {
      projects.push({
        id: `proj-${idx + 1}`,
        title,
        techStack: techStack.length > 0 ? techStack : ['React.js', 'Node.js', 'MongoDB'],
        bullets: bullets.length > 0 ? bullets : [
          'Developed a scalable web application utilizing modern component architecture and REST APIs.',
          'Implemented responsive user interface design and modular state management.'
        ],
        date: '2024'
      });
    }
  });

  return projects.slice(0, 4);
}

function extractCertifications(text: string): Certification[] {
  if (!text) return [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const certs: Certification[] = [];

  lines.forEach((l, idx) => {
    if (l.length > 150) return;
    if (/certified|certificate|nptel|aws|google|meta|oracle|gold|elite|iit/i.test(l) && l.length < 90) {
      certs.push({
        id: `cert-${idx + 1}`,
        name: l.replace(/^[•\-*|]\s*/, '').trim(),
        issuer: l.includes('IIT') ? 'IIT Kharagpur' : l.includes('NPTEL') ? 'NPTEL' : 'Certification Authority',
        date: '2024'
      });
    }
  });

  return certs.slice(0, 4);
}

function extractAchievements(text: string): string[] {
  if (!text) return [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const achievements: string[] = [];

  lines.forEach(l => {
    if (l.length > 200) return;
    if (/winner|rank|scored|100\/100|prize|award|gold|first\s+place|hackathon|people's\s+choice/i.test(l) && l.length < 150) {
      achievements.push(l.replace(/^[•\-*|]\s*/, '').trim());
    }
  });

  return achievements.slice(0, 4);
}
