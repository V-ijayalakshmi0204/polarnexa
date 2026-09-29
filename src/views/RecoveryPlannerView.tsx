import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import { RecoveryPlan } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Fuel,
  Users,
  Layers,
  ArrowRight,
  FileCheck,
  RotateCcw,
  Sparkles,
  Check,
  X,
  Compass,
} from 'lucide-react';

export const RecoveryPlannerView: React.FC = () => {
  const {
    recoveryPlans,
    disruptionState,
    approveRecoveryPlan,
    rejectRecoveryPlan,
    simulateCargoDelay,
    resetSimulation,
    currentUserRole,
    setCurrentView,
  } = useMission();

  const [selectedPlanId, setSelectedPlanId] = useState<'PLAN_A' | 'PLAN_B' | 'PLAN_C'>('PLAN_A');
  const [isComparing, setIsComparing] = useState<boolean>(false);

  const activePlan = recoveryPlans.find((p) => p.id === selectedPlanId) || recoveryPlans[0];

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span>DETERMINISTIC CONSTRAINT ENGINE</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-700 font-semibold">RECOVERY PLAN SYNTHESIZER</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Recovery Planner & Constraint Engine
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {!disruptionState.isSimulated && (
            <button
              onClick={simulateCargoDelay}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-300 text-rose-700 hover:bg-rose-100 rounded text-xs font-bold transition-colors shadow-xs"
            >
              <Clock className="w-3.5 h-3.5 text-rose-600" />
              <span>Simulate C102 Disruption (+12h)</span>
            </button>
          )}

          <button
            onClick={() => setIsComparing(!isComparing)}
            className={`px-3 py-1.5 rounded border text-xs font-medium transition-colors ${
              isComparing
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {isComparing ? 'Close Matrix Comparison' : 'Compare All Plans'}
          </button>

          {disruptionState.humanApproved && (
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

      {/* Disruption Context Card */}
      <div className="bg-white rounded border border-slate-200 p-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-900">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
            <span>CURRENT DISRUPTION CONTEXT</span>
          </div>
          <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
            MISSION RISK: HIGH
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <span className="text-slate-400 block text-[10px]">TRIGGERING DISRUPTION</span>
            <span className="font-bold text-slate-900">Cargo C102 Delayed +12h</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">KM-42 Depot Sastrugi Rut</span>
          </div>
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <span className="text-slate-400 block text-[10px]">AFFECTED MISSION</span>
            <span className="font-bold text-slate-900">MISSION-024 (Queen Maud)</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Status: AT RISK (Readiness 62%)</span>
          </div>
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <span className="text-slate-400 block text-[10px]">SUPPLY DEFICIT</span>
            <span className="font-bold text-rose-600">-42,000L Polar Diesel Blend</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Traverse cannot launch without 24kL</span>
          </div>
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <span className="text-slate-400 block text-[10px]">CRITICAL INVARIANT</span>
            <span className="font-bold text-slate-900">Cat-3 Blizzard at T+38h</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Departure must occur &lt; 24h</span>
          </div>
        </div>
      </div>

      {/* Human Approval Required Banner */}
      <div
        className={`p-5 rounded border shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
          disruptionState.humanApproved
            ? 'bg-cyan-50/80 border-cyan-300 text-cyan-950'
            : 'bg-amber-50/80 border-amber-300 text-amber-950'
        }`}
      >
        <div className="flex items-start gap-3">
          {disruptionState.humanApproved ? (
            <ShieldCheck className="w-5 h-5 text-cyan-700 shrink-0 mt-0.5" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          )}
          <div>
            <div className="font-bold text-sm">
              {disruptionState.humanApproved
                ? `RECOVERY PLAN ${disruptionState.selectedPlanId} APPROVED BY HUMAN OPERATOR`
                : 'HUMAN APPROVAL REQUIRED (ZERO AUTONOMOUS EXECUTION)'}
            </div>
            <p className="text-xs mt-1 leading-relaxed opacity-90 max-w-2xl">
              {disruptionState.humanApproved
                ? `Operational state synchronized. Mission M-024 restored to RECOVERED. Audit event recorded under ${currentUserRole}.`
                : 'The system has synthesized candidate options and validated safety constraints. The final execution authorization strictly requires operator confirmation.'}
            </p>
          </div>
        </div>

        {/* Approval buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {!disruptionState.humanApproved ? (
            <>
              <button
                onClick={() => approveRecoveryPlan(selectedPlanId)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>APPROVE PLAN</span>
              </button>
              <button
                onClick={rejectRecoveryPlan}
                className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded transition-colors flex items-center gap-1"
              >
                <X className="w-4 h-4 text-rose-500" />
                <span>REJECT</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setCurrentView('digital-twin')}
              className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold rounded shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>View Updated Digital Twin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Side-by-Side Comparison Matrix Modal / Drawer if toggled */}
      {isComparing ? (
        <div className="bg-white rounded border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              Recovery Plans Multi-Attribute Comparison Matrix
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Evaluated against 7 Polar Mission Invariants
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-[11px] font-mono uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Evaluation Metric</th>
                  <th className="py-2.5 px-3">Plan A (Air-Bridge)</th>
                  <th className="py-2.5 px-3">Plan B (Reschedule +48h)</th>
                  <th className="py-2.5 px-3">Plan C (Station Drawdown)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-900">Feasibility Status</td>
                  <td className="py-3 px-3">
                    <span className="text-emerald-700 font-bold font-mono">FEASIBLE (Score 94)</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-rose-600 font-bold font-mono">INFEASIBLE (Score 32)</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-amber-700 font-bold font-mono">FEASIBLE (Score 79)</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-900">Expected Departure Delay</td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-700">+2.5 Hours</td>
                  <td className="py-3 px-3 font-mono font-bold text-rose-600">+48.0 Hours</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">+0.8 Hours</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-900">Weather Window Tolerance</td>
                  <td className="py-3 px-3 text-emerald-700">Departs 35h before blizzard</td>
                  <td className="py-3 px-3 text-rose-600 font-bold">FAILS: Intersects blizzard</td>
                  <td className="py-3 px-3 text-emerald-700">Departs 37h before blizzard</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-900">Fuel Expenditure Impact</td>
                  <td className="py-3 px-3">+8.4% aviation turbine penalty</td>
                  <td className="py-3 px-3">0% penalty (ground only)</td>
                  <td className="py-3 px-3">0% penalty (internal valves)</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-900">Station Life-Support Buffer</td>
                  <td className="py-3 px-3 text-emerald-700">Maintained at 48,200L</td>
                  <td className="py-3 px-3 text-emerald-700">Maintained at 48,200L</td>
                  <td className="py-3 px-3 text-amber-700 font-semibold">
                    Drops to 26,200L (Tight buffer)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-900">Scientific Objective Sync</td>
                  <td className="py-3 px-3 text-emerald-700">100% Sentinel-1 SAR sync</td>
                  <td className="py-3 px-3 text-rose-600">Lost satellite pass window</td>
                  <td className="py-3 px-3 text-emerald-700">100% Sentinel-1 SAR sync</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {/* Plan Selection Cards (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recoveryPlans.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          const isPlanApproved = disruptionState.humanApproved && disruptionState.selectedPlanId === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`bg-white rounded border p-5 cursor-pointer flex flex-col justify-between transition-all ${
                isSelected
                  ? 'border-cyan-500 shadow-md ring-1 ring-cyan-500'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                  <span className="font-mono text-xs font-bold text-slate-500">{plan.id}</span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      plan.feasibility === 'FEASIBLE'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-rose-50 border-rose-300 text-rose-700'
                    }`}
                  >
                    {plan.feasibility} (SCORE {plan.score})
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mb-1">{plan.title}</h3>
                <p className="text-xs text-slate-500 font-medium mb-3">{plan.strategy}</p>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{plan.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Delay:</span>
                  <span
                    className={`font-bold ${
                      plan.expectedDelayHours > 12 ? 'text-rose-600' : 'text-slate-900'
                    }`}
                  >
                    +{plan.expectedDelayHours} Hours
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Fuel Impact:</span>
                  <span>{plan.fuelImpactDescription}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk Level:</span>
                  <span
                    className={`font-semibold ${
                      plan.riskLevel === 'Severe'
                        ? 'text-rose-600'
                        : plan.riskLevel === 'Medium'
                        ? 'text-amber-700'
                        : 'text-emerald-700'
                    }`}
                  >
                    {plan.riskLevel}
                  </span>
                </div>

                {/* If approved indicator */}
                {isPlanApproved && (
                  <div className="mt-2 text-center text-xs font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 py-1 rounded">
                    ✓ ACTIVE AUTHORIZED PLAN
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Plan Deep-Dive & Constraint Engine Verification */}
      <div className="bg-white rounded border border-slate-200 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Constraint Engine Trace: {activePlan.title}
            </h3>
            <p className="text-xs text-slate-500">
              Verification results across transport capacity, fuel limits, weather windows, and safety rules
            </p>
          </div>
          <span
            className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
              activePlan.feasibility === 'FEASIBLE'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-rose-50 border-rose-300 text-rose-700'
            }`}
          >
            STATUS: {activePlan.feasibility}
          </span>
        </div>

        {/* If Infeasible reason banner */}
        {activePlan.feasibility === 'INFEASIBLE' && activePlan.infeasibilityReason && (
          <div className="p-4 rounded border border-rose-300 bg-rose-50 text-xs text-rose-950 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-rose-900 uppercase">
                Constraint Engine Rule Violation Detected
              </div>
              <p className="mt-0.5 leading-relaxed text-rose-800">
                {activePlan.infeasibilityReason}
              </p>
            </div>
          </div>
        )}

        {/* Constraints Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activePlan.constraintsEvaluated.map((c, i) => (
            <div
              key={i}
              className={`p-3 rounded border text-xs flex items-start gap-2.5 ${
                c.status === 'PASS'
                  ? 'bg-slate-50 border-slate-200'
                  : c.status === 'WARNING'
                  ? 'bg-amber-50/60 border-amber-200'
                  : 'bg-rose-50/60 border-rose-200'
              }`}
            >
              {c.status === 'PASS' ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : c.status === 'WARNING' ? (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 flex items-center justify-between">
                  <span>{c.name}</span>
                  <span
                    className={`font-mono text-[10px] font-bold ${
                      c.status === 'PASS'
                        ? 'text-emerald-700'
                        : c.status === 'WARNING'
                        ? 'text-amber-700'
                        : 'text-rose-700'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{c.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Decision Rationale */}
        <div className="p-4 bg-cyan-50/50 rounded border border-cyan-100 text-xs">
          <div className="font-bold text-cyan-950 mb-1">Algorithmic Decision Rationale</div>
          <p className="text-cyan-900 leading-relaxed">{activePlan.decisionRationale}</p>
        </div>
      </div>
    </div>
  );
};
