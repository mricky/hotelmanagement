import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Printer } from 'lucide-react';

export const PrintReportPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 print:bg-white print:p-0 print:m-0">
      {/* Global CSS for Print Optimization */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          body {
            background-color: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          aside {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      {/* Top Floating Dark Bar - Hidden during print */}
      <div className="max-w-5xl mx-auto mb-8 bg-[#0B132B] text-white rounded-2xl p-4 px-6 shadow-xl flex flex-wrap items-center justify-between gap-4 print:hidden border border-slate-800">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
          <div>
            <h3 className="font-extrabold text-sm text-white">Dokumen Resmi PDF Audit Keuangan Ready</h3>
            <p className="text-[11px] text-slate-400 font-medium">Siap dicetak atau disimpan sebagai PDF (Ukuran A4 Portrait)</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/analytics')}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
          >
            Tutup Window
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-2.5 rounded-xl bg-[#EF3F09] hover:bg-[#D63405] text-white font-extrabold text-xs shadow-lg shadow-[#EF3F09]/30 transition flex items-center gap-2 cursor-pointer"
          >
            <span>Cetak PDF Sekarang</span>
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Official A4 Document Paper Container */}
      <div className="max-w-5xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-2xl print:shadow-none print:border-none print:p-0 print:w-full print:max-w-full">
        {/* Kop Surat Hotel Header */}
        <div className="flex items-start justify-between pb-4 border-b-2 border-slate-900 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-2xl tracking-tighter shrink-0 shadow-md">
              GH
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">GRAND HORIZON HOTEL BANDUNG</h1>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                Jl. Ir. H. Juanda No. 128, Dago, Bandung 40135 • Telp: (022) 8849-2000
              </p>
              <p className="text-xs font-semibold text-slate-600">
                Website: www.grandhorizonhotel.com • Email: finance@grandhorizonhotel.com
              </p>
            </div>
          </div>

          <div className="text-right space-y-1">
            <span className="px-3 py-1 rounded-md bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider inline-block">
              OFFICIAL AUDIT REPORT
            </span>
            <p className="text-xs font-bold text-slate-900 mt-1">No. Dokumen: #AUD-2026-08</p>
            <p className="text-xs text-slate-500 font-semibold">Tanggal Audit: 29 Agustus 2026</p>
          </div>
        </div>

        {/* Title Banner */}
        <div className="text-center space-y-1 mb-6">
          <h2 className="text-lg font-black text-slate-900 tracking-wide uppercase">
            LAPORAN FINANCIAL AUDIT & LABA RUGI (P&L STATEMENT)
          </h2>
          <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            PERIODE OPERASIONAL: AGUSTUS 2026
          </p>
        </div>

        {/* 4 Executive KPI Metrics Container */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">GROSS REVENUE</p>
            <p className="text-lg font-black text-slate-900 mt-0.5">Rp 1.875.000.000</p>
          </div>

          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">REVPAR</p>
            <p className="text-lg font-black text-slate-900 mt-0.5">Rp 1.462.500</p>
          </div>

          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">AVERAGE DAILY RATE</p>
            <p className="text-lg font-black text-slate-900 mt-0.5">Rp 1.950.000</p>
          </div>

          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">OCCUPANCY RATE</p>
            <p className="text-lg font-black text-slate-900 mt-0.5">75,0% (112/150)</p>
          </div>
        </div>

        {/* Financial Audit Table matching screenshot */}
        <div className="border border-slate-200/80 rounded-2xl overflow-hidden mb-8">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-600 uppercase border-b border-slate-200">
                <th className="py-3 px-4">KATEGORI PENDAPATAN / BIAYA OPERASIONAL</th>
                <th className="py-3 px-4 text-right">AGUSTUS 2026 (IDR)</th>
                <th className="py-3 px-4 text-right">JULI 2026 (IDR)</th>
                <th className="py-3 px-4 text-right">PERTUMBUHAN (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-slate-800">
              {/* Section 1: Gross Revenue */}
              <tr className="bg-slate-50/50 text-slate-900 font-black text-[11px]">
                <td colSpan={4} className="py-2.5 px-4 uppercase tracking-wide">
                  1. PENDAPATAN OPERASIONAL HOTEL (GROSS REVENUE)
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition">
                <td className="py-3 px-6 font-semibold">• Pendapatan Sewa Kamar (Room Division)</td>
                <td className="py-3 px-4 text-right font-black">Rp 1.545.000.000</td>
                <td className="py-3 px-4 text-right text-slate-500 font-normal">Rp 1.310.000.000</td>
                <td className="py-3 px-4 text-right text-emerald-600 font-black">+17,9%</td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition">
                <td className="py-3 px-6 font-semibold">• Pendapatan Restoran & F&B (Food & Beverage)</td>
                <td className="py-3 px-4 text-right font-black">Rp 245.000.000</td>
                <td className="py-3 px-4 text-right text-slate-500 font-normal">Rp 210.000.000</td>
                <td className="py-3 px-4 text-right text-emerald-600 font-black">+16,6%</td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition">
                <td className="py-3 px-6 font-semibold">• Pendapatan Spa, Laundry, & Layanan Kamar</td>
                <td className="py-3 px-4 text-right font-black">Rp 85.000.000</td>
                <td className="py-3 px-4 text-right text-slate-500 font-normal">Rp 64.000.000</td>
                <td className="py-3 px-4 text-right text-emerald-600 font-black">+32,8%</td>
              </tr>
              <tr className="bg-emerald-50/80 text-emerald-950 font-black text-xs border-t-2 border-emerald-200">
                <td className="py-3 px-4">TOTAL PENDAPATAN KOTOR (GROSS REVENUE)</td>
                <td className="py-3 px-4 text-right text-emerald-700">Rp 1.875.000.000</td>
                <td className="py-3 px-4 text-right text-slate-700 font-bold">Rp 1.584.000.000</td>
                <td className="py-3 px-4 text-right text-emerald-700">+18,4%</td>
              </tr>

              {/* Section 2: Operating Expenses */}
              <tr className="bg-slate-50/50 text-slate-900 font-black text-[11px]">
                <td colSpan={4} className="py-2.5 px-4 uppercase tracking-wide">
                  2. BIAYA OPERASIONAL (OPERATING EXPENSES)
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition">
                <td className="py-3 px-6 font-semibold">• Biaya Gaji Staf & General Housekeeping</td>
                <td className="py-3 px-4 text-right text-rose-600 font-black">(Rp 380.000.000)</td>
                <td className="py-3 px-4 text-right text-slate-500 font-normal">(Rp 375.000.000)</td>
                <td className="py-3 px-4 text-right text-slate-700 font-bold">+1,3%</td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition">
                <td className="py-3 px-6 font-semibold">• Biaya Listrik, Air, AC, & Operasional Gedung</td>
                <td className="py-3 px-4 text-right text-rose-600 font-black">(Rp 145.000.000)</td>
                <td className="py-3 px-4 text-right text-slate-500 font-normal">(Rp 140.000.000)</td>
                <td className="py-3 px-4 text-right text-slate-700 font-bold">+3,5%</td>
              </tr>

              {/* Net Operating Profit Highlight Row */}
              <tr className="bg-amber-100/70 text-slate-950 font-black text-xs border-t-2 border-amber-300">
                <td className="py-3.5 px-4">NET OPERATING PROFIT (LABA BERSIH OPERASIONAL)</td>
                <td className="py-3.5 px-4 text-right text-slate-900">Rp 1.350.000.000</td>
                <td className="py-3.5 px-4 text-right text-slate-700 font-bold">Rp 1.069.000.000</td>
                <td className="py-3.5 px-4 text-right text-emerald-700">+26,2%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Signature */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
          <div className="space-y-10">
            <p className="font-extrabold text-slate-700">Disiapkan Oleh (Financial Controller):</p>
            <div className="space-y-0.5">
              <p className="font-black text-slate-900 underline text-xs">Petugas Financial Controller</p>
              <p className="text-slate-500 font-semibold text-[10px]">Financial Controller & Head of Audit</p>
            </div>
          </div>

          <div className="space-y-10">
            <p className="font-extrabold text-slate-700">Disetujui Oleh (General Manager):</p>
            <div className="space-y-0.5">
              <p className="font-black text-slate-900 underline text-xs">General Manager Hotel</p>
              <p className="text-slate-500 font-semibold text-[10px]">General Manager Grand Horizon Resort</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
