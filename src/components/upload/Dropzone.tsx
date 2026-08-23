import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  compact?: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFileSelect,
  isLoading,
  compact = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFile = (file: File) => {
    setErrorMessage(null);
    const validExtensions = ['pdf', 'docx', 'txt'];
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!extension || !validExtensions.includes(extension)) {
      setErrorMessage('Unsupported file format. Please upload a PDF, DOCX, or TXT file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds 10MB. Please choose a smaller resume file.');
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`relative group cursor-pointer border-2 border-dashed rounded-2xl transition-all duration-300 ${
          compact ? 'p-6' : 'p-8 sm:p-10'
        } ${
          isDragging
            ? 'border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-500/20 scale-[1.01]'
            : 'border-slate-700/80 hover:border-slate-600 bg-slate-850/70 hover:bg-slate-850'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isLoading}
        />

        <div className="flex flex-col items-center justify-center text-center space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center space-y-3 py-4">
              <Loader2 className="w-10 h-10 text-brand-400 animate-spin" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">Extracting & Analyzing Resume...</p>
                <p className="text-xs text-slate-400">Running client-side parsing, keyword categorization, and ATS scoring</p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UploadCloud className="w-7 h-7" />
              </div>

              <div>
                <p className="text-base font-bold text-white tracking-tight">
                  <span className="text-brand-400">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supported formats: <b>PDF</b> (Recommended), <b>DOCX</b>, <b>TXT</b> (Max 10MB)
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Client-Side Parser
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Zero Data Storage
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
