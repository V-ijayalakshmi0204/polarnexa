import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import {
  CalendarCheck,
  CheckCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Users,
  Package,
  Wrench,
  Fuel,
  Truck,
  FlaskConical,
  Play,
  RotateCcw,
} from 'lucide-react';

export const ExpeditionPlannerView: React.FC = () => {
  const { currentStation, personnel, cargoList, assets, transports } = useMission();

  const [missionName, setMissionName] = useState<string>('Queen Maud Land Deep Glaciological Transect');
  const [station, setStation] = useState<string>('maitri');
  const [durationDays, setDurationDays] = useState<number>(14);
  const [selectedPersonnel, setSelectedPersonnel] = useState<string[]>([
    'Dr. Rajesh Sharma',
    'Priya Nair',
    'Tenzing Norbu',
  ]);
  const [selectedCargo, setSelectedCargo] = useState<string>('C102 (Polar Diesel 42,000L)');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('A-204 (Generator Sled Gen-4)');
  const [fuelAllocationLiters, setFuelAllocationLiters] = useState<number>(24000);
  const [transportType, setTransportType] = useState<string>('T-02 (Inland Heavy Sled Convoy Bravo)');
  const [scientificActivity, setScientificActivity] = useState<string>(
    'Ice sheet internal reflection radar sounding & GPS bedrock elevation measurement'
  );

  const [readinessResult, setReadinessResult] = useState<{
    cargo: { status: 'pass' | 'warning' | 'fail'; msg: string };
    personnel: { status: 'pass' | 'warning' | 'fail'; msg: string };
    fuel: { status: 'pass' | 'warning' | 'fail'; msg: string };
    equipment: { status: 'pass' | 'warning' | 'fail'; msg: string };
    transport: { status: 'pass' | 'warning' | 'fail'; msg: string };
    overallStatus: 'READY' | 'READY WITH WARNINGS' | 'NOT READY';
    overallPct: number;
  } | null>({
    cargo: { status: 'pass', msg: 'Cargo manifests verified. Cold-chain certified.' },
    personnel: { status: 'pass', msg: '3 specialists allocated. Vitals and medical clearances current.' },
    fuel: { status: 'pass', msg: '24,000L allocated. Range buffer: +35% above traverse baseline.' },
    equipment: {
      status: 'warning',
      msg: 'Asset A-204 Generator Sled requires alternator bearing servicing prior to departure.',
    },
    transport: { status: 'pass', msg: 'T-02 Sled Convoy hitch tested and winch certified.' },
    overallStatus: 'READY WITH WARNINGS',
    overallPct: 88,
  });

  const handleRunCheck = () => {
    // Deterministic constraint rules simulation
    const hasEquipmentWarning = selectedEquipment.includes('A-204');
    const isFuelSufficient = fuelAllocationLiters >= 18000;

    setReadinessResult({
      cargo: { status: 'pass', msg: 'Cargo manifest checked. Weight distribution within sled payload.' },
      personnel: {
        status: selectedPersonnel.length >= 2 ? 'pass' : 'warning',
        msg: `${selectedPersonnel.length} crew selected. Arctic field expedition safety quorum satisfied.`,
      },
      fuel: {
        status: isFuelSufficient ? 'pass' : 'fail',
        msg: isFuelSufficient
          ? `${fuelAllocationLiters.toLocaleString()}L allocated (Satisfies minimum 18,000L traverse rule).`
          : 'CRITICAL: Fuel allocation below mandatory safety reserve threshold.',
      },
      equipment: {
        status: hasEquipmentWarning ? 'warning' : 'pass',
        msg: hasEquipmentWarning
          ? 'Asset A-204 Generator Sled requires alternator bearing servicing prior to departure.'
          : 'All selected equipment nominal and Arctic certified.',
      },
      transport: { status: 'pass', msg: `${transportType} checked against route terrain sastrugi map.` },
      overallStatus: hasEquipmentWarning ? 'READY WITH WARNINGS' : isFuelSufficient ? 'READY' : 'NOT READY',
      overallPct: hasEquipmentWarning ? 88 : isFuelSufficient ? 98 : 54,
    });
  };

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span>PRE-MISSION RECONNAISSANCE</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-700 font-semibold">EXPEDITION ARCHITECT</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Expedition Planner
          </h1>
        </div>

        <button
          onClick={handleRunCheck}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded font-bold text-xs shadow-xs transition-colors"
        >
          <Play className="w-3.5 h-3.5 text-cyan-400" />
          <span>RUN READINESS CHECK</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded border border-slate-200 p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Expedition Sortie Parameters</h2>
            <p className="text-xs text-slate-500">
              Configure multi-domain resources for polar inland traverse or coastal field operations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Mission Name</label>
              <input
                type="text"
                value={missionName}
                onChange={(e) => setMissionName(e.target.value)}
                className="w-full border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Staging Research Station</label>
              <select
                value={station}
                onChange={(e) => setStation(e.target.value)}
                className="w-full border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="maitri">Maitri Research Station (Schirmacher Oasis)</option>
                <option value="bharati">Bharati Research Station (Larsemann Hills)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Planned Mission Duration</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                />
                <span className="text-xs font-mono text-slate-500">Days</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Primary Transport Convoy</label>
              <select
                value={transportType}
                onChange={(e) => setTransportType(e.target.value)}
                className="w-full border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="T-02 (Inland Heavy Sled Convoy Bravo)">
                  T-02 Inland Heavy Sled Convoy Bravo (45T Capacity)
                </option>
                <option value="T-01 (Sea-Ice Traverse Convoy Alpha)">
                  T-01 Sea-Ice Traverse Convoy Alpha (12T Capacity)
                </option>
                <option value="T-03 (Twin Otter Polar Aircraft Sky-3)">
                  T-03 Twin Otter Sky-3 Polar Air-Bridge (2.2T Capacity)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Cargo Consignments</label>
              <select
                value={selectedCargo}
                onChange={(e) => setSelectedCargo(e.target.value)}
                className="w-full border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="C102 (Polar Diesel 42,000L)">
                  Cargo C102: Polar Diesel 42,000L Blend
                </option>
                <option value="C101 (Core Drill Assembly)">
                  Cargo C101: Sub-Ice Electrothermal Core Drill
                </option>
                <option value="C103 (Cryogenic Dewars)">
                  Cargo C103: Cryogenic Nitrogen Dewars
                </option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Primary Equipment / Machinery</label>
              <select
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value)}
                className="w-full border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="A-204 (Generator Sled Gen-4)">
                  A-204 Heavy Traverse Generator Sled (Overdue service)
                </option>
                <option value="A-201 (PistenBully 300)">
                  A-201 PistenBully 300 Polar Tracked Snowcat
                </option>
                <option value="A-202 (Hägglunds BV206)">
                  A-202 Hägglunds BV206 All-Terrain Carrier
                </option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Dedicated Fuel Sled Allocation</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="1000"
                  value={fuelAllocationLiters}
                  onChange={(e) => setFuelAllocationLiters(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                />
                <span className="text-xs font-mono text-slate-500">Liters</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Assigned Crew Specialists</label>
              <input
                type="text"
                readOnly
                value={selectedPersonnel.join(', ')}
                className="w-full border border-slate-200 bg-slate-50 rounded p-2 text-xs text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Scientific Objective & Flight/Traverse Plan</label>
            <textarea
              rows={3}
              value={scientificActivity}
              onChange={(e) => setScientificActivity(e.target.value)}
              className="w-full border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
            ></textarea>
          </div>
        </div>

        {/* Readiness Results Column (1 Col) */}
        <div className="space-y-4">
          <div className="bg-white rounded border border-slate-200 p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Pre-Sortie Readiness Check</h3>
                <p className="text-[11px] text-slate-500">Automated multi-constraint validation</p>
              </div>
              <button
                onClick={handleRunCheck}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                title="Re-run check"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {readinessResult && (
              <div className="space-y-4 text-xs">
                {/* Overall status badge */}
                <div
                  className={`p-3 rounded border flex items-center justify-between ${
                    readinessResult.overallStatus === 'READY'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : readinessResult.overallStatus === 'READY WITH WARNINGS'
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}
                >
                  <div>
                    <div className="text-[10px] font-mono uppercase font-bold tracking-wider">
                      Overall Mission Readiness
                    </div>
                    <div className="text-sm font-bold mt-0.5">
                      {readinessResult.overallStatus}
                    </div>
                  </div>
                  <div className="text-xl font-bold font-mono">
                    {readinessResult.overallPct}%
                  </div>
                </div>

                {/* Sub-item check results */}
                <div className="space-y-2.5">
                  {/* Cargo */}
                  <div className="flex items-start gap-2.5 p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="font-bold text-emerald-600 mt-0.5">✓</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900">Cargo Allocation</div>
                      <div className="text-[11px] text-slate-500">{readinessResult.cargo.msg}</div>
                    </div>
                  </div>

                  {/* Personnel */}
                  <div className="flex items-start gap-2.5 p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="font-bold text-emerald-600 mt-0.5">✓</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900">Personnel Roster</div>
                      <div className="text-[11px] text-slate-500">{readinessResult.personnel.msg}</div>
                    </div>
                  </div>

                  {/* Fuel */}
                  <div className="flex items-start gap-2.5 p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="font-bold text-emerald-600 mt-0.5">✓</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900">Traverse Fuel Reserve</div>
                      <div className="text-[11px] text-slate-500">{readinessResult.fuel.msg}</div>
                    </div>
                  </div>

                  {/* Equipment */}
                  <div className="flex items-start gap-2.5 p-2 rounded bg-amber-50/60 border border-amber-200">
                    <span className="font-bold text-amber-600 mt-0.5">⚠</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900">Equipment Health</div>
                      <div className="text-[11px] text-amber-900">{readinessResult.equipment.msg}</div>
                    </div>
                  </div>

                  {/* Transport */}
                  <div className="flex items-start gap-2.5 p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="font-bold text-emerald-600 mt-0.5">✓</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900">Transport Fleet Match</div>
                      <div className="text-[11px] text-slate-500">{readinessResult.transport.msg}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
