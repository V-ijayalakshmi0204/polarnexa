import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Station,
  StationId,
  CargoItem,
  Asset,
  TransportVehicle,
  Mission,
  InventoryItem,
  Personnel,
  RecoveryPlan,
  AuditEvent,
  OfflineQueueEvent,
  EmergencyIncident,
  UserRole,
  DisruptionState,
} from '../types';
import {
  INITIAL_STATIONS,
  INITIAL_CARGO,
  INITIAL_ASSETS,
  INITIAL_TRANSPORTS,
  INITIAL_MISSIONS,
  INITIAL_INVENTORY,
  INITIAL_PERSONNEL,
  RECOVERY_PLANS,
  INITIAL_AUDIT_LOGS,
  INITIAL_INCIDENTS,
} from '../data/mockData';

interface MissionContextType {
  // Navigation & General
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedStationId: StationId;
  setSelectedStationId: (id: StationId) => void;
  currentStation: Station;
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  
  // Data Entities
  stations: Station[];
  cargoList: CargoItem[];
  assets: Asset[];
  transports: TransportVehicle[];
  missions: Mission[];
  inventory: InventoryItem[];
  personnel: Personnel[];
  auditLogs: AuditEvent[];
  incidents: EmergencyIncident[];
  offlineQueue: OfflineQueueEvent[];
  recoveryPlans: RecoveryPlan[];
  
  // Core Disruption & Recovery State
  disruptionState: DisruptionState;
  simulateCargoDelay: () => void;
  approveRecoveryPlan: (planId: 'PLAN_A' | 'PLAN_B' | 'PLAN_C') => void;
  rejectRecoveryPlan: () => void;
  resetSimulation: () => void;
  
  // Offline Engine
  addOfflineEvent: (type: OfflineQueueEvent['type'], payload: any) => void;
  syncOfflineQueue: () => Promise<void>;
  isSyncing: boolean;
  syncStep: string;
  
  // Inventory & Emergency
  simulateConsumptionIncrease: () => void;
  declareIncident: (incident: Omit<EmergencyIncident, 'id' | 'declaredAt' | 'status'>) => void;
  resolveIncident: (id: string) => void;
  
  // SIH Demo Mode
  isSIHDemoActive: boolean;
  sihStepIndex: number;
  startSIHDemo: () => void;
  stopSIHDemo: () => void;
  nextSIHStep: () => void;
  prevSIHStep: () => void;
  goToSIHStep: (index: number) => void;
  
  // Modals & UI helpers
  activeScanCargo: CargoItem | null;
  setActiveScanCargo: (cargo: CargoItem | null) => void;
  isIncidentModalOpen: boolean;
  setIsIncidentModalOpen: (open: boolean) => void;
  activeNotification: { title: string; message: string; type: 'info' | 'warning' | 'alert' | 'success' } | null;
  clearNotification: () => void;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

const LOCAL_STORAGE_OFFLINE_KEY = 'polarnex_simulated_offline_queue';

export const MissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [selectedStationId, setSelectedStationId] = useState<StationId>('maitri');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('Mission Manager');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  
  // Entities
  const [stations] = useState<Station[]>(INITIAL_STATIONS);
  const [cargoList, setCargoList] = useState<CargoItem[]>(INITIAL_CARGO);
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [transports, setTransports] = useState<TransportVehicle[]>(INITIAL_TRANSPORTS);
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [personnel, setPersonnel] = useState<Personnel[]>(INITIAL_PERSONNEL);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(INITIAL_AUDIT_LOGS);
  const [incidents, setIncidents] = useState<EmergencyIncident[]>(INITIAL_INCIDENTS);
  
  // Offline queue stored with local persistence
  const [offlineQueue, setOfflineQueue] = useState<OfflineQueueEvent[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_OFFLINE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStep, setSyncStep] = useState<string>('');

  // Disruption State
  const [disruptionState, setDisruptionState] = useState<DisruptionState>({
    isSimulated: false,
    cargoId: 'C102',
    delayHours: 0,
    affectedMissionId: 'MISSION-024',
    affectedInventoryCategory: 'Fuel',
    affectedTransportId: 'T-02',
    propagationDetected: false,
    recoveryPlanGenerated: false,
    selectedPlanId: null,
    humanApproved: false,
  });

  // Modals & Notifications
  const [activeScanCargo, setActiveScanCargo] = useState<CargoItem | null>(null);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState<boolean>(false);
  const [activeNotification, setActiveNotification] = useState<{
    title: string;
    message: string;
    type: 'info' | 'warning' | 'alert' | 'success';
  } | null>(null);

