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
import { loadERPData, saveERPData, getSupabaseConfig } from './services/storage';
import { INITIAL_DATA } from './data/initialData';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [data, setData] = useState(() => loadERPData());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [cloudSynced, setCloudSynced] = useState(false);

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

  // Handlers for modules
  const handleSaveIGR = (newIGR) => {
    const updated = {
      ...data,
      igrs: [newIGR, ...(data.igrs || [])]
    };
    handleUpdateData(updated);
    showToast(`Inward receipt ${newIGR.igrNo} posted to Floor WIP!`);
  };

  const handleSaveJobCard = (newJC) => {
    const updated = {
      ...data,
      jobCards: [newJC, ...(data.jobCards || [])]
    };
    handleUpdateData(updated);
    showToast(`Job Card ${newJC.jcNo} scheduled on vessel ${newJC.machineCode}!`);
  };

  const handleSaveDispatch = (newDisp) => {
    const updated = {
      ...data,
      dispatches: [newDisp, ...(data.dispatches || [])]
    };
    handleUpdateData(updated);
    showToast(`Dispatch challan ${newDisp.dispNo} created with ${newDisp.processLossPercent}% shrinkage!`);
  };

  const handleSaveGatePass = (newGP) => {
    const updated = {
      ...data,
      gatePasses: [newGP, ...(data.gatePasses || [])]
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
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        data={data}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCloudConnected={isCloudConnected}
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
        {activeTab === 'dashboard' && <Dashboard data={data} setActiveTab={setActiveTab} />}
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

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        <p>
          {data.company?.name} • ASR Dyeing Solutions Cloud ERP • Reverse Engineered from Microsoft Access FDB Systems
        </p>
      </footer>

    </div>
  );
}
