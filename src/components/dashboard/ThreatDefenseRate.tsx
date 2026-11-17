import React from 'react';
import { ShieldCheck, Shield } from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';

export const ThreatDefenseRate: React.FC = () => {
  const { kpis } = useSecurity();

  // Percentage value (99.8%)
  const percentage = kpis.defenseRate;
  
  // Circumference for r=58
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  // Offset for 99.8%
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <div className="p-5 rounded-2xl bg-[#0b1426]/75 backdrop-blur-xl border border-blue-500/20 shadow-[0_0_30px_rgba(0,112,243,0.1)] flex flex-col items-center justify-between relative overflow-hidden group">
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-emerald-500/5 pointer-events-none" />

      {/* Futuristic Concentric Circular HUD Gauge matching screenshot */}
      <div className="relative w-36 h-36 flex items-center justify-center my-auto">
        <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="100%" stopColor="#00ff88" />
            </linearGradient>
            <filter id="gaugeGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer dashed radar tracker ring */}
          <circle
            cx="80"
            cy="80"
            r="72"
            fill="none"
            stroke="#1e3a6e"
            strokeWidth="1"
            strokeDasharray="4 6"
            className="opacity-40 animate-[spin_25s_linear_infinite]"
          />

          {/* Middle track background */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#0f2244"
            strokeWidth="8"
          />

          {/* Active glowing progress arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter="url(#gaugeGlow)"
            className="transition-all duration-1000 ease-out"
          />

          {/* Inner fine reticle ring */}
          <circle
            cx="80"
            cy="80"
            r="44"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="1"
            strokeDasharray="2 4"
            className="opacity-30"
          />
        </svg>

        {/* Center Glowing Shield Icon matching screenshot */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-cyan-950/40 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.25)]">
            <Shield className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </div>
        </div>
      </div>

      {/* Title & Large Value matching screenshot */}
      <div className="text-center mt-2 z-10">
        <p className="text-xs font-medium text-slate-400 tracking-wide">
          Threat Defense Rate
        </p>
        <p className="text-2xl font-bold text-emerald-400 drop-shadow-[0_0_12px_rgba(0,255,136,0.6)] font-sans mt-0.5">
          {percentage}%
        </p>
      </div>
    </div>
  );
};
