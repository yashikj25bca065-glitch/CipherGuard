import React, { useState } from 'react';
import { 
  Settings, 
  Cpu, 
  ShieldCheck, 
  Sliders, 
  Save, 
  BellRing, 
  Key, 
  Lock, 
  Eye, 
  EyeOff, 
  Database,
  Radio,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, canPerform } = useSecurity();

  // Local form state
  const [dataMode, setDataMode] = useState<'Simulation' | 'Live'>(settings.dataMode);
  const [simulationRate, setSimulationRate] = useState<number>(settings.simulationRate);
  const [scenarioType, setScenarioType] = useState(settings.scenarioType);
  const [randomSeed, setRandomSeed] = useState(settings.randomSeed);

  const [timeZone, setTimeZone] = useState(settings.timeZone);
  const [defaultTimeRange, setDefaultTimeRange] = useState(settings.defaultTimeRange);
  const [visualIntensity, setVisualIntensity] = useState(settings.visualEffectIntensity);
  const [reducedMotion, setReducedMotion] = useState(settings.reducedMotion);

  const [emailNotifications, setEmailNotifications] = useState(settings.emailNotifications);
  const [minSeverityAlert, setMinSeverityAlert] = useState(settings.minSeverityAlert);
  const [quietHours, setQuietHours] = useState(settings.quietHours);

  const [sessionTimeout, setSessionTimeout] = useState(settings.sessionTimeoutMinutes);
  const [lockoutAttempts, setLockoutAttempts] = useState(settings.lockoutAttempts);
  const [apiKeyAbuse, setApiKeyAbuse] = useState(settings.apiKeyAbuseIPDB);
  const [apiKeyVT, setApiKeyVT] = useState(settings.apiKeyVirusTotal);
  const [showKeys, setShowKeys] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      dataMode,
      simulationRate,
      scenarioType: scenarioType as any,
      randomSeed,
      timeZone,
      defaultTimeRange,
      visualEffectIntensity: visualIntensity,
      reducedMotion,
      emailNotifications,
      minSeverityAlert,
      quietHours,
      sessionTimeoutMinutes: sessionTimeout,
      lockoutAttempts,
      apiKeyAbuseIPDB: apiKeyAbuse,
      apiKeyVirusTotal: apiKeyVT,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0b1426]/75 border border-cyan-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-wide">System Settings & Simulation Engine</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Data stream modes (FR-046), synthetic scenario generation (FR-047), and security policies (FR-043 — FR-045)
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Module 1: Simulation Engine & Data Mode (FR-046 & FR-047) */}
        <div className="p-6 rounded-2xl bg-[#0b1426]/75 border border-cyan-500/30 backdrop-blur-xl shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <div>
                <h2 className="text-sm font-bold text-white tracking-wide">
                  Simulation Engine & Data Mode (FR-046, FR-047)
                </h2>
                <p className="text-xs text-slate-400">Toggle between synthetic telemetry and live API connectors.</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
              dataMode === 'Simulation' 
                ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40' 
                : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
            }`}>
              Mode: {dataMode.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mode Selector */}
            <div className="p-4 rounded-xl bg-[#070b14] border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-white block">Operating Data Mode (FR-046)</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDataMode('Simulation')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    dataMode === 'Simulation'
                      ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)] text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">Simulation</span>
                    {dataMode === 'Simulation' && <Radio className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400">Built-in synthetic attack generator</p>
                </button>

                <button
                  type="button"
                  onClick={() => setDataMode('Live')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    dataMode === 'Live'
                      ? 'bg-emerald-500/10 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">Live Mode</span>
                    {dataMode === 'Live' && <Radio className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400">External API feeds & syslog</p>
                </button>
              </div>
            </div>

            {/* Scenario Type */}
            <div className="p-4 rounded-xl bg-[#070b14] border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-white block">Scenario Injector (FR-047)</label>
              <select
                value={scenarioType}
                onChange={(e) => setScenarioType(e.target.value as any)}
                className="w-full bg-[#0b1426] border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="Normal Activity">Normal Perimeter Activity (Standard Noise)</option>
                <option value="Brute Force Surge">Brute Force Surge (High Failed SSH / Kerberos)</option>
                <option value="APT Ransomware Campaign">APT Ransomware Campaign (LockBit Dropper Activity)</option>
                <option value="Global DDoS Flood">Global DDoS Flood (High Velocity Ingress Packets)</option>
              </select>
              <p className="text-[11px] text-slate-500">Injects correlated events into Threat Map and Alerts queue.</p>
            </div>

            {/* Event Rate Slider */}
            <div className="p-4 rounded-xl bg-[#070b14] border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">Event Simulation Rate (FR-047)</span>
                <span className="font-mono text-cyan-400 font-bold">{simulationRate} events / min</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={simulationRate}
                onChange={(e) => setSimulationRate(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 ev/min</span>
                <span>Max 20 ev/min</span>
              </div>
            </div>

            {/* Random Seed */}
            <div className="p-4 rounded-xl bg-[#070b14] border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-white block">Deterministic Random Seed</label>
              <input
                type="text"
                value={randomSeed}
                onChange={(e) => setRandomSeed(e.target.value)}
                className="w-full bg-[#0b1426] border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
              <p className="text-[11px] text-slate-500">Allows reproducible demo event streams for evaluation.</p>
            </div>
          </div>
        </div>

        {/* Module 2: Security & Authentication Settings (FR-045) */}
        <div className="p-6 rounded-2xl bg-[#0b1426]/75 border border-blue-500/20 backdrop-blur-xl shadow-xl space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Lock className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                Security & Authentication Policies (FR-045)
              </h2>
              <p className="text-xs text-slate-400">Password requirements, session timeouts, and encrypted credentials.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Session Inactivity Timeout (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(Number(e.target.value))}
                  className="w-full bg-[#070b14] border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Account Lockout Threshold (Consecutive Failures)</label>
                <input
                  type="number"
                  min="3"
                  max="10"
                  value={lockoutAttempts}
                  onChange={(e) => setLockoutAttempts(Number(e.target.value))}
                  className="w-full bg-[#070b14] border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-400 font-semibold">AbuseIPDB Integration API Key</label>
                  <button
                    type="button"
                    onClick={() => setShowKeys(!showKeys)}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    {showKeys ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showKeys ? 'Mask' : 'Reveal'}</span>
                  </button>
                </div>
                <input
                  type={showKeys ? 'text' : 'password'}
                  value={apiKeyAbuse}
                  onChange={(e) => setApiKeyAbuse(e.target.value)}
                  className="w-full bg-[#070b14] border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">VirusTotal v3 API Key</label>
                <input
                  type={showKeys ? 'text' : 'password'}
                  value={apiKeyVT}
                  onChange={(e) => setApiKeyVT(e.target.value)}
                  className="w-full bg-[#070b14] border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Module 3: Preferences & Accessibility (FR-043, FR-044) */}
        <div className="p-6 rounded-2xl bg-[#0b1426]/75 border border-blue-500/20 backdrop-blur-xl shadow-xl space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                User Preferences & Notifications (FR-043, FR-044)
              </h2>
              <p className="text-xs text-slate-400">Display density, reduced motion, and notification channels.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Dashboard Timezone</label>
              <select
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                className="w-full bg-[#070b14] border border-slate-700 rounded-lg p-2.5 text-white"
              >
                <option value="UTC+05:30 (IST)">UTC+05:30 (Indian Standard Time)</option>
                <option value="UTC+00:00 (UTC)">UTC+00:00 (Coordinated Universal Time)</option>
                <option value="UTC-05:00 (EST)">UTC-05:00 (Eastern Standard Time)</option>
                <option value="UTC-08:00 (PST)">UTC-08:00 (Pacific Standard Time)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Visual Effect Intensity</label>
              <select
                value={visualIntensity}
                onChange={(e) => setVisualIntensity(e.target.value as any)}
                className="w-full bg-[#070b14] border border-slate-700 rounded-lg p-2.5 text-white"
              >
                <option value="High">High (Full Neon Glow & Mesh Arcs)</option>
                <option value="Medium">Medium (Balanced GPU Load)</option>
                <option value="Low">Low (Minimalist Flat Mode)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Minimum Alert Email Severity</label>
              <select
                value={minSeverityAlert}
                onChange={(e) => setMinSeverityAlert(e.target.value as any)}
                className="w-full bg-[#070b14] border border-slate-700 rounded-lg p-2.5 text-white"
              >
                <option value="Critical">Critical Only</option>
                <option value="High">High and Critical</option>
                <option value="Medium">Medium, High and Critical</option>
                <option value="Low">All Alerts</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-2 border-t border-slate-800 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-cyan-400 focus:ring-0"
              />
              <span>Enable Reduced Motion (FR-043 Accessibility)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-cyan-400 focus:ring-0"
              />
              <span>Send In-App Email Notifications (FR-025)</span>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};
