import React from 'react';
import { 
  Activity, 
  ArrowRight, 
  ShieldAlert, 
  UserX, 
  MailWarning, 
  CheckCircle2, 
  AlertTriangle,
  Zap
} from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';
import { ThreatActivityItem } from '../../types';

export const ThreatActivity: React.FC = () => {
  const { activityFeed, setActiveTab } = useSecurity();

  // Helper to render the circular badge icon matching screenshot
  const renderIcon = (item: ThreatActivityItem) => {
    switch (item.iconType) {
      case 'blocked':
        return (
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500/10 border border-red-500/40 text-red-500 shadow-[0_0_12px_rgba(239,68,68,0.3)] shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
        );
      case 'login':
        return (
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500/10 border border-blue-500/40 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.3)] shrink-0">
            <UserX className="w-5 h-5" />
          </div>
        );
      case 'phishing':
        return (
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-500/10 border border-amber-500/40 text-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.3)] shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        );
      case 'quarantine':
      default:
        return (
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)] shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-[#0b1426]/75 backdrop-blur-xl border border-blue-500/20 shadow-[0_0_30px_rgba(0,112,243,0.1)] flex flex-col justify-between">
      {/* Header Row matching screenshot */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-semibold text-white tracking-wide">
            Threat Activity
          </h2>
        </div>
        <button
          onClick={() => setActiveTab('alerts')}
          className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors group"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Activity List matching screenshot */}
      <div className="space-y-4 my-auto py-2">
        {activityFeed.slice(0, 4).map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveTab('alerts')}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/40 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              {renderIcon(item)}
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-white tracking-tight group-hover:text-cyan-300 transition-colors truncate">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">
                  {item.subtitle}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0 pl-2">
              <span className="text-xs text-slate-400 font-medium">
                {item.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Subtle Bottom Note */}
      <div className="pt-2 border-t border-slate-800/40 text-[11px] text-slate-500 flex justify-between items-center">
        <span>Engine: Rule-Based Scoring (v1.0)</span>
        <span className="text-cyan-400/80 font-mono">Stream Active</span>
      </div>
    </div>
  );
};
