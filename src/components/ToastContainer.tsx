import React from 'react';
import { useSecurity } from '../context/SecurityContext';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useSecurity();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.severity) {
            case 'Critical':
              return <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />;
            case 'High':
              return <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0" />;
            case 'Medium':
              return <Info className="w-5 h-5 text-cyan-400 shrink-0" />;
            case 'Low':
            default:
              return <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />;
          }
        };

        const getBorder = () => {
          switch (toast.severity) {
            case 'Critical': return 'border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.25)]';
            case 'High': return 'border-orange-500/40 shadow-[0_0_20px_rgba(249,115,22,0.25)]';
            case 'Medium': return 'border-cyan-500/40 shadow-[0_0_20px_rgba(0,240,255,0.25)]';
            case 'Low': return 'border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.25)]';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-2xl bg-[#0b1426]/95 backdrop-blur-xl border ${getBorder()} flex items-start gap-3 transition-all duration-300 animate-in slide-in-from-right-8`}
          >
            {getIcon()}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white leading-relaxed">{toast.message}</p>
              <span className="text-[10px] text-slate-400 mt-1 block">{toast.timestamp}</span>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