  // SIH Demo State
  const [isSIHDemoActive, setIsSIHDemoActive] = useState<boolean>(false);
  const [sihStepIndex, setSihStepIndex] = useState<number>(0);

  // Sync offline queue to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_OFFLINE_KEY, JSON.stringify(offlineQueue));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [offlineQueue]);

  const currentStation = stations.find((s) => s.id === selectedStationId) || stations[0];

  const clearNotification = () => setActiveNotification(null);

  // ==========================================
  // CORE WORKFLOW: SIMULATE CARGO DELAY +12H
  // ==========================================
  const simulateCargoDelay = () => {
    // 1. Update Cargo C102 status to Delayed
    setCargoList((prev) =>
      prev.map((c) => {
        if (c.id === 'C102') {
          return {
            ...c,
            status: 'Delayed',
            eta: 'T+18h (+12h Delayed)',
            risk: 'High',
            movementHistory: [
              ...c.movementHistory,
              {
                timestamp: '2026-09-29 07:50',
                location: 'Continental Margin KM-42 Depot',
                event: 'Severe Sastrugi Ruts & Tractor Manifold Freeze (+12h Delay Logged)',
                operator: 'T. Norbu (Convoy Lead)',
              },
            ],
          };
        }
        return c;
      })
    );

    // 2. Cascade to Mission M-024: Change status to 'At Risk'
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === 'MISSION-024') {
          return {
            ...m,
            status: 'At Risk',
            readinessPct: 62,
            riskLevel: 'High',
          };
        }
        return m;
      })
    );

    // 3. Cascade to Transport T-02: Status to 'Delayed by Upstream'
    setTransports((prev) =>
      prev.map((t) => {
        if (t.id === 'T-02') {
          return {
            ...t,
            status: 'Delayed by Upstream',
          };
        }
        return t;
      })
    );

    // 4. Cascade to Inventory: Fuel stockout warning
    setInventory((prev) =>
      prev.map((inv) => {
        if (inv.category === 'Fuel') {
          return {
            ...inv,
            nextResupplyEta: 'T+18h (DELAYED +12h: Deficit -42,000L)',
            stockoutRisk: 'Critical',
          };
        }
        return inv;
      })
    );

    // 5. Update Disruption Engine State
    setDisruptionState({
      isSimulated: true,
      cargoId: 'C102',
      delayHours: 12,
      affectedMissionId: 'MISSION-024',
      affectedInventoryCategory: 'Fuel',
      affectedTransportId: 'T-02',
      propagationDetected: true,
      recoveryPlanGenerated: true,
      selectedPlanId: null,
      humanApproved: false,
    });

    // 6. Log in Audit Trail
    const newAudit: AuditEvent = {
      id: `EVT-${1024 + auditLogs.length - 3}`,
      timestamp: '2026-09-29 07:50:33 UTC',
      entityId: 'C102',
      entityType: 'Cargo',
      userId: 'SYS-DISRUPTION-ENGINE',
      userRole: 'Logistics Officer',
      station: 'Maitri',
      action: 'Cargo Disruption Simulated (+12 Hours)',
      status: 'ALERT',
      details: {
        whatHappened: 'Cargo C102 (Polar Diesel) reported sastrugi immobilisation and manifold freeze at KM-42.',
        whoTriggered: 'Traverse Sled Telemetry Sensor & T. Norbu',
        whatChanged: 'Cargo status changed to Delayed (+12h). Fuel buffer compromised. Mission M-024 flagged AT RISK.',
        affectedEntities: ['Cargo C102', 'INV-FUEL-01', 'Mission MISSION-024', 'Transport T-02', 'Station Maitri Staging Yard'],
        digitalSignature: 'ED25519:90fe8132aa9c77e201b127ffc493',
      },
    };

    setAuditLogs((prev) => [newAudit, ...prev]);

    setActiveNotification({
      title: 'Impact Propagation Detected',
      message: 'Cargo C102 delay (+12h) cascaded to Fuel Supply, Transport T-02, and Mission M-024 (Now AT RISK). Recovery options ready for review.',
      type: 'alert',
    });
  };

  // ==========================================
  // HUMAN APPROVAL OF RECOVERY PLAN
  // ==========================================
  const approveRecoveryPlan = (planId: 'PLAN_A' | 'PLAN_B' | 'PLAN_C') => {
    const selectedPlan = RECOVERY_PLANS.find((p) => p.id === planId);
    if (!selectedPlan) return;

    if (selectedPlan.feasibility === 'INFEASIBLE') {
      setActiveNotification({
        title: 'Constraint Engine Rejection',
        message: `Plan ${planId} cannot be approved: ${selectedPlan.infeasibilityReason}`,
        type: 'alert',
      });
      return;
    }

    // Update Disruption State
    setDisruptionState((prev) => ({
      ...prev,
      selectedPlanId: planId,
      humanApproved: true,
      approvalTimestamp: new Date().toISOString(),
      approverName: `${currentUserRole} (Maitri Command)`,
    }));

    // Update Mission M-024 to 'Recovered'
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === 'MISSION-024') {
          return {
            ...m,
            status: 'Recovered',
            readinessPct: planId === 'PLAN_A' ? 95 : 88,
            riskLevel: planId === 'PLAN_A' ? 'Low' : 'Medium',
          };
        }
        return m;
      })
    );

    // If Plan A: Twin Otter T-03 assigned to high priority shuttle
    if (planId === 'PLAN_A') {
      setTransports((prev) =>
        prev.map((t) => {
          if (t.id === 'T-03') {
            return {
              ...t,
              status: 'En Route',
              assignedMissionId: 'MISSION-024',
            };
          }
          if (t.id === 'T-02') {
            return {
              ...t,
              status: 'Staging',
            };
          }
          return t;
        })
      );
    }

    // If Plan C: Station fuel drawn down
    if (planId === 'PLAN_C') {
      setInventory((prev) =>
        prev.map((inv) => {
          if (inv.category === 'Fuel') {
            return {
              ...inv,
              currentStock: 26200,
              stockoutRisk: 'Moderate',
            };
          }
          return inv;
        })
      );
    }

    // Log in Audit Trail
    const newAudit: AuditEvent = {
      id: `EVT-${1025 + auditLogs.length - 3}`,
      timestamp: new Date().toUTCString(),
      entityId: 'MISSION-024',
      entityType: 'Recovery',
      userId: `USR-${currentUserRole.toUpperCase().replace(/\s+/g, '-')}`,
      userRole: currentUserRole,
      station: 'Maitri',
      action: `Recovery Plan Approved: ${selectedPlan.title}`,
      status: 'SUCCESS',
      details: {
        whatHappened: `Human operator officially authorized ${selectedPlan.title}.`,
        whoTriggered: `${currentUserRole} via Mission Control Console`,
        whatChanged: `Mission M-024 restored to RECOVERED. Operational constraints reconciled.`,
        affectedEntities: ['Mission MISSION-024', 'Cargo C102', 'Transport T-03', 'Maitri Fuel Cell'],
        selectedPlan: selectedPlan.title,
        whySelected: selectedPlan.decisionRationale,
        digitalSignature: 'ED25519:cc4901ba32ef99824610ad99e0132a',
      },
    };

    setAuditLogs((prev) => [newAudit, ...prev]);

    setActiveNotification({
      title: 'Recovery Plan Approved',
      message: `Mission M-024 state updated to RECOVERED. Operational digital twin synchronized across stations.`,
      type: 'success',
    });
  };

  const rejectRecoveryPlan = () => {
    setDisruptionState((prev) => ({
      ...prev,
      selectedPlanId: null,
      humanApproved: false,
    }));
    setActiveNotification({
      title: 'Plan Selection Rejected',
      message: 'Decision engine ready for alternate plan evaluation or manual override.',
      type: 'warning',
    });
  };

  // Reset Everything to Baseline
  const resetSimulation = () => {
    setCargoList(INITIAL_CARGO);
    setAssets(INITIAL_ASSETS);
    setTransports(INITIAL_TRANSPORTS);
    setMissions(INITIAL_MISSIONS);
    setInventory(INITIAL_INVENTORY);
    setPersonnel(INITIAL_PERSONNEL);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setDisruptionState({
      isSimulated: false,
      cargoId: 'C102',
      delayHours: 0,
      affectedMissionId: 'MISSION-024',
      affectedInventoryCategory: 'Fuel',
      affectedTransportId: 'T-02',
      propagationDetected: false,
      recoveryPlanGenerated: false,
      selectedPlanId: null,
      humanApproved: false,
    });
    setActiveNotification({
      title: 'Simulation State Reset',
      message: 'Operational baseline restored to nominal Antarctica 2026 parameters.',
      type: 'info',
    });
  };

  // ==========================================
  // OFFLINE ENGINE (STORE & FORWARD)
  // ==========================================
  const addOfflineEvent = (type: OfflineQueueEvent['type'], payload: any) => {
    const newQueueEvent: OfflineQueueEvent = {
      id: `OFFLINE-EVT-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      type,
      payload,
      status: 'PENDING',
      author: `${currentUserRole} (${currentStation.name})`,
      station: currentStation.name,
    };

    setOfflineQueue((prev) => [newQueueEvent, ...prev]);

    setActiveNotification({
      title: 'Event Queued Locally',
      message: `Offline event stored in local encrypted queue (${newQueueEvent.id}). Awaiting connectivity restoration.`,
      type: 'info',
    });
  };

  const syncOfflineQueue = async () => {
    if (offlineQueue.length === 0) {
      setActiveNotification({
        title: 'Queue Empty',
        message: 'No pending offline events to synchronize.',
        type: 'info',
      });
      return;
    }

    setIsSyncing(true);
    setSyncStep('Validating Cryptographic Signatures & Vector Clocks...');
    await new Promise((r) => setTimeout(r, 600));

    setSyncStep('Resolving State Conflicts with Central Expedition Ledger...');
    await new Promise((r) => setTimeout(r, 650));

    setSyncStep('Updating Mission Digital Twin & Resource Nodes...');
    await new Promise((r) => setTimeout(r, 600));

    setSyncStep('Writing Immutable Audit Log Entries...');
    await new Promise((r) => setTimeout(r, 550));

    // Convert synced offline events to audit logs
    const newAudits: AuditEvent[] = offlineQueue.map((evt, idx) => ({
      id: `EVT-${1030 + idx}`,
      timestamp: new Date().toUTCString(),
      entityId: evt.payload.entityId || 'OFFLINE-NODE',
      entityType: 'Offline Sync',
      userId: 'OFFLINE-SYNC-ENGINE',
      userRole: currentUserRole,
      station: evt.station,
      action: `Offline Event Synced: ${evt.type}`,
      status: 'SUCCESS',
      details: {
        whatHappened: `Field operator action executed offline was reconciled with mission control.`,
        whoTriggered: evt.author,
        whatChanged: `Local buffer merged into authoritative expedition database.`,
        affectedEntities: [evt.station, evt.type],
        digitalSignature: `OFFLINE-SHA256:${Math.random().toString(36).substring(2, 10)}`,
      },
    }));

    setAuditLogs((prev) => [...newAudits, ...prev]);
    setOfflineQueue([]);
    setIsSyncing(false);
    setSyncStep('');
    setIsOnline(true);

    setActiveNotification({
      title: 'Sync Complete',
      message: `${newAudits.length} field operations successfully committed to mission ledger.`,
      type: 'success',
    });
  };

  // ==========================================
  // INVENTORY CONSUMPTION SIMULATION
  // ==========================================
  const simulateConsumptionIncrease = () => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.category === 'Fuel') {
          const newDaily = Math.round(item.dailyConsumptionRate * 1.45);
          const daysRem = Number((item.currentStock / newDaily).toFixed(1));
          return {
            ...item,
            dailyConsumptionRate: newDaily,
            forecastDaysRemaining: daysRem,
            stockoutRisk: daysRem < 25 ? 'Critical' : 'Moderate',
          };
        }
        if (item.category === 'Food') {
          const newDaily = Math.round(item.dailyConsumptionRate * 1.3);
          const daysRem = Number((item.currentStock / newDaily).toFixed(1));
          return {
            ...item,
            dailyConsumptionRate: newDaily,
            forecastDaysRemaining: daysRem,
          };
        }
        return item;
      })
    );

    setActiveNotification({
      title: 'Consumption Surge Simulated',
      message: 'Katabatic wind storm triggered heating demand (+45% fuel burn). Inventory forecasts recalculated.',
      type: 'warning',
    });
  };

  // ==========================================
  // INCIDENT MANAGEMENT
  // ==========================================
  const declareIncident = (incidentData: Omit<EmergencyIncident, 'id' | 'declaredAt' | 'status'>) => {
    const newInc: EmergencyIncident = {
      ...incidentData,
      id: `INC-2026-0${incidents.length + 1}`,
      declaredAt: new Date().toUTCString(),
      status: 'ACTIVE',
    };

    setIncidents((prev) => [newInc, ...prev]);

    // Create Audit entry
    const newAudit: AuditEvent = {
      id: `EVT-${1040 + auditLogs.length - 3}`,
      timestamp: new Date().toUTCString(),
      entityId: newInc.id,
      entityType: 'Incident',
      userId: `USR-${currentUserRole.toUpperCase().replace(/\s+/g, '-')}`,
      userRole: currentUserRole,
      station: currentStation.name,
      action: `Emergency Incident Declared: ${newInc.type}`,
      status: 'ALERT',
      details: {
        whatHappened: newInc.description,
        whoTriggered: newInc.declaredBy,
        whatChanged: `Priority level set to ${newInc.priority}. Emergency protocol active.`,
        affectedEntities: newInc.affectedPersonnel,
        digitalSignature: 'ED25519:ee1091ca472a11b02849e7710a',
      },
    };

    setAuditLogs((prev) => [newAudit, ...prev]);

    setActiveNotification({
      title: `Emergency Declared: ${newInc.type}`,
      message: `Priority: ${newInc.priority} at ${newInc.location}. Personnel notified.`,
      type: 'alert',
    });
  };

  const resolveIncident = (id: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status: 'RESOLVING' } : inc))
    );
  };

  // ==========================================
  // SIH 3-MINUTE GUIDED DEMO MODE CONTROLLER
  // ==========================================
  const startSIHDemo = () => {
    setIsSIHDemoActive(true);
    setSihStepIndex(0);
    setCurrentView('mission-control');
  };

  const stopSIHDemo = () => {
    setIsSIHDemoActive(false);
    setSihStepIndex(0);
  };

  const goToSIHStep = (index: number) => {
    setSihStepIndex(index);
    // Auto navigate to relevant view based on step index
    switch (index) {
      case 0: // Normal mission state
        setCurrentView('mission-control');
        break;
      case 1: // Trigger Cargo C102 delay
        setCurrentView('mission-control');
        if (!disruptionState.isSimulated) simulateCargoDelay();
        break;
      case 2: // Detect impact
        setCurrentView('digital-twin');
        break;
      case 3: // Dependency graph
        setCurrentView('dependency-graph');
        break;
      case 4: // Identify affected entities
        setCurrentView('dependency-graph');
        break;
      case 5: // Constraint checking
        setCurrentView('recovery-planner');
        break;
      case 6: // Recovery alternatives
        setCurrentView('recovery-planner');
        break;
      case 7: // Compare plans
        setCurrentView('recovery-planner');
        break;
      case 8: // Human approval
        setCurrentView('recovery-planner');
        break;
      case 9: // Update mission state
        setCurrentView('digital-twin');
        break;
      case 10: // Simulate offline
        setCurrentView('offline-sync');
        setIsOnline(false);
        break;
      case 11: // Create offline event
        setCurrentView('offline-sync');
        break;
      case 12: // Restore connectivity
        setCurrentView('offline-sync');
        break;
      case 13: // Synchronize event
        setCurrentView('offline-sync');
        break;
      case 14: // Audit trail
        setCurrentView('events-audit');
        break;
      default:
        break;
    }
  };

  const nextSIHStep = () => {
    if (sihStepIndex < 14) {
      goToSIHStep(sihStepIndex + 1);
    } else {
      stopSIHDemo();
    }
  };

  const prevSIHStep = () => {
    if (sihStepIndex > 0) {
      goToSIHStep(sihStepIndex - 1);
    }
  };

  return (
    <MissionContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedStationId,
        setSelectedStationId,
        currentStation,
        currentUserRole,
        setCurrentUserRole,
        isOnline,
        setIsOnline,
        stations,
        cargoList,
        assets,
        transports,
        missions,
        inventory,
        personnel,
        auditLogs,
        incidents,
        offlineQueue,
        recoveryPlans: RECOVERY_PLANS,
        disruptionState,
        simulateCargoDelay,
        approveRecoveryPlan,
        rejectRecoveryPlan,
        resetSimulation,
        addOfflineEvent,
        syncOfflineQueue,
        isSyncing,
        syncStep,
        simulateConsumptionIncrease,
        declareIncident,
        resolveIncident,
        isSIHDemoActive,
        sihStepIndex,
        startSIHDemo,
        stopSIHDemo,
        nextSIHStep,
        prevSIHStep,
        goToSIHStep,
        activeScanCargo,
        setActiveScanCargo,
        isIncidentModalOpen,
        setIsIncidentModalOpen,
        activeNotification,
        clearNotification,
      }}
    >
      {children}
    </MissionContext.Provider>
  );
};

export const useMission = () => {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error('useMission must be used within a MissionProvider');
  }
  return context;
};
