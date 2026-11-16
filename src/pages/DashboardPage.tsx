import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AddBookingModal } from '../components/AddBookingModal';
import { AddRoomModal } from '../components/AddRoomModal';
import { 
  Wallet, BedDouble, TrendingUp, DollarSign, Moon, Plus, 
  UserCheck, Key, Zap, ChevronRight, Activity, ShieldCheck 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const DashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [stats, setStats] = useState({
    total_revenue: 'Rp 1,87 M',
    occupancy_rate: '84.2%',
    occupied_count: 126,
    total_rooms: 150,
    revpar: 'Rp 1,59 M',
    adr: 'Rp 1,89 M',
  });

  React.useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/v1/dashboard');
      const data = await res.json();
      if (data && data.status === 'success' && data.data) {
        setStats((prev) => ({ ...prev, ...data.data }));
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    }
  };

  return (
    <div className="flex-1 min-w-0 pb-12">
      {/* Top Header Bar matching screenshot */}
      <div className="bg-white border-b border-slate-200/80 px-8 py-6 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-wider">
              PROPERTY EXECUTIVE OVERVIEW
            </span>
            <span className="text-slate-400 text-xs font-semibold">• Live PMS Sync</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('dashboard.title')}
          </h1>
          <p className="text-slate-500 text-xs font-semibold mt-0.5">
            {t('dashboard.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <NavLink
            to="/night-audit"
            className="px-5 py-3 bg-[#0B132B] hover:bg-slate-900 text-white font-extrabold text-xs rounded-2xl shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <Moon className="w-4 h-4 text-amber-400" />
            <span>Night Audit</span>
          </NavLink>

          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="px-6 py-3 bg-[#EF3F09] hover:bg-[#D63405] text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-[#EF3F09]/30 transition transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Input Reservasi Tamu</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <AddBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSuccess={() => alert('Reservasi baru berhasil didaftarkan!')}
      />

      <AddRoomModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        onSuccess={() => alert('Kunci kamar baru berhasil disimpan!')}
      />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* 4 KPI Metric Cards matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Pendapatan */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-slate-400 text-[11px] font-black uppercase tracking-wider">TOTAL PENDAPATAN (IDR)</p>
              <p className="text-3xl font-black text-slate-900">{stats.total_revenue}</p>
              <p className="text-emerald-600 text-[11px] font-extrabold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +18.4% bulan ini
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Wallet className="w-7 h-7" />
            </div>
          </div>

          {/* Card 2: Tingkat Okupansi */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-slate-400 text-[11px] font-black uppercase tracking-wider">TINGKAT OKUPANSI</p>
              <p className="text-3xl font-black text-slate-900">{stats.occupancy_rate}</p>
              <p className="text-emerald-600 text-[11px] font-extrabold flex items-center gap-1">
                ✓ {stats.occupied_count} dari {stats.total_rooms} Kamar terisi
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <BedDouble className="w-7 h-7" />
            </div>
          </div>

          {/* Card 3: RevPAR */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-slate-400 text-[11px] font-black uppercase tracking-wider">REVPAR (REV / ROOM)</p>
              <p className="text-3xl font-black text-slate-900">{stats.revpar}</p>
              <p className="text-emerald-600 text-[11px] font-extrabold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +12.5% YoY Growth
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-7 h-7" />
            </div>
          </div>

          {/* Card 4: ADR */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-slate-400 text-[11px] font-black uppercase tracking-wider">RATA-RATA TARIF (ADR)</p>
              <p className="text-3xl font-black text-slate-900">{stats.adr}</p>
              <p className="text-purple-600 text-[11px] font-extrabold flex items-center gap-1">
                +8.2% vs target harian
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <DollarSign className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* Two Column Layout matching screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2/3 width): Tren Pendapatan Chart */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Tren Pendapatan & Okupansi Harian</h3>
                <p className="text-slate-500 text-xs font-semibold mt-0.5">Perbandingan omzet harian hotel minggu ini (IDR)</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
                Real-Time Data
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-2 rounded bg-[#EF3F09]"></span> Pendapatan Harian (Juta Rp)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 border-t-2 border-dashed border-slate-400"></span> Target Harian (Juta Rp)
              </span>
            </div>

            {/* SVG Interactive Line Chart matching screenshot */}
            <div className="relative h-64 w-full pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
                {/* Y-Axis Grid Lines & Labels */}
                <line x1="0" y1="20" x2="700" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="60" x2="700" y2="60" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="100" x2="700" y2="100" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="140" x2="700" y2="140" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="180" x2="700" y2="180" stroke="#F1F5F9" strokeWidth="1" />

                {/* Target Dashed Line */}
                <path d="M 0,170 Q 350,110 700,120" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6 6" />

                {/* Gradient Fill under Main Revenue Curve */}
                <defs>
                  <linearGradient id="dashboardGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EF3F09" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#EF3F09" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <polygon points="0,175 116,145 233,130 350,120 466,60 583,20 700,45 700,180 0,180" fill="url(#dashboardGrad)" />

                {/* Main Orange Curve */}
                <path d="M 0,175 L 116,145 L 233,130 L 350,120 L 466,60 L 583,20 L 700,45" fill="none" stroke="#EF3F09" strokeWidth="3.5" />

                {/* Data Points */}
                <circle cx="0" cy="175" r="5" fill="#EF3F09" />
                <circle cx="116" cy="145" r="5" fill="#EF3F09" />
                <circle cx="233" cy="130" r="5" fill="#EF3F09" />
                <circle cx="350" cy="120" r="5" fill="#EF3F09" />
                <circle cx="466" cy="60" r="5" fill="#EF3F09" />
                <circle cx="583" cy="20" r="6" fill="#EF3F09" stroke="#FFF" strokeWidth="2" />
                <circle cx="700" cy="45" r="5" fill="#EF3F09" />
              </svg>

              {/* X-Axis Day Labels */}
              <div className="flex justify-between text-[11px] font-bold text-slate-400 pt-3 border-t border-slate-100">
                <span>Senin</span>
                <span>Selasa</span>
                <span>Rabu</span>
                <span>Kamis</span>
                <span>Jumat</span>
                <span>Sabtu</span>
                <span>Minggu</span>
              </div>
            </div>
          </div>

          {/* Right Column (1/3 width): Quick Actions Resepsionis Dark Container */}
          <div className="bg-[#0B132B] text-white rounded-3xl p-7 border border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-black tracking-wide">Quick Actions Resepsionis</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/30">
                  Live Console
                </span>
              </div>

              {/* Quick Action Item 1 */}
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full bg-slate-900/80 hover:bg-slate-800 p-4 rounded-2xl border border-slate-800 transition flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-extrabold text-xs text-white group-hover:text-[#EF3F09] transition">
                      Input Reservasi Tamu (WNI / WNA)
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">Form Pendaftaran KTP NIK / Paspor</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
              </button>

              {/* Quick Action Item 2 */}
              <button
                onClick={() => setIsRoomModalOpen(true)}
                className="w-full bg-slate-900/80 hover:bg-slate-800 p-4 rounded-2xl border border-slate-800 transition flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-extrabold text-xs text-white group-hover:text-[#EF3F09] transition">
                      Tambah Kunci Kamar Baru
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">Unit inventaris PMS baru</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
              </button>

              {/* Quick Action Item 3 */}
              <NavLink
                to="/pricing"
                className="w-full bg-slate-900/80 hover:bg-slate-800 p-4 rounded-2xl border border-slate-800 transition flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-extrabold text-xs text-white group-hover:text-[#EF3F09] transition">
                      Dynamic Pricing Engine
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">Weekend Surge & Occupancy Rule</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
              </NavLink>

              {/* Quick Action Item 4 */}
              <NavLink
                to="/night-audit"
                className="w-full bg-slate-900/80 hover:bg-slate-800 p-4 rounded-2xl border border-slate-800 transition flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-extrabold text-xs text-white group-hover:text-[#EF3F09] transition">
                      Night Audit Automation
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">Tutup Buku Harian & Auto Posting</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
              </NavLink>
            </div>

            {/* Footer status */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-bold">
              <span>PMS Version 2.0 • Luxury Suite</span>
              <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> System Normal
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
