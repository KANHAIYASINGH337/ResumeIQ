import React, { useState } from 'react';
import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  Trophy,
  Plus,
  Trash2,
  Download,
  Copy,
  Printer,
  Sparkles,
  Eye,
  Check
} from 'lucide-react';
import { ResumeData, TemplateId } from '../../types/resume';
import { ClassicAtsTemplate } from './templates/ClassicAtsTemplate';
import { ModernDevTemplate } from './templates/ModernDevTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';
import { CompactTemplate } from './templates/CompactTemplate';
import { exportElementToPdf, generatePlainTextResume } from '../../services/pdfExportService';
import { Badge } from '../ui/Badge';

interface ResumeBuilderProps {
  resume: ResumeData;
  onUpdateResume: (updated: ResumeData) => void;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({
  resume,
  onUpdateResume
}) => {
  const [activeSection, setActiveSection] = useState<'info' | 'summary' | 'skills' | 'exp' | 'projects' | 'edu' | 'certs'>('info');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('classic');
  const [copiedText, setCopiedText] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleCopyPlainText = () => {
    const text = generatePlainTextResume(resume);
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById('printable-resume-preview');
    if (!element) return;
    setIsExporting(true);
    try {
      await exportElementToPdf(element, `${resume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
    } catch (e) {
      console.error('PDF export failed:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Template Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-850 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Template Layout:</label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'classic', label: 'ATS Classic (1-Col)' },
              { id: 'modern', label: 'Modern Developer' },
              { id: 'executive', label: 'Executive Corporate' },
              { id: 'compact', label: 'Compact 1-Page' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id as TemplateId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedTemplate === t.id
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyPlainText}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold transition"
          >
            {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedText ? 'Copied Plain-Text!' : 'Copy ATS Text'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Grid: Left Editor & Right Live Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Section Editor (5 cols) */}
        <div className="xl:col-span-5 space-y-4">
          
          {/* Section Selector Pills */}
          <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-850 border border-slate-800">
            {[
              { id: 'info', label: 'Contact', icon: <User className="w-3 h-3" /> },
              { id: 'summary', label: 'Summary', icon: <Briefcase className="w-3 h-3" /> },
              { id: 'skills', label: 'Skills', icon: <Code className="w-3 h-3" /> },
              { id: 'exp', label: 'Experience', icon: <Briefcase className="w-3 h-3" /> },
              { id: 'projects', label: 'Projects', icon: <Code className="w-3 h-3" /> },
              { id: 'edu', label: 'Education', icon: <GraduationCap className="w-3 h-3" /> },
              { id: 'certs', label: 'Awards', icon: <Trophy className="w-3 h-3" /> }
            ].map(sec => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id as any)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeSection === sec.id
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {sec.icon}
                <span>{sec.label}</span>
              </button>
            ))}
          </div>

          {/* Editor Form Card */}
          <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 shadow-xl space-y-4 max-h-[700px] overflow-y-auto">
            
            {/* 1. Personal Info */}
            {activeSection === 'info' && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Personal Information</h4>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={resume.personalInfo.fullName}
                    onChange={e => onUpdateResume({
                      ...resume,
                      personalInfo: { ...resume.personalInfo, fullName: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Target Headline</label>
                  <input
                    type="text"
                    value={resume.personalInfo.headline || ''}
                    onChange={e => onUpdateResume({
                      ...resume,
                      personalInfo: { ...resume.personalInfo, headline: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Email</label>
                    <input
                      type="text"
                      value={resume.personalInfo.email}
                      onChange={e => onUpdateResume({
                        ...resume,
                        personalInfo: { ...resume.personalInfo, email: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Phone</label>
                    <input
                      type="text"
                      value={resume.personalInfo.phone}
                      onChange={e => onUpdateResume({
                        ...resume,
                        personalInfo: { ...resume.personalInfo, phone: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={resume.personalInfo.location}
                    onChange={e => onUpdateResume({
                      ...resume,
                      personalInfo: { ...resume.personalInfo, location: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Portfolio URL</label>
                  <input
                    type="text"
                    value={resume.personalInfo.portfolioUrl || ''}
                    onChange={e => onUpdateResume({
                      ...resume,
                      personalInfo: { ...resume.personalInfo, portfolioUrl: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>
            )}

            {/* 2. Summary */}
            {activeSection === 'summary' && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Professional Summary</h4>
                <textarea
                  rows={8}
                  value={resume.summary}
                  onChange={e => onUpdateResume({ ...resume, summary: e.target.value })}
                  className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white leading-relaxed"
                />
              </div>
            )}

            {/* 3. Skills */}
            {activeSection === 'skills' && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Technical Skills</h4>
                {Object.entries(resume.skills).map(([category, list]) => (
                  <div key={category}>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase">{category}</label>
                    <input
                      type="text"
                      value={list.join(', ')}
                      onChange={e => {
                        const updated = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        onUpdateResume({
                          ...resume,
                          skills: { ...resume.skills, [category]: updated }
                        });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white mt-0.5"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 4. Experience */}
            {activeSection === 'exp' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Work Experience</h4>
                  <button
                    onClick={() => {
                      const newExp = {
                        id: `exp-${Date.now()}`,
                        company: 'Tech Company',
                        role: 'Software Engineer',
                        startDate: '2023',
                        endDate: 'Present',
                        current: true,
                        bullets: ['Engineered scalable web applications and REST APIs using modern frameworks.']
                      };
                      onUpdateResume({ ...resume, experience: [newExp, ...resume.experience] });
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-400 hover:text-brand-300"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Job
                  </button>
                </div>

                {resume.experience.map((exp, expIdx) => (
                  <div key={exp.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white">Job #{expIdx + 1}</span>
                      <button
                        onClick={() => {
                          const filtered = resume.experience.filter((_, idx) => idx !== expIdx);
                          onUpdateResume({ ...resume, experience: filtered });
                        }}
                        className="text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={exp.role}
                        onChange={e => {
                          const copy = [...resume.experience];
                          copy[expIdx].role = e.target.value;
                          onUpdateResume({ ...resume, experience: copy });
                        }}
                        placeholder="Job Title"
                        className="px-2.5 py-1.5 rounded bg-slate-850 border border-slate-700 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={exp.company}
                        onChange={e => {
                          const copy = [...resume.experience];
                          copy[expIdx].company = e.target.value;
                          onUpdateResume({ ...resume, experience: copy });
                        }}
                        placeholder="Company"
                        className="px-2.5 py-1.5 rounded bg-slate-850 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      {exp.bullets.map((b, bIdx) => (
                        <textarea
                          key={bIdx}
                          rows={2}
                          value={b}
                          onChange={e => {
                            const copy = [...resume.experience];
                            copy[expIdx].bullets[bIdx] = e.target.value;
                            onUpdateResume({ ...resume, experience: copy });
                          }}
                          className="w-full p-2 rounded bg-slate-850 border border-slate-700 text-xs text-slate-200"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 5. Projects */}
            {activeSection === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Technical Projects</h4>
                  <button
                    onClick={() => {
                      const newProj = {
                        id: `proj-${Date.now()}`,
                        title: 'New Full Stack Project',
                        techStack: ['React', 'Node.js', 'PostgreSQL'],
                        bullets: ['Architected and shipped a full-stack web application with responsive UI.'],
                        date: '2024'
                      };
                      onUpdateResume({ ...resume, projects: [newProj, ...resume.projects] });
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-400 hover:text-brand-300"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Project
                  </button>
                </div>

                {resume.projects.map((proj, pIdx) => (
                  <div key={proj.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white">Project #{pIdx + 1}</span>
                      <button
                        onClick={() => {
                          const filtered = resume.projects.filter((_, idx) => idx !== pIdx);
                          onUpdateResume({ ...resume, projects: filtered });
                        }}
                        className="text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={proj.title}
                      onChange={e => {
                        const copy = [...resume.projects];
                        copy[pIdx].title = e.target.value;
                        onUpdateResume({ ...resume, projects: copy });
                      }}
                      className="w-full px-2.5 py-1.5 rounded bg-slate-850 border border-slate-700 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={proj.techStack.join(', ')}
                      onChange={e => {
                        const copy = [...resume.projects];
                        copy[pIdx].techStack = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        onUpdateResume({ ...resume, projects: copy });
                      }}
                      placeholder="Tech Stack"
                      className="w-full px-2.5 py-1.5 rounded bg-slate-850 border border-slate-700 text-xs text-slate-300"
                    />
                    <div className="space-y-1">
                      {proj.bullets.map((b, bIdx) => (
                        <textarea
                          key={bIdx}
                          rows={2}
                          value={b}
                          onChange={e => {
                            const copy = [...resume.projects];
                            copy[pIdx].bullets[bIdx] = e.target.value;
                            onUpdateResume({ ...resume, projects: copy });
                          }}
                          className="w-full p-2 rounded bg-slate-850 border border-slate-700 text-xs text-slate-200"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 6. Education */}
            {activeSection === 'edu' && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Education</h4>
                {resume.education.map((edu, eIdx) => (
                  <div key={edu.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={e => {
                        const copy = [...resume.education];
                        copy[eIdx].degree = e.target.value;
                        onUpdateResume({ ...resume, education: copy });
                      }}
                      placeholder="Degree"
                      className="w-full px-2.5 py-1.5 rounded bg-slate-850 border border-slate-700 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={e => {
                        const copy = [...resume.education];
                        copy[eIdx].institution = e.target.value;
                        onUpdateResume({ ...resume, education: copy });
                      }}
                      placeholder="Institution"
                      className="w-full px-2.5 py-1.5 rounded bg-slate-850 border border-slate-700 text-xs text-slate-300"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 7. Certifications */}
            {activeSection === 'certs' && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Certifications & Achievements</h4>
                {resume.certifications.map((c, cIdx) => (
                  <div key={c.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                    <input
                      type="text"
                      value={c.name}
                      onChange={e => {
                        const copy = [...resume.certifications];
                        copy[cIdx].name = e.target.value;
                        onUpdateResume({ ...resume, certifications: copy });
                      }}
                      className="w-full px-2 py-1 rounded bg-slate-850 border border-slate-700 text-xs text-white"
                    />
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* RIGHT COLUMN: Live Template Preview (7 cols) */}
        <div className="xl:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-brand-400" /> Live ATS Preview
            </span>
            <span>A4 Document Geometry</span>
          </div>

          <div className="rounded-2xl bg-slate-950 p-4 sm:p-6 border border-slate-800 overflow-x-auto shadow-2xl">
            <div id="printable-resume-preview" className="shadow-2xl mx-auto origin-top transition-all">
              {selectedTemplate === 'classic' && <ClassicAtsTemplate resume={resume} />}
              {selectedTemplate === 'modern' && <ModernDevTemplate resume={resume} />}
              {selectedTemplate === 'executive' && <ExecutiveTemplate resume={resume} />}
              {selectedTemplate === 'compact' && <CompactTemplate resume={resume} />}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
