import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Zap, Shield, Info, ChevronRight } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export const GeneratorTab: React.FC = () => {
    const [activeSegment, setActiveSegment] = useState<string | null>(null);

    const segments = [
        { id: 'rotor', name: 'Main Rotor', x: 50, y: 50, details: 'Hydrogen-cooled forged steel rotor. Rotating at 3600 RPM.' },
        { id: 'stator', name: 'Stator Winding', x: 30, y: 40, details: 'Water-cooled copper bars with high-voltage insulation.' },
        { id: 'exciter', name: 'Brushless Exciter', x: 80, y: 55, details: 'Provides field current to the main rotor via rotating rectifiers.' },
        { id: 'bearing', name: 'Journal Bearing', x: 15, y: 60, details: 'Tilting-pad type with high-pressure oil lift system.' }
    ];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="pb-24 w-full max-w-7xl mx-auto space-y-12"
        >
            {/* ── Header ─────────────────────────── */}
            <motion.div variants={itemVariants} className="relative p-8 lg:p-12 rounded-[2.5rem] bg-gradient-to-br from-slate-900/40 to-slate-950/40 backdrop-blur-3xl border border-white/10 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] pointer-events-none rounded-full transform translate-x-1/3 -translate-y-1/3" />

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                            <Zap size={24} />
                        </div>
                        <span className="text-sm font-bold tracking-widest text-cyan-400 uppercase">Hardware Expansion</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 font-outfit">
                        Generator <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Overview</span>
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-3xl">
                        Hydrogen-cooled synchronous generator diagnostic view. Mapping critical stator/rotor clearances and thermal monitoring zones.
                    </p>
                </div>
            </motion.div>

            {/* ── Schematic View ──────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div variants={itemVariants} className="lg:col-span-2 relative rounded-[3rem] bg-slate-900/60 border border-white/5 overflow-hidden min-h-[500px] shadow-2xl group flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/60 z-10" />

                    {/* Placeholder for actual Generator SVG/Image */}
                    <div className="relative z-0 w-full h-full flex items-center justify-center opacity-40 group-hover:opacity-60 transition-opacity duration-700">
                        <div className="w-[80%] h-48 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-full border-y-8 border-white/5 flex items-center justify-center relative">
                            <div className="absolute inset-0 flex items-center justify-around">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="w-[2px] h-full bg-white/5" />
                                ))}
                            </div>
                            <div className="text-slate-500 font-black text-6xl tracking-[2rem] ml-[2rem] opacity-20 uppercase font-outfit">Generator</div>
                        </div>
                    </div>

                    <div className="absolute inset-0 z-20">
                        {segments.map(seg => (
                            <div key={seg.id} className="absolute" style={{ left: `${seg.x}%`, top: `${seg.y}%` }}>
                                <motion.button
                                    onMouseEnter={() => setActiveSegment(seg.id)}
                                    onMouseLeave={() => setActiveSegment(null)}
                                    className={`w-4 h-4 rounded-full transition-all duration-300 ${activeSegment === seg.id ? 'bg-cyan-400 scale-150 shadow-[0_0_20px_rgba(34,211,238,0.8)]' : 'bg-white/20 border border-white/20 hover:bg-white/40'}`}
                                >
                                    {activeSegment === seg.id && (
                                        <span className="absolute inset-0 rounded-full border border-cyan-400 animate-ping opacity-60" />
                                    )}
                                </motion.button>

                                <AnimatePresence>
                                    {activeSegment === seg.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-60 p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/20 backdrop-blur-xl shadow-2xl pointer-events-none"
                                        >
                                            <h4 className="text-white font-bold text-sm mb-1">{seg.name}</h4>
                                            <p className="text-[11px] text-slate-400 leading-relaxed">{seg.details}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-6">
                    <div className="panel-glass rounded-[2rem] p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Shield size={20} className="text-cyan-400" />
                            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Active Parameters</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'Hydrogen Pressure', value: '450 kPa', color: 'text-emerald-400' },
                                { label: 'Stator Temp', value: '62° C', color: 'text-amber-400' },
                                { label: 'Shaft Vibration', value: '25 µm', color: 'text-emerald-400' },
                                { label: 'Terminal Power', value: '660 MW', color: 'text-cyan-400' }
                            ].map((stat, i) => (
                                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                                    <span className="text-xs text-slate-400 font-medium">{stat.label}</span>
                                    <span className={`text-sm font-bold font-mono ${stat.color}`}>{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="panel-glass rounded-[2rem] p-8 border-cyan-500/10">
                        <div className="flex items-center gap-3 mb-4">
                            <Info size={18} className="text-slate-500" />
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Maintenance Note</h3>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Next partial discharge test scheduled for **Week 4 of Outage**. Current insulation resistance is within nominal GE standards.
                        </p>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};
