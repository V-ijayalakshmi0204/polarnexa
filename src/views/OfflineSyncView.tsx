import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import {
  CloudOff,
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle,
  Database,
  ShieldCheck,
  PlusCircle,
  ArrowRight,
  Clock,
  Layers,
  Lock,
} from 'lucide-react';

export const OfflineSyncView: React.FC = () => {
  const {
    isOnline,
    setIsOnline,
    offlineQueue,
    addOfflineEvent,
    syncOfflineQueue,
    isSyncing,
    syncStep,
    currentStation,
  } = useMission();

  const [eventType, setEventType] = useState<'ASSET_INSPECTION' | 'CARGO_SCAN' | 'INVENTORY_COUNT'>(
    'ASSET_INSPECTION'
  );
  const [offlineNote, setOfflineNote] = useState<string>(
    'PistenBully 300 snowcat track pin torque verification complete (-45°C tolerance pass).'
  );

  const handleCreateOfflineEvent = (e: React.FormEvent) => {
    e.preventDefault();
    addOfflineEvent(eventType, {
      entityId: eventType === 'ASSET_INSPECTION' ? 'A-201' : 'INV-FUEL-01',
      description: offlineNote,
      inspectionResult: 'PASSED',
      measuredTempC: -31.2,
      cryptographicHash: `SHA256:${Math.random().toString(36).substring(2, 12)}`,
    });
  };

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span>STORE-AND-FORWARD RESILIENCE</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-700 font-semibold">LOCAL ENCRYPTED EVENT STORE</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Offline Synchronization Engine
          </h1>
        </div>

        {/* Connectivity Toggle Controls */}
        <div className="flex items-center gap-2">
          {isOnline ? (
            <button
              onClick={() => setIsOnline(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 rounded text-xs font-bold transition-colors shadow-xs"
            >
              <WifiOff className="w-3.5 h-3.5 text-amber-600" />
              <span>SIMULATE OFFLINE MODE</span>
            </button>
          ) : (
            <button
              onClick={() => setIsOnline(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-900 hover:bg-emerald-100 rounded text-xs font-bold transition-colors shadow-xs"
            >
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span>RESTORE CONNECTIVITY</span>
            </button>
          )}

          <button
            onClick={syncOfflineQueue}
            disabled={isSyncing || offlineQueue.length === 0}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded text-xs font-bold shadow-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'SYNCHRONIZING...' : 'SYNCHRONIZE QUEUE'}</span>
          </button>
        </div>
      </div>

      {/* Connectivity Status Banner */}
      <div
        className={`p-4 rounded border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
          isOnline
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : 'bg-amber-50 border-amber-300 text-amber-950'
        }`}
      >
        <div className="flex items-center gap-3">
          {isOnline ? (
            <div className="w-9 h-9 rounded bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <Wifi className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <WifiOff className="w-5 h-5" />
            </div>
          )}
          <div>
            <div className="font-bold text-sm">
              CONNECTIVITY STATUS: {isOnline ? 'ONLINE (SATCOM ACTIVE)' : 'OFFLINE (ISOLATED MODE)'}
            </div>
            <p className="text-[11px] opacity-90 mt-0.5">
              {isOnline
                ? 'Central mission ledger connected via Inmarsat / GSAT polar satellite relay.'
                : 'Satellite link disconnected. Local IndexedDB / LocalStorage queue actively recording field telemetry.'}
            </p>
          </div>
        </div>

        <div className="font-mono text-xs font-bold px-3 py-1 rounded bg-white/80 border border-current shrink-0">
          Pending Events: {offlineQueue.length}
        </div>
      </div>

      {/* Synchronizing 4-Stage Animation Box if syncing */}
      {isSyncing && (
        <div className="p-5 bg-slate-900 text-white rounded border border-cyan-800 shadow-md space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-400 font-bold">STORE-AND-FORWARD SYNCHRONIZATION IN PROGRESS</span>
            <span className="animate-spin text-cyan-300">⚙</span>
          </div>
          <div className="text-sm font-semibold text-white">{syncStep}</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-cyan-400 h-full w-2/3 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-4 gap-2 text-[10px] font-mono text-slate-400 pt-1">
            <span>1. Validate Events</span>
            <span>2. Vector Clocks</span>
            <span>3. Update State</span>
            <span>4. Commit Audit</span>
          </div>
        </div>
      )}

      {/* Visual Offline Architecture Pipeline */}
      <div className="bg-white rounded border border-slate-200 p-5 shadow-2xs">
        <div className="text-xs font-mono uppercase text-slate-400 font-bold mb-3">
          Resilience Architecture: Store-and-Forward Pattern
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs">
          {[
            { step: '1. Field Action', desc: 'Inspection or scan recorded without internet.' },
            { step: '2. Local Queue', desc: 'Persisted in browser LocalStorage / IndexedDB.' },
            { step: '3. Reconnection', desc: 'Satcom link detects carrier signal.' },
            { step: '4. Validation', desc: 'Cryptographic SHA-256 signatures verified.' },
            { step: '5. Reconciliation', desc: 'Vector clocks resolve state ordering.' },
            { step: '6. Immutable Audit', desc: 'Committed to permanent expedition ledger.' },
          ].map((s, idx) => (
            <div key={idx} className="p-3 rounded bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div className="font-mono text-[10px] font-bold text-cyan-800 mb-1">{s.step}</div>
              <p className="text-[11px] text-slate-600 leading-snug">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Local Event Queue & Event Generator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form: Record Offline Event (1 Col) */}
        <div className="bg-white rounded border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Log Local Field Action</h3>
            <p className="text-[11px] text-slate-500">
              Operations logged here enter the local queue even when completely offline
            </p>
          </div>

          <form onSubmit={handleCreateOfflineEvent} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Action Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as any)}
                className="w-full border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="ASSET_INSPECTION">Asset Field Inspection (PistenBully / Sled)</option>
                <option value="CARGO_SCAN">Cargo Barcode / QR Cold-Chain Audit</option>
                <option value="INVENTORY_COUNT">Physical Fuel Tank Sounding</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Observation Notes</label>
              <textarea
                rows={3}
                value={offlineNote}
                onChange={(e) => setOfflineNote(e.target.value)}
                className="w-full border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-cyan-400" />
              <span>Queue Field Action</span>
            </button>
          </form>
        </div>

        {/* Table: Pending Local Queue (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Local Queue Buffer</h3>
              <p className="text-[11px] text-slate-500">
                Encrypted items waiting for forward-sync ({offlineQueue.length})
              </p>
            </div>
            {offlineQueue.length > 0 && (
              <button
                onClick={syncOfflineQueue}
                disabled={isSyncing}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
              >
                Sync Now
              </button>
            )}
          </div>

          {offlineQueue.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-400">
              <CheckCircle className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
              <div className="font-semibold text-slate-700">Queue is Clean and Synchronized</div>
              <p className="mt-0.5">All local field entries have been committed to central ledger.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {offlineQueue.map((item) => (
                <div key={item.id} className="p-3.5 hover:bg-slate-50/60 transition-colors text-xs space-y-1">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="font-bold text-slate-900">{item.id}</span>
                    <span className="px-1.5 py-0.2 rounded bg-amber-50 border border-amber-200 text-amber-800 font-bold">
                      {item.status}
                    </span>
                  </div>
                  <div className="font-medium text-slate-800">{item.type}</div>
                  <p className="text-slate-600 text-[11px]">{item.payload.description}</p>
                  <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between pt-1">
                    <span>Officer: {item.author}</span>
                    <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
