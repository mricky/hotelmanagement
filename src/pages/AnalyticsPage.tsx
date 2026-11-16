import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSpreadsheet, Printer, TrendingUp, Building2, Wallet, Clock, ShieldCheck, Download } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [exporting, setExporting] = useState(false);

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      window.location.href = '/api/v1/analytics/export-excel';
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setTimeout(() => setExporting(false), 1000);
    }
  };

  const handlePrintPdf = () => {
    navigate('/analytics/print');
  };

  return (
    <div className="flex-1 min-w-0 pb-12">
      {/* Top Header Bar matching screenshot */}
      <div className="bg-white border-b border-slate-200/80 px-8 py-6 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-wider">
              EXECUTIVE AUDIT
            </span>
            <span className="text-slate-400 text-xs font-semibold">• Financial P&L & RevPAR Reports</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Pusat Analitik & Laporan Keuangan Eksekutif (P&L Audit)
          </h1>
          <p className="text-slate-500 text-xs font-semibold mt-0.5">
            Analisis performa pendapatan harian, RevPAR, ADR, occupancy rate, & cetak dokumen formal PDF
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportExcel}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-emerald-600/30 transition cursor-pointer flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{exporting ? 'Exporting...' : 'Export Excel (.XLSX)'}</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="px-5 py-3 bg-[#EF3F09] hover:bg-[#D63405] text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-[#EF3F09]/30 transition cursor-pointer flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen Resmi PDF</span>
          </button>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* 4 KPI Executive Cards matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Gross Revenue */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-slate-400 text-[11px] font-black uppercase tracking-wider">TOTAL REVENUE (GROSS)</p>
              <p className="text-3xl font-black text-slate-900">Rp 1,87 M</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black">
                +18,4% vs Bulan Lalu
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: RevPAR */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-slate-400 text-[11px] font-black uppercase tracking-wider">REVPAR (PER AVAIL ROOM)</p>
              <p className="text-3xl font-black text-slate-900">Rp 1.462.500</p>
              <span className="inline-block text-[#EF3F09] text-[10px] font-black">
                Target RevPAR Tercapai
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: ADR */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-slate-400 text-[11px] font-black uppercase tracking-wider">ADR (AVG DAILY RATE)</p>
              <p className="text-3xl font-black text-slate-900">Rp 1.950.000</p>
              <span className="inline-block text-amber-600 text-[10px] font-bold">
                Rata-rata harga ter-booking
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Wallet className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Occupancy */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-slate-400 text-[11px] font-black uppercase tracking-wider">TINGKAT HUNIAN (OCCUPANCY)</p>
              <p className="text-3xl font-black text-slate-900">75%</p>
              <span className="inline-block text-purple-600 text-[10px] font-extrabold">
                112 Dari 150 Kamar Terisi
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Trend Revenue Chart Container matching screenshot */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">Grafik Trend Pendapatan Harian (Daily Revenue P&L)</h3>
              <p className="text-slate-500 text-xs font-semibold mt-0.5">Perbandingan omzet kamar vs F&B Restoran vs Spa/Laundry</p>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#EF3F09]"></span> Kamar</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-600"></span> F&B Restoran</span>
            </div>
          </div>

          {/* SVG Line Chart Graphic matching screenshot */}
          <div className="relative h-64 w-full pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 800 200" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="20" x2="800" y2="20" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="60" x2="800" y2="60" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="100" x2="800" y2="100" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="140" x2="800" y2="140" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="180" x2="800" y2="180" stroke="#F1F5F9" strokeWidth="1" />

              {/* Area Gradient under Orange Line */}
              <defs>
                <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF3F09" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#EF3F09" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <polygon points="0,50 260,35 520,20 800,40 800,180 0,180" fill="url(#orangeGrad)" />

              {/* Orange Line: Room Revenue */}
              <path d="M 0,50 Q 260,35 520,20 T 800,40" fill="none" stroke="#EF3F09" strokeWidth="3" />

              {/* Blue Line: F&B Revenue */}
              <path d="M 0,170 Q 260,165 520,163 T 800,172" fill="none" stroke="#2563EB" strokeWidth="3" />

              {/* Data Points */}
              <circle cx="0" cy="50" r="5" fill="#EF3F09" />
              <circle cx="260" cy="35" r="5" fill="#EF3F09" />
              <circle cx="520" cy="20" r="5" fill="#EF3F09" />
              <circle cx="800" cy="40" r="5" fill="#EF3F09" />

              <circle cx="0" cy="170" r="4" fill="#2563EB" />
              <circle cx="260" cy="165" r="4" fill="#2563EB" />
              <circle cx="520" cy="163" r="4" fill="#2563EB" />
              <circle cx="800" cy="172" r="4" fill="#2563EB" />
            </svg>

            {/* X-Axis Labels */}
            <div className="flex justify-between text-[11px] font-bold text-slate-400 pt-2 border-t border-slate-100">
              <span>Minggu 1</span>
              <span>Minggu 2</span>
              <span>Minggu 3</span>
              <span>Minggu 4</span>
            </div>
          </div>
        </div>

        {/* P&L Financial Audit Statement Table matching screenshot */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
              TABEL RINCIAN LAPORAN LABA RUGI (P&L FINANCIAL AUDIT STATEMENT)
            </h3>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> AUDITED STATEMENT
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase border-b border-slate-200">
                  <th className="py-3.5 px-6">TANGGAL PERIODE</th>
                  <th className="py-3.5 px-6">KAMAR TERISI</th>
                  <th className="py-3.5 px-6">OKUPANSI (%)</th>
                  <th className="py-3.5 px-6">REVPAR (IDR)</th>
                  <th className="py-3.5 px-6">TOTAL GROSS REVENUE</th>
                  <th className="py-3.5 px-6 text-center">STATUS AUDIT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-800">
                <tr className="hover:bg-slate-50/60 transition">
                  <td className="py-4 px-6 font-extrabold text-slate-900">2026-08-01</td>
                  <td className="py-4 px-6">126 / 150 Unit</td>
                  <td className="py-4 px-6 text-emerald-600 font-black">84,0%</td>
                  <td className="py-4 px-6">Rp 1.158.000</td>
                  <td className="py-4 px-6 font-extrabold text-slate-900">Rp 173.700.000</td>
                  <td className="py-4 px-6 text-center">
                    <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-[10px] font-extrabold">Audited OK</span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/60 transition">
                  <td className="py-4 px-6 font-extrabold text-slate-900">2026-08-02</td>
                  <td className="py-4 px-6">130 / 150 Unit</td>
                  <td className="py-4 px-6 text-emerald-600 font-black">86,6%</td>
                  <td className="py-4 px-6">Rp 1.190.000</td>
                  <td className="py-4 px-6 font-extrabold text-slate-900">Rp 178.500.000</td>
                  <td className="py-4 px-6 text-center">
                    <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-[10px] font-extrabold">Audited OK</span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/60 transition">
                  <td className="py-4 px-6 font-extrabold text-slate-900">2026-08-03</td>
                  <td className="py-4 px-6">142 / 150 Unit</td>
                  <td className="py-4 px-6 text-emerald-600 font-black">94,6%</td>
                  <td className="py-4 px-6">Rp 1.300.000</td>
                  <td className="py-4 px-6 font-extrabold text-slate-900">Rp 195.000.000</td>
                  <td className="py-4 px-6 text-center">
                    <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-[10px] font-extrabold">Audited OK</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
