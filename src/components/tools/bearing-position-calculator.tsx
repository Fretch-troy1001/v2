import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "../ui/dialog";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";
import { RefreshCw, Plus, X, ArrowRight, ArrowUp, ArrowDown, ArrowLeft, Settings } from 'lucide-react';

// --- Constants ---
const BEARINGS = {
  1: { D: 250 }, 2: { D: 380 }, 3: { D: 450 }, 4: { D: 500 },
  5: { D: 530 }, 6: { D: 450 }, 7: { D: 250 }
};
const REPEATABILITY_SPEC = 0.04;

type Plane = 'P100' | 'P200';
type BearingId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface MeasurementRow {
  id: number;
  label: string;
  lh: string;
  bot: string;
  rh: string;
}

interface BearingData {
  refLh: string;
  refBot: string;
  refRh: string;
  rows: MeasurementRow[];
}

interface StoreData {
  [key: string]: BearingData;
}

// --- Helper Functions ---
const safeParse = (val: string): number | null => {
  const s = val.trim().replace(',', '.');
  if (!s || s === '-' || /^-?\.?$/.test(s) || s.endsWith('.')) return null;
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
};

const formatVal = (n: number | null, d = 3) => n === null ? '—' : n.toFixed(d);
const formatSgn = (n: number | null, d = 3) => n === null ? '—' : (n >= 0 ? '+' : '') + n.toFixed(d);

