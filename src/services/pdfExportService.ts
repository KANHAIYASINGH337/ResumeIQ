import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ResumeData } from '../types/resume';

export async function exportElementToPdf(element: HTMLElement, fileName: string = 'Resume.pdf'): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    windowWidth: 1024
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(fileName);
}

export function generatePlainTextResume(resume: ResumeData): string {
  const lines: string[] = [];

  // Header
  lines.push(resume.personalInfo.fullName.toUpperCase());
  if (resume.personalInfo.headline) lines.push(resume.personalInfo.headline);
  
  const contactParts = [
    resume.personalInfo.location,
    resume.personalInfo.phone,
    resume.personalInfo.email,
    resume.personalInfo.portfolioUrl,
    resume.personalInfo.linkedInUrl,
    resume.personalInfo.githubUrl
  ].filter(Boolean);
  lines.push(contactParts.join(' | '));
  lines.push('');

  // Summary
  if (resume.summary) {
    lines.push('PROFESSIONAL SUMMARY');
    lines.push('--------------------');
    lines.push(resume.summary);
    lines.push('');
  }

  // Skills
  lines.push('TECHNICAL SKILLS');
  lines.push('----------------');
  if (resume.skills.languages.length) lines.push(`Languages: ${resume.skills.languages.join(', ')}`);
  if (resume.skills.frontend.length) lines.push(`Frontend: ${resume.skills.frontend.join(', ')}`);
  if (resume.skills.backend.length) lines.push(`Backend: ${resume.skills.backend.join(', ')}`);
  if (resume.skills.database.length) lines.push(`Database: ${resume.skills.database.join(', ')}`);
  if (resume.skills.tools.length) lines.push(`Tools & Cloud: ${resume.skills.tools.join(', ')}`);
  if (resume.skills.coreCS.length) lines.push(`Core CS: ${resume.skills.coreCS.join(', ')}`);
  lines.push('');

  // Experience
  if (resume.experience.length > 0) {
    lines.push('EXPERIENCE');
    lines.push('----------');
    resume.experience.forEach(exp => {
      lines.push(`${exp.role} — ${exp.company} (${exp.startDate} – ${exp.current ? 'Present' : exp.endDate})`);
      if (exp.location) lines.push(`Location: ${exp.location}`);
      exp.bullets.forEach(b => lines.push(`• ${b}`));
      lines.push('');
    });
  }

  // Projects
  if (resume.projects.length > 0) {
    lines.push('PROJECTS');
    lines.push('--------');
    resume.projects.forEach(proj => {
      lines.push(`${proj.title} | ${proj.techStack.join(', ')} ${proj.date ? `(${proj.date})` : ''}`);
      if (proj.liveUrl) lines.push(`Live Demo: ${proj.liveUrl}`);
      if (proj.githubUrl) lines.push(`GitHub: ${proj.githubUrl}`);
      proj.bullets.forEach(b => lines.push(`• ${b}`));
      lines.push('');
    });
  }

  // Education
  if (resume.education.length > 0) {
    lines.push('EDUCATION');
    lines.push('---------');
    resume.education.forEach(edu => {
      lines.push(`${edu.degree} — ${edu.institution} (${edu.startDate} – ${edu.endDate})`);
      if (edu.gpaOrPercentage) lines.push(`Score / GPA: ${edu.gpaOrPercentage}`);
      lines.push('');
    });
  }

  // Certifications & Achievements
  if (resume.certifications.length > 0) {
    lines.push('CERTIFICATIONS');
    lines.push('--------------');
    resume.certifications.forEach(c => {
      lines.push(`• ${c.name} — ${c.issuer} ${c.scoreOrHonor ? `(${c.scoreOrHonor})` : ''}`);
    });
    lines.push('');
  }

  if (resume.achievements.length > 0) {
    lines.push('ACHIEVEMENTS & AWARDS');
    lines.push('---------------------');
    resume.achievements.forEach(a => lines.push(`• ${a}`));
    lines.push('');
  }

  return lines.join('\n');
}

export function exportResumeToJson(resume: ResumeData): void {
  const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${resume.personalInfo.fullName.replace(/\s+/g, '_')}_resume_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
