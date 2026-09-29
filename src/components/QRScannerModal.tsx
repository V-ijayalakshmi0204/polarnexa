import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import { X, QrCode, CheckCircle, ShieldCheck, MapPin, Calendar, Clock, AlertTriangle } from 'lucide-react';

export const QRScannerModal: React.FC = () => {
  const { activeScanCargo, setActiveScanCargo, cargoList } = useMission();
  const [selectedCargoId, setSelectedCargoId] = useState<string>(
    activeScanCargo?.id || 'C102'
  );
  const [scanState, setScanState] = useState<'scanning' | 'verified'>('verified');

  if (!activeScanCargo) return null;

  const cargo = cargoList.find((c) => c.id === selectedCargoId) || activeScanCargo;

  const handleSimulateRescan = () => {
    setScanState('scanning');
    setTimeout(() => {
      setScanState('verified');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-cyan-600" />
            <span className="font-semibold text-sm text-slate-900">
              Polar Rugged Asset & Cargo QR Reader
            </span>
          </div>
          <button
            onClick={() => setActiveScanCargo(null)}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-slate-800 text-xs">
          {/* Simulated Scanner Viewfinder */}
          <div className="relative bg-slate-950 rounded p-4 text-cyan-400 font-mono flex flex-col items-center justify-center border border-slate-800 min-h-[160px] overflow-hidden">
            {scanState === 'scanning' ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-24 h-24 border-2 border-cyan-400/60 border-dashed rounded relative flex items-center justify-center animate-pulse">
                  <div className="w-full h-0.5 bg-cyan-400 absolute top-1/2 left-0 shadow-[0_0_8px_#06b6d4]"></div>
                </div>
                <span className="text-[11px] text-cyan-300">DECODING CRYPTOGRAPHIC MATRIX...</span>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center text-center">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-1">
                  <CheckCircle className="w-4 h-4" /> CRYPTOGRAPHIC TAG VERIFIED
                </div>
                <div className="text-[11px] text-slate-400 break-all max-w-md">
                  Payload: {cargo.qrPayload}
                </div>
                <div className="mt-2 text-[10px] text-cyan-400/80">
                  ECC Level: Polar-3 (High Redundancy) · Sastrugi Optical Correction: ACTIVE
                </div>
              </div>
            )}
          </div>

          {/* Quick Cargo Switcher for testing */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Select Cargo Tag:</span>
            <div className="flex items-center gap-1">
              {cargoList.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCargoId(c.id);
                    handleSimulateRescan();
                  }}
                  className={`px-2 py-1 rounded text-xs font-mono font-medium transition-colors ${
                    cargo.id === c.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c.id}
                </button>
              ))}
            </div>
          </div>

          {/* Cargo Details Grid */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded border border-slate-200">
            <div>
              <span className="text-slate-400 block text-[11px]">Description</span>
              <span className="font-semibold text-slate-900">{cargo.description}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Current Status</span>
              <span
                className={`font-semibold ${
                  cargo.status === 'Delayed'
                    ? 'text-rose-600'
                    : cargo.status === 'In Transit'
                    ? 'text-cyan-700'
                    : 'text-emerald-700'
                }`}
              >
                {cargo.status}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Weight & Category</span>
              <span className="font-medium text-slate-800">
                {cargo.weightKg.toLocaleString()} kg · {cargo.category}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Assigned Transport</span>
              <span className="font-medium text-slate-800">{cargo.assignedTransportId}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Current Location</span>
              <span className="font-medium text-slate-800 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-600" /> {cargo.currentLocation}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Assigned Mission Dependency</span>
              <span className="font-semibold text-slate-900">{cargo.missionId}</span>
            </div>
          </div>

          {/* Movement History */}
          <div>
            <div className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" /> Movement & Custody History
            </div>
            <div className="space-y-1.5 border-l-2 border-slate-200 pl-3">
              {cargo.movementHistory.map((h, i) => (
                <div key={i} className="relative pb-2">
                  <div className="text-[11px] font-mono text-slate-400">{h.timestamp}</div>
                  <div className="font-medium text-slate-800">{h.event}</div>
                  <div className="text-[11px] text-slate-500">
                    Location: {h.location} · Officer: {h.operator}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance & Cold Chain Info */}
          {cargo.maintenanceInfo && (
            <div className="p-3 bg-cyan-50/50 rounded border border-cyan-100">
              <div className="font-semibold text-cyan-950 mb-0.5">Cold-Chain & Integrity Specs</div>
              <p className="text-cyan-900 text-[11px] leading-relaxed">{cargo.maintenanceInfo}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
          <button
            onClick={() => setActiveScanCargo(null)}
            className="px-3 py-1.5 rounded border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Close Reader
          </button>
        </div>
      </div>
    </div>
  );
};
