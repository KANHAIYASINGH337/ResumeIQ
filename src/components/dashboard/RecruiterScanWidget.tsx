import React from 'react';
import { Eye, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { RecruiterScanItem } from '../../types/ats';
import { Badge } from '../ui/Badge';

interface RecruiterScanWidgetProps {
  items: RecruiterScanItem[];
}

export const RecruiterScanWidget: React.FC<RecruiterScanWidgetProps> = ({ items }) => {
  const passedCount = items.filter(i => i.passed).length;

  return (
    <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">6-Second Recruiter Scan Simulation</h4>
            <p className="text-xs text-slate-400">Simulates human recruiter visual hierarchy and attention anchors</p>
          </div>
        </div>

        <Badge variant={passedCount >= 5 ? 'success' : 'warning'} size="sm">
          {passedCount} / {items.length} Anchors Passed
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border transition ${
              item.passed
                ? 'bg-slate-900/60 border-slate-800'
                : 'bg-rose-500/5 border-rose-500/20'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-300">{item.section}</span>
              {item.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
            </div>
            
            <div className="text-xs font-mono font-bold text-white truncate mb-1">
              {item.statusText}
            </div>

            <p className="text-[11px] text-slate-400 leading-tight">{item.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
