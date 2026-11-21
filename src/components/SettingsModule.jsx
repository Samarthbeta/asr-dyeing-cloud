import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  CloudCheck, 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  AlertCircle, 
  Copy, 
  ExternalLink,
  ShieldCheck,
  Server
} from 'lucide-react';
import { 
  getSupabaseConfig, 
  saveSupabaseConfig, 
  testSupabaseConnection, 
  pushToSupabase, 
  pullFromSupabase 
} from '../services/storage';

export default function SettingsModule({ data, onRestoreData, onResetData }) {
  const [config, setConfig] = useState(getSupabaseConfig());
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    setConfig(getSupabaseConfig());
  }, []);

  const handleSaveConfig = () => {
    saveSupabaseConfig(config);
    setSyncStatus({ type: 'success', message: 'Cloud configuration saved locally!' });
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await testSupabaseConnection(config.url, config.anonKey);
    setIsTesting(false);
    setTestResult(res);
  };

  const handlePushCloud = async () => {
    try {
      setSyncStatus({ type: 'loading', message: 'Pushing full mill state to Supabase...' });
      await pushToSupabase(data, config.url, config.anonKey);
      setSyncStatus({ type: 'success', message: 'Successfully backed up state to Supabase cloud!' });
    } catch (err) {
      setSyncStatus({ type: 'error', message: err.message || 'Failed to sync to Supabase' });
    }
  };

  const handlePullCloud = async () => {
    try {
      setSyncStatus({ type: 'loading', message: 'Pulling latest state from Supabase...' });
      const cloudData = await pullFromSupabase(config.url, config.anonKey);
      onRestoreData(cloudData);
      setSyncStatus({ type: 'success', message: 'Successfully restored state from Supabase cloud!' });
    } catch (err) {
      setSyncStatus({ type: 'error', message: err.message || 'Failed to pull from Supabase' });
    }
  };

  const handleExportJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `ASR_DYEING_BACKUP_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.company && parsed.igrs) {
          onRestoreData(parsed);
          alert("Backup successfully restored!");
        } else {
          alert("Invalid backup file structure");
        }
      } catch (err) {
        alert("Failed to parse JSON file");
      }
    };
    reader.readAsText(file);
  };

  const sqlCode = `-- Run this in your Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.asr_erp_snapshots (
    id TEXT PRIMARY KEY,
    app_version TEXT,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    state JSONB NOT NULL
);

ALTER TABLE public.asr_erp_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-write for demo app" 
ON public.asr_erp_snapshots FOR ALL 
USING (true) 
WITH CHECK (true);`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl font-bold text-white">Cloud Database & Deployment Settings</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Connect your free Supabase PostgreSQL cloud database, manage multi-device sync, and export offline backups
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Box 1: Supabase Cloud Database */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Supabase Cloud Database Connection</h3>
            </div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-500/20">
              Free Tier Supported
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Supabase Project URL</label>
              <input
                type="text"
                placeholder="https://your-project-id.supabase.co"
                value={config.url}
                onChange={(e) => setConfig({ ...config, url: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Supabase Public Anon Key</label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                value={config.anonKey}
                onChange={(e) => setConfig({ ...config, anonKey: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="autoSync"
                checked={config.autoSync}
                onChange={(e) => setConfig({ ...config, autoSync: e.target.checked })}
                className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="autoSync" className="text-xs text-slate-300 cursor-pointer">
                Auto-sync changes to Supabase in real-time
              </label>
            </div>

            {testResult && (
              <div className={`p-3 rounded-lg text-xs flex items-center space-x-2 ${
                testResult.success ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {testResult.success ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{testResult.success ? testResult.message : testResult.error}</span>
              </div>
            )}

            {syncStatus && (
              <div className={`p-3 rounded-lg text-xs ${
                syncStatus.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' :
                syncStatus.type === 'error' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30' :
                'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
              }`}>
                {syncStatus.message}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={handleSaveConfig}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Save Credentials
              </button>
              <button
                onClick={handleTestConnection}
                disabled={isTesting}
                className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                {isTesting ? "Testing..." : "Test Connection"}
              </button>
              <button
                onClick={handlePushCloud}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Push to Cloud
              </button>
              <button
                onClick={handlePullCloud}
                className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Pull from Cloud
              </button>
            </div>
          </div>

          {/* Quick Setup SQL instructions */}
          <div className="pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-300">1-Minute Supabase Table Setup SQL</span>
              <button
                onClick={copySql}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedSql ? "Copied!" : "Copy SQL"}</span>
              </button>
            </div>
            <pre className="bg-slate-950 p-2.5 rounded-lg text-[10px] font-mono text-slate-400 overflow-x-auto border border-slate-800">
              {sqlCode}
            </pre>
          </div>

        </div>

        {/* Box 2: Local Backup, Reset & Cloud Deployment Status */}
        <div className="space-y-6">
          
          {/* Offline JSON Backup */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Download className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Offline Data Backup & Restore (JSON)</h3>
            </div>
            
            <p className="text-xs text-slate-400">
              Your entries are always stored locally in your browser cache. You can download a full mill backup file anytime to transfer between machines.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExportJson}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 cursor-pointer"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Export Full JSON Backup</span>
              </button>

              <label className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 cursor-pointer">
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Restore Backup File</span>
                <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
              </label>

              <button
                onClick={() => {
                  if (confirm("Reset to authentic Mohinder Dyeing sample dataset? All custom test entries will be overwritten.")) {
                    onResetData();
                  }
                }}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold border border-rose-500/30 cursor-pointer ml-auto"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Demo Data</span>
              </button>
            </div>
          </div>

          {/* Cloud Hosting Overview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Server className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Multi-Device Access (Vercel & Cloudflare)</h3>
            </div>

            <div className="text-xs text-slate-400 space-y-2">
              <p>
                This web app is packaged as a high-performance Single Page Application (Vite + React) that can be hosted on <strong>Vercel</strong> or <strong>Cloudflare Pages</strong>.
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>Zero server costs ($0 / month on free tier)</li>
                <li>Accessible from any smartphone, tablet, laptop, or desktop</li>
                <li>Works offline in factory sheds through local browser caching</li>
              </ul>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
