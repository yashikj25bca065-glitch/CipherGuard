import React, { useState } from 'react';
import { PieChart, ArrowRight } from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';

export const TopThreatTypes: React.FC = () => {
  const { threatTypesDistribution, setActiveTab } = useSecurity();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Donut chart geometry (r = 46, inner hole r = 30)
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  // Calculate cumulative offsets
  let cumulativePercentage = 0;
  const segments = threatTypesDistribution.map((item, index) => {
    const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((cumulativePercentage / 100) * circumference);
    cumulativePercentage += item.percentage;
    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
      index,
    };
  });

  return (
    <div className="p-5 rounded-2xl bg-[#0b1426]/75 backdrop-blur-xl border border-blue-500/20 shadow-[0_0_30px_rgba(0,112,243,0.1)] flex flex-col justify-between">
      {/* Header Row matching screenshot */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-semibold text-white tracking-wide">
            Top Threat Types
          </h2>
        </div>
        <button
          onClick={() => setActiveTab('threat-intel')}
          className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors group"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Donut Chart & Legend Row */}
      <div className="flex items-center justify-between gap-4 my-auto py-2">
        {/* Glowing Donut SVG matching screenshot */}
        <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
            <defs>
              <filter id="donutGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Track */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="#0e1b34"
              strokeWidth="14"
            />

            {/* Segments */}
            {segments.map((seg) => {
              const isHovered = hoveredIndex === seg.index;
              return (
                <circle
                  key={seg.name}
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={isHovered ? 18 : 14}
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  filter="url(#donutGlow)"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(seg.index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
          </svg>

          {/* Center Hole Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[11px] text-slate-400 font-mono">Total</span>
            <span className="text-sm font-bold text-white font-mono">100%</span>
          </div>
        </div>

        {/* Legend matching screenshot on the right */}
        <div className="flex-1 space-y-2.5 pl-2">
          {threatTypesDistribution.map((item, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <div
                key={item.name}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`flex items-center justify-between text-xs transition-transform cursor-pointer ${
                  isHovered ? 'scale-105 font-bold text-white' : 'text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_8px_currentColor]"
                    style={{ backgroundColor: item.color, color: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
                <span className="font-mono font-semibold text-slate-200">
                  {item.percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/40 text-[11px] text-slate-500 flex justify-between items-center">
        <span>MITRE ATT&CK Classification</span>
        <span className="text-cyan-400 font-mono">Active</span>
      </div>
    </div>
  );
};
