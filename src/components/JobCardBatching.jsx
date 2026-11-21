import React, { useState } from 'react';
import { 
  Cpu, 
  Plus, 
  Printer, 
  CheckCircle, 
  FlaskConical, 
  Droplets, 
  Layers, 
  X, 
  AlertCircle,
  Clock
} from 'lucide-react';

export default function JobCardBatching({ data, onSaveJobCard }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedJC, setSelectedJC] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    jcNo: `JC-${new Date().getFullYear()}-${String(data.jobCards?.length + 43).padStart(4, '0')}`,
    date: new Date().toISOString().split('T')[0],
    machineId: data.machines?.[0]?.id || 1,
    selectedLotNo: data.igrs?.[0]?.lots?.[0]?.lotNo || '',
    batchWeightKg: data.igrs?.[0]?.lots?.[0]?.weightKg || 350.0,
    rolls: data.igrs?.[0]?.lots?.[0]?.rolls || 15,
    shadeId: data.shades?.[0]?.id || 1,
    depth: "Extra Dark",
    liquorRatio: 6
  });

  const selectedMachine = data.machines?.find(m => m.id === parseInt(formData.machineId));
  const capacity = selectedMachine ? selectedMachine.capacityKg : 400;
  const currentRatio = formData.liquorRatio || 6;
  const waterBath = Math.round((parseFloat(formData.batchWeightKg) || 0) * currentRatio);
  const capacityPercent = Math.min(100, Math.round(((parseFloat(formData.batchWeightKg) || 0) / capacity) * 100));

  const handleMachineChange = (mId) => {
    const m = data.machines?.find(mach => mach.id === parseInt(mId));
    setFormData({
      ...formData,
      machineId: mId,
      liquorRatio: m ? m.liquorRatio : 6
    });
  };

  const handleLotSelect = (lotNo) => {
    // Find lot in IGRs
    for (const igr of data.igrs || []) {
      const match = igr.lots?.find(l => l.lotNo === lotNo);
      if (match) {
        setFormData({
          ...formData,
          selectedLotNo: lotNo,
          batchWeightKg: match.weightKg,
          rolls: match.rolls,
          shadeId: match.shadeId || 1,
          depth: match.depth || "Dark"
        });
        break;
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let targetLot = null;
    let parentIGR = null;
    for (const igr of data.igrs || []) {
      const match = igr.lots?.find(l => l.lotNo === formData.selectedLotNo);
      if (match) {
        targetLot = match;
        parentIGR = igr;
        break;
      }
    }

    const shade = data.shades?.find(s => s.id === parseInt(formData.shadeId));
    const recipe = data.standardRecipes?.find(r => r.id === (shade ? shade.recipeId : 1001)) || data.standardRecipes?.[0];

    // Compute chemical & dye requirements
    const batchWeight = parseFloat(formData.batchWeightKg) || 400;
    const waterLiters = batchWeight * currentRatio;

    const chemicalDosing = [];
    let totalChemCost = 0;

    // 1. Dyes (% o.w.f.)
    recipe?.dyes?.forEach(dye => {
      const dyeItem = data.items?.find(i => i.id === dye.itemId);
      const reqKg = (batchWeight * dye.dosagePercent) / 100;
      const unitCost = dyeItem ? dyeItem.costPerKg : 380;
      const cost = reqKg * unitCost;
      totalChemCost += cost;
      chemicalDosing.push({
        name: dye.name,
        formula: "% o.w.f.",
        dosage: `${dye.dosagePercent}%`,
        requiredKg: parseFloat(reqKg.toFixed(2)),
        unitCost,
        cost: parseFloat(cost.toFixed(2))
      });
    });

    // 2. Chemicals (g/L bath)
    recipe?.chemicals?.forEach(chem => {
      const chemItem = data.items?.find(i => i.id === chem.itemId);
      const reqKg = (waterLiters * chem.gpl) / 1000;
      const unitCost = chemItem ? chemItem.costPerKg : 25;
      const cost = reqKg * unitCost;
      totalChemCost += cost;
      chemicalDosing.push({
        name: chemItem ? chemItem.name : "Chemical",
        formula: "g/L bath",
        dosage: `${chem.gpl} g/L`,
        requiredKg: parseFloat(reqKg.toFixed(2)),
        unitCost,
        cost: parseFloat(cost.toFixed(2))
      });
    });

    const newJobCard = {
      id: Date.now(),
      jcNo: formData.jcNo,
      date: formData.date,
      machineId: parseInt(formData.machineId),
      machineCode: selectedMachine ? selectedMachine.code : "SF-01",
      vesselName: selectedMachine ? selectedMachine.name : "Vessel",
      lotNo: formData.selectedLotNo,
      partyName: parentIGR ? parentIGR.partyName : "Customer",
      fabricName: targetLot ? targetLot.itemName : "Fabric",
      batchWeightKg: batchWeight,
      rolls: parseInt(formData.rolls) || 15,
      shadeId: parseInt(formData.shadeId),
      shadeName: shade ? shade.name : "Shade",
      depth: formData.depth,
      liquorRatio: currentRatio,
      waterBathLiters: waterLiters,
      status: "In Dyeing",
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      chemicalCost: parseFloat(totalChemCost.toFixed(2)),
      costPerKg: parseFloat((totalChemCost / batchWeight).toFixed(2)),
      chemicalsDosed: chemicalDosing
    };

    onSaveJobCard(newJobCard);
    setShowModal(false);

    // Reset Form
    setFormData({
      jcNo: `JC-${new Date().getFullYear()}-${String(data.jobCards?.length + 44).padStart(4, '0')}`,
      date: new Date().toISOString().split('T')[0],
      machineId: data.machines?.[0]?.id || 1,
      selectedLotNo: '',
      batchWeightKg: 400.0,
      rolls: 18,
      shadeId: 1,
      depth: "Dark",
      liquorRatio: 6
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">Job Card & Vessel Batching Studio</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Allocate customer lots to Soft Flow / Jet dyeing vessels & auto-generate chemical dispensing sheets
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Batch Job Card</span>
        </button>
      </div>

      {/* Active Job Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {data.jobCards?.map((jc) => (
          <div key={jc.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-all">
            
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-base font-bold text-cyan-400">{jc.jcNo}</span>
                <span className="text-xs text-slate-400 ml-3">Vessel: <strong className="text-white">{jc.machineCode}</strong></span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                jc.status === 'In Dyeing' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                jc.status === 'Washing' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' :
                'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              }`}>
                {jc.status}
              </span>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
              <div>Customer: <strong className="text-slate-200 block truncate">{jc.partyName}</strong></div>
              <div>Fabric Quality: <strong className="text-slate-200 block truncate">{jc.fabricName}</strong></div>
              <div>Assigned Lot: <strong className="text-cyan-400 font-mono block">{jc.lotNo}</strong></div>
              <div>Target Shade: <strong className="text-slate-200 block">{jc.shadeName} ({jc.depth})</strong></div>
            </div>

            {/* Physical Bath Math */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-center">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-medium">Batch Weight</p>
                <p className="text-sm font-bold text-white mt-0.5">{jc.batchWeightKg} KG</p>
                <p className="text-[10px] text-slate-400">{jc.rolls} Rolls</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-medium">Liquor Bath</p>
                <p className="text-sm font-bold text-cyan-400 mt-0.5">{jc.waterBathLiters} L</p>
                <p className="text-[10px] text-slate-400">M:L 1:{jc.liquorRatio}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-medium">Chemical Cost</p>
                <p className="text-sm font-bold text-emerald-400 mt-0.5">₹{jc.chemicalCost}</p>
                <p className="text-[10px] text-slate-400">₹{jc.costPerKg}/KG</p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Started: {jc.startTime || "10:00 AM"}</span>
              </span>
              <button
                onClick={() => setSelectedJC(jc)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium cursor-pointer transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-cyan-400" />
                <span>Print Dosing Slip</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Modal: Create Job Card */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-bold text-white">Schedule New Dyeing Job Card</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Job Card No</label>
                  <input
                    type="text"
                    value={formData.jcNo}
                    readOnly
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Batch Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Vessel Selection */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Select Dyeing Vessel / Machine *</label>
                <select
                  value={formData.machineId}
                  onChange={(e) => handleMachineChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                >
                  {data.machines?.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.code} - {m.name} (Capacity: {m.capacityKg} KG, M:L 1:{m.liquorRatio})
                    </option>
                  ))}
                </select>
              </div>

              {/* Lot Picker */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Select Inward Lot to Process *</label>
                <select
                  value={formData.selectedLotNo}
                  onChange={(e) => handleLotSelect(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-cyan-400"
                >
                  <option value="">-- Choose Lot from Grey Inward --</option>
                  {data.igrs?.flatMap(igr => igr.lots?.map(l => ({ ...l, partyName: igr.partyName }))).map((l, i) => (
                    <option key={i} value={l.lotNo}>
                      {l.lotNo} • {l.partyName} • {l.itemName} ({l.weightKg} KG, {l.rolls} Rolls)
                    </option>
                  ))}
                </select>
              </div>

              {/* Batch Weight & Capacity Visualizer */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Vessel Loading Capacity:</span>
                  <span className="font-bold text-white">{formData.batchWeightKg} / {capacity} KG ({capacityPercent}%)</span>
                </div>
                
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      capacityPercent > 98 ? 'bg-amber-400' : 'bg-cyan-500'
                    }`}
                    style={{ width: `${capacityPercent}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div>
                    <label className="block text-[10px] text-slate-500">Liquor Ratio (M:L)</label>
                    <input
                      type="number"
                      min="1"
                      max="15"
                      value={formData.liquorRatio}
                      onChange={(e) => setFormData({ ...formData, liquorRatio: parseInt(e.target.value) || 6 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500">Total Water Bath (Auto)</label>
                    <div className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-bold text-cyan-400">
                      {waterBath} Liters
                    </div>
                  </div>
                </div>
              </div>

              {/* Shade Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Target Shade Formula</label>
                  <select
                    value={formData.shadeId}
                    onChange={(e) => setFormData({ ...formData, shadeId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    {data.shades?.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.depth})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Depth Category</label>
                  <select
                    value={formData.depth}
                    onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option>Light</option>
                    <option>Medium</option>
                    <option>Dark</option>
                    <option>Extra Dark</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold rounded-lg shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  Generate Job Card & Dosing Sheet
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal: Print Dosing Sheet */}
      {selectedJC && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8 print:m-0 print:p-0">
            
            {/* Header */}
            <div className="text-center border-b pb-3">
              <h2 className="text-lg font-black uppercase tracking-tight text-slate-900">{data.company?.name}</h2>
              <p className="text-xs text-slate-600">{data.company?.address}, {data.company?.city}</p>
              <h3 className="text-sm font-bold mt-2 uppercase tracking-wide bg-slate-100 py-1 border border-slate-300">
                DYEING VESSEL DISPENSE & JOB CARD SLIP
              </h3>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 text-xs gap-2 py-2 border-b">
              <div><strong>Job Card No:</strong> {selectedJC.jcNo}</div>
              <div><strong>Date:</strong> {selectedJC.date}</div>
              <div><strong>Vessel / Machine:</strong> {selectedJC.machineCode} ({selectedJC.vesselName})</div>
              <div><strong>Customer Party:</strong> {selectedJC.partyName}</div>
              <div><strong>Fabric Quality:</strong> {selectedJC.fabricName}</div>
              <div><strong>Assigned Lot:</strong> {selectedJC.lotNo} ({selectedJC.rolls} Rolls)</div>
              <div><strong>Batch Weight:</strong> {selectedJC.batchWeightKg} KG</div>
              <div><strong>Liquor Ratio:</strong> 1:{selectedJC.liquorRatio} ({selectedJC.waterBathLiters} Liters Bath)</div>
              <div><strong>Target Shade:</strong> {selectedJC.shadeName}</div>
              <div><strong>Depth:</strong> {selectedJC.depth}</div>
            </div>

            {/* Chemicals Dosing Table */}
            <div>
              <h4 className="text-xs font-bold uppercase mb-1">Dyes & Chemicals Dispensing Breakdown</h4>
              <table className="w-full text-xs text-left border">
                <thead className="bg-slate-100 border-b">
                  <tr>
                    <th className="p-1.5 border-r">Material Description</th>
                    <th className="p-1.5 border-r">Formula Basis</th>
                    <th className="p-1.5 border-r">Dosage</th>
                    <th className="p-1.5 border-r text-right font-black">Req Weight (KG)</th>
                    <th className="p-1.5 text-right">Cost (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedJC.chemicalsDosed?.map((c, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-1.5 border-r font-medium">{c.name}</td>
                      <td className="p-1.5 border-r text-slate-600">{c.formula}</td>
                      <td className="p-1.5 border-r font-mono">{c.dosage}</td>
                      <td className="p-1.5 border-r text-right font-bold text-slate-900 bg-slate-50">{c.requiredKg} KG</td>
                      <td className="p-1.5 text-right text-slate-600">₹{c.cost}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-100 font-bold">
                  <tr>
                    <td colSpan="4" className="p-1.5 text-right border-r">TOTAL CHEMICAL COST:</td>
                    <td className="p-1.5 text-right text-emerald-700">₹{selectedJC.chemicalCost}</td>
                  </tr>
                </tfoot>
              </table>
              <p className="text-[11px] text-slate-600 mt-1 italic">
                Batch processing cost: ₹{selectedJC.costPerKg} per KG of fabric.
              </p>
            </div>

            {/* Operator Signature */}
            <div className="grid grid-cols-2 pt-6 text-xs text-center">
              <div>
                <p className="border-t border-slate-400 w-44 mx-auto pt-1">Machine Operator / Doser</p>
              </div>
              <div>
                <p className="border-t border-slate-400 w-44 mx-auto pt-1 font-semibold">Dyeing Master Approval</p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t print:hidden">
              <button
                onClick={() => setSelectedJC(null)}
                className="px-4 py-1.5 bg-slate-200 text-slate-800 rounded text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 bg-cyan-600 text-white rounded text-xs font-semibold cursor-pointer"
              >
                Print Slip
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
