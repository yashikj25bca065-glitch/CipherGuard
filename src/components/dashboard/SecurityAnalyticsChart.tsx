import React, { useState } from 'react';
import { BarChart2, TrendingUp } from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';

export const SecurityAnalyticsChart: React.FC = () => {
  const { analyticsRange, setAnalyticsRange } = useSecurity();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Time-series data points based on selected range
  const dataMap = {
    '1D': [
      { time: '12AM', blocked: 32, detected: 21 },
      { time: '6AM', blocked: 58, detected: 38 },
      { time: '12PM', blocked: 45, detected: 28 },
      { time: '6PM', blocked: 68, detected: 44 },
      { time: '12AM', blocked: 42, detected: 26 },
    ],
    '1W': [
      { time: 'Mon', blocked: 42, detected: 25 },
      { time: 'Tue', blocked: 65, detected: 40 },
      { time: 'Wed', blocked: 52, detected: 34 },
      { time: 'Thu', blocked: 72, detected: 46 },
      { time: 'Fri', blocked: 48, detected: 29 },
    ],
    '1M': [
      { time: 'W1', blocked: 38, detected: 24 },
      { time: 'W2', blocked: 60, detected: 39 },
      { time: 'W3', blocked: 70, detected: 45 },
      { time: 'W4', blocked: 54, detected: 32 },
      { time: 'W5', blocked: 46, detected: 28 },
    ],
    '3M': [
      { time: 'Sep', blocked: 40, detected: 26 },
      { time: 'Oct', blocked: 62, detected: 41 },
      { time: 'Nov', blocked: 50, detected: 30 },
      { time: 'Dec', blocked: 74, detected: 48 },
      { time: 'Jan', blocked: 45, detected: 27 },
    ],
  };

  const points = dataMap[analyticsRange];

  // SVG coordinate calculations for smooth bezier curves
  // Width: 500, Height: 180, Y scale: 0 to 80 (where 0 is y=160, 80 is y=20)
  const getY = (val: number) => 160 - (val / 80) * 140;
  const getX = (idx: number) => 50 + idx * 100;

  // Generate smooth SVG path
  const createSmoothPath = (pts: number[]) => {
    return pts.reduce((acc, curr, i, arr) => {
      const x = getX(i);
      const y = getY(curr);
      if (i === 0) return `M ${x} ${y}`;
      const prevX = getX(i - 1);
      const prevY = getY(arr[i - 1]);
      const cp1X = prevX + 45;
      const cp1Y = prevY;
      const cp2X = x - 45;
      const cp2Y = y;
      return `${acc} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${x} ${y}`;
    }, '');
  };

  const blockedValues = points.map(p => p.blocked);
  const detectedValues = points.map(p => p.detected);

  const blockedPath = createSmoothPath(blockedValues);
  const detectedPath = createSmoothPath(detectedValues);

  const blockedArea = `${blockedPath} L ${getX(points.length - 1)} 160 L ${getX(0)} 160 Z`;
  const detectedArea = `${detectedPath} L ${getX(points.length - 1)} 160 L ${getX(0)} 160 Z`;

  return (
    <div className="p-5 rounded-2xl bg-[#0b1426]/75 backdrop-blur-xl border border-blue-500/20 shadow-[0_0_30px_rgba(0,112,243,0.1)] flex flex-col justify-between">
      {/* Header and Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <BarChart2 className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-semibold text-white tracking-wide">
            Security Analytics
          </h2>
        </div>

        {/* Range Selector matching screenshot [1D, 1W, 1M, 3M] */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/80 border border-slate-700/50">
          {(['1D', '1W', '1M', '3M'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setAnalyticsRange(range)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                analyticsRange === range
                  ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.6)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Legend Row matching screenshot */}
      <div className="flex items-center gap-6 my-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
          <span className="text-slate-300 font-medium">Blocked Threats</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
          <span className="text-slate-300 font-medium">Detected Threats</span>
        </div>
      </div>

      {/* SVG Dual Wave Graph */}
      <div className="relative w-full h-[180px] mt-1 select-none">
        <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="cyanArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="purpleArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </linearGradient>

            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines and Y labels (75k, 50k, 25k, 0) */}
          {[
            { label: '75k', y: getY(75) },
            { label: '50k', y: getY(50) },
            { label: '25k', y: getY(25) },
            { label: '0', y: getY(0) },
          ].map((grid, idx) => (
            <g key={idx}>
              <text x="32" y={grid.y + 4} textAnchor="end" className="text-[10px] fill-slate-500 font-mono">
                {grid.label}
              </text>
              <line
                x1="45"
                y1={grid.y}
                x2="480"
                y2={grid.y}
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray={idx === 3 ? 'none' : '3 3'}
              />
            </g>
          ))}

          {/* X labels (12AM, 6AM, 12PM, 6PM, 12AM) */}
          {points.map((pt, idx) => (
            <text
              key={idx}
              x={getX(idx)}
              y="178"
              textAnchor="middle"
              className="text-[10px] fill-slate-400 font-mono"
            >
              {pt.time}
            </text>
          ))}

          {/* Detected Threats (Purple) Area & Stroke */}
          <path d={detectedArea} fill="url(#purpleArea)" />
          <path
            d={detectedPath}
            fill="none"
            stroke="#a855f7"
            strokeWidth="3"
            filter="url(#purpleGlow)"
          />

          {/* Blocked Threats (Cyan) Area & Stroke */}
          <path d={blockedArea} fill="url(#cyanArea)" />
          <path
            d={blockedPath}
            fill="none"
            stroke="#00f0ff"
            strokeWidth="3"
            filter="url(#cyanGlow)"
          />

          {/* Interactive hover node points */}
          {points.map((pt, idx) => {
            const bx = getX(idx);
            const by = getY(pt.blocked);
            const dy = getY(pt.detected);
            const isHovered = hoverIndex === idx;

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoverIndex(idx)}
                onMouseLeave={() => setHoverIndex(null)}
                className="cursor-pointer"
              >
                {/* Blocked dot */}
                <circle
                  cx={bx}
                  cy={by}
                  r={isHovered ? 6 : 4}
                  fill="#00f0ff"
                  stroke="#070b14"
                  strokeWidth="2"
                  className="transition-all duration-150 shadow-[0_0_10px_#00f0ff]"
                />
                {/* Detected dot */}
                <circle
                  cx={bx}
                  cy={dy}
                  r={isHovered ? 6 : 4}
                  fill="#a855f7"
                  stroke="#070b14"
                  strokeWidth="2"
                  className="transition-all duration-150 shadow-[0_0_10px_#a855f7]"
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoverIndex !== null && (
          <div
            className="absolute top-2 px-3 py-1.5 rounded-lg bg-[#0b1426] border border-cyan-500/40 shadow-xl pointer-events-none text-xs font-mono z-20"
            style={{ left: `${(hoverIndex / 4) * 80 + 10}%` }}
          >
            <div className="text-slate-400 font-bold mb-1">{points[hoverIndex].time}</div>
            <div className="text-cyan-400">Blocked: {points[hoverIndex].blocked}k</div>
            <div className="text-purple-400">Detected: {points[hoverIndex].detected}k</div>
          </div>
        )}
      </div>
    </div>
  );
};
