import React, { useState } from 'react';
import { X, Check, FileCheck, User, Mail, Phone, MapPin, Briefcase, GraduationCap, Code, AlertTriangle } from 'lucide-react';
import { ResumeData } from '../../types/resume';

interface ExtractedReviewModalProps {
  resume: ResumeData;
  isOpen: boolean;
  onClose: () => void;
  onSaveAndAnalyze: (updatedResume: ResumeData) => void;
}

export const ExtractedReviewModal: React.FC<ExtractedReviewModalProps> = ({
  resume,
  isOpen,
  onClose,
  onSaveAndAnalyze
}) => {
  const [formData, setFormData] = useState<ResumeData>(JSON.parse(JSON.stringify(resume)));
  const [activeTab, setActiveTab] = useState<'info' | 'summary' | 'skills' | 'experience' | 'education'>('info');

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveAndAnalyze(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Review Extracted Resume Data</h3>
              <p className="text-xs text-slate-400">Verify extracted details or make instant corrections before running analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-6 gap-2 overflow-x-auto text-xs font-medium">
          {[
            { id: 'info', label: 'Contact Info', icon: <User className="w-3.5 h-3.5" /> },
            { id: 'summary', label: 'Summary', icon: <Briefcase className="w-3.5 h-3.5" /> },
            { id: 'skills', label: 'Skills', icon: <Code className="w-3.5 h-3.5" /> },
            { id: 'experience', label: 'Experience & Projects', icon: <Briefcase className="w-3.5 h-3.5" /> },
            { id: 'education', label: 'Education', icon: <GraduationCap className="w-3.5 h-3.5" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-3 border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-brand-500 text-brand-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: Contact Info */}
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={formData.personalInfo.fullName}
                  onChange={e => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, fullName: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Headline / Target Role</label>
                <input
                  type="text"
                  value={formData.personalInfo.headline || ''}
                  onChange={e => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, headline: e.target.value }
                  })}
                  placeholder="e.g. Full Stack Software Engineer"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={e => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, email: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  value={formData.personalInfo.phone}
                  onChange={e => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, phone: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Location</label>
                <input
                  type="text"
                  value={formData.personalInfo.location}
                  onChange={e => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, location: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Portfolio URL</label>
                <input
                  type="text"
                  value={formData.personalInfo.portfolioUrl || ''}
                  onChange={e => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, portfolioUrl: e.target.value }
                  })}
                  placeholder="https://yourportfolio.com"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">LinkedIn Profile</label>
                <input
                  type="text"
                  value={formData.personalInfo.linkedInUrl || ''}
                  onChange={e => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, linkedInUrl: e.target.value }
                  })}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">GitHub Profile</label>
                <input
                  type="text"
                  value={formData.personalInfo.githubUrl || ''}
                  onChange={e => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, githubUrl: e.target.value }
                  })}
                  placeholder="https://github.com/username"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Summary */}
          {activeTab === 'summary' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">Professional Summary</label>
              <textarea
                rows={6}
                value={formData.summary}
                onChange={e => setFormData({ ...formData, summary: e.target.value })}
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500"
                placeholder="Enter a 2-4 sentence overview of your engineering experience and key strengths..."
              />
              <p className="text-xs text-slate-400">
                Word count: {formData.summary.split(/\s+/).filter(Boolean).length} words
              </p>
            </div>
          )}

          {/* TAB 3: Skills */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              {Object.entries(formData.skills).map(([category, skillList]) => (
                <div key={category} className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    {category}
                  </label>
                  <input
                    type="text"
                    value={skillList.join(', ')}
                    onChange={e => {
                      const updated = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                      setFormData({
                        ...formData,
                        skills: { ...formData.skills, [category]: updated }
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500"
                    placeholder="Separate skills with commas (e.g. React, Node.js, TypeScript)"
                  />
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: Experience & Projects */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Projects</h4>
                <div className="space-y-3">
                  {formData.projects.map((proj, pIdx) => (
                    <div key={proj.id} className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={proj.title}
                          onChange={e => {
                            const copy = [...formData.projects];
                            copy[pIdx].title = e.target.value;
                            setFormData({ ...formData, projects: copy });
                          }}
                          className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white font-semibold"
                          placeholder="Project Title"
                        />
                        <input
                          type="text"
                          value={proj.techStack.join(', ')}
                          onChange={e => {
                            const copy = [...formData.projects];
                            copy[pIdx].techStack = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                            setFormData({ ...formData, projects: copy });
                          }}
                          className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-slate-300"
                          placeholder="Tech Stack (comma separated)"
                        />
                      </div>
                      <div className="space-y-1.5">
                        {proj.bullets.map((bullet, bIdx) => (
                          <textarea
                            key={bIdx}
                            rows={2}
                            value={bullet}
                            onChange={e => {
                              const copy = [...formData.projects];
                              copy[pIdx].bullets[bIdx] = e.target.value;
                              setFormData({ ...formData, projects: copy });
                            }}
                            className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none"
                            placeholder="Bullet point describing achievement and implementation..."
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Education */}
          {activeTab === 'education' && (
            <div className="space-y-3">
              {formData.education.map((edu, eIdx) => (
                <div key={edu.id} className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Degree / Certification</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={e => {
                        const copy = [...formData.education];
                        copy[eIdx].degree = e.target.value;
                        setFormData({ ...formData, education: copy });
                      }}
                      className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={e => {
                        const copy = [...formData.education];
                        copy[eIdx].institution = e.target.value;
                        setFormData({ ...formData, education: copy });
                      }}
                      className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-850 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition"
          >
            <Check className="w-4 h-4" />
            <span>Confirm & Run Full ATS Analysis</span>
          </button>
        </div>

      </div>
    </div>
  );
};
