import React from 'react';
import { ResumeData } from '../../../types/resume';

interface TemplateProps {
  resume: ResumeData;
}

export const ModernDevTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, skills, experience, projects, education, certifications, achievements } = resume;

  return (
    <div className="bg-white text-slate-900 p-8 sm:p-10 font-sans max-w-[800px] mx-auto text-[12.5px] leading-relaxed shadow-2xl border-t-4 border-indigo-600 print:p-0 print:shadow-none print:max-w-none">
      
      {/* Header */}
      <div className="flex justify-between items-start border-b border-slate-200 pb-4 mb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{personalInfo.fullName}</h1>
          <p className="text-xs font-semibold text-indigo-600 mt-0.5 font-mono">{personalInfo.headline || 'Full Stack Engineer'}</p>
          <p className="text-xs text-slate-600 mt-1">{personalInfo.location}</p>
        </div>
        <div className="text-right text-xs font-mono space-y-0.5 text-slate-600">
          {personalInfo.email && <div><a href={`mailto:${personalInfo.email}`} className="text-indigo-600 hover:underline">{personalInfo.email}</a></div>}
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.portfolioUrl && <div><a href={personalInfo.portfolioUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Portfolio</a></div>}
          {personalInfo.githubUrl && <div><a href={personalInfo.githubUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">GitHub</a></div>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1 font-mono">
            // Profile Summary
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Skills */}
      <div className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1.5 font-mono">
          // Core Competencies
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {Object.values(skills).flat().map((skill, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-900 text-[11px] font-medium font-mono">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2 font-mono">
            // Experience
          </h2>
          <div className="space-y-3">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-bold text-slate-900">{exp.role} <span className="font-normal text-slate-600">@ {exp.company}</span></span>
                  <span className="text-indigo-600 font-mono text-[11px]">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <ul className="list-disc ml-4 text-xs text-slate-700 space-y-0.5 mt-1">
                  {exp.bullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2 font-mono">
            // Technical Projects
          </h2>
          <div className="space-y-3">
            {projects.map(proj => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{proj.title}</span>
                    <span className="text-slate-500 font-mono text-[11px]"> ({proj.techStack.join(', ')})</span>
                  </div>
                  {proj.date && <span className="text-slate-500 font-mono text-[11px]">{proj.date}</span>}
                </div>
                <ul className="list-disc ml-4 text-xs text-slate-700 space-y-0.5 mt-1">
                  {proj.bullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1.5 font-mono">
            // Education
          </h2>
          <div className="space-y-2">
            {education.map(edu => (
              <div key={edu.id} className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree}</span>
                  <div className="text-slate-600 text-[11.5px]">{edu.institution}</div>
                </div>
                <div className="text-right text-slate-600 font-mono text-[11px]">
                  <div>{edu.startDate} – {edu.endDate}</div>
                  {edu.gpaOrPercentage && <div className="text-indigo-600 font-bold">{edu.gpaOrPercentage}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {(certifications.length > 0 || achievements.length > 0) && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1.5 font-mono">
            // Credentials & Awards
          </h2>
          <ul className="list-disc ml-4 text-xs text-slate-700 space-y-0.5">
            {certifications.map(c => (
              <li key={c.id}>
                <b>{c.name}</b> — {c.issuer} {c.scoreOrHonor && `(${c.scoreOrHonor})`}
              </li>
            ))}
            {achievements.map((a, idx) => (
              <li key={idx}>{a}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};
