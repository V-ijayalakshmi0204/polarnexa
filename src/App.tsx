import React from 'react';
import { MissionProvider, useMission } from './context/MissionContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SIHDemoBar } from './components/SIHDemoBar';
import { LandingPage } from './components/LandingPage';
import { NotificationBanner } from './components/NotificationBanner';
import { QRScannerModal } from './components/QRScannerModal';
import { DeclareIncidentModal } from './components/DeclareIncidentModal';

// Views
import { MissionControlView } from './views/MissionControlView';
import { DigitalTwinView } from './views/DigitalTwinView';
import { ExpeditionPlannerView } from './views/ExpeditionPlannerView';
import { CargoAssetTrackingView } from './views/CargoAssetTrackingView';
import { InventoryManagementView } from './views/InventoryManagementView';
import { DependencyGraphView } from './views/DependencyGraphView';
import { RecoveryPlannerView } from './views/RecoveryPlannerView';
import { PersonnelEmergencyView } from './views/PersonnelEmergencyView';
import { GISMissionMapView } from './views/GISMissionMapView';
import { EventsAuditView } from './views/EventsAuditView';
import { OfflineSyncView } from './views/OfflineSyncView';
import { AnalyticsView } from './views/AnalyticsView';
import { SettingsSecurityView } from './views/SettingsSecurityView';

const MainLayout: React.FC = () => {
  const { currentView } = useMission();

  if (currentView === 'landing') {
    return <LandingPage />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'mission-control':
        return <MissionControlView />;
      case 'digital-twin':
        return <DigitalTwinView />;
      case 'expedition-planner':
        return <ExpeditionPlannerView />;
      case 'cargo-assets':
        return <CargoAssetTrackingView />;
      case 'inventory':
        return <InventoryManagementView />;
      case 'dependency-graph':
        return <DependencyGraphView />;
      case 'recovery-planner':
        return <RecoveryPlannerView />;
      case 'personnel-emergency':
        return <PersonnelEmergencyView />;
      case 'gis-map':
        return <GISMissionMapView />;
      case 'events-audit':
        return <EventsAuditView />;
      case 'offline-sync':
        return <OfflineSyncView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsSecurityView />;
      default:
        return <MissionControlView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      <SIHDemoBar />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto max-w-full">
          {renderCurrentView()}
        </main>
      </div>

      <NotificationBanner />
      <QRScannerModal />
      <DeclareIncidentModal />
    </div>
  );
};

export default function App() {
  return (
    <MissionProvider>
      <MainLayout />
    </MissionProvider>
  );
}
