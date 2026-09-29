import React from 'react';
import { useMission } from '../context/MissionContext';
import {
  Compass,
  ArrowRight,
  Sparkles,
  GitBranch,
  ShieldCheck,
  Cpu,
  Layers,
  CloudOff,
  Radio,
  FileCheck,
  CheckCircle2,
  Terminal,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, startSIHDemo } = useMission();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Navbar */}
      <nav className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-slate-900 flex items-center justify-center text-cyan-400">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900">POLARNEX</span>
              <span className="text-xs font-mono text-cyan-700 font-semibold">SIH26062</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={startSIHDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded text-cyan-900 bg-cyan-50 border border-cyan-200 hover:bg-cyan-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-700" />
              <span>SIH 3-MIN DEMO</span>
            </button>
            <button
              onClick={() => setCurrentView('mission-control')}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded text-white bg-slate-900 hover:bg-slate-800 transition-colors"
            >
              <span>Enter Mission Control</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-6 max-w-[1440px] mx-auto w-full">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyan-200 bg-cyan-50/70 text-cyan-900 text-xs font-mono font-medium">
            <span>SMART INDIA HACKATHON 2026</span>
            <span aria-hidden="true" className="text-cyan-400">·</span>
            <span>PROBLEM ID: SIH26062</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 text-balance leading-tight">
            From Logistics Tracking to <span className="text-cyan-700">Mission Intelligence.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto text-balance leading-relaxed">
            An offline-first decision-support platform for managing polar expedition missions,
            cargo, inventory, assets, personnel and disruption recovery in connectivity-limited
            environments.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentView('mission-control')}
              className="flex items-center gap-2 px-6 py-3 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm transition-all"
            >
              <span>ENTER MISSION CONTROL</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>
            <button
              onClick={startSIHDemo}
              className="flex items-center gap-2 px-6 py-3 rounded border border-cyan-300 bg-white hover:bg-cyan-50/60 text-cyan-950 font-semibold text-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-cyan-700" />
              <span>START SIH DEMO</span>
            </button>
          </div>

          {/* Prototype disclaimer */}
          <div className="text-xs text-slate-500 pt-2 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-600"></span>
            <span>Verified Prototype with Realistic Demonstration Data (Antarctica 2026)</span>
          </div>
        </div>

        {/* Hero Interactive Workflow Schematic Container */}
        <div className="mt-14 max-w-5xl mx-auto bg-white rounded border border-slate-200 shadow-sm p-6 lg:p-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div>
              <div className="text-xs font-mono uppercase text-slate-400">Core Demonstration Loop</div>
              <h2 className="text-base font-bold text-slate-900">
                The Dependency-Aware Disruption & Recovery Engine
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                Deterministic Constraint Logic
              </span>
            </div>
          </div>

          {/* Step Sequence Flow */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded border border-rose-200 bg-rose-50/40 relative">
              <div className="text-[11px] font-mono font-bold text-rose-700 mb-1">01. DISRUPTION</div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Cargo Delay</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cargo C102 (Polar Diesel) delayed by +12 hours due to sastrugi obstacle at KM-42.
              </p>
            </div>

            <div className="p-4 rounded border border-amber-200 bg-amber-50/40 relative">
              <div className="text-[11px] font-mono font-bold text-amber-800 mb-1">02. PROPAGATION</div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Impact Detection</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automatically identifies dependent nodes: Fuel Reserve, Transport T-02, and Mission M-024.
              </p>
            </div>

            <div className="p-4 rounded border border-cyan-200 bg-cyan-50/40 relative">
              <div className="text-[11px] font-mono font-bold text-cyan-800 mb-1">03. CONSTRAINTS</div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Recovery Options</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Filters weather windows, aircraft payload, fuel reserves. Marks Plan B INFEASIBLE.
              </p>
            </div>

            <div className="p-4 rounded border border-emerald-200 bg-emerald-50/40 relative">
              <div className="text-[11px] font-mono font-bold text-emerald-800 mb-1">04. APPROVAL</div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Human Decision</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Commander approves Plan A. Twin Otter deployed. Mission M-024 state updated to RECOVERED.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Three Major Capabilities: UNIFY, PROPAGATE, RESPOND */}
      <section className="py-16 bg-white border-y border-slate-200 px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-700 font-semibold mb-2">
              Architectural Pillars
            </h2>
            <h3 className="text-3xl font-bold text-slate-900">
              Engineered for Polar Mission Survival
            </h3>
            <p className="text-slate-600 text-sm mt-2">
              Standard ERP systems fail in polar conditions because entities cannot be tracked in isolation.
              POLARNEX links physical logistics with scientific schedules and human safety constraints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* UNIFY */}
            <div className="p-6 rounded border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-slate-900 text-cyan-400 flex items-center justify-center mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono uppercase font-bold text-slate-400 mb-1">Pillar 01</div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">UNIFY</h4>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Connect missions, cargo, inventory, assets and personnel in one operational platform.
                  Single source of truth between coastal berths, inland traverse convoys, and station laboratories.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200 text-xs font-mono text-slate-500 space-y-1">
                <div>· Maitri & Bharati Station Digital Twins</div>
                <div>· Rugged Cryptographic QR Asset Tagging</div>
                <div>· Multi-modal transport fleet tracking</div>
              </div>
            </div>

            {/* PROPAGATE */}
            <div className="p-6 rounded border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-slate-900 text-cyan-400 flex items-center justify-center mb-4">
                  <GitBranch className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono uppercase font-bold text-slate-400 mb-1">Pillar 02</div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">PROPAGATE</h4>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Understand how a single disruption cascades across dependent missions, resources, and scientific activities.
                  Traverses dependency graphs to predict bottlenecks before critical thresholds are breached.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200 text-xs font-mono text-slate-500 space-y-1">
                <div>· Upstream-to-downstream graph traversal</div>
                <div>· Real-time stockout forecast recalculation</div>
                <div>· Mission readiness degradation scoring</div>
              </div>
            </div>

            {/* RESPOND */}
            <div className="p-6 rounded border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-slate-900 text-cyan-400 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono uppercase font-bold text-slate-400 mb-1">Pillar 03</div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">RESPOND</h4>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Generate feasible recovery alternatives filtered against multi-variable polar constraints.
                  Keeps the human in the loop: transparent reasoning, zero black-box autonomy.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200 text-xs font-mono text-slate-500 space-y-1">
                <div>· Deterministic constraint verification engine</div>
                <div>· Feasibility & Infeasibility provenance</div>
                <div>· Human-authorized immutable audit record</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decision Logic & Formula Section */}
      <section className="py-16 px-6 max-w-[1440px] mx-auto w-full">
        <div className="bg-slate-900 text-white rounded p-8 sm:p-10">
          <div className="max-w-3xl">
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
              Decision Intelligence Core
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Mathematical Grounding of the POLARNEX Engine
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-8">
              Rather than ungrounded AI predictions, POLARNEX couples graph-theoretic dependency tracing
              with deterministic constraint-satisfaction:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded bg-slate-800/80 border border-slate-700">
              <div className="text-xs font-mono text-cyan-300 font-bold mb-1">DEPENDENCIES</div>
              <div className="text-sm font-semibold text-white mb-2">What breaks?</div>
              <p className="text-xs text-slate-400">
                Directed acyclic graph mappings connecting cargo shipments to inventory reserves, equipment, and traverses.
              </p>
            </div>

            <div className="p-4 rounded bg-slate-800/80 border border-slate-700">
              <div className="text-xs font-mono text-cyan-300 font-bold mb-1">CONSTRAINTS</div>
              <div className="text-sm font-semibold text-white mb-2">What is forbidden?</div>
              <p className="text-xs text-slate-400">
                Non-negotiable limits: runway wind thresholds, minimum station fuel buffer (25,000L), crew flight duty hours.
              </p>
            </div>

            <div className="p-4 rounded bg-slate-800/80 border border-slate-700">
              <div className="text-xs font-mono text-cyan-300 font-bold mb-1">OBJECTIVES</div>
              <div className="text-sm font-semibold text-white mb-2">What should improve?</div>
              <p className="text-xs text-slate-400">
                Minimize departure delay $\Delta t$, minimize aviation fuel penalty, maximize crew safety margin.
              </p>
            </div>

            <div className="p-4 rounded bg-slate-800/80 border border-slate-700">
              <div className="text-xs font-mono text-cyan-300 font-bold mb-1">PROVENANCE</div>
              <div className="text-sm font-semibold text-white mb-2">Why this plan?</div>
              <p className="text-xs text-slate-400">
                Every suggested plan logs explicit mathematical justification and why alternatives were rejected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 px-6 text-xs text-slate-500">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">POLARNEX</span>
            <span>·</span>
            <span>SIH26062 Prototype</span>
            <span>·</span>
            <span>Antarctica Expedition Logistics & Asset Management</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>Maitri (-70.76°S, 11.73°E)</span>
            <span>·</span>
            <span>Bharati (-69.41°S, 76.19°E)</span>
            <span>·</span>
            <span>Offline-First (Store & Forward)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
