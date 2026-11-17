import React, { useState } from 'react';
import { Globe, Play, Pause, Filter, ShieldAlert, X, ExternalLink, Info } from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';
import { ThreatSeverity, ThreatMapArc } from '../../types';

export const GlobalThreatMap: React.FC = () => {
  const { 
    threatArcs, 
    isMapStreaming, 
    setIsMapStreaming, 
    selectedMapEvent, 
    setSelectedMapEvent,
    setActiveTab
  } = useSecurity();

  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);

  const filteredArcs = threatArcs.filter((arc) => {
    if (severityFilter === 'All') return true;
    return arc.severity === severityFilter;
  });

  // Severity color helper
  const getSeverityColor = (sev: ThreatSeverity) => {
    switch (sev) {
      case 'Critical': return '#ff2a5f'; // vibrant red
      case 'High': return '#ff8c00';     // orange
      case 'Medium': return '#0070f3';   // blue
      case 'Low': return '#00ff88';      // green
    }
  };

  // Fixed hotspot locations on world map (percentage coordinates: x, y)
  const hotspots: Array<{ id: string; name: string; x: number; y: number; sev: ThreatSeverity; count: number }> = [
    { id: 'na-east', name: 'US East (Ashburn DC)', x: 28, y: 36, sev: 'Critical', count: 142 },
    { id: 'na-west', name: 'Silicon Valley Gateway', x: 18, y: 38, sev: 'High', count: 86 },
    { id: 'eu-west', name: 'Frankfurt Core DC', x: 50, y: 34, sev: 'Critical', count: 215 },
    { id: 'eu-east', name: 'Moscow / St. Petersburg', x: 62, y: 28, sev: 'Critical', count: 310 },
    { id: 'asia-east', name: 'Shenzhen Tech Hub', x: 78, y: 48, sev: 'High', count: 189 },
    { id: 'asia-japan', name: 'Tokyo Primary Hub', x: 84, y: 38, sev: 'Medium', count: 64 },
    { id: 'sa-brazil', name: 'São Paulo Exchange', x: 34, y: 72, sev: 'Medium', count: 48 },
    { id: 'oc-aus', name: 'Sydney Regional Hub', x: 86, y: 76, sev: 'Low', count: 22 },
  ];

  return (
    <div className="relative p-5 rounded-2xl bg-[#0b1426]/75 backdrop-blur-xl border border-blue-500/20 shadow-[0_0_30px_rgba(0,112,243,0.1)] flex flex-col justify-between overflow-hidden">
      {/* Header Row matching screenshot */}
      <div className="flex items-center justify-between z-10 mb-2">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-semibold text-white tracking-wide">
            Global Threat Map
          </h2>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400">Live</span>
          </div>
        </div>

        {/* Map Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMapStreaming(!isMapStreaming)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-700/50 transition-colors"
            title={isMapStreaming ? 'Pause live stream' : 'Resume live stream'}
          >
            {isMapStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Resume</span>
              </>
            )}
          </button>

          {/* Severity Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-700/50 transition-colors"
            >
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <span>{severityFilter}</span>
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-32 rounded-xl bg-[#0b1426] border border-cyan-500/30 p-1 shadow-2xl z-30">
                {['All', 'Critical', 'High', 'Medium', 'Low'].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => {
                      setSeverityFilter(sev);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      severityFilter === sev ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Cyber World Map Container */}
      <div className="relative w-full h-[320px] sm:h-[360px] md:h-[400px] flex items-center justify-center overflow-hidden rounded-xl bg-[#060a14]/90 border border-blue-900/30">
        {/* Subtle Cyber Grid Background */}
        <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

        {/* Global World Map SVG Canvas */}
        <svg viewBox="0 0 1000 500" className="w-full h-full select-none">
          <defs>
            {/* SVG Filters for Neon Glow */}
            <filter id="mapGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <radialGradient id="landGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0d2149" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#08142c" stopOpacity="0.4" />
            </radialGradient>
          </defs>

          {/* World Continents Outlines & Polygons (Precise simplified cyber geo paths) */}
          <g className="world-continents fill-[#0b1933] stroke-[#1b3a6e] stroke-[0.8] opacity-80">
            {/* North America */}
            <path d="M 120 80 Q 200 60 260 90 T 290 140 T 250 180 T 280 230 T 200 240 T 170 200 T 130 180 T 90 140 Z" />
            {/* Central America */}
            <path d="M 200 240 Q 230 260 250 290 T 270 300 T 250 320 T 220 280 Z" />
            {/* South America */}
            <path d="M 270 310 Q 350 310 380 370 T 350 440 T 310 470 T 280 430 T 270 360 Z" />
            {/* Greenland */}
            <path d="M 330 40 Q 380 30 410 60 T 370 100 T 320 70 Z" />
            {/* Europe */}
            <path d="M 450 110 Q 520 90 560 120 T 540 180 T 480 190 T 450 150 Z" />
            {/* Africa */}
            <path d="M 460 200 Q 550 200 570 270 T 540 370 T 500 420 T 460 350 T 440 260 Z" />
            {/* Asia & Russia */}
            <path d="M 560 80 Q 750 60 860 100 T 910 160 T 840 230 T 730 240 T 630 210 T 570 150 Z" />
            {/* India & Southeast Asia */}
            <path d="M 660 230 Q 720 230 740 300 T 700 350 T 660 290 Z" />
            <path d="M 740 280 Q 820 290 840 340 T 790 380 T 740 330 Z" />
            {/* Australia */}
            <path d="M 800 370 Q 890 360 910 410 T 880 470 T 810 450 T 790 400 Z" />
          </g>

          {/* City Constellation Dots (Cyber night lights) */}
          <g className="city-lights fill-cyan-400/40">
            {/* North America Lights */}
            <circle cx="180" cy="160" r="1.5" />
            <circle cx="210" cy="150" r="1.5" />
            <circle cx="240" cy="165" r="2" />
            <circle cx="260" cy="170" r="2.5" className="fill-cyan-300" />
            <circle cx="270" cy="180" r="2" />
            <circle cx="220" cy="200" r="1.5" />
            {/* Europe Lights */}
            <circle cx="480" cy="140" r="2.5" className="fill-cyan-300" />
            <circle cx="500" cy="150" r="3" className="fill-cyan-200" />
            <circle cx="530" cy="145" r="2" />
            <circle cx="550" cy="160" r="2" />
            {/* East Asia Lights */}
            <circle cx="750" cy="190" r="2.5" />
            <circle cx="780" cy="210" r="3" className="fill-cyan-200" />
            <circle cx="830" cy="180" r="2.5" />
            <circle cx="840" cy="190" r="2" />
            {/* Brazil Lights */}
            <circle cx="340" cy="360" r="2" />
            {/* Australia Lights */}
            <circle cx="870" cy="430" r="2" />
          </g>

          {/* Animated Attack Arcs matching screenshot */}
          {filteredArcs.map((arc) => {
            const startX = (arc.fromCoords[0] / 100) * 1000;
            const startY = (arc.fromCoords[1] / 100) * 500;
            const endX = (arc.toCoords[0] / 100) * 1000;
            const endY = (arc.toCoords[1] / 100) * 500;
            const midX = (startX + endX) / 2;
            const midY = Math.min(startY, endY) - 65; // curve arc upwards

            const strokeColor = getSeverityColor(arc.severity);

            return (
              <g key={arc.id} className="cursor-pointer group" onClick={() => setSelectedMapEvent(arc)}>
                {/* Background Shadow Arc */}
                <path
                  d={`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="4"
                  strokeOpacity="0.25"
                  filter="url(#mapGlow)"
                />
                {/* Foreground Dashed Animated Arc */}
                <path
                  d={`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="2"
                  strokeDasharray="6 8"
                  className="animate-attack-arc transition-all group-hover:stroke-white group-hover:stroke-[3]"
                />
              </g>
            );
          })}

          {/* Glowing Attack Origin & Target Hotspot Pulsars */}
          {hotspots.map((spot) => {
            const x = (spot.x / 100) * 1000;
            const y = (spot.y / 100) * 500;
            const col = getSeverityColor(spot.sev);

            return (
              <g key={spot.id} className="cursor-pointer group" onClick={() => {
                const sampleArc = threatArcs.find(a => a.fromName.includes(spot.name.split(' ')[0])) || threatArcs[0];
                setSelectedMapEvent(sampleArc);
              }}>
                {/* Outer pulsing ring */}
                <circle
                  cx={x}
                  cy={y}
                  r="16"
                  fill="none"
                  stroke={col}
                  strokeWidth="1.5"
                  opacity="0.6"
                  className="pulsar"
                />
                {/* Inner glowing core */}
                <circle
                  cx={x}
                  cy={y}
                  r="7"
                  fill={col}
                  opacity="0.8"
                  filter="url(#mapGlow)"
                  className="transition-transform duration-200 group-hover:scale-150"
                />
                {/* Center bright dot */}
                <circle cx={x} cy={y} r="3" fill="#ffffff" />
              </g>
            );
          })}
        </svg>

        {/* Legend matching exact screenshot in bottom right */}
        <div className="absolute bottom-4 right-5 p-2.5 rounded-xl bg-[#091122]/90 backdrop-blur-md border border-slate-700/40 shadow-xl flex flex-col gap-1.5 z-20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff2a5f] shadow-[0_0_8px_rgba(255,42,95,0.8)]" />
            <span className="text-[11px] font-medium text-slate-300">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff8c00] shadow-[0_0_8px_rgba(255,140,0,0.8)]" />
            <span className="text-[11px] font-medium text-slate-300">High</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0070f3] shadow-[0_0_8px_rgba(0,112,243,0.8)]" />
            <span className="text-[11px] font-medium text-slate-300">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.8)]" />
            <span className="text-[11px] font-medium text-slate-300">Low</span>
          </div>
        </div>

        {/* Selected Map Event Modal / Overlay (FR-016) */}
        {selectedMapEvent && (
          <div className="absolute top-4 left-4 max-w-sm p-4 rounded-2xl bg-[#0b1426]/95 border border-cyan-500/40 shadow-2xl backdrop-blur-xl z-30 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  selectedMapEvent.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  selectedMapEvent.severity === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                  selectedMapEvent.severity === 'Medium' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {selectedMapEvent.severity}
                </span>
                <span className="text-xs font-semibold text-white">Event Telemetry</span>
              </div>
              <button
                onClick={() => setSelectedMapEvent(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs font-medium text-slate-200 mt-2 font-mono">
              {selectedMapEvent.type}
            </p>

            <div className="mt-3 space-y-1.5 text-[11px] text-slate-400">
              <div className="flex justify-between">
                <span>Origin:</span>
                <span className="text-white font-medium">{selectedMapEvent.fromName}</span>
              </div>
              <div className="flex justify-between">
                <span>Target:</span>
                <span className="text-white font-medium">{selectedMapEvent.toName}</span>
              </div>
              <div className="flex justify-between">
                <span>Source IP:</span>
                <span className="text-cyan-400 font-mono">{selectedMapEvent.ip}</span>
              </div>
              {selectedMapEvent.asn && (
                <div className="flex justify-between">
                  <span>ASN:</span>
                  <span className="text-slate-300 truncate max-w-[180px]">{selectedMapEvent.asn}</span>
                </div>
              )}
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800 flex justify-between items-center">
              <span className="text-[10px] text-slate-500">{selectedMapEvent.timestamp}</span>
              <button
                onClick={() => {
                  setSelectedMapEvent(null);
                  setActiveTab('threat-intel');
                }}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
              >
                Inspect IOC <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
