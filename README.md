# ResumeIQ — AI Resume Analyzer & ATS Optimizer

> **"Analyze. Optimize. Get Shortlisted."**  
> A production-ready, SaaS-grade AI Resume Analyzer, ATS Compatibility Engine, and Multi-Template Resume Optimizer built for software engineers and technical candidates.

---

## 🌟 Overview

**ResumeIQ** is designed to bridge the gap between engineering talent and modern automated recruitment systems (Workday, Taleo, iCIMS, Greenhouse). It parses real PDF/DOCX resumes entirely in the browser, conducts deep 6-vector algorithmic audits, benchmarks candidates against target job descriptions, and optimizes engineering accomplishment statements with zero data fabrication.

---

## 🚀 Key Features

### 1. 📄 Client-Side PDF & DOCX Document Parsing
- High-fidelity text and section extraction using `pdfjs-dist` and `mammoth.js`.
- **100% Client-Side Privacy**: Resumes are parsed and scored entirely inside your browser session. Zero resume data is stored on remote servers.

### 2. 📊 Transparent 6-Category ATS Scoring Engine (0 – 100)
- **ATS Compatibility (20 pts)**: Heading taxonomy, parseable contact metadata, standard linear structure.
- **Keyword Optimization (25 pts)**: Languages, frontend/backend frameworks, databases, cloud tools, CS fundamentals.
- **Content Quality (20 pts)**: Strong action-first verbs (*Architected, Engineered, Deployed*) and quantifiable metrics (%, ms latency, user scale).
- **Completeness (15 pts)**: Verified contact links (GitHub, Portfolio, LinkedIn), summary, education, and project depth.
- **Formatting (10 pts)**: Density, bullet point consistency, and typography hierarchy.
- **Recruiter Readability (10 pts)**: 6-second visual scanability and reading pacing.

### 3. 🎯 Target Job Description Matcher & Keyword Gap
- Benchmarks resumes against real tech job postings.
- Categorizes skills into **Matched** (Green), **Missing** (Red), and **Underrepresented** (Amber).
- Weights required vs preferred qualifications to compute an accurate role match score.
- Strictly adheres to **Ethical ATS rules** — never promotes keyword stuffing or fabricating skills.

### 4. 🤖 AI Bullet Optimizer & Change Review System
- Converts passive phrasing (*"Worked on website"*) into high-impact XYZ accomplishment statements (*"Architected responsive React.js dashboard with modular components..."*).
- Explains **"Why this is better"** with concrete rationale.
- 1-Click **[Accept] / [Reject]** diff review before updating the resume.
- Evaluates projects for full-stack architecture, REST APIs, database indexing, and deployment links.

### 5. 🛠️ Live Multi-Template Resume Builder
- Visual editor for Personal Info, Summary, Skills, Experience, Projects, Education, and Certifications.
- Live side-by-side preview with **4 ATS-Compliant Templates**:
  - **ATS Classic**: Linear 1-column standard for maximum parser pass rates.
  - **Modern Developer**: Clean tech layout with monospace accents and skill tags.
  - **Executive Corporate**: Traditional serif styling with elegant hierarchy.
  - **Compact 1-Page**: High-density format optimized for single-page profiles.

### 6. 📈 Version Comparison & Scan History
- Side-by-side progression diff comparing Baseline scans vs Current optimized versions.
- Visualizes score gains, new keywords captured, and resolved critical issues.
- Persistent local history with instant version restoration.

### 7. 📥 Export Suite
- **Download PDF**: Clean vector PDF export.
- **Copy Plain Text**: Pre-formatted ASCII text for job portal text boxes.
- **Export JSON**: Structured JSON schema backup.
- **Print**: Print-optimized stylesheets for standard A4 paper.

---

## 🏗️ Architecture & Data Flow

```text
User / Candidate
       │
       ▼
[ Resume Upload (PDF / DOCX) ]  ───►  [ Document Parser (PDF.js / Mammoth) ]
                                                        │
                                                        ▼
                                             [ Structured Resume Model ]
                                                        │
         ┌──────────────────────────────────────────────┼──────────────────────────────────────────────┐
         ▼                                              ▼                                              ▼
[ ATS Scorer Engine ]                       [ Job Description Matcher ]                   [ AI Optimizer Layer ]
• Compatibility (20pts)                     • Required vs Preferred Skills               • XYZ Formula Rewriter
• Keywords Density (25pts)                  • Keyword Gap (Matched/Missing)              • "Why This is Better"
• Content & Verbs (20pts)                   • Role Match Percentage                      • Accept / Reject Diffs
• Completeness (15pts)                                                                   • Summary Enhancer
• Formatting (10pts)
• Recruiter Readability (10pts)
         │                                              │                                              │
         └──────────────────────────────────────────────┼──────────────────────────────────────────────┘
                                                        │
                                                        ▼
                                           [ Multi-Template Live Editor ]
                                                        │
                                                        ▼
                                      [ Export: PDF / Plain Text / JSON ]
```

---

## 💻 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, PostCSS, Lucide Icons
- **Document Processing**: `pdfjs-dist`, `mammoth`
- **PDF Generation**: `jspdf`, `html2canvas`
- **AI Integration**: Google Gemini 1.5 Flash / OpenAI GPT-4o API (optional user key) + Deterministic Offline Heuristic Engine
- **State & Storage**: React State + LocalStorage Client Persistence

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation
```bash
# Clone or navigate to the project directory
cd d:/resume

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 🔒 Privacy & Security

- All resume parsing, keyword tokenization, and scoring algorithms execute **strictly client-side in the browser**.
- Optional Gemini or OpenAI API keys are stored in `localStorage` in the user's private browser session and are **never** logged or transmitted to third-party tracking services.
- Resumes can be deleted or cleared from local storage at any time with a single click.

---

## 📄 License
MIT License. Built as an open-source recruitment intelligence tool.
