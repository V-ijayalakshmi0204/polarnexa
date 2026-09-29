import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import { CargoItem, Asset, CargoStatus } from '../types';
import {
  Package,
  QrCode,
  Truck,
  Wrench,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Shield,
  Layers,
} from 'lucide-react';

export const CargoAssetTrackingView: React.FC = () => {
  const { cargoList, assets, setActiveScanCargo, disruptionState } = useMission();
  const [activeTab, setActiveTab] = useState<'cargo' | 'assets'>('cargo');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredCargo = cargoList.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.missionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredAssets = assets.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span>EXPEDITION ASSET INVENTORY</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-700 font-semibold">CUSTODY LEDGER</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Cargo & Asset Tracking
          </h1>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center rounded border border-slate-200 bg-slate-100 p-1">
          <button
            onClick={() => setActiveTab('cargo')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === 'cargo'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cargo Consignments ({cargoList.length})
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === 'assets'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Heavy Assets & Machinery ({assets.length})
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded border border-slate-200">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, category, mission..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs border-0 focus:outline-none placeholder:text-slate-400"
          />
        </div>

        {activeTab === 'cargo' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded px-2 py-1 bg-slate-50 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="In Transit">In Transit</option>
              <option value="Delayed">Delayed</option>
              <option value="At Station">At Station</option>
              <option value="Received">Received</option>
              <option value="Inspection Required">Inspection Required</option>
            </select>
          </div>
        )}
      </div>

      {/* Cargo Table */}
      {activeTab === 'cargo' ? (
        <div className="bg-white rounded border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-mono uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Cargo ID</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Origin → Destination</th>
                  <th className="py-2.5 px-3">Current Location</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Mission</th>
                  <th className="py-2.5 px-3">ETA</th>
                  <th className="py-2.5 px-3">Risk</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCargo.map((item) => {
                  const isDelayedC102 = item.id === 'C102' && disruptionState.isSimulated;
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isDelayedC102 ? 'bg-rose-50/40' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {item.id}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{item.description}</div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {item.weightKg.toLocaleString()} kg · Transport {item.assignedTransportId}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700">{item.category}</td>
                      <td className="py-3 px-3 text-[11px] text-slate-600">
                        <div>{item.origin}</div>
                        <div className="text-slate-400">→ {item.destination}</div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-cyan-600" />
                          <span>{item.currentLocation}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`font-semibold ${
                            item.status === 'Delayed'
                              ? 'text-rose-600 font-bold'
                              : item.status === 'In Transit'
                              ? 'text-cyan-700 font-medium'
                              : 'text-emerald-700'
                          }`}
                        >
                          ● {item.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-medium text-slate-800">
                        {item.missionId}
                      </td>
                      <td className="py-3 px-3 font-mono">{item.eta}</td>
                      <td className="py-3 px-3 font-mono font-semibold">
                        <span
                          className={
                            item.risk === 'High' || item.risk === 'Critical'
                              ? 'text-rose-600'
                              : 'text-slate-600'
                          }
                        >
                          {item.risk}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setActiveScanCargo(item)}
                          className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white font-medium text-[11px] transition-colors inline-flex items-center gap-1"
                        >
                          <QrCode className="w-3 h-3 text-cyan-400" />
                          <span>Scan QR</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Assets Table */
        <div className="bg-white rounded border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-mono uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Asset ID</th>
                  <th className="py-2.5 px-3">Equipment Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Station</th>
                  <th className="py-2.5 px-3">Operational Status</th>
                  <th className="py-2.5 px-3">Engine Hours</th>
                  <th className="py-2.5 px-3">Fuel / Charge</th>
                  <th className="py-2.5 px-3">Health Score</th>
                  <th className="py-2.5 px-3">Next Service</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      asset.status === 'Requires Maintenance' ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{asset.id}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{asset.name}</div>
                      {asset.criticalSpareNeeded && (
                        <div className="text-[11px] text-amber-800 font-mono mt-0.5">
                          Req: {asset.criticalSpareNeeded}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">{asset.category}</td>
                    <td className="py-3 px-3 capitalize">{asset.stationId}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-semibold ${
                          asset.status === 'Requires Maintenance'
                            ? 'text-amber-700 font-bold'
                            : 'text-emerald-700'
                        }`}
                      >
                        ● {asset.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums">
                      {asset.engineHours.toLocaleString()} hrs
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums">{asset.fuelLevelPct}%</td>
                    <td className="py-3 px-3 font-mono tabular-nums">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={asset.healthScore < 70 ? 'text-amber-700 font-bold' : 'text-slate-900'}
                        >
                          {asset.healthScore}/100
                        </span>
                        <div className="w-10 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              asset.healthScore < 70 ? 'bg-amber-500' : 'bg-emerald-600'
                            }`}
                            style={{ width: `${asset.healthScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                      {asset.nextScheduledService}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
