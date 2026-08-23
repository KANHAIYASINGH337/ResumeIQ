import React from 'react';
import { ResumeData } from '../../../types/resume';

interface TemplateProps {
  resume: ResumeData;
}

export const ClassicAtsTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, skills, experience, projects, education, certifications, achievements } = resume;

  return (
    <div className="bg-white text-black p-8 sm:p-10 font-sans max-w-[800px] mx-auto text-[13px] leading-normal shadow-2xl print:p-0 print:shadow-none print:max-w-none">
      
      {/* Header */}
      <div className="text-center border-b-2 border-black pb-3 mb-4">
        <h1 className="text-2xl font-bold uppercase tracking-wide text-black">{personalInfo.fullName}</h1>
        {personalInfo.headline && (
          <p className="text-xs italic text-gray-700 mt-0.5">{personalInfo.headline}</p>
        )}
        <div className="text-xs text-gray-800 mt-1.5 flex justify-center flex-wrap gap-x-2 gap-y-0.5">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.email && (
            <span>• <a href={`mailto:${personalInfo.email}`} className="text-blue-700 underline">{personalInfo.email}</a></span>
          )}
          {personalInfo.portfolioUrl && (
            <span>• <a href={personalInfo.portfolioUrl} target="_blank" rel="noreferrer" className="text-blue-700 underline">Portfolio</a></span>
          )}
          {personalInfo.linkedInUrl && (
            <span>• <a href={personalInfo.linkedInUrl} target="_blank" rel="noreferrer" className="text-blue-700 underline">LinkedIn</a></span>
          )}
          {personalInfo.githubUrl && (
            <span>• <a href={personalInfo.githubUrl} target="_blank" rel="noreferrer" className="text-blue-700 underline">GitHub</a></span>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase text-blue-900 border-b border-blue-900 pb-0.5 mb-1.5">
            Professional Summary
          </h2>
          <p className="text-xs text-gray-900 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Technical Skills */}
      <div className="mb-4">
        <h2 className="text-sm font-bold uppercase text-blue-900 border-b border-blue-900 pb-0.5 mb-1.5">
          Technical Skills
        </h2>
        <div className="text-xs space-y-1">
          {skills.languages.length > 0 && (
            <div><b>Languages:</b> {skills.languages.join(', ')}</div>
          )}
          {skills.frontend.length > 0 && (
            <div><b>Frontend:</b> {skills.frontend.join(', ')}</div>
          )}
          {skills.backend.length > 0 && (
            <div><b>Backend:</b> {skills.backend.join(', ')}</div>
          )}
          {skills.database.length > 0 && (
            <div><b>Database:</b> {skills.database.join(', ')}</div>
          )}
          {skills.tools.length > 0 && (
            <div><b>Tools & Cloud:</b> {skills.tools.join(', ')}</div>
          )}
          {skills.coreCS.length > 0 && (
            <div><b>Core CS:</b> {skills.coreCS.join(', ')}</div>
          )}
        </div>
      </div>

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase text-blue-900 border-b border-blue-900 pb-0.5 mb-1.5">
            Work Experience
          </h2>
          <div className="space-y-3">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline font-bold text-xs">
                  <span>{exp.role} — <span className="font-semibold text-gray-800">{exp.company}</span></span>
                  <span className="text-gray-700 font-normal">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                {exp.location && <div className="text-[11px] text-gray-600 mb-1">{exp.location}</div>}
                <ul className="list-disc ml-5 text-xs text-gray-900 space-y-0.5 mt-1">
                  {exp.bullets.map((b, idx) => (
                    <li key={idx} className="leading-relaxed">{b}</li>
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
          <h2 className="text-sm font-bold uppercase text-blue-900 border-b border-blue-900 pb-0.5 mb-1.5">
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map(proj => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline text-xs">
                  <div>
                    <span className="font-bold text-black">{proj.title}</span>
                    <span className="text-gray-700 text-[11px]"> | {proj.techStack.join(', ')}</span>
                    {proj.liveUrl && (
                      <span className="ml-2 text-blue-700 underline text-[11px]">
                        <a href={proj.liveUrl} target="_blank" rel="noreferrer">[Live Demo]</a>
                      </span>
                    )}
                  </div>
                  {proj.date && <span className="text-gray-700 text-xs font-medium">{proj.date}</span>}
                </div>
                <ul className="list-disc ml-5 text-xs text-gray-900 space-y-0.5 mt-1">
                  {proj.bullets.map((b, idx) => (
                    <li key={idx} className="leading-relaxed">{b}</li>
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
          <h2 className="text-sm font-bold uppercase text-blue-900 border-b border-blue-900 pb-0.5 mb-1.5">
            Education
          </h2>
          <div className="space-y-2">
            {education.map(edu => (
              <div key={edu.id} className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-bold text-black">{edu.degree}</span>
                  <div className="text-gray-800 text-[11.5px]">{edu.institution}</div>
                </div>
                <div className="text-right text-gray-700 text-xs">
                  <div>{edu.startDate} – {edu.endDate}</div>
                  {edu.gpaOrPercentage && <div className="font-semibold text-black">{edu.gpaOrPercentage}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Achievements */}
      {(certifications.length > 0 || achievements.length > 0) && (
        <div>
          <h2 className="text-sm font-bold uppercase text-blue-900 border-b border-blue-900 pb-0.5 mb-1.5">
            Certifications & Achievements
          </h2>
          <ul className="list-disc ml-5 text-xs text-gray-900 space-y-0.5">
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
