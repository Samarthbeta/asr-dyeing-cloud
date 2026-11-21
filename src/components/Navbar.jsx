import React, { useState } from 'react';
import { 
  Layers, 
  ArrowDownLeft, 
  Cpu, 
  FlaskConical, 
  Truck, 
  ArrowUpRight, 
  ReceiptText, 
  Database, 
  Settings, 
  Search, 
  Clock, 
  Menu, 
  X, 
  Factory,
  QrCode,
  Activity,
  History,
  UserCheck
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  data, 
  searchQuery, 
  setSearchQuery, 
  isCloudConnected,
  onOpenCommandPalette,
  onOpenQr,
  onOpenTelemetry,
  onOpenAudit,
  currentRole,
  setCurrentRole
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'inward', label: 'Grey Inward (IGR)', icon: ArrowDownLeft, badge: data.igrs?.length },
    { id: 'jobcards', label: 'Job Cards & Batches', icon: Cpu, badge: data.jobCards?.length },
    { id: 'recipes', label: 'Recipe & Chemistry', icon: FlaskConical },
    { id: 'floor', label: 'Floor WIP & Gate Pass', icon: Truck },
    { id: 'dispatch', label: 'Dispatch & Shrinkage', icon: ArrowUpRight, badge: data.dispatches?.length },
    { id: 'billing', label: 'GST Invoicing', icon: ReceiptText },
    { id: 'masters', label: 'Masters', icon: Database },
    { id: 'settings', label: 'Cloud & Sync', icon: Settings }
  ];

  const roles = [
    { id: 'gm', name: 'Mill Owner / GM' },
    { id: 'master', name: 'Dyeing Master' },
    { id: 'operator', name: 'Weighbridge Clerk' },
    { id: 'accountant', name: 'Billing Accountant' }
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Mill Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold tracking-tight text-white text-base sm:text-lg">ASR DYEING ERP</span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded">ENTERPRISE</span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Mohinder Dyeing & Finishing House • Ludhiana</p>
            </div>
          </div>

          {/* Linear-Style Command Palette Trigger (Ctrl+K) */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden md:flex items-center space-x-2 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition-all cursor-pointer shadow-inner max-w-xs flex-1 mx-4"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span className="flex-1 text-left truncate">Search lot, party, machine...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">Ctrl K</kbd>
          </button>

          {/* Quick Utility Tools: Telemetry, QR, Audit */}
          <div className="hidden lg:flex items-center space-x-2">
            
            <button
              onClick={onOpenTelemetry}
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-amber-400 rounded-lg text-xs border border-slate-800 transition-colors cursor-pointer"
              title="Open Live Dyeing Vessel Telemetry"
            >
              <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>SCADA</span>
            </button>

            <button
              onClick={onOpenQr}
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 rounded-lg text-xs border border-slate-800 transition-colors cursor-pointer"
              title="Generate 4x2 Thermal Roll QR Labels"
            >
              <QrCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>Roll Labels</span>
            </button>

            <button
              onClick={onOpenAudit}
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-purple-400 rounded-lg text-xs border border-slate-800 transition-colors cursor-pointer"
              title="View Immutable Audit Log"
            >
              <History className="w-3.5 h-3.5 text-purple-400" />
              <span>Audit</span>
            </button>

            {/* Role Switcher */}
            <div className="flex items-center space-x-1 pl-2 border-l border-slate-800">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 cursor-pointer focus:border-cyan-500"
              >
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <nav className="bg-slate-950 border-t border-slate-800/80 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-1 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-t border-slate-800 px-4 pt-2 pb-4 space-y-1">
          <div className="pb-2 pt-1 flex gap-2">
            <button
              onClick={() => { onOpenCommandPalette(); setMobileMenuOpen(false); }}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 text-left flex items-center space-x-2"
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Search (Command Palette)...</span>
            </button>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
