import React from 'react';
import { ResumeData } from '../../../types/resume';

interface TemplateProps {
  resume: ResumeData;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, skills, experience, projects, education, certifications, achievements } = resume;

  return (
    <div className="bg-white text-gray-900 p-8 sm:p-10 font-serif max-w-[800px] mx-auto text-[13px] leading-relaxed shadow-2xl print:p-0 print:shadow-none print:max-w-none">
      
      {/* Header */}
      <div className="text-center pb-4 mb-4 border-b border-gray-400">
        <h1 className="text-3xl font-normal tracking-wide text-gray-900 uppercase font-serif">{personalInfo.fullName}</h1>
        {personalInfo.headline && (
          <p className="text-xs italic text-gray-600 mt-1 font-sans">{personalInfo.headline}</p>
        )}
        <div className="text-xs text-gray-700 mt-2 font-sans flex justify-center flex-wrap gap-x-3 gap-y-1">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.phone && <span>| {personalInfo.phone}</span>}
          {personalInfo.email && <span>| {personalInfo.email}</span>}
          {personalInfo.portfolioUrl && <span>| Portfolio: {personalInfo.portfolioUrl}</span>}
          {personalInfo.linkedInUrl && <span>| LinkedIn</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2 font-sans">
            Executive Summary
          </h2>
          <p className="text-xs text-gray-800 leading-relaxed text-justify">{summary}</p>
        </div>
      )}

      {/* Skills */}
      <div className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2 font-sans">
          Core Expertise
        </h2>
        <div className="text-xs text-gray-800 space-y-1 font-sans">
          <div><b>Languages & Frameworks:</b> {[...skills.languages, ...skills.frontend, ...skills.backend].join(', ')}</div>
          <div><b>Databases & Cloud Infrastructure:</b> {[...skills.database, ...skills.tools].join(', ')}</div>
        </div>
      </div>

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2 font-sans">
            Professional Experience
          </h2>
          <div className="space-y-3.5">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline font-sans text-xs">
                  <span className="font-bold text-gray-900">{exp.role} <span className="font-normal italic">at {exp.company}</span></span>
                  <span className="text-gray-600">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <ul className="list-disc ml-5 text-xs text-gray-800 space-y-1 mt-1 font-sans">
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
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2 font-sans">
            Key Technical Initiatives
          </h2>
          <div className="space-y-3">
            {projects.map(proj => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline font-sans text-xs">
                  <span className="font-bold text-gray-900">{proj.title} <span className="font-normal text-gray-600">({proj.techStack.join(', ')})</span></span>
                  {proj.date && <span className="text-gray-600">{proj.date}</span>}
                </div>
                <ul className="list-disc ml-5 text-xs text-gray-800 space-y-1 mt-1 font-sans">
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
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2 font-sans">
            Education & Academic Background
          </h2>
          <div className="space-y-2 font-sans">
            {education.map(edu => (
              <div key={edu.id} className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-bold text-gray-900">{edu.degree}</span>
                  <div className="text-gray-700">{edu.institution}</div>
                </div>
                <div className="text-right text-gray-600">
                  <div>{edu.startDate} – {edu.endDate}</div>
                  {edu.gpaOrPercentage && <div className="font-semibold text-gray-900">{edu.gpaOrPercentage}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {(certifications.length > 0 || achievements.length > 0) && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2 font-sans">
            Honors & Credentials
          </h2>
          <ul className="list-disc ml-5 text-xs text-gray-800 space-y-1 font-sans">
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
