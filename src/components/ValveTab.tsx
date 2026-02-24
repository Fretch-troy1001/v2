import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Crosshair, Info, ChevronRight, Activity, Cpu } from 'lucide-react';
import { getValveComponents, getValvePlanes } from '../services/supabase';
import { ValveSpecification, Plane } from '../types';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export const ValveTab: React.FC = () => {
  const [activePart, setActivePart] = useState<string | null>(null);
  const [activePlane, setActivePlane] = useState<string | null>(null);
  const [components, setComponents] = useState<ValveSpecification[]>([]);
  const [planes, setPlanes] = useState<Plane[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [compData, planeData] = await Promise.all([
          getValveComponents('ICV'),
          getValvePlanes('ICV')
        ]);
        setComponents(compData);
        setPlanes(planeData);
      } catch (err) {
        console.error('[ValveTab Fetch]', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="pb-24 w-full max-w-7xl mx-auto space-y-12"
    >
      {/* ── Header ─────────────────────────── */}
      <motion.div variants={itemVariants} className="relative p-8 lg:p-12 rounded-[2.5rem] bg-gradient-to-br from-slate-900/40 to-slate-950/40 backdrop-blur-3xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full transform translate-x-1/3 -translate-y-1/3" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Cpu size={18} />
              </div>
              <span className="text-sm font-bold tracking-widest text-emerald-400 uppercase">Unit 2 B Inspection (Feb 2026)</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 font-outfit">
              Intercept Control <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Valve</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              MKRA500 T565 detailed diagnostic mapping. Correlated technical data from the active outage inspection notebook for precision maintenance.
            </p>
          </div>

          <div className="flex bg-slate-800/40 p-1 rounded-2xl border border-white/5 backdrop-blur-xl shrink-0">
            <div className="px-5 py-3 rounded-xl bg-emerald-500/20 text-emerald-400 text-sm font-bold flex items-center gap-2">
              <Activity size={16} /> Live Data Active
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── DIAGRAM 1: EQUIPMENT VIEW ───────────────── */}
      <section className="space-y-6">
        <div className="flex items-center gap-4 px-2">
          <h2 className="text-2xl font-bold text-white font-outfit">Equipment & Components</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <motion.div variants={itemVariants} className="relative rounded-[2.5rem] bg-slate-900/40 border border-white/5 overflow-hidden min-h-[550px] shadow-inner group">
            <div className="absolute inset-0 bg-black/40 mix-blend-overlay group-hover:bg-black/20 transition-all duration-700" />

            <div className="absolute inset-0 flex items-center justify-center p-8 z-0">
              <img
                src="/icv-diagram.jpg"
                alt="ICV Cross Sectional View"
                className="w-full h-full object-contain mix-blend-screen opacity-50"
              />
            </div>

            <div className="absolute inset-0">
              {components.filter(c => c.x && c.y).map(part => (
                <div key={part.item_id} className="absolute" style={{ left: `${part.x}%`, top: `${part.y}%` }}>
                  <motion.button
                    onMouseEnter={() => setActivePart(part.item_id)}
                    onMouseLeave={() => setActivePart(null)}
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold font-mono text-xs transition-all duration-300 shadow-xl ${activePart === part.item_id ? 'bg-emerald-500 border-emerald-300 text-slate-950 scale-125 z-20' : 'bg-slate-950/80 border-white/10 text-white hover:border-emerald-500/50 hover:bg-slate-900 z-10'}`}
                  >
                    {part.item_id.split('_')[1]}
                    {activePart === part.item_id && (
                      <span className="absolute inset-0 rounded-xl border border-emerald-400 animate-ping opacity-50" />
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {activePart === part.item_id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 5 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 p-5 rounded-2xl bg-slate-950/90 border border-emerald-500/20 backdrop-blur-2xl shadow-3xl z-30 pointer-events-none"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-white font-bold leading-tight">{part.component_name}</h4>
                          <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded">TAG {part.component_id}</span>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-500">Material</span>
                            <span className="text-slate-300 font-medium">{part.material || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-500">Nominal Spec</span>
                            <span className="text-slate-300 font-mono text-[10px]">{part.nominal_dia || 'Ref Only'}</span>
                          </div>
                          {part.planes && part.planes.length > 0 && (
                            <div className="flex justify-between text-[11px]">
                              <span className="text-slate-500">Planes Used</span>
                              <span className="text-emerald-400 font-bold">{part.planes.join(', ')}</span>
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed italic border-t border-white/5 pt-3">
                          {part.details}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-xl overflow-y-auto max-h-[550px] custom-scrollbar">
            <div className="flex items-center gap-2 mb-6 px-2">
              <Layers size={18} className="text-slate-500" />
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Part Manifest</h3>
            </div>
            <div className="space-y-2">
              {components.map(part => (
                <button
                  key={part.item_id}
                  onMouseEnter={() => setActivePart(part.item_id)}
                  onMouseLeave={() => setActivePart(null)}
                  className={`w-full group text-left p-4 rounded-2xl border transition-all duration-300 ${activePart === part.item_id ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-transparent hover:border-white/10'}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm font-bold ${activePart === part.item_id ? 'text-white' : 'text-slate-300'}`}>{part.component_id}. {part.component_name}</span>
                    <ChevronRight size={14} className={`transition-transform duration-300 ${activePart === part.item_id ? 'translate-x-1 text-emerald-400' : 'text-slate-600'}`} />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase">{part.material}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── DIAGRAM 2: PLANE VIEW ───────────────────── */}
      <section className="space-y-6">
        <div className="flex items-center gap-4 px-2">
          <h2 className="text-2xl font-bold text-white font-outfit">Measurement Planes</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>

        <motion.div variants={itemVariants} className="relative rounded-[2.5rem] bg-slate-900/40 border border-white/5 overflow-hidden min-h-[600px] shadow-2xl flex flex-col">
          <div className="p-6 border-b border-white/5 bg-slate-950/20 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Activity size={16} /></div>
              <div>
                <h3 className="text-white font-bold text-sm">Clearance & Fit Record</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Precision Tolerance Fit Mapping</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-mono">MKRA500 PLANE CHART</span>
            </div>
          </div>

          <div className="relative flex-1 bg-black/20 p-12">
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
              <div className="w-[80%] h-1/2 border-x-4 border-white/10 relative">
                <div className="absolute top-0 left-0 right-0 h-4 border-y border-white/10" />
                <div className="absolute bottom-0 left-0 right-0 h-4 border-y border-white/10" />
              </div>
            </div>

            {planes.filter(p => p.x && p.y).map(plane => (
              <div key={plane.clearance_id} className="absolute" style={{ left: `${plane.x}%`, top: `${plane.y}%` }}>
                <motion.button
                  onMouseEnter={() => setActivePlane(plane.clearance_id)}
                  onMouseLeave={() => setActivePlane(null)}
                  className={`group relative flex flex-col items-center gap-1 transition-all duration-300 ${activePlane === plane.clearance_id ? 'scale-110 z-20' : 'z-10 opacity-70 hover:opacity-100'}`}
                >
                  <div className={`w-1 h-16 rounded-full transition-all duration-300 ${activePlane === plane.clearance_id ? 'bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.5)]' : 'bg-slate-700'}`} />
                  <div className={`px-2 py-0.5 rounded-md text-[9px] font-black font-mono transition-all duration-300 ${activePlane === plane.clearance_id ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500 border border-white/5'}`}>
                    {plane.plane}
                  </div>
                </motion.button>

                <AnimatePresence>
                  {activePlane === plane.clearance_id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95, x: 10 }}
                      className="absolute left-6 top-0 w-80 p-6 rounded-3xl bg-slate-900/95 border border-blue-500/20 backdrop-blur-3xl shadow-4xl pointer-events-none z-30"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-lg font-black font-mono text-blue-400">PLANE {plane.plane}</div>
                        <div className="h-px flex-1 bg-white/10" />
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase font-black tracking-tighter mb-1">Fitted Assembly</div>
                          <div className="flex items-center gap-2 text-[11px] text-white font-bold">
                            <span className="text-blue-400">[H]</span> {plane.hole || 'Ref Casing'}
                            <ChevronRight size={10} className="text-slate-600" />
                            <span className="text-emerald-400">[S]</span> {plane.shaft || 'Ref Item'}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-[10px] text-slate-500 uppercase font-black tracking-tighter mb-1">Tolerance</div>
                            <div className="text-[11px] text-white font-mono bg-white/5 px-2 py-1 rounded-md inline-block">{plane.tolerance}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-500 uppercase font-black tracking-tighter mb-1">Clearance</div>
                            <div className="text-[11px] text-emerald-400 font-bold">{plane.clearance}</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5">
                          <div>
                            <div className="text-[10px] text-slate-500 uppercase font-black tracking-tighter mb-1">Offset</div>
                            <div className="text-[11px] text-slate-300">{plane.offset}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-500 uppercase font-black tracking-tighter mb-1">Op. Allowance</div>
                            <div className="text-[11px] text-slate-300">{plane.allowance}</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="p-6 bg-slate-950/30 border-t border-white/5 flex gap-4 items-center">
            <div className="p-2 bg-blue-400/10 text-blue-400 rounded-lg mt-1 shrink-0">
              <Info size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
                Measurement planes refer to key axial/radial inspection zones. Hover descriptors show dynamic fit tolerances (e.g., H8/e7) extracted from the **Unit 2 B Inspection notebook**. All clearances are nominal and subject to onsite machining adjustments.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
};
