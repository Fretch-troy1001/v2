import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "../ui/dialog";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";
import { Settings, Info, AlertTriangle } from 'lucide-react';

// ─── ISO 286 DATA ──────────────────────────────────────────────────────────────
// [lower, upper, H7max, H7min, H8max, H8min, d8min, d8max, e8min, e8max, h8min, h8max, e7min, e7max, f7min, f7max, h7min, h7max, g6min, g6max, h6min, h6max, j6min, j6max, js6min, js6max, k6min, k6max, m6min, m6max, n6min, n6max, p6min, p6max, r6min, r6max, s6min, s6max, u6min, u6max]
const ISO286_RAW = [
  [18,24,   0.021,0,0.033,0,-0.065,-0.098,-0.04,-0.073,0,-0.033,-0.04,-0.061,-0.02,-0.041,0,-0.021,-0.007,-0.02,0,-0.013,0.009,-0.004,0.0065,-0.0065,0.015,0.002,0.021,0.008,0.028,0.015,0.035,0.022,0.041,0.028,0.048,0.035,0.054,0.041],
  [24,30,   0.021,0,0.033,0,-0.065,-0.098,-0.04,-0.073,0,-0.033,-0.04,-0.061,-0.02,-0.041,0,-0.021,-0.007,-0.02,0,-0.013,0.009,-0.004,0.0065,-0.0065,0.015,0.002,0.021,0.008,0.028,0.015,0.035,0.022,0.041,0.028,0.048,0.035,0.061,0.048],
  [30,40,   0.025,0,0.039,0,-0.08,-0.119,-0.05,-0.089,0,-0.039,-0.05,-0.075,-0.025,-0.05,0,-0.025,-0.009,-0.025,0,-0.016,0.011,-0.005,0.008,-0.008,0.018,0.002,0.025,0.009,0.033,0.017,0.042,0.026,0.05,0.034,0.059,0.043,0.076,0.06],
  [40,50,   0.025,0,0.039,0,-0.08,-0.119,-0.05,-0.089,0,-0.039,-0.05,-0.075,-0.025,-0.05,0,-0.025,-0.009,-0.025,0,-0.016,0.011,-0.005,0.008,-0.008,0.018,0.002,0.025,0.009,0.033,0.017,0.042,0.026,0.05,0.034,0.059,0.043,0.086,0.07],
  [50,65,   0.03,0,0.046,0,-0.1,-0.146,-0.06,-0.106,0,-0.046,-0.06,-0.09,-0.03,-0.06,0,-0.03,-0.01,-0.029,0,-0.019,0.012,-0.007,0.0095,-0.0095,0.021,0.002,0.03,0.011,0.039,0.02,0.051,0.032,0.06,0.041,0.072,0.053,0.106,0.087],
  [65,80,   0.03,0,0.046,0,-0.1,-0.146,-0.06,-0.106,0,-0.046,-0.06,-0.09,-0.03,-0.06,0,-0.03,-0.01,-0.029,0,-0.019,0.012,-0.007,0.0095,-0.0095,0.021,0.002,0.03,0.011,0.039,0.02,0.051,0.032,0.062,0.043,0.078,0.059,0.121,0.102],
  [80,100,  0.035,0,0.054,0,-0.12,-0.174,-0.072,-0.126,0,-0.054,-0.072,-0.107,-0.036,-0.071,0,-0.035,-0.012,-0.034,0,-0.022,0.013,-0.009,0.011,-0.011,0.025,0.003,0.035,0.013,0.045,0.023,0.059,0.037,0.073,0.051,0.093,0.071,0.146,0.124],
  [100,120, 0.035,0,0.054,0,-0.12,-0.174,-0.072,-0.126,0,-0.054,-0.072,-0.107,-0.036,-0.071,0,-0.035,-0.012,-0.034,0,-0.022,0.013,-0.009,0.011,-0.011,0.025,0.003,0.035,0.013,0.045,0.023,0.059,0.037,0.076,0.054,0.101,0.079,0.166,0.144],
  [120,140, 0.04,0,0.063,0,-0.145,-0.208,-0.085,-0.148,0,-0.063,-0.085,-0.125,-0.043,-0.083,0,-0.04,-0.014,-0.039,0,-0.025,0.014,-0.011,0.0125,-0.0125,0.028,0.003,0.04,0.015,0.052,0.027,0.068,0.043,0.088,0.063,0.117,0.092,0.195,0.17],
  [140,160, 0.04,0,0.063,0,-0.145,-0.208,-0.085,-0.148,0,-0.063,-0.085,-0.125,-0.043,-0.083,0,-0.04,-0.014,-0.039,0,-0.025,0.014,-0.011,0.0125,-0.0125,0.028,0.003,0.04,0.015,0.052,0.027,0.068,0.043,0.09,0.065,0.125,0.1,0.215,0.19],
  [160,180, 0.04,0,0.063,0,-0.145,-0.208,-0.085,-0.148,0,-0.063,-0.085,-0.125,-0.043,-0.083,0,-0.04,-0.014,-0.039,0,-0.025,0.014,-0.011,0.0125,-0.0125,0.028,0.003,0.04,0.015,0.052,0.027,0.068,0.043,0.093,0.068,0.133,0.108,0.235,0.21],
  [180,200, 0.046,0,0.072,0,-0.17,-0.242,-0.1,-0.172,0,-0.072,-0.1,-0.146,-0.05,-0.096,0,-0.046,-0.015,-0.044,0,-0.029,0.016,-0.013,0.0145,-0.0145,0.033,0.004,0.046,0.017,0.06,0.031,0.079,0.05,0.106,0.077,0.151,0.122,0.265,0.236],
  [200,225, 0.046,0,0.072,0,-0.17,-0.242,-0.1,-0.172,0,-0.072,-0.1,-0.146,-0.05,-0.096,0,-0.046,-0.015,-0.044,0,-0.029,0.016,-0.013,0.0145,-0.0145,0.033,0.004,0.046,0.017,0.06,0.031,0.079,0.05,0.109,0.08,0.159,0.13,0.287,0.258],
  [225,250, 0.046,0,0.072,0,-0.17,-0.242,-0.1,-0.172,0,-0.072,-0.1,-0.146,-0.05,-0.096,0,-0.046,-0.015,-0.044,0,-0.029,0.016,-0.013,0.0145,-0.0145,0.033,0.004,0.046,0.017,0.06,0.031,0.079,0.05,0.113,0.084,0.169,0.14,0.313,0.284],
  [250,280, 0.052,0,0.081,0,-0.19,-0.271,-0.11,-0.191,0,-0.081,-0.11,-0.162,-0.056,-0.108,0,-0.052,-0.017,-0.049,0,-0.032,0.016,-0.016,0.016,-0.016,0.036,0.004,0.052,0.02,0.066,0.034,0.088,0.056,0.126,0.094,0.19,0.158,0.347,0.315],
  [280,315, 0.052,0,0.081,0,-0.19,-0.271,-0.11,-0.191,0,-0.081,-0.11,-0.162,-0.056,-0.108,0,-0.052,-0.017,-0.049,0,-0.032,0.016,-0.016,0.016,-0.016,0.036,0.004,0.052,0.02,0.066,0.034,0.088,0.056,0.13,0.098,0.202,0.17,0.382,0.35],
  [315,355, 0.057,0,0.089,0,-0.21,-0.299,-0.125,-0.214,0,-0.089,-0.125,-0.182,-0.062,-0.119,0,-0.057,-0.018,-0.054,0,-0.036,0.018,-0.018,0.018,-0.018,0.04,0.004,0.057,0.021,0.073,0.037,0.098,0.062,0.144,0.108,0.226,0.19,0.426,0.39],
  [355,400, 0.057,0,0.089,0,-0.21,-0.299,-0.125,-0.214,0,-0.089,-0.125,-0.182,-0.062,-0.119,0,-0.057,-0.018,-0.054,0,-0.036,0.018,-0.018,0.018,-0.018,0.04,0.004,0.057,0.021,0.073,0.037,0.098,0.062,0.15,0.114,0.244,0.208,0.471,0.435],
  [400,450, 0.063,0,0.097,0,-0.23,-0.327,-0.135,-0.232,0,-0.097,-0.135,-0.198,-0.068,-0.131,0,-0.063,-0.02,-0.06,0,-0.04,0.02,-0.02,0.02,-0.02,0.045,0.005,0.063,0.023,0.08,0.04,0.108,0.068,0.166,0.126,0.272,0.232,0.53,0.49],
  [450,500, 0.063,0,0.097,0,-0.23,-0.327,-0.135,-0.232,0,-0.097,-0.135,-0.198,-0.068,-0.131,0,-0.063,-0.02,-0.06,0,-0.04,0.02,-0.02,0.02,-0.02,0.045,0.005,0.063,0.023,0.08,0.04,0.108,0.068,0.172,0.132,0.292,0.252,0.58,0.54],
  [500,560, 0.07,0,0.11,0,-0.26,-0.37,-0.145,-0.255,0,-0.11,-0.145,-0.215,-0.076,-0.146,0,-0.07,-0.022,-0.066,0,-0.044,0.022,-0.022,0.022,-0.022,0.044,0,0.07,0.026,0.088,0.044,0.122,0.078,0.194,0.15,0.324,0.28,0.644,0.6],
  [560,630, 0.07,0,0.11,0,-0.26,-0.37,-0.145,-0.255,0,-0.11,-0.145,-0.215,-0.076,-0.146,0,-0.07,-0.022,-0.066,0,-0.044,0.022,-0.022,0.022,-0.022,0.044,0,0.07,0.026,0.088,0.044,0.122,0.078,0.199,0.155,0.354,0.31,0.704,0.66],
  [630,710, 0.08,0,0.125,0,-0.29,-0.415,-0.16,-0.285,0,-0.125,-0.16,-0.24,-0.08,-0.16,0,-0.08,-0.024,-0.074,0,-0.05,0.044,-0.036,0.025,-0.025,0.05,0,0.08,0.03,0.1,0.05,0.138,0.088,0.225,0.175,0.39,0.34,0.79,0.74],
  [710,800, 0.08,0,0.125,0,-0.29,-0.415,-0.16,-0.285,0,-0.125,-0.16,-0.24,-0.08,-0.16,0,-0.08,-0.024,-0.074,0,-0.05,0.044,-0.036,0.025,-0.025,0.05,0,0.08,0.03,0.1,0.05,0.138,0.088,0.235,0.185,0.43,0.38,0.89,0.84],
  [800,900, 0.09,0,0.14,0,-0.32,-0.46,-0.17,-0.31,0,-0.14,-0.17,-0.26,-0.086,-0.176,0,-0.09,-0.026,-0.082,0,-0.056,0.05,-0.04,0.028,-0.028,0.056,0,0.09,0.034,0.112,0.056,0.156,0.1,0.266,0.21,0.486,0.43,0.996,0.94],
  [900,1000,0.09,0,0.14,0,-0.32,-0.46,-0.17,-0.31,0,-0.14,-0.17,-0.26,-0.086,-0.176,0,-0.09,-0.026,-0.082,0,-0.056,0.05,-0.04,0.028,-0.028,0.056,0,0.09,0.034,0.112,0.056,0.156,0.1,0.276,0.22,0.526,0.47,1.106,1.05],
  [1000,1120,0.105,0,0.165,0,-0.35,-0.515,-0.195,-0.36,0,-0.165,-0.195,-0.3,-0.098,-0.203,0,-0.105,-0.028,-0.094,0,-0.066,0.056,-0.046,0.033,-0.033,0.066,0,0.106,0.04,0.132,0.066,0.186,0.12,0.316,0.25,0.586,0.52,1.216,1.15],
  [1120,1250,0.105,0,0.165,0,-0.35,-0.515,-0.195,-0.36,0,-0.165,-0.195,-0.3,-0.098,-0.203,0,-0.105,-0.028,-0.094,0,-0.066,0.056,-0.046,0.033,-0.033,0.066,0,0.106,0.04,0.132,0.066,0.186,0.12,0.326,0.26,0.646,0.58,1.366,1.3],
  [1250,1400,0.125,0,0.195,0,-0.39,-0.585,-0.22,-0.415,0,-0.195,-0.22,-0.345,-0.11,-0.235,0,-0.125,-0.03,-0.108,0,-0.078,0.066,-0.054,0.039,-0.039,0.078,0,0.126,0.048,0.156,0.078,0.218,0.14,0.378,0.3,0.718,0.64,1.528,1.45],
  [1400,1600,0.125,0,0.195,0,-0.39,-0.585,-0.22,-0.415,0,-0.195,-0.22,-0.345,-0.11,-0.235,0,-0.125,-0.03,-0.108,0,-0.078,0.066,-0.054,0.039,-0.039,0.078,0,0.126,0.048,0.156,0.078,0.218,0.14,0.408,0.33,0.798,0.72,1.678,1.6],
  [1600,1800,0.15,0,0.23,0,-0.43,-0.66,-0.24,-0.47,0,-0.23,-0.24,-0.39,-0.12,-0.27,0,-0.15,-0.032,-0.124,0,-0.092,0.078,-0.064,0.046,-0.046,0.092,0,0.15,0.058,0.184,0.092,0.262,0.17,0.462,0.37,0.912,0.82,1.942,1.85],
  [1800,2000,0.15,0,0.23,0,-0.43,-0.66,-0.24,-0.47,0,-0.23,-0.24,-0.39,-0.12,-0.27,0,-0.15,-0.032,-0.124,0,-0.092,0.078,-0.064,0.046,-0.046,0.092,0,0.15,0.058,0.184,0.092,0.262,0.17,0.492,0.4,1.012,0.92,2.092,2],
  [2000,2240,0.175,0,0.28,0,-0.48,-0.76,-0.26,-0.54,0,-0.28,-0.26,-0.435,-0.13,-0.305,0,-0.175,-0.034,-0.144,0,-0.106,0.092,-0.076,0.055,-0.055,0.11,0,0.178,0.068,0.22,0.11,0.305,0.195,0.55,0.44,1.11,1,2.41,2.3],
  [2240,2500,0.175,0,0.28,0,-0.48,-0.76,-0.26,-0.54,0,-0.28,-0.26,-0.435,-0.13,-0.305,0,-0.175,-0.034,-0.144,0,-0.106,0.055,-0.055,0.055,-0.055,0.11,0,0.178,0.068,0.22,0.11,0.305,0.195,0.57,0.46,1.21,1.1,2.61,2.5],
];

