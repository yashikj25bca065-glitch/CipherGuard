import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Search, 
  Server, 
  ShieldAlert, 
  Activity, 
  Upload, 
  Download, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  FileSpreadsheet,
  Trash2,
  X
} from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';
import { Asset, AssetStatus, ThreatSeverity } from '../../types';

export const AssetsView: React.FC = () => {
  const { assets, addAsset, updateAssetStatus, deleteAsset, canPerform } = useSecurity();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(assets[0] || null);

  // New asset modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hostname, setHostname] = useState('');
  const [ip, setIp] = useState('');
  const [assetType, setAssetType] = useState<Asset['type']>('Server');
  const [os, setOs] = useState('');
  const [owner, setOwner] = useState('');
  const [criticality, setCriticality] = useState<number>(3);
  const [status, setStatus] = useState<AssetStatus>('Online');

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = 
      asset.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || asset.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostname || !ip) return;
    addAsset({
      hostname,
      ip,
      type: assetType,
      os: os || 'Linux 6.x Generic',
      owner: owner || 'SecOps Infrastructure',
      criticality,
      status,
      lastSeen: 'Just now',
    });
    setIsModalOpen(false);
    setHostname('');
    setIp('');
    setOs('');
    setOwner('');
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Hostname", "IP", "Type", "OS", "Owner", "Criticality", "Status", "LastSeen"];
    const rows = assets.map(a => [
      `"${a.id}"`,
      `"${a.hostname}"`,
      `"${a.ip}"`,
      `"${a.type}"`,
      `"${a.os}"`,
      `"${a.owner}"`,
      a.criticality,
      `"${a.status}"`,
      `"${a.lastSeen}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", encodeURI(csvContent));
    downloadAnchor.setAttribute("download", `CipherGuard-Assets-${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0b1426]/75 border border-cyan-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-wide">Monitored Assets Inventory</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Device telemetry, CVE vulnerabilities (CVSS v3.1), and asset activity timelines (FR-033 — FR-037)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          {canPerform('manage_assets') && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Enroll Asset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Assets List & Asset Details + CVEs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Assets Table (Left 7 Cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#0b1426]/75 border border-blue-500/20 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by hostname, IP, or owner..."
                className="w-full bg-[#070b14] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#070b14] border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Online">Online</option>
              <option value="Degraded">Degraded</option>
              <option value="Suspected Compromise">Suspected Compromise</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[560px] pr-1">
            {filteredAssets.map((asset) => {
              const isSelected = selectedAsset?.id === asset.id;
              return (
                <div
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-950/40 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                      : 'bg-[#081021]/80 hover:bg-[#0d1a36] border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0">
                        <Server className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white font-mono">{asset.hostname}</h4>
                        <span className="text-xs text-slate-400 font-mono">{asset.ip} • {asset.type}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        asset.status === 'Online' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        asset.status === 'Degraded' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        asset.status === 'Suspected Compromise' ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {asset.status}
                      </span>
                      <span className="block text-[10px] text-slate-500 mt-1">Last seen: {asset.lastSeen}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                    <span>Criticality: <strong className="text-amber-400">{asset.criticality}/5</strong></span>
                    <span>CVEs: <strong className="text-red-400">{asset.vulnerabilities.length} Open</strong></span>
                    <span>Owner: {asset.owner}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Asset Details, CVEs & Timeline (Right 5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0b1426]/75 border border-blue-500/20 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          {selectedAsset ? (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-800 flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono text-cyan-400 font-bold">{selectedAsset.id}</span>
                  <h3 className="text-base font-bold text-white font-mono">{selectedAsset.hostname}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedAsset.os}</p>
                </div>

                {canPerform('manage_assets') && (
                  <select
                    value={selectedAsset.status}
                    onChange={(e) => updateAssetStatus(selectedAsset.id, e.target.value as any)}
                    className="bg-[#070b14] border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200"
                  >
                    <option value="Online">Online</option>
                    <option value="Degraded">Degraded</option>
                    <option value="Suspected Compromise">Suspected Compromise</option>
                    <option value="Offline">Offline</option>
                  </select>
                )}
              </div>

              {/* Vulnerabilities (FR-036 CVEs & CVSS Scores) */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Linked CVE Vulnerabilities ({selectedAsset.vulnerabilities.length})
                </span>
                {selectedAsset.vulnerabilities.length === 0 ? (
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-500 text-center">
                    No active high or critical CVE vulnerabilities recorded on this asset.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedAsset.vulnerabilities.map((vuln) => (
                      <div key={vuln.cveId} className="p-3 rounded-xl bg-[#070b14] border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-red-400">{vuln.cveId}</span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-500/30">
                            CVSS {vuln.cvssScore} ({vuln.severity})
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-medium">{vuln.summary}</p>
                        <span className="text-[10px] text-slate-500 block">Status: {vuln.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Per-Asset Activity Timeline (FR-035) */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Per-Asset Activity Timeline
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedAsset.timeline.map((item, idx) => (
                    <div key={idx} className="flex gap-3 text-xs p-2 rounded-lg bg-slate-900/40 border border-slate-800/60">
                      <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-500 block font-mono">{item.time}</span>
                        <p className="text-slate-300 text-[11px] mt-0.5">{item.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Retire Asset Button */}
              {canPerform('manage_settings') && (
                <div className="pt-2 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => deleteAsset(selectedAsset.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-700/50 text-red-400 text-xs font-medium transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Retire Asset</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              Select an asset from the inventory to inspect telemetry.
            </div>
          )}
        </div>
      </div>

      {/* Add Asset Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0b1426] border border-cyan-500/40 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Enroll Monitored Asset (FR-033)</h3>
            <form onSubmit={handleAddAssetSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Hostname / FQDN</label>
                <input
                  type="text"
                  required
                  value={hostname}
                  onChange={(e) => setHostname(e.target.value)}
                  placeholder="e.g. k8s-worker03.corp.internal"
                  className="w-full bg-[#070b14] border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">IP Address</label>
                  <input
                    type="text"
                    required
                    value={ip}
                    onChange={(e) => setIp(e.target.value)}
                    placeholder="10.0.x.x"
                    className="w-full bg-[#070b14] border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Asset Type</label>
                  <select
                    value={assetType}
                    onChange={(e) => setAssetType(e.target.value as any)}
                    className="w-full bg-[#070b14] border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option value="Server">Server</option>
                    <option value="Firewall">Firewall</option>
                    <option value="Workstation">Workstation</option>
                    <option value="Database">Database</option>
                    <option value="Cloud Container">Cloud Container</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Operating System</label>
                  <input
                    type="text"
                    value={os}
                    onChange={(e) => setOs(e.target.value)}
                    placeholder="e.g. Ubuntu 22.04 LTS"
                    className="w-full bg-[#070b14] border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Criticality (1-5)</label>
                  <select
                    value={criticality}
                    onChange={(e) => setCriticality(Number(e.target.value))}
                    className="w-full bg-[#070b14] border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option value={1}>1 - Minimal</option>
                    <option value={2}>2 - Low</option>
                    <option value={3}>3 - Standard</option>
                    <option value={4}>4 - High</option>
                    <option value={5}>5 - Mission Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Owner / Team</label>
                <input
                  type="text"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  placeholder="e.g. Cloud Infrastructure SecOps"
                  className="w-full bg-[#070b14] border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                >
                  Enroll Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
