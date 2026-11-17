import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  ShieldAlert, 
  Check, 
  X, 
  AlertTriangle, 
  MessageSquare, 
  Send,
  SlidersHorizontal,
  FileCheck
} from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';
import { Alert, AlertStatus, ThreatSeverity } from '../../types';

export const AlertsView: React.FC = () => {
  const { 
    alerts, 
    updateAlertStatus, 
    bulkUpdateAlerts, 
    canPerform, 
    setActiveTab, 
    createIncidentReport 
  } = useSecurity();

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedAlertIds, setSelectedAlertIds] = useState<string[]>([]);
  const [activeAlertDetail, setActiveAlertDetail] = useState<Alert | null>(alerts[0] || null);

  // New comment input
  const [commentText, setCommentText] = useState('');

  // Filtering
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch = 
      alert.ruleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.sourceIp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.targetAsset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.evidence.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSev = severityFilter === 'All' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'All' || alert.status === statusFilter;
    return matchesSearch && matchesSev && matchesStatus;
  });

  const toggleSelectAlert = (id: string) => {
    setSelectedAlertIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedAlertIds.length === filteredAlerts.length) {
      setSelectedAlertIds([]);
    } else {
      setSelectedAlertIds(filteredAlerts.map(a => a.id));
    }
  };

  const handleBulkAction = (status: AlertStatus) => {
    if (selectedAlertIds.length === 0) return;
    bulkUpdateAlerts(selectedAlertIds, status);
    setSelectedAlertIds([]);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText || !activeAlertDetail) return;
    updateAlertStatus(activeAlertDetail.id, activeAlertDetail.status, commentText);
    setCommentText('');
  };

  const handleEscalateToIncident = (alert: Alert) => {
    createIncidentReport({
      title: `Incident: ${alert.ruleName}`,
      summary: alert.evidence,
      severity: alert.severity,
      status: 'Open',
      impact: `High risk activity on target asset ${alert.targetAsset} originating from ${alert.sourceIp} (${alert.sourceCountry})`,
      actionsTaken: 'Investigator triage underway. Perimeter containment active.',
      linkedAlertIds: [alert.id],
    });
    setActiveTab('reports');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0b1426]/75 border border-cyan-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-wide">Real-Time Alerts & Incident Triage</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Rules engine, priority scoring, automated deduplication, and lifecycle management (FR-023 — FR-028)
          </p>
        </div>

        {/* Bulk Action Controls */}
        {selectedAlertIds.length > 0 && canPerform('triage_alerts') && (
          <div className="flex items-center gap-2 bg-slate-900/90 border border-cyan-500/40 px-3 py-1.5 rounded-xl animate-in fade-in">
            <span className="text-xs font-semibold text-cyan-300">{selectedAlertIds.length} selected</span>
            <button
              onClick={() => handleBulkAction('Acknowledged')}
              className="px-2.5 py-1 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium"
            >
              Acknowledge
            </button>
            <button
              onClick={() => handleBulkAction('Resolved')}
              className="px-2.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors font-medium"
            >
              Resolve
            </button>
          </div>
        )}
      </div>

      {/* Main 2-Column Split: Alert List (Left) & Detailed Forensic Drawer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Alerts Table (Left 7 Cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#0b1426]/75 border border-blue-500/20 backdrop-blur-xl flex flex-col justify-between shadow-xl">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search alerts by rule, IP, or asset..."
                className="w-full bg-[#070b14] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-[#070b14] border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="All">All Severity</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#070b14] border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Acknowledged">Acknowledged</option>
                <option value="Investigating">Investigating</option>
                <option value="Resolved">Resolved</option>
                <option value="False Positive">False Positive</option>
              </select>
            </div>
          </div>

          {/* List items */}
          <div className="space-y-3 overflow-y-auto max-h-[580px] pr-1">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No security alerts match the selected criteria.
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const isSelected = activeAlertDetail?.id === alert.id;
                const isChecked = selectedAlertIds.includes(alert.id);

                return (
                  <div
                    key={alert.id}
                    onClick={() => setActiveAlertDetail(alert)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-blue-950/40 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                        : 'bg-[#081021]/80 hover:bg-[#0d1a36] border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {canPerform('triage_alerts') && (
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleSelectAlert(alert.id);
                            }}
                            className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
                          />
                        )}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          alert.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                          alert.severity === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                          alert.severity === 'Medium' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' :
                          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{alert.id}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          alert.status === 'New' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                          alert.status === 'Acknowledged' ? 'bg-blue-500/20 text-blue-300' :
                          alert.status === 'Investigating' ? 'bg-purple-500/20 text-purple-300' :
                          alert.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-300' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {alert.status}
                        </span>
                        <span className="text-[11px] text-slate-400">{alert.timestamp}</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-semibold text-white mt-2 group-hover:text-cyan-300">
                      {alert.ruleName}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-1 mt-1 font-mono">
                      {alert.evidence}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 pt-2 font-mono">
                      <span>Src: <span className="text-cyan-400">{alert.sourceIp}</span> ({alert.sourceCountry})</span>
                      <span>Target: <span className="text-slate-300">{alert.targetAsset}</span></span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detailed Forensic Drawer (Right 5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0b1426]/75 border border-blue-500/20 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          {activeAlertDetail ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="pb-3 border-b border-slate-800 flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400">{activeAlertDetail.id} • Rule: {activeAlertDetail.ruleId}</span>
                  <h2 className="text-base font-bold text-white mt-0.5">{activeAlertDetail.ruleName}</h2>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">Score: {activeAlertDetail.priorityScore}/100</span>
              </div>

              {/* Status Workflow Action Buttons (FR-026 Lifecycle) */}
              {canPerform('triage_alerts') ? (
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Update Alert Status Lifecycle:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(['New', 'Acknowledged', 'Investigating', 'Resolved', 'False Positive'] as AlertStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => updateAlertStatus(activeAlertDetail.id, st)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          activeAlertDetail.status === st
                            ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.6)]'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-600/30 text-amber-300 text-xs">
                  Viewer mode active: Triage status modifications are disabled per SRS Table 3-1.
                </div>
              )}

              {/* Forensic Evidence Details */}
              <div className="space-y-2 text-xs">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Forensic Evidence & Telemetry
                </span>
                <div className="p-3 rounded-xl bg-[#070b14] border border-slate-800 font-mono text-slate-300 text-[11px] leading-relaxed">
                  {activeAlertDetail.evidence}
                </div>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px]">Source IP / Geolocation</span>
                  <span className="text-cyan-400 font-mono font-bold">{activeAlertDetail.sourceIp}</span>
                  <span className="text-slate-300 block text-[11px]">{activeAlertDetail.sourceCountry} ({activeAlertDetail.sourceCity || 'Unknown'})</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px]">Target Asset / Crit.</span>
                  <span className="text-slate-200 font-mono font-bold">{activeAlertDetail.targetAsset}</span>
                  <span className="text-amber-400 block text-[11px]">Criticality Level: {activeAlertDetail.assetCriticality}/5</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 col-span-2">
                  <span className="text-slate-500 block text-[10px]">MITRE ATT&CK Framework Mapping</span>
                  <span className="text-purple-400 font-semibold">{activeAlertDetail.mitreTactic}</span>
                  <span className="text-slate-300 block text-[11px]">{activeAlertDetail.mitreTechnique}</span>
                </div>
              </div>

              {/* Investigation Notes / Comments */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Investigation Audit Trail ({activeAlertDetail.comments.length})
                </span>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {activeAlertDetail.comments.map((c, i) => (
                    <div key={i} className="p-2 rounded-lg bg-slate-900/50 border border-slate-800 text-xs">
                      <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
                        <span className="font-semibold text-cyan-400">{c.user}</span>
                        <span>{c.time}</span>
                      </div>
                      <p className="text-slate-300">{c.text}</p>
                    </div>
                  ))}
                </div>

                {/* Add comment form */}
                {canPerform('triage_alerts') && (
                  <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add investigation note..."
                      className="flex-1 bg-[#070b14] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>

              {/* Escalate to Incident Report Button */}
              {canPerform('create_incidents') && (
                <div className="pt-2">
                  <button
                    onClick={() => handleEscalateToIncident(activeAlertDetail)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600/60 text-slate-200 hover:text-white text-xs font-semibold transition-all"
                  >
                    <FileCheck className="w-4 h-4 text-cyan-400" />
                    <span>Create Security Incident Report (FR-038)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              Select an alert from the queue to review telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
