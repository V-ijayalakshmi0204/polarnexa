import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import { EmergencyIncident } from '../types';
import { X, AlertTriangle, ShieldAlert } from 'lucide-react';

export const DeclareIncidentModal: React.FC = () => {
  const { isIncidentModalOpen, setIsIncidentModalOpen, declareIncident, personnel, currentStation } = useMission();

  const [type, setType] = useState<EmergencyIncident['type']>('Severe Blizzard Warning');
  const [location, setLocation] = useState<string>(`${currentStation.name} Peripheral Sector 4`);
  const [priority, setPriority] = useState<EmergencyIncident['priority']>('HIGH');
  const [affectedPersonnelText, setAffectedPersonnelText] = useState<string>('Priya Nair, Tenzing Norbu');
  const [requiredResourcesText, setRequiredResourcesText] = useState<string>('Twin Otter Sky-3 standby, Heated Survival Shelter');
  const [description, setDescription] = useState<string>(
    'Sudden atmospheric pressure drop detected (24 hPa in 3 hours). Blizzard winds exceeding 65 knots expected.'
  );

  if (!isIncidentModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    declareIncident({
      type,
      location,
      priority,
      affectedPersonnel: affectedPersonnelText.split(',').map((s) => s.trim()),
      requiredResources: requiredResourcesText.split(',').map((s) => s.trim()),
      description,
      declaredBy: 'Station Operations Duty Officer',
    });
    setIsIncidentModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden text-xs text-slate-800">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-rose-50">
          <div className="flex items-center gap-2 text-rose-900">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <span className="font-semibold text-sm">Declare Antarctic Emergency Incident</span>
          </div>
          <button
            onClick={() => setIsIncidentModalOpen(false)}
            className="p-1 rounded text-rose-400 hover:text-rose-700 hover:bg-rose-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-slate-700 font-medium mb-1">Incident Classification</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as EmergencyIncident['type'])}
              className="w-full border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
            >
              <option value="Severe Blizzard Warning">Severe Blizzard Warning</option>
              <option value="Crevasse Hazard">Crevasse Hazard</option>
              <option value="Traverse Breakdown">Traverse Breakdown</option>
              <option value="Generator Blown">Generator Blown / Power Fault</option>
              <option value="Medical Hypothermia">Medical Hypothermia / Frostbite</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as EmergencyIncident['priority'])}
                className="w-full border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="CRITICAL">CRITICAL (Immediate Evac/Rescue)</option>
                <option value="HIGH">HIGH (Traverse Interruption)</option>
                <option value="MEDIUM">MEDIUM (Precautionary Standby)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Geographic Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Affected Personnel (Comma-separated)</label>
            <input
              type="text"
              value={affectedPersonnelText}
              onChange={(e) => setAffectedPersonnelText(e.target.value)}
              className="w-full border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Required Contingency Resources</label>
            <input
              type="text"
              value={requiredResourcesText}
              onChange={(e) => setRequiredResourcesText(e.target.value)}
              className="w-full border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Incident Narrative & Sensor Observations</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-slate-300 rounded p-2 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              required
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsIncidentModalOpen(false)}
              className="px-3 py-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-xs transition-colors"
            >
              Broadcast Incident
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
