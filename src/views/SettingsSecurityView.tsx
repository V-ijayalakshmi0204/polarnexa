import React from 'react';
import { useMission } from '../context/MissionContext';
import { UserRole } from '../types';
import {
  ShieldCheck,
  Lock,
  Key,
  Database,
  Server,
  Cpu,
  Layers,
  CheckCircle,
  XCircle,
  FileCode,
  Terminal,
} from 'lucide-react';

export const SettingsSecurityView: React.FC = () => {
  const { currentUserRole, setCurrentUserRole } = useMission();

  const rolePermissions: Record<
    UserRole,
    {
      level: string;
      canApproveRecovery: boolean;
      canDeclareIncident: boolean;
      canSimulateDisruption: boolean;
      canModifyManifest: boolean;
      canSyncOffline: boolean;
      canViewAudit: boolean;
    }
  > = {
    Admin: {
      level: 'Root Authority',
      canApproveRecovery: true,
      canDeclareIncident: true,
      canSimulateDisruption: true,
      canModifyManifest: true,
      canSyncOffline: true,
      canViewAudit: true,
    },
    'Mission Manager': {
      level: 'Command Decision',
      canApproveRecovery: true,
      canDeclareIncident: true,
      canSimulateDisruption: true,
      canModifyManifest: true,
      canSyncOffline: true,
      canViewAudit: true,
    },
    'Logistics Officer': {
      level: 'Fleet & Supply Authority',
      canApproveRecovery: false,
      canDeclareIncident: true,
      canSimulateDisruption: true,
      canModifyManifest: true,
      canSyncOffline: true,
      canViewAudit: true,
    },
    'Station Operator': {
      level: 'Field Habitat Operations',
      canApproveRecovery: false,
      canDeclareIncident: true,
      canSimulateDisruption: false,
      canModifyManifest: false,
      canSyncOffline: true,
      canViewAudit: true,
    },
    Scientist: {
      level: 'Research Sortie Read-Only',
      canApproveRecovery: false,
      canDeclareIncident: false,
      canSimulateDisruption: false,
      canModifyManifest: false,
      canSyncOffline: true,
      canViewAudit: false,
    },
    Auditor: {
      level: 'Cryptographic Compliance',
      canApproveRecovery: false,
      canDeclareIncident: false,
      canSimulateDisruption: false,
      canModifyManifest: false,
      canSyncOffline: false,
      canViewAudit: true,
    },
  };

  const currentPerms = rolePermissions[currentUserRole];

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span>GOVERNANCE & TRUST BOUNDARIES</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-700 font-semibold">RBAC & ARCHITECTURE SPEC</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Security & System Architecture
          </h1>
        </div>

        <span className="text-xs font-mono text-cyan-800 bg-cyan-50 border border-cyan-200 px-2.5 py-1 rounded">
          Active Role: {currentUserRole}
        </span>
      </div>

      {/* Role Selection & Permission Matrix */}
      <div className="bg-white rounded border border-slate-200 p-6 shadow-2xs space-y-5">
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Role-Based Access Control (RBAC) Matrix
            </h2>
            <p className="text-xs text-slate-500">
              Least-privilege operational authority for polar research stations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Switch Active Role:</span>
            <select
              value={currentUserRole}
              onChange={(e) => setCurrentUserRole(e.target.value as UserRole)}
              className="text-xs font-semibold border border-slate-300 rounded px-2.5 py-1 bg-slate-50"
            >
              {(Object.keys(rolePermissions) as UserRole[]).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-[11px] font-mono uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Expedition Role</th>
                <th className="py-2.5 px-3">Security Level</th>
                <th className="py-2.5 px-3 text-center">Approve Recovery</th>
                <th className="py-2.5 px-3 text-center">Declare Incident</th>
                <th className="py-2.5 px-3 text-center">Simulate Delay</th>
                <th className="py-2.5 px-3 text-center">Modify Cargo</th>
                <th className="py-2.5 px-3 text-center">Offline Sync</th>
                <th className="py-2.5 px-3 text-center">Audit Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {(Object.keys(rolePermissions) as UserRole[]).map((role) => {
                const p = rolePermissions[role];
                const isActive = currentUserRole === role;
                return (
                  <tr
                    key={role}
                    className={`transition-colors ${
                      isActive ? 'bg-cyan-50/80 font-bold' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <td className="py-3 px-3 font-sans font-semibold text-slate-900">
                      {role} {isActive && <span className="text-cyan-800 text-xs ml-1">(Active)</span>}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{p.level}</td>
                    <td className="py-3 px-3 text-center">
                      {p.canApproveRecovery ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {p.canDeclareIncident ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {p.canSimulateDisruption ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {p.canModifyManifest ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {p.canSyncOffline ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {p.canViewAudit ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Production Technology Architecture Stack */}
      <div className="bg-slate-900 text-white rounded p-6 space-y-5">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Full-Stack Production Blueprint</h2>
            <p className="text-xs text-slate-400">
              Designed for SIH26062 enterprise deployment and future backend integration
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">Layered Architecture</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 font-bold text-cyan-300">
              <Layers className="w-4 h-4" />
              <span>Frontend & Offline Stage</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              <strong>React 19 + TypeScript + Tailwind CSS:</strong> High-density mission control
              interface. Uses IndexedDB and local storage with vector clocks for full offline
              store-and-forward operation.
            </p>
          </div>

          <div className="p-4 rounded bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 font-bold text-cyan-300">
              <Server className="w-4 h-4" />
              <span>Backend & Spatial DB</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              <strong>Python FastAPI + PostgreSQL + PostGIS:</strong> Spatial route calculation,
              sastrugi bathymetry layers, cryptographic Ed25519 signature validation, and immutable
              audit logging.
            </p>
          </div>

          <div className="p-4 rounded bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 font-bold text-cyan-300">
              <Cpu className="w-4 h-4" />
              <span>Constraint & Recovery Core</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              <strong>Google OR-Tools / Constraint Solver:</strong> Multi-attribute feasibility
              filtering (weather windows, fuel reserves, payload tonnages). Deterministic,
              explainable recovery synthesis for human approval.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
