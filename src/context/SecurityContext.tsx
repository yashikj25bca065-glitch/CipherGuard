import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Role, 
  ThreatSeverity, 
  ThreatCategory, 
  AlertStatus, 
  AssetStatus, 
  ThreatActivityItem, 
  ThreatMapArc, 
  Alert, 
  Asset, 
  IOCItem, 
  IncidentReport, 
  AuditLogEntry, 
  SystemSettings 
} from '../types';

interface SecurityContextType {
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // User & RBAC
  currentUser: {
    name: string;
    email: string;
    role: Role;
    avatar: string;
  };
  setCurrentRole: (role: Role) => void;
  canPerform: (action: 'view' | 'triage_alerts' | 'create_incidents' | 'manage_assets' | 'export_reports' | 'view_audit_log' | 'manage_settings') => boolean;
  
  // Dashboard KPIs
  kpis: {
    securityHealth: number;
    securityHealthDelta: string;
    threatsBlocked: number;
    threatsBlockedDelta: string;
    monitoredAssetsCount: number;
    monitoredAssetsDelta: string;
    uptime: number;
    uptimeDelta: string;
    defenseRate: number;
  };
  
  // Analytics
  analyticsRange: '1D' | '1W' | '1M' | '3M';
  setAnalyticsRange: (range: '1D' | '1W' | '1M' | '3M') => void;
  threatTypesDistribution: { name: string; percentage: number; color: string }[];
  
  // Feeds & Maps
  activityFeed: ThreatActivityItem[];
  threatArcs: ThreatMapArc[];
  selectedMapEvent: ThreatMapArc | null;
  setSelectedMapEvent: (event: ThreatMapArc | null) => void;
  isMapStreaming: boolean;
  setIsMapStreaming: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Alerts
  alerts: Alert[];
  unreadAlertCount: number;
  updateAlertStatus: (alertId: string, status: AlertStatus, comment?: string) => void;
  bulkUpdateAlerts: (alertIds: string[], status: AlertStatus) => void;
  
  // Assets
  assets: Asset[];
  addAsset: (asset: Omit<Asset, 'id' | 'vulnerabilities' | 'timeline'>) => void;
  updateAssetStatus: (id: string, status: AssetStatus) => void;
  deleteAsset: (id: string) => void;
  
  // Threat Intelligence & IOCs
  iocs: IOCItem[];
  addIOC: (ioc: Omit<IOCItem, 'id' | 'firstSeen'>) => void;
  updateIOCStatus: (id: string, status: 'Active' | 'Watchlist' | 'Blocklist') => void;
  
  // Incident Reports
  incidentReports: IncidentReport[];
  createIncidentReport: (report: Omit<IncidentReport, 'id' | 'createdAt' | 'createdBy'>) => void;
  
  // Audit Logs (FR-039 Append-only)
  auditLogs: AuditLogEntry[];
  addAuditLog: (action: string, target: string, outcome?: 'Success' | 'Denied' | 'Failed') => void;
  
  // Settings & Simulation Engine
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Toast notifications
  toasts: { id: string; message: string; severity: ThreatSeverity; timestamp: string }[];
  dismissToast: (id: string) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [analyticsRange, setAnalyticsRange] = useState<'1D' | '1W' | '1M' | '3M'>('1D');
  const [isMapStreaming, setIsMapStreaming] = useState<boolean>(true);
  const [selectedMapEvent, setSelectedMapEvent] = useState<ThreatMapArc | null>(null);

