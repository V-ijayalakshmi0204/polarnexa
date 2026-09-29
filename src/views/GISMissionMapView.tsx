import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import {
  MapPin,
  Navigation,
  Layers,
  Compass,
  Radio,
  Truck,
  Wind,
  ShieldAlert,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Info,
} from 'lucide-react';

interface MapFeature {
  id: string;
  name: string;
  type: 'Station' | 'Cargo Convoy' | 'Aircraft' | 'Mission Waypoint' | 'Hazard' | 'Fuel Cache';
  x: number; // percentage in SVG coordinate space
  y: number;
  status: string;
  coordinates: string;
  details: string;
}

export const GISMissionMapView: React.FC = () => {
  const { currentStation, disruptionState, cargoList, transports } = useMission();
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>('stn-maitri');
  const [activeLayers, setActiveLayers] = useState({
    routes: true,
    weather: true,
    assets: true,
    hazards: true,
  });

  const features: MapFeature[] = [
    {
      id: 'stn-maitri',
      name: 'Maitri Research Station',
      type: 'Station',
      x: 240,
      y: 190,
      status: 'Operational (Readiness 94%)',
      coordinates: '70.767° S, 11.733° E',
      details: 'Schirmacher Oasis inland ice station. Primary hub for MISSION-021 and MISSION-024.',
    },
    {
      id: 'stn-bharati',
      name: 'Bharati Research Station',
      type: 'Station',
      x: 710,
      y: 160,
      status: 'Operational (Readiness 98%)',
      coordinates: '69.407° S, 76.191° E',
      details: 'Larsemann Hills coastal station. Oceanographic telemetry & cold-chain staging.',
    },
    {
      id: 'convoy-c102',
      name: 'Cargo C102 (Convoy T-02)',
      type: 'Cargo Convoy',
      x: 180,
      y: 220,
      status: disruptionState.isSimulated ? 'DELAYED (+12H AT KM-42)' : 'EN ROUTE',
      coordinates: '70.420° S, 11.950° E',
      details: 'Heavy sled hauling 42,000L Arctic Diesel. Sastrugi obstacle sector.',
    },
    {
      id: 'air-t03',
      name: 'Twin Otter Sky-3 (T-03)',
      type: 'Aircraft',
      x: 320,
      y: 180,
      status: disruptionState.humanApproved ? 'AIR-BRIDGE SORTIE' : 'STANDBY AT RUNWAY',
      coordinates: '70.610° S, 11.820° E',
      details: 'Aviation link deployed for emergency fuel airlift from coastal cache.',
    },
    {
      id: 'mission-m024-target',
      name: 'Mission M-024 Deep Glaciology Transect',
      type: 'Mission Waypoint',
      x: 360,
      y: 290,
      status: disruptionState.humanApproved ? 'RECOVERED LAUNCH' : 'AT RISK PENDING FUEL',
      coordinates: '71.500° S, 13.200° E',
      details: '400km deep Antarctic plateau radar sounding transect.',
    },
    {
      id: 'hazard-crevasse',
      name: 'Active Crevasse Shear Zone #7',
      type: 'Hazard',
      x: 290,
      y: 250,
      status: 'Rerouting Flags Active',
      coordinates: '70.920° S, 11.450° E',
      details: 'Detected by GPR Scout Team. Safe detour marked 400m east.',
    },
  ];

  const selectedFeature = features.find((f) => f.id === selectedFeatureId) || features[0];

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span>ANTARCTIC SECTOR CARTOGRAPHY</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-700 font-semibold">GEOGRAPHIC INFORMATION SYSTEM</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            GIS Mission Operations Map
          </h1>
        </div>

        {/* Prototype disclosure pill */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-cyan-800 bg-cyan-50 border border-cyan-200 px-2.5 py-1 rounded">
            Prototype Map / Demonstration Data
          </span>
        </div>
      </div>

      {/* Main Map Stage and Sidebar Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Canvas (3 Cols) */}
        <div className="lg:col-span-3 bg-white rounded border border-slate-200 p-4 shadow-2xs space-y-3">
          {/* Map Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 font-mono">
              <Compass className="w-4 h-4 text-cyan-700" />
              <span className="font-bold text-slate-800">Queen Maud Land to Larsemann Hills</span>
            </div>

            {/* Layer toggles */}
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <button
                onClick={() => setActiveLayers((p) => ({ ...p, routes: !p.routes }))}
                className={`px-2 py-0.5 rounded border transition-colors ${
                  activeLayers.routes
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}
              >
                Routes
              </button>
              <button
                onClick={() => setActiveLayers((p) => ({ ...p, weather: !p.weather }))}
                className={`px-2 py-0.5 rounded border transition-colors ${
                  activeLayers.weather
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}
              >
                Weather
              </button>
              <button
                onClick={() => setActiveLayers((p) => ({ ...p, assets: !p.assets }))}
                className={`px-2 py-0.5 rounded border transition-colors ${
                  activeLayers.assets
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}
              >
                Assets
              </button>
              <button
                onClick={() => setActiveLayers((p) => ({ ...p, hazards: !p.hazards }))}
                className={`px-2 py-0.5 rounded border transition-colors ${
                  activeLayers.hazards
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}
              >
                Hazards
              </button>
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full h-[460px] bg-[#0b1329] rounded border border-slate-800 overflow-hidden select-none">
            <svg className="w-full h-full" viewBox="0 0 900 460">
              <defs>
                <linearGradient id="iceShelfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
                </linearGradient>
                <radialGradient id="stormFront" cx="30%" cy="80%" r="50%">
                  <stop offset="0%" stopColor="#e11d48" stopOpacity="0.25" />
                  <stop offset="60%" stopColor="#f43f5e" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#0b1329" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Polar Coordinate Graticules (Latitude & Longitude lines) */}
              <g stroke="#1e293b" strokeWidth="0.75" strokeDasharray="3 3">
                <line x1="0" y1="90" x2="900" y2="90" />
                <line x1="0" y1="180" x2="900" y2="180" />
                <line x1="0" y1="270" x2="900" y2="270" />
                <line x1="0" y1="360" x2="900" y2="360" />

                <line x1="150" y1="0" x2="150" y2="460" />
                <line x1="300" y1="0" x2="300" y2="460" />
                <line x1="450" y1="0" x2="450" y2="460" />
                <line x1="600" y1="0" x2="600" y2="460" />
                <line x1="750" y1="0" x2="750" y2="460" />
              </g>

              {/* Antarctic Continental Ice Contour Silhouette */}
              <path
                d="M 50 120 Q 180 140 260 170 T 450 190 T 650 140 T 850 120 L 890 440 L 10 440 Z"
                fill="url(#iceShelfGrad)"
                stroke="#334155"
                strokeWidth="1.5"
              />

              {/* Elevation Contour Rings */}
              <path
                d="M 120 220 Q 240 240 380 270 T 620 250 T 800 230"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="0.75"
                strokeDasharray="4 2"
                opacity="0.3"
              />
              <path
                d="M 180 290 Q 320 330 460 340 T 720 310"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="0.75"
                strokeDasharray="4 2"
                opacity="0.2"
              />

              {/* Active Weather Storm Layer (Cat-3 Blizzard arriving at T+38h) */}
              {activeLayers.weather && (
                <g>
                  <circle cx="280" cy="380" r="160" fill="url(#stormFront)" />
                  <text x="180" y="420" fill="#f43f5e" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    INCOMING CAT-3 BLIZZARD FRONT (ETA: T+38H · 75 KTS)
                  </text>
                </g>
              )}

              {/* Traverse & Air Routes */}
              {activeLayers.routes && (
                <g>
                  {/* Coastal Traverse Route Alpha */}
                  <path
                    d="M 120 140 L 180 220 L 240 190"
                    fill="none"
                    stroke={disruptionState.isSimulated ? '#f43f5e' : '#38bdf8'}
                    strokeWidth="2"
                    strokeDasharray={disruptionState.isSimulated ? '5 3' : 'none'}
                  />
                  {/* Inland Traverse Route Bravo (M-024) */}
                  <path
                    d="M 240 190 L 290 240 L 360 290"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                  {/* Inter-Station Air-Bridge Corridor (Maitri to Bharati) */}
                  <path
                    d="M 240 190 Q 480 120 710 160"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    strokeDasharray="6 4"
                    opacity="0.6"
                  />
                </g>
              )}

              {/* Render Map Features & Pins */}
              {features.map((f) => {
                const isSelected = selectedFeatureId === f.id;
                return (
                  <g
                    key={f.id}
                    onClick={() => setSelectedFeatureId(f.id)}
                    className="cursor-pointer group"
                    transform={`translate(${f.x}, ${f.y})`}
                  >
                    {/* Outer Glow ring if selected */}
                    {isSelected && (
                      <circle cx="0" cy="0" r="14" fill="#38bdf8" fillOpacity="0.25" className="animate-ping" />
                    )}

                    {/* Pin Graphic */}
                    {f.type === 'Station' ? (
                      <rect
                        x="-7"
                        y="-7"
                        width="14"
                        height="14"
                        fill="#06b6d4"
                        stroke="#ffffff"
                        strokeWidth="2"
                        rx="2"
                      />
                    ) : f.type === 'Cargo Convoy' ? (
                      <circle
                        cx="0"
                        cy="0"
                        r="6"
                        fill={disruptionState.isSimulated ? '#f43f5e' : '#38bdf8'}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    ) : f.type === 'Hazard' ? (
                      <polygon points="0,-7 7,7 -7,7" fill="#fbbf24" stroke="#ffffff" strokeWidth="1" />
                    ) : (
                      <circle cx="0" cy="0" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                    )}

                    {/* Label Callout */}
                    <text
                      x="10"
                      y="4"
                      fill="#ffffff"
                      fontSize="10"
                      fontFamily="system-ui, sans-serif"
                      fontWeight="bold"
                      className="drop-shadow-xs"
                    >
                      {f.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Bottom HUD metadata */}
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950/80 backdrop-blur-xs px-3 py-1.5 rounded border border-slate-800">
              <span>Grid Projection: WGS84 Antarctic Polar Stereographic</span>
              <span>Elevation: Ice Dome C (3,233m) to Coast (0m)</span>
            </div>
          </div>
        </div>

        {/* Feature Inspector Sidebar (1 Col) */}
        <div className="space-y-4">
          <div className="bg-white rounded border border-slate-200 p-5 shadow-2xs">
            <div className="text-xs font-mono uppercase text-slate-400 font-bold mb-1">
              Geographic Node Inspector
            </div>
            <div className="text-base font-bold text-slate-900 mb-1">
              {selectedFeature.name}
            </div>
            <div className="text-xs font-mono text-cyan-800 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded inline-block mb-3">
              Type: {selectedFeature.type}
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Coordinates:</span>
                  <span className="font-bold text-slate-900">{selectedFeature.coordinates}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Operational Status:</span>
                  <span
                    className={`font-bold ${
                      selectedFeature.status.includes('DELAYED') || selectedFeature.status.includes('AT RISK')
                        ? 'text-rose-600'
                        : 'text-slate-900'
                    }`}
                  >
                    {selectedFeature.status}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-slate-500 font-semibold mb-1">Sector Briefing:</div>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  {selectedFeature.details}
                </p>
              </div>

              {selectedFeature.id === 'convoy-c102' && disruptionState.isSimulated && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded text-[11px] text-rose-950">
                  <div className="font-bold mb-0.5">Disruption Waypoint Verified</div>
                  <p>
                    Ground convoy stopped at KM-42. Manifold freeze requires 12h thawing sequence.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
