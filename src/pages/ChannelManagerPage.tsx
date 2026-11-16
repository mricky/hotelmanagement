import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Radio, Zap, CheckCircle2, Terminal, RefreshCw, Send } from 'lucide-react';

export const ChannelManagerPage: React.FC = () => {
  const [stockSuite, setStockSuite] = useState(8);
  const [stockDeluxe, setStockDeluxe] = useState(15);
  const [stockStandard, setStockStandard] = useState(22);
  const [channels, setChannels] = useState<any[]>([]);
  const [logs, setLogs] = useState<string[]>([
    '// Channel Manager 2-Way Engine siap menerima sinyal simulasi reservasi OTA...',
  ]);

  React.useEffect(() => {
    fetchMatrix();
  }, []);

  const fetchMatrix = async () => {
    try {
      const res = await fetch('/api/v1/channel-manager/matrix');
      const data = await res.json();
      if (data && data.status === 'success' && Array.isArray(data.channels)) {
        setChannels(data.channels);
      }
    } catch (err) {
      console.error('Failed to fetch channel matrix:', err);
    }
  };

  const addLog = (message: string) => {
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString('id-ID')}] ${message}`,
      ...prev,
    ]);
  };

  const handleSimulateBooking = (channel: string) => {
    if (stockSuite <= 0) {
      addLog(`❌ ERR: Stok Executive Suite habis! Pemotongan 2-Way Allotment ditolak.`);
      return;
    }

    const newSuite = stockSuite - 1;
    setStockSuite(newSuite);

    const payload = {
      event: 'OTA_RESERVATION_CREATED',
      channel,
      room_type: 'Executive Suite',
      units_booked: 1,
      remaining_allotment: newSuite,
      two_way_sync: 'SUCCESS_200_OK',
    };

    addLog(`📩 [2-WAY SYNC RECV] Reservasi baru dari ${channel}: 1 Unit Executive Suite. Stok terpotong di Traveloka, Agoda, Booking.com, & Direct Web -> sisa ${newSuite} kamar.`);
    addLog(`JSON Webhook Payload: ${JSON.stringify(payload)}`);
  };

  return (
    <div className="flex-1 min-w-0 pb-12">
      <Header
        title="Channel Manager OTA (2-Way Live Sync Allotment)"
        titleBadge="Live 2-Way OTA Engine"
        subtitle="Sinkronisasi otomatis alokasi stok kamar, tarif dasar, & pemotongan reservasi antar OTA secara real-time"
      />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Top 4 OTA Cards matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Traveloka */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-black text-sm text-blue-600 flex items-center gap-1.5">
                ✈️ Traveloka
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> ONLINE
              </span>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">62 Booking</p>
              <p className="text-slate-400 text-xs font-semibold mt-0.5">Sync Latency: <strong className="text-slate-700">0.8 Detik</strong></p>
            </div>
          </div>

          {/* Agoda */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-black text-sm text-amber-600 flex items-center gap-1.5">
                ⚡ Agoda
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> ONLINE
              </span>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">45 Booking</p>
              <p className="text-slate-400 text-xs font-semibold mt-0.5">Sync Latency: <strong className="text-slate-700">1.2 Detik</strong></p>
            </div>
          </div>

          {/* Booking.com */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-black text-sm text-indigo-600 flex items-center gap-1.5">
                🏨 Booking.com
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> ONLINE
              </span>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">28 Booking</p>
              <p className="text-slate-400 text-xs font-semibold mt-0.5">Sync Latency: <strong className="text-slate-700">1.5 Detik</strong></p>
            </div>
          </div>

          {/* Direct Web Engine */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-black text-sm text-[#EF3F09] flex items-center gap-1.5">
                🌐 Direct Web Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> INSTANT
              </span>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">95 Booking</p>
              <p className="text-slate-400 text-xs font-semibold mt-0.5">Sync Latency: <strong className="text-emerald-600">0.05 Detik</strong></p>
            </div>
          </div>
        </div>

        {/* Main Table Allotment Matrix matching screenshot */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                MATRIKS ALOKASI STOK KAMAR & HARGA PER CHANNEL (LIVE 2-WAY ALLOTMENT)
              </h3>
              <p className="text-slate-500 text-xs font-semibold mt-0.5">
                Perubahan pada satu channel otomatis memotong stok di seluruh OTA secara real-time
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-black tracking-wide shadow-sm">
              API Matrix Status: 200 OK
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase border-b border-slate-200">
                  <th className="py-4 px-6 w-64">TIPE KAMAR & TARIF DASAR</th>
                  <th className="py-4 px-4 text-center">✈️ TRAVELOKA STOK</th>
                  <th className="py-4 px-4 text-center">⚡ AGODA STOK</th>
                  <th className="py-4 px-4 text-center">🏨 BOOKING.COM STOK</th>
                  <th className="py-4 px-4 text-center">🌐 DIRECT WEB STOK</th>
                  <th className="py-4 px-6 text-center">STATUS SINKRONISASI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-bold">
                {/* Row 1: Executive Suite */}
                <tr className="hover:bg-slate-50/60 transition">
                  <td className="py-5 px-6">
                    <p className="font-extrabold text-slate-900 text-sm">Executive Suite</p>
                    <p className="text-[#EF3F09] text-xs font-black">Rp 3.200.000 <span className="text-slate-400 font-normal">/ malam</span></p>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <span className="px-4 py-2 rounded-2xl bg-blue-50 text-blue-800 text-xs font-black">{stockSuite} Kamar</span>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <span className="px-4 py-2 rounded-2xl bg-amber-50 text-amber-800 text-xs font-black">{stockSuite} Kamar</span>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <span className="px-4 py-2 rounded-2xl bg-indigo-50 text-indigo-800 text-xs font-black">{stockSuite} Kamar</span>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <span className="px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-black">{stockSuite} Kamar</span>
                  </td>
                  <td className="py-5 px-6 text-center">
                    <span className="text-emerald-600 font-extrabold flex items-center justify-center gap-1">
                      Synced <CheckCircle2 className="w-4 h-4" />
                    </span>
                  </td>
                </tr>

                {/* Row 2: Deluxe King */}
                <tr className="hover:bg-slate-50/60 transition">
                  <td className="py-5 px-6">
                    <p className="font-extrabold text-slate-900 text-sm">Deluxe King</p>
                    <p className="text-[#EF3F09] text-xs font-black">Rp 1.900.000 <span className="text-slate-400 font-normal">/ malam</span></p>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <span className="px-4 py-2 rounded-2xl bg-blue-50 text-blue-800 text-xs font-black">{stockDeluxe} Kamar</span>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <span className="px-4 py-2 rounded-2xl bg-amber-50 text-amber-800 text-xs font-black">{stockDeluxe} Kamar</span>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <span className="px-4 py-2 rounded-2xl bg-indigo-50 text-indigo-800 text-xs font-black">{stockDeluxe} Kamar</span>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <span className="px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-black">{stockDeluxe} Kamar</span>
                  </td>
                  <td className="py-5 px-6 text-center">
                    <span className="text-emerald-600 font-extrabold flex items-center justify-center gap-1">
                      Synced <CheckCircle2 className="w-4 h-4" />
                    </span>
                  </td>
                </tr>

                {/* Row 3: Standard Double */}
                <tr className="hover:bg-slate-50/60 transition">
                  <td className="py-5 px-6">
                    <p className="font-extrabold text-slate-900 text-sm">Standard Double</p>
                    <p className="text-[#EF3F09] text-xs font-black">Rp 1.400.000 <span className="text-slate-400 font-normal">/ malam</span></p>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <span className="px-4 py-2 rounded-2xl bg-blue-50 text-blue-800 text-xs font-black">{stockStandard} Kamar</span>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <span className="px-4 py-2 rounded-2xl bg-amber-50 text-amber-800 text-xs font-black">{stockStandard} Kamar</span>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <span className="px-4 py-2 rounded-2xl bg-indigo-50 text-indigo-800 text-xs font-black">{stockStandard} Kamar</span>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <span className="px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-black">{stockStandard} Kamar</span>
                  </td>
                  <td className="py-5 px-6 text-center">
                    <span className="text-emerald-600 font-extrabold flex items-center justify-center gap-1">
                      Synced <CheckCircle2 className="w-4 h-4" />
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Simulation Dark Console Box matching screenshot */}
        <div className="bg-[#0B132B] text-white rounded-3xl p-7 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-black tracking-wide">Console Simulasi Reservasi Masuk OTA Real-time</h3>
              </div>
              <p className="text-slate-400 text-xs font-semibold">
                Uji coba pemesanan kamar via OTA untuk membuktikan pemotongan alokasi stok otomatis 2-way secara real-time
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSimulateBooking('Traveloka')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow transition cursor-pointer flex items-center gap-1.5"
              >
                <span>Simulasi Traveloka ✈️</span>
              </button>

              <button
                onClick={() => handleSimulateBooking('Agoda')}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-2xl shadow transition cursor-pointer flex items-center gap-1.5"
              >
                <span>Simulasi Agoda ⚡</span>
              </button>

              <button
                onClick={() => handleSimulateBooking('Direct Web')}
                className="px-5 py-2.5 bg-[#EF3F09] hover:bg-[#D63405] text-white font-extrabold text-xs rounded-2xl shadow transition cursor-pointer flex items-center gap-1.5"
              >
                <span>Simulasi Direct Web 🌐</span>
              </button>
            </div>
          </div>

          {/* Terminal Console Box Output */}
          <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 font-mono text-xs text-emerald-400 space-y-2 h-44 overflow-y-auto">
            {logs.map((lg, i) => (
              <p key={i} className="leading-relaxed">{lg}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
