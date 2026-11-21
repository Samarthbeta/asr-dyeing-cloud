import React, { useState } from 'react';
import { 
  ReceiptText, 
  Printer, 
  Building2, 
  Search, 
  ArrowRight, 
  CheckCircle, 
  Download,
  Percent,
  FileCheck
} from 'lucide-react';

export default function BillingModule({ data }) {
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Invoices derived from Dispatches
  const invoices = data.dispatches?.map((d, index) => {
    const party = data.parties?.find(p => p.id === d.partyId);
    const isPunjab = !party || party.state === 'Punjab'; // Intra-state vs Interstate
    const taxable = d.billAmount || (d.dispatchedWeightKg * (d.ratePerKg || 45));
    const cgst = isPunjab ? (taxable * 0.025) : 0;
    const sgst = isPunjab ? (taxable * 0.025) : 0;
    const igst = !isPunjab ? (taxable * 0.05) : 0;
    const grandTotal = taxable + cgst + sgst + igst;

    return {
      invNo: `INV-${new Date().getFullYear()}-${String(index + 501).padStart(4, '0')}`,
      date: d.date,
      dispNo: d.dispNo,
      partyName: d.partyName,
      partyGstin: party ? party.gstin : "03AAACT1234F1Z5",
      partyAddress: `${party?.city || 'Ludhiana'}, ${party?.state || 'Punjab'}`,
      isPunjab,
      lotNo: d.lotNo,
      fabricName: d.fabricName,
      shadeName: d.shadeName,
      weightKg: d.dispatchedWeightKg,
      ratePerKg: d.ratePerKg || 45,
      taxable: parseFloat(taxable.toFixed(2)),
      cgst: parseFloat(cgst.toFixed(2)),
      sgst: parseFloat(sgst.toFixed(2)),
      igst: parseFloat(igst.toFixed(2)),
      grandTotal: parseFloat(grandTotal.toFixed(2))
    };
  }) || [];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <ReceiptText className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">GST Invoicing & 5-Tier Rate Resolution</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated tax invoice generation for textile wet processing & job work under SAC code 9988
          </p>
        </div>

        {/* 5-Tier Rate Engine Legend */}
        <div className="hidden lg:flex items-center space-x-2 text-[11px] bg-slate-950 p-2 rounded-xl border border-slate-800">
          <span className="text-slate-400">Rate Hierarchy:</span>
          <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono">T1: Party+Item+Shade</span>
          <span className="text-slate-600">&rarr;</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">T2: Party+Item</span>
          <span className="text-slate-600">&rarr;</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">T3: Item Base</span>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white">Generated GST Job Work Invoices</h3>
          <span className="text-xs text-slate-400">{invoices.length} Invoices Available</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Invoice No</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Customer (Billed To)</th>
                <th className="py-2.5 px-3">Challan Ref</th>
                <th className="py-2.5 px-3 text-right">Billed Wt (KG)</th>
                <th className="py-2.5 px-3 text-right">Job Rate (₹/KG)</th>
                <th className="py-2.5 px-3 text-right">Taxable (₹)</th>
                <th className="py-2.5 px-3 text-right">GST (5%)</th>
                <th className="py-2.5 px-3 text-right font-bold">Grand Total (₹)</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {invoices.map((inv, idx) => (
                <tr key={idx} className="hover:bg-slate-800/20">
                  <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">{inv.invNo}</td>
                  <td className="py-2.5 px-3 text-slate-400">{inv.date}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-200">{inv.partyName}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">{inv.dispNo}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-white">{inv.weightKg}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">₹{inv.ratePerKg}</td>
                  <td className="py-2.5 px-3 text-right text-slate-200">₹{inv.taxable}</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">
                    {inv.isPunjab ? `CGST+SGST (₹${inv.cgst + inv.sgst})` : `IGST (₹${inv.igst})`}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-400 text-sm">
                    ₹{inv.grandTotal}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors cursor-pointer"
                    >
                      Print Tax Inv
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Full GST Tax Invoice Printable Preview */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl max-w-2xl w-full p-8 shadow-2xl space-y-4 my-8 print:m-0 print:p-0">
            
            {/* Header */}
            <div className="text-center border-b pb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Tax Invoice / Bill of Supply</span>
              <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight mt-0.5">{data.company?.name}</h2>
              <p className="text-xs text-slate-600">{data.company?.address}, {data.company?.city} ({data.company?.state})</p>
              <div className="flex justify-center space-x-4 text-xs font-semibold text-slate-700 mt-1">
                <span>GSTIN: {data.company?.gstin}</span>
                <span>•</span>
                <span>State Code: {data.company?.stateCode} (Punjab)</span>
                <span>•</span>
                <span>Service HSN: {data.company?.serviceHsn}</span>
              </div>
            </div>

            {/* Billed To vs Invoice Info */}
            <div className="grid grid-cols-2 text-xs gap-4 py-2 border-b">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500">Billed To (Customer):</p>
                <p className="font-bold text-sm text-slate-900 mt-0.5">{selectedInvoice.partyName}</p>
                <p className="text-slate-600">{selectedInvoice.partyAddress}</p>
                <p className="font-semibold text-slate-700 mt-1">GSTIN: {selectedInvoice.partyGstin}</p>
              </div>

              <div className="text-right space-y-1">
                <p><strong>Invoice No:</strong> <span className="font-mono font-bold">{selectedInvoice.invNo}</span></p>
                <p><strong>Invoice Date:</strong> {selectedInvoice.date}</p>
                <p><strong>Delivery Challan Ref:</strong> {selectedInvoice.dispNo}</p>
                <p><strong>Place of Supply:</strong> {selectedInvoice.isPunjab ? "03-Punjab (Intra-state)" : "Interstate"}</p>
              </div>
            </div>

            {/* Line Items Table */}
            <table className="w-full text-xs text-left border">
              <thead className="bg-slate-100 border-b">
                <tr>
                  <th className="p-2 border-r">Sr</th>
                  <th className="p-2 border-r">Description of Job Work</th>
                  <th className="p-2 border-r">HSN/SAC</th>
                  <th className="p-2 border-r text-right">Qty (KG)</th>
                  <th className="p-2 border-r text-right">Rate (₹)</th>
                  <th className="p-2 text-right font-bold">Taxable Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 border-r text-center">1</td>
                  <td className="p-2 border-r">
                    <p className="font-bold">Textile Dyeing & Finishing Job Work</p>
                    <p className="text-slate-600 text-[11px]">{selectedInvoice.fabricName} (Lot: {selectedInvoice.lotNo}, Shade: {selectedInvoice.shadeName})</p>
                  </td>
                  <td className="p-2 border-r text-center">{data.company?.serviceHsn}</td>
                  <td className="p-2 border-r text-right font-semibold">{selectedInvoice.weightKg}</td>
                  <td className="p-2 border-r text-right">₹{selectedInvoice.ratePerKg}</td>
                  <td className="p-2 text-right font-bold">₹{selectedInvoice.taxable}</td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 text-xs">
                <tr>
                  <td colSpan="5" className="p-1.5 text-right font-semibold border-r">Subtotal Taxable Value:</td>
                  <td className="p-1.5 text-right font-bold">₹{selectedInvoice.taxable}</td>
                </tr>
                {selectedInvoice.isPunjab ? (
                  <>
                    <tr>
                      <td colSpan="5" className="p-1.5 text-right text-slate-600 border-r">CGST (2.5%):</td>
                      <td className="p-1.5 text-right font-medium">₹{selectedInvoice.cgst}</td>
                    </tr>
                    <tr>
                      <td colSpan="5" className="p-1.5 text-right text-slate-600 border-r">SGST (2.5%):</td>
                      <td className="p-1.5 text-right font-medium">₹{selectedInvoice.sgst}</td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan="5" className="p-1.5 text-right text-slate-600 border-r">IGST (5.0%):</td>
                    <td className="p-1.5 text-right font-medium">₹{selectedInvoice.igst}</td>
                  </tr>
                )}
                <tr className="bg-slate-100 font-black text-sm">
                  <td colSpan="5" className="p-2 text-right border-r">TOTAL INVOICE AMOUNT (₹):</td>
                  <td className="p-2 text-right text-slate-900">₹{selectedInvoice.grandTotal}</td>
                </tr>
              </tfoot>
            </table>

            {/* Terms and Signatures */}
            <div className="grid grid-cols-2 pt-6 text-xs">
              <div className="text-[10px] text-slate-500 space-y-1">
                <p>1. Certified that the particulars given above are true and correct.</p>
                <p>2. Subject to Ludhiana Jurisdiction only.</p>
                <p>3. Goods received back in sound condition.</p>
              </div>
              <div className="text-center">
                <p className="border-t border-slate-400 w-48 mx-auto pt-1 font-semibold">
                  For {data.company?.name}
                </p>
                <span className="text-[10px] text-slate-500">Authorized Signatory</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t print:hidden">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-1.5 bg-slate-200 text-slate-800 rounded text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 bg-cyan-600 text-white rounded text-xs font-semibold cursor-pointer"
              >
                Print Tax Invoice
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
