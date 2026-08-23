import React from 'react';
import { ResumeData } from '../../../types/resume';

interface TemplateProps {
  resume: ResumeData;
}

export const CompactTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, skills, experience, projects, education, certifications, achievements } = resume;

  return (
    <div className="bg-white text-black p-6 sm:p-8 font-sans max-w-[800px] mx-auto text-[11.5px] leading-tight shadow-2xl print:p-0 print:shadow-none print:max-w-none">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b border-black pb-2 mb-3">
        <div>
          <h1 className="text-xl font-bold uppercase text-black">{personalInfo.fullName}</h1>
          <p className="text-[11px] font-medium text-gray-700">{personalInfo.headline || 'Software Engineer'}</p>
        </div>
        <div className="text-right text-[10.5px] text-gray-800">
          <div>{personalInfo.location} | {personalInfo.phone} | {personalInfo.email}</div>
          <div>
            {personalInfo.portfolioUrl && <span className="mr-2">Portfolio: {personalInfo.portfolioUrl}</span>}
            {personalInfo.githubUrl && <span>GitHub: {personalInfo.githubUrl}</span>}
          </div>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-2.5">
          <h2 className="text-[11.5px] font-bold uppercase text-black border-b border-gray-400 pb-0.5 mb-1">
            Summary
          </h2>
          <p className="text-[11px] text-gray-900 leading-snug">{summary}</p>
        </div>
      )}

      {/* Skills */}
      <div className="mb-2.5">
        <h2 className="text-[11.5px] font-bold uppercase text-black border-b border-gray-400 pb-0.5 mb-1">
          Technical Skills
        </h2>
        <div className="text-[11px] grid grid-cols-2 gap-x-4 gap-y-0.5">
          <div><b>Languages & Frontend:</b> {[...skills.languages, ...skills.frontend].join(', ')}</div>
          <div><b>Backend & DB:</b> {[...skills.backend, ...skills.database].join(', ')}</div>
          <div><b>Tools & Cloud:</b> {skills.tools.join(', ')}</div>
          <div><b>Core CS:</b> {skills.coreCS.join(', ')}</div>
        </div>
      </div>

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-2.5">
          <h2 className="text-[11.5px] font-bold uppercase text-black border-b border-gray-400 pb-0.5 mb-1">
            Experience
          </h2>
          <div className="space-y-2">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline font-bold text-[11px]">
                  <span>{exp.role} — {exp.company}</span>
                  <span className="font-normal text-gray-700">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <ul className="list-disc ml-4 text-[10.5px] text-gray-900 space-y-0.5 mt-0.5">
                  {exp.bullets.map((b, idx) => (
                    <li key={idx}>{b.replace(/^[•\-*"'\s]+/, '')}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-2.5">
          <h2 className="text-[11.5px] font-bold uppercase text-black border-b border-gray-400 pb-0.5 mb-1">
            Projects
          </h2>
          <div className="space-y-2">
            {projects.map(proj => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline text-[11px]">
                  <span className="font-bold text-black">{proj.title} <span className="font-normal text-gray-600">({proj.techStack.join(', ')})</span></span>
                  {proj.date && <span className="text-gray-700">{proj.date}</span>}
                </div>
                <ul className="list-disc ml-4 text-[10.5px] text-gray-900 space-y-0.5 mt-0.5">
                  {proj.bullets.map((b, idx) => (
                    <li key={idx}>{b.replace(/^[•\-*"'\s]+/, '')}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-2.5">
          <h2 className="text-[11.5px] font-bold uppercase text-black border-b border-gray-400 pb-0.5 mb-1">
            Education
          </h2>
          <div className="space-y-1">
            {education.map(edu => (
              <div key={edu.id} className="flex justify-between items-baseline text-[11px]">
                <span><b>{edu.degree}</b>, {edu.institution}</span>
                <span className="text-gray-700">{edu.startDate} – {edu.endDate} {edu.gpaOrPercentage && `| ${edu.gpaOrPercentage}`}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {(certifications.length > 0 || achievements.length > 0) && (
        <div>
          <h2 className="text-[11.5px] font-bold uppercase text-black border-b border-gray-400 pb-0.5 mb-1">
            Certifications & Honors
          </h2>
          <ul className="list-disc ml-4 text-[10.5px] text-gray-900 space-y-0.5">
            {certifications.map(c => (
              <li key={c.id}><b>{c.name}</b> — {c.issuer}</li>
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
