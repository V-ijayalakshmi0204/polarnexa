import React from 'react';
import { useMission } from '../context/MissionContext';
import { UserRole, StationId } from '../types';
import {
  Compass,
  Wifi,
  WifiOff,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle,
  Clock,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentStation,
    selectedStationId,
    setSelectedStationId,
    currentUserRole,
    setCurrentUserRole,
    isOnline,
    setIsOnline,
    disruptionState,
    simulateCargoDelay,
    resetSimulation,
    startSIHDemo,
    isSIHDemoActive,
    setCurrentView,
  } = useMission();

  const roles: UserRole[] = [
    'Mission Manager',
    'Logistics Officer',
    'Station Operator',
    'Scientist',
    'Auditor',
    'Admin',
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Title Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded bg-slate-900 flex items-center justify-center text-cyan-400 group-hover:bg-slate-800 transition-colors">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-cyan-700 transition-colors">
                POLARNEX
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-mono text-cyan-700 font-medium">
                SIH26062
              </span>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-200 text-xs text-slate-500">
            <span>Antarctica Expedition 2026</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-600 font-medium">{currentStation.name}</span>
          </div>
        </div>

        {/* Zone 2: Navigation & Status Telemetry */}
        <div className="hidden md:flex items-center gap-3 text-xs">
          {/* Station Selector */}
          <div className="flex items-center rounded border border-slate-200 bg-slate-50 p-0.5">
            <button
              onClick={() => setSelectedStationId('maitri')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                selectedStationId === 'maitri'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Maitri Station
            </button>
            <button
              onClick={() => setSelectedStationId('bharati')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                selectedStationId === 'bharati'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bharati Station
            </button>
          </div>

          {/* Online / Offline Connectivity Toggle */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            title="Click to toggle simulated satellite connectivity"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono transition-colors ${
              isOnline
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span>ONLINE (SATCOM)</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                <span>OFFLINE (LOCAL QUEUE)</span>
              </>
            )}
          </button>

          {/* Operational Disruption Indicator */}
          {disruptionState.isSimulated && (
            <button
              onClick={() => setCurrentView('recovery-planner')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-medium transition-colors ${
                disruptionState.humanApproved
                  ? 'bg-cyan-50 border-cyan-200 text-cyan-800 hover:bg-cyan-100'
                  : 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse hover:bg-rose-100'
              }`}
            >
              {disruptionState.humanApproved ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-600" />
                  <span>C102 RECOVERED</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>C102 DELAYED (+12H)</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Zone 3: Primary Actions & User Role */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Disruption Trigger Button */}
          {!disruptionState.isSimulated ? (
            <button
              onClick={simulateCargoDelay}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded hover:bg-rose-100 transition-colors whitespace-nowrap"
              title="Simulate +12 hour cargo delay for C102 to trigger the Dependency-Aware Recovery Engine"
            >
              <Clock className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">SIMULATE</span> CARGO DELAY +12H
            </button>
          ) : (
            <button
              onClick={resetSimulation}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 rounded hover:bg-slate-200 transition-colors whitespace-nowrap"
              title="Reset simulated disruption back to nominal baseline"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Reset Baseline</span>
            </button>
          )}

          {/* SIH 2026 Guided Demo Button */}
          <button
            onClick={startSIHDemo}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
              isSIHDemoActive
                ? 'bg-cyan-700 text-white shadow-xs'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>SIH DEMO MODE</span>
          </button>

          {/* User Role Selector Dropdown */}
          <div className="relative group">
            <select
              value={currentUserRole}
              onChange={(e) => setCurrentUserRole(e.target.value as UserRole)}
              aria-label="Select User Role"
              className="appearance-none bg-slate-50 border border-slate-200 rounded pl-2.5 pr-7 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </header>
  );
};
