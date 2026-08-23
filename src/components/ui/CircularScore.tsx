import React from 'react';

interface CircularScoreProps {
  score: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  animate?: boolean;
}

export const CircularScore: React.FC<CircularScoreProps> = ({
  score,
  size = 140,
  strokeWidth = 10,
  label = 'ATS Score',
  sublabel
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  let strokeColor = '#22c55e'; // green
  if (score < 60) strokeColor = '#f43f5e'; // red
  else if (score < 75) strokeColor = '#f59e0b'; // amber
  else if (score < 85) strokeColor = '#3b82f6'; // blue

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-white tracking-tight">
            {score}
            <span className="text-sm font-normal text-slate-400">/100</span>
          </span>
          {label && (
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">
              {label}
            </span>
          )}
        </div>
      </div>
      {sublabel && (
        <span className="text-xs font-medium text-slate-300 mt-2">
          {sublabel}
        </span>
      )}
    </div>
  );
};
