import React from 'react';

interface ProgressBarProps {
  value: number; // 0 - 100
  max?: number;
  label?: string;
  subLabel?: string;
  colorClass?: string;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  subLabel,
  colorClass = 'bg-brand-500',
  size = 'md',
  showPercentage = true
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-baseline mb-1.5 text-xs">
          {label && <span className="font-semibold text-slate-200">{label}</span>}
          {showPercentage && (
            <span className="font-mono text-slate-400">
              {value}/{max} <span className="text-slate-500">({percentage}%)</span>
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-800 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {subLabel && <p className="text-xs text-slate-400 mt-1">{subLabel}</p>}
    </div>
  );
};