const COLS: Record<string, { min: number; max: number }> = {
  'H7':  { min: 3, max: 2  },
  'H8':  { min: 5, max: 4  },
  'D8':  { min: 6, max: 7  },
  'E8':  { min: 8, max: 9  },
  'H8s': { min: 10,max: 11 },
  'E7':  { min: 12,max: 13 },
  'F7':  { min: 14,max: 15 },
  'H7s': { min: 16,max: 17 },
  'G6':  { min: 18,max: 19 },
  'H6':  { min: 20,max: 21 },
  'J6':  { min: 22,max: 23 },
  'JS6': { min: 24,max: 25 },
  'K6':  { min: 26,max: 27 },
  'M6':  { min: 28,max: 29 },
  'N6':  { min: 30,max: 31 },
  'P6':  { min: 32,max: 33 },
  'R6':  { min: 34,max: 35 },
  'S6':  { min: 36,max: 37 },
  'U6':  { min: 38,max: 39 },
};

const CLASS_MAP: Record<string, { key: string; type: 'hole' | 'shaft' }> = {
  'H7':  { key:'H7',  type:'hole' },
  'H8':  { key:'H8',  type:'hole' },
  'd8':  { key:'D8',  type:'shaft' },
  'e8':  { key:'E8',  type:'shaft' },
  'h8':  { key:'H8s', type:'shaft' },
  'e7':  { key:'E7',  type:'shaft' },
  'f7':  { key:'F7',  type:'shaft' },
  'h7':  { key:'H7s', type:'shaft' },
  'g6':  { key:'G6',  type:'shaft' },
  'h6':  { key:'H6',  type:'shaft' },
  'j6':  { key:'J6',  type:'shaft' },
  'js6': { key:'JS6', type:'shaft' },
  'k6':  { key:'K6',  type:'shaft' },
  'm6':  { key:'M6',  type:'shaft' },
  'n6':  { key:'N6',  type:'shaft' },
  'p6':  { key:'P6',  type:'shaft' },
  'r6':  { key:'R6',  type:'shaft' },
  's6':  { key:'S6',  type:'shaft' },
  'u6':  { key:'U6',  type:'shaft' },
};

