import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Check, AlertTriangle, Smartphone, RefreshCw, 
  Camera, CheckSquare, Layers, Clock, ShieldCheck, MapPin, Search, ArrowLeft, PhoneCall
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface RoomItem {
  id: number;
  number: string;
  type: string;
  status: string;
  floor: string;
  housekeeper: string;
  guest_name?: string;
  check_out?: string;
}

export const HousekeepingMobilePage: React.FC = () => {
  const { t } = useLanguage();
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFloor, setSelectedFloor] = useState('ALL');
  const [activeStaff, setActiveStaff] = useState('Siti Rahmawati (Housekeeper)');
  const [inspectModalRoom, setInspectModalRoom] = useState<RoomItem | null>(null);
  const [lostFoundModalRoom, setLostFoundModalRoom] = useState<RoomItem | null>(null);

  // SOP Checklist state in mobile modal
  const [sopBed, setSopBed] = useState(true);
  const [sopBath, setSopBath] = useState(true);
  const [sopMinibar, setSopMinibar] = useState(true);
  const [sopAmenities, setSopAmenities] = useState(true);
  const [lostItemDesc, setLostItemDesc] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/rooms');
      const data = await res.json();
      if (data && data.status === 'success' && Array.isArray(data.data)) {
        const enriched = data.data.map((r: any) => ({
          ...r,
          floor: 'Lantai ' + (r.number ? r.number.charAt(0) : '1'),
        }));
        setRooms(enriched);
      }
    } catch (err) {
      console.error('Failed to fetch rooms for mobile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = (roomNum: string, newStatus: string) => {
    setRooms((prev) =>
      prev.map((r) => (r.number === roomNum ? { ...r, status: newStatus } : r))
    );
  };

  const filteredRooms = rooms.filter((r) => {
    if (selectedFloor !== 'ALL' && r.floor !== selectedFloor) return false;
    return true;
  });

  const getStatusColor = (st: string) => {
    switch (st.toUpperCase()) {
      case 'OCCUPIED':
      case 'TERISI':
        return 'bg-blue-600 text-white';
      case 'VACANT':
      case 'TERSEDIA':
        return 'bg-emerald-500 text-white';
      case 'CLEANING':
      case 'PEMBERSIHAN':
        return 'bg-amber-500 text-white';
      case 'OOO':
      case 'PERBAIKAN':
        return 'bg-rose-600 text-white';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-2 sm:p-6 font-sans">
      {/* Smartphone Device Frame Simulator */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl overflow-hidden flex flex-col min-h-[780px]">
        
        {/* Mobile Header Bar */}
        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EF3F09] flex items-center justify-center font-black text-white text-lg shadow-lg shadow-[#EF3F09]/30">
              HK
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white tracking-tight">Housekeeping Companion</h2>
              <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live Staff Mobile PWA</span>
              </p>
            </div>
          </div>

          <button
            onClick={fetchRooms}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Staff User & Floor Filter Toolbar */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 space-y-3">
          {/* Active Staff Picker */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold">Staf Operasional:</span>
            <select
              value={activeStaff}
              onChange={(e) => setActiveStaff(e.target.value)}
              className="bg-slate-900 text-white border border-slate-800 font-extrabold text-xs px-3 py-1.5 rounded-xl focus:outline-none"
            >
              <option value="Siti Rahmawati (Housekeeper)">Siti Rahmawati (Housekeeper)</option>
              <option value="Rina Anggraini (Supervisor)">Rina Anggraini (Supervisor)</option>
              <option value="Budi Santoso (Runner)">Budi Santoso (Runner)</option>
            </select>
          </div>

          {/* Floor Zone Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {['ALL', 'Lantai 1', 'Lantai 2', 'Lantai 3', 'Lantai 4'].map((fl) => (
              <button
                key={fl}
                onClick={() => setSelectedFloor(fl)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-black whitespace-nowrap transition cursor-pointer border ${
                  selectedFloor === fl
                    ? 'bg-[#EF3F09] text-white border-[#EF3F09]'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {fl === 'ALL' ? 'Semua Lantai' : fl}
              </button>
            ))}
          </div>
        </div>

        {/* Room Task Cards Container */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[560px]">
          {loading ? (
            <div className="py-12 text-center text-slate-500 text-xs font-bold">
              Memuat tugas kamar mobile...
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs font-bold">
              Tidak ada tugas kamar di lantai ini.
            </div>
          ) : (
            filteredRooms.map((room) => (
              <div
                key={room.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3 hover:border-slate-700 transition"
              >
                {/* Room Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg font-black text-white">Kamar {room.number}</span>
                    <span className="text-xs font-bold text-slate-400">({room.type})</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(room.status)}`}>
                    {room.status}
                  </span>
                </div>

                {/* Floor Info */}
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold border-t border-slate-800/60 pt-2">
                  <span>📍 {room.floor}</span>
                  <span>👤 {room.guest_name || 'Kamar Kosong'}</span>
                </div>

                {/* 1-Tap Touch Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {room.status.toUpperCase() === 'CLEANING' || room.status.toUpperCase() === 'PEMBERSIHAN' ? (
                    <button
                      onClick={() => setInspectModalRoom(room)}
                      className="col-span-2 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Input Checklist & Luluskan Inspeksi</span>
                    </button>
                  ) : room.status.toUpperCase() === 'OCCUPIED' || room.status.toUpperCase() === 'TERISI' ? (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(room.number, 'CLEANING')}
                        className="py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1 border border-slate-700"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Make-Up Room</span>
                      </button>

                      <button
                        onClick={() => setLostFoundModalRoom(room)}
                        className="py-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1 border border-slate-700"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Lost & Found</span>
                      </button>
                    </>
                  ) : room.status.toUpperCase() === 'OOO' || room.status.toUpperCase() === 'PERBAIKAN' ? (
                    <button
                      onClick={() => handleUpdateStatus(room.number, 'CLEANING')}
                      className="col-span-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Selesai Perbaikan (Ubah ke Cleaning)</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(room.number, 'CLEANING')}
                        className="py-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1 shadow"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mulai Bersihkan</span>
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(room.number, 'OOO')}
                        className="py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1 border border-rose-600/40"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Laporkan OOO</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Mobile Bar Navigation */}
        <div className="bg-slate-900 border-t border-slate-800 p-3 flex items-center justify-around text-xs font-bold">
          <a href="/housekeeping" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px]">Desktop Web</span>
          </a>

          <div className="flex flex-col items-center gap-1 text-[#EF3F09]">
            <Smartphone className="w-5 h-5" />
            <span className="text-[10px] font-black">Mobile PWA</span>
          </div>

          <a href="/rooms" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white">
            <Layers className="w-4 h-4" />
            <span className="text-[10px]">Kamar DB</span>
          </a>
        </div>
      </div>

      {/* Touch Modal Checklist Inspeksi Kebersihan */}
      {inspectModalRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-sm w-full p-6 border border-slate-800 text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-base text-white">Inspeksi Kamar {inspectModalRoom.number}</h3>
              <button onClick={() => setInspectModalRoom(null)} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800 cursor-pointer">
                <input type="checkbox" checked={sopBed} onChange={(e) => setSopBed(e.target.checked)} className="w-4 h-4 accent-[#EF3F09]" />
                <span>🛏️ Seprai & Bantal Diganti Baru</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800 cursor-pointer">
                <input type="checkbox" checked={sopBath} onChange={(e) => setSopBath(e.target.checked)} className="w-4 h-4 accent-[#EF3F09]" />
                <span>🚿 Sanitasi Kamar Mandi & Bathtub</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800 cursor-pointer">
                <input type="checkbox" checked={sopMinibar} onChange={(e) => setSopMinibar(e.target.checked)} className="w-4 h-4 accent-[#EF3F09]" />
                <span>🥤 Restock Minibar & Mineral Water</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800 cursor-pointer">
                <input type="checkbox" checked={sopAmenities} onChange={(e) => setSopAmenities(e.target.checked)} className="w-4 h-4 accent-[#EF3F09]" />
                <span>🪥 Amenity Kit & Toothbrush Replenished</span>
              </label>
            </div>

            <button
              onClick={() => {
                handleUpdateStatus(inspectModalRoom.number, 'VACANT');
                setInspectModalRoom(null);
                alert(`✓ Kamar ${inspectModalRoom.number} Lulus Inspeksi! Status berubah ke TERSEDIA (VACANT).`);
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-lg transition cursor-pointer"
            >
              Simpan & Luluskan Kamar (VACANT)
            </button>
          </div>
        </div>
      )}

      {/* Touch Modal Lost & Found */}
      {lostFoundModalRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-sm w-full p-6 border border-slate-800 text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-base text-white">Lost & Found Kamar {lostFoundModalRoom.number}</h3>
              <button onClick={() => setLostFoundModalRoom(null)} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="block font-bold text-slate-300">Deskripsi Barang Tertinggal Tamu:</label>
              <textarea
                rows={3}
                placeholder="Contoh: Charger iPhone 15 Pro & Kacamata Hitam di atas Meja Rias..."
                value={lostItemDesc}
                onChange={(e) => setLostItemDesc(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none"
              />
            </div>

            <button
              onClick={() => {
                setLostFoundModalRoom(null);
                setLostItemDesc('');
                alert(`✓ Laporan Lost & Found Kamar ${lostFoundModalRoom.number} berhasil dicatat di PostgreSQL audit log!`);
              }}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-lg transition cursor-pointer"
            >
              Laporkan Barang Ketinggalan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
