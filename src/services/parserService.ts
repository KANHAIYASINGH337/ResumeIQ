import * as mammoth from 'mammoth';
import { ResumeData, PersonalInfo, Experience, Education, Project, SkillCategory, Certification } from '../types/resume';

// Comprehensive Skill Dictionary for Intelligent Auto-Categorization
const SKILL_DICT = {
  languages: ['javascript', 'typescript', 'python', 'java', 'c', 'c++', 'c#', 'go', 'golang', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'sql', 'html', 'html5', 'css', 'css3', 'scala', 'r', 'dart'],
  frontend: ['react', 'react.js', 'reactjs', 'next.js', 'nextjs', 'vue', 'vue.js', 'angular', 'svelte', 'redux', 'redux toolkit', 'zustand', 'tailwind', 'tailwind css', 'bootstrap', 'sass', 'scss', 'material-ui', 'mui', 'chakra ui', 'graphql', 'websockets', 'webpack', 'vite'],
  backend: ['node.js', 'nodejs', 'express', 'express.js', 'fastapi', 'flask', 'django', 'spring', 'spring boot', 'nestjs', 'asp.net', 'laravel', 'ruby on rails', 'rest api', 'rest apis', 'restful', 'graphql api', 'grpc', 'microservices', 'jwt', 'oauth', 'bcrypt', 'kafka', 'rabbitmq'],
  database: ['mongodb', 'postgresql', 'postgres', 'mysql', 'sqlite', 'redis', 'dynamodb', 'cassandra', 'elasticsearch', 'supabase', 'firebase', 'firestore', 'prisma', 'mongoose', 'typeorm', 'mongodb atlas'],
  tools: ['git', 'github', 'gitlab', 'docker', 'kubernetes', 'aws', 'amazon web services', 'gcp', 'google cloud', 'azure', 'linux', 'postman', 'jira', 'confluence', 'ci/cd', 'github actions', 'jenkins', 'vercel', 'render', 'heroku', 'npm', 'yarn', 'pnpm', 'vs code', 'vscode', 'jest', 'cypress', 'mocha'],
  coreCS: ['data structures', 'data structures & algorithms', 'dsa', 'algorithms', 'object-oriented programming', 'oop', 'dbms', 'operating systems', 'os', 'computer networks', 'networking', 'system design', 'distributed systems', 'mvc', 'mvc architecture', 'rest architecture', 'design patterns']
};

export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.name.split('.').pop()?.toLowerCase();

  if (fileType === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value || '';
  }

  if (fileType === 'pdf') {
    try {
      // Dynamic import of pdfjs-dist to optimize loading
      const pdfjsLib = await import('pdfjs-dist');
      // Set worker source
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => ('str' in item ? item.str : ''))
          .join(' ');
        fullText += pageText + '\n';
      }

      if (fullText.trim().length > 20) {
        return fullText;
      }
    } catch (pdfErr) {
      console.warn('PDF.js worker extraction fallback:', pdfErr);
    }

    // Fallback simple buffer reader if pdf.js has canvas worker CORS restrictions
    const text = await file.text();
    return text.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
  }

  // Plain text / Markdown
  return await file.text();
}