const HOLE_CLASSES = ['H7','H8'];
const SHAFT_CLASSES = ['d8','e8','h8','e7','f7','h7','g6','h6','j6','js6','k6','m6','n6','p6','r6','s6','u6'];

// ─── HELPER FUNCTIONS ──────────────────────────────────────────────────────────
function findRow(nom: number) {
  return ISO286_RAW.find(r => nom > r[0] && nom <= r[1]) || null;
}

function getDeviations(nom: number, cls: string) {
  const row = findRow(nom);
  if (!row) return null;
  const info = CLASS_MAP[cls];
  if (!info) return null;
  const colInfo = COLS[info.key];
  const v0 = row[colInfo.min];
  const v1 = row[colInfo.max];

  let devMin, devMax;
  if (info.type === 'hole') {
    devMin = Math.min(v0, v1);
    devMax = Math.max(v0, v1);
  } else {
    devMin = Math.min(v0, v1);
    devMax = Math.max(v0, v1);
  }
  const rangeStr = `${row[0]}–${row[1]}`;
  return { devMin, devMax, rangeStr };
}

function fmt(n: number | null, dec = 3) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  const sign = n >= 0 ? '+' : '';
  return sign + n.toFixed(dec);
}

function fmtDim(n: number | null) {
  if (n === null || isNaN(n)) return '—';
  return n!.toFixed(4);
}

