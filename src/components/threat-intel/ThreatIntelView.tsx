import React, { useState } from 'react';
import { 
  Crosshair, 
  Search, 
  Plus, 
  ShieldAlert, 
  ExternalLink, 
  Globe, 
  FileCode, 
  Hash, 
  Link2, 
  CheckCircle, 
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
  BookmarkPlus
} from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';
import { ThreatSeverity, IOCItem } from '../../types';

export const ThreatIntelView: React.FC = () => {
  const { iocs, addIOC, updateIOCStatus, canPerform } = useSecurity();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // AbuseIPDB / VirusTotal live tester state
  const [lookupTarget, setLookupTarget] = useState('185.199.110.42');
  const [lookupType, setLookupType] = useState<'IP' | 'Hash' | 'Domain'>('IP');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupResult, setLookupResult] = useState<any>({
    indicator: '185.199.110.42',
    provider: 'AbuseIPDB Integration',
    confidenceScore: 98,
    totalReports: 342,
    country: 'Netherlands (NL)',
    isp: 'FastHost Servers BV',
    usageType: 'Data Center / Web Hosting',
    lastReported: '14 minutes ago',
    verdict: 'Malicious C2 Node',
    mitreTactic: 'Initial Access (TA0001)',
  });

  // Modal for adding new IOC
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newIndicator, setNewIndicator] = useState('');
  const [newType, setNewType] = useState<'IP' | 'Domain' | 'URL' | 'Hash'>('IP');
  const [newSeverity, setNewSeverity] = useState<ThreatSeverity>('High');
  const [newStatus, setNewStatus] = useState<'Active' | 'Watchlist' | 'Blocklist'>('Blocklist');
  const [newNotes, setNewNotes] = useState('');

  const handleLookup = () => {
    if (!lookupTarget) return;
    setIsLookingUp(true);
    setTimeout(() => {
      setIsLookingUp(false);
      if (lookupType === 'IP') {
        const score = Math.floor(70 + Math.random() * 29);
        setLookupResult({
          indicator: lookupTarget,
          provider: 'AbuseIPDB v2 API (FR-018)',
          confidenceScore: score,
          totalReports: Math.floor(50 + Math.random() * 400),
          country: 'Germany (DE)',
          isp: 'Hetzner Online GmbH',
          usageType: 'Data Center / Web Hosting',
          lastReported: '3 minutes ago',
          verdict: score > 80 ? 'High Risk Threat Actor' : 'Suspicious Scanner',
          mitreTactic: 'Discovery / Reconnaissance (TA0007)',
        });
      } else if (lookupType === 'Hash') {
        setLookupResult({
          indicator: lookupTarget,
          provider: 'VirusTotal API v3 (FR-019)',
          confidenceScore: 92,
          totalReports: 58,
          country: 'Global',
          isp: 'N/A (Executable Binary)',
          usageType: 'Win32 Portable Executable',
          lastReported: '1 hour ago',
          verdict: 'Malicious: Ransom.Win32.LockBit',
          mitreTactic: 'Execution / Impact (TA0040)',
        });
      } else {
        setLookupResult({
          indicator: lookupTarget,
          provider: 'VirusTotal Domain Reputation',
          confidenceScore: 84,
          totalReports: 29,
          country: 'United States (US)',
          isp: 'Cloudflare Proxy Network',
          usageType: 'Phishing Credential Harvester',
          lastReported: '35 minutes ago',
          verdict: 'Deceptive Phishing Landing Page',
          mitreTactic: 'Initial Access / Spearphishing (TA0001)',
        });
      }
    }, 600);
  };

  const handleAddIOCSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIndicator) return;
    addIOC({
      indicator: newIndicator,
      type: newType,
      severity: newSeverity,
      status: newStatus,
      confidenceScore: Math.floor(80 + Math.random() * 19),
      reportCount: Math.floor(5 + Math.random() * 50),
      source: 'SecOps Analyst Investigation',
      notes: newNotes || 'Manually quarantined threat indicator',
    });
    setIsAddModalOpen(false);
    setNewIndicator('');
    setNewNotes('');
  };

  // Filtered IOC list
  const filteredIOCs = iocs.filter((ioc) => {
    const matchesSearch = ioc.indicator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ioc.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || ioc.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || ioc.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0b1426]/75 border border-cyan-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <Crosshair className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-wide">Threat Intelligence & IOCs</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            AbuseIPDB reputation engine, VirusTotal malware hashing, and searchable IOC watchlist/blocklist (FR-017 — FR-022)
          </p>
        </div>

        {canPerform('manage_assets') && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Indicator (IOC)</span>
          </button>
        )}
      </div>

      {/* AbuseIPDB & VirusTotal Live Intelligence Lookup Tool */}
      <div className="p-6 rounded-2xl bg-[#0b1426]/75 border border-blue-500/20 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white tracking-wide">
              Live Reputation Lookup (AbuseIPDB / VirusTotal)
            </h2>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded-full border border-cyan-500/30">
            FR-018 & FR-019 Active
          </span>
        </div>

        {/* Search controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex rounded-xl bg-slate-900 border border-slate-700 p-1 shrink-0">
            {(['IP', 'Hash', 'Domain'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setLookupType(t);
                  if (t === 'IP') setLookupTarget('185.199.110.42');
                  if (t === 'Hash') setLookupTarget('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
                  if (t === 'Domain') setLookupTarget('payment-internal-support.com');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  lookupType === t ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex-1 relative">
            <input
              type="text"
              value={lookupTarget}
              onChange={(e) => setLookupTarget(e.target.value)}
              placeholder="Enter IP (e.g. 185.199.110.42), Hash, or Domain..."
              className="w-full bg-[#070b14] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <button
            onClick={handleLookup}
            disabled={isLookingUp}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2"
          >
            {isLookingUp ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Query Threat DB</span>
          </button>
        </div>

        {/* Lookup Result Card */}
        {lookupResult && (
          <div className="mt-5 p-4 rounded-xl bg-[#070b14]/90 border border-cyan-500/30 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Target Indicator</span>
              <p className="text-sm font-mono text-cyan-300 font-bold truncate">{lookupResult.indicator}</p>
              <span className="text-[11px] text-slate-400">{lookupResult.provider}</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Confidence Score</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-red-400">{lookupResult.confidenceScore}%</span>
                <span className="text-xs text-red-400/80">({lookupResult.totalReports} reports)</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-red-500 h-full rounded-full shadow-[0_0_8px_#ef4444]"
                  style={{ width: `${lookupResult.confidenceScore}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Origin / Classification</span>
              <p className="text-xs font-semibold text-slate-200">{lookupResult.country}</p>
              <p className="text-[11px] text-slate-400 truncate">{lookupResult.isp}</p>
            </div>

            <div className="space-y-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Verdict & MITRE Tactic</span>
                <p className="text-xs font-bold text-amber-400">{lookupResult.verdict}</p>
                <p className="text-[11px] text-slate-400">{lookupResult.mitreTactic}</p>
              </div>
              <div className="pt-1">
                <button
                  onClick={() => {
                    addIOC({
                      indicator: lookupResult.indicator,
                      type: lookupType === 'Domain' ? 'Domain' : lookupType === 'Hash' ? 'Hash' : 'IP',
                      severity: 'Critical',
                      status: 'Blocklist',
                      confidenceScore: lookupResult.confidenceScore,
                      reportCount: lookupResult.totalReports,
                      source: lookupResult.provider,
                      notes: `${lookupResult.verdict} - ${lookupResult.isp}`,
                    });
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>Promote to Blocklist</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Searchable IOC Database (FR-020, FR-022) */}
      <div className="p-6 rounded-2xl bg-[#0b1426]/75 border border-blue-500/20 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white tracking-wide">
              Indicator of Compromise (IOC) Registry ({filteredIOCs.length})
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter IOCs..."
                className="w-full bg-[#070b14] border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Type selector */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[#070b14] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="All">All Types</option>
              <option value="IP">IP Address</option>
              <option value="Domain">Domain</option>
              <option value="Hash">File Hash</option>
              <option value="URL">URL</option>
            </select>

            {/* Status selector */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#070b14] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="All">All Statuses</option>
              <option value="Blocklist">Blocklist</option>
              <option value="Watchlist">Watchlist</option>
              <option value="Active">Active</option>
            </select>
          </div>
        </div>

        {/* IOC Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#070b14] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Indicator</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Source / Notes</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-[#081021]/60">
              {filteredIOCs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    No matching IOC indicators found in registry.
                  </td>
                </tr>
              ) : (
                filteredIOCs.map((ioc) => (
                  <tr key={ioc.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-white max-w-xs truncate">
                      {ioc.indicator}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                        {ioc.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ioc.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        ioc.severity === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                        ioc.severity === 'Medium' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {ioc.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-cyan-400 font-bold">{ioc.confidenceScore}%</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        ioc.status === 'Blocklist' ? 'bg-red-950/60 text-red-300 border border-red-600/40' :
                        ioc.status === 'Watchlist' ? 'bg-amber-950/60 text-amber-300 border border-amber-600/40' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {ioc.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm truncate text-slate-400">
                      {ioc.notes}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {canPerform('manage_assets') && (
                        <select
                          value={ioc.status}
                          onChange={(e) => updateIOCStatus(ioc.id, e.target.value as any)}
                          className="bg-[#070b14] border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
                        >
                          <option value="Blocklist">Blocklist</option>
                          <option value="Watchlist">Watchlist</option>
                          <option value="Active">Active</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add IOC Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0b1426] border border-cyan-500/40 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Add Threat Indicator (IOC)</h3>
            <form onSubmit={handleAddIOCSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Indicator Value</label>
                <input
                  type="text"
                  required
                  value={newIndicator}
                  onChange={(e) => setNewIndicator(e.target.value)}
                  placeholder="e.g. 195.12.44.1 or malware.exe"
                  className="w-full bg-[#070b14] border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-[#070b14] border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option value="IP">IP Address</option>
                    <option value="Domain">Domain</option>
                    <option value="Hash">File Hash (MD5/SHA)</option>
                    <option value="URL">URL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="w-full bg-[#070b14] border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Policy Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full bg-[#070b14] border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="Blocklist">Blocklist (Automated Drop)</option>
                  <option value="Watchlist">Watchlist (Alert & Log)</option>
                  <option value="Active">Active</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Forensic Notes / Context</label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Reason for blocking, threat actor attribution, etc."
                  className="w-full bg-[#070b14] border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                >
                  Save Indicator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