export function parseResumeText(rawText: string, fileName?: string): ResumeData {
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  const fullLower = rawText.toLowerCase();

  // 1. Personal Info Extraction
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';

  const phoneMatch = rawText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?91[-.\s]?\d{10}|\b\d{10}\b/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  const linkedInMatch = rawText.match(/(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const linkedInUrl = linkedInMatch ? (linkedInMatch[0].startsWith('http') ? linkedInMatch[0] : `https://${linkedInMatch[0]}`) : '';

  const githubMatch = rawText.match(/(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  const githubUrl = githubMatch ? (githubMatch[0].startsWith('http') ? githubMatch[0] : `https://${githubMatch[0]}`) : '';

  const portfolioMatch = rawText.match(/(https?:\/\/)?(www\.)?([a-zA-Z0-9_-]+\.)?(vercel\.app|netlify\.app|github\.io|me|dev|io|tech|com)\/?/i);
  const portfolioUrl = portfolioMatch && !portfolioMatch[0].includes('linkedin') && !portfolioMatch[0].includes('github')
    ? (portfolioMatch[0].startsWith('http') ? portfolioMatch[0] : `https://${portfolioMatch[0]}`)
    : '';

  // Extract Name (Usually top non-empty line without email/phone/urls)
  let fullName = 'Candidate';
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (
      line.length >= 2 &&
      line.length <= 40 &&
      !line.includes('@') &&
      !line.includes('http') &&
      !line.includes('www.') &&
      !/\d{5,}/.test(line) &&
      !/resume|curriculum|cv|page/i.test(line)
    ) {
      fullName = line.replace(/[^a-zA-Z\s.-]/g, '').trim();
      if (fullName.length > 2) break;
    }
  }

  // Location heuristic
  let location = 'Remote / Open to Relocation';
  const locationMatch = rawText.match(/([A-Z][a-zA-Z\s]+,\s*[A-Z]{2})|([A-Z][a-zA-Z\s]+,\s*India)|([A-Z][a-zA-Z\s]+,\s*USA)|(Jharkhand,\s*India)|(Bengaluru|Bangalore|Mumbai|Delhi|Hyderabad|Pune|San Francisco|New York|Seattle)/i);
  if (locationMatch) {
    location = locationMatch[0].trim();
  }

  // 2. Section Chunking
  const sections = chunkSections(rawText);

  // 3. Extract Summary
  let summary = '';
  if (sections['summary']) {
    summary = sections['summary'].slice(0, 600).trim();
  } else {
    // Look for first descriptive paragraph
    const summaryCandidate = lines.find(l => l.length > 80 && !l.includes('@') && !l.includes('http'));
    if (summaryCandidate) summary = summaryCandidate;
  }

  // 4. Extract Skills
  const skills: SkillCategory = {
    languages: [],
    frontend: [],
    backend: [],
    database: [],
    tools: [],
    coreCS: [],
    softSkills: ['Problem Solving', 'Teamwork', 'Communication', 'Adaptability']
  };

  const skillsText = (sections['skills'] || rawText).toLowerCase();

  Object.entries(SKILL_DICT).forEach(([category, skillList]) => {
    skillList.forEach(skill => {
      const regex = new RegExp(`(^|[^a-z0-9+#.-])${escapeRegex(skill)}($|[^a-z0-9+#.-])`, 'i');
      if (regex.test(skillsText) || regex.test(fullLower)) {
        const formattedSkill = formatSkillName(skill);
        const catKey = category as keyof SkillCategory;
        if (!skills[catKey].includes(formattedSkill)) {
          skills[catKey].push(formattedSkill);
        }
      }
    });
  });

  // 5. Extract Education
  const education: Education[] = [];
  const eduText = sections['education'] || '';
  const eduLines = eduText.split(/\r?\n/).filter(l => l.length > 0);

  if (eduLines.length > 0) {
    let currentEdu: Partial<Education> = {};
    eduLines.forEach((l, idx) => {
      if (/bachelor|b\.tech|b\.e\.|master|m\.tech|degree|secondary|class\s*x|diploma|university|institute|college|school/i.test(l)) {
        if (currentEdu.institution || currentEdu.degree) {
          education.push(finalizeEducation(currentEdu, idx));
          currentEdu = {};
        }
        if (/bachelor|b\.tech|b\.e\.|master|m\.tech|secondary|class\s*x/i.test(l)) {
          currentEdu.degree = l;
        } else {
          currentEdu.institution = l;
        }
      } else if (/\d{4}/.test(l)) {
        const dateMatch = l.match(/\b(19|20)\d{2}(\s*[-–—to]\s*(19|20)?\d{2}|Present)?\b/i);
        if (dateMatch) currentEdu.startDate = dateMatch[0];
        const gpaMatch = l.match(/(CGPA|GPA|Score|Percentage|%):\s*([0-9.]+(\/[0-9.]+|%))/i);
        if (gpaMatch) currentEdu.gpaOrPercentage = gpaMatch[0];
      }
    });
    if (currentEdu.institution || currentEdu.degree) {
      education.push(finalizeEducation(currentEdu, eduLines.length));
    }
  }

  // 6. Extract Projects
  const projects: Project[] = [];
  const projText = sections['projects'] || '';
  const projBlocks = projText.split(/\n(?=[A-Z0-9][A-Za-z0-9\s—–-]{3,40}(\||—|–|-))/);

  projBlocks.forEach((block, idx) => {
    const blockLines = block.split(/\r?\n/).filter(l => l.length > 0);
    if (blockLines.length === 0) return;

    const titleLine = blockLines[0];
    const parts = titleLine.split(/\||—|–/);
    const title = parts[0]?.trim() || `Project ${idx + 1}`;
    
    // Extract tech tags in title line
    const techStack: string[] = [];
    if (parts[1]) {
      parts[1].split(/,|\//).forEach(t => {
        const cleanT = t.trim();
        if (cleanT.length > 1 && cleanT.length < 25) techStack.push(cleanT);
      });
    }

    // Extract bullets
    const bullets: string[] = [];
    blockLines.slice(1).forEach(l => {
      const cleanBullet = l.replace(/^[-•*–—]\s*/, '').trim();
      if (cleanBullet.length > 15) bullets.push(cleanBullet);
    });

    if (title.length > 2 && (bullets.length > 0 || techStack.length > 0)) {
      projects.push({
        id: `proj-extracted-${idx + 1}`,
        title,
        techStack: techStack.length > 0 ? techStack : ['React', 'JavaScript', 'REST API'],
        bullets: bullets.length > 0 ? bullets : ['Developed full stack application with responsive interface and database integration.'],
        date: titleLine.match(/\b(20\d{2})\b/)?.[0] || '2024'
      });
    }
  });

  // 7. Extract Experience
  const experience: Experience[] = [];
  const expText = sections['experience'] || '';
  const expBlocks = expText.split(/\n(?=[A-Z0-9][A-Za-z0-9\s—–-]{3,40}(\||—|–|-))/);

  expBlocks.forEach((block, idx) => {
    const blockLines = block.split(/\r?\n/).filter(l => l.length > 0);
    if (blockLines.length === 0) return;

    const titleLine = blockLines[0];
    const parts = titleLine.split(/\||—|–/);
    const roleOrCompany = parts[0]?.trim() || `Role ${idx + 1}`;
    const company = parts[1]?.trim() || 'Software Company';

    const bullets: string[] = [];
    blockLines.slice(1).forEach(l => {
      const cleanBullet = l.replace(/^[-•*–—]\s*/, '').trim();
      if (cleanBullet.length > 15) bullets.push(cleanBullet);
    });

    if (roleOrCompany.length > 2 && bullets.length > 0) {
      experience.push({
        id: `exp-extracted-${idx + 1}`,
        role: roleOrCompany,
        company,
        startDate: '2023',
        endDate: 'Present',
        current: true,
        bullets
      });
    }
  });

  // 8. Extract Certifications & Achievements
  const certifications: Certification[] = [];
  const certText = sections['certifications'] || '';
  certText.split(/\r?\n/).filter(l => l.length > 10).forEach((l, idx) => {
    const cleanCert = l.replace(/^[-•*–—]\s*/, '').trim();
    certifications.push({
      id: `cert-extracted-${idx + 1}`,
      name: cleanCert,
      issuer: 'Professional Organization'
    });
  });

  const achievements: string[] = [];
  const achText = sections['achievements'] || '';
  achText.split(/\r?\n/).filter(l => l.length > 15).forEach(l => {
    achievements.push(l.replace(/^[-•*–—]\s*/, '').trim());
  });

  return {
    id: `resume-${Date.now()}`,
    versionName: fileName ? fileName.replace(/\.[^/.]+$/, '') : `${fullName}'s Resume`,
    updatedAt: new Date().toISOString(),
    personalInfo: {
      fullName,
      email,
      phone,
      location,
      portfolioUrl,
      linkedInUrl,
      githubUrl,
      headline: 'Software Engineer | Full Stack Developer'
    },
    summary: summary || 'Detail-oriented Software Engineer proficient in designing scalable web architectures, modern frontend interfaces, and robust backend APIs. Strong foundation in CS fundamentals and software engineering best practices.',
    skills,
    experience,
    education: education.length > 0 ? education : [
      {
        id: 'edu-default',
        institution: 'University / Institute',
        degree: 'Bachelor of Technology / Science in Computer Science',
        startDate: '2020',
        endDate: '2024',
        gpaOrPercentage: '7.5 / 10'
      }
    ],
    projects: projects.length > 0 ? projects : [
      {
        id: 'proj-default',
        title: 'Full Stack Web Platform',
        techStack: ['React', 'Node.js', 'MongoDB', 'REST API'],
        bullets: ['Architected scalable full-stack application with RESTful API endpoints and authentication.', 'Implemented responsive UI components with clean state management.'],
        date: '2024'
      }
    ],
    certifications,
    achievements,
    rawText
  };
}

function chunkSections(text: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const headerPatterns = [
    { key: 'summary', regex: /\b(professional summary|summary|objective|about me|profile)\b/i },
    { key: 'skills', regex: /\b(technical skills|skills|technologies|technical expertise|core competencies)\b/i },
    { key: 'experience', regex: /\b(experience|work experience|employment history|professional experience|internships)\b/i },
    { key: 'education', regex: /\b(education|academic background|qualifications)\b/i },
    { key: 'projects', regex: /\b(projects|personal projects|technical projects|academic projects)\b/i },
    { key: 'certifications', regex: /\b(certifications|licenses|courses|training)\b/i },
    { key: 'achievements', regex: /\b(achievements|honors|awards|hackathons)\b/i }
  ];

  const lines = text.split(/\r?\n/);
  let currentKey = 'summary';
  let buffer: string[] = [];

  for (const line of lines) {
    let matchedKey: string | null = null;
    for (const h of headerPatterns) {
      if (h.regex.test(line) && line.length < 50) {
        matchedKey = h.key;
        break;
      }
    }

    if (matchedKey) {
      if (buffer.length > 0) {
        sections[currentKey] = (sections[currentKey] || '') + '\n' + buffer.join('\n');
        buffer = [];
      }
      currentKey = matchedKey;
    } else {
      buffer.push(line);
    }
  }

  if (buffer.length > 0) {
    sections[currentKey] = (sections[currentKey] || '') + '\n' + buffer.join('\n');
  }

  return sections;
}

function finalizeEducation(edu: Partial<Education>, idx: number): Education {
  return {
    id: `edu-extracted-${idx}`,
    institution: edu.institution || 'University Institute',
    degree: edu.degree || 'Bachelor Degree',
    startDate: edu.startDate || '2020',
    endDate: '2024',
    gpaOrPercentage: edu.gpaOrPercentage || ''
  };
}

function formatSkillName(skill: string): string {
  const map: Record<string, string> = {
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'react': 'React.js',
    'react.js': 'React.js',
    'reactjs': 'React.js',
    'next.js': 'Next.js',
    'nextjs': 'Next.js',
    'node.js': 'Node.js',
    'nodejs': 'Node.js',
    'express': 'Express.js',
    'express.js': 'Express.js',
    'fastapi': 'FastAPI',
    'rest api': 'REST APIs',
    'rest apis': 'REST APIs',
    'restful': 'REST APIs',
    'mongodb': 'MongoDB',
    'postgresql': 'PostgreSQL',
    'postgres': 'PostgreSQL',
    'mysql': 'MySQL',
    'github': 'GitHub',
    'vscode': 'VS Code',
    'dsa': 'Data Structures & Algorithms',
    'oop': 'OOP',
    'dbms': 'DBMS',
    'os': 'Operating Systems',
    'jwt': 'JWT',
    'aws': 'AWS',
    'html': 'HTML5',
    'html5': 'HTML5',
    'css': 'CSS3',
    'css3': 'CSS3',
    'tailwind': 'Tailwind CSS',
    'tailwind css': 'Tailwind CSS'
  };
  return map[skill.toLowerCase()] || (skill.charAt(0).toUpperCase() + skill.slice(1));
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
