import React, { useState } from 'react';
import { X, Download, Copy, Printer, FileCode, CheckCircle2, FileText, Check } from 'lucide-react';
import { ResumeData } from '../../types/resume';
import { generatePlainTextResume, exportResumeToJson, exportElementToPdf } from '../../services/pdfExportService';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  resume
}) => {
  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  if (!isOpen) return null;

  const handleCopyText = () => {
    const text = generatePlainTextResume(resume);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadJson = () => {
    exportResumeToJson(resume);
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById('printable-resume-preview');
    if (element) {
      setIsExportingPdf(true);
      try {
        await exportElementToPdf(element, `${resume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
      } catch (e) {
        console.error('PDF generation error:', e);
      } finally {
        setIsExportingPdf(false);
      }
    } else {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden space-y-4 p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Export & Download Suite</h3>
              <p className="text-[11px] text-slate-400">Choose your preferred output format</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Option 1: PDF */}
          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="p-4 rounded-xl bg-slate-850 border border-slate-800 hover:border-brand-500/50 hover:bg-slate-800 text-left transition group space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Download PDF</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">High-fidelity, ATS-optimized vector PDF</p>
            </div>
          </button>

          {/* Option 2: Copy Plain Text */}
          <button
            onClick={handleCopyText}
            className="p-4 rounded-xl bg-slate-850 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800 text-left transition group space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">
                {copied ? 'Copied to Clipboard!' : 'Copy Plain Text'}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Unformatted text for application portals</p>
            </div>
          </button>

          {/* Option 3: Print */}
          <button
            onClick={() => window.print()}
            className="p-4 rounded-xl bg-slate-850 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800 text-left transition group space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Print to Paper / PDF</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Direct browser print dialog with A4 margins</p>
            </div>
          </button>

          {/* Option 4: JSON Backup */}
          <button
            onClick={handleDownloadJson}
            className="p-4 rounded-xl bg-slate-850 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800 text-left transition group space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Export JSON Data</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Structured schema backup of your resume</p>
            </div>
          </button>

        </div>

      </div>
    </div>
  );
};
