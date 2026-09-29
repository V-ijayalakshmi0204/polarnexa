import React from 'react';
import { useMission } from '../context/MissionContext';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Boxes,
  Clock,
  Compass,
  FileCheck,
  GitBranch,
  Layers,
  Package,
  ShieldAlert,
  ShieldCheck,
  Truck,
  Users,
  Wrench,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const MissionControlView: React.FC = () => {
  const {
    missions,
    cargoList,
    inventory,
    assets,
    personnel,
    disruptionState,
    simulateCargoDelay,
    resetSimulation,
    setCurrentView,
    currentStation,
    setActiveScanCargo,
    startSIHDemo,
  } = useMission();

  // KPIs
  const activeMissionsCount = missions.filter((m) => m.status !== 'Completed').length;
  const cargoInTransitCount = cargoList.filter((c) => c.status === 'In Transit' || c.status === 'Delayed').length;
  const criticalInventoryCount = inventory.filter((i) => i.stockoutRisk === 'Critical' || i.stockoutRisk === 'Moderate').length;
  const assetsMaintenanceCount = assets.filter((a) => a.status === 'Requires Maintenance').length;
  const deployedPersonnelCount = personnel.filter((p) => p.status === 'Deployed' || p.status === 'On Mission').length;
  const activeAlertsCount = disruptionState.isSimulated
    ? (disruptionState.humanApproved ? 1 : 3)
    : 2;

  // Alerts
  const alerts = [
    ...(disruptionState.isSimulated && !disruptionState.humanApproved
      ? [
          {
            id: 'ALT-01',
            title: 'Cargo C102 delayed by 12 hours',
            desc: 'Traverse sled immobilized at KM-42. Upstream dependency for MISSION-024 compromised.',
            severity: 'CRITICAL' as const,
            actionView: 'recovery-planner',
            actionText: 'Open Recovery Planner',
          },
        ]
      : []),
    ...(disruptionState.isSimulated && !disruptionState.humanApproved
      ? [
          {
            id: 'ALT-02',
            title: 'Fuel inventory approaching critical buffer',
            desc: 'Deficit of 42,000L polar diesel reserve replenishment at Maitri Bulk Tank B.',
            severity: 'HIGH' as const,
            actionView: 'inventory',
            actionText: 'Inspect Fuel Reserves',
          },
        ]
      : []),
    {
      id: 'ALT-03',
      title: 'Asset A-204 requires maintenance',
      desc: 'Heavy Traverse Generator Sled Gen-4 alternator bearing vibration warning.',
      severity: 'MEDIUM' as const,
      actionView: 'cargo-assets',
      actionText: 'View Asset Health',
    },
    {
      id: 'ALT-04',
      title: 'Transport schedule updated',
      desc: 'Coastal Convoy T-01 waypoint checkpoint verified in Schirmacher sector.',
      severity: 'INFO' as const,
      actionView: 'cargo-assets',
      actionText: 'Track Fleet',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span>COMMAND CONSOLE</span>
            <span aria-hidden="true">·</span>
            <span>{currentStation.name.toUpperCase()}</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-700 font-semibold">SIMULATED POLAR OPERATIONS</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Expedition Mission Control
          </h1>
        </div>

        {/* Action button & Prototype Disclaimer */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono text-slate-500 hidden md:inline-block">
            Prototype / Simulated Data
          </span>

          {!disruptionState.isSimulated ? (
            <button
              onClick={simulateCargoDelay}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-300 rounded hover:bg-rose-100 transition-colors shadow-xs"
            >
              <Clock className="w-4 h-4 text-rose-600" />
              <span>SIMULATE CARGO DELAY +12 HOURS</span>
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('recovery-planner')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded transition-colors shadow-xs ${
                disruptionState.humanApproved
                  ? 'bg-cyan-700 text-white hover:bg-cyan-800'
                  : 'bg-rose-600 text-white hover:bg-rose-700 animate-pulse'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>
                {disruptionState.humanApproved
                  ? 'RECOVERY PLAN ACTIVE · VIEW DIGITAL TWIN'
                  : 'DISRUPTION ACTIVE · OPEN RECOVERY PLANNER'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Visual Workflow Breadcrumbs: Demonstrating the full SIH pipeline */}
      <div className="bg-white rounded border border-slate-200 p-4 shadow-2xs">
        <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold mb-2">
          End-to-End Decision Pipeline
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
          {[
            { label: '1. Cargo Delay', active: disruptionState.isSimulated, status: 'C102 +12h' },
            { label: '2. Impact Detect', active: disruptionState.propagationDetected, status: 'Cascade' },
            { label: '3. Dependency', active: disruptionState.propagationDetected, status: 'DAG Traversal' },
            { label: '4. Constraints', active: disruptionState.recoveryPlanGenerated, status: 'Weather/Fuel' },
            { label: '5. Plan Gen', active: disruptionState.recoveryPlanGenerated, status: '3 Candidate Plans' },
            { label: '6. Human Approval', active: disruptionState.humanApproved, status: disruptionState.humanApproved ? 'Authorized' : 'Pending' },
            { label: '7. State Sync', active: disruptionState.humanApproved, status: disruptionState.humanApproved ? 'Twin Updated' : 'Standby' },
            { label: '8. Audit Log', active: disruptionState.humanApproved, status: disruptionState.humanApproved ? 'EVT-1025' : 'EVT-1024' },
          ].map((step, idx) => (
            <div
              key={idx}
              className={`p-2 rounded border transition-colors flex flex-col justify-between ${
                step.active
                  ? 'bg-cyan-50/70 border-cyan-300 text-cyan-950 font-medium'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <div className="font-semibold text-[11px] truncate">{step.label}</div>
              <div className="text-[10px] font-mono text-cyan-800 mt-1">{step.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded border border-slate-200">
          <div className="text-slate-400 text-xs font-medium flex items-center justify-between mb-1">
            <span>Active Missions</span>
            <Activity className="w-4 h-4 text-cyan-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{activeMissionsCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">4 Scheduled / In Progress</div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200">
          <div className="text-slate-400 text-xs font-medium flex items-center justify-between mb-1">
            <span>Cargo In Transit</span>
            <Truck className="w-4 h-4 text-cyan-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{cargoInTransitCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {disruptionState.isSimulated ? (
              <span className="text-rose-600 font-semibold">1 Delayed (+12h)</span>
            ) : (
              'All On Schedule'
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200">
          <div className="text-slate-400 text-xs font-medium flex items-center justify-between mb-1">
            <span>Critical Inventory</span>
            <Boxes className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{criticalInventoryCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {disruptionState.isSimulated ? (
              <span className="text-rose-600 font-semibold">Polar Diesel at Risk</span>
            ) : (
              'Buffers Monitored'
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200">
          <div className="text-slate-400 text-xs font-medium flex items-center justify-between mb-1">
            <span>Maintenance Req</span>
            <Wrench className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{assetsMaintenanceCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Asset A-204 Generator</div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200">
          <div className="text-slate-400 text-xs font-medium flex items-center justify-between mb-1">
            <span>Personnel Deployed</span>
            <Users className="w-4 h-4 text-cyan-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{deployedPersonnelCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Vitals Nominal</div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200">
          <div className="text-slate-400 text-xs font-medium flex items-center justify-between mb-1">
            <span>Active Alerts</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{activeAlertsCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {disruptionState.isSimulated && !disruptionState.humanApproved
              ? 'Immediate Action Req'
              : 'Under Surveillance'}
          </div>
        </div>
      </div>

      {/* Main Grid: Mission Status & Alert Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Mission Status Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded border border-slate-200 p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Expedition Mission Status</h2>
                <p className="text-xs text-slate-500">
                  Real-time operational status across Maitri and Bharati scientific sorties
                </p>
              </div>
              <button
                onClick={() => setCurrentView('digital-twin')}
                className="text-xs text-cyan-800 hover:text-cyan-900 font-semibold flex items-center gap-1"
              >
                <span>Digital Twin View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Missions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-50 text-[11px] font-mono uppercase text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Mission ID</th>
                    <th className="py-2.5 px-3">Mission Name</th>
                    <th className="py-2.5 px-3">Station</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Personnel</th>
                    <th className="py-2.5 px-3">Readiness</th>
                    <th className="py-2.5 px-3">Risk Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {missions.map((mission) => {
                    const isTargetMission = mission.id === 'MISSION-024';
                    return (
                      <tr
                        key={mission.id}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          isTargetMission && disruptionState.isSimulated && !disruptionState.humanApproved
                            ? 'bg-rose-50/40'
                            : ''
                        }`}
                      >
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          {mission.id}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900">{mission.name}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            {mission.scientificObjective}
                          </div>
                        </td>
                        <td className="py-3 px-3 capitalize font-medium">{mission.stationId}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`font-semibold ${
                              mission.status === 'At Risk'
                                ? 'text-rose-600'
                                : mission.status === 'Recovered'
                                ? 'text-cyan-700 font-bold'
                                : mission.status === 'Ready'
                                ? 'text-emerald-700'
                                : 'text-slate-800'
                            }`}
                          >
                            ● {mission.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono">
                          {mission.personnelIds.length} Assigned
                        </td>
                        <td className="py-3 px-3 font-mono tabular-nums">
                          <div className="flex items-center gap-1.5">
                            <span>{mission.readinessPct}%</span>
                            <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  mission.readinessPct < 70 ? 'bg-rose-500' : 'bg-cyan-600'
                                }`}
                                style={{ width: `${mission.readinessPct}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`font-mono text-[11px] font-semibold ${
                              mission.riskLevel === 'High' || mission.riskLevel === 'Severe'
                                ? 'text-rose-700'
                                : 'text-slate-600'
                            }`}
                          >
                            {mission.riskLevel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Highlighted Recovery action for MISSION-024 */}
            {disruptionState.isSimulated && (
              <div className="mt-4 p-3.5 bg-slate-50 rounded border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-rose-100 flex items-center justify-center text-rose-700 shrink-0">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-xs">
                      Dependency Disruption: Cargo C102 → Fuel Reserve → MISSION-024
                    </div>
                    <div className="text-[11px] text-slate-600">
                      {disruptionState.humanApproved
                        ? `Recovery Plan ${disruptionState.selectedPlanId} executed. Mission M-024 restored to RECOVERED.`
                        : 'MISSION-024 departure window compromised. 3 recovery plans synthesized by constraint engine.'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentView('recovery-planner')}
                  className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shrink-0 transition-colors"
                >
                  {disruptionState.humanApproved ? 'View Recovery Details' : 'Open Recovery Engine'}
                </button>
              </div>
            )}
          </div>

          {/* Quick Cargo & Fleet Summary */}
          <div className="bg-white rounded border border-slate-200 p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Cargo & Convoy In-Transit Monitor</h3>
                <p className="text-xs text-slate-500">Live custody and cold-chain compliance</p>
              </div>
              <button
                onClick={() => setCurrentView('cargo-assets')}
                className="text-xs text-cyan-800 hover:text-cyan-900 font-semibold flex items-center gap-1"
              >
                <span>Full Asset Register</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cargoList.map((cargo) => (
                <div
                  key={cargo.id}
                  onClick={() => setActiveScanCargo(cargo)}
                  className={`p-3 rounded border text-xs cursor-pointer hover:border-cyan-400 transition-colors ${
                    cargo.id === 'C102' && disruptionState.isSimulated
                      ? 'border-rose-300 bg-rose-50/30'
                      : 'border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-slate-900">{cargo.id}</span>
                    <span
                      className={`font-semibold ${
                        cargo.status === 'Delayed'
                          ? 'text-rose-600'
                          : cargo.status === 'In Transit'
                          ? 'text-cyan-700'
                          : 'text-emerald-700'
                      }`}
                    >
                      {cargo.status}
                    </span>
                  </div>
                  <div className="font-medium text-slate-800 line-clamp-1 mb-1">
                    {cargo.description}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between font-mono">
                    <span>ETA: {cargo.eta}</span>
                    <span>{cargo.assignedTransportId}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Alert Center & Fast Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded border border-slate-200 p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">Alert Center</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {alerts.length} Active
              </span>
            </div>

            {/* Clickable alerts list */}
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => setCurrentView(alert.actionView)}
                  className="p-3 rounded border border-slate-200 hover:border-cyan-400 bg-slate-50/60 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span
                      className={`font-bold ${
                        alert.severity === 'CRITICAL'
                          ? 'text-rose-600'
                          : alert.severity === 'HIGH'
                          ? 'text-amber-600'
                          : 'text-slate-600'
                      }`}
                    >
                      [{alert.severity}]
                    </span>
                    <span className="text-slate-400 group-hover:text-cyan-700 font-sans font-medium flex items-center gap-0.5">
                      {alert.actionText} <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-cyan-800 transition-colors">
                    {alert.title}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    {alert.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Environmental Telemetry Card */}
          <div className="bg-slate-900 text-white rounded p-5">
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-2">
              Station Weather Telemetry
            </div>
            <div className="text-sm font-bold text-white mb-3">
              {currentStation.name}
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-800/80 p-2.5 rounded border border-slate-700">
                <div className="text-slate-400 text-[10px]">SURFACE TEMP</div>
                <div className="text-lg font-bold text-cyan-300">
                  {currentStation.climateStatus.tempC}°C
                </div>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded border border-slate-700">
                <div className="text-slate-400 text-[10px]">WIND SPEED</div>
                <div className="text-lg font-bold text-amber-300">
                  {currentStation.climateStatus.windKts} kts
                </div>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded border border-slate-700">
                <div className="text-slate-400 text-[10px]">VISIBILITY</div>
                <div className="text-lg font-bold text-white">
                  {currentStation.climateStatus.visibilityKm} km
                </div>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded border border-slate-700">
                <div className="text-slate-400 text-[10px]">READINESS</div>
                <div className="text-lg font-bold text-emerald-400">
                  {currentStation.operationalReadiness}%
                </div>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span>{currentStation.climateStatus.condition}</span>
              <button
                onClick={() => setCurrentView('gis-map')}
                className="text-cyan-400 hover:text-cyan-300 font-sans font-medium"
              >
                Inspect Map →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
