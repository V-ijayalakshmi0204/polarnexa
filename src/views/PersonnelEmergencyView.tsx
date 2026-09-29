import React from 'react';
import { useMission } from '../context/MissionContext';
import {
  Users,
  ShieldAlert,
  AlertTriangle,
  HeartPulse,
  Phone,
  Clock,
  CheckCircle,
  PlusCircle,
  Radio,
  FileCheck,
} from 'lucide-react';

export const PersonnelEmergencyView: React.FC = () => {
  const {
    personnel,
    incidents,
    setIsIncidentModalOpen,
    resolveIncident,
    currentStation,
  } = useMission();

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span>EXPEDITION SAFETY & TELEMEDICINE</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-700 font-semibold">{currentStation.name.toUpperCase()}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Personnel & Emergency Response
          </h1>
        </div>

        <button
          onClick={() => setIsIncidentModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold transition-colors shadow-xs"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>DECLARE INCIDENT</span>
        </button>
      </div>

      {/* Emergency Incidents Section */}
      {incidents.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center justify-between">
            <span>Active Incident Protocols ({incidents.length})</span>
            <span className="text-rose-600 animate-pulse">● SATCOM EMERGENCY NET OPEN</span>
          </div>

          <div className="space-y-3">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className="bg-rose-50/70 border border-rose-300 rounded p-4 text-xs space-y-2 shadow-2xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-rose-900">{inc.id}</span>
                    <span className="font-bold text-slate-900 text-sm">{inc.type}</span>
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-rose-600 text-white">
                      PRIORITY: {inc.priority}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">
                    Declared: {inc.declaredAt} by {inc.declaredBy}
                  </div>
                </div>

                <p className="text-slate-800 leading-relaxed">{inc.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px] pt-1">
                  <div>
                    <span className="text-slate-500">Location:</span>{' '}
                    <span className="font-semibold text-slate-800">{inc.location}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Affected Personnel:</span>{' '}
                    <span className="font-semibold text-slate-800">
                      {inc.affectedPersonnel.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-rose-200">
                  <div className="text-[11px] text-slate-600 font-mono">
                    <span className="text-slate-500">Required Resources:</span>{' '}
                    <span>{inc.requiredResources.join(' · ')}</span>
                  </div>
                  <button
                    onClick={() => resolveIncident(inc.id)}
                    className="px-2.5 py-1 rounded bg-white border border-rose-300 hover:bg-rose-100 text-rose-800 font-medium text-[11px] transition-colors"
                  >
                    Acknowledge / Standby
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personnel Roster Table */}
      <div className="bg-white rounded border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Station & Field Personnel Roster</h3>
            <p className="text-[11px] text-slate-500">Vitals telemetry and emergency routing</p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {personnel.length} Certified Expedition Personnel
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-mono uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Personnel Name</th>
                <th className="py-2.5 px-3">Role & Specialization</th>
                <th className="py-2.5 px-3">Station</th>
                <th className="py-2.5 px-3">Assigned Mission</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Last Vitals Check</th>
                <th className="py-2.5 px-3">Emergency Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {personnel.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-cyan-700" />
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-800">{p.role}</div>
                    <div className="text-[11px] text-slate-500">{p.specialization}</div>
                  </td>
                  <td className="py-3 px-3 capitalize font-medium">{p.stationId}</td>
                  <td className="py-3 px-3 font-mono font-medium text-slate-800">
                    {p.assignedMissionId || 'Station Support'}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-semibold ${
                        p.status === 'Emergency'
                          ? 'text-rose-600 font-bold'
                          : p.status === 'On Mission'
                          ? 'text-cyan-700 font-medium'
                          : 'text-emerald-700'
                      }`}
                    >
                      ● {p.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                    {p.lastVitalsCheck}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{p.emergencyContact}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