export function BearingPositionCalculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [curBrg, setCurBrg] = useState<BearingId>(1);
  const [curPlane, setCurPlane] = useState<Plane>('P100');
  const [store, setStore] = useState<StoreData>({});
  
  // Current inputs
  const [refLh, setRefLh] = useState('');
  const [refBot, setRefBot] = useState('');
  const [refRh, setRefRh] = useState('');
  const [rows, setRows] = useState<MeasurementRow[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bearing-calc-data');
    if (saved) {
      try {
        setStore(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load bearing data", e);
      }
    }
  }, []);

  // Load state when selection changes
  useEffect(() => {
    const key = `b${curBrg}_${curPlane}`;
    const data = store[key];
    
    if (data) {
      setRefLh(data.refLh);
      setRefBot(data.refBot);
      setRefRh(data.refRh);
      setRows(data.rows);
    } else {
      // Defaults
      const defs = getDefaults(curBrg, curPlane);
      setRefLh(defs.lh);
      setRefBot(defs.bot);
      setRefRh(defs.rh);
      setRows([{ id: 1, label: 'As Found 2025', lh: '', bot: '', rh: '' }]);
    }
  }, [curBrg, curPlane, store]);

  // Save to local storage whenever data changes
  const saveData = (newRefLh: string, newRefBot: string, newRefRh: string, newRows: MeasurementRow[]) => {
    const key = `b${curBrg}_${curPlane}`;
    const newData = {
      ...store,
      [key]: {
        refLh: newRefLh,
        refBot: newRefBot,
        refRh: newRefRh,
        rows: newRows
      }
    };
    setStore(newData);
    localStorage.setItem('bearing-calc-data', JSON.stringify(newData));
  };

  const getDefaults = (b: number, p: string) => {
    if (b === 1 && p === 'P100') return { lh: '125.14', bot: '125.08', rh: '125.08' };
    if (b === 1 && p === 'P200') return { lh: '155.03', bot: '154.53', rh: '155.00' };
    return { lh: '', bot: '', rh: '' };
  };

  const updateRef = (field: 'lh' | 'bot' | 'rh', val: string) => {
    if (field === 'lh') { setRefLh(val); saveData(val, refBot, refRh, rows); }
    if (field === 'bot') { setRefBot(val); saveData(refLh, val, refRh, rows); }
    if (field === 'rh') { setRefRh(val); saveData(refLh, refBot, val, rows); }
  };

  const updateRow = (id: number, field: keyof MeasurementRow, val: string) => {
    const newRows = rows.map(r => r.id === id ? { ...r, [field]: val } : r);
    setRows(newRows);
    saveData(refLh, refBot, refRh, newRows);
  };

  const addRow = () => {
    const newId = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;
    const newRows = [...rows, { id: newId, label: `Measurement ${newId}`, lh: '', bot: '', rh: '' }];
    setRows(newRows);
    saveData(refLh, refBot, refRh, newRows);
  };

  const removeRow = (id: number) => {
    const newRows = rows.filter(r => r.id !== id);
    setRows(newRows);
    saveData(refLh, refBot, refRh, newRows);
  };

  const reset = () => {
    const defs = getDefaults(curBrg, curPlane);
    const newRefLh = defs.lh;
    const newRefBot = defs.bot;
    const newRefRh = defs.rh;
    const newRows = [{ id: 1, label: 'As Found 2025', lh: '', bot: '', rh: '' }];
    
    setRefLh(newRefLh);
    setRefBot(newRefBot);
    setRefRh(newRefRh);
    setRows(newRows);
    saveData(newRefLh, newRefBot, newRefRh, newRows);
  };

  // --- Calculations ---
  const spec = BEARINGS[curBrg].D * 0.001;
  
  const calcOffset = (lhStr: string, botStr: string, rhStr: string) => {
    const lh = safeParse(lhStr);
    const bot = safeParse(botStr);
    const rh = safeParse(rhStr);
    
    let center = null, hOff = null, vOff = null;
    if (lh !== null && rh !== null) {
      center = (lh + rh) / 2;
      hOff = (lh - rh) / 2;
    }
    if (bot !== null && center !== null) {
      vOff = bot - center;
    }
    return { center, hOff, vOff, lh, bot, rh };
  };

  const refCalc = calcOffset(refLh, refBot, refRh);
  
  // Get the last valid calculation for the diagram
  const lastRow = rows.length > 0 ? rows[rows.length - 1] : null;
  const lastCalc = lastRow ? calcOffset(lastRow.lh, lastRow.bot, lastRow.rh) : { center: null, hOff: null, vOff: null, lh: null, bot: null, rh: null };

  // --- Diagram Logic ---
  const scale = Math.min(22 / spec, 100);
  // Rotor moves relative to fixed shell
  // hOff > 0 (Right) -> rx > 0
  // vOff > 0 (High) -> ry < 0 (SVG Y is down)
  const rx = lastCalc.hOff !== null ? lastCalc.hOff * scale : 0;
  const ry = lastCalc.vOff !== null ? -lastCalc.vOff * scale : 0;
  
  const ROTOR_R = 60;
  const SHELL_IR = 93;
  const specR = spec * scale;
  const isOOS = (lastCalc.hOff !== null && Math.abs(lastCalc.hOff) > spec) || 
                (lastCalc.vOff !== null && Math.abs(lastCalc.vOff) > spec);

  // Gap lines logic
  const renderGapLines = () => {
    if (lastCalc.lh === null || lastCalc.bot === null || lastCalc.rh === null) return null;
    
    // Probes are fixed on Shell (at 0,0 reference)
    // Gap is distance to Rotor surface
    
    // Bottom Probe (at x=0, y=SHELL_IR)
    // Rotor Bottom Surface approx at y = ry + ROTOR_R
    const botInY = ry + ROTOR_R;
    const botOutY = SHELL_IR;
    
    // LH Probe (at x=-SHELL_IR, y=0)
    // Rotor Left Surface approx at x = rx - ROTOR_R
    const lhInX = rx - ROTOR_R;
    const lhOutX = -SHELL_IR;
    
    // RH Probe (at x=SHELL_IR, y=0)
    // Rotor Right Surface approx at x = rx + ROTOR_R
    const rhInX = rx + ROTOR_R;
    const rhOutX = SHELL_IR;

    return (
      <g opacity="0.85">
        {/* Bottom */}
        <line x1="-5" y1={botInY} x2="5" y2={botInY} stroke="#00c8ff" strokeWidth="1.2" />
        <line x1="-5" y1={botOutY} x2="5" y2={botOutY} stroke="#00c8ff" strokeWidth="1.2" />
        <line x1="0" y1={botInY} x2="0" y2={botOutY} stroke="#00c8ff" strokeWidth="0.7" strokeDasharray="3 2" />
        <text x="8" y={(botInY + botOutY) / 2 + 3} fill="#00c8ff" fontSize="8" fontFamily="monospace" textAnchor="start">{lastCalc.bot?.toFixed(3)}</text>

        {/* LH */}
        <line x1={lhInX} y1="-5" x2={lhInX} y2="5" stroke="#ffc400" strokeWidth="1.2" />
        <line x1={lhOutX} y1="-5" x2={lhOutX} y2="5" stroke="#ffc400" strokeWidth="1.2" />
        <line x1={lhInX} y1="0" x2={lhOutX} y2="0" stroke="#ffc400" strokeWidth="0.7" strokeDasharray="3 2" />
        <text x={(lhInX + lhOutX) / 2} y="-10" fill="#ffc400" fontSize="8" fontFamily="monospace" textAnchor="middle">{lastCalc.lh?.toFixed(3)}</text>

        {/* RH */}
        <line x1={rhInX} y1="-5" x2={rhInX} y2="5" stroke="#ffc400" strokeWidth="1.2" />
        <line x1={rhOutX} y1="-5" x2={rhOutX} y2="5" stroke="#ffc400" strokeWidth="1.2" />
        <line x1={rhInX} y1="0" x2={rhOutX} y2="0" stroke="#ffc400" strokeWidth="0.7" strokeDasharray="3 2" />
        <text x={(rhInX + rhOutX) / 2} y="-10" fill="#ffc400" fontSize="8" fontFamily="monospace" textAnchor="middle">{lastCalc.rh?.toFixed(3)}</text>
      </g>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="tool-card group cursor-pointer">
          <div className="tool-card__header">
            <div className="tool-card__icon text-[var(--accent)]">
              <Settings className="w-5 h-5" />
            </div>
            <span className="tag tag--success">Active</span>
          </div>
          <div className="tool-card__title group-hover:text-[var(--accent)] transition-colors">Rotor Position Calculator</div>
          <div className="tool-card__desc">Calculate rotor radial position relative to fixed bearing shell. Includes interactive diagram and repeatability checks.</div>
          <div className="tool-card__footer">
            <div><span className="tag tag--amber">Engineering</span></div>
            <button className="btn btn--primary">Open Tool</button>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] h-[90vh] overflow-y-auto bg-[var(--bg)] border-[var(--border)] p-0 flex flex-col">
        <div className="p-6 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between sticky top-0 z-50">
          <div>
            <DialogTitle className="text-xl font-bold tracking-tight text-[var(--accent)] flex items-center gap-3">
              <Settings className="w-6 h-6" /> ROTOR POSITION CALCULATOR
            </DialogTitle>
            <DialogDescription className="text-[var(--text-secondary)] font-mono text-xs tracking-wider mt-1">
              GNPD TURBINE UNIT — ROTOR RADIAL REFERENCE ANALYSIS
            </DialogDescription>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Bearing Selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {Object.keys(BEARINGS).map((b) => {
              const id = parseInt(b) as BearingId;
              return (
                <button
                  key={id}
                  onClick={() => setCurBrg(id)}
                  className={cn(
                    "px-4 py-2 rounded-md border text-sm font-bold transition-all font-mono",
                    curBrg === id 
                      ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-[0_0_15px_rgba(34,197,94,0.3)]" 
                      : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  )}
                >
                  BRG {id}
                  <div className="text-[10px] opacity-80">D={BEARINGS[id].D}mm</div>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_380px] gap-6 items-start">
            
            {/* Column 1: Specs & Info */}
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                <div className="text-xs font-mono text-[var(--accent)] uppercase tracking-widest mb-3 pb-2 border-b border-[var(--border)]">
                  ▶ Bearing Specs
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Bearing No.</span>
                    <span className="font-mono font-bold text-[var(--text)]">BRG {curBrg}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Journal Ø (D)</span>
                    <span className="font-mono font-bold text-[var(--text)]">{BEARINGS[curBrg].D} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Radial Spec (1‰)</span>
                    <span className="font-mono font-bold text-[var(--accent)]">{spec.toFixed(3)} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Repeatability</span>
                    <span className="font-mono font-bold text-[var(--text)]">{REPEATABILITY_SPEC.toFixed(3)} mm</span>
                  </div>
                </div>
              </div>

              <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
                {(['P100', 'P200'] as Plane[]).map(p => (
                  <button
                    key={p}
                    onClick={() => setCurPlane(p)}
                    className={cn(
                      "flex-1 py-3 text-xs font-mono font-bold tracking-widest transition-colors",
                      curPlane === p 
                        ? "bg-[var(--surface-2)] text-[var(--accent)] border-b-2 border-[var(--accent)]" 
                        : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-2)]"
                    )}
                  >
                    {p === 'P100' ? 'PLANE 100' : 'PLANE 200'}
                    <div className="text-[9px] opacity-70 mt-1">{p === 'P100' ? 'LP SIDE' : 'GEN SIDE'}</div>
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                <div className="text-xs font-mono text-[var(--accent)] uppercase tracking-widest mb-3 pb-2 border-b border-[var(--border)]">
                  ▶ Live Offset
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[var(--text-secondary)]">X Offset</span>
                    <span className={cn("font-mono font-bold text-lg", 
                      lastCalc.hOff !== null && Math.abs(lastCalc.hOff) > spec ? "text-[var(--danger)]" : "text-[var(--text)]"
                    )}>
                      {formatSgn(lastCalc.hOff)} <span className="text-xs text-[var(--text-tertiary)]">mm</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[var(--text-secondary)]">Y Offset</span>
                    <span className={cn("font-mono font-bold text-lg", 
                      lastCalc.vOff !== null && Math.abs(lastCalc.vOff) > spec ? "text-[var(--danger)]" : "text-[var(--text)]"
                    )}>
                      {formatSgn(lastCalc.vOff)} <span className="text-xs text-[var(--text-tertiary)]">mm</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Diagram */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[480px] relative p-12 bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-sm">
                <div className="absolute top-4 left-0 right-0 text-center text-xs font-mono text-[var(--text-tertiary)]">
                  ▶ Bearing Cross-Section — <span className="text-[var(--accent)]">{curPlane === 'P100' ? 'PLANE 100' : 'PLANE 200'}</span>
                </div>

                {/* Probe Inputs Overlay */}
                <div className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10">
                  <span className="text-[9px] font-mono text-[var(--text-tertiary)] uppercase tracking-widest">TOP / HIGH</span>
                  <span className="text-[10px] font-mono text-[var(--text-tertiary)]">( open )</span>
                </div>

                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col-reverse items-center gap-1 z-10">
                  <span className="text-[9px] font-mono text-[var(--text-tertiary)] uppercase tracking-widest">BOT · pos 106</span>
                  <input 
                    type="text" 
                    className="w-20 h-7 text-center text-xs font-mono bg-[var(--bg)] border border-[var(--border)] rounded text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                    placeholder="——.———"
                    value={lastRow?.bot || ''}
                    onChange={(e) => lastRow && updateRow(lastRow.id, 'bot', e.target.value)}
                  />
                </div>

                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-end gap-1 z-10">
                  <input 
                    type="text" 
                    className="w-20 h-7 text-center text-xs font-mono bg-[var(--bg)] border border-[var(--border)] rounded text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                    placeholder="——.———"
                    value={lastRow?.lh || ''}
                    onChange={(e) => lastRow && updateRow(lastRow.id, 'lh', e.target.value)}
                  />
                  <span className="text-[9px] font-mono text-[var(--text-tertiary)] uppercase tracking-widest">LH · pos 109</span>
                </div>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-start gap-1 z-10">
                  <input 
                    type="text" 
                    className="w-20 h-7 text-center text-xs font-mono bg-[var(--bg)] border border-[var(--border)] rounded text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                    placeholder="——.———"
                    value={lastRow?.rh || ''}
                    onChange={(e) => lastRow && updateRow(lastRow.id, 'rh', e.target.value)}
                  />
                  <span className="text-[9px] font-mono text-[var(--text-tertiary)] uppercase tracking-widest">RH · pos 103</span>
                </div>

                {/* SVG Diagram */}
                <svg viewBox="-120 -120 240 240" className="w-full overflow-visible">
                  <defs>
                    <radialGradient id="shellGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.5"/>
                      <stop offset="100%" stopColor="#070b12" stopOpacity="0.97"/>
                    </radialGradient>
                    <radialGradient id="rotorGrad" cx="38%" cy="32%" r="65%">
                      <stop offset="0%" stopColor="rgba(0,210,255,0.25)"/>
                      <stop offset="100%" stopColor="rgba(0,80,180,0.07)"/>
                    </radialGradient>
                    <filter id="rotorGlow" x="-40%" y="-40%" width="180%" height="180%">
                      <feGaussianBlur stdDeviation="3.5" result="b"/>
                      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                    <marker id="arr-vec" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                      <path d="M0,1 L8,4 L0,7 Z" fill="#ff6b35"/>
                    </marker>
                  </defs>

                  {/* Axes (Fixed on Shell) */}
                  <line x1="-110" y1="0" x2="103" y2="0" stroke="#4a6a8a" strokeWidth="0.8" strokeDasharray="5 3" opacity="0.6"/>
                  <line x1="0" y1="110" x2="0" y2="-103" stroke="#4a6a8a" strokeWidth="0.8" strokeDasharray="5 3" opacity="0.6"/>
                  <text x="108" y="4" fill="#4a6a8a" fontSize="8" fontFamily="monospace">+X</text>
                  <text x="3" y="-106" fill="#4a6a8a" fontSize="8" fontFamily="monospace">+Y</text>

                  {/* Spec Ring (Fixed on Shell) */}
                  <circle cx="0" cy="0" r={specR} fill="none" stroke={isOOS ? "rgba(239,68,68,0.5)" : "rgba(245,158,11,0.3)"} strokeWidth="1" strokeDasharray="5 3" />

                  {/* Shell Group (Fixed) */}
                  <g>
                    <circle cx="0" cy="0" r="109" fill="url(#shellGrad)" stroke="#162535" strokeWidth="1"/>
                    <circle cx="0" cy="0" r="100" fill="none" stroke="#243f5e" strokeWidth="14"/>
                    {/* Bolt holes */}
                    <circle cx="0" cy="-109" r="4.5" fill="#0c1828" stroke="#1e3a5f" strokeWidth="1"/>
                    <circle cx="0" cy="109" r="4.5" fill="#0c1828" stroke="#1e3a5f" strokeWidth="1"/>
                    <circle cx="-109" cy="0" r="4.5" fill="#0c1828" stroke="#1e3a5f" strokeWidth="1"/>
                    <circle cx="109" cy="0" r="4.5" fill="#0c1828" stroke="#1e3a5f" strokeWidth="1"/>
                    <text x="0" y="-80" textAnchor="middle" fill="rgba(74,106,138,0.6)" fontSize="7" fontFamily="monospace" letterSpacing="1">SHELL</text>
                  </g>

                  {/* Rotor (Moves) */}
                  <g transform={`translate(${rx},${ry})`} className="transition-transform duration-500 ease-out">
                    <circle cx="0" cy="0" r="60" fill="url(#rotorGrad)" stroke="#00c8ff" strokeWidth="2.2" filter="url(#rotorGlow)"/>
                    <circle cx="0" cy="0" r="52" fill="none" stroke="rgba(0,200,255,0.13)" strokeWidth="1"/>
                    <line x1="-9" y1="0" x2="9" y2="0" stroke="#00c8ff" strokeWidth="1.6"/>
                    <line x1="0" y1="-9" x2="0" y2="9" stroke="#00c8ff" strokeWidth="1.6"/>
                    <circle cx="0" cy="0" r="3.5" fill="#00c8ff"/>
                    <text x="0" y="-44" textAnchor="middle" fill="rgba(0,200,255,0.55)" fontSize="7" fontFamily="monospace" letterSpacing="1">ROTOR</text>
                  </g>

                  {/* Dynamic Gap Lines */}
                  {renderGapLines()}
                  
                  {/* Offset Vector (Red Dot on Rotor, Dotted Lines to Shell Axes) */}
                  {lastCalc.hOff !== null && lastCalc.vOff !== null && (
                    <>
                      {/* Dotted lines to axes */}
                      <line x1={rx} y1={ry} x2={rx} y2={0} stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.8" />
                      <line x1={rx} y1={ry} x2={0} y2={ry} stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.8" />
                      
                      {/* Red dot at rotor center */}
                      <circle cx={rx} cy={ry} r="3" fill="#ef4444" />
                    </>
                  )}
                </svg>
              </div>
              
              <div className="mt-4 text-[10px] font-mono text-[var(--text-tertiary)]">
                Rotor displacement ×{Math.round(scale)}× magnified · Shell fixed at origin
              </div>
            </div>

            {/* Column 3: Data Entry & Results */}
            <div className="space-y-6">
              {/* Reference Row */}
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] overflow-hidden">
                <div className="px-3 py-2 bg-[var(--surface)] border-b border-[var(--border)] text-[10px] font-mono font-bold text-[var(--accent)] tracking-widest uppercase">
                  REFERENCE — ASSEMBLY 2022
                </div>
                <div className="p-3 grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[9px] text-[var(--text-tertiary)] uppercase block mb-1">LH pos 109</label>
                    <input 
                      className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-2 py-1 text-xs font-mono text-[var(--text)]"
                      value={refLh}
                      onChange={(e) => updateRef('lh', e.target.value)}
                      placeholder="125.140"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-[var(--text-tertiary)] uppercase block mb-1">Bot pos 106</label>
                    <input 
                      className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-2 py-1 text-xs font-mono text-[var(--text)]"
                      value={refBot}
                      onChange={(e) => updateRef('bot', e.target.value)}
                      placeholder="125.080"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-[var(--text-tertiary)] uppercase block mb-1">RH pos 103</label>
                    <input 
                      className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-2 py-1 text-xs font-mono text-[var(--text)]"
                      value={refRh}
                      onChange={(e) => updateRef('rh', e.target.value)}
                      placeholder="125.080"
                    />
                  </div>
                </div>
                {/* Reference Results */}
                <div className="px-3 pb-3 grid grid-cols-3 gap-2">
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded p-2 text-center">
                    <div className="text-[9px] text-[var(--text-tertiary)] uppercase">Center</div>
                    <div className="font-mono font-bold text-sm text-[var(--text)]">{formatVal(refCalc.center)}</div>
                  </div>
                  <div className={cn("bg-[var(--surface)] border rounded p-2 text-center", 
                    refCalc.hOff !== null && Math.abs(refCalc.hOff) > spec ? "border-[var(--danger)]" : "border-[var(--border)]"
                  )}>
                    <div className="text-[9px] text-[var(--text-tertiary)] uppercase">H-Offset</div>
                    <div className={cn("font-mono font-bold text-sm", 
                      refCalc.hOff !== null && Math.abs(refCalc.hOff) > spec ? "text-[var(--danger)]" : "text-[var(--text)]"
                    )}>{formatSgn(refCalc.hOff)}</div>
                  </div>
                  <div className={cn("bg-[var(--surface)] border rounded p-2 text-center", 
                    refCalc.vOff !== null && Math.abs(refCalc.vOff) > spec ? "border-[var(--danger)]" : "border-[var(--border)]"
                  )}>
                    <div className="text-[9px] text-[var(--text-tertiary)] uppercase">V-Offset</div>
                    <div className={cn("font-mono font-bold text-sm", 
                      refCalc.vOff !== null && Math.abs(refCalc.vOff) > spec ? "text-[var(--danger)]" : "text-[var(--text)]"
                    )}>{formatSgn(refCalc.vOff)}</div>
                  </div>
                </div>
              </div>

              {/* Measurement Rows */}
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {rows.map((row, idx) => {
                  const calc = calcOffset(row.lh, row.bot, row.rh);
                  const hOOS = calc.hOff !== null && Math.abs(calc.hOff) > spec;
                  const vOOS = calc.vOff !== null && Math.abs(calc.vOff) > spec;
                  
                  // Repeatability check vs previous row
                  let dLh = null, dBot = null, dRh = null;
                  if (idx > 0) {
                    const prev = rows[idx - 1];
                    const pLh = safeParse(prev.lh);
                    const pBot = safeParse(prev.bot);
                    const pRh = safeParse(prev.rh);
                    if (calc.lh !== null && pLh !== null) dLh = calc.lh - pLh;
                    if (calc.bot !== null && pBot !== null) dBot = calc.bot - pBot;
                    if (calc.rh !== null && pRh !== null) dRh = calc.rh - pRh;
                  }

                  return (
                    <div key={row.id} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)] bg-[var(--surface-2)]">
                        <input 
                          className="bg-transparent border-none text-[10px] font-mono font-bold text-[var(--accent)] tracking-widest uppercase w-full focus:outline-none"
                          value={row.label}
                          onChange={(e) => updateRow(row.id, 'label', e.target.value)}
                        />
                        <button onClick={() => removeRow(row.id)} className="text-[var(--text-tertiary)] hover:text-[var(--danger)]">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      
                      <div className="p-3">
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div>
                            <label className="text-[9px] text-[var(--text-tertiary)] uppercase block mb-1">LH</label>
                            <input 
                              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-2 py-1 text-xs font-mono text-[var(--text)]"
                              value={row.lh}
                              onChange={(e) => updateRow(row.id, 'lh', e.target.value)}
                              placeholder="——.———"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-[var(--text-tertiary)] uppercase block mb-1">Bot</label>
                            <input 
                              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-2 py-1 text-xs font-mono text-[var(--text)]"
                              value={row.bot}
                              onChange={(e) => updateRow(row.id, 'bot', e.target.value)}
                              placeholder="——.———"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-[var(--text-tertiary)] uppercase block mb-1">RH</label>
                            <input 
                              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-2 py-1 text-xs font-mono text-[var(--text)]"
                              value={row.rh}
                              onChange={(e) => updateRow(row.id, 'rh', e.target.value)}
                              placeholder="——.———"
                            />
                          </div>
                        </div>

                        {/* Results Grid */}
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded p-2 text-center">
                            <div className="text-[9px] text-[var(--text-tertiary)] uppercase">Center</div>
                            <div className="font-mono font-bold text-sm text-[var(--text)]">{formatVal(calc.center)}</div>
                          </div>
                          <div className={cn("bg-[var(--surface-2)] border rounded p-2 text-center relative overflow-hidden", hOOS ? "border-[var(--danger)] bg-[var(--danger-soft)]" : "border-[var(--border)]")}>
                            <div className="text-[9px] text-[var(--text-tertiary)] uppercase">H-Offset</div>
                            <div className={cn("font-mono font-bold text-sm", hOOS ? "text-[var(--danger)]" : "text-[var(--success)]")}>
                              {formatSgn(calc.hOff)}
                            </div>
                            {calc.hOff !== null && (
                              <div className="text-[9px] mt-1 font-bold flex items-center justify-center gap-1">
                                {Math.abs(calc.hOff) <= spec ? <span className="text-[var(--success)]">OK</span> : <span className="text-[var(--danger)]">OOS</span>}
                              </div>
                            )}
                          </div>
                          <div className={cn("bg-[var(--surface-2)] border rounded p-2 text-center relative overflow-hidden", vOOS ? "border-[var(--danger)] bg-[var(--danger-soft)]" : "border-[var(--border)]")}>
                            <div className="text-[9px] text-[var(--text-tertiary)] uppercase">V-Offset</div>
                            <div className={cn("font-mono font-bold text-sm", vOOS ? "text-[var(--danger)]" : "text-[var(--success)]")}>
                              {formatSgn(calc.vOff)}
                            </div>
                            {calc.vOff !== null && (
                              <div className="text-[9px] mt-1 font-bold flex items-center justify-center gap-1">
                                {Math.abs(calc.vOff) <= spec ? <span className="text-[var(--success)]">OK</span> : <span className="text-[var(--danger)]">OOS</span>}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Move Required */}
                        {(calc.hOff !== null || calc.vOff !== null) && (
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <div className="bg-[var(--bg)] border border-[var(--border)] rounded p-2 flex items-center justify-between">
                              <span className="text-[9px] text-[var(--text-tertiary)] uppercase">H-Move</span>
                              <div className="flex items-center gap-1">
                                {calc.hOff !== null && Math.abs(calc.hOff) > 0.0005 ? (
                                  <>
                                    {calc.hOff > 0 ? <ArrowRight className="w-3 h-3 text-[var(--text-secondary)]" /> : <ArrowLeft className="w-3 h-3 text-[var(--text-secondary)]" />}
                                    <span className="font-mono text-xs font-bold text-[var(--text)]">{Math.abs(calc.hOff).toFixed(3)}</span>
                                  </>
                                ) : <span className="text-[var(--success)] text-xs">✓</span>}
                              </div>
                            </div>
                            <div className="bg-[var(--bg)] border border-[var(--border)] rounded p-2 flex items-center justify-between">
                              <span className="text-[9px] text-[var(--text-tertiary)] uppercase">V-Move</span>
                              <div className="flex items-center gap-1">
                                {calc.vOff !== null && Math.abs(calc.vOff) > 0.0005 ? (
                                  <>
                                    {calc.vOff > 0 ? <ArrowUp className="w-3 h-3 text-[var(--text-secondary)]" /> : <ArrowDown className="w-3 h-3 text-[var(--text-secondary)]" />}
                                    <span className="font-mono text-xs font-bold text-[var(--text)]">{Math.abs(calc.vOff).toFixed(3)}</span>
                                  </>
                                ) : <span className="text-[var(--success)] text-xs">✓</span>}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Repeatability */}
                        {idx > 0 && (
                          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--border)]">
                            {[dLh, dBot, dRh].map((d, i) => {
                              const ok = d === null || Math.abs(d) <= REPEATABILITY_SPEC;
                              return (
                                <div key={i} className="text-center">
                                  <div className="text-[8px] text-[var(--text-tertiary)] uppercase">Δ {['LH', 'Bot', 'RH'][i]}</div>
                                  <div className={cn("font-mono text-[10px]", ok ? "text-[var(--text-secondary)]" : "text-[var(--danger)] font-bold")}>
                                    {formatSgn(d)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <button onClick={addRow} className="flex-1 btn btn--primary justify-center">
                  <Plus className="w-4 h-4 mr-2" /> Add Measurement
                </button>
                <button onClick={reset} className="px-4 py-2 border border-[var(--border)] rounded text-[var(--text-tertiary)] hover:text-[var(--danger)] hover:border-[var(--danger)] transition-colors">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
