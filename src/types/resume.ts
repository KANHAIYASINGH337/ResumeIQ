export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  headline?: string;
  portfolioUrl?: string;
  linkedInUrl?: string;
  githubUrl?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate: string;
  gpaOrPercentage?: string;
  location?: string;
  highlights?: string[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location?: string;
  bullets: string[];
}

export interface Project {
  id: string;
  title: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  date?: string;
  bullets: string[];
  problemSolved?: string;
  metrics?: string[];
}

export interface SkillCategory {
  languages: string[];
  frontend: string[];
  backend: string[];
  database: string[];
  tools: string[];
  coreCS: string[];
  softSkills?: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  scoreOrHonor?: string;
  url?: string;
}

export interface ResumeData {
  id: string;
  versionName: string;
  updatedAt: string;
  personalInfo: PersonalInfo;
  summary: string;
  skills: SkillCategory;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  achievements: string[];
  rawText?: string;
}

export type TemplateId = 'classic' | 'modern' | 'executive' | 'compact';

export function sanitizeResume(raw: any): ResumeData {
  if (!raw || typeof raw !== 'object') {
    return {
      id: `resume-${Date.now()}`,
      versionName: 'Optimized Resume',
      updatedAt: new Date().toISOString(),
      personalInfo: {
        fullName: 'Alex Morgan',
        headline: 'Full Stack Software Engineer',
        email: 'alex.morgan.dev@example.com',
        phone: '+1 (555) 349-2810',
        location: 'San Francisco, CA',
        portfolioUrl: 'https://alexmorgan.dev',
        linkedInUrl: 'https://linkedin.com/in/alexmorgan-dev',
        githubUrl: 'https://github.com/alexmorgan-dev'
      },
      summary: 'Results-driven software engineer with 3+ years of experience architecting scalable full-stack web applications and cloud microservices.',
      skills: {
        languages: ['JavaScript', 'TypeScript', 'Python', 'SQL'],
        frontend: ['React', 'Next.js', 'Tailwind CSS', 'Redux'],
        backend: ['Node.js', 'Express.js', 'FastAPI', 'REST APIs'],
        database: ['PostgreSQL', 'MongoDB', 'Redis'],
        tools: ['Git', 'Docker', 'AWS', 'Vite', 'Postman'],
        coreCS: ['Data Structures', 'Algorithms', 'System Design'],
        softSkills: ['Team Leadership', 'Agile / Scrum']
      },
      experience: [
        {
          id: 'exp-1',
          company: 'Apex Cloud Solutions',
          role: 'Full Stack Software Engineer',
          startDate: 'Jan 2023',
          endDate: 'Present',
          current: true,
          bullets: [
            'Architected high-throughput microservices in Node.js and TypeScript, reducing p99 API latency by 38% under 50,000+ daily requests.',
            'Engineered responsive React.js dashboard with modular component design system, boosting developer delivery velocity by 25%.'
          ]
        }
      ],
      education: [
        {
          id: 'edu-1',
          institution: 'State University of Technology',
          degree: 'Bachelor of Science in Computer Science',
          startDate: '2019',
          endDate: '2023',
          gpaOrPercentage: '3.8 / 4.0 GPA'
        }
      ],
      projects: [
        {
          id: 'proj-1',
          title: 'DevPulse AI — Developer Analytics Platform',
          techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
          date: '2024',
          bullets: [
            'Architected an end-to-end telemetry system tracking Git commit velocities and test coverage metrics across 20+ microservices.',
            'Optimized PostgreSQL query indexes and Redis caching, achieving sub-45ms response times across 10,000+ telemetry rows.'
          ]
        }
      ],
      certifications: [
        {
          id: 'cert-1',
          name: 'AWS Certified Solutions Architect – Associate',
          issuer: 'Amazon Web Services',
          date: '2023'
        }
      ],
      achievements: [
        'Winner — National Level AI/ML Hackathon (1st Place out of 65+ Teams)'
      ]
    };
  }

  return {
    id: raw.id || `resume-${Date.now()}`,
    versionName: raw.versionName || 'Optimized Resume',
    updatedAt: raw.updatedAt || new Date().toISOString(),
    personalInfo: {
      fullName: raw.personalInfo?.fullName || 'Candidate Name',
      headline: raw.personalInfo?.headline || 'Software Engineer',
      email: raw.personalInfo?.email || '',
      phone: raw.personalInfo?.phone || '',
      location: raw.personalInfo?.location || '',
      portfolioUrl: raw.personalInfo?.portfolioUrl || '',
      linkedInUrl: raw.personalInfo?.linkedInUrl || '',
      githubUrl: raw.personalInfo?.githubUrl || ''
    },
    summary: raw.summary || '',
    skills: {
      languages: Array.isArray(raw.skills?.languages) ? raw.skills.languages : [],
      frontend: Array.isArray(raw.skills?.frontend) ? raw.skills.frontend : [],
      backend: Array.isArray(raw.skills?.backend) ? raw.skills.backend : [],
      database: Array.isArray(raw.skills?.database) ? raw.skills.database : [],
      tools: Array.isArray(raw.skills?.tools) ? raw.skills.tools : [],
      coreCS: Array.isArray(raw.skills?.coreCS) ? raw.skills.coreCS : [],
      softSkills: Array.isArray(raw.skills?.softSkills) ? raw.skills.softSkills : []
    },
    experience: Array.isArray(raw.experience) ? raw.experience.map((e: any, idx: number) => ({
      id: e?.id || `exp-${idx}`,
      company: e?.company || '',
      role: e?.role || '',
      startDate: e?.startDate || '',
      endDate: e?.endDate || '',
      current: Boolean(e?.current),
      location: e?.location || '',
      bullets: Array.isArray(e?.bullets) ? e.bullets.filter(Boolean) : []
    })) : [],
    education: Array.isArray(raw.education) ? raw.education.map((ed: any, idx: number) => ({
      id: ed?.id || `edu-${idx}`,
      institution: ed?.institution || '',
      degree: ed?.degree || '',
      startDate: ed?.startDate || '',
      endDate: ed?.endDate || '',
      gpaOrPercentage: ed?.gpaOrPercentage || ''
    })) : [],
    projects: Array.isArray(raw.projects) ? raw.projects.map((p: any, idx: number) => ({
      id: p?.id || `proj-${idx}`,
      title: p?.title || '',
      techStack: Array.isArray(p?.techStack) ? p.techStack : [],
      liveUrl: p?.liveUrl || '',
      githubUrl: p?.githubUrl || '',
      date: p?.date || '',
      bullets: Array.isArray(p?.bullets) ? p.bullets.filter(Boolean) : []
    })) : [],
    certifications: Array.isArray(raw.certifications) ? raw.certifications.map((c: any, idx: number) => ({
      id: c?.id || `cert-${idx}`,
      name: c?.name || '',
      issuer: c?.issuer || '',
      date: c?.date || '',
      scoreOrHonor: c?.scoreOrHonor || ''
    })) : [],
    achievements: Array.isArray(raw.achievements) ? raw.achievements : []
  };
}
