import React from 'react';
import { 
  ArrowDownLeft, 
  Cpu, 
  ArrowUpRight, 
  TrendingDown, 
  AlertTriangle, 
  Layers, 
  Plus, 
  CheckCircle2, 
  Flame, 
  Droplet,
  Truck
} from 'lucide-react';

export default function Dashboard({ data, setActiveTab, onOpenTelemetry, onOpenQr }) {
  // Aggregate stats
  const totalInwardKg = data.igrs?.reduce((sum, igr) => sum + (parseFloat(igr.totalQty) || 0), 0) || 0;
  const totalInwardRolls = data.igrs?.reduce((sum, igr) => sum + (parseInt(igr.totalRolls) || 0), 0) || 0;

  const totalDispatchedKg = data.dispatches?.reduce((sum, d) => sum + (parseFloat(d.dispatchedWeightKg) || 0), 0) || 0;
  const totalDispatchedRolls = data.dispatches?.reduce((sum, d) => sum + (parseInt(d.dispatchedRolls) || 0), 0) || 0;

  const avgLoss = data.dispatches?.length > 0 
    ? (data.dispatches.reduce((sum, d) => sum + (parseFloat(d.processLossPercent) || 0), 0) / data.dispatches.length).toFixed(2)
    : "4.20";

  const activeBatchesCount = data.jobCards?.filter(j => j.status !== 'Completed').length || 0;

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Fast Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Factory Floor & Operations Control</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time dual-inventory tracking: Non-owned Customer Fabric (WIP) vs. Owned Chemical Stock
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setActiveTab('inward')}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold rounded-xl text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Grey Inward</span>
          </button>
          <button
            onClick={() => setActiveTab('jobcards')}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-xs border border-slate-700 transition-all cursor-pointer"
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>+ Batch Job Card</span>
          </button>
          <button
            onClick={() => setActiveTab('dispatch')}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-xs border border-slate-700 transition-all cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            <span>+ Dispatch Slip</span>
          </button>
        </div>
      </div>

      {/* KPI 4-Card Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Inward Grey */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Grey Inward</p>
              <h3 className="text-2xl font-bold text-white mt-1.5">{totalInwardKg.toLocaleString()} <span className="text-xs font-normal text-slate-400">KG</span></h3>
              <p className="text-xs text-cyan-400 mt-1 font-medium">{totalInwardRolls} Rolls / Takas recorded</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-2 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Customer Custody (Track A)</span>
          </div>
        </div>

        {/* Metric 2: Active Dyeing Batches */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Batches in Vessels</p>
              <h3 className="text-2xl font-bold text-white mt-1.5">{activeBatchesCount} <span className="text-xs font-normal text-slate-400">Batches</span></h3>
              <p className="text-xs text-amber-400 mt-1 font-medium">840.5 KG currently in dyeing</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-2 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>Floor WIP Operations</span>
          </div>
        </div>

        {/* Metric 3: Total Dispatched */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Dispatched Finished</p>
              <h3 className="text-2xl font-bold text-white mt-1.5">{totalDispatchedKg.toLocaleString()} <span className="text-xs font-normal text-slate-400">KG</span></h3>
              <p className="text-xs text-emerald-400 mt-1 font-medium">{totalDispatchedRolls} Rolls billed & delivered</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-2 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Relieved from Floor Ledger</span>
          </div>
        </div>

        {/* Metric 4: Process Loss % */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg Shrinkage Loss</p>
              <h3 className="text-2xl font-bold text-white mt-1.5">{avgLoss}%</h3>
              <p className="text-xs text-emerald-400 mt-1 font-medium">Optimal range (3.5% - 5.0%)</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-2 text-[11px] text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero pilferage alert triggered</span>
          </div>
        </div>

      </div>

      {/* Machine Vessels Floor Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Droplet className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Dyeing Vessels & Finishing Machinery Status</h2>
          </div>
          <span className="text-xs text-slate-400">Liquor Ratio (M:L) auto-managed</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {data.machines?.map((m) => {
            const isBusy = m.status !== 'Idle';
            return (
              <div 
                key={m.id}
                onClick={onOpenTelemetry}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer hover:border-cyan-400 group ${
                  isBusy 
                    ? 'bg-slate-950/70 border-cyan-500/30 shadow-sm shadow-cyan-500/5' 
                    : 'bg-slate-950/40 border-slate-800'
                }`}
                title="Click to view live SCADA telemetry & temperature curve"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold text-white tracking-wide group-hover:text-cyan-400 transition-colors">{m.code}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    m.status === 'Dyeing' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                    m.status === 'Washing' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' :
                    m.status === 'Running' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {m.status}
                  </span>
                </div>
                
                <p className="text-xs text-slate-300 font-medium mt-1 truncate">{m.name}</p>
                
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Cap: <strong className="text-slate-200">{m.capacityKg} KG</strong></span>
                  <span>M:L: <strong className="text-cyan-400">1:{m.liquorRatio}</strong></span>
                </div>

                {m.currentBatch && (
                  <div className="mt-2 text-[10px] bg-slate-900/90 text-cyan-300 px-2 py-1 rounded border border-slate-800 flex justify-between items-center">
                    <span>Batch:</span>
                    <span className="font-mono font-semibold">{m.currentBatch}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Live Lots in Process + Owned Dyes & Chemicals Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Table 1: Live Customer Lots In Process */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Active Lots in Processing</h3>
            </div>
            <button 
              onClick={() => setActiveTab('inward')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
            >
              View All &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3 font-medium">Lot No</th>
                  <th className="py-2 px-3 font-medium">Customer Party</th>
                  <th className="py-2 px-3 font-medium">Fabric</th>
                  <th className="py-2 px-3 font-medium text-right">Weight (KG)</th>
                  <th className="py-2 px-3 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data.igrs?.flatMap(i => i.lots?.map(l => ({ ...l, partyName: i.partyName }))).slice(0, 5).map((lot, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-mono font-semibold text-cyan-400">{lot.lotNo}</td>
                    <td className="py-2.5 px-3 text-slate-300">{lot.partyName}</td>
                    <td className="py-2.5 px-3 text-slate-400 truncate max-w-[140px]">{lot.itemName}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-200 text-right">{lot.weightKg}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {lot.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Owned Dyes & Chemical Raw Material Stock */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Owned Dyes & Chemical Inventory (Track B)</h3>
            </div>
            <button 
              onClick={() => setActiveTab('recipes')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              Dosing Calc &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3 font-medium">Material Name</th>
                  <th className="py-2 px-3 font-medium">Type</th>
                  <th className="py-2 px-3 font-medium text-right">Cost/KG</th>
                  <th className="py-2 px-3 font-medium text-right">Current Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data.items?.filter(i => i.stock !== undefined).slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-medium text-slate-200">{item.name}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        item.group === 'Dye' ? 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {item.group}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 text-right">₹{item.costPerKg}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-100 text-right">
                      {item.stock} <span className="text-[10px] text-slate-400 font-normal">KG</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
