import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Thermometer, 
  Droplets, 
  Gauge, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Flame, 
  Zap,
  Play,
  RotateCcw
} from 'lucide-react';

export default function VesselTelemetryModal({ isOpen, onClose, machines = [] }) {
  const [selectedMachine, setSelectedMachine] = useState(machines[0]?.code || 'SF-01');
  const [currentTemp, setCurrentTemp] = useState(82.4);
  const [targetTemp, setTargetTemp] = useState(95.0);
  const [pressure, setPressure] = useState(2.4);
  const [phLevel, setPhLevel] = useState(10.8);
  const [pumpRpm, setPumpRpm] = useState(1450);

  // Live simulation tick
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCurrentTemp(prev => {
        const next = prev + (Math.random() * 0.4 - 0.15);
        return parseFloat(Math.min(targetTemp, Math.max(30, next)).toFixed(1));
      });
      setPressure(prev => parseFloat((2.3 + Math.random() * 0.2).toFixed(2)));
    }, 1500);
    return () => clearInterval(interval);
  }, [isOpen, targetTemp]);

  if (!isOpen) return null;

  const machine = machines.find(m => m.code === selectedMachine) || machines[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-5 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white">Vessel Live SCADA Telemetry & Dyeing Curve</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  LIVE TELEMETRY
                </span>
              </div>
              <p className="text-xs text-slate-400">Real-time thermal gradient and physical bath monitoring (Mohinder Dyeing Floor)</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vessel Selector Bar */}
        <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {machines.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMachine(m.code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedMachine === m.code
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {m.code} • {m.type}
            </button>
          ))}
        </div>

        {/* Real-Time Sensor Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-slate-400 text-xs">
              <span>Bath Temperature</span>
              <Thermometer className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 flex items-baseline space-x-1.5">
              <span className="text-2xl font-black text-white">{currentTemp}°C</span>
              <span className="text-xs text-slate-500 font-medium">/ {targetTemp}°C</span>
            </div>
            <div className="mt-1 flex items-center space-x-1 text-[11px] text-amber-400">
              <Flame className="w-3 h-3" />
              <span>Heating @ 2.0°C/min</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-slate-400 text-xs">
              <span>Internal Pressure</span>
              <Gauge className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2 flex items-baseline space-x-1.5">
              <span className="text-2xl font-black text-white">{pressure}</span>
              <span className="text-xs text-slate-500 font-medium">Bar</span>
            </div>
            <div className="mt-1 flex items-center space-x-1 text-[11px] text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
              <span>Pressure Safe</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-slate-400 text-xs">
              <span>Chemical Bath pH</span>
              <Droplets className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-2 flex items-baseline space-x-1.5">
              <span className="text-2xl font-black text-white">{phLevel}</span>
              <span className="text-xs text-slate-500 font-medium">pH</span>
            </div>
            <div className="mt-1 flex items-center space-x-1 text-[11px] text-purple-400">
              <span>Alkaline Fixation Phase</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-slate-400 text-xs">
              <span>Main Circulation Pump</span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline space-x-1.5">
              <span className="text-2xl font-black text-white">{pumpRpm}</span>
              <span className="text-xs text-slate-500 font-medium">RPM</span>
            </div>
            <div className="mt-1 flex items-center space-x-1 text-[11px] text-emerald-400">
              <span>Nozzle Flow 100%</span>
            </div>
          </div>

        </div>

        {/* Dynamic Temperature Curve SVG Graph */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <span>Dyeing Thermal Profile (Cotton Reactive 6-Stage Cycle)</span>
            </span>
            <span className="text-slate-400 font-mono">Current Phase: <strong className="text-amber-400">Fixation Hold (82°C)</strong></span>
          </div>

          {/* SVG Canvas */}
          <div className="relative w-full h-44 bg-slate-900/60 rounded-lg p-2 overflow-hidden border border-slate-800/80">
            <svg className="w-full h-full" viewBox="0 0 600 140" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="600" y2="30" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />
              <line x1="0" y1="70" x2="600" y2="70" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />
              <line x1="0" y1="110" x2="600" y2="110" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />

              {/* Temperature Curve Line */}
              {/* Coordinates: Start (30C) -> Ramp to 60C -> Hold 20min -> Ramp to 95C -> Hold 45min -> Drain/Cool to 40C */}
              <path
                d="M 10 120 L 80 120 L 140 85 L 200 85 L 300 35 L 420 35 L 500 95 L 590 120"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Gradient Area under Curve */}
              <path
                d="M 10 120 L 80 120 L 140 85 L 200 85 L 300 35 L 420 35 L 500 95 L 590 120 L 590 140 L 10 140 Z"
                fill="url(#curveGradient)"
                opacity="0.2"
              />

              <defs>
                <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
              </defs>

              {/* Current Progress Pointer */}
              <circle cx="260" cy="55" r="5" fill="#f59e0b" className="animate-ping" />
              <circle cx="260" cy="55" r="5" fill="#f59e0b" />
            </svg>

            {/* Labels overlay */}
            <div className="absolute bottom-1 left-2 right-2 flex justify-between text-[9px] font-mono text-slate-500">
              <span>0m: Loading (30°C)</span>
              <span>25m: Salt Dosing (60°C)</span>
              <span>60m: Soda Ash Addition</span>
              <span>105m: Boiling Wash (95°C)</span>
              <span>140m: Cold Rinse (40°C)</span>
            </div>
          </div>
        </div>

        {/* Vessel Floor Notes & Status */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Vessel <strong>{machine?.name}</strong> • Current Batch: <strong className="text-cyan-400">{machine?.currentBatch || 'JC-2026-0041'}</strong></span>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => {
                alert(`Manual cycle override triggered for ${selectedMachine}. Logged to audit trail.`);
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Emergency Drain
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold cursor-pointer"
            >
              Close Telemetry
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
