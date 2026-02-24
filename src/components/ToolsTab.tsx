import React from 'react';
import { motion } from 'motion/react';
import { Settings, Calculator, Zap, ChevronRight, Info } from 'lucide-react';
import { SealRingCalculator } from './ui/valve-form';
import { BearingPositionCalculator } from './tools/bearing-position-calculator';
import { IsoToleranceCalculator } from './tools/iso-tolerance-calculator';
import { ValveLockWeldCalculator } from './tools/valve-lock-weld-calculator';
import { IcvClampingRingCalculator } from './tools/icv-clamping-ring-calculator';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export const ToolsTab: React.FC = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="pb-24 w-full max-w-6xl mx-auto space-y-12"
    >
      {/* ── Header Area ─────────────────────────── */}
      <motion.div variants={itemVariants} className="relative p-8 lg:p-12 rounded-[2.5rem] bg-gradient-to-br from-slate-900/40 to-slate-950/40 backdrop-blur-3xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] pointer-events-none rounded-full transform translate-x-1/4 -translate-y-1/4" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Settings size={18} />
              </div>
              <span className="text-sm font-bold tracking-widest text-blue-400 uppercase">Precision Systems</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 font-outfit">
              Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Utilities</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Highly specialized calculation tools for turbine maintenance, tolerances, and structural integrity checks.
            </p>
          </div>

          <div className="hidden lg:flex gap-4">
            <div className="p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md text-center min-w-[120px]">
              <div className="text-2xl font-bold text-white mb-1">5</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active Modules</div>
            </div>
            <div className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md text-center min-w-[120px]">
              <div className="text-2xl font-bold text-emerald-400 mb-1">Stable</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-500/70">System Status</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Calculators Grid ────────────────────── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-slate-200 font-bold tracking-wide uppercase text-sm">
            <Calculator size={18} className="text-emerald-400" /> Maintenance Calculators
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* We wrap the existing calculators but they need internal styling updates too */}
          {/* For now, we apply a container that elevates them */}

          <motion.div variants={itemVariants} className="contents">
            <SealRingCalculator />
          </motion.div>

          <motion.div variants={itemVariants} className="contents">
            <ValveLockWeldCalculator />
          </motion.div>

          <motion.div variants={itemVariants} className="contents">
            <IcvClampingRingCalculator />
          </motion.div>

          <motion.div variants={itemVariants} className="contents">
            <BearingPositionCalculator />
          </motion.div>

          <motion.div variants={itemVariants} className="contents">
            <IsoToleranceCalculator />
          </motion.div>
        </motion.div>
      </div>

      {/* ── Informational Footer ────────────────── */}
      <motion.div variants={itemVariants} className="p-6 rounded-[2rem] bg-blue-500/5 border border-blue-500/10 backdrop-blur-xl flex gap-4 items-start">
        <div className="p-2 bg-blue-400 rounded-lg text-slate-900 mt-1">
          <Info size={18} />
        </div>
        <div>
          <h4 className="text-white font-bold mb-1">Accuracy Disclaimer</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            All calculations are based on standard GE Turbine specifications documented in the Unit 2 B Inspection notebook.
            Always verify physical measurements twice before finalizing machining specifications.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