  // User details matching screenshot ("Yashik J.")
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: Role;
    avatar: string;
  }>({
    name: 'Yashik J.',
    email: 'yashik.j@cipherguard.internal',
    role: 'Administrator',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
  });

  // Settings & Configuration
  const [settings, setSettings] = useState<SystemSettings>({
    timeZone: 'UTC+05:30 (IST)',
    defaultTimeRange: '1D',
    visualEffectIntensity: 'High',
    reducedMotion: false,
    emailNotifications: true,
    minSeverityAlert: 'High',
    quietHours: false,
    sessionTimeoutMinutes: 30,
    lockoutAttempts: 5,
    dataMode: 'Simulation',
    simulationRate: 5,
    scenarioType: 'Normal Activity',
    randomSeed: 'CG-SEED-9842',
    apiKeyAbuseIPDB: 'sk_abuse_live_••••••••••••3a9f',
    apiKeyVirusTotal: 'vt_live_••••••••••••e81b',
  });

  // Dashboard KPIs matching the exact screenshot:
  // 99.8% Security Health (+0.2%)
  // 247 Threats Blocked (+12%)
  // 12.4K Monitored Assets (+4%)
  // 99.99% Uptime (+0.01%)
  const [kpis, setKpis] = useState({
    securityHealth: 99.8,
    securityHealthDelta: '+0.2%',
    threatsBlocked: 247,
    threatsBlockedDelta: '+12%',
    monitoredAssetsCount: 12420,
    monitoredAssetsDelta: '+4%',
    uptime: 99.99,
    uptimeDelta: '+0.01%',
    defenseRate: 99.8,
  });

  // Top Threat Types matching screenshot
  const threatTypesDistribution = [
    { name: 'Malware', percentage: 42, color: '#a855f7' },
    { name: 'Phishing', percentage: 33, color: '#38bdf8' },
    { name: 'Ransomware', percentage: 15, color: '#3b82f6' },
    { name: 'Others', percentage: 10, color: '#94a3b8' },
  ];

  // Threat Activity Feed matching the exact screenshot items:
  // 1. Malicious IP Blocked (185.199.110.42, 2 min ago, red)
  // 2. Suspicious Login Attempt (from Russia, 5 min ago, blue)
  // 3. Phishing Attempt Detected (via Email Gateway, 8 min ago, orange)
  // 4. Threat Quarantined (Trojan.Win32.Generic, 12 min ago, green)
  const [activityFeed, setActivityFeed] = useState<ThreatActivityItem[]>([
    {
      id: 'act-1',
      title: 'Malicious IP Blocked',
      subtitle: '185.199.110.42',
      category: 'Unauthorised Access',
      severity: 'Critical',
      timestamp: '2 min ago',
      rawTime: new Date(Date.now() - 2 * 60 * 1000),
      ip: '185.199.110.42',
      country: 'Netherlands',
      iconType: 'blocked',
    },
    {
      id: 'act-2',
      title: 'Suspicious Login Attempt',
      subtitle: 'from Russia',
      category: 'Brute Force',
      severity: 'Medium',
      timestamp: '5 min ago',
      rawTime: new Date(Date.now() - 5 * 60 * 1000),
      ip: '91.240.118.73',
      country: 'Russia',
      iconType: 'login',
    },
    {
      id: 'act-3',
      title: 'Phishing Attempt Detected',
      subtitle: 'via Email Gateway',
      category: 'Phishing',
      severity: 'High',
      timestamp: '8 min ago',
      rawTime: new Date(Date.now() - 8 * 60 * 1000),
      ip: '194.26.29.114',
      country: 'Lithuania',
      iconType: 'phishing',
    },
    {
      id: 'act-4',
      title: 'Threat Quarantined',
      subtitle: 'Trojan.Win32.Generic',
      category: 'Malware',
      severity: 'Low',
      timestamp: '12 min ago',
      rawTime: new Date(Date.now() - 12 * 60 * 1000),
      ip: '10.0.4.15',
      country: 'Internal (Workstation-Sales04)',
      iconType: 'quarantine',
    },
  ]);

  // Global Threat Map Arcs & Hotspots matching screenshot visual positions
  const [threatArcs, setThreatArcs] = useState<ThreatMapArc[]>([
    {
      id: 'arc-1',
      fromName: 'St. Petersburg, Russia',
      fromCoords: [62, 28],
      toName: 'Frankfurt Core DC, Germany',
      toCoords: [50, 34],
      severity: 'Critical',
      type: 'Distributed Brute Force & SSH Credential Stuffing',
      ip: '91.240.118.73',
      asn: 'AS44050 Petersburg Internet Network',
      timestamp: 'Just now',
      isSimulated: true,
    },
    {
      id: 'arc-2',
      fromName: 'Shenzhen, China',
      fromCoords: [78, 48],
      toName: 'Ashburn US-East, USA',
      toCoords: [27, 36],
      severity: 'High',
      type: 'Zero-Day Exploit Probe (CVE-2024-3400)',
      ip: '120.232.18.91',
      asn: 'AS56040 China Mobile Communications',
      timestamp: '1 min ago',
      isSimulated: true,
    },
    {
      id: 'arc-3',
      fromName: 'São Paulo, Brazil',
      fromCoords: [32, 70],
      toName: 'London Edge Gateway, UK',
      toCoords: [48, 30],
      severity: 'Medium',
      type: 'Banking Trojan / Phishing C2 Beacon',
      ip: '177.129.44.18',
      asn: 'AS28573 Claro Brasil',
      timestamp: '3 min ago',
      isSimulated: true,
    },
    {
      id: 'arc-4',
      fromName: 'Sydney, Australia',
      fromCoords: [86, 76],
      toName: 'Tokyo Primary Hub, Japan',
      toCoords: [83, 38],
      severity: 'Low',
      type: 'Automated Port Sweep & Shodan Crawler',
      ip: '139.130.4.5',
      asn: 'AS1221 Telstra Corporation',
      timestamp: '5 min ago',
      isSimulated: true,
    },
    {
      id: 'arc-5',
      fromName: 'Bucharest, Romania',
      fromCoords: [55, 33],
      toName: 'Silicon Valley Gateway, USA',
      toCoords: [18, 38],
      severity: 'Critical',
      type: 'Cobalt Strike Malleable C2 Traffic',
      ip: '185.199.110.42',
      asn: 'AS396982 Google Cloud Spoofer',
      timestamp: '6 min ago',
      isSimulated: true,
    },
  ]);

  // Alerts List (Badge count starts at 3, exactly as in top nav & sidebar badge)
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'ALT-1094',
      ruleId: 'RULE-NET-004',
      ruleName: 'Malicious IP Blocked at Perimeter Firewall',
      severity: 'Critical',
      priorityScore: 96,
      category: 'Unauthorised Access',
      status: 'New',
      sourceIp: '185.199.110.42',
      sourceCountry: 'Netherlands',
      sourceCity: 'Amsterdam',
      targetAsset: 'prod-fw-core01.internal',
      assetCriticality: 5,
      timestamp: '2 min ago',
      rawTime: new Date(Date.now() - 2 * 60 * 1000),
      occurrences: 48,
      evidence: 'High confidence malicious IP flagged in AbuseIPDB (98% confidence). Repeated SYN flood & SSH brute force bypass attempts against perimeter gateway port 22.',
      mitreTactic: 'Initial Access (TA0001)',
      mitreTechnique: 'External Remote Services (T1133)',
      comments: [
        { user: 'System Rules Engine', text: 'Automated perimeter block triggered. IP quarantined on edge ACL.', time: '2 min ago' }
      ]
    },
    {
      id: 'ALT-1093',
      ruleId: 'RULE-AUTH-008',
      ruleName: 'Anomalous Geolocation & Credential Velocity',
      severity: 'High',
      priorityScore: 82,
      category: 'Brute Force',
      status: 'New',
      sourceIp: '91.240.118.73',
      sourceCountry: 'Russia',
      sourceCity: 'Moscow',
      targetAsset: 'auth-sso.cipherguard.io',
      assetCriticality: 4,
      timestamp: '5 min ago',
      rawTime: new Date(Date.now() - 5 * 60 * 1000),
      occurrences: 14,
      evidence: 'Account admin@cipherguard.io logged in from California 20 mins prior, followed immediately by 14 consecutive failed Kerberos/OAuth handshakes originating from Russian ASN.',
      mitreTactic: 'Credential Access (TA0006)',
      mitreTechnique: 'Brute Force: Password Spraying (T1110.003)',
      comments: [
        { user: 'Security Bot', text: 'Temporary account MFA challenge enforced.', time: '5 min ago' }
      ]
    },
    {
      id: 'ALT-1092',
      ruleId: 'RULE-MAIL-002',
      ruleName: 'Spear-Phishing Payload in Inbound Email',
      severity: 'High',
      priorityScore: 78,
      category: 'Phishing',
      status: 'New',
      sourceIp: '194.26.29.114',
      sourceCountry: 'Lithuania',
      sourceCity: 'Vilnius',
      targetAsset: 'mail-edge-cluster.internal',
      assetCriticality: 3,
      timestamp: '8 min ago',
      rawTime: new Date(Date.now() - 8 * 60 * 1000),
      occurrences: 3,
      evidence: 'SPF/DKIM spoofing detected on domain payment-internal-support.com. Attachment invoice_q4_overdue.pdf.exe contains known LockBit dropper signature.',
      mitreTactic: 'Initial Access (TA0001)',
      mitreTechnique: 'Phishing: Spearphishing Attachment (T1566.001)',
      comments: [
        { user: 'Mail Filter', text: 'Message dropped and sandboxed in quarantine vault.', time: '8 min ago' }
      ]
    },
    {
      id: 'ALT-1088',
      ruleId: 'RULE-EDR-019',
      ruleName: 'Endpoint Heuristic Quarantined Malicious Binary',
      severity: 'Low',
      priorityScore: 35,
      category: 'Malware',
      status: 'Resolved',
      sourceIp: '10.0.4.15',
      sourceCountry: 'Internal',
      sourceCity: 'Sales Office Floor 2',
      targetAsset: 'ws-sales-04.corp.local',
      assetCriticality: 2,
      timestamp: '12 min ago',
      rawTime: new Date(Date.now() - 12 * 60 * 1000),
      occurrences: 1,
      evidence: 'Process memory dump matched Trojan.Win32.Generic. File C:\\Users\\sales\\Downloads\\calc_patch.exe was isolated and deleted by agent.',
      mitreTactic: 'Execution (TA0002)',
      mitreTechnique: 'User Execution (T1204)',
      assignedTo: 'Yashik J.',
      comments: [
        { user: 'Yashik J.', text: 'Investigated and confirmed benign adware signature neutralized by Falcon EDR.', time: '10 min ago' }
      ]
    }
  ]);

  // Monitored Assets list (FR-033, FR-034, FR-036)
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: 'AST-101',
      hostname: 'prod-fw-core01.internal',
      ip: '10.0.0.1',
      type: 'Firewall',
      os: 'Palo Alto PAN-OS 11.1',
      owner: 'SecOps Infrastructure',
      criticality: 5,
      status: 'Suspected Compromise',
      lastSeen: 'Just now',
      vulnerabilities: [
        { cveId: 'CVE-2024-3400', cvssScore: 10.0, severity: 'Critical', summary: 'PAN-OS Command Injection Vulnerability', status: 'Open' },
        { cveId: 'CVE-2023-3824', cvssScore: 7.5, severity: 'High', summary: 'Buffer overflow in management interface', status: 'Mitigated' }
      ],
      timeline: [
        { time: '2 min ago', event: 'Perimeter firewall blocked 48 unauthorized SYN flood packets from 185.199.110.42', severity: 'Critical' },
        { time: '1 hr ago', event: 'Configuration backup synced with cloud vault', severity: 'Low' }
      ]
    },
    {
      id: 'AST-102',
      hostname: 'auth-sso.cipherguard.io',
      ip: '10.0.1.20',
      type: 'Server',
      os: 'Ubuntu Linux 22.04 LTS',
      owner: 'Identity & Access Team',
      criticality: 5,
      status: 'Degraded',
      lastSeen: '30 sec ago',
      vulnerabilities: [
        { cveId: 'CVE-2024-21626', cvssScore: 8.6, severity: 'High', summary: 'runc container breakout vulnerability', status: 'Mitigated' }
      ],
      timeline: [
        { time: '5 min ago', event: 'Anomalous authentication burst from Russian IP block 91.240.118.73', severity: 'High' },
        { time: '20 min ago', event: 'JWT token signing key rotation executed successfully', severity: 'Low' }
      ]
    },
    {
      id: 'AST-103',
      hostname: 'db-customer-primary.internal',
      ip: '10.0.2.14',
      type: 'Database',
      os: 'PostgreSQL 16.2 / Debian 12',
      owner: 'Data Engineering Team',
      criticality: 5,
      status: 'Online',
      lastSeen: '10 sec ago',
      vulnerabilities: [
        { cveId: 'CVE-2023-39417', cvssScore: 5.3, severity: 'Medium', summary: 'Extension script privilege escalation', status: 'Accepted' }
      ],
      timeline: [
        { time: '1 hr ago', event: 'Automated encrypted snapshot completed without anomalies', severity: 'Low' }
      ]
    },
    {
      id: 'AST-104',
      hostname: 'mail-edge-cluster.internal',
      ip: '10.0.1.55',
      type: 'Server',
      os: 'CentOS Stream 9',
      owner: 'SecOps Messaging',
      criticality: 3,
      status: 'Online',
      lastSeen: '1 min ago',
      vulnerabilities: [],
      timeline: [
        { time: '8 min ago', event: 'Quarantined phishing attachment invoice_q4_overdue.pdf.exe', severity: 'High' }
      ]
    },
    {
      id: 'AST-105',
      hostname: 'k8s-cluster-ingress01',
      ip: '10.0.3.10',
      type: 'Cloud Container',
      os: 'Kubernetes v1.29 / Alpine Linux',
      owner: 'Cloud Ops',
      criticality: 4,
      status: 'Online',
      lastSeen: '5 sec ago',
      vulnerabilities: [],
      timeline: [
        { time: '4 hrs ago', event: 'Rolling deployment of ingress controller envoy v1.28.1', severity: 'Low' }
      ]
    },
    {
      id: 'AST-106',
      hostname: 'ws-sales-04.corp.local',
      ip: '10.0.4.15',
      type: 'Workstation',
      os: 'Windows 11 Enterprise 23H2',
      owner: 'Sales Operations',
      criticality: 2,
      status: 'Online',
      lastSeen: 'Just now',
      vulnerabilities: [],
      timeline: [
        { time: '12 min ago', event: 'Isolated Trojan.Win32.Generic in user download folder', severity: 'Low' }
      ]
    }
  ]);

  // Searchable IOC Watchlist / Blocklist (FR-020, FR-022)
  const [iocs, setIocs] = useState<IOCItem[]>([
    {
      id: 'IOC-001',
      indicator: '185.199.110.42',
      type: 'IP',
      severity: 'Critical',
      confidenceScore: 98,
      reportCount: 342,
      firstSeen: '2026-11-14 04:12 UTC',
      source: 'AbuseIPDB Verified Feed',
      status: 'Blocklist',
      notes: 'Active Cobalt Strike command & control server scanning port 22 and port 443.'
    },
    {
      id: 'IOC-002',
      indicator: 'payment-internal-support.com',
      type: 'Domain',
      severity: 'High',
      confidenceScore: 89,
      reportCount: 56,
      firstSeen: '2026-11-16 19:40 UTC',
      source: 'VirusTotal Intelligence',
      status: 'Blocklist',
      notes: 'Typo-squatting domain hosting credential harvesting landing page.'
    },
    {
      id: 'IOC-003',
      indicator: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      type: 'Hash',
      severity: 'Critical',
      confidenceScore: 100,
      reportCount: 184,
      firstSeen: '2026-11-12 11:05 UTC',
      source: 'MITRE ATT&CK IOC Repository',
      status: 'Blocklist',
      notes: 'SHA-256 hash belonging to LockBit 3.0 ransomware payload.'
    },
    {
      id: 'IOC-004',
      indicator: '91.240.118.73',
      type: 'IP',
      severity: 'High',
      confidenceScore: 76,
      reportCount: 93,
      firstSeen: '2026-11-17 01:22 UTC',
      source: 'Internal Threat Engine',
      status: 'Watchlist',
      notes: 'Russian hosting ASN exhibiting sustained credential stuffing across cloud endpoints.'
    },
    {
      id: 'IOC-005',
      indicator: 'http://cdn-update-secure.top/payload.sh',
      type: 'URL',
      severity: 'High',
      confidenceScore: 85,
      reportCount: 32,
      firstSeen: '2026-11-15 14:15 UTC',
      source: 'AlienVault OTX',
      status: 'Watchlist',
      notes: 'Malicious bash staging script for cryptominer deployment.'
    }
  ]);

  // Incident Reports (FR-038)
  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>([
    {
      id: 'INC-2026-081',
      title: 'Perimeter Breach Attempt via Exploited Gateway IP',
      summary: 'Multiple reconnaissance probes and port sweeps followed by credential stuffing targeted at primary firewall.',
      severity: 'Critical',
      status: 'Contained',
      impact: 'Zero data exfiltration. Perimeter access rules successfully dropped 48 malicious handshake requests.',
      actionsTaken: 'Firewall rules updated to null-route ASN 396982. Forensic memory dump analyzed.',
      createdBy: 'Yashik J. (Administrator)',
      createdAt: '17 Nov 2026, 09:45 IST',
      linkedAlertIds: ['ALT-1094']
    },
    {
      id: 'INC-2026-079',
      title: 'Targeted Spear-Phishing Campaign Against Finance Department',
      summary: 'Spoofed invoice notifications delivered with executable trojan payload.',
      severity: 'High',
      status: 'Closed',
      impact: 'Three employees received the message. Mail gateway isolated all attachments before user execution.',
      actionsTaken: 'Domain payment-internal-support.com blocked organization-wide. Security awareness alert sent.',
      createdBy: 'Sarah Connor (Security Analyst)',
      createdAt: '16 Nov 2026, 17:30 IST',
      linkedAlertIds: ['ALT-1092']
    }
  ]);

  // Searchable Append-Only Audit Log (FR-039)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'AUD-901',
      actor: 'Yashik J. (admin)',
      action: 'SYSTEM_SETTINGS_UPDATE',
      target: 'Simulation Engine Parameters',
      ip: '10.14.0.5',
      timestamp: '17 Nov 2026, 10:15:22 IST',
      outcome: 'Success'
    },
    {
      id: 'AUD-902',
      actor: 'System Rules Engine',
      action: 'AUTOMATED_FIREWALL_BLOCK',
      target: 'IP 185.199.110.42',
      ip: '10.0.0.1',
      timestamp: '17 Nov 2026, 10:30:14 IST',
      outcome: 'Success'
    },
    {
      id: 'AUD-903',
      actor: 'Yashik J. (admin)',
      action: 'ALERT_TRIAGE_RESOLVED',
      target: 'Alert ALT-1088 (Trojan.Win32)',
      ip: '10.14.0.5',
      timestamp: '17 Nov 2026, 10:42:01 IST',
      outcome: 'Success'
    },
    {
      id: 'AUD-904',
      actor: 'Viewer Guest',
      action: 'FIREWALL_RULE_MODIFY',
      target: 'Perimeter Rule Table',
      ip: '10.14.8.12',
      timestamp: '17 Nov 2026, 10:48:33 IST',
      outcome: 'Denied'
    }
  ]);

  // Toasts
  const [toasts, setToasts] = useState<{ id: string; message: string; severity: ThreatSeverity; timestamp: string }[]>([]);

  const addToast = (message: string, severity: ThreatSeverity = 'High') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [{ id, message, severity, timestamp: 'Just now' }, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 6000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Add Audit Log
  const addAuditLog = (action: string, target: string, outcome: 'Success' | 'Denied' | 'Failed' = 'Success') => {
    const newEntry: AuditLogEntry = {
      id: 'AUD-' + Math.floor(1000 + Math.random() * 9000),
      actor: `${currentUser.name} (${currentUser.role.toLowerCase()})`,
      action,
      target,
      ip: '10.14.0.5',
      timestamp: new Date().toLocaleString(),
      outcome
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  // RBAC Permission Check (SRS Table 3-1: Permission matrix)
  // Capability | Administrator | Security Analyst | Viewer
  // View dashboards, map, analytics: Yes, Yes, Yes
  // Acknowledge / resolve alerts: Yes, Yes, No
  // Create incident reports: Yes, Yes, No
  // Manage assets: Yes, Yes (create/edit), No
  // Export reports: Yes, Yes, Yes (reports only)
  // View audit log: Yes, Yes (own actions), No
  // Manage users, security settings, integrations: Yes, No, No
  const canPerform = (action: 'view' | 'triage_alerts' | 'create_incidents' | 'manage_assets' | 'export_reports' | 'view_audit_log' | 'manage_settings') => {
    if (currentUser.role === 'Administrator') return true;
    if (currentUser.role === 'Security Analyst') {
      if (action === 'manage_settings') return false;
      return true;
    }
    if (currentUser.role === 'Viewer') {
      if (action === 'view' || action === 'export_reports') return true;
      return false;
    }
    return false;
  };

  const setCurrentRole = (role: Role) => {
    setCurrentUser(prev => ({ ...prev, role }));
    addAuditLog('ROLE_SWITCH', `Switched active role to ${role}`);
    addToast(`Switched active role to ${role}. Permissions updated according to Table 3-1.`, 'Low');
  };

  // Alert Actions
  const updateAlertStatus = (alertId: string, status: AlertStatus, comment?: string) => {
    if (!canPerform('triage_alerts')) {
      addAuditLog('ALERT_STATUS_UPDATE_ATTEMPT', `Alert ${alertId} status change blocked by RBAC`, 'Denied');
      addToast('Permission Denied: Viewer role cannot modify alert status (SRS Table 3-1)', 'High');
      return;
    }
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        const updatedComments = comment 
          ? [...a.comments, { user: currentUser.name, text: comment, time: 'Just now' }]
          : a.comments;
        return { ...a, status, comments: updatedComments };
      }
      return a;
    }));
    addAuditLog('ALERT_STATUS_UPDATE', `Alert ${alertId} status changed to ${status}`);
    addToast(`Alert ${alertId} marked as ${status}`, 'Medium');
  };

  const bulkUpdateAlerts = (alertIds: string[], status: AlertStatus) => {
    if (!canPerform('triage_alerts')) {
      addToast('Permission Denied: Viewer role cannot modify alerts.', 'High');
      return;
    }
    setAlerts(prev => prev.map(a => alertIds.includes(a.id) ? { ...a, status } : a));
    addAuditLog('BULK_ALERT_UPDATE', `Updated ${alertIds.length} alerts to ${status}`);
    addToast(`Updated ${alertIds.length} alerts to ${status}`, 'Medium');
  };

  // Asset Actions
  const addAsset = (newAssetData: Omit<Asset, 'id' | 'vulnerabilities' | 'timeline'>) => {
    if (!canPerform('manage_assets')) {
      addToast('Permission Denied: Viewer role cannot add assets.', 'High');
      return;
    }
    const newAsset: Asset = {
      ...newAssetData,
      id: 'AST-' + Math.floor(200 + Math.random() * 800),
      vulnerabilities: [],
      timeline: [
        { time: 'Just now', event: 'Asset enrolled in active monitoring', severity: 'Low' }
      ]
    };
    setAssets(prev => [newAsset, ...prev]);
    setKpis(prev => ({ ...prev, monitoredAssetsCount: prev.monitoredAssetsCount + 1 }));
    addAuditLog('ASSET_CREATE', `Enrolled new asset ${newAsset.hostname} (${newAsset.ip})`);
    addToast(`Asset ${newAsset.hostname} successfully added`, 'Low');
  };

  const updateAssetStatus = (id: string, status: AssetStatus) => {
    if (!canPerform('manage_assets')) {
      addToast('Permission Denied: Viewer role cannot edit assets.', 'High');
      return;
    }
    setAssets(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    addAuditLog('ASSET_STATUS_UPDATE', `Asset ${id} marked as ${status}`);
  };

  const deleteAsset = (id: string) => {
    if (currentUser.role !== 'Administrator') {
      addToast('Permission Denied: Only Administrators can retire assets.', 'High');
      return;
    }
    setAssets(prev => prev.filter(a => a.id !== id));
    addAuditLog('ASSET_RETIRE', `Retired asset ${id}`);
    addToast(`Asset ${id} retired from monitoring`, 'Low');
  };

  // IOC Actions
  const addIOC = (newIocData: Omit<IOCItem, 'id' | 'firstSeen'>) => {
    if (!canPerform('manage_assets')) {
      addToast('Permission Denied: Viewer role cannot add IOCs.', 'High');
      return;
    }
    const newIOC: IOCItem = {
      ...newIocData,
      id: 'IOC-' + Math.floor(100 + Math.random() * 900),
      firstSeen: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
    };
    setIocs(prev => [newIOC, ...prev]);
    addAuditLog('IOC_ADD', `Added IOC ${newIOC.indicator} (${newIOC.type}) to ${newIOC.status}`);
    addToast(`IOC ${newIOC.indicator} added to ${newIOC.status}`, 'Low');
  };

  const updateIOCStatus = (id: string, status: 'Active' | 'Watchlist' | 'Blocklist') => {
    if (!canPerform('manage_assets')) {
      addToast('Permission Denied.', 'High');
      return;
    }
    setIocs(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    addAuditLog('IOC_STATUS_UPDATE', `IOC ${id} updated to ${status}`);
    addToast(`IOC status updated to ${status}`, 'Low');
  };

  // Incident Report Actions
  const createIncidentReport = (reportData: Omit<IncidentReport, 'id' | 'createdAt' | 'createdBy'>) => {
    if (!canPerform('create_incidents')) {
      addToast('Permission Denied: Viewer role cannot create incident reports.', 'High');
      return;
    }
    const newReport: IncidentReport = {
      ...reportData,
      id: `INC-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdBy: `${currentUser.name} (${currentUser.role})`,
      createdAt: new Date().toLocaleString(),
    };
    setIncidentReports(prev => [newReport, ...prev]);
    addAuditLog('INCIDENT_REPORT_CREATE', `Created incident report ${newReport.id}: ${newReport.title}`);
    addToast(`Incident Report ${newReport.id} created successfully`, 'Low');
  };

  // System Settings update
  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    if (!canPerform('manage_settings')) {
      addToast('Permission Denied: Only Administrators can configure system settings (SRS Table 3-1)', 'High');
      return;
    }
    setSettings(prev => ({ ...prev, ...newSettings }));
    addAuditLog('SETTINGS_UPDATE', `Updated settings: ${Object.keys(newSettings).join(', ')}`);
    addToast('System settings saved', 'Low');
  };

  // Unread alerts count (matching badge count "3" in screenshot!)
  const unreadAlertCount = useMemo(() => {
    return alerts.filter(a => a.status === 'New').length;
  }, [alerts]);

  // Real-time Simulation Engine (FR-010, FR-047)
  useEffect(() => {
    if (!isMapStreaming || settings.dataMode === 'Live') return;

    // Interval based on simulation rate (default every 12 seconds)
    const intervalTime = Math.max(4000, 30000 / settings.simulationRate);

    const interval = setInterval(() => {
      // Pick random simulated threat origin and target
      const origins: Array<{ name: string; coords: [number, number]; ip: string; asn: string; country: string }> = [
        { name: 'Seoul, South Korea', coords: [81, 38], ip: '211.234.120.15', asn: 'AS4766 Korea Telecom', country: 'South Korea' },
        { name: 'Warsaw, Poland', coords: [54, 30], ip: '188.146.72.10', asn: 'AS8329 Polkomtel', country: 'Poland' },
        { name: 'Toronto, Canada', coords: [24, 33], ip: '198.51.100.84', asn: 'AS852 TELUS', country: 'Canada' },
        { name: 'Singapore Hub', coords: [74, 58], ip: '103.253.14.9', asn: 'AS4657 StarHub', country: 'Singapore' },
        { name: 'Stockholm, Sweden', coords: [53, 24], ip: '193.182.144.20', asn: 'AS3301 Telia Company', country: 'Sweden' },
        { name: 'Mumbai, India', coords: [68, 48], ip: '115.114.28.1', asn: 'AS4755 Tata Communications', country: 'India' },
      ];

      const targets: Array<{ name: string; coords: [number, number] }> = [
        { name: 'Frankfurt Core DC, Germany', coords: [50, 34] },
        { name: 'Ashburn US-East, USA', coords: [27, 36] },
        { name: 'London Edge Gateway, UK', coords: [48, 30] },
        { name: 'Tokyo Primary Hub, Japan', coords: [83, 38] },
        { name: 'Silicon Valley Gateway, USA', coords: [18, 38] },
      ];

      const types: Array<{ title: string; subtitle: string; category: ThreatCategory; severity: ThreatSeverity; icon: ThreatActivityItem['iconType'] }> = [
        { title: 'SYN Flood Mitigation', subtitle: 'Edge Filter Dropped 12.4k pkt/s', category: 'DDoS', severity: 'Critical', icon: 'ddos' },
        { title: 'Brute Force Stopped', subtitle: 'SSH port 22 limit exceeded', category: 'Brute Force', severity: 'High', icon: 'login' },
        { title: 'Malicious Query Blocked', subtitle: 'SQL Injection in REST API', category: 'Unauthorised Access', severity: 'Critical', icon: 'blocked' },
        { title: 'Suspicious Domain Flagged', subtitle: 'Resolving known C2 endpoint', category: 'Phishing', severity: 'Medium', icon: 'phishing' },
        { title: 'Payload Quarantined', subtitle: 'Heuristic Trojan Isolation', category: 'Malware', severity: 'Low', icon: 'quarantine' },
      ];

      const origin = origins[Math.floor(Math.random() * origins.length)];
      const target = targets[Math.floor(Math.random() * targets.length)];
      const threatType = types[Math.floor(Math.random() * types.length)];

      const newArc: ThreatMapArc = {
        id: 'arc-' + Date.now(),
        fromName: origin.name,
        fromCoords: origin.coords,
        toName: target.name,
        toCoords: target.coords,
        severity: threatType.severity,
        type: threatType.title,
        ip: origin.ip,
        asn: origin.asn,
        timestamp: 'Just now',
        isSimulated: true,
      };

      setThreatArcs(prev => [newArc, ...prev.slice(0, 6)]);

      // Occasionally add to activity feed
      const newActivity: ThreatActivityItem = {
        id: 'act-' + Date.now(),
        title: threatType.title,
        subtitle: threatType.subtitle,
        category: threatType.category,
        severity: threatType.severity,
        timestamp: 'Just now',
        rawTime: new Date(),
        ip: origin.ip,
        country: origin.country,
        iconType: threatType.icon,
      };

      setActivityFeed(prev => [newActivity, ...prev.slice(0, 5)]);

      // Increment threats blocked counter
      setKpis(prev => ({
        ...prev,
        threatsBlocked: prev.threatsBlocked + 1,
      }));

    }, intervalTime);

    return () => clearInterval(interval);
  }, [isMapStreaming, settings.simulationRate, settings.dataMode]);

  return (
    <SecurityContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentUser,
        setCurrentRole,
        canPerform,
        kpis,
        analyticsRange,
        setAnalyticsRange,
        threatTypesDistribution,
        activityFeed,
        threatArcs,
        selectedMapEvent,
        setSelectedMapEvent,
        isMapStreaming,
        setIsMapStreaming,
        alerts,
        unreadAlertCount,
        updateAlertStatus,
        bulkUpdateAlerts,
        assets,
        addAsset,
        updateAssetStatus,
        deleteAsset,
        iocs,
        addIOC,
        updateIOCStatus,
        incidentReports,
        createIncidentReport,
        auditLogs,
        addAuditLog,
        settings,
        updateSettings,
        searchQuery,
        setSearchQuery,
        toasts,
        dismissToast,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
