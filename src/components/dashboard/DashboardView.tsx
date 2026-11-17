import React from 'react';
import { ShieldCheck, AlertTriangle, Monitor, Clock } from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';
import { KPICard } from './KPICard';
import { GlobalThreatMap } from './GlobalThreatMap';
import { ThreatActivity } from './ThreatActivity';
import { SecurityAnalyticsChart } from './SecurityAnalyticsChart';
import { ThreatDefenseRate } from './ThreatDefenseRate';
import { TopThreatTypes } from './TopThreatTypes';

export const DashboardView: React.FC = () => {
  const { kpis } = useSecurity();

  // Wave SVG paths matching the subtle curves in the screenshot:
  // Card 1: Green gentle ascending wave
  const greenWave = "M 0 30 Q 30 18, 60 26 T 120 22 T 180 14 T 240 28";
  // Card 2: Red double oscillation wave
  const redWave = "M 0 24 Q 40 34, 80 18 T 160 28 T 240 20";
  // Card 3: Blue crest wave
  const blueWave = "M 0 26 Q 50 14, 100 24 T 180 16 T 240 24";
  // Card 4: Purple smooth wave
  const purpleWave = "M 0 22 Q 45 28, 90 18 T 170 24 T 240 16";

  return (
    <div className="space-y-6 pb-8">
      {/* Row 1: The 4 KPI Cards matching screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard
          title="Security Health"
          value={`${kpis.securityHealth}%`}
          delta={kpis.securityHealthDelta}
          icon={ShieldCheck}
          variant="green"
          wavePath={greenWave}
        />
        <KPICard
          title="Threats Blocked"
          value={kpis.threatsBlocked.toString()}
          delta={kpis.threatsBlockedDelta}
          icon={AlertTriangle}
          variant="red"
          wavePath={redWave}
        />
        <KPICard
          title="Monitored Assets"
          value="12.4K"
          delta={kpis.monitoredAssetsDelta}
          icon={Monitor}
          variant="blue"
          wavePath={blueWave}
        />
        <KPICard
          title="Uptime"
          value={`${kpis.uptime}%`}
          delta={kpis.uptimeDelta}
          icon={Clock}
          variant="purple"
          wavePath={purpleWave}
        />
      </div>

      {/* Row 2: Global Threat Map (~65%) and Threat Activity (~35%) matching screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8">
          <GlobalThreatMap />
        </div>
        <div className="lg:col-span-4 flex flex-col">
          <ThreatActivity />
        </div>
      </div>

      {/* Row 3: Security Analytics (~50%), Threat Defense Rate (~25%), Top Threat Types (~25%) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6">
          <SecurityAnalyticsChart />
        </div>
        <div className="lg:col-span-3 flex flex-col">
          <ThreatDefenseRate />
        </div>
        <div className="lg:col-span-3 flex flex-col">
          <TopThreatTypes />
        </div>
      </div>
    </div>
  );
};
