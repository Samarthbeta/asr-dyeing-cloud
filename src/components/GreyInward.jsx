import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Printer, 
  Check, 
  ArrowDownLeft, 
  Search, 
  X, 
  Building2, 
  FileText,
  Calendar,
  Truck
} from 'lucide-react';

export default function GreyInward({ data, onSaveIGR }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedIGR, setSelectedIGR] = useState(null);
  const [filterParty, setFilterParty] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    igrNo: `IGR-${new Date().getFullYear()}-${String(data.igrs?.length + 813).padStart(4, '0')}`,
    date: new Date().toISOString().split('T')[0],
    partyId: data.parties?.[0]?.id || 101,
    partyChallanNo: '',
    partyChallanDate: new Date().toISOString().split('T')[0],
    vehicleNo: '',
    lots: [
      {
        lotNo: `LOT-26-${String(data.igrs?.length * 2 + 8805)}`,
        itemId: data.items?.[0]?.id || 1,
        rolls: 15,
        weightKg: 350.0,
        shadeId: data.shades?.[0]?.id || 1,
        depth: "Dark",
        processes: ["Bio-wash", "Dyeing", "Stenter", "Compacting"]
      }
    ]
  });

  const availableProcesses = ["Bio-wash", "Scouring", "Dyeing", "Hydro", "Stenter", "Compacting", "Raising", "Peaching"];

  const handleAddLot = () => {
    const nextLotNum = data.igrs?.length * 2 + 8805 + formData.lots.length;
    setFormData({
      ...formData,
      lots: [
        ...formData.lots,
        {
          lotNo: `LOT-26-${nextLotNum}`,
          itemId: data.items?.[0]?.id || 1,
          rolls: 10,
          weightKg: 250.0,
          shadeId: data.shades?.[0]?.id || 1,
          depth: "Medium",
          processes: ["Bio-wash", "Dyeing", "Stenter", "Compacting"]
        }
      ]
    });
  };

  const handleRemoveLot = (idx) => {
    if (formData.lots.length === 1) return;
    setFormData({
      ...formData,
      lots: formData.lots.filter((_, i) => i !== idx)
    });
  };

  const handleLotChange = (idx, field, value) => {
    const updated = [...formData.lots];
    updated[idx][field] = value;
    setFormData({ ...formData, lots: updated });
  };

  const handleToggleProcess = (lotIdx, proc) => {
    const updated = [...formData.lots];
    const currentProcs = updated[lotIdx].processes || [];
    if (currentProcs.includes(proc)) {
      updated[lotIdx].processes = currentProcs.filter(p => p !== proc);
    } else {
      updated[lotIdx].processes = [...currentProcs, proc];
    }
    setFormData({ ...formData, lots: updated });
  };

  const totalFormKg = formData.lots.reduce((sum, l) => sum + (parseFloat(l.weightKg) || 0), 0);
  const totalFormRolls = formData.lots.reduce((sum, l) => sum + (parseInt(l.rolls) || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.partyChallanNo) {
      alert("Please enter customer delivery challan number");
      return;
    }

    const party = data.parties?.find(p => p.id === parseInt(formData.partyId));
    
    const enrichedLots = formData.lots.map(l => {
      const item = data.items?.find(i => i.id === parseInt(l.itemId));
      const shade = data.shades?.find(s => s.id === parseInt(l.shadeId));
      return {
        ...l,
        itemName: item ? item.name : "Fabric",
        shadeName: shade ? shade.name : "Custom Shade",
        status: "Inward Pending"
      };
    });

    const newIGR = {
      id: Date.now(),
      igrNo: formData.igrNo,
      date: formData.date,
      partyId: parseInt(formData.partyId),
      partyName: party ? party.name : "Customer",
      partyChallanNo: formData.partyChallanNo,
      partyChallanDate: formData.partyChallanDate,
      vehicleNo: formData.vehicleNo || "N/A",
      totalQty: totalFormKg,
      totalRolls: totalFormRolls,
      status: "In Process",
      lots: enrichedLots
    };

    onSaveIGR(newIGR);
    setShowModal(false);

    // Reset form
    setFormData({
      igrNo: `IGR-${new Date().getFullYear()}-${String(data.igrs?.length + 814).padStart(4, '0')}`,
      date: new Date().toISOString().split('T')[0],
      partyId: data.parties?.[0]?.id || 101,
      partyChallanNo: '',
      partyChallanDate: new Date().toISOString().split('T')[0],
      vehicleNo: '',
      lots: [
        {
          lotNo: `LOT-26-${String(data.igrs?.length * 2 + 8807)}`,
          itemId: data.items?.[0]?.id || 1,
          rolls: 15,
          weightKg: 350.0,
          shadeId: data.shades?.[0]?.id || 1,
          depth: "Dark",
          processes: ["Bio-wash", "Dyeing", "Stenter", "Compacting"]
        }
      ]
    });
  };

  const filteredIGRs = data.igrs?.filter(igr => {
    if (!filterParty) return true;
    return igr.partyName.toLowerCase().includes(filterParty.toLowerCase()) || 
           igr.igrNo.toLowerCase().includes(filterParty.toLowerCase()) ||
           igr.partyChallanNo.toLowerCase().includes(filterParty.toLowerCase());
  }) || [];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <ArrowDownLeft className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">Grey Cloth Inward Console (IGR)</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Receiving customer un-dyed fabric rolls into mill custody (Track A — Bailee Stock)
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Record Inward Shipment</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by Party, Challan or IGR..."
            value={filterParty}
            onChange={(e) => setFilterParty(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div className="text-xs text-slate-400">
          Showing <strong className="text-white">{filteredIGRs.length}</strong> Inward Invoices
        </div>
      </div>

      {/* Inward Entries List */}
      <div className="space-y-4">
        {filteredIGRs.map((igr) => (
          <div key={igr.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 transition-all hover:border-slate-700">
            {/* Top Bar of Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-sm font-bold text-cyan-400">{igr.igrNo}</span>
                <span className="text-xs text-slate-400">• Date: {igr.date}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {igr.status}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-xs">
                <span className="text-slate-300">Total Rolls: <strong className="text-white">{igr.totalRolls}</strong></span>
                <span className="text-slate-300">Scale Weight: <strong className="text-cyan-400">{igr.totalQty} KG</strong></span>
                <button
                  onClick={() => setSelectedIGR(igr)}
                  className="flex items-center space-x-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
              </div>
            </div>

            {/* Customer Details Info Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2.5 text-xs text-slate-400">
              <div>Customer: <strong className="text-slate-200 block">{igr.partyName}</strong></div>
              <div>Customer Challan: <strong className="text-slate-200 block">{igr.partyChallanNo} ({igr.partyChallanDate})</strong></div>
              <div>Vehicle / Transporter: <strong className="text-slate-200 block">{igr.vehicleNo}</strong></div>
              <div>Lot Count: <strong className="text-slate-200 block">{igr.lots?.length} Traceable Lots</strong></div>
            </div>

            {/* Sub-Lots Table */}
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left text-xs bg-slate-950/60 rounded-lg overflow-hidden">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-3">Lot No</th>
                    <th className="py-2 px-3">Fabric Construction</th>
                    <th className="py-2 px-3 text-right">Rolls</th>
                    <th className="py-2 px-3 text-right">Weight (KG)</th>
                    <th className="py-2 px-3">Target Shade</th>
                    <th className="py-2 px-3">Depth</th>
                    <th className="py-2 px-3">Finishing Routing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {igr.lots?.map((lot, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="py-2 px-3 font-mono font-semibold text-cyan-400">{lot.lotNo}</td>
                      <td className="py-2 px-3 text-slate-300">{lot.itemName}</td>
                      <td className="py-2 px-3 text-right font-medium text-slate-300">{lot.rolls}</td>
                      <td className="py-2 px-3 text-right font-bold text-white">{lot.weightKg}</td>
                      <td className="py-2 px-3 text-slate-300">{lot.shadeName}</td>
                      <td className="py-2 px-3">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                          {lot.depth}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex flex-wrap gap-1">
                          {lot.processes?.map((p, pi) => (
                            <span key={pi} className="px-1.5 py-0.2 rounded text-[9px] bg-slate-800/80 text-cyan-300 border border-slate-700">
                              {p}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        ))}
      </div>

      {/* Modal: New Inward Entry */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-5 my-8">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <ArrowDownLeft className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-bold text-white">Record Grey Fabric Inward (IGR Entry)</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Header Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Inward No (IGR)</label>
                  <input
                    type="text"
                    value={formData.igrNo}
                    readOnly
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Receipt Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Customer / Party</label>
                  <select
                    value={formData.partyId}
                    onChange={(e) => setFormData({ ...formData, partyId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    {data.parties?.filter(p => p.type === 'Customer').map((p) => (
                      <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Customer Delivery Challan No *</label>
                  <input
                    type="text"
                    placeholder="e.g. CH-9901"
                    required
                    value={formData.partyChallanNo}
                    onChange={(e) => setFormData({ ...formData, partyChallanNo: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Customer Challan Date</label>
                  <input
                    type="date"
                    value={formData.partyChallanDate}
                    onChange={(e) => setFormData({ ...formData, partyChallanDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Vehicle / Truck No</label>
                  <input
                    type="text"
                    placeholder="e.g. PB-10-XX-1234"
                    value={formData.vehicleNo}
                    onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Dynamic Lots Table */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Fabric Lots & Scale Weighing</h3>
                  <button
                    type="button"
                    onClick={handleAddLot}
                    className="flex items-center space-x-1 px-2.5 py-1 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 rounded text-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Lot</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.lots.map((lot, idx) => (
                    <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
                        <div>
                          <label className="block text-[10px] text-slate-400">Lot No</label>
                          <input
                            type="text"
                            value={lot.lotNo}
                            onChange={(e) => handleLotChange(idx, 'lotNo', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs font-mono text-cyan-400"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] text-slate-400">Fabric Quality</label>
                          <select
                            value={lot.itemId}
                            onChange={(e) => handleLotChange(idx, 'itemId', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white"
                          >
                            {data.items?.filter(i => i.group === 'Fabric').map((f) => (
                              <option key={f.id} value={f.id}>{f.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400">Rolls (NOC)</label>
                          <input
                            type="number"
                            min="1"
                            value={lot.rolls}
                            onChange={(e) => handleLotChange(idx, 'rolls', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white text-right"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400">Scale Weight (KG)</label>
                          <input
                            type="number"
                            step="0.1"
                            min="1"
                            value={lot.weightKg}
                            onChange={(e) => handleLotChange(idx, 'weightKg', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-cyan-400 font-bold text-right"
                          />
                        </div>
                        <div className="flex items-end justify-end">
                          <button
                            type="button"
                            onClick={() => handleRemoveLot(idx)}
                            disabled={formData.lots.length === 1}
                            className="p-1.5 text-rose-400 hover:text-rose-300 disabled:opacity-30 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="block text-[10px] text-slate-400">Target Shade</label>
                            <select
                              value={lot.shadeId}
                              onChange={(e) => handleLotChange(idx, 'shadeId', e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                            >
                              {data.shades?.map((s) => (
                                <option key={s.id} value={s.id}>{s.name} ({s.depth})</option>
                              ))}
                            </select>
                          </div>
                          <div className="w-28">
                            <label className="block text-[10px] text-slate-400">Depth</label>
                            <select
                              value={lot.depth}
                              onChange={(e) => handleLotChange(idx, 'depth', e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                            >
                              <option>Light</option>
                              <option>Medium</option>
                              <option>Dark</option>
                              <option>Extra Dark</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">Required Operations</label>
                          <div className="flex flex-wrap gap-1">
                            {availableProcesses.map((proc) => {
                              const active = lot.processes?.includes(proc);
                              return (
                                <button
                                  type="button"
                                  key={proc}
                                  onClick={() => handleToggleProcess(idx, proc)}
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium border transition-colors cursor-pointer ${
                                    active 
                                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                                      : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                                  }`}
                                >
                                  {proc}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Summary Footer */}
              <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Total Shipment Weight:</span>
                <div className="flex items-center space-x-4">
                  <span className="text-xs text-slate-300">Rolls: <strong className="text-white">{totalFormRolls}</strong></span>
                  <span className="text-sm font-bold text-cyan-400">{totalFormKg.toFixed(2)} KG</span>
                </div>
              </div>

              {/* Submit / Cancel */}
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
                  Save Inward & Post to Floor WIP
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal: Print IGR Slip */}
      {selectedIGR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8 print:m-0 print:p-0">
            
            {/* Header */}
            <div className="text-center border-b pb-3">
              <h2 className="text-lg font-black tracking-tight uppercase text-slate-900">{data.company?.name}</h2>
              <p className="text-xs text-slate-600">{data.company?.address}, {data.company?.city} ({data.company?.state})</p>
              <p className="text-[11px] font-semibold text-slate-700">GSTIN: {data.company?.gstin} • HSN: {data.company?.serviceHsn}</p>
              <h3 className="text-sm font-bold mt-2 uppercase tracking-wide bg-slate-100 py-1 border border-slate-300">
                INWARD GREY RECEIPT (IGR SLIP)
              </h3>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 text-xs gap-2 py-2 border-b">
              <div><strong>IGR No:</strong> {selectedIGR.igrNo}</div>
              <div><strong>Date:</strong> {selectedIGR.date}</div>
              <div><strong>Customer Party:</strong> {selectedIGR.partyName}</div>
              <div><strong>Party Challan No:</strong> {selectedIGR.partyChallanNo} ({selectedIGR.partyChallanDate})</div>
              <div><strong>Vehicle No:</strong> {selectedIGR.vehicleNo}</div>
              <div><strong>Custody Type:</strong> Job Work Processing (Non-Owned)</div>
            </div>

            {/* Lots */}
            <table className="w-full text-xs text-left border">
              <thead className="bg-slate-100 border-b">
                <tr>
                  <th className="p-1.5 border-r">Lot No</th>
                  <th className="p-1.5 border-r">Fabric Item</th>
                  <th className="p-1.5 border-r text-right">Rolls</th>
                  <th className="p-1.5 border-r text-right">Scale Wt (KG)</th>
                  <th className="p-1.5 border-r">Shade</th>
                  <th className="p-1.5">Routing</th>
                </tr>
              </thead>
              <tbody>
                {selectedIGR.lots?.map((lot, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-1.5 border-r font-mono font-bold">{lot.lotNo}</td>
                    <td className="p-1.5 border-r">{lot.itemName}</td>
                    <td className="p-1.5 border-r text-right">{lot.rolls}</td>
                    <td className="p-1.5 border-r text-right font-bold">{lot.weightKg}</td>
                    <td className="p-1.5 border-r">{lot.shadeName}</td>
                    <td className="p-1.5">{lot.processes?.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-bold">
                <tr>
                  <td colSpan="2" className="p-1.5 text-right border-r">TOTAL:</td>
                  <td className="p-1.5 border-r text-right">{selectedIGR.totalRolls}</td>
                  <td className="p-1.5 border-r text-right">{selectedIGR.totalQty} KG</td>
                  <td colSpan="2" className="p-1.5"></td>
                </tr>
              </tfoot>
            </table>

            {/* Signatures */}
            <div className="grid grid-cols-2 pt-8 text-xs text-center">
              <div>
                <p className="border-t border-slate-400 w-48 mx-auto pt-1">Driver / Customer Signature</p>
              </div>
              <div>
                <p className="border-t border-slate-400 w-48 mx-auto pt-1 font-semibold">For {data.company?.name}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t print:hidden">
              <button
                onClick={() => setSelectedIGR(null)}
                className="px-4 py-1.5 bg-slate-200 text-slate-800 rounded text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 bg-cyan-600 text-white rounded text-xs font-semibold cursor-pointer"
              >
                Print Document
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
