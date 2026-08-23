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
  softSkills: string[];
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
