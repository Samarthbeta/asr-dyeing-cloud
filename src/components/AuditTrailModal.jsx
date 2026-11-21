import React from 'react';
import { History, X, Download, ShieldCheck, Clock, UserCheck } from 'lucide-react';

export default function AuditTrailModal({ isOpen, onClose, auditLogs = [] }) {
  if (!isOpen) return null;

  const exportAuditCsv = () => {
    let csv = "Timestamp,Action,Entity,Operator Role,Details\n";
    auditLogs.forEach(l => {
      csv += `"${l.timestamp}","${l.action}","${l.entity}","${l.role}","${l.details}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ASR_ERP_AUDIT_TRAIL_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white">Enterprise Audit Trail & Event Sourcing</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  IMMUTABLE LOG
                </span>
              </div>
              <p className="text-xs text-slate-400">Cryptographically verifiable event history of all mill floor operations</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto max-h-96 rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs bg-slate-950/80">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 sticky top-0">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Action Event</th>
                <th className="py-2.5 px-3">Entity ID</th>
                <th className="py-2.5 px-3">Operator Role</th>
                <th className="py-2.5 px-3">State Diff Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {auditLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-900/60 font-sans">
                  <td className="py-2 px-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-2 px-3">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-mono font-bold text-white text-xs">{log.entity}</td>
                  <td className="py-2 px-3 text-slate-300 text-xs">
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">
                      {log.role}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-400 text-xs">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-800 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Full traceability compliant with ISO 9001:2015 & GST Audit</span>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={exportAuditCsv}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
