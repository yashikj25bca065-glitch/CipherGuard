# CipherGuard — AI-Powered Cybersecurity Monitoring & Threat Detection Dashboard

![CipherGuard Banner](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-cyan.svg)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Tests-20%20Passed-emerald.svg)](tests/cipherguard_suite.test.mjs)
[![SRS](https://img.shields.io/badge/SRS-CG--SRS--001-purple.svg)]()

> **CipherGuard** is an enterprise-grade cybersecurity monitoring and threat detection dashboard. Engineered according to **IEEE Std 830-1998** and aligned with **ISO/IEC/IEEE 29148:2018**, it provides security operations teams (SecOps) with real-time perimeter defense visualization, geolocation threat tracking, automated IOC intelligence, and incident management.

---

## 🌟 Key Features & Dashboard Modules

### 1. Security Overview Dashboard (Module M2)
- **4 Real-Time KPI Cards**:
  - **Security Health**: `99.8%` (`↑ +0.2%`) with glowing emerald HUD gauge and dynamic risk penalties.
  - **Threats Blocked**: `247` (`↑ +12%`) with incident rate counters and automated firewall integration.
  - **Monitored Assets**: `12.4K` (`↑ +4%`) device infrastructure inventory.
  - **Uptime**: `99.99%` (`↑ +0.01%`) service heartbeat monitor.
- **Threat Defense Rate**: Dual circular concentric radar reticle with glowing emerald percentage readout.
- **Top Threat Types**: Donut chart breakdown covering *Malware (42%)*, *Phishing (33%)*, *Ransomware (15%)*, and *Others (10%)*.

### 2. Global Threat Map (Module M3)
- High-fidelity interactive dark cyber world map with geolocated threat origin markers.
- Animated Bezier attack arcs with moving laser dash pulses and dynamic severity color grading:
  - 🔴 **Critical** (`#ff2a5f`)
  - 🟠 **High** (`#ff8c00`)
  - 🔵 **Medium** (`#0070f3`)
  - 🟢 **Low** (`#00ff88`)
- Real-time event streaming controls (Pause / Resume / Filter by Severity).
- Telemetry drill-downs displaying Source IP, Country, ASN, Target Asset, and MITRE ATT&CK tactics.

### 3. Real-Time Threat Activity & Alerts (Module M5)
- Live activity stream tracking active perimeter threats (*Malicious IP Blocked*, *Suspicious Login Attempt*, *Phishing Attempt Detected*, *Threat Quarantined*).
- Comprehensive Alert Triage Queue with unread badge counter (`3`).
- **Alert Lifecycle State Machine**: `New` ➔ `Acknowledged` ➔ `Investigating` ➔ `Resolved` ➔ `False Positive`.
- Bulk operations (bulk acknowledge, bulk resolve) and investigation audit notes.

### 4. Threat Intelligence & IOC Registry (Module M4)
- **AbuseIPDB Integration Tool**: Live IP reputation queries with confidence scores (0–100%), report volumes, ISP, and host type.
- **VirusTotal Integration Tool**: File hash (SHA-256/MD5), URL, and domain reputation analysis with multi-engine detection ratios.
- Searchable and filterable **Indicator of Compromise (IOC)** database supporting *Blocklist*, *Watchlist*, and *Active* monitoring statuses.

### 5. Monitored Assets & CVE Tracking (Module M7)
- Infrastructure inventory tracking servers, firewalls, workstations, and Kubernetes clusters.
- Status tracking: `Online`, `Offline`, `Degraded`, and `Suspected Compromise`.
- **CVE Vulnerability Scoring**: Automated CVSS v3.1 severity classification (*Critical 9.0–10.0*, *High 7.0–8.9*, *Medium 4.0–6.9*, *Low 0.1–3.9*).
- Per-asset chronological activity timelines and CSV export.

### 6. Incident Reports & Append-Only Audit Logs (Modules M6 & M8)
- Security Incident Report builder pre-populating forensic evidence from linked alerts.
- **Immutable Append-Only Audit Trail (FR-039)**: Complete audit logging of administrative and security events.
- Multi-format report export: **PDF**, **CSV**, and **JSON**.

### 7. Simulation Engine & Security Settings (Module M9)
- **FR-046 Persistent SIMULATED DATA Banner**: Clearly displays whether telemetry is synthetic or live.
- **Scenario Injector (FR-047)**:
  - *Normal Perimeter Activity*
  - *Brute Force Surge*
  - *APT Ransomware Campaign*
  - *Global DDoS Flood*
- Configurable event generation rate (1–20 events/min) and deterministic random seeds.

### 8. Role-Based Access Control (Module M1)
Strict enforcement of **SRS Table 3-1: Permission Matrix**:
- **Administrator**: Full privileges (system configuration, asset management, alert triage, reports).
- **Security Analyst**: Alert triage, asset creation/editing, report generation (system security settings restricted).
- **Viewer**: Read-only dashboard visualization and report exports.

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 (TypeScript)
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS with custom neon glassmorphism & cyber HUD utilities
- **Icons**: Lucide React
- **Test Suite**: Native Node Test Harness (`node:test`, `node:assert/strict`)

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ recommended, tested on Node v26)
- npm or pnpm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yashikj25bca065-glitch/CipherGuard.git
cd CipherGuard

# 2. Install dependencies
npm install

# 3. Start the local development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

---

## 🧪 Automated Test Suite

CipherGuard includes a comprehensive 20-test functional test suite verifying all 9 SRS modules:

```bash
npm test
```

### Test Coverage Highlights
- ✅ **TC-01 to TC-04**: Role-Based Access Control (Table 3-1) permission enforcement & role switching.
- ✅ **TC-05 to TC-07**: KPI calculations (99.8% health score, 247 threats, 12.4K assets, 99.99% uptime).
- ✅ **TC-08 to TC-10**: Global threat map coordinates, severity color mapping, and forensic telemetry drill-down.
- ✅ **TC-11 to TC-14**: AbuseIPDB, VirusTotal reputation lookups, and IOC database management.
- ✅ **TC-15 to TC-17**: Alert lifecycle status machine, bulk triage, and comment audit trails.
- ✅ **TC-18 & TC-19**: Incident report generation and append-only audit log immutability.
- ✅ **TC-20**: Asset status transitions and CVSS v3.1 vulnerability bands.

---

## 📄 License
MIT License. Built for enterprise cybersecurity demonstration and academic evaluation.
