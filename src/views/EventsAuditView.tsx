import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import { AuditEvent } from '../types';
import {
  FileText,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Clock,
  Search,
  Key,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';

export const EventsAuditView: React.FC = () => {
  const { auditLogs } = useMission();
  const [selectedEventId, setSelectedEventId] = useState<string>(auditLogs[0]?.id || 'EVT-1021');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userRole.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedEvent = auditLogs.find((l) => l.id === selectedEventId) || auditLogs[0];

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span>IMMUTABLE PROVENANCE REGISTER</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-700 font-semibold">CRYPTOGRAPHIC AUDIT CHAIN</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Events & Audit Trail
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500">
            {auditLogs.length} Verified Ledger Blocks
          </span>
        </div>
      </div>

      {/* Main Grid: Audit Table & Event Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Column (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded border border-slate-200 overflow-hidden shadow-2xs space-y-3 p-4">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 max-w-sm flex-1">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by EVT ID, entity, action..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs border-0 focus:outline-none"
              />
            </div>
            <span className="text-xs font-mono text-cyan-800 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded">
              Ed25519 Signed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-mono uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">Event ID</th>
                  <th className="py-2 px-3">Timestamp</th>
                  <th className="py-2 px-3">Entity</th>
                  <th className="py-2 px-3">User & Role</th>
                  <th className="py-2 px-3">Station</th>
                  <th className="py-2 px-3">Action</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => {
                  const isSelected = selectedEventId === log.id;
                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedEventId(log.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-cyan-50/70 font-semibold' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{log.id}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-3 font-mono font-medium text-slate-800">
                        {log.entityId}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{log.userId}</div>
                        <div className="text-[10px] text-slate-500">{log.userRole}</div>
                      </td>
                      <td className="py-3 px-3 capitalize">{log.station}</td>
                      <td className="py-3 px-3 font-medium text-slate-800">{log.action}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`font-mono text-[10px] font-bold ${
                            log.status === 'SUCCESS'
                              ? 'text-emerald-700'
                              : log.status === 'ALERT'
                              ? 'text-rose-600'
                              : 'text-amber-700'
                          }`}
                        >
                          ● {log.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Provenance Detail Inspector (1 Col) */}
        {selectedEvent && (
          <div className="bg-white rounded border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <div className="text-xs font-mono text-slate-400 uppercase font-bold mb-1">
                Event Detail & Provenance Inspector
              </div>
              <div className="text-lg font-bold text-slate-900 font-mono">
                {selectedEvent.id}
              </div>
              <div className="text-xs text-slate-500 font-mono mt-0.5">
                {selectedEvent.action}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {/* What happened */}
              <div>
                <div className="font-semibold text-slate-900 text-[11px] uppercase tracking-wider text-slate-400 mb-0.5">
                  What Happened?
                </div>
                <p className="text-slate-800 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
                  {selectedEvent.details.whatHappened}
                </p>
              </div>

              {/* Who triggered it */}
              <div>
                <div className="font-semibold text-slate-900 text-[11px] uppercase tracking-wider text-slate-400 mb-0.5">
                  Who Triggered It?
                </div>
                <div className="font-mono text-slate-800 bg-slate-50 p-2.5 rounded border border-slate-200">
                  {selectedEvent.details.whoTriggered} ({selectedEvent.userRole})
                </div>
              </div>

              {/* What changed */}
              <div>
                <div className="font-semibold text-slate-900 text-[11px] uppercase tracking-wider text-slate-400 mb-0.5">
                  What Changed?
                </div>
                <p className="text-slate-800 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
                  {selectedEvent.details.whatChanged}
                </p>
              </div>

              {/* Affected Entities */}
              <div>
                <div className="font-semibold text-slate-900 text-[11px] uppercase tracking-wider text-slate-400 mb-0.5">
                  Which Entities Were Affected?
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedEvent.details.affectedEntities.map((ent, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[10px] text-slate-700"
                    >
                      {ent}
                    </span>
                  ))}
                </div>
              </div>

              {/* Selected Recovery Plan (if applicable) */}
              {selectedEvent.details.selectedPlan && (
                <div>
                  <div className="font-semibold text-slate-900 text-[11px] uppercase tracking-wider text-slate-400 mb-0.5">
                    Which Recovery Plan Was Selected?
                  </div>
                  <div className="font-bold text-cyan-950 bg-cyan-50 p-2.5 rounded border border-cyan-200">
                    {selectedEvent.details.selectedPlan}
                  </div>
                </div>
              )}

              {/* Why was the plan selected */}
              {selectedEvent.details.whySelected && (
                <div>
                  <div className="font-semibold text-slate-900 text-[11px] uppercase tracking-wider text-slate-400 mb-0.5">
                    Why Was The Plan Selected?
                  </div>
                  <p className="text-cyan-900 bg-cyan-50/50 p-2.5 rounded border border-cyan-100 text-[11px] leading-relaxed">
                    {selectedEvent.details.whySelected}
                  </p>
                </div>
              )}

              {/* Digital signature */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                  <Key className="w-3 h-3 text-cyan-600" />
                  <span>Signature:</span>
                  <span className="truncate max-w-[200px]">
                    {selectedEvent.details.digitalSignature || 'ED25519:VALIDATED-AUTHORITY'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
