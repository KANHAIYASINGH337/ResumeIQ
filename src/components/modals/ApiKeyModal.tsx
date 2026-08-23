import React, { useState } from 'react';
import { X, Key, Shield, CheckCircle2, Sparkles } from 'lucide-react';
import { saveApiConfig, loadApiConfig } from '../../services/storageService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onSaved
}) => {
  const currentConfig = loadApiConfig();
  const [provider, setProvider] = useState<'gemini' | 'openai' | 'offline'>(currentConfig.provider);
  const [apiKey, setApiKey] = useState<string>(currentConfig.apiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    saveApiConfig(provider, apiKey.trim() || undefined);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onSaved();
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden space-y-4 p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Engine & API Settings</h3>
              <p className="text-[11px] text-slate-400">Configure AI provider or use offline heuristics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Provider Radio */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">Choose AI Provider</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'offline', label: 'Offline / Built-in', desc: 'Fast, deterministic' },
              { id: 'gemini', label: 'Google Gemini', desc: 'Gemini 1.5 Flash' },
              { id: 'openai', label: 'OpenAI GPT-4o', desc: 'OpenAI API' }
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setProvider(item.id as any)}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition ${
                  provider === item.id
                    ? 'bg-brand-600/20 border-brand-500 text-white'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div>{item.label}</div>
                <div className="text-[10px] font-normal opacity-75 mt-0.5">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* API Key Input */}
        {provider !== 'offline' && (
          <div className="space-y-1.5 animate-in fade-in">
            <label className="block text-xs font-semibold text-slate-300">
              {provider === 'gemini' ? 'Google Gemini API Key' : 'OpenAI API Key'}
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="Paste your API key here..."
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>
        )}

        {/* Privacy Note */}
        <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero Server Key Retention</span>
          </div>
          <p>Keys are stored exclusively in your browser's private LocalStorage session. They are never sent to external servers or logged.</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition"
          >
            {savedSuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{savedSuccess ? 'Saved!' : 'Save Configuration'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
