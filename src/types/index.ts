export type StationId = 'maitri' | 'bharati';

export type UserRole = 
  | 'Admin'
  | 'Mission Manager'
  | 'Logistics Officer'
  | 'Station Operator'
  | 'Scientist'
  | 'Auditor';

export interface Station {
  id: StationId;
  name: string;
  code: string;
  coordinates: { lat: number; lng: number };
  elevation: string;
  climateStatus: {
    tempC: number;
    windKts: number;
    visibilityKm: number;
    condition: string;
  };
  operationalReadiness: number; // percentage
}

export type CargoStatus = 
  | 'In Transit'
  | 'At Station'
  | 'Delayed'
  | 'Received'
  | 'Inspection Required';

export interface CargoItem {
  id: string; // e.g. C101, C102, C103, C104
  description: string;
  category: 'Fuel' | 'Heavy Equipment' | 'Cryo Consumables' | 'Medical Supplies';
  origin: string;
  destination: string;
  currentLocation: string;
  status: CargoStatus;
  missionId: string;
  eta: string;
  risk: 'Low' | 'Medium' | 'High' | 'Critical';
  weightKg: number;
  qrPayload: string;
  temperatureControlled: boolean;
  targetTempC?: number;
  assignedTransportId: string;
  movementHistory: {
    timestamp: string;
    location: string;
    event: string;
    operator: string;
  }[];
  maintenanceInfo?: string;
}

export type AssetStatus = 
  | 'Operational'
  | 'Requires Maintenance'
  | 'In Traverse'
  | 'Standby'
  | 'Decommissioned';

export interface Asset {
  id: string; // A-201, A-202, A-203, A-204
  name: string;
  category: 'Tracked Vehicle' | 'All-Terrain Transport' | 'Telemetry System' | 'Power Sled';
  stationId: StationId;
  status: AssetStatus;
  engineHours: number;
  fuelLevelPct: number;
  lastInspectionDate: string;
  nextScheduledService: string;
  healthScore: number; // 0 - 100
  activeMissionId?: string;
  criticalSpareNeeded?: string;
}

export interface TransportVehicle {
  id: string; // T-01, T-02, T-03
  callsign: string;
  type: 'Sea-Ice Traverse Convoy' | 'Inland Heavy Sled Convoy' | 'Twin Otter Polar Aircraft';
  capacityKg: number;
  rangeKm: number;
  status: 'En Route' | 'Staging' | 'Delayed by Upstream' | 'Ready for Dispatch';
  currentLocation: string;
  assignedMissionId?: string;
  fuelConsumptionLPerKm: number;
}

export type MissionOperationalStatus = 
  | 'Nominal'
  | 'Ready'
  | 'At Risk'
  | 'Recovered'
  | 'In Progress'
  | 'Completed';

export interface Mission {
  id: string; // MISSION-021, MISSION-022, MISSION-023, MISSION-024
  name: string;
  stationId: StationId;
  status: MissionOperationalStatus;
  personnelIds: string[];
  cargoIds: string[];
  assetIds: string[];
  transportId: string;
  readinessPct: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Severe';
  scheduledDeparture: string;
  scheduledDurationDays: number;
  scientificObjective: string;
  criticalDependencies: string[];
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Fuel' | 'Food' | 'Medical Supplies' | 'Spare Parts' | 'Scientific Consumables';
  stationId: StationId;
  currentStock: number;
  unit: string;
  minimumStock: number;
  dailyConsumptionRate: number;
  forecastDaysRemaining: number;
  stockoutRisk: 'Low' | 'Moderate' | 'Critical';
  nextResupplyEta: string;
  history30Days: number[];
}

export interface Personnel {
  id: string;
  name: string;
  role: string;
  stationId: StationId;
  assignedMissionId?: string;
  status: 'Available' | 'Deployed' | 'On Mission' | 'Medical Support' | 'Emergency';
  emergencyContact: string;
  lastVitalsCheck: string;
  specialization: string;
}

export interface DisruptionState {
  isSimulated: boolean;
  cargoId: string;
  delayHours: number;
  affectedMissionId: string;
  affectedInventoryCategory: string;
  affectedTransportId: string;
  propagationDetected: boolean;
  recoveryPlanGenerated: boolean;
  selectedPlanId: 'PLAN_A' | 'PLAN_B' | 'PLAN_C' | null;
  humanApproved: boolean;
  approvalTimestamp?: string;
  approverName?: string;
}

export interface RecoveryPlan {
  id: 'PLAN_A' | 'PLAN_B' | 'PLAN_C';
  title: string;
  strategy: string;
  description: string;
  expectedDelayHours: number;
  fuelImpactDescription: string;
  fuelPenaltyPct: number;
  resourceImpact: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Severe';
  feasibility: 'FEASIBLE' | 'INFEASIBLE';
  infeasibilityReason?: string;
  constraintsEvaluated: {
    name: string;
    status: 'PASS' | 'FAIL' | 'WARNING';
    detail: string;
  }[];
  decisionRationale: string;
  score: number;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  entityId: string;
  entityType: 'Cargo' | 'Mission' | 'Asset' | 'Inventory' | 'Offline Sync' | 'Incident' | 'Recovery';
  userId: string;
  userRole: UserRole;
  station: string;
  action: string;
  status: 'SUCCESS' | 'WARNING' | 'ALERT';
  details: {
    whatHappened: string;
    whoTriggered: string;
    whatChanged: string;
    affectedEntities: string[];
    selectedPlan?: string;
    whySelected?: string;
    digitalSignature?: string;
  };
}

export interface OfflineQueueEvent {
  id: string;
  timestamp: string;
  type: 'ASSET_INSPECTION' | 'CARGO_SCAN' | 'INVENTORY_COUNT' | 'INCIDENT_LOG';
  payload: any;
  status: 'PENDING' | 'SYNCED';
  author: string;
  station: string;
}

export interface EmergencyIncident {
  id: string;
  type: 'Crevasse Hazard' | 'Generator Blown' | 'Severe Blizzard Warning' | 'Medical Hypothermia' | 'Traverse Breakdown';
  location: string;
  affectedPersonnel: string[];
  requiredResources: string[];
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  declaredAt: string;
  declaredBy: string;
  status: 'ACTIVE' | 'RESOLVING' | 'STANDBY';
  description: string;
}
