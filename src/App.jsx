import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import GreyInward from './components/GreyInward';
import JobCardBatching from './components/JobCardBatching';
import RecipeEngine from './components/RecipeEngine';
import FloorWipAndGatePass from './components/FloorWipAndGatePass';
import DispatchModule from './components/DispatchModule';
import BillingModule from './components/BillingModule';
import MastersModule from './components/MastersModule';
import SettingsModule from './components/SettingsModule';
import CommandPalette from './components/CommandPalette';
import VesselTelemetryModal from './components/VesselTelemetryModal';
import RollQrModal from './components/RollQrModal';
import AuditTrailModal from './components/AuditTrailModal';
import { loadERPData, saveERPData, getSupabaseConfig } from './services/storage';
import { INITIAL_DATA } from './data/initialData';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [data, setData] = useState(() => loadERPData());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [cloudSynced, setCloudSynced] = useState(false);

  // Tech-Giant Grade Modals and RBAC States
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState('gm'); // 'gm' | 'master' | 'operator' | 'accountant'

  // Global Ctrl+K / Cmd+K Command Palette Shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  useEffect(() => {
    // Attempt automatic initial sync from Supabase
    const cfg = getSupabaseConfig();
    if (cfg.url && cfg.anonKey) {
      import('./services/storage').then(({ pullFromSupabase }) => {
        pullFromSupabase(cfg.url, cfg.anonKey)
          .then((remoteData) => {
            if (remoteData) {
              setData(remoteData);
              setCloudSynced(true);
            }
          })
          .catch((e) => console.warn("Supabase initial fetch bypassed:", e));
      });
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleUpdateData = (newData) => {
    setData(newData);
    saveERPData(newData);
  };

  // Event Sourcing: Append audit event log
  const logAuditEvent = (action, entity, details) => {
    const roleNames = {
      gm: 'Mill Owner / GM',
      master: 'Dyeing Master',
      operator: 'Weighbridge Clerk',
      accountant: 'Billing Accountant'
    };
    const now = new Date();
    const timestamp = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`;
    const newLog = {
      timestamp,
      action,
      entity,
      role: roleNames[currentRole] || 'System Operator',
      details
    };
    return [newLog, ...(data.auditLogs || [])];
  };

  // Handlers for modules
  const handleSaveIGR = (newIGR) => {
    const updatedLogs = logAuditEvent(
      'IGR_RECEIVE',
      newIGR.igrNo,
      `Received ${newIGR.totalQty} KG (${newIGR.totalRolls} rolls) from ${newIGR.partyName}`
    );
    const updated = {
      ...data,
      igrs: [newIGR, ...(data.igrs || [])],
      auditLogs: updatedLogs
    };
    handleUpdateData(updated);
    showToast(`Inward receipt ${newIGR.igrNo} posted to Floor WIP!`);
  };

  const handleSaveJobCard = (newJC) => {
    const updatedLogs = logAuditEvent(
      'BATCH_SCHEDULE',
      newJC.jcNo,
      `Scheduled on ${newJC.machineCode} for shade ${newJC.shadeName} (${newJC.totalWeightKg} KG)`
    );
    const updated = {
      ...data,
      jobCards: [newJC, ...(data.jobCards || [])],
      auditLogs: updatedLogs
    };
    handleUpdateData(updated);
    showToast(`Job Card ${newJC.jcNo} scheduled on vessel ${newJC.machineCode}!`);
  };

  const handleSaveDispatch = (newDisp) => {
    const updatedLogs = logAuditEvent(
      'DISPATCH_GENERATE',
      newDisp.dispNo,
      `Delivered ${newDisp.dispatchedWeightKg} KG (${newDisp.dispatchedRolls} rolls) with ${newDisp.processLossPercent}% shrinkage to ${newDisp.partyName}`
    );
    const updated = {
      ...data,
      dispatches: [newDisp, ...(data.dispatches || [])],
      auditLogs: updatedLogs
    };
    handleUpdateData(updated);
    showToast(`Dispatch challan ${newDisp.dispNo} created with ${newDisp.processLossPercent}% shrinkage!`);
  };

  const handleSaveGatePass = (newGP) => {
    const updatedLogs = logAuditEvent(
      'GATE_PASS_ISSUE',
      newGP.ogcNo,
      `Outward pass (${newGP.type}) issued to ${newGP.partyName} for ${newGP.purpose}`
    );
    const updated = {
      ...data,
      gatePasses: [newGP, ...(data.gatePasses || [])],
      auditLogs: updatedLogs
    };
    handleUpdateData(updated);
    showToast(`Outward gate pass ${newGP.ogcNo} issued for ${newGP.partyName}!`);
  };

  const handleResetData = () => {
    handleUpdateData(INITIAL_DATA);
    showToast("Reset to authentic Mohinder Dyeing master dataset.");
  };

  const config = getSupabaseConfig();
  const isCloudConnected = Boolean(config.url && config.anonKey);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navigation with Tech-Giant Command Palette, SCADA Telemetry, QR, Audit triggers */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        data={data}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCloudConnected={isCloudConnected}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenQr={() => setIsQrOpen(true)}
        onOpenTelemetry={() => setIsTelemetryOpen(true)}
        onOpenAudit={() => setIsAuditOpen(true)}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Toast Alert */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-slate-900 border border-cyan-500/50 text-white px-4 py-3 rounded-xl shadow-2xl animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-semibold">{toast.message}</span>
          </div>
        )}

        {/* Tab Routers */}
        {activeTab === 'dashboard' && (
          <Dashboard 
            data={data} 
            setActiveTab={setActiveTab} 
            onOpenTelemetry={() => setIsTelemetryOpen(true)}
            onOpenQr={() => setIsQrOpen(true)}
          />
        )}
        {activeTab === 'inward' && <GreyInward data={data} onSaveIGR={handleSaveIGR} />}
        {activeTab === 'jobcards' && <JobCardBatching data={data} onSaveJobCard={handleSaveJobCard} />}
        {activeTab === 'recipes' && <RecipeEngine data={data} />}
        {activeTab === 'floor' && <FloorWipAndGatePass data={data} onSaveGatePass={handleSaveGatePass} />}
        {activeTab === 'dispatch' && <DispatchModule data={data} onSaveDispatch={handleSaveDispatch} />}
        {activeTab === 'billing' && <BillingModule data={data} />}
        {activeTab === 'masters' && <MastersModule data={data} onUpdateData={handleUpdateData} />}
        {activeTab === 'settings' && (
          <SettingsModule
            data={data}
            onRestoreData={handleUpdateData}
            onResetData={handleResetData}
          />
        )}

      </main>

      {/* Enterprise Tech-Giant Modals */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        data={data}
        setActiveTab={setActiveTab}
        onOpenQr={() => setIsQrOpen(true)}
        onOpenTelemetry={() => setIsTelemetryOpen(true)}
        onOpenAudit={() => setIsAuditOpen(true)}
      />

      <VesselTelemetryModal
        isOpen={isTelemetryOpen}
        onClose={() => setIsTelemetryOpen(false)}
        machines={data.machines || []}
      />

      <RollQrModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        data={data}
      />

      <AuditTrailModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        auditLogs={data.auditLogs || []}
      />

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        <p>
          {data.company?.name} • ASR Dyeing Solutions Cloud ERP • Reverse Engineered from Microsoft Access FDB Systems
        </p>
      </footer>

    </div>
  );
}
