import React from 'react';
import { useMission } from '../context/MissionContext';
import {
  BarChart3,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle,
  Activity,
  Layers,
  Cpu,
  Boxes,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span>BENCHMARKING & QUANTITATIVE RIGOR</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-700 font-semibold">SIH26062 PERFORMANCE TARGETS</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Expedition Logistics Analytics
          </h1>
        </div>

        <span className="text-xs font-mono text-cyan-800 bg-cyan-50 border border-cyan-200 px-2.5 py-1 rounded">
          Proposed Evaluation Metrics (Simulated Baseline)
        </span>
      </div>

      {/* Six Core Evaluation Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded border border-slate-200 space-y-1">
          <div className="text-[11px] font-mono text-slate-400">REPLANNING LATENCY</div>
          <div className="text-2xl font-bold font-mono text-slate-900">1.4 <span className="text-xs text-slate-500">sec</span></div>
          <div className="text-[10.5px] text-emerald-600 font-mono">Deterministic solve</div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200 space-y-1">
          <div className="text-[11px] font-mono text-slate-400">STOCKOUT LEAD TIME</div>
          <div className="text-2xl font-bold font-mono text-slate-900">72.0 <span className="text-xs text-slate-500">hrs</span></div>
          <div className="text-[10.5px] text-cyan-800 font-mono">Advance warning</div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200 space-y-1">
          <div className="text-[11px] font-mono text-slate-400">CARGO TRACEABILITY</div>
          <div className="text-2xl font-bold font-mono text-slate-900">100 <span className="text-xs text-slate-500">%</span></div>
          <div className="text-[10.5px] text-emerald-600 font-mono">Cryptographic tags</div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200 space-y-1">
          <div className="text-[11px] font-mono text-slate-400">OFFLINE SYNC RATE</div>
          <div className="text-2xl font-bold font-mono text-slate-900">99.4 <span className="text-xs text-slate-500">%</span></div>
          <div className="text-[10.5px] text-emerald-600 font-mono">Conflict resolution</div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200 space-y-1">
          <div className="text-[11px] font-mono text-slate-400">PLAN FEASIBILITY</div>
          <div className="text-2xl font-bold font-mono text-slate-900">86.7 <span className="text-xs text-slate-500">%</span></div>
          <div className="text-[10.5px] text-cyan-800 font-mono">Constraint filtered</div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200 space-y-1">
          <div className="text-[11px] font-mono text-slate-400">CONFLICT RATE</div>
          <div className="text-2xl font-bold font-mono text-slate-900">3.1 <span className="text-xs text-slate-500">%</span></div>
          <div className="text-[10.5px] text-slate-500 font-mono">Reconciled via clocks</div>
        </div>
      </div>

      {/* Visual Scientific SVG Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Replanning Latency vs Node Scale */}
        <div className="bg-white rounded border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Optimization Engine Replanning Latency
              </h3>
              <p className="text-[11px] text-slate-500">Constraint satisfaction latency under graph scale</p>
            </div>
            <span className="text-[10px] font-mono text-slate-400">O(V + E) Complexity</span>
          </div>

          <div className="h-52 bg-slate-50 rounded border border-slate-200 p-3 flex flex-col justify-between">
            <svg className="w-full h-full" viewBox="0 0 450 140">
              <line x1="40" y1="20" x2="420" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
              <line x1="40" y1="60" x2="420" y2="60" stroke="#e2e8f0" strokeDasharray="3 3" />
              <line x1="40" y1="100" x2="420" y2="100" stroke="#e2e8f0" strokeDasharray="3 3" />
              <line x1="40" y1="120" x2="420" y2="120" stroke="#94a3b8" />

              <path
                d="M 50 115 L 120 110 L 200 98 L 280 82 L 360 55 L 410 32"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.5"
              />
              <circle cx="200" cy="98" r="4" fill="#0f172a" />
              <text x="210" y="94" fill="#0f172a" fontSize="9" fontFamily="monospace">Current (1.4s @ 120 Nodes)</text>
            </svg>
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>20 Nodes</span>
              <span>80 Nodes</span>
              <span>150 Nodes</span>
              <span>300 Nodes</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Spider / Radar Chart for Expedition System Readiness */}
        <div className="bg-white rounded border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Polar Expedition Operational Resilience Radar
              </h3>
              <p className="text-[11px] text-slate-500">Multi-attribute readiness across six polar axes</p>
            </div>
            <span className="text-[10px] font-mono text-cyan-800">Calibrated</span>
          </div>

          <div className="h-52 bg-slate-50 rounded border border-slate-200 p-2 flex items-center justify-center">
            <svg width="220" height="190" viewBox="-110 -95 220 190">
              {/* Concentric Hexagons */}
              <polygon points="0,-80 69,-40 69,40 0,80 -69,40 -69,-40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
              <polygon points="0,-50 43,-25 43,25 0,50 -43,25 -43,-25" fill="none" stroke="#e2e8f0" strokeWidth="1" />
              <polygon points="0,-25 21,-12 21,12 0,25 -21,12 -21,-12" fill="none" stroke="#e2e8f0" strokeWidth="1" />

              {/* Data Polygon */}
              <polygon
                points="0,-72 62,-35 55,32 0,68 -58,35 -52,-32"
                fill="rgba(6, 182, 212, 0.25)"
                stroke="#0891b2"
                strokeWidth="2"
              />

              {/* Labels */}
              <text x="0" y="-85" textAnchor="middle" fontSize="8" fill="#475569" fontFamily="monospace">Fuel Buffer</text>
              <text x="75" y="-40" textAnchor="start" fontSize="8" fill="#475569" fontFamily="monospace">Transport</text>
              <text x="75" y="45" textAnchor="start" fontSize="8" fill="#475569" fontFamily="monospace">Medical</text>
              <text x="0" y="93" textAnchor="middle" fontSize="8" fill="#475569" fontFamily="monospace">Satcom Sync</text>
              <text x="-75" y="45" textAnchor="end" fontSize="8" fill="#475569" fontFamily="monospace">Personnel</text>
              <text x="-75" y="-40" textAnchor="end" fontSize="8" fill="#475569" fontFamily="monospace">Machinery</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
