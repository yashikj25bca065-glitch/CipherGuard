import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  ShieldCheck, 
  User, 
  LogOut, 
  AlertTriangle, 
  Info, 
  Clock, 
  Database,
  ExternalLink,
  X
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { Role } from '../types';

export const Header: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    currentUser, 
    setCurrentRole, 
    unreadAlertCount, 
    alerts, 
    setActiveTab,
    settings,
    updateAlertStatus
  } = useSecurity();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles: Role[] = ['Administrator', 'Security Analyst', 'Viewer'];

  return (
    <header className="h-20 px-8 flex items-center justify-between border-b border-[#1a2b4c]/40 bg-[#070b14]/70 backdrop-blur-md sticky top-0 z-30">
      {/* Global Search Bar matching screenshot */}
      <div className="relative w-96 max-w-lg">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search threats, IPs, or assets..."
            className="w-full bg-[#0c1527]/80 hover:bg-[#0f1b33] focus:bg-[#0f1b33] text-sm text-slate-200 placeholder-slate-400 pl-11 pr-9 py-2.5 rounded-full border border-slate-700/50 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 shadow-inner"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Actions: Simulated Data Banner (FR-046), Bell, Yashik J. Profile */}
      <div className="flex items-center gap-4">
        {/* FR-046 Persistent SIMULATED DATA indicator */}
        {settings.dataMode === 'Simulation' && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium shadow-[0_0_12px_rgba(0,240,255,0.15)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>SIMULATED DATA (FR-046)</span>
          </div>
        )}

        {/* Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/40 text-slate-300 hover:text-white transition-colors"
            title="Active Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse">
                {unreadAlertCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-3 w-84 sm:w-96 rounded-2xl bg-[#0b1426] border border-cyan-500/30 shadow-2xl p-4 backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-semibold text-white">Active Real-Time Alerts</span>
                </div>
                <button
                  onClick={() => {
                    setIsNotificationsOpen(false);
                    setActiveTab('alerts');
                  }}
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                >
                  View All <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {alerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 transition-colors cursor-pointer group"
                    onClick={() => {
                      setIsNotificationsOpen(false);
                      setActiveTab('alerts');
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          alert.severity === 'Critical' ? 'bg-red-400' :
                          alert.severity === 'High' ? 'bg-orange-400' :
                          alert.severity === 'Medium' ? 'bg-cyan-400' : 'bg-blue-400'
                        }`} />
                        <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                          {alert.ruleName}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">{alert.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{alert.evidence}</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Target: {alert.targetAsset}</span>
                      <span className="font-mono text-cyan-400">{alert.sourceIp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & RBAC Switcher matching screenshot ("Yashik J.") */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-slate-800/50 border border-transparent hover:border-slate-700/60 transition-all duration-200"
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.3)]"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#070b14]" />
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-sm font-semibold text-slate-200 hover:text-white flex items-center gap-1.5">
                {currentUser.name}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </span>
            </div>
          </button>

          {/* Profile Dropdown & RBAC Matrix selector */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-[#0b1426] border border-cyan-500/30 shadow-2xl p-4 backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-cyan-500/50"
                />
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                  <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {currentUser.role}
                  </span>
                </div>
              </div>

              {/* RBAC Role Selector (SRS Table 3-1) */}
              <div className="mt-3">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Switch Active Role (RBAC)
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setCurrentRole(r);
                        setIsProfileOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        currentUser.role === r
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                      }`}
                    >
                      <span>{r}</span>
                      {currentUser.role === r && <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Session Timeout: 30m</span>
                <span className="text-emerald-400">Active</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
