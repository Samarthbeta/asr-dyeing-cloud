import React, { useState } from 'react';
import { QrCode, Printer, X, Tag, Copy, Check } from 'lucide-react';

export default function RollQrModal({ isOpen, onClose, data }) {
  const [selectedLotNo, setSelectedLotNo] = useState(data.igrs?.[0]?.lots?.[0]?.lotNo || 'LOT-26-8801');
  const [rollCount, setRollCount] = useState(5);

  if (!isOpen) return null;

  // Find lot details
  let targetLot = null;
  let targetParty = "Oswal Woollen Mills Ltd";
  for (const igr of data.igrs || []) {
    const match = igr.lots?.find(l => l.lotNo === selectedLotNo);
    if (match) {
      targetLot = match;
      targetParty = igr.partyName;
      break;
    }
  }

  const allLots = data.igrs?.flatMap(i => i.lots?.map(l => ({ ...l, partyName: i.partyName }))) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">4"×2" Thermal Roll Barcode & QR Label Studio</h2>
              <p className="text-xs text-slate-400">Instant warehouse sticker generation for cloth rolls / takas upon scale weighing</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-950 rounded-xl border border-slate-800">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Select Active Lot</label>
            <select
              value={selectedLotNo}
              onChange={(e) => setSelectedLotNo(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-cyan-400"
            >
              {allLots.map((l, i) => (
                <option key={i} value={l.lotNo}>{l.lotNo} • {l.partyName} ({l.rolls} Rolls, {l.weightKg} KG)</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Number of Roll Stickers to Generate</label>
            <input
              type="number"
              min="1"
              max="50"
              value={rollCount}
              onChange={(e) => setRollCount(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
        </div>

        {/* Printable Stickers Preview Area */}
        <div className="space-y-4 max-h-96 overflow-y-auto p-2">
          {Array.from({ length: Math.min(rollCount, 6) }).map((_, rIdx) => {
            const rollIdx = rIdx + 1;
            const avgWt = targetLot ? (targetLot.weightKg / (targetLot.rolls || 1)).toFixed(1) : "22.5";
            const qrPayload = `ASR|LOT:${selectedLotNo}|ROLL:${rollIdx}|WT:${avgWt}KG|PARTY:${targetParty}|SHADE:${targetLot?.shadeName || 'Black'}`;

            return (
              <div 
                key={rIdx}
                className="bg-white text-slate-950 rounded-xl p-4 border border-slate-300 shadow-sm flex items-center justify-between gap-4 font-mono select-none"
              >
                {/* Text Info (Left) */}
                <div className="space-y-1 flex-1 text-xs">
                  <div className="border-b border-slate-300 pb-1 flex justify-between items-center">
                    <span className="font-black text-[11px] tracking-tight uppercase">{data.company?.name}</span>
                    <span className="text-[10px] text-slate-600">GSTIN: {data.company?.gstin}</span>
                  </div>

                  <div className="grid grid-cols-2 pt-1">
                    <div>Customer: <strong className="text-slate-900 font-sans block">{targetParty}</strong></div>
                    <div>Roll No: <strong className="text-slate-900 text-sm block">#{rollIdx} of {targetLot?.rolls || rollCount}</strong></div>
                  </div>

                  <div>Fabric: <span className="font-sans font-semibold text-slate-800">{targetLot?.itemName || 'Cotton Single Jersey'}</span></div>
                  
                  <div className="grid grid-cols-2 pt-1 border-t border-slate-200 text-[11px]">
                    <div>Lot: <strong className="text-cyan-700 text-sm">{selectedLotNo}</strong></div>
                    <div>Net Wt: <strong className="text-slate-900 text-sm">{avgWt} KG</strong></div>
                  </div>
                  <div>Target Shade: <strong className="text-slate-800 font-sans">{targetLot?.shadeName || 'Jet Black'}</strong></div>
                </div>

                {/* Vector QR Code (Right) */}
                <div className="flex flex-col items-center justify-center p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  {/* Procedural QR Icon */}
                  <svg className="w-24 h-24" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="5" y="5" width="25" height="25" fill="#000" />
                    <rect x="10" y="10" width="15" height="15" fill="#fff" />
                    <rect x="13" y="13" width="9" height="9" fill="#000" />

                    <rect x="70" y="5" width="25" height="25" fill="#000" />
                    <rect x="75" y="10" width="15" height="15" fill="#fff" />
                    <rect x="78" y="13" width="9" height="9" fill="#000" />

                    <rect x="5" y="70" width="25" height="25" fill="#000" />
                    <rect x="10" y="75" width="15" height="15" fill="#fff" />
                    <rect x="13" y="78" width="9" height="9" fill="#000" />

                    {/* Data grid pixels */}
                    <rect x="35" y="10" width="5" height="5" />
                    <rect x="45" y="10" width="5" height="5" />
                    <rect x="55" y="10" width="5" height="5" />
                    <rect x="35" y="25" width="5" height="5" />
                    <rect x="50" y="25" width="5" height="5" />
                    <rect x="40" y="40" width="5" height="5" />
                    <rect x="45" y="40" width="5" height="5" />
                    <rect x="55" y="40" width="5" height="5" />
                    <rect x="10" y="45" width="5" height="5" />
                    <rect x="20" y="45" width="5" height="5" />
                    <rect x="70" y="45" width="5" height="5" />
                    <rect x="85" y="45" width="5" height="5" />
                    <rect x="35" y="60" width="5" height="5" />
                    <rect x="50" y="60" width="5" height="5" />
                    <rect x="60" y="60" width="5" height="5" />
                    <rect x="40" y="75" width="5" height="5" />
                    <rect x="55" y="75" width="5" height="5" />
                    <rect x="75" y="75" width="5" height="5" />
                    <rect x="45" y="85" width="5" height="5" />
                    <rect x="65" y="85" width="5" height="5" />
                    <rect x="85" y="85" width="5" height="5" />
                  </svg>
                  <span className="text-[8px] font-mono text-slate-500 mt-1">SCAN LOT ON FLOOR</span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-800 text-xs">
          <span className="text-slate-400">Compatible with Zebra ZD220, TVS LP 46, TSC barcode printers</span>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg cursor-pointer shadow-md shadow-cyan-500/20"
            >
              <Printer className="w-4 h-4" />
              <span>Print {rollCount} Thermal Labels</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
