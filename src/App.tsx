import React, { useState, useEffect } from 'react';
import { HomeTab } from './components/HomeTab';
import { ToolsTab } from './components/ToolsTab';
import { ValveTab } from './components/ValveTab';
import { GeneratorTab } from './components/GeneratorTab';
import { LoginPage } from './components/LoginPage';
import { supabase } from './services/supabase';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Settings,
  Database,
  Bell,
  HelpCircle,
  Plus,
  ChevronRight,
  User,
  Zap,
  LogOut,
  Cpu
} from 'lucide-react';
import { Session } from '@supabase/supabase-js';

type Tab = 'dashboard' | 'data' | 'generator' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <HomeTab />;
      case 'data': return <ValveTab />;
      case 'generator': return <GeneratorTab />;
      case 'settings': return <ToolsTab />;
      default: return <HomeTab />;
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Daily Feeds', icon: LayoutDashboard },
    { id: 'data', label: 'Valve Diagrams', icon: Database },
    { id: 'generator', label: 'Generator Overview', icon: Cpu },
    { id: 'settings', label: 'Engineering Tools', icon: Settings }
  ] as const;


  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950">
        <Zap size={48} className="text-emerald-500 animate-pulse" />
      </div>
    );
  }

  if (!session) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 relative">
      {/* ── Background Glow Effects ─────────────────────────── */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* ── Navigation Sidebar (Glassmorphic) ───────────────── */}
      <aside className="w-20 lg:w-72 flex-shrink-0 flex flex-col items-center lg:items-stretch bg-white/5 backdrop-blur-3xl border-r border-white/10 z-10 transition-all duration-300">
        <div className="p-6 lg:p-8 flex items-center justify-center lg:justify-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Zap size={20} className="fill-white" />
          </div>
          <span className="hidden lg:block text-white font-semibold text-xl tracking-tight font-outfit">GNPD</span>
        </div>

        <nav className="flex-1 w-full flex flex-col gap-2 px-3 lg:px-6 mt-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center justify-center lg:justify-start gap-4 p-3 lg:px-4 lg:py-3.5 rounded-2xl transition-all duration-300 group outline-none ${isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-emerald-400/10 border border-emerald-400/20 rounded-2xl"
                    initial={false}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon size={20} className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="hidden lg:block relative z-10 font-medium tracking-wide text-sm">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabDot"
                    className="hidden lg:block absolute right-4 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 lg:p-6 mt-auto border-t border-white/5 w-full space-y-4">
          <div className="flex items-center justify-center lg:justify-start gap-3 p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-white border border-white/10 flex-shrink-0">
              <User size={18} />
            </div>
            <div className="hidden lg:flex flex-col items-start overflow-hidden">
              <span className="text-sm font-medium text-slate-200 truncate w-full text-left">{session.user.email?.split('@')[0]}</span>
              <span className="text-[10px] text-emerald-400/80 truncate w-full text-left uppercase tracking-tighter font-bold">Authenticated</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-all group"
          >
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            <span className="hidden lg:block text-sm font-medium">System Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Workspace ────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">

        {/* Global Header (Glassmorphic) */}
        <header className="h-20 flex-shrink-0 flex items-center justify-between px-8 bg-black/20 backdrop-blur-xl border-b border-white/5 z-20">
          <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
            <span>GNPD App</span>
            <ChevronRight size={14} className="text-slate-600" />
            <AnimatePresence mode="popLayout">
              <motion.span
                key={activeTab}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-slate-200"
              >
                {tabs.find(t => t.id === activeTab)?.label}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-5">
            <button className="text-slate-400 hover:text-emerald-400 transition-colors">
              <HelpCircle size={20} />
            </button>
            <button className="text-slate-400 hover:text-emerald-400 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] transform hover:-translate-y-0.5">
              <Plus size={18} />
              <span className="text-sm">New Entry</span>
            </button>
          </div>
        </header>

        {/* Main Stage */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth p-8">
          <AnimatePresence mode="wait">
            <motion.main
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="max-w-7xl mx-auto h-full"
            >
              {renderContent()}
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

