import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  delta: string;
  icon: LucideIcon;
  variant: 'green' | 'red' | 'blue' | 'purple';
  wavePath: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  delta,
  icon: Icon,
  variant,
  wavePath,
}) => {
  const getTheme = () => {
    switch (variant) {
      case 'green':
        return {
          glow: 'shadow-[0_0_25px_rgba(0,255,136,0.12)] border-emerald-500/20 hover:border-emerald-500/40',
          iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.3)]',
          deltaBg: 'text-emerald-400',
          strokeColor: '#00ff88',
          gradientId: 'greenWaveGrad',
          stopColor: '#00ff88',
        };
      case 'red':
        return {
          glow: 'shadow-[0_0_25px_rgba(255,42,95,0.12)] border-red-500/20 hover:border-red-500/40',
          iconBg: 'bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_12px_rgba(239,68,68,0.3)]',
          deltaBg: 'text-red-400',
          strokeColor: '#ff2a5f',
          gradientId: 'redWaveGrad',
          stopColor: '#ff2a5f',
        };
      case 'blue':
        return {
          glow: 'shadow-[0_0_25px_rgba(0,112,243,0.12)] border-blue-500/20 hover:border-blue-500/40',
          iconBg: 'bg-blue-500/10 text-cyan-400 border border-blue-500/30 shadow-[0_0_12px_rgba(0,112,243,0.3)]',
          deltaBg: 'text-cyan-400',
          strokeColor: '#0070f3',
          gradientId: 'blueWaveGrad',
          stopColor: '#00f0ff',
        };
      case 'purple':
        return {
          glow: 'shadow-[0_0_25px_rgba(138,43,226,0.12)] border-purple-500/20 hover:border-purple-500/40',
          iconBg: 'bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-[0_0_12px_rgba(138,43,226,0.3)]',
          deltaBg: 'text-purple-400',
          strokeColor: '#8a2be2',
          gradientId: 'purpleWaveGrad',
          stopColor: '#c084fc',
        };
    }
  };

  const theme = getTheme();

  return (
    <div className={`relative p-5 rounded-2xl bg-[#0b1426]/75 backdrop-blur-xl border transition-all duration-300 overflow-hidden flex flex-col justify-between group ${theme.glow}`}>
      {/* Top Header Row with Icon, Value and Delta */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3.5">
          {/* Circular Glowing Icon matching screenshot */}
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 duration-200 ${theme.iconBg}`}>
            <Icon className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-white font-sans">
                {value}
              </span>
            </div>
            <p className="text-xs font-medium text-slate-400 mt-0.5 tracking-wide">
              {title}
            </p>
          </div>
        </div>

        {/* Delta Percentage */}
        <div className={`text-xs font-semibold flex items-center gap-0.5 ${theme.deltaBg}`}>
          <span>{delta}</span>
        </div>
      </div>

      {/* Glowing Neon Sine Wave at bottom matching screenshot */}
      <div className="w-full h-8 mt-4 overflow-hidden -mx-5 -mb-5 px-5">
        <svg viewBox="0 0 240 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id={theme.gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={theme.stopColor} stopOpacity="0.2" />
              <stop offset="50%" stopColor={theme.stopColor} stopOpacity="1" />
              <stop offset="100%" stopColor={theme.stopColor} stopOpacity="0.3" />
            </linearGradient>
            <filter id={`glow-${variant}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d={wavePath}
            fill="none"
            stroke={`url(#${theme.gradientId})`}
            strokeWidth="2.5"
            strokeLinecap="round"
            filter={`url(#glow-${variant})`}
          />
        </svg>
      </div>
    </div>
  );
};
