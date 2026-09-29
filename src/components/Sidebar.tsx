import React from 'react';
import { useMission } from '../context/MissionContext';
import {
  LayoutDashboard,
  CalendarCheck,
  Package,
  Boxes,
  GitBranch,
  ShieldAlert,
  Users,
  MapPin,
  FileText,
  CloudOff,
  BarChart3,
  Settings,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, disruptionState, offlineQueue } = useMission();

  const navItems: NavItem[] = [
    { id: 'mission-control', label: '1. Mission Control', icon: LayoutDashboard },
    { id: 'digital-twin', label: 'Mission Digital Twin', icon: Layers, badge: 'Live Twin' },
    { id: 'expedition-planner', label: '2. Expedition Planner', icon: CalendarCheck },
    { id: 'cargo-assets', label: '3. Cargo & Asset Tracking', icon: Package },
    { id: 'inventory', label: '4. Inventory Management', icon: Boxes },
    {
      id: 'dependency-graph',
      label: '5. Dependency Graph',
      icon: GitBranch,
      badge: disruptionState.propagationDetected ? 'Cascade' : undefined,
      badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      id: 'recovery-planner',
      label: '6. Recovery Planner',
      icon: ShieldAlert,
      badge: disruptionState.isSimulated
        ? disruptionState.humanApproved
          ? 'Approved'
          : 'Action Req'
        : undefined,
      badgeColor: disruptionState.humanApproved
        ? 'text-cyan-700 bg-cyan-50 border-cyan-200'
        : 'text-rose-700 bg-rose-50 border-rose-200',
    },
    { id: 'personnel-emergency', label: '7. Personnel & Emergency', icon: Users },
    { id: 'gis-map', label: '8. GIS Mission Map', icon: MapPin },
    { id: 'events-audit', label: '9. Events & Audit', icon: FileText },
    {
      id: 'offline-sync',
      label: '10. Offline Sync',
      icon: CloudOff,
      badge: offlineQueue.length > 0 ? `${offlineQueue.length} Queue` : undefined,
      badgeColor: 'text-amber-800 bg-amber-50 border-amber-200',
    },
    { id: 'analytics', label: '11. Analytics', icon: BarChart3 },
    { id: 'settings', label: '12. Settings & Security', icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none overflow-y-auto">
      {/* Top Section Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
          Operations Console
        </div>
        <div className="text-sm font-semibold text-slate-800 flex items-center justify-between">
          <span>Antarctica Ops 2026</span>
          <span className="flex items-center gap-1 text-[11px] font-mono text-cyan-700 bg-cyan-50 border border-cyan-200 px-1.5 py-0.5 rounded">
            <Activity className="w-3 h-3 text-cyan-600" /> ACTIVE
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="p-2 space-y-0.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded transition-colors text-left ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${
                    isActive
                      ? 'bg-slate-800 text-cyan-200 border-slate-700'
                      : item.badgeColor || 'text-slate-600 bg-slate-100 border-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Prototype / Simulated Data Honest Notice */}
      <div className="p-3 m-3 bg-slate-50 border border-slate-200 rounded text-slate-600 text-[11px] leading-relaxed">
        <div className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
          Prototype / Simulated Data
        </div>
        <p className="text-slate-500 text-[10.5px]">
          Smart India Hackathon 2026 (SIH26062). Demonstrates deterministic constraint-checked recovery for polar missions.
        </p>
      </div>
    </aside>
  );
};
