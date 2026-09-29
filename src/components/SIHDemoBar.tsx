import React from 'react';
import { useMission } from '../context/MissionContext';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  RotateCcw,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

export const SIH_DEMO_STEPS = [
  {
    step: 1,
    title: 'Normal Mission State',
    desc: 'Review baseline expedition status across Maitri and Bharati stations. All missions (M-021 through M-024) are nominal with planned fuel buffers.',
    actionLabel: 'Advance to Disruption',
  },
  {
    step: 2,
    title: 'Trigger Cargo C102 +12h Delay',
    desc: 'Simulate severe sastrugi obstacle delaying Cargo C102 (Polar Diesel) by 12 hours en route to Maitri.',
    actionLabel: 'Inject Disruption',
  },
  {
    step: 3,
    title: 'Impact Propagation Detection',
    desc: 'System automatically flags upstream disruption and detects cascade through digital twin nodes.',
    actionLabel: 'Inspect Impact Cascade',
  },
  {
    step: 4,
    title: 'Dependency Graph Visualization',
    desc: 'Visualize dynamic graph: Cargo C102 -> Fuel Reserve -> Mission M-024 -> Transport T-02 Convoy.',
    actionLabel: 'Analyze Graph Nodes',
  },
  {
    step: 5,
    title: 'Identify Affected Entities',
    desc: 'Inspect why Mission M-024 is at risk: departure window compromised, traverse convoy blocked without fuel.',
    actionLabel: 'Run Constraint Engine',
  },
  {
    step: 6,
    title: 'Apply Multi-Domain Constraints',
    desc: 'Constraint engine evaluates transport capacities, incoming blizzard forecast at T+38h, and station emergency reserves.',
    actionLabel: 'Generate Recovery Alternatives',
  },
  {
    step: 7,
    title: 'Generate Recovery Alternatives',
    desc: 'System synthesizes 3 candidate recovery plans (Plan A: Air-Bridge, Plan B: Reschedule, Plan C: Station Drawdown).',
    actionLabel: 'Compare Recovery Plans',
  },
  {
    step: 8,
    title: 'Compare Feasibility & Infeasibility',
    desc: 'Note Plan B is marked INFEASIBLE (blizzard violation). Plan A is optimal (score 94) and Plan C is secondary (score 79).',
    actionLabel: 'Request Human Approval',
  },
  {
    step: 9,
    title: 'Human-in-the-Loop Approval',
    desc: 'Safety requirement: System never acts autonomously. Human Mission Manager reviews and clicks APPROVE on Plan A.',
    actionLabel: 'Approve Plan A & Update State',
  },
  {
    step: 10,
    title: 'Mission State Updated to RECOVERED',
    desc: 'Digital twin synchronizes: Mission M-024 shifts to RECOVERED, Sky-3 Twin Otter aircraft assigned for fuel air-lift.',
    actionLabel: 'Simulate Offline Disconnection',
  },
  {
    step: 11,
    title: 'Simulate Satcom Disconnection',
    desc: 'Simulate extreme Antarctic katabatic storm knocking out satellite links. System transitions to offline mode.',
    actionLabel: 'Log Offline Field Action',
  },
  {
    step: 12,
    title: 'Create Offline Event (Store-and-Forward)',
    desc: 'Field engineer conducts local asset inspection or fuel sounding and queues it in encrypted local storage.',
    actionLabel: 'Restore Satcom Connectivity',
  },
  {
    step: 13,
    title: 'Restore Connectivity & Reconcile',
    desc: 'Communications restored. Store-and-forward engine begins vector clock reconciliation and signature validation.',
    actionLabel: 'Synchronize Local Queue',
  },
  {
    step: 14,
    title: 'Synchronize Events & Complete',
    desc: 'Queued operations successfully merged into central expedition state with zero data loss.',
    actionLabel: 'View Immutable Audit Trail',
  },
  {
    step: 15,
    title: 'Display Full Audit Trail & Provenance',
    desc: 'Inspect cryptographic provenance: Who, What, Why, Timestamp, and Recovery Rationale logged for SIH judging.',
    actionLabel: 'Finish SIH Demo',
  },
];

export const SIHDemoBar: React.FC = () => {
  const {
    isSIHDemoActive,
    sihStepIndex,
    stopSIHDemo,
    nextSIHStep,
    prevSIHStep,
    goToSIHStep,
    simulateCargoDelay,
    approveRecoveryPlan,
    disruptionState,
  } = useMission();

  if (!isSIHDemoActive) return null;

  const currentStepData = SIH_DEMO_STEPS[sihStepIndex];
  const progressPct = Math.round(((sihStepIndex + 1) / SIH_DEMO_STEPS.length) * 100);

  const handleActionClick = () => {
    if (sihStepIndex === 1 && !disruptionState.isSimulated) {
      simulateCargoDelay();
    } else if (sihStepIndex === 8 && !disruptionState.humanApproved) {
      approveRecoveryPlan('PLAN_A');
    }
    nextSIHStep();
  };

  return (
    <div className="bg-slate-900 text-white border-b border-cyan-800 shadow-md px-4 py-3 sticky top-16 z-30">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Step Indicator & Narrative */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-700 text-cyan-300 font-mono text-xs shrink-0">
            STEP {currentStepData.step} / {SIH_DEMO_STEPS.length}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-cyan-100">
                {currentStepData.title}
              </span>
              <span className="text-[11px] font-mono text-cyan-400">
                ({progressPct}% Complete)
              </span>
            </div>
            <p className="text-xs text-slate-300 line-clamp-1 max-w-2xl">
              {currentStepData.desc}
            </p>
          </div>
        </div>

        {/* Stepper Controls */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <button
            onClick={prevSIHStep}
            disabled={sihStepIndex === 0}
            className="p-1.5 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            title="Previous step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleActionClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>{currentStepData.actionLabel}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={stopSIHDemo}
            className="p-1.5 rounded bg-slate-800 border border-slate-700 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-colors ml-2"
            title="Exit SIH Demo Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-slate-800 h-1 mt-2.5 rounded-full overflow-hidden">
        <div
          className="bg-cyan-400 h-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        ></div>
      </div>
    </div>
  );
};
