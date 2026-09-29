import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import {
  GitBranch,
  AlertTriangle,
  CheckCircle,
  Clock,
  Layers,
  Info,
  RotateCcw,
  Zap,
  Activity,
  ArrowRight,
} from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  sublabel: string;
  type: 'Cargo' | 'Inventory' | 'Mission' | 'Asset' | 'Personnel' | 'Transport' | 'Scientific Activity';
  x: number;
  y: number;
  affected: boolean;
  whyAffected?: string;
  statusText: string;
}

interface GraphEdge {
  from: string;
  to: string;
  label: string;
  affected: boolean;
}

export const DependencyGraphView: React.FC = () => {
  const { disruptionState, simulateCargoDelay, resetSimulation, setCurrentView } = useMission();
  const [selectedNodeId, setSelectedNodeId] = useState<string>('cargo-c102');

  const isAffected = disruptionState.isSimulated && !disruptionState.humanApproved;

  const nodes: GraphNode[] = [
    {
      id: 'cargo-c102',
      label: 'Cargo C102',
      sublabel: 'Polar Diesel 42,000L',
      type: 'Cargo',
      x: 100,
      y: 190,
      affected: isAffected,
      whyAffected: 'Primary disruption source: Sastrugi mechanical stall at KM-42 causing +12h delay.',
      statusText: isAffected ? 'DELAYED (+12H)' : 'IN TRANSIT',
    },
    {
      id: 'inv-fuel',
      label: 'Fuel Supply',
      sublabel: 'Maitri Bulk Tank B',
      type: 'Inventory',
      x: 310,
      y: 190,
      affected: isAffected,
      whyAffected: 'Direct dependency: Maitri fuel buffer expected 42kL influx; replenishment window missed.',
      statusText: isAffected ? 'STOCK DEFICIT' : 'BUFFER NOMINAL',
    },
    {
      id: 'mission-024',
      label: 'Mission M-024',
      sublabel: 'Queen Maud Traverse',
      type: 'Mission',
      x: 520,
      y: 190,
      affected: isAffected,
      whyAffected: 'Mission departure requires 24,000L fuel reserve; cannot safely depart without resupply or air-bridge.',
      statusText: isAffected ? 'AT RISK' : disruptionState.humanApproved ? 'RECOVERED' : 'READY',
    },
    {
      id: 'transport-t02',
      label: 'Transport T-02',
      sublabel: 'Inland Sled Convoy Bravo',
      type: 'Transport',
      x: 730,
      y: 110,
      affected: isAffected,
      whyAffected: 'Heavy sled convoy idling in Maitri staging yard awaiting fuel manifold replenishment.',
      statusText: isAffected ? 'DELAYED' : 'STAGING',
    },
    {
      id: 'sci-radar',
      label: 'Glaciology Transect',
      sublabel: 'Radar Ice Sounding',
      type: 'Scientific Activity',
      x: 730,
      y: 270,
      affected: isAffected,
      whyAffected: 'Radar sounding synchronized with European Sentinel-1 SAR orbital satellite pass; window tight.',
      statusText: isAffected ? 'WINDOW SLIPPAGE' : 'SYNCHRONIZED',
    },
    {
      id: 'asset-a204',
      label: 'Asset A-204',
      sublabel: 'Generator Sled Gen-4',
      type: 'Asset',
      x: 520,
      y: 340,
      affected: false,
      whyAffected: 'Pre-existing mechanical vibration alert, independent of fuel delay.',
      statusText: 'MAINTENANCE REQ',
    },
    {
      id: 'personnel-norbu',
      label: 'Tenzing Norbu',
      sublabel: 'Traverse Scout Lead',
      type: 'Personnel',
      x: 310,
      y: 60,
      affected: isAffected,
      whyAffected: 'Crew rest schedule shifts if departure delayed into incoming low-pressure blizzard.',
      statusText: isAffected ? 'STANDBY' : 'DEPLOYED',
    },
  ];

  const edges: GraphEdge[] = [
    { from: 'cargo-c102', to: 'inv-fuel', label: 'Supplies (+42,000L)', affected: isAffected },
    { from: 'inv-fuel', to: 'mission-024', label: 'Fuels Traverse (24kL)', affected: isAffected },
    { from: 'mission-024', to: 'transport-t02', label: 'Assigned Fleet', affected: isAffected },
    { from: 'mission-024', to: 'sci-radar', label: 'Primary Objective', affected: isAffected },
    { from: 'asset-a204', to: 'mission-024', label: 'Power Equipment', affected: false },
    { from: 'personnel-norbu', to: 'mission-024', label: 'Route Navigator', affected: isAffected },
  ];

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span>GRAPH-THEORETIC IMPACT ANALYSIS</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-700 font-semibold">DIRECTED ACYCLIC GRAPH (DAG)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Dependency Graph Engine
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {!disruptionState.isSimulated ? (
            <button
              onClick={simulateCargoDelay}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-300 text-rose-700 hover:bg-rose-100 rounded text-xs font-bold transition-colors shadow-xs"
            >
              <Clock className="w-3.5 h-3.5 text-rose-600" />
              <span>Simulate C102 Delay (+12h)</span>
            </button>
          ) : (
            <button
              onClick={resetSimulation}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 rounded text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset State</span>
            </button>
          )}

          {disruptionState.isSimulated && (
            <button
              onClick={() => setCurrentView('recovery-planner')}
              className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded text-xs font-semibold shadow-xs transition-colors"
            >
              View Recovery Plans →
            </button>
          )}
        </div>
      </div>

      {/* Disruption Alert Banner */}
      {disruptionState.propagationDetected && !disruptionState.humanApproved && (
        <div className="p-4 rounded border border-rose-300 bg-rose-50/70 flex items-start justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-rose-900 uppercase">
                Impact Propagation Detected: 5 Dependent Nodes Compromised
              </div>
              <p className="text-rose-800 mt-0.5 leading-relaxed">
                Disruption originated at <strong>Cargo C102</strong> and propagated down through{' '}
                <strong>Fuel Supply</strong> to <strong>Mission M-024</strong>, impacting{' '}
                <strong>Transport T-02</strong> and <strong>Scientific Glaciological Radar</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Interactive Graph Canvas & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph Canvas (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded border border-slate-200 p-4 shadow-2xs relative flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-cyan-700" />
              <span className="text-xs font-bold text-slate-900">
                Interactive Multi-Domain Topology
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block"></span> Nominal
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> Disrupted Node
              </span>
            </div>
          </div>

          {/* SVG Canvas Area */}
          <div className="relative w-full h-[390px] bg-slate-950 rounded border border-slate-800 p-2 overflow-auto select-none">
            <svg className="w-full h-full min-w-[760px] min-h-[360px]" viewBox="0 0 850 400">
              {/* Background technical coordinate grid */}
              <defs>
                <pattern id="polarGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                </pattern>
                <marker
                  id="arrow-cyan"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
                </marker>
                <marker
                  id="arrow-rose"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
                </marker>
              </defs>
              <rect width="100%" height="100%" fill="url(#polarGrid)" />

              {/* Draw Edges */}
              {edges.map((edge, idx) => {
                const source = nodes.find((n) => n.id === edge.from)!;
                const target = nodes.find((n) => n.id === edge.to)!;
                return (
                  <g key={idx}>
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={edge.affected ? '#f43f5e' : '#38bdf8'}
                      strokeWidth={edge.affected ? 2.5 : 1.5}
                      strokeDasharray={edge.affected ? '5 3' : 'none'}
                      markerEnd={edge.affected ? 'url(#arrow-rose)' : 'url(#arrow-cyan)'}
                      className={edge.affected ? 'animate-pulse' : ''}
                    />
                    {/* Edge Label Pill */}
                    <rect
                      x={(source.x + target.x) / 2 - 45}
                      y={(source.y + target.y) / 2 - 9}
                      width="90"
                      height="16"
                      rx="3"
                      fill="#0f172a"
                      stroke={edge.affected ? '#e11d48' : '#334155'}
                      strokeWidth="1"
                    />
                    <text
                      x={(source.x + target.x) / 2}
                      y={(source.y + target.y) / 2 + 3}
                      fill={edge.affected ? '#fda4af' : '#94a3b8'}
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {edge.label}
                    </text>
                  </g>
                );
              })}

              {/* Draw Nodes */}
              {nodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className="cursor-pointer group"
                    transform={`translate(${node.x - 70}, ${node.y - 32})`}
                  >
                    {/* Outer Box */}
                    <rect
                      width="140"
                      height="64"
                      rx="4"
                      fill={node.affected ? '#2a0e17' : isSelected ? '#162b45' : '#0f172a'}
                      stroke={
                        node.affected
                          ? '#f43f5e'
                          : isSelected
                          ? '#38bdf8'
                          : '#334155'
                      }
                      strokeWidth={isSelected ? 2 : 1.5}
                      className="transition-all"
                    />

                    {/* Node Type Pill */}
                    <text
                      x="8"
                      y="16"
                      fill={node.affected ? '#fda4af' : '#38bdf8'}
                      fontSize="8.5"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      [{node.type.toUpperCase()}]
                    </text>

                    {/* Node Label */}
                    <text
                      x="8"
                      y="33"
                      fill="#ffffff"
                      fontSize="11"
                      fontFamily="system-ui, sans-serif"
                      fontWeight="bold"
                    >
                      {node.label}
                    </text>

                    {/* Sublabel */}
                    <text
                      x="8"
                      y="46"
                      fill="#94a3b8"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {node.sublabel}
                    </text>

                    {/* Status Badge */}
                    <text
                      x="8"
                      y="57"
                      fill={node.affected ? '#f43f5e' : '#10b981'}
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      ● {node.statusText}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="text-[11px] text-slate-500 pt-2 flex items-center justify-between font-mono">
            <span>Click any node in graph to inspect causal provenance.</span>
            <span>Deterministic DAG Resolution</span>
          </div>
        </div>

        {/* Node Inspector & Explanation Panel (1 Col) */}
        <div className="space-y-4">
          <div className="bg-white rounded border border-slate-200 p-5 shadow-2xs">
            <div className="text-xs font-mono uppercase text-slate-400 font-bold mb-1">
              Node Provenance Inspector
            </div>
            <div className="text-base font-bold text-slate-900 mb-1">
              {selectedNode.label}
            </div>
            <div className="text-xs font-mono text-cyan-800 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded inline-block mb-3">
              Entity: {selectedNode.type} · ID: {selectedNode.id}
            </div>

            {/* Why was this affected panel */}
            <div className="space-y-3 text-xs">
              <div
                className={`p-3 rounded border ${
                  selectedNode.affected
                    ? 'bg-rose-50 border-rose-200 text-rose-950'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-700" />
                  <span>Why was this affected?</span>
                </div>
                <p className="leading-relaxed text-[11px]">
                  {selectedNode.whyAffected ||
                    'Operates nominally. Upstream and downstream dependencies intact.'}
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Live Status:</span>
                  <span className="font-bold text-slate-900">{selectedNode.statusText}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cascade Depth:</span>
                  <span className="font-bold text-slate-900">
                    {selectedNode.id === 'cargo-c102'
                      ? 'Root (Depth 0)'
                      : selectedNode.id === 'inv-fuel'
                      ? 'Depth 1'
                      : selectedNode.id === 'mission-024'
                      ? 'Depth 2'
                      : 'Depth 3'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Recovery Interlock:</span>
                  <span className="text-cyan-800 font-bold">Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Logic Section */}
      <div className="bg-slate-900 text-white rounded p-6">
        <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">POLARNEX Decision Logic Matrix</h3>
            <p className="text-xs text-slate-400">
              Clear separation between disruption detection, constraint boundaries, and recovery formulation
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">SIH 2026 Core Innovation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-800/80 p-4 rounded border border-slate-700">
            <div className="text-xs font-mono text-cyan-300 font-bold mb-1">DEPENDENCIES</div>
            <div className="text-sm font-bold text-white mb-2">What breaks?</div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Identifies that Cargo C102 feeds Maitri Fuel Buffer which enables Mission M-024.
              When C102 breaks, all downstream nodes inherit delay and state risk.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded border border-slate-700">
            <div className="text-xs font-mono text-rose-300 font-bold mb-1">CONSTRAINTS</div>
            <div className="text-sm font-bold text-white mb-2">What is forbidden?</div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Rules that cannot be breached: Station minimum fuel reserve must not drop below 25,000L.
              Mission M-024 cannot depart into Cat-3 blizzard arriving at T+38h.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded border border-slate-700">
            <div className="text-xs font-mono text-emerald-300 font-bold mb-1">OBJECTIVES</div>
            <div className="text-sm font-bold text-white mb-2">What should improve?</div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Minimize mission schedule delay ($\Delta t \to \min$), protect human safety in extreme cold,
              and conserve aviation turbine fuel reserves.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded border border-slate-700">
            <div className="text-xs font-mono text-amber-300 font-bold mb-1">PROVENANCE</div>
            <div className="text-sm font-bold text-white mb-2">Why this plan?</div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Plan A is recommended because Twin Otter T-03 can air-lift fuel in 2.5 hours before the storm,
              preserving station ground reserves and ensuring 100% safety compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
