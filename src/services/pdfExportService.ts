import { ResumeData } from '../types/resume';

export async function exportElementToPdf(element: HTMLElement, fileName: string = 'Resume.pdf'): Promise<void> {
  try {
    const html2canvasModule = await import('html2canvas');
    const html2canvas = html2canvasModule.default || html2canvasModule;
    
    const jsPdfModule = await import('jspdf');
    const jsPDF = jsPdfModule.default || jsPdfModule.jsPDF;

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
  } catch (err) {
    console.error('PDF export error, falling back to window.print():', err);
    window.print();
  }
}

export function generatePlainTextResume(resume: ResumeData): string {
  const lines: string[] = [];

  // Header
  lines.push(resume.personalInfo.fullName.toUpperCase());
  if (resume.personalInfo.headline) lines.push(resume.personalInfo.headline);

  const contactParts: string[] = [];
  if (resume.personalInfo.email) contactParts.push(resume.personalInfo.email);
  if (resume.personalInfo.phone) contactParts.push(resume.personalInfo.phone);
  if (resume.personalInfo.location) contactParts.push(resume.personalInfo.location);
  if (contactParts.length > 0) lines.push(contactParts.join(' | '));

  const linkParts: string[] = [];
  if (resume.personalInfo.portfolioUrl) linkParts.push(`Portfolio: ${resume.personalInfo.portfolioUrl}`);
  if (resume.personalInfo.githubUrl) linkParts.push(`GitHub: ${resume.personalInfo.githubUrl}`);
  if (resume.personalInfo.linkedInUrl) linkParts.push(`LinkedIn: ${resume.personalInfo.linkedInUrl}`);
  if (linkParts.length > 0) lines.push(linkParts.join(' | '));

  lines.push('');

  // Summary
  if (resume.summary) {
    lines.push('--- PROFESSIONAL SUMMARY ---');
    lines.push(resume.summary);
    lines.push('');
  }

  // Skills
  lines.push('--- TECHNICAL SKILLS ---');
  if (resume.skills.languages.length > 0) lines.push(`Languages: ${resume.skills.languages.join(', ')}`);
  if (resume.skills.frontend.length > 0) lines.push(`Frontend: ${resume.skills.frontend.join(', ')}`);
  if (resume.skills.backend.length > 0) lines.push(`Backend: ${resume.skills.backend.join(', ')}`);
  if (resume.skills.database.length > 0) lines.push(`Databases: ${resume.skills.database.join(', ')}`);
  if (resume.skills.tools.length > 0) lines.push(`Tools & Cloud: ${resume.skills.tools.join(', ')}`);
  if (resume.skills.coreCS.length > 0) lines.push(`Core CS: ${resume.skills.coreCS.join(', ')}`);
  lines.push('');

  // Experience
  if (resume.experience.length > 0) {
    lines.push('--- WORK EXPERIENCE ---');
    resume.experience.forEach(exp => {
      lines.push(`${exp.role} - ${exp.company} (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate})`);
      exp.bullets.forEach(b => lines.push(`  * ${b}`));
      lines.push('');
    });
  }

  // Projects
  if (resume.projects.length > 0) {
    lines.push('--- TECHNICAL PROJECTS ---');
    resume.projects.forEach(proj => {
      lines.push(`${proj.title} [Tech: ${proj.techStack.join(', ')}]`);
      if (proj.liveUrl) lines.push(`  Link: ${proj.liveUrl}`);
      proj.bullets.forEach(b => lines.push(`  * ${b}`));
      lines.push('');
    });
  }

  // Education
  if (resume.education.length > 0) {
    lines.push('--- EDUCATION ---');
    resume.education.forEach(edu => {
      lines.push(`${edu.degree} - ${edu.institution} (${edu.startDate} - ${edu.endDate})`);
      if (edu.gpaOrPercentage) lines.push(`  Score: ${edu.gpaOrPercentage}`);
    });
    lines.push('');
  }

  // Certifications
  if (resume.certifications.length > 0 || resume.achievements.length > 0) {
    lines.push('--- CERTIFICATIONS & AWARDS ---');
    resume.certifications.forEach(c => lines.push(`  * ${c.name} (${c.issuer})`));
    resume.achievements.forEach(a => lines.push(`  * ${a}`));
  }

  return lines.join('\n');
}

export function exportResumeToJson(resume: ResumeData): void {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(resume, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `${resume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume_Data.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
