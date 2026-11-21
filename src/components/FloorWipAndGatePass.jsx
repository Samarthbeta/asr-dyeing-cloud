import React, { useState } from 'react';
import { 
  Truck, 
  Plus, 
  ArrowRight, 
  Layers, 
  CheckCircle, 
  FileText, 
  Clock, 
  Printer, 
  X,
  Building
} from 'lucide-react';

export default function FloorWipAndGatePass({ data, onSaveGatePass }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedPass, setSelectedPass] = useState(null);

  const [formData, setFormData] = useState({
    ogcNo: `OGC-RGP-${new Date().getFullYear()}-${String(data.gatePasses?.length + 105).padStart(4, '0')}`,
    type: "RGP", // Returnable Gate Pass
    date: new Date().toISOString().split('T')[0],
    partyName: "Guru Nanak Raising Mills",
    purpose: "Wire Raising Job Work",
    selectedLotNo: data.igrs?.[0]?.lots?.[0]?.lotNo || '',
    rolls: 20,
    weightKg: 450.0,
    vehicleNo: "PB-10-GA-1102",
    expectedReturnDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]
  });

  const stages = [
    { id: 'inward', label: '1. Grey Inward (Unbatched)', color: 'border-slate-700 bg-slate-900/60' },
    { id: 'dyeing', label: '2. Wet Dyeing (Soft Flow / Jet)', color: 'border-amber-500/40 bg-amber-500/5' },
    { id: 'outsourced', label: '3. Outsourced WIP (OGC/RGP)', color: 'border-purple-500/40 bg-purple-500/5' },
    { id: 'finishing', label: '4. Stenter & Compacting', color: 'border-cyan-500/40 bg-cyan-500/5' },
    { id: 'ready', label: '5. Inspection & Dispatch Ready', color: 'border-emerald-500/40 bg-emerald-500/5' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    let targetLot = null;
    for (const igr of data.igrs || []) {
      const match = igr.lots?.find(l => l.lotNo === formData.selectedLotNo);
      if (match) {
        targetLot = match;
        break;
      }
    }

    const newPass = {
      id: Date.now(),
      ogcNo: formData.ogcNo,
      type: formData.type,
      date: formData.date,
      partyName: formData.partyName,
      purpose: formData.purpose,
      lotNo: formData.selectedLotNo,
      fabricName: targetLot ? targetLot.itemName : "Knitted Fabric",
      rolls: parseInt(formData.rolls) || 20,
      weightKg: parseFloat(formData.weightKg) || 450,
      vehicleNo: formData.vehicleNo || "N/A",
      expectedReturnDate: formData.expectedReturnDate,
      status: "At Vendor"
    };

    onSaveGatePass(newPass);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <Truck className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">Floor WIP Pipeline & Outward Gate Pass (OGC)</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track lot progress across wet processing stages & issue Returnable Gate Passes (RGP) for outsourced raising or heat-setting
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Issue Outward Gate Pass</span>
        </button>
      </div>

      {/* Visual Kanban Stages */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {stages.map((stg) => (
          <div key={stg.id} className={`p-3.5 rounded-xl border ${stg.color} space-y-3`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">{stg.label}</span>
            </div>

            <div className="space-y-2">
              {stg.id === 'inward' && (
                <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-xs space-y-1">
                  <span className="font-mono text-cyan-400 font-bold block">LOT-26-8803</span>
                  <p className="text-slate-300 font-medium truncate">Fleece Cotton/Poly</p>
                  <p className="text-[10px] text-slate-400">Vardhman • 620 KG (26 R)</p>
                </div>
              )}

              {stg.id === 'dyeing' && (
                <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-amber-400 font-bold">LOT-26-8801</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded">SF-01</span>
                  </div>
                  <p className="text-slate-300 font-medium truncate">Single Jersey Jet Black</p>
                  <p className="text-[10px] text-slate-400">Oswal • 402.5 KG (18 R)</p>
                </div>
              )}

              {stg.id === 'outsourced' && data.gatePasses?.map((gp) => (
                <div key={gp.id} className="p-2.5 bg-slate-950/80 rounded-lg border border-purple-500/30 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-purple-400 font-bold">{gp.lotNo}</span>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded">{gp.type}</span>
                  </div>
                  <p className="text-slate-300 font-medium truncate">{gp.partyName}</p>
                  <p className="text-[10px] text-slate-400">{gp.purpose} • {gp.weightKg} KG</p>
                </div>
              ))}

              {stg.id === 'finishing' && (
                <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-cyan-400 font-bold">LOT-26-8802</span>
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded">TC-01</span>
                  </div>
                  <p className="text-slate-300 font-medium truncate">Cotton Lycra Royal Navy</p>
                  <p className="text-[10px] text-slate-400">Compacting • 438 KG (20 R)</p>
                </div>
              )}

              {stg.id === 'ready' && (
                <div className="p-2.5 bg-slate-950/80 rounded-lg border border-emerald-500/30 text-xs space-y-1">
                  <span className="font-mono text-emerald-400 font-bold block">LOT-26-8790</span>
                  <p className="text-slate-300 font-medium truncate">French Terry Maroon</p>
                  <p className="text-[10px] text-slate-400">QC Passed • 498.5 KG</p>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Outward Gate Passes Register (OGC) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Outward Goods Challans / Gate Passes Register (OGC)</h3>
          </div>
          <span className="text-xs text-slate-400">{data.gatePasses?.length} Gate Passes Recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Pass No (OGC)</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Subcontractor / Mill</th>
                <th className="py-2.5 px-3">Assigned Lot</th>
                <th className="py-2.5 px-3 text-right">Rolls</th>
                <th className="py-2.5 px-3 text-right">Weight (KG)</th>
                <th className="py-2.5 px-3">Outsourced Work</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data.gatePasses?.map((gp) => (
                <tr key={gp.id} className="hover:bg-slate-800/20">
                  <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">{gp.ogcNo}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      {gp.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{gp.date}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-200">{gp.partyName}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-300">{gp.lotNo}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{gp.rolls}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-white">{gp.weightKg}</td>
                  <td className="py-2.5 px-3 text-slate-300">{gp.purpose}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {gp.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => setSelectedPass(gp)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors cursor-pointer"
                    >
                      Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Gate Pass */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-bold text-white">Create Outward Gate Pass (OGC)</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Gate Pass No</label>
                  <input
                    type="text"
                    value={formData.ogcNo}
                    readOnly
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Pass Category</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="RGP">RGP (Returnable Gate Pass)</option>
                    <option value="NRGP">NRGP (Non-Returnable Gate Pass)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Pass Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Expected Return Date</label>
                  <input
                    type="date"
                    value={formData.expectedReturnDate}
                    onChange={(e) => setFormData({ ...formData, expectedReturnDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Subcontractor / External Processing Mill *</label>
                <input
                  type="text"
                  required
                  value={formData.partyName}
                  onChange={(e) => setFormData({ ...formData, partyName: e.target.value })}
                  placeholder="e.g. Guru Nanak Raising & Brushing Mills"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Select Lot No</label>
                  <select
                    value={formData.selectedLotNo}
                    onChange={(e) => setFormData({ ...formData, selectedLotNo: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-cyan-400"
                  >
                    {data.igrs?.flatMap(igr => igr.lots).map((l, i) => (
                      <option key={i} value={l.lotNo}>{l.lotNo} ({l.weightKg} KG, {l.rolls} Rolls)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Outsourced Process</label>
                  <input
                    type="text"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    placeholder="e.g. Wire Raising / Mercerizing"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Rolls</label>
                  <input
                    type="number"
                    value={formData.rolls}
                    onChange={(e) => setFormData({ ...formData, rolls: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white text-right"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Weight (KG)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weightKg}
                    onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold text-right"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Vehicle No</label>
                  <input
                    type="text"
                    value={formData.vehicleNo}
                    onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
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
                  Issue Gate Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Print Gate Pass */}
      {selectedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8 print:m-0 print:p-0">
            <div className="text-center border-b pb-3">
              <h2 className="text-lg font-black uppercase text-slate-900">{data.company?.name}</h2>
              <p className="text-xs text-slate-600">{data.company?.address}, {data.company?.city}</p>
              <h3 className="text-sm font-bold mt-2 uppercase tracking-wide bg-slate-100 py-1 border border-slate-300">
                {selectedPass.type === 'RGP' ? 'RETURNABLE GATE PASS (RGP)' : 'NON-RETURNABLE GATE PASS (NRGP)'}
              </h3>
            </div>

            <div className="grid grid-cols-2 text-xs gap-2 py-2 border-b">
              <div><strong>Gate Pass No:</strong> {selectedPass.ogcNo}</div>
              <div><strong>Date:</strong> {selectedPass.date}</div>
              <div><strong>Subcontractor:</strong> {selectedPass.partyName}</div>
              <div><strong>Vehicle No:</strong> {selectedPass.vehicleNo}</div>
              <div><strong>Lot No:</strong> {selectedPass.lotNo}</div>
              <div><strong>Expected Return:</strong> {selectedPass.expectedReturnDate}</div>
              <div><strong>Outsourced Process:</strong> {selectedPass.purpose}</div>
              <div><strong>Fabric Quality:</strong> {selectedPass.fabricName}</div>
            </div>

            <table className="w-full text-xs text-left border">
              <thead className="bg-slate-100 border-b">
                <tr>
                  <th className="p-1.5 border-r">Item Description</th>
                  <th className="p-1.5 border-r text-right">No of Rolls / Takas</th>
                  <th className="p-1.5 text-right font-bold">Gross Scale Weight (KG)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-1.5 border-r">{selectedPass.fabricName} (Lot: {selectedPass.lotNo})</td>
                  <td className="p-1.5 border-r text-right">{selectedPass.rolls}</td>
                  <td className="p-1.5 text-right font-bold">{selectedPass.weightKg} KG</td>
                </tr>
              </tbody>
            </table>

            <div className="grid grid-cols-2 pt-8 text-xs text-center">
              <div>
                <p className="border-t border-slate-400 w-44 mx-auto pt-1">Security Guard Stamp</p>
              </div>
              <div>
                <p className="border-t border-slate-400 w-44 mx-auto pt-1 font-semibold">Authorized Mill Signatory</p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t print:hidden">
              <button
                onClick={() => setSelectedPass(null)}
                className="px-4 py-1.5 bg-slate-200 text-slate-800 rounded text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 bg-cyan-600 text-white rounded text-xs font-semibold cursor-pointer"
              >
                Print Gate Pass
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
