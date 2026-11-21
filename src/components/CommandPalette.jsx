import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ArrowRight, 
  Layers, 
  Cpu, 
  FlaskConical, 
  Truck, 
  ArrowUpRight, 
  ReceiptText, 
  Database, 
  Settings, 
  QrCode,
  X,
  Activity,
  History
} from 'lucide-react';

export default function CommandPalette({ isOpen, onClose, data, setActiveTab, onOpenQr, onOpenTelemetry, onOpenAudit }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter lots
  const lots = data.igrs?.flatMap(i => i.lots?.map(l => ({ ...l, partyName: i.partyName }))) || [];
  const filteredLots = query ? lots.filter(l => 
    l.lotNo.toLowerCase().includes(query.toLowerCase()) ||
    l.itemName.toLowerCase().includes(query.toLowerCase()) ||
    l.partyName.toLowerCase().includes(query.toLowerCase()) ||
    l.shadeName.toLowerCase().includes(query.toLowerCase())
  ) : lots.slice(0, 4);

  // Quick action commands
  const actions = [
    { id: 'inward', title: 'New Grey Inward (IGR)', category: 'Actions', icon: ArrowDownLeft, run: () => { setActiveTab('inward'); onClose(); } },
    { id: 'jobcard', title: 'Schedule Batch Job Card', category: 'Actions', icon: Cpu, run: () => { setActiveTab('jobcards'); onClose(); } },
    { id: 'recipe', title: 'Open Recipe Dosing Lab', category: 'Actions', icon: FlaskConical, run: () => { setActiveTab('recipes'); onClose(); } },
    { id: 'dispatch', title: 'Generate Dispatch Challan', category: 'Actions', icon: ArrowUpRight, run: () => { setActiveTab('dispatch'); onClose(); } },
    { id: 'qr', title: 'Print Thermal Roll QR Stickers', category: 'Tools', icon: QrCode, run: () => { onOpenQr(); onClose(); } },
    { id: 'telemetry', title: 'Live Vessel Telemetry & Heat Curve', category: 'Tools', icon: Activity, run: () => { onOpenTelemetry(); onClose(); } },
    { id: 'audit', title: 'System Event Sourcing Audit Trail', category: 'Compliance', icon: History, run: () => { onOpenAudit(); onClose(); } }
  ].filter(a => a.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <Search className="w-5 h-5 text-cyan-400 mr-3" />
          <input
            type="text"
            autoFocus
            placeholder="Type a lot number, customer, machine, or action... (e.g. '8801', 'Oswal', 'QR')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-0 text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button onClick={onClose} className="text-slate-500 hover:text-white px-1.5 py-0.5 rounded text-xs">
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          
          {/* Quick Actions */}
          {actions.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1">Direct Actions</p>
              <div className="space-y-1">
                {actions.map((act) => {
                  return (
                    <button
                      key={act.id}
                      onClick={act.run}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer text-left group"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                        <span className="font-medium">{act.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 group-hover:text-cyan-400">&rarr;</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Traceable Lots Matching */}
          {filteredLots.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1">Traceable Customer Lots</p>
              <div className="space-y-1">
                {filteredLots.map((lot, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setActiveTab('inward');
                      onClose();
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs bg-slate-950/40 hover:bg-slate-800/60 border border-slate-800/60 transition-colors cursor-pointer"
                  >
                    <div>
                      <span className="font-mono font-bold text-cyan-400 mr-2">{lot.lotNo}</span>
                      <span className="text-white font-medium">{lot.partyName}</span>
                      <span className="text-slate-400 ml-2">({lot.itemName})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-200">{lot.weightKg} KG</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-800 text-cyan-300">
                        {lot.shadeName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/80 text-[11px] text-slate-500 flex justify-between items-center">
          <span>Navigate with mouse or keyboard</span>
          <span>Press <strong>ESC</strong> to dismiss</span>
        </div>

      </div>
    </div>
  );
}

function ArrowDownLeft(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="17" y1="7" x2="7" y2="17"></line>
      <polyline points="17 17 7 17 7 7"></polyline>
    </svg>
  );
}
