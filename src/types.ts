export type Role = 'Administrator' | 'Security Analyst' | 'Viewer';

export type ThreatSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

export type ThreatCategory = 
  | 'Malware'
  | 'Phishing'
  | 'Ransomware'
  | 'Brute Force'
  | 'Port Scan'
  | 'DDoS'
  | 'Unauthorised Access'
  | 'Data Exfiltration'
  | 'Others';

export type AlertStatus = 'New' | 'Acknowledged' | 'Investigating' | 'Resolved' | 'False Positive';

export type AssetStatus = 'Online' | 'Offline' | 'Degraded' | 'Suspected Compromise';

export interface ThreatActivityItem {
  id: string;
  title: string;
  subtitle: string;
  category: ThreatCategory;
  severity: ThreatSeverity;
  timestamp: string;
  rawTime: Date;
  ip?: string;
  country?: string;
  iconType: 'blocked' | 'login' | 'phishing' | 'quarantine' | 'ddos' | 'malware';
}

export interface ThreatMapArc {
  id: string;
  fromName: string;
  fromCoords: [number, number]; // [xPercent, yPercent] on map 0-100
  toName: string;
  toCoords: [number, number];
  severity: ThreatSeverity;
  type: string;
  ip: string;
  asn?: string;
  timestamp: string;
  isSimulated: boolean;
}

export interface Alert {
  id: string;
  ruleId: string;
  ruleName: string;
  severity: ThreatSeverity;
  priorityScore: number;
  category: ThreatCategory;
  status: AlertStatus;
  sourceIp: string;
  sourceCountry: string;
  sourceCity?: string;
  targetAsset: string;
  assetCriticality: number; // 1-5
  timestamp: string;
  rawTime: Date;
  occurrences: number;
  evidence: string;
  mitreTactic: string;
  mitreTechnique: string;
  assignedTo?: string;
  comments: { user: string; text: string; time: string }[];
}

export interface CVEItem {
  cveId: string;
  cvssScore: number;
  severity: ThreatSeverity;
  summary: string;
  status: 'Open' | 'Mitigated' | 'Accepted';
}

export interface Asset {
  id: string;
  hostname: string;
  ip: string;
  type: 'Server' | 'Firewall' | 'Workstation' | 'Database' | 'Cloud Container';
  os: string;
  owner: string;
  criticality: number; // 1-5
  status: AssetStatus;
  lastSeen: string;
  vulnerabilities: CVEItem[];
  timeline: { time: string; event: string; severity: ThreatSeverity }[];
}

export interface IOCItem {
  id: string;
  indicator: string;
  type: 'IP' | 'Domain' | 'URL' | 'Hash';
  severity: ThreatSeverity;
  confidenceScore: number; // 0-100
  reportCount: number;
  firstSeen: string;
  source: string;
  status: 'Active' | 'Watchlist' | 'Blocklist';
  notes: string;
}

export interface IncidentReport {
  id: string;
  title: string;
  summary: string;
  severity: ThreatSeverity;
  status: 'Open' | 'Contained' | 'Closed';
  impact: string;
  actionsTaken: string;
  createdBy: string;
  createdAt: string;
  linkedAlertIds: string[];
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  ip: string;
  timestamp: string;
  outcome: 'Success' | 'Denied' | 'Failed';
}

export interface SystemSettings {
  timeZone: string;
  defaultTimeRange: '1D' | '1W' | '1M' | '3M';
  visualEffectIntensity: 'High' | 'Medium' | 'Low';
  reducedMotion: boolean;
  emailNotifications: boolean;
  minSeverityAlert: ThreatSeverity;
  quietHours: boolean;
  sessionTimeoutMinutes: number;
  lockoutAttempts: number;
  dataMode: 'Simulation' | 'Live';
  simulationRate: number; // 1-20 events per min
  scenarioType: 'Normal Activity' | 'Brute Force Surge' | 'APT Ransomware Campaign' | 'Global DDoS Flood';
  randomSeed: string;
  apiKeyAbuseIPDB: string;
  apiKeyVirusTotal: string;
}
