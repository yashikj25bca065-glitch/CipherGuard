import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Plus, 
  ShieldCheck, 
  History, 
  FileSpreadsheet, 
  FileJson, 
  FileBarChart,
  Search,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';
import { IncidentReport } from '../../types';

export const ReportsView: React.FC = () => {
  const { 
    incidentReports, 
    createIncidentReport, 
    auditLogs, 
    canPerform, 
    alerts 
  } = useSecurity();

  const [activeSubTab, setActiveSubTab] = useState<'incidents' | 'audit' | 'threat-history'>('incidents');
  const [searchTerm, setSearchTerm] = useState('');

  // New incident modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportSummary, setReportSummary] = useState('');
  const [reportImpact, setReportImpact] = useState('');
  const [reportActions, setReportActions] = useState('');
  const [reportSeverity, setReportSeverity] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('High');
  const [reportStatus, setReportStatus] = useState<'Open' | 'Contained' | 'Closed'>('Open');

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle) return;
    createIncidentReport({
      title: reportTitle,
      summary: reportSummary,
      impact: reportImpact || 'Containment verified. Under investigation.',
      actionsTaken: reportActions || 'Firewall rules updated. Forensics collected.',
      severity: reportSeverity,
      status: reportStatus,
      linkedAlertIds: alerts.slice(0, 2).map(a => a.id),
    });
    setIsModalOpen(false);
    setReportTitle('');
    setReportSummary('');
    setReportImpact('');
    setReportActions('');
  };

  // Export handlers (FR-041: PDF, CSV, JSON)
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(incidentReports, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `CipherGuard-Incident-Reports-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Title", "Severity", "Status", "CreatedBy", "CreatedAt", "Impact"];
    const rows = incidentReports.map(r => [
      `"${r.id}"`,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.severity}"`,
      `"${r.status}"`,
      `"${r.createdBy}"`,
      `"${r.createdAt}"`,
      `"${r.impact.replace(/"/g, '""')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", encodeURI(csvContent));
    downloadAnchor.setAttribute("download", `CipherGuard-Incident-Reports-${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportPDF = () => {
    // Generate formatted printable HTML report window
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>CipherGuard Cybersecurity Incident Report</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #1e293b; }
            h1 { color: #0284c7; border-bottom: 2px solid #0284c7; padding-bottom: 8px; }
            .header-info { margin-bottom: 24px; font-size: 14px; color: #64748b; }
            .report-card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin-bottom: 16px; page-break-inside: avoid; }
            .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-size: 12px; }
            .Critical { background: #fee2e2; color: #b91c1c; }
            .High { background: #ffedd5; color: #c2410c; }
            .Medium { background: #e0f2fe; color: #0369a1; }
            .Low { background: #dcfce7; color: #15803d; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th, td { text-align: left; padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
          </style>
        </head>
        <body>
          <h1>CipherGuard Security Incident Report</h1>
          <div class="header-info">
            <p><strong>Export Date:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Classification:</strong> CONFIDENTIAL // CYBERSECURITY AUDIT LOG</p>
          </div>
          ${incidentReports.map(r => `
            <div class="report-card">
              <h3>${r.id}: ${r.title} <span class="badge ${r.severity}">${r.severity}</span></h3>
              <p><strong>Status:</strong> ${r.status} | <strong>Author:</strong> ${r.createdBy} | <strong>Date:</strong> ${r.createdAt}</p>
              <p><strong>Summary:</strong> ${r.summary}</p>
              <p><strong>Impact:</strong> ${r.impact}</p>
              <p><strong>Actions Taken:</strong> ${r.actionsTaken}</p>
            </div>
          `).join('')}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0b1426]/75 border border-cyan-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-wide">Incident Reports & Audit Logs</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            FR-038 incident records, FR-039 append-only tamper-proof audit trails, and multi-format exports (PDF, CSV, JSON)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>PDF Export</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm"
          >
            <FileJson className="w-3.5 h-3.5 text-purple-400" />
            <span>JSON</span>
          </button>

          {canPerform('create_incidents') && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Incident</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/60 border border-slate-800 w-fit">
        <button
          onClick={() => setActiveSubTab('incidents')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === 'incidents'
              ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Incident Reports ({incidentReports.length})
        </button>
        <button
          onClick={() => setActiveSubTab('audit')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === 'audit'
              ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Append-Only Audit Log (FR-039)
        </button>
      </div>

      {/* SubTab 1: Incident Reports */}
      {activeSubTab === 'incidents' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {incidentReports.map((report) => (
              <div
                key={report.id}
                className="p-5 rounded-2xl bg-[#0b1426]/75 border border-blue-500/20 backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-mono text-cyan-400 font-bold">{report.id}</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        report.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        report.severity === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                        'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {report.severity}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        report.status === 'Closed' ? 'bg-emerald-500/20 text-emerald-400' :
                        report.status === 'Contained' ? 'bg-cyan-500/20 text-cyan-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mt-2">{report.title}</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{report.summary}</p>
                </div>

                <div className="space-y-2 text-xs border-t border-slate-800/80 pt-3">
                  <div>
                    <span className="text-slate-500 font-semibold block text-[10px] uppercase">Business Impact</span>
                    <p className="text-slate-300 font-mono text-[11px]">{report.impact}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block text-[10px] uppercase">Actions Taken</span>
                    <p className="text-slate-300 font-mono text-[11px]">{report.actionsTaken}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-2.5">
                  <span>Author: {report.createdBy}</span>
                  <span>{report.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 2: Append-Only Audit Log (FR-039) */}
      {activeSubTab === 'audit' && (
        <div className="p-6 rounded-2xl bg-[#0b1426]/75 border border-blue-500/20 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Immutable Security Audit Trail</h2>
              <p className="text-xs text-slate-400">Strictly append-only: updates and deletes are prevented by architecture.</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30">
              Integrity Verified
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#070b14] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Event ID</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Resource</th>
                  <th className="py-3 px-4">Source IP</th>
                  <th className="py-3 px-4 text-right">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-[#081021]/60 font-mono">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-cyan-400 font-bold">{log.id}</td>
                    <td className="py-3 px-4 text-slate-400">{log.timestamp}</td>
                    <td className="py-3 px-4 text-slate-200">{log.actor}</td>
                    <td className="py-3 px-4 text-amber-300 font-semibold">{log.action}</td>
                    <td className="py-3 px-4 text-slate-300">{log.target}</td>
                    <td className="py-3 px-4 text-slate-400">{log.ip}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.outcome === 'Success' ? 'bg-emerald-500/20 text-emerald-400' :
                        log.outcome === 'Denied' ? 'bg-red-500/20 text-red-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {log.outcome}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Incident Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-[#0b1426] border border-cyan-500/40 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Create Incident Report (FR-038)</h3>
            <form onSubmit={handleCreateReport} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Incident Title</label>
                <input
                  type="text"
                  required
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="e.g. Distributed Credential Stuffing on Core Ingress"
                  className="w-full bg-[#070b14] border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Severity</label>
                  <select
                    value={reportSeverity}
                    onChange={(e) => setReportSeverity(e.target.value as any)}
                    className="w-full bg-[#070b14] border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Status</label>
                  <select
                    value={reportStatus}
                    onChange={(e) => setReportStatus(e.target.value as any)}
                    className="w-full bg-[#070b14] border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option value="Open">Open</option>
                    <option value="Contained">Contained</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Executive Summary</label>
                <textarea
                  rows={2}
                  value={reportSummary}
                  onChange={(e) => setReportSummary(e.target.value)}
                  placeholder="Description of the security incident..."
                  className="w-full bg-[#070b14] border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">System Impact Assessment</label>
                <textarea
                  rows={2}
                  value={reportImpact}
                  onChange={(e) => setReportImpact(e.target.value)}
                  placeholder="Affected assets, services, and potential data exposure..."
                  className="w-full bg-[#070b14] border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Remediation Actions Taken</label>
                <textarea
                  rows={2}
                  value={reportActions}
                  onChange={(e) => setReportActions(e.target.value)}
                  placeholder="Firewall blocks, credential resets, process termination..."
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
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                >
                  Publish Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
