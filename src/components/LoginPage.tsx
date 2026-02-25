import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { motion } from 'motion/react';
import { Lock, Mail, Loader2, Zap } from 'lucide-react';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError(authError.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/20 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md panel-glass rounded-[2.5rem] p-8 md:p-12 relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20 rotate-12">
                        <Zap size={32} className="text-white animate-spin-slow" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter mb-2 font-outfit">
                        Turbine <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Systems</span>
                    </h1>
                    <p className="text-slate-400 font-medium">Engineering Access Protocol</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                required
                                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                                placeholder="engineer@gnpd.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm font-medium"
                        >
                            {error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn btn--primary py-4 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Access System"}
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-500 text-sm font-medium">
                    Authorized personnel only. All access is logged.
                </p>
            </motion.div>
        </div>
    );
};
