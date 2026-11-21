import React, { useState } from 'react';
import { 
  Database, 
  Users, 
  Tag, 
  Cpu, 
  Palette, 
  Plus, 
  Search, 
  Building2,
  Trash2
} from 'lucide-react';

export default function MastersModule({ data, onUpdateData }) {
  const [subTab, setSubTab] = useState('parties');

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">Master Records & System Configuration</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Maintain parties, fabric qualities, dyes/chemicals catalog, dyeing vessels & shade formulations
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex space-x-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setSubTab('parties')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              subTab === 'parties' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Parties ({data.parties?.length})
          </button>
          <button
            onClick={() => setSubTab('items')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              subTab === 'items' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Items & Dyes ({data.items?.length})
          </button>
          <button
            onClick={() => setSubTab('machines')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              subTab === 'machines' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Machinery ({data.machines?.length})
          </button>
          <button
            onClick={() => setSubTab('shades')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              subTab === 'shades' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Shades ({data.shades?.length})
          </button>
        </div>
      </div>

      {/* Sub-tab 1: Parties */}
      {subTab === 'parties' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">Parties Master (Customers & Chemical Vendors)</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Party Name</th>
                  <th className="py-2.5 px-3">Contact Person</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">GSTIN</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3 text-right">Ledger Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data.parties?.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/20">
                    <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">{p.code}</td>
                    <td className="py-2.5 px-3 font-semibold text-white">{p.name}</td>
                    <td className="py-2.5 px-3 text-slate-300">{p.contactPerson}</td>
                    <td className="py-2.5 px-3 text-slate-400">{p.phone}</td>
                    <td className="py-2.5 px-3 text-slate-300">{p.city}, {p.state}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{p.gstin}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        p.type === 'Customer' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                      }`}>
                        {p.type}
                      </span>
                    </td>
                    <td className={`py-2.5 px-3 text-right font-bold ${p.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ₹{Math.abs(p.balance).toLocaleString()} {p.balance >= 0 ? 'Dr' : 'Cr'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Items & Chemicals */}
      {subTab === 'items' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">Item Master (Fabrics, Dyes, Salts & Chemicals)</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Inventory Group</th>
                  <th className="py-2.5 px-3">HSN Code</th>
                  <th className="py-2.5 px-3 text-center">Unit</th>
                  <th className="py-2.5 px-3 text-right">Cost (₹/KG)</th>
                  <th className="py-2.5 px-3 text-right">Stock (KG)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data.items?.map((it) => (
                  <tr key={it.id} className="hover:bg-slate-800/20">
                    <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">{it.code}</td>
                    <td className="py-2.5 px-3 font-medium text-white">{it.name}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        it.group === 'Fabric' ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20' :
                        it.group === 'Dye' ? 'bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20' :
                        'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      }`}>
                        {it.group} (Grp {it.groupId})
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{it.hsn || '9988'}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-300">{it.unit}</td>
                    <td className="py-2.5 px-3 text-right text-slate-300">
                      {it.costPerKg ? `₹${it.costPerKg}` : '— (Job Work)'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-white">
                      {it.stock !== undefined ? `${it.stock} KG` : 'Customer WIP'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 3: Machines */}
      {subTab === 'machines' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">Machinery & Dyeing Vessels Master</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Machine Code</th>
                  <th className="py-2.5 px-3">Machine Name</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3 text-right">Max Capacity (KG)</th>
                  <th className="py-2.5 px-3 text-center">Standard Liquor Ratio (M:L)</th>
                  <th className="py-2.5 px-3 text-center">Floor Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data.machines?.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/20">
                    <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">{m.code}</td>
                    <td className="py-2.5 px-3 font-medium text-white">{m.name}</td>
                    <td className="py-2.5 px-3 text-slate-300">{m.type}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-white">{m.capacityKg} KG</td>
                    <td className="py-2.5 px-3 text-center font-bold text-cyan-400">1 : {m.liquorRatio}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 4: Shades */}
      {subTab === 'shades' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">Shade Library & Depth Formulations</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Shade Code</th>
                  <th className="py-2.5 px-3">Shade Name</th>
                  <th className="py-2.5 px-3">Depth Category</th>
                  <th className="py-2.5 px-3 text-center">Depth Tier</th>
                  <th className="py-2.5 px-3">Recipe Ref ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data.shades?.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/20">
                    <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">{s.code}</td>
                    <td className="py-2.5 px-3 font-semibold text-white">{s.name}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                        {s.depth}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-cyan-400 font-bold">Tier {s.depthVal}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">REC-#{s.recipeId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
