import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ShieldCheck, ArrowRight, UserCheck, KeyRound, Globe2, Shield, Cpu, Activity } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    const loginEmail = customEmail || email;
    const loginPass = customPass || password;

    if (!loginEmail || !loginPass) {
      setError('Mohon isi alamat email dan password Anda.');
      setLoading(false);
      return;
    }

    const res = await login(loginEmail, loginPass);
    setLoading(false);

    if (res.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setError(res.message || 'Login gagal. Periksa kembali email & password.');
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    handleLogin(undefined, demoEmail, 'password123');
  };

  return (
    <div className="min-h-screen bg-[#070C1B] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background Lighting Effects */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#EF3F09]/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-5xl bg-slate-900/80 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl grid grid-cols-1 lg:grid-cols-12 overflow-hidden z-10">
        
        {/* Left Side: Luxury Hotel Brand & Hospitality Identity */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0B132B] via-[#0F1836] to-[#121B3A] p-8 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/80">
          <div>
            {/* Header Brand */}
            <div className="flex items-center gap-3.5 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#EF3F09] to-amber-600 flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-[#EF3F09]/25 shrink-0 border border-white/10">
                GH
              </div>
              <div>
                <h1 className="font-black text-xl tracking-tight text-white leading-tight">Grand Horizon</h1>
                <p className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest">Resort & Suite PMS</p>
              </div>
            </div>

            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-widest">
                <Globe2 className="w-3 h-3 text-amber-400" /> Enterprise Property Console
              </span>
              <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-white leading-tight">
                Sistem Terpadu Manajemen Operasional Hotel
              </h2>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                Solusi manajemen properti terpusat untuk reservasi kamar, kasir F&B POS, encoder kunci kartu RFID, penutupan buku night audit, & analitik keuangan.
              </p>
            </div>
          </div>

          {/* System Terminal Status */}
          <div className="mt-10 space-y-3 pt-6 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-300 font-bold">
              <span className="flex items-center gap-2 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                System Core Online
              </span>
              <span className="text-slate-500 font-mono text-[10px]">v2.6.4-PROD</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-semibold pt-1">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">Golang REST API</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">PostgreSQL 16 DB</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2 text-[10px] text-slate-300 font-semibold">
              <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">REST API Access Logs (IP, Latency & Security Audit)</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form & SSO Quick Switch */}
        <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center bg-slate-900/60">
          <div className="max-w-md mx-auto w-full space-y-6">
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">Portal Log Masuk Staf</h3>
              <p className="text-slate-400 text-xs mt-1 font-semibold">Silakan masukkan email kredensial & kata sandi resmi hotel</p>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Alamat Email Staf
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@grandhorizon.com"
                    required
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#EF3F09] focus:ring-1 focus:ring-[#EF3F09] transition font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Kata Sandi Sekuritas
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#EF3F09] focus:ring-1 focus:ring-[#EF3F09] transition font-semibold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#EF3F09] to-orange-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#EF3F09]/30 hover:brightness-110 active:scale-[0.99] transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Memproses Log Masuk...</span>
                ) : (
                  <>
                    <span>Masuk Ke Dashboard Operating System</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Login Presets Card */}
            <div className="pt-6 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  Akses Cepat Mode Demo
                </span>
                <span className="text-[10px] text-slate-500 font-bold">Pass: password123</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('hendra.gm@grandhorizon.com')}
                  className="p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-left transition cursor-pointer group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <UserCheck className="w-3.5 h-3.5 text-[#EF3F09] group-hover:scale-110 transition" />
                    <span className="text-xs font-black text-white leading-none">Hendra G.</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 block">General Manager</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('sarah.j@grandhorizon.com')}
                  className="p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-left transition cursor-pointer group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition" />
                    <span className="text-xs font-black text-white leading-none">Sarah J.</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 block">FO Manager</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('bambang.s@grandhorizon.com')}
                  className="p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-left transition cursor-pointer group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition" />
                    <span className="text-xs font-black text-white leading-none">Bambang S.</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 block">FO Agent</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
