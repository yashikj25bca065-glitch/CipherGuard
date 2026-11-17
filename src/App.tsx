import React from 'react';
import { SecurityProvider, useSecurity } from './context/SecurityContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/ToastContainer';
import { DashboardView } from './components/dashboard/DashboardView';
import { ThreatIntelView } from './components/threat-intel/ThreatIntelView';
import { AlertsView } from './components/alerts/AlertsView';
import { ReportsView } from './components/reports/ReportsView';
import { AssetsView } from './components/assets/AssetsView';
import { SettingsView } from './components/settings/SettingsView';

const MainLayout: React.FC = () => {
  const { activeTab } = useSecurity();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070b14] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Sidebar matching screenshot */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header matching screenshot */}
        <Header />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto px-6 py-6 md:px-8 relative z-10">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'threat-intel' && <ThreatIntelView />}
          {activeTab === 'alerts' && <AlertsView />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'assets' && <AssetsView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>

        {/* Global Toast Container */}
        <ToastContainer />
      </div>
    </div>
  );
};

export function App() {
  return (
    <SecurityProvider>
      <MainLayout />
    </SecurityProvider>
  );
}

export default App;
