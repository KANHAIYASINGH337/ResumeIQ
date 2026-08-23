import { ResumeData } from '../types/resume';

export const SAMPLE_RESUME: ResumeData = {
  id: 'sample-resume-01',
  versionName: 'Software Engineer (MERN / Full Stack)',
  updatedAt: new Date().toISOString(),
  personalInfo: {
    fullName: 'Alex Morgan',
    headline: 'Full Stack Engineer | React, Node.js, TypeScript & Cloud Systems',
    email: 'alex.morgan.dev@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    portfolioUrl: 'https://alexmorgan.dev',
    linkedInUrl: 'https://linkedin.com/in/alexmorgandev',
    githubUrl: 'https://github.com/alexmorgandev'
  },
  summary: 'Full Stack Software Engineer with 3+ years of experience architecting resilient web applications, distributed backend services, and interactive user interfaces using React, TypeScript, Node.js, and PostgreSQL. Proven track record of optimizing API performance by 40% and designing high-throughput data processing workflows.',
  skills: {
    languages: ['TypeScript', 'JavaScript', 'Python', 'Go', 'SQL', 'HTML5', 'CSS3'],
    frontend: ['React.js', 'Next.js', 'Redux Toolkit', 'Tailwind CSS', 'GraphQL', 'WebSockets'],
    backend: ['Node.js', 'Express.js', 'FastAPI', 'REST APIs', 'gRPC', 'Microservices'],
    database: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma ORM'],
    tools: ['Docker', 'Kubernetes', 'AWS (S3, EC2, Lambda)', 'Git', 'GitHub Actions', 'Jest', 'Postman'],
    coreCS: ['Data Structures & Algorithms', 'System Design', 'OOP', 'Database Indexing', 'CI/CD Pipelines'],
    softSkills: ['Agile / Scrum', 'Technical Leadership', 'Cross-Functional Collaboration', 'Code Reviews']
  },
  experience: [
    {
      id: 'exp-1',
      company: 'Apex Cloud Solutions',
      role: 'Full Stack Software Engineer',
      startDate: '2022-06',
      endDate: 'Present',
      current: true,
      location: 'San Francisco, CA',
      bullets: [
        'Architected and deployed a multi-tenant telemetry dashboard in React and TypeScript, handling over 250,000 daily active user interactions.',
        'Engineered 14+ high-performance REST and WebSocket endpoints in Node.js/Express, reducing peak server response latency by 38%.',
        'Implemented Redis caching and PostgreSQL query optimization, cutting expensive database query times from 420ms to 45ms.',
        'Spearheaded automated CI/CD deployment pipelines using GitHub Actions and Docker, reducing release cycle time by 60%.'
      ]
    },
    {
      id: 'exp-2',
      company: 'NovaTech Labs',
      role: 'Software Engineer Intern',
      startDate: '2021-05',
      endDate: '2022-04',
      current: false,
      location: 'San Jose, CA',
      bullets: [
        'Developed reusable UI component library in React and Tailwind CSS adopted by 4 internal development squads.',
        'Integrated OAuth2 authentication and JWT token rotation flows, enhancing session security across distributed microservices.',
        'Authored comprehensive unit and integration test suites in Jest achieving 88% overall code coverage.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science in Computer Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2018-09',
      endDate: '2022-05',
      gpaOrPercentage: '3.8 / 4.0',
      location: 'Berkeley, CA',
      highlights: ['Dean\'s Honors List (4 consecutive semesters)', 'Course Assistant for Data Structures & Algorithms']
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'DevSync — Real-Time Collaborative Code Editor',
      techStack: ['React', 'TypeScript', 'Node.js', 'WebSockets', 'Redis', 'Docker'],
      liveUrl: 'https://devsync-demo.app',
      githubUrl: 'https://github.com/alexmorgandev/devsync',
      date: '2023',
      bullets: [
        'Engineered an operational transformation engine supporting concurrent low-latency multi-user code editing with sub-50ms sync.',
        'Implemented Dockerized sandboxed code execution environment supporting 5 programming languages with secure resource quotas.',
        'Deployed production cluster on AWS ECS with auto-scaling, sustaining 1,000+ concurrent real-time room sessions.'
      ]
    },
    {
      id: 'proj-2',
      title: 'PulseMetrics — Distributed API Monitoring & Alerting Platform',
      techStack: ['Go', 'React', 'FastAPI', 'PostgreSQL', 'TimescaleDB', 'Tailwind CSS'],
      liveUrl: 'https://pulsemetrics-live.dev',
      githubUrl: 'https://github.com/alexmorgandev/pulsemetrics',
      date: '2023',
      bullets: [
        'Built a time-series analytics engine capable of ingesting and aggregating 10,000+ health check pings per minute.',
        'Designed real-time incident notification system via Webhooks, Slack, and Email with configurable SLA thresholds.'
      ]
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      date: '2023',
      scoreOrHonor: 'Score: 890/1000'
    },
    {
      id: 'cert-2',
      name: 'Certified Kubernetes Application Developer (CKAD)',
      issuer: 'Cloud Native Computing Foundation (CNCF)',
      date: '2023'
    }
  ],
  achievements: [
    'Winner of HackSF 2023 (1st place out of 120+ teams) for building an AI-powered code security scanner.',
    'Published open-source React component with 1,200+ GitHub stars and 40,000 monthly npm downloads.'
  ]
};

export const SAMPLE_JOB_DESCRIPTION = `Job Title: Senior / Mid-Level Full Stack Software Engineer
Company: TechCorp Global
Location: San Francisco, CA / Remote

About the Role:
We are seeking an experienced Full Stack Software Engineer to help build our next-generation cloud analytics platform. You will architect scalable web applications, collaborate with cross-functional teams, and own end-to-end features from system design to production deployment.

Key Responsibilities:
- Design, build, and maintain efficient, reusable, and reliable front-end and back-end code using React, TypeScript, and Node.js.
- Architect high-performance RESTful APIs, GraphQL endpoints, and real-time streaming services.
- Optimize database schemas and queries across PostgreSQL and Redis.
- Collaborate with DevOps to maintain Docker containers, Kubernetes clusters, and CI/CD pipelines in AWS.
- Participate in code reviews, architectural discussions, and mentor junior engineers.

Requirements:
- 3+ years of professional software engineering experience with modern JavaScript / TypeScript.
- Strong proficiency in React.js, state management, and modern CSS frameworks (e.g. Tailwind CSS).
- Deep backend experience with Node.js, Express, or FastAPI, microservices architecture, and REST API design.
- Hands-on experience with relational databases (PostgreSQL/MySQL) and caching layers (Redis).
- Familiarity with cloud providers (AWS, GCP), Docker containerization, and automated testing (Jest, Cypress).
- Solid understanding of Computer Science fundamentals: Data Structures, Algorithms, OOP, and System Design.
- Excellent communication and cross-functional problem-solving skills.

Nice to Have:
- Experience with Kubernetes, Go, or Python.
- Knowledge of WebSockets and distributed systems.
- Contributions to open-source software.`;
