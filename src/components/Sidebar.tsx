import React from 'react';
import { 
  Home, 
  Crosshair, 
  Bell, 
  FileText, 
  Layers, 
  Settings, 
  ShieldAlert, 
  CheckCircle2, 
  Activity
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, unreadAlertCount } = useSecurity();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'threat-intel', label: 'Threat Intelligence', icon: Crosshair },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: unreadAlertCount },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'assets', label: 'Assets', icon: Layers },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-[#070c17]/90 border-r border-[#1a2b4c]/40 flex flex-col justify-between p-4 relative z-20 backdrop-blur-xl">
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            <svg className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16h.01" />
              <circle cx="12" cy="12" r="3" strokeWidth="1" strokeDasharray="2 2" className="animate-spin text-cyan-200" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1 font-sans">
              CipherGuard
            </h1>
            <p className="text-[11px] font-medium tracking-wider text-slate-400 uppercase">
              Secure. Monitor. Defend.
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.45)] border border-blue-400/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-cyan-400 group-hover:scale-110'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isActive 
                      ? 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.7)]' 
                      : 'bg-red-500/90 text-white shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status Card matching screenshot */}
      <div className="relative mt-auto pt-4">
        {/* Subtle cyber grid backdrop */}
        <div className="relative p-4 rounded-2xl bg-[#0b1426]/80 border border-cyan-500/20 backdrop-blur-md overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          {/* Subtle background glow */}
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center gap-2 mb-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]"></span>
            </span>
            <span className="text-xs font-semibold text-slate-300">System Status</span>
          </div>

          <p className="text-sm font-semibold text-white tracking-wide">
            All Systems Operational
          </p>

          {/* Glowing Green Pulse Sine Wave SVG matching screenshot */}
          <div className="mt-3 w-full h-9 flex items-center overflow-hidden">
            <svg viewBox="0 0 200 40" className="w-full h-full text-emerald-400" preserveAspectRatio="none">
              <defs>
                <linearGradient id="sineGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#00ff88" stopOpacity="1" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
                </linearGradient>
                <filter id="waveBlur" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M 0,20 Q 25,20 35,20 T 50,20 T 65,10 T 75,32 T 85,6 T 95,30 T 105,20 T 130,20 T 150,15 T 160,26 T 170,20 L 200,20"
                fill="none"
                stroke="url(#sineGlow)"
                strokeWidth="2.5"
                filter="url(#waveBlur)"
                className="animate-pulse"
              />
            </svg>
          </div>
        </div>
      </div>
    </aside>
  );
};
