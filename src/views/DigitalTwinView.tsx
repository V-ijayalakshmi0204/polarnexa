import React from 'react';
import { useMission } from '../context/MissionContext';
import {
  Layers,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Compass,
  Zap,
} from 'lucide-react';

export const DigitalTwinView: React.FC = () => {
  const {
    missions,
    cargoList,
    inventory,
    assets,
    transports,
    personnel,
    disruptionState,
    simulateCargoDelay,
    resetSimulation,
    approveRecoveryPlan,
    setCurrentView,
  } = useMission();

  const targetMission = missions.find((m) => m.id === 'MISSION-024') || missions[0];
  const targetCargo = cargoList.find((c) => c.id === 'C102') || cargoList[0];
  const targetFuel = inventory.find((i) => i.category === 'Fuel') || inventory[0];
  const targetTransport = transports.find((t) => t.id === 'T-02') || transports[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span>OPERATIONAL RECONCILIATION</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-700 font-semibold">SYNCHRONIZED TWIN MODEL</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Mission Digital Twin
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {!disruptionState.isSimulated ? (
            <button
              onClick={simulateCargoDelay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-50 border border-rose-300 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-colors shadow-xs"
            >
              <Clock className="w-3.5 h-3.5 text-rose-600" />
              <span>Simulate C102 Disruption (+12h)</span>
            </button>
          ) : (
            <button
              onClick={resetSimulation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset State</span>
            </button>
          )}
        </div>
      </div>

      {/* State Machine Pipeline */}
      <div className="bg-white rounded border border-slate-200 p-5 shadow-2xs">
        <div className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
          Operational State Lifecycle Transition
        </div>
        <p className="text-xs text-slate-600 mb-4">
          Tracking the propagation and resolution trajectory for Mission MISSION-024:
        </p>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[
            {
              phase: '1. NORMAL',
              label: 'Baseline Nominal',
              active: true,
              desc: 'Departure window confirmed; resupply en route.',
            },
            {
              phase: '2. DISRUPTION',
              label: 'Cargo C102 Delayed',
              active: disruptionState.isSimulated,
              desc: '+12h delay reported at KM-42 depot.',
            },
            {
              phase: '3. IMPACT',
              label: 'Mission AT RISK',
              active: disruptionState.propagationDetected,
              desc: 'Fuel buffer depleted; convoy stalled.',
            },
            {
              phase: '4. RECOVERY',
              label: 'Constraint Solve',
              active: disruptionState.recoveryPlanGenerated,
              desc: '3 Candidate plans filtered by safety rules.',
            },
            {
              phase: '5. APPROVAL',
              label: 'Human Authorized',
              active: disruptionState.humanApproved,
              desc: 'Mission Manager signs Plan A execution.',
            },
            {
              phase: '6. UPDATED STATE',
              label: 'RECOVERED',
              active: disruptionState.humanApproved,
              desc: 'Twin synchronized across all stations.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded border text-xs flex flex-col justify-between transition-all ${
                item.active
                  ? 'bg-cyan-50/80 border-cyan-400 text-cyan-950 font-medium shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <div>
                <div className="font-mono text-[10px] text-cyan-800 font-bold mb-0.5">
                  {item.phase}
                </div>
                <div className="font-bold text-slate-900 text-xs mb-1">{item.label}</div>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Domain Entity Synchronizer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Node 1: Mission M-024 */}
        <div className="bg-white rounded border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">
              Mission Node
            </span>
            <span
              className={`text-xs font-bold font-mono px-2 py-0.5 rounded border ${
                targetMission.status === 'At Risk'
                  ? 'bg-rose-50 border-rose-300 text-rose-700'
                  : targetMission.status === 'Recovered'
                  ? 'bg-cyan-50 border-cyan-300 text-cyan-800'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800'
              }`}
            >
              {targetMission.status.toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm">{targetMission.id}</div>
            <div className="text-xs text-slate-500 font-medium">{targetMission.name}</div>
          </div>
          <div className="text-xs space-y-1 text-slate-600 font-mono">
            <div className="flex justify-between">
              <span>Readiness:</span>
              <span className="font-bold text-slate-900">{targetMission.readinessPct}%</span>
            </div>
            <div className="flex justify-between">
              <span>Scheduled Window:</span>
              <span>{targetMission.scheduledDeparture}</span>
            </div>
            <div className="flex justify-between">
              <span>Station:</span>
              <span className="capitalize">{targetMission.stationId}</span>
            </div>
          </div>
        </div>

        {/* Node 2: Cargo C102 */}
        <div className="bg-white rounded border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">
              Cargo Node
            </span>
            <span
              className={`text-xs font-bold font-mono px-2 py-0.5 rounded border ${
                targetCargo.status === 'Delayed'
                  ? 'bg-rose-50 border-rose-300 text-rose-700'
                  : 'bg-cyan-50 border-cyan-300 text-cyan-800'
              }`}
            >
              {targetCargo.status.toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm">{targetCargo.id}</div>
            <div className="text-xs text-slate-500 line-clamp-1">{targetCargo.description}</div>
          </div>
          <div className="text-xs space-y-1 text-slate-600 font-mono">
            <div className="flex justify-between">
              <span>Current ETA:</span>
              <span className="font-bold text-slate-900">{targetCargo.eta}</span>
            </div>
            <div className="flex justify-between">
              <span>Payload:</span>
              <span>{targetCargo.weightKg.toLocaleString()} kg</span>
            </div>
            <div className="flex justify-between">
              <span>Current Sector:</span>
              <span>KM-42 Depot</span>
            </div>
          </div>
        </div>

        {/* Node 3: Inventory Fuel */}
        <div className="bg-white rounded border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">
              Inventory Node
            </span>
            <span
              className={`text-xs font-bold font-mono px-2 py-0.5 rounded border ${
                targetFuel.stockoutRisk === 'Critical'
                  ? 'bg-rose-50 border-rose-300 text-rose-700'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800'
              }`}
            >
              RISK: {targetFuel.stockoutRisk.toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm">Polar Diesel Fuel</div>
            <div className="text-xs text-slate-500">Maitri Bulk Reservoir B</div>
          </div>
          <div className="text-xs space-y-1 text-slate-600 font-mono">
            <div className="flex justify-between">
              <span>Current Stock:</span>
              <span className="font-bold text-slate-900">
                {targetFuel.currentStock.toLocaleString()} L
              </span>
            </div>
            <div className="flex justify-between">
              <span>Min Reserve Buffer:</span>
              <span>{targetFuel.minimumStock.toLocaleString()} L</span>
            </div>
            <div className="flex justify-between">
              <span>Burn Rate:</span>
              <span>{targetFuel.dailyConsumptionRate} L/day</span>
            </div>
          </div>
        </div>

        {/* Node 4: Transport T-02 / T-03 */}
        <div className="bg-white rounded border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">
              Transport Fleet
            </span>
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded border bg-slate-50 border-slate-300 text-slate-800">
              {disruptionState.humanApproved ? 'AIR-BRIDGE ACTIVE' : 'GROUND CONVOY'}
            </span>
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm">
              {disruptionState.humanApproved ? 'T-03 Sky-3 Twin Otter' : 'T-02 Heavy Sled Bravo'}
            </div>
            <div className="text-xs text-slate-500">
              {disruptionState.humanApproved ? 'Aviation Air-Bridge' : 'Ground Traverse Sled'}
            </div>
          </div>
          <div className="text-xs space-y-1 text-slate-600 font-mono">
            <div className="flex justify-between">
              <span>Assignment:</span>
              <span className="font-bold text-slate-900">MISSION-024</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span>{disruptionState.humanApproved ? 'Air-lift Shuttle En Route' : targetTransport.status}</span>
            </div>
            <div className="flex justify-between">
              <span>Weather Tolerance:</span>
              <span>32 kts Crosswind</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Engine Provenance Card */}
      <div className="bg-white rounded border border-slate-200 p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Deterministic Recovery Engine State
            </h3>
            <p className="text-xs text-slate-500">
              Constraint reconciliation and mathematical solver outputs
            </p>
          </div>
          <button
            onClick={() => setCurrentView('recovery-planner')}
            className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            Review Recovery Alternatives →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded border border-slate-200">
            <div className="font-semibold text-slate-900 mb-1">Impact Traceability</div>
            <p className="text-slate-600 leading-relaxed">
              When Cargo C102 was delayed by +12h, the graph identified that MISSION-024 could not
              depart on time due to a fuel deficit.
            </p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded border border-slate-200">
            <div className="font-semibold text-slate-900 mb-1">Active Constraint Invariants</div>
            <p className="text-slate-600 leading-relaxed">
              Inbound Cat-3 blizzard at T+38h makes delaying departure by 48h (Plan B) strictly
              infeasible due to polar survival safety protocols.
            </p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded border border-slate-200">
            <div className="font-semibold text-slate-900 mb-1">Human Decision Point</div>
            <p className="text-slate-600 leading-relaxed">
              {disruptionState.humanApproved
                ? `Plan ${disruptionState.selectedPlanId} was formally approved. The twin state reflects active fuel airlift.`
                : 'Awaiting Mission Manager human authorization before modifying logistics routes.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
