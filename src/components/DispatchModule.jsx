import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  Plus, 
  Printer, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown, 
  X, 
  Truck, 
  FileText,
  Building2
} from 'lucide-react';

export default function DispatchModule({ data, onSaveDispatch }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedDisp, setSelectedDisp] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    dispNo: `DSP-${new Date().getFullYear()}-${String(data.dispatches?.length + 311).padStart(4, '0')}`,
    date: new Date().toISOString().split('T')[0],
    partyId: data.parties?.[0]?.id || 101,
    vehicleNo: '',
    driverName: '',
    selectedLotNo: data.igrs?.[0]?.lots?.[0]?.lotNo || '',
    inwardWeightKg: 400.0,
    dispatchedWeightKg: 382.5,
    inwardRolls: 18,
    dispatchedRolls: 18,
    ratePerKg: 45.0
  });

  const inwardWeight = parseFloat(formData.inwardWeightKg) || 0;
  const dispatchWeight = parseFloat(formData.dispatchedWeightKg) || 0;
  const weightDiff = Math.max(0, inwardWeight - dispatchWeight);
  const lossPercent = inwardWeight > 0 ? ((weightDiff / inwardWeight) * 100).toFixed(2) : "0.00";

  const isExcessiveLoss = parseFloat(lossPercent) > 6.0;
  const isHighLoss = parseFloat(lossPercent) > 5.0 && !isExcessiveLoss;

  const handleLotSelect = (lotNo) => {
    for (const igr of data.igrs || []) {
      const match = igr.lots?.find(l => l.lotNo === lotNo);
      if (match) {
        setFormData({
          ...formData,
          selectedLotNo: lotNo,
          partyId: igr.partyId,
          inwardWeightKg: match.weightKg,
          dispatchedWeightKg: (match.weightKg * 0.955).toFixed(1), // estimate 4.5% shrinkage
          inwardRolls: match.rolls,
          dispatchedRolls: match.rolls
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

    const rate = parseFloat(formData.ratePerKg) || 45;
    const billAmt = dispatchWeight * rate;
    const gstAmt = billAmt * 0.05; // 5% GST on Textile Job Work HSN 9988
    const totalAmt = billAmt + gstAmt;

    const newDispatch = {
      id: Date.now(),
      dispNo: formData.dispNo,
      date: formData.date,
      partyId: parseInt(formData.partyId),
      partyName: parentIGR ? parentIGR.partyName : "Customer",
      vehicleNo: formData.vehicleNo || "PB-10-XX-0000",
      driverName: formData.driverName || "Driver",
      lotNo: formData.selectedLotNo,
      fabricName: targetLot ? targetLot.itemName : "Finished Fabric",
      shadeName: targetLot ? targetLot.shadeName : "Shade",
      inwardWeightKg: inwardWeight,
      dispatchedWeightKg: dispatchWeight,
      inwardRolls: parseInt(formData.inwardRolls) || 0,
      dispatchedRolls: parseInt(formData.dispatchedRolls) || 0,
      weightDiffKg: parseFloat(weightDiff.toFixed(2)),
      processLossPercent: parseFloat(lossPercent),
      status: isExcessiveLoss ? "Excessive Loss (>6%)" : "Normal",
      ratePerKg: rate,
      billAmount: parseFloat(billAmt.toFixed(2)),
      gstAmount: parseFloat(gstAmt.toFixed(2)),
      totalAmount: parseFloat(totalAmt.toFixed(2))
    };

    onSaveDispatch(newDispatch);
    setShowModal(false);

    // Reset Form
    setFormData({
      dispNo: `DSP-${new Date().getFullYear()}-${String(data.dispatches?.length + 312).padStart(4, '0')}`,
      date: new Date().toISOString().split('T')[0],
      partyId: data.parties?.[0]?.id || 101,
      vehicleNo: '',
      driverName: '',
      selectedLotNo: '',
      inwardWeightKg: 400.0,
      dispatchedWeightKg: 382.5,
      inwardRolls: 18,
      dispatchedRolls: 18,
      ratePerKg: 45.0
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <ArrowUpRight className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-bold text-white">Finished Goods Dispatch & Shrinkage Engine</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Generate delivery challans, relieve customer WIP ledger & detect chemical over-bleaching or weight variance
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Dispatch Slip</span>
        </button>
      </div>

      {/* Dispatches List */}
      <div className="space-y-4">
        {data.dispatches?.map((disp) => {
          const isHigh = disp.processLossPercent > 5.5;
          return (
            <div key={disp.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-all">
              
              {/* Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-base font-bold text-emerald-400">{disp.dispNo}</span>
                  <span className="text-xs text-slate-400">• Date: {disp.date}</span>
                  <span className="text-xs text-slate-300 font-semibold truncate max-w-xs">{disp.partyName}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center space-x-1 ${
                    isHigh ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {isHigh && <AlertTriangle className="w-3.5 h-3.5 mr-1" />}
                    <span>Loss: {disp.processLossPercent}%</span>
                  </span>

                  <button
                    onClick={() => setSelectedDisp(disp)}
                    className="flex items-center space-x-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Challan</span>
                  </button>
                </div>
              </div>

              {/* Physical Comparison Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>Lot No: <strong className="font-mono text-cyan-400 block">{disp.lotNo}</strong></div>
                <div>Finished Quality: <strong className="text-slate-200 block truncate">{disp.fabricName}</strong></div>
                <div>Shade: <strong className="text-slate-200 block">{disp.shadeName}</strong></div>
                <div>Vehicle: <strong className="text-slate-200 block">{disp.vehicleNo}</strong></div>
              </div>

              {/* Physics Shrinkage Box */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-center text-xs">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-medium">Inward Scale Weight</p>
                  <p className="text-sm font-bold text-slate-300 mt-0.5">{disp.inwardWeightKg} KG</p>
                  <p className="text-[10px] text-slate-400">{disp.inwardRolls} Rolls</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-medium">Outward Scale Weight</p>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">{disp.dispatchedWeightKg} KG</p>
                  <p className="text-[10px] text-slate-400">{disp.dispatchedRolls} Rolls</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-medium">Weight Diff / Shrinkage</p>
                  <p className={`text-sm font-bold mt-0.5 ${isHigh ? 'text-rose-400' : 'text-slate-300'}`}>
                    -{disp.weightDiffKg} KG ({disp.processLossPercent}%)
                  </p>
                  <p className="text-[10px] text-slate-500">{isHigh ? 'High Variance' : 'Normal loss'}</p>
                </div>
              </div>

              {/* Billing Summary Bar */}
              <div className="flex items-center justify-between pt-1 text-xs border-t border-slate-800/60">
                <span className="text-slate-400">Dyeing Job Work Rate: <strong className="text-slate-200">₹{disp.ratePerKg} / KG</strong></span>
                <div className="space-x-3 text-right">
                  <span className="text-slate-400">GST (5%): <strong className="text-slate-300">₹{disp.gstAmount}</strong></span>
                  <span className="text-slate-400">Total Bill: <strong className="text-emerald-400 font-bold text-sm">₹{disp.totalAmount}</strong></span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal: Create Dispatch Slip */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Create Finished Delivery Challan (Disp_Slip)</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Dispatch Challan No</label>
                  <input
                    type="text"
                    value={formData.dispNo}
                    readOnly
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Dispatch Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Select Processed Lot */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Select Lot Ready for Dispatch *</label>
                <select
                  value={formData.selectedLotNo}
                  onChange={(e) => handleLotSelect(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-cyan-400"
                >
                  <option value="">-- Choose Completed Lot --</option>
                  {data.igrs?.flatMap(igr => igr.lots?.map(l => ({ ...l, partyName: igr.partyName }))).map((l, i) => (
                    <option key={i} value={l.lotNo}>
                      {l.lotNo} • {l.partyName} • {l.itemName} (Inward: {l.weightKg} KG, {l.rolls} Rolls)
                    </option>
                  ))}
                </select>
              </div>

              {/* Physical Weighing Comparison */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Dispatched Rolls</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.dispatchedRolls}
                    onChange={(e) => setFormData({ ...formData, dispatchedRolls: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Original inward: {formData.inwardRolls} rolls</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Outward Scale Weight (KG) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={formData.dispatchedWeightKg}
                    onChange={(e) => setFormData({ ...formData, dispatchedWeightKg: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-emerald-400 font-bold"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Original inward: {formData.inwardWeightKg} KG</span>
                </div>
              </div>

              {/* Live Shrinkage Alert Badge */}
              <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
                isExcessiveLoss 
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-300' 
                  : isHighLoss 
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                    : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
              }`}>
                <div className="flex items-center space-x-2">
                  {isExcessiveLoss ? <AlertTriangle className="w-5 h-5 text-rose-400" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  <div>
                    <strong className="block">Process Loss: {lossPercent}% ({weightDiff.toFixed(1)} KG)</strong>
                    <span className="text-[11px] opacity-80">
                      {isExcessiveLoss ? 'Warning: Excessive loss detected! Check for chemical over-bleaching.' : 'Within standard Ludhiana mill shrinkage limits (3.5% - 5.5%).'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transport & Billing Fields */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Vehicle / Truck No</label>
                  <input
                    type="text"
                    placeholder="PB-10-XX-0000"
                    value={formData.vehicleNo}
                    onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Driver Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Jaswant Singh"
                    value={formData.driverName}
                    onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Dyeing Rate (₹/KG)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.ratePerKg}
                    onChange={(e) => setFormData({ ...formData, ratePerKg: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold"
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
                  className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-bold rounded-lg shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  Confirm Dispatch & Relieve Stock
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal: Print Delivery Challan */}
      {selectedDisp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8 print:m-0 print:p-0">
            
            {/* Header */}
            <div className="text-center border-b pb-3">
              <h2 className="text-lg font-black uppercase text-slate-900">{data.company?.name}</h2>
              <p className="text-xs text-slate-600">{data.company?.address}, {data.company?.city}</p>
              <p className="text-[11px] font-semibold text-slate-700">GSTIN: {data.company?.gstin} • HSN: {data.company?.serviceHsn}</p>
              <h3 className="text-sm font-bold mt-2 uppercase tracking-wide bg-slate-100 py-1 border border-slate-300">
                DELIVERY CHALLAN & DISPATCH NOTE
              </h3>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 text-xs gap-2 py-2 border-b">
              <div><strong>Challan No:</strong> {selectedDisp.dispNo}</div>
              <div><strong>Dispatch Date:</strong> {selectedDisp.date}</div>
              <div><strong>Customer (Consignee):</strong> {selectedDisp.partyName}</div>
              <div><strong>Vehicle No:</strong> {selectedDisp.vehicleNo} (Driver: {selectedDisp.driverName})</div>
              <div><strong>Job Work Process:</strong> Wet Dyeing, Washing & Compacting</div>
              <div><strong>E-Way Bill Status:</strong> Exempt / Sub-Threshold Job Work</div>
            </div>

            {/* Physical Table */}
            <table className="w-full text-xs text-left border">
              <thead className="bg-slate-100 border-b">
                <tr>
                  <th className="p-1.5 border-r">Lot No</th>
                  <th className="p-1.5 border-r">Fabric Item</th>
                  <th className="p-1.5 border-r">Shade</th>
                  <th className="p-1.5 border-r text-right">Rolls</th>
                  <th className="p-1.5 border-r text-right">Inward (KG)</th>
                  <th className="p-1.5 border-r text-right">Dispatched (KG)</th>
                  <th className="p-1.5 text-right">Shrinkage %</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-1.5 border-r font-mono font-bold">{selectedDisp.lotNo}</td>
                  <td className="p-1.5 border-r">{selectedDisp.fabricName}</td>
                  <td className="p-1.5 border-r">{selectedDisp.shadeName}</td>
                  <td className="p-1.5 border-r text-right">{selectedDisp.dispatchedRolls}</td>
                  <td className="p-1.5 border-r text-right">{selectedDisp.inwardWeightKg}</td>
                  <td className="p-1.5 border-r text-right font-black">{selectedDisp.dispatchedWeightKg}</td>
                  <td className="p-1.5 text-right">{selectedDisp.processLossPercent}%</td>
                </tr>
              </tbody>
            </table>

            {/* Billing Breakdown */}
            <div className="bg-slate-50 p-2.5 rounded border text-xs flex justify-between items-center">
              <div>
                <span>Rate: ₹{selectedDisp.ratePerKg} / KG • Taxable: ₹{selectedDisp.billAmount}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-sm">Total Amount: ₹{selectedDisp.totalAmount}</span>
                <span className="text-[10px] text-slate-500 block">(Includes 5% GST: ₹{selectedDisp.gstAmount})</span>
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 pt-6 text-xs text-center">
              <div>
                <p className="border-t border-slate-400 w-44 mx-auto pt-1">Receiver's Stamp & Signature</p>
              </div>
              <div>
                <p className="border-t border-slate-400 w-44 mx-auto pt-1 font-semibold">For {data.company?.name}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t print:hidden">
              <button
                onClick={() => setSelectedDisp(null)}
                className="px-4 py-1.5 bg-slate-200 text-slate-800 rounded text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold cursor-pointer"
              >
                Print Challan
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
