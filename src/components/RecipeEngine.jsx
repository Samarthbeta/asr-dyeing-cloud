import React, { useState } from 'react';
import { 
  FlaskConical, 
  Plus, 
  Trash2, 
  Printer, 
  Calculator, 
  Sparkles, 
  Check, 
  DollarSign,
  Layers,
  Droplets
} from 'lucide-react';

export default function RecipeEngine({ data, onAddRecipe }) {
  const [batchWeight, setBatchWeight] = useState(400);
  const [liquorRatio, setLiquorRatio] = useState(6);
  const [selectedPreset, setSelectedPreset] = useState('1001');

  // Interactive Recipe Builder State
  const [recipeName, setRecipeName] = useState("Custom Lab Formulation");
  const [dyes, setDyes] = useState([
    { itemId: 11, name: "Reactive Black B 133%", dosagePercent: 4.80, costPerKg: 380 }
  ]);
  const [chemicals, setChemicals] = useState([
    { itemId: 21, name: "Glauber's Salt (Sodium Sulphate)", gpl: 80, costPerKg: 16 },
    { itemId: 22, name: "Soda Ash (Sodium Carbonate)", gpl: 20, costPerKg: 34 },
    { itemId: 26, name: "Low Foaming Wetting Agent LF", gpl: 1.5, costPerKg: 110 }
  ]);

  const waterBathLiters = batchWeight * liquorRatio;

  // Calculations
  const calculatedDyes = dyes.map(d => {
    const reqKg = (batchWeight * d.dosagePercent) / 100;
    const cost = reqKg * d.costPerKg;
    return { ...d, reqKg, cost };
  });

  const calculatedChemicals = chemicals.map(c => {
    const reqKg = (waterBathLiters * c.gpl) / 1000;
    const cost = reqKg * c.costPerKg;
    return { ...c, reqKg, cost };
  });

  const totalDyeCost = calculatedDyes.reduce((sum, d) => sum + d.cost, 0);
  const totalChemCost = calculatedChemicals.reduce((sum, c) => sum + c.cost, 0);
  const grandTotalCost = totalDyeCost + totalChemCost;
  const costPerKg = batchWeight > 0 ? (grandTotalCost / batchWeight).toFixed(2) : "0.00";

  const handleApplyPreset = (presetId) => {
    setSelectedPreset(presetId);
    const found = data.standardRecipes?.find(r => r.id === parseInt(presetId));
    if (found) {
      setRecipeName(found.shadeName);
      setLiquorRatio(found.liquorRatioDefault || 6);

      const mappedDyes = found.dyes.map(d => {
        const item = data.items?.find(i => i.id === d.itemId);
        return {
          itemId: d.itemId,
          name: d.name,
          dosagePercent: d.dosagePercent,
          costPerKg: item ? item.costPerKg : 380
        };
      });

      const mappedChems = found.chemicals.map(c => {
        const item = data.items?.find(i => i.id === c.itemId);
        return {
          itemId: c.itemId,
          name: item ? item.name : "Chemical",
          gpl: c.gpl,
          costPerKg: item ? item.costPerKg : 25
        };
      });

      setDyes(mappedDyes);
      setChemicals(mappedChems);
    }
  };

  const handleAddDyeRow = () => {
    const dyeItem = data.items?.find(i => i.group === 'Dye');
    setDyes([
      ...dyes,
      {
        itemId: dyeItem ? dyeItem.id : 11,
        name: dyeItem ? dyeItem.name : "Reactive Dye",
        dosagePercent: 1.0,
        costPerKg: dyeItem ? dyeItem.costPerKg : 380
      }
    ]);
  };

  const handleAddChemRow = () => {
    const chemItem = data.items?.find(i => i.group === 'Chemical' || i.group === 'Auxiliary');
    setChemicals([
      ...chemicals,
      {
        itemId: chemItem ? chemItem.id : 21,
        name: chemItem ? chemItem.name : "Chemical Auxiliary",
        gpl: 10.0,
        costPerKg: chemItem ? chemItem.costPerKg : 25
      }
    ]);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <FlaskConical className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">Dyeing Recipe & Chemistry Engine</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Precision dosing: % o.w.f. for dyes and g/L for chemical water bath with real-time cost-per-KG
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 hidden sm:inline">Load Preset:</span>
          <select
            value={selectedPreset}
            onChange={(e) => handleApplyPreset(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-cyan-400 cursor-pointer focus:border-cyan-500"
          >
            {data.standardRecipes?.map((r) => (
              <option key={r.id} value={r.id}>{r.shadeName} ({r.depth})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Physics / Batch Input Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Batch Fabric Weight (KG)</label>
          <input
            type="number"
            min="10"
            max="1500"
            value={batchWeight}
            onChange={(e) => setBatchWeight(parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-bold text-white focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Liquor Ratio (M : L)</label>
          <input
            type="number"
            min="1"
            max="15"
            value={liquorRatio}
            onChange={(e) => setLiquorRatio(parseInt(e.target.value) || 6)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-bold text-cyan-400 focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Total Water Bath (Liters)</label>
          <div className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono font-bold text-cyan-400 flex items-center justify-between">
            <span>{waterBathLiters.toLocaleString()} L</span>
            <Droplets className="w-4 h-4 text-cyan-500" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Batch Cost Per KG</label>
          <div className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono font-bold text-emerald-400 flex items-center justify-between">
            <span>₹{costPerKg} / KG</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Dyes Calculator Table (% o.w.f.) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-400"></span>
              <span>1. Dyes Formula (% on Weight of Fabric — % o.w.f.)</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
              Formula: Dye Required (KG) = (Batch Weight × Shade %) ÷ 100
            </p>
          </div>
          <button
            onClick={handleAddDyeRow}
            className="flex items-center space-x-1 px-2.5 py-1.5 bg-fuchsia-500/20 text-fuchsia-300 hover:bg-fuchsia-500/30 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Dye</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Dye Item</th>
                <th className="py-2.5 px-3 w-32">Shade %</th>
                <th className="py-2.5 px-3 text-right">Required Wt (KG)</th>
                <th className="py-2.5 px-3 text-right">Cost / KG</th>
                <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                <th className="py-2.5 px-3 w-12 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {calculatedDyes.map((dye, idx) => (
                <tr key={idx} className="hover:bg-slate-800/20">
                  <td className="py-2.5 px-3">
                    <select
                      value={dye.itemId}
                      onChange={(e) => {
                        const it = data.items?.find(i => i.id === parseInt(e.target.value));
                        const upd = [...dyes];
                        upd[idx].itemId = it.id;
                        upd[idx].name = it.name;
                        upd[idx].costPerKg = it.costPerKg || 380;
                        setDyes(upd);
                      }}
                      className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white max-w-xs"
                    >
                      {data.items?.filter(i => i.group === 'Dye').map((it) => (
                        <option key={it.id} value={it.id}>{it.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center space-x-1">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={dye.dosagePercent}
                        onChange={(e) => {
                          const upd = [...dyes];
                          upd[idx].dosagePercent = parseFloat(e.target.value) || 0;
                          setDyes(upd);
                        }}
                        className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-cyan-400 font-bold text-right"
                      />
                      <span className="text-slate-400">%</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-white text-right">
                    {dye.reqKg.toFixed(2)} KG
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-right">₹{dye.costPerKg}</td>
                  <td className="py-2.5 px-3 font-semibold text-emerald-400 text-right">
                    ₹{dye.cost.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => setDyes(dyes.filter((_, i) => i !== idx))}
                      disabled={dyes.length === 1}
                      className="p-1 text-rose-400 hover:text-rose-300 disabled:opacity-20 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-950 font-bold border-t border-slate-800">
              <tr>
                <td colSpan="4" className="py-2.5 px-3 text-right text-slate-400">Total Dyes Cost:</td>
                <td className="py-2.5 px-3 text-right text-emerald-400">₹{totalDyeCost.toFixed(2)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Chemicals Calculator Table (g/L Bath) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <span>2. Chemicals & Auxiliaries Formula (Grams Per Liter — g/L)</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
              Formula: Chemical Required (KG) = (Water Bath Liters × g/L) ÷ 1,000
            </p>
          </div>
          <button
            onClick={handleAddChemRow}
            className="flex items-center space-x-1 px-2.5 py-1.5 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Chemical</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Chemical Auxiliary</th>
                <th className="py-2.5 px-3 w-32">Concentration (g/L)</th>
                <th className="py-2.5 px-3 text-right">Required Wt (KG)</th>
                <th className="py-2.5 px-3 text-right">Cost / KG</th>
                <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                <th className="py-2.5 px-3 w-12 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {calculatedChemicals.map((chem, idx) => (
                <tr key={idx} className="hover:bg-slate-800/20">
                  <td className="py-2.5 px-3">
                    <select
                      value={chem.itemId}
                      onChange={(e) => {
                        const it = data.items?.find(i => i.id === parseInt(e.target.value));
                        const upd = [...chemicals];
                        upd[idx].itemId = it.id;
                        upd[idx].name = it.name;
                        upd[idx].costPerKg = it.costPerKg || 25;
                        setChemicals(upd);
                      }}
                      className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white max-w-xs"
                    >
                      {data.items?.filter(i => i.group === 'Chemical' || i.group === 'Auxiliary').map((it) => (
                        <option key={it.id} value={it.id}>{it.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center space-x-1">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={chem.gpl}
                        onChange={(e) => {
                          const upd = [...chemicals];
                          upd[idx].gpl = parseFloat(e.target.value) || 0;
                          setChemicals(upd);
                        }}
                        className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-cyan-400 font-bold text-right"
                      />
                      <span className="text-slate-400">g/L</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-white text-right">
                    {chem.reqKg.toFixed(2)} KG
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-right">₹{chem.costPerKg}</td>
                  <td className="py-2.5 px-3 font-semibold text-emerald-400 text-right">
                    ₹{chem.cost.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => setChemicals(chemicals.filter((_, i) => i !== idx))}
                      disabled={chemicals.length === 1}
                      className="p-1 text-rose-400 hover:text-rose-300 disabled:opacity-20 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-950 font-bold border-t border-slate-800">
              <tr>
                <td colSpan="4" className="py-2.5 px-3 text-right text-slate-400">Total Chemicals Cost:</td>
                <td className="py-2.5 px-3 text-right text-emerald-400">₹{totalChemCost.toFixed(2)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Grand Summary Box */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-cyan-500/30 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-white">Total Formulation Cost</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Combined expenditure for {batchWeight} KG fabric lot in {waterBathLiters}L water bath (M:L 1:{liquorRatio})
          </p>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <span className="text-xs text-slate-400">Total Material Cost:</span>
            <p className="text-2xl font-black text-cyan-400">₹{grandTotalCost.toFixed(2)}</p>
          </div>
          <div className="text-right border-l border-slate-800 pl-6">
            <span className="text-xs text-slate-400">Cost / KG of Cloth:</span>
            <p className="text-2xl font-black text-emerald-400">₹{costPerKg}</p>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer border border-slate-700"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

    </div>
  );
}