// ─── COMPONENT ─────────────────────────────────────────────────────────────────
export function IsoToleranceCalculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [idNom, setIdNom] = useState<string>('62.72');
  const [idCls, setIdCls] = useState('H7');
  const [odSame, setOdSame] = useState(true);
  const [odNom, setOdNom] = useState<string>('62.72');
  const [odCls, setOdCls] = useState('h6');
  const [offset, setOffset] = useState<string>('0');

  // Calculation State
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    calculate();
  }, [idNom, idCls, odSame, odNom, odCls, offset]);

  const calculate = () => {
    const idVal = parseFloat(idNom);
    const odVal = odSame ? idVal : parseFloat(odNom);
    const offVal = parseFloat(offset) || 0;

    if (isNaN(idVal) || isNaN(odVal)) {
      setError('Enter valid nominal diameter values.');
      setResults(null);
      return;
    }

    const idDev = getDeviations(idVal, idCls);
    const odDev = getDeviations(odVal, odCls);

    if (!idDev) {
      setError(`ID nominal ${idVal} mm is outside the supported range (18–2500 mm).`);
      setResults(null);
      return;
    }
    if (!odDev) {
      setError(`OD nominal ${odVal} mm is outside the supported range (18–2500 mm).`);
      setResults(null);
      return;
    }
    setError(null);

    const idMin = idVal + idDev.devMin;
    const idMax = idVal + idDev.devMax;
    const odMin = odVal + odDev.devMin;
    const odMax = odVal + odDev.devMax;

    const clMin = offVal + idMin - odMax;
    const clMax = offVal + idMax - odMin;

    let fitType, fitLabel;
    if (clMin >= 0) {
      fitType = 'clearance'; fitLabel = 'CLEARANCE FIT';
    } else if (clMax <= 0) {
      fitType = 'interference'; fitLabel = 'INTERFERENCE FIT';
    } else {
      fitType = 'transition'; fitLabel = 'TRANSITION FIT';
    }

    setResults({
      idDev, odDev, idMin, idMax, odMin, odMax, clMin, clMax, fitType, fitLabel,
      idVal, odVal // passed for diagram
    });
  };

  // Diagram rendering
  const renderDiagram = () => {
    if (!results) return null;
    const { idDev, odDev, fitType } = results;
    
    const W = 800;
    const H = 220;
    const cx = W / 2;
    const baseY = 140;

    const allDevs = [idDev.devMin, idDev.devMax, odDev.devMin, odDev.devMax];
    const devRange = Math.max(...allDevs) - Math.min(...allDevs);
    const visRange = Math.max(devRange * 1.8, 0.01);
    const scale = 100 / visRange;

    const devToY = (dev: number) => baseY - dev * scale;

    const idMinY = devToY(idDev.devMin);
    const idMaxY = devToY(idDev.devMax);
    const odMinY = devToY(odDev.devMin);
    const odMaxY = devToY(odDev.devMax);

    const barW = 90;
    const idX = cx - barW - 30;
    const odX = cx + 30;

    const fitColor = fitType === 'clearance' ? '#22c55e' : fitType === 'interference' ? '#ef4444' : '#eab308';
    const idColor = '#3b82f6';
    const odColor = '#f97316';

    const idTop = Math.min(idMinY, idMaxY);
    const idBot = Math.max(idMinY, idMaxY);
    const odTop = Math.min(odMinY, odMaxY);
    const odBot = Math.max(odMinY, odMaxY);

    // Clearance annotation
    const interY1 = devToY(Math.max(idDev.devMin, odDev.devMin));
    const interY2 = devToY(Math.min(idDev.devMax, odDev.devMax));
    
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full overflow-visible">
        {/* Grid */}
        <line x1="0" y1={baseY} x2={W} y2={baseY} stroke="var(--border)" strokeWidth="1" strokeDasharray="4,4"/>
        <text x="12" y={baseY - 4} fill="var(--text-tertiary)" fontFamily="monospace" fontSize="10" letterSpacing="1">NOMINAL</text>
        
        {/* Ticks */}
        {[idDev.devMin, idDev.devMax, odDev.devMin, odDev.devMax].map((dev, i) => (
          <line key={i} x1={cx-6} y1={devToY(dev)} x2={cx+6} y2={devToY(dev)} stroke="var(--border)" strokeWidth="1"/>
        ))}

        {/* ID Bar */}
        <rect x={idX} y={idTop} width={barW} height={Math.max(idBot - idTop, 1)} 
              fill="rgba(59,130,246,0.15)" stroke={idColor} strokeWidth="1.5" rx="2"/>
        <text x={idX + barW/2} y={idTop - 8} textAnchor="middle" fill={idColor}
              fontFamily="monospace" fontSize="11" fontWeight="bold">ID · {idCls}</text>
        <text x={idX - 8} y={idMaxY + 4} textAnchor="end" fill={idColor} fontFamily="monospace" fontSize="10">ES {fmt(idDev.devMax)}</text>
        <text x={idX - 8} y={idMinY + 4} textAnchor="end" fill={idColor} fontFamily="monospace" fontSize="10">EI {fmt(idDev.devMin)}</text>

        {/* OD Bar */}
        <rect x={odX} y={odTop} width={barW} height={Math.max(odBot - odTop, 1)}
              fill="rgba(249,115,22,0.15)" stroke={odColor} strokeWidth="1.5" rx="2"/>
        <text x={odX + barW/2} y={odTop - 8} textAnchor="middle" fill={odColor}
              fontFamily="monospace" fontSize="11" fontWeight="bold">OD · {odCls}</text>
        <text x={odX + barW + 8} y={odMaxY + 4} fill={odColor} fontFamily="monospace" fontSize="10">es {fmt(odDev.devMax)}</text>
        <text x={odX + barW + 8} y={odMinY + 4} fill={odColor} fontFamily="monospace" fontSize="10">ei {fmt(odDev.devMin)}</text>

        {/* Clearance Lines */}
        {Math.abs(interY2 - interY1) > 2 && (
          <>
            <line x1={idX + barW} y1={Math.min(interY1,interY2)} x2={odX} y2={Math.min(interY1,interY2)}
                  stroke={fitColor} strokeWidth="1" strokeDasharray="3,2" opacity="0.6"/>
            <line x1={idX + barW} y1={Math.max(interY1,interY2)} x2={odX} y2={Math.max(interY1,interY2)}
                  stroke={fitColor} strokeWidth="1" strokeDasharray="3,2" opacity="0.6"/>
          </>
        )}

        {/* Legend */}
        <text x={cx} y={baseY + 16} textAnchor="middle" fill="var(--text-tertiary)" fontFamily="monospace" fontSize="9">± 0.000</text>
        <text x={cx} y="18" textAnchor="middle" fill={fitColor} fontFamily="sans-serif" fontSize="13" fontWeight="600" letterSpacing="2">
          CL: {fmt(results.clMin, 4)} to {fmt(results.clMax, 4)} mm
        </text>
      </svg>
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
            <span className="tag tag--muted">ISO 286-1</span>
          </div>
          <div className="tool-card__title group-hover:text-[var(--accent)] transition-colors">ISO 286 Tolerance Calculator</div>
          <div className="tool-card__desc">Select deviation and IT grade (e.g. H7/f6) to calculate upper/lower deviations, clearance or interference limits, and fit classification.</div>
          <div className="tool-card__footer">
            <div><span className="tag tag--amber">Engineering</span></div>
            <button className="btn btn--primary">Open Tool</button>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-5xl h-[90vh] overflow-y-auto bg-[var(--bg)] border-[var(--border)] p-0 flex flex-col">
        <div className="p-6 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between sticky top-0 z-50">
          <div>
            <DialogTitle className="text-xl font-bold tracking-tight text-[var(--accent)] flex items-center gap-3">
              <Settings className="w-6 h-6" /> ISO 286 TOLERANCE CALCULATOR
            </DialogTitle>
            <DialogDescription className="text-[var(--text-secondary)] font-mono text-xs tracking-wider mt-1">
              LIMITS AND FITS · PREFERRED TOLERANCE CLASSES
            </DialogDescription>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* INPUT PANEL */}
            <div className="space-y-6">
              <div className="p-5 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                <div className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-widest mb-4 pb-2 border-b border-[var(--border)]">
                  Internal Diameter (Hole)
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] text-[var(--text-tertiary)] uppercase block mb-1">Nominal Ø</label>
                    <div className="relative">
                      <Input 
                        type="number" 
                        value={idNom} 
                        onChange={(e) => setIdNom(e.target.value)}
                        className="pr-8 font-mono"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-[var(--text-tertiary)]">mm</span>
                    </div>
                  </div>
                  <div className="w-32">
                    <label className="text-[10px] text-[var(--text-tertiary)] uppercase block mb-1">Class</label>
                    <select 
                      value={idCls} 
                      onChange={(e) => setIdCls(e.target.value)}
                      className="w-full h-10 rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    >
                      {HOLE_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="my-6 border-t border-[var(--border)]"></div>

                <div className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-widest mb-4 pb-2 border-b border-[var(--border)] flex justify-between items-center">
                  <span>Outer Diameter (Shaft)</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={odSame} 
                      onChange={(e) => setOdSame(e.target.checked)}
                      className="accent-[var(--accent)]"
                    />
                    <span className="text-[9px] text-[var(--text-tertiary)]">SAME NOMINAL</span>
                  </label>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] text-[var(--text-tertiary)] uppercase block mb-1">Nominal Ø</label>
                    <div className="relative">
                      <Input 
                        type="number" 
                        value={odSame ? idNom : odNom} 
                        onChange={(e) => setOdNom(e.target.value)}
                        disabled={odSame}
                        className={cn("pr-8 font-mono", odSame && "opacity-50")}
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-[var(--text-tertiary)]">mm</span>
                    </div>
                  </div>
                  <div className="w-32">
                    <label className="text-[10px] text-[var(--text-tertiary)] uppercase block mb-1">Class</label>
                    <select 
                      value={odCls} 
                      onChange={(e) => setOdCls(e.target.value)}
                      className="w-full h-10 rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    >
                      {SHAFT_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="my-6 border-t border-[var(--border)]"></div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] text-[var(--text-tertiary)] uppercase block mb-1">Offset (Optional)</label>
                    <div className="relative">
                      <Input 
                        type="number" 
                        value={offset} 
                        onChange={(e) => setOffset(e.target.value)}
                        className="pr-8 font-mono"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-[var(--text-tertiary)]">mm</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warnings */}
              {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>

            {/* RESULTS PANEL */}
            <div className="space-y-6">
              {results && (
                <>
                  {/* Main Fit Result */}
                  <div className="p-5 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                    <div className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-widest mb-4">
                      Fit / Clearance
                    </div>
                    <div className="mb-4">
                      <span className={cn(
                        "inline-flex items-center px-3 py-1 rounded border text-xs font-bold tracking-widest uppercase",
                        results.fitType === 'clearance' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                        results.fitType === 'interference' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                        "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                      )}>
                        {results.fitLabel}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[10px] text-[var(--text-tertiary)] uppercase mb-1">Min Clearance</div>
                        <div className={cn("text-2xl font-mono font-bold", results.clMin >= 0 ? "text-green-500" : "text-red-500")}>
                          {fmtDim(results.clMin)} <span className="text-xs text-[var(--text-tertiary)]">mm</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[var(--text-tertiary)] uppercase mb-1">Max Clearance</div>
                        <div className={cn("text-2xl font-mono font-bold", results.clMax >= 0 ? "text-green-500" : "text-red-500")}>
                          {fmtDim(results.clMax)} <span className="text-xs text-[var(--text-tertiary)]">mm</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Limits */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-xs font-bold text-blue-500">HOLE (ID)</div>
                        <div className="text-[10px] font-mono text-[var(--text-tertiary)]">{results.idDev.rangeStr} mm</div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-[10px] text-[var(--text-tertiary)]">
                            <span>MIN (EI {fmt(results.idDev.devMin)})</span>
                          </div>
                          <div className="font-mono text-sm font-bold text-[var(--text)]">{fmtDim(results.idMin)}</div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] text-[var(--text-tertiary)]">
                            <span>MAX (ES {fmt(results.idDev.devMax)})</span>
                          </div>
                          <div className="font-mono text-sm font-bold text-[var(--text)]">{fmtDim(results.idMax)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-xs font-bold text-orange-500">SHAFT (OD)</div>
                        <div className="text-[10px] font-mono text-[var(--text-tertiary)]">{results.odDev.rangeStr} mm</div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-[10px] text-[var(--text-tertiary)]">
                            <span>MIN (ei {fmt(results.odDev.devMin)})</span>
                          </div>
                          <div className="font-mono text-sm font-bold text-[var(--text)]">{fmtDim(results.odMin)}</div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] text-[var(--text-tertiary)]">
                            <span>MAX (es {fmt(results.odDev.devMax)})</span>
                          </div>
                          <div className="font-mono text-sm font-bold text-[var(--text)]">{fmtDim(results.odMax)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* DIAGRAM (Full Width) */}
            <div className="lg:col-span-2 p-6 rounded-lg border border-[var(--border)] bg-[var(--surface)] min-h-[260px] flex flex-col">
              <div className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-widest mb-4 pb-2 border-b border-[var(--border)]">
                Tolerance Band Diagram
              </div>
              <div className="flex-1 relative">
                {results ? renderDiagram() : (
                  <div className="absolute inset-0 flex items-center justify-center text-[var(--text-tertiary)] font-mono text-sm">
                    Enter values to see diagram
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
