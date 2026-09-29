import React from 'react';
import { useMission } from '../context/MissionContext';
import {
  Boxes,
  TrendingDown,
  AlertTriangle,
  RotateCcw,
  Zap,
  Clock,
  CheckCircle,
  Fuel,
  Utensils,
  HeartPulse,
  Wrench,
  FlaskConical,
} from 'lucide-react';

export const InventoryManagementView: React.FC = () => {
  const { inventory, simulateConsumptionIncrease, disruptionState, currentStation } = useMission();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Fuel':
        return <Fuel className="w-4 h-4 text-cyan-700" />;
      case 'Food':
        return <Utensils className="w-4 h-4 text-amber-700" />;
      case 'Medical Supplies':
        return <HeartPulse className="w-4 h-4 text-rose-700" />;
      case 'Spare Parts':
        return <Wrench className="w-4 h-4 text-slate-700" />;
      case 'Scientific Consumables':
        return <FlaskConical className="w-4 h-4 text-cyan-800" />;
      default:
        return <Boxes className="w-4 h-4 text-slate-700" />;
    }
  };

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span>STATION LIFE-SUPPORT & CONSUMABLES</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-700 font-semibold">{currentStation.name.toUpperCase()}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Inventory Management
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-500 hidden md:inline-block">
            Prototype / Simulated Data
          </span>
          <button
            onClick={simulateConsumptionIncrease}
            className="flex items-center gap-2 px-3.5 py-2 bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 rounded text-xs font-bold transition-colors shadow-xs"
            title="Simulate severe cold wave and heating surge (+45% fuel consumption rate)"
          >
            <TrendingDown className="w-3.5 h-3.5 text-amber-700" />
            <span>SIMULATE CONSUMPTION INCREASE</span>
          </button>
        </div>
      </div>

      {/* Disruption Alert if Fuel is at Risk */}
      {disruptionState.isSimulated && !disruptionState.humanApproved && (
        <div className="p-4 rounded border border-rose-200 bg-rose-50/60 text-xs text-rose-950 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
            <div>
              <div className="font-bold text-rose-900 uppercase">
                Fuel Resupply Window Compromised (Cargo C102 Delayed +12h)
              </div>
              <p className="mt-0.5 leading-relaxed text-rose-800">
                Maitri Bulk Tank B resupply (+42,000 Liters) delayed. Without upstream recovery,
                reserve days drop toward critical winterization thresholds.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Category Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventory.map((item) => {
          const isAtRisk = item.stockoutRisk === 'Critical' || item.stockoutRisk === 'Moderate';
          return (
            <div
              key={item.id}
              className={`bg-white rounded border p-4 space-y-3 transition-colors ${
                item.stockoutRisk === 'Critical'
                  ? 'border-rose-300 shadow-2xs'
                  : item.stockoutRisk === 'Moderate'
                  ? 'border-amber-200'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2 font-semibold text-xs text-slate-900">
                  {getCategoryIcon(item.category)}
                  <span>{item.category}</span>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                    item.stockoutRisk === 'Critical'
                      ? 'bg-rose-50 border-rose-300 text-rose-700'
                      : item.stockoutRisk === 'Moderate'
                      ? 'bg-amber-50 border-amber-300 text-amber-700'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  }`}
                >
                  RISK: {item.stockoutRisk.toUpperCase()}
                </span>
              </div>

              <div>
                <div className="text-xs text-slate-500 font-medium">{item.name}</div>
                <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                  {item.currentStock.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-slate-500 uppercase">{item.unit}</span>
                </div>
              </div>

              {/* Progress to minimum stock */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>Safe Threshold: {item.minimumStock.toLocaleString()} {item.unit}</span>
                  <span>{item.forecastDaysRemaining} Days Left</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      item.stockoutRisk === 'Critical'
                        ? 'bg-rose-500'
                        : item.stockoutRisk === 'Moderate'
                        ? 'bg-amber-500'
                        : 'bg-cyan-600'
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(15, (item.currentStock / (item.minimumStock * 2)) * 100)
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Burn Rate:</span>
                  <span className="font-semibold text-slate-900">
                    {item.dailyConsumptionRate} {item.unit} / day
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Resupply:</span>
                  <span className="truncate max-w-[170px]">{item.nextResupplyEta}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Consumption Trend & Forecast Analytics Section */}
      <div className="bg-white rounded border border-slate-200 p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Station Polar Diesel Burn Rate & Depletion Trajectory
            </h3>
            <p className="text-xs text-slate-500">
              Comparison: Baseline Burn vs. Cold Surge vs. Delayed Resupply Influx
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-800 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded">
            Sensor Telemetry Calibrated
          </span>
        </div>

        {/* Clean Vector SVG Chart */}
        <div className="relative w-full h-56 bg-slate-50 rounded border border-slate-200 p-4 flex flex-col justify-between">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 700 180" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="30" x2="700" y2="30" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="0" y1="75" x2="700" y2="75" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="0" y1="120" x2="700" y2="120" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="0" y1="160" x2="700" y2="160" stroke="#cbd5e1" strokeWidth="1" />

            {/* Threshold Line: Minimum Reserve (25,000L) */}
            <line x1="0" y1="105" x2="700" y2="105" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="6 3" />
            <text x="560" y="100" fill="#e11d48" fontSize="10" fontFamily="monospace">
              MIN SAFE BUFFER: 25,000L
            </text>

            {/* Historical Curve (Blue Solid) */}
            <path
              d="M 20 40 L 90 48 L 160 55 L 230 63 L 300 72"
              fill="none"
              stroke="#0284c7"
              strokeWidth="2.5"
            />

            {/* Simulated Disruption Forecast Curve (Rose Dashed) */}
            <path
              d="M 300 72 L 380 92 L 460 115 L 540 138 L 620 158"
              fill="none"
              stroke="#e11d48"
              strokeWidth="2"
              strokeDasharray="5 4"
            />

            {/* Recovered Plan A Influx Curve (Cyan Dashed) */}
            <path
              d="M 300 72 L 380 84 L 420 50 L 520 62 L 620 74"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              strokeDasharray="4 3"
            />

            {/* Current Day Pin */}
            <circle cx="300" cy="72" r="5" fill="#0f172a" stroke="#ffffff" strokeWidth="2" />
            <text x="290" y="60" fill="#0f172a" fontSize="11" fontWeight="bold" fontFamily="monospace">
              NOW (T+0)
            </text>
          </svg>

          {/* Chart Legend */}
          <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-500 pt-2 border-t border-slate-200">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-sky-600 inline-block"></span> 30-Day Historical Trend
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-rose-600 border-dashed inline-block"></span> Unmitigated Disruption Curve
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-cyan-600 inline-block"></span> Plan A Air-Bridge Replenishment
              </span>
            </div>
            <span>Time Horizon: 45 Days</span>
          </div>
        </div>
      </div>
    </div>
  );
};
