import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Pagination } from '../components/Pagination';
import { AddRoomModal } from '../components/AddRoomModal';
import { EditRoomModal } from '../components/EditRoomModal';
import { AddBookingModal } from '../components/AddBookingModal';
import { Plus, Search, Key, ShieldCheck, Clock, Wrench, BedDouble, ChevronRight, X, Check, AlertCircle, User, CheckCircle2, Edit, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Room {
  id: number;
  number: string;
  type: string;
  status: string;
  rate: number;
  floor: string;
  rfid_code?: string;
  guest_name?: string;
  check_out?: string;
  housekeeper?: string;
  ooo_note?: string;
  image_url?: string;
  created_by: string;
  updated_by: string;
}

export const RoomsPage: React.FC = () => {
  const { t } = useLanguage();
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [isAddBookingModalOpen, setIsAddBookingModalOpen] = useState(false);
  const [activeDetailRoom, setActiveDetailRoom] = useState<any | null>(null);
  const [activeOooRoom, setActiveOooRoom] = useState<any | null>(null);
  const [editingRoom, setEditingRoom] = useState<any | null>(null);
  const [activeGalleryRoom, setActiveGalleryRoom] = useState<any | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  // Active Filter states
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/rooms');
      const data = await res.json();
      if (data && data.status === 'success' && Array.isArray(data.data)) {
        // Enrich room data for full display
        const enriched = data.data.map((r: any) => {
          const mainImg = r.image_url || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80';
          const gallery = [
            { label: '🛏️ Sudut Tempat Tidur Utama', url: mainImg },
            { label: '🚿 Sudut Kamar Mandi & Bathub', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80' },
            { label: '🌅 Sudut Balkon & Pemandangan', url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80' },
          ];

          if (r.number === '401') {
            return {
              ...r,
              floor: 'Lantai 4',
              rfid_code: 'RF-401-A900',
              guest_name: r.guest_name || 'Tamu In-House',
              check_out: 'Besok, 12:00',
              image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
              gallery_angles: gallery,
            };
          }
          if (r.number === '402') {
            return {
              ...r,
              floor: 'Lantai 4',
              rfid_code: 'RF-402-A901',
              guest_name: r.guest_name || 'Tamu In-House',
              check_out: 'Sep 02',
              image_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80',
              gallery_angles: gallery,
            };
          }
          if (r.number === '305' || r.number === '304') {
            return {
              ...r,
              floor: 'Lantai 3',
              rfid_code: 'RF-304-B102',
              housekeeper: 'Bersih & Siap',
              image_url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80',
              gallery_angles: gallery,
            };
          }
          return {
            ...r,
            floor: 'Lantai ' + (r.number ? r.number.charAt(0) : '1'),
            rfid_code: 'RF-' + r.number + '-C' + (100 + r.id),
            housekeeper: 'Tim Housekeeping',
            ooo_note: 'Perbaikan AC Central',
            image_url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80',
            gallery_angles: gallery,
          };
        });
        setRooms(enriched);
      }
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInspectCleaned = (roomNum: string) => {
    setRooms((prev) =>
      prev.map((r) => (r.number === roomNum ? { ...r, status: 'VACANT', housekeeper: 'Lulus Inspeksi ✓' } : r))
    );
    alert(`✓ Inspeksi kebersihan Kamar ${roomNum} selesai! Status kamar diubah menjadi TERSEDIA (VACANT).`);
  };

  const handleFinishOoo = (roomNum: string) => {
    setRooms((prev) =>
      prev.map((r) => (r.number === roomNum ? { ...r, status: 'CLEANING', housekeeper: 'Menunggu Inspeksi' } : r))
    );
    alert(`✓ Perbaikan OOO Kamar ${roomNum} selesai! Status diubah ke PEMBERSIHAN.`);
  };

  const renderStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'OCCUPIED':
      case 'TERISI':
        return <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-black text-[10px] tracking-wider uppercase shadow">TERISI</span>;
      case 'VACANT':
      case 'TERSEDIA':
        return <span className="px-3 py-1 rounded-full bg-emerald-500 text-white font-black text-[10px] tracking-wider uppercase shadow">TERSEDIA</span>;
      case 'CLEANING':
      case 'PEMBERSIHAN':
        return <span className="px-3 py-1 rounded-full bg-amber-500 text-white font-black text-[10px] tracking-wider uppercase shadow">PEMBERSIHAN</span>;
      case 'OOO':
      case 'PERBAIKAN':
        return <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-black text-[10px] tracking-wider uppercase shadow">PERBAIKAN</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-slate-700 text-white font-black text-[10px] tracking-wider">{status}</span>;
    }
  };

  const renderActionButton = (r: any) => {
    switch (r.status.toUpperCase()) {
      case 'OCCUPIED':
      case 'TERISI':
        return (
          <button
            onClick={() => alert(`🔑 RFID Keycard Encoder:\nMenerbitkan Duplikat Kunci Smart Lock untuk Kamar ${r.number} (${r.rfid_code})`)}
            className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Encode Keycard RFID</span>
          </button>
        );
      case 'CLEANING':
      case 'PEMBERSIHAN':
        return (
          <button
            onClick={() => handleInspectCleaned(r.number)}
            className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Lulus Inspeksi Kebersihan</span>
          </button>
        );
      case 'OOO':
      case 'PERBAIKAN':
        return (
          <button
            onClick={() => handleFinishOoo(r.number)}
            className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Selesaikan Perbaikan OOO</span>
          </button>
        );
      default:
        return (
          <button
            onClick={() => alert(`Reservasi Langsung & Keycard:\nMembuat Pemesanan Baru untuk Kamar ${r.number}`)}
            className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Pesan & Encode Keycard</span>
          </button>
        );
    }
  };

  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  const [selectedFloorFilter, setSelectedFloorFilter] = useState('ALL');

  const filteredRooms = rooms.filter((r) => {
    if (selectedFilter !== 'ALL' && r.status.toUpperCase() !== selectedFilter) return false;
    if (selectedTypeFilter !== 'ALL' && !r.type.toLowerCase().includes(selectedTypeFilter.toLowerCase())) return false;
    if (selectedFloorFilter !== 'ALL' && !r.floor.toLowerCase().includes(selectedFloorFilter.toLowerCase())) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return r.number.toLowerCase().includes(q) || r.type.toLowerCase().includes(q) || (r.floor && r.floor.toLowerCase().includes(q));
    }
    return true;
  });

  const totalItems = filteredRooms.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const pageRooms = filteredRooms.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="flex-1 min-w-0 pb-12">
      {/* Top Bar Header */}
      <div className="bg-white border-b border-slate-200/80 px-8 py-6 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-wider">
              LIVE INVENTORY
            </span>
            <span className="text-slate-400 text-xs font-semibold">• 150 Total Keys</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{t('rooms.title')}</h1>
          <p className="text-slate-500 text-xs font-semibold mt-0.5">{t('rooms.subtitle')}</p>
        </div>

        <button
          onClick={() => setIsAddRoomModalOpen(true)}
          className="px-6 py-3 bg-[#EF3F09] hover:bg-[#D63405] text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-[#EF3F09]/30 transition transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('btn.add_room')}</span>
        </button>
      </div>

      {/* Modals */}
      <AddRoomModal
        isOpen={isAddRoomModalOpen}
        onClose={() => setIsAddRoomModalOpen(false)}
        onSuccess={() => fetchRooms()}
      />

      <EditRoomModal
        isOpen={!!editingRoom}
        room={editingRoom}
        onClose={() => setEditingRoom(null)}
        onSuccess={() => fetchRooms()}
      />

      {/* Multi-Angle Gallery Lightbox Modal */}
      {activeGalleryRoom && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-800 flex flex-col space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-[#EF3F09] flex items-center justify-center font-bold">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Galeri Foto Multi-Sudut (3 Angle) - Kamar {activeGalleryRoom.number}</h3>
                  <p className="text-slate-400 text-xs font-semibold">{activeGalleryRoom.type} • {activeGalleryRoom.floor}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveGalleryRoom(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Active Angle Large Image */}
            <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group">
              <img
                src={activeGalleryRoom.gallery_angles[activeGalleryIndex]?.url || activeGalleryRoom.image_url}
                alt="Angle Foto Kamar"
                className="w-full h-full object-cover transition duration-300"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-black text-white">
                  {activeGalleryRoom.gallery_angles[activeGalleryIndex]?.label || 'Sudut Utama Foto Kamar'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#EF3F09] text-white font-extrabold text-[10px]">
                  Angle {activeGalleryIndex + 1} dari {activeGalleryRoom.gallery_angles.length}
                </span>
              </div>
            </div>

            {/* Angle Selection Thumbnails */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {activeGalleryRoom.gallery_angles.map((item: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveGalleryIndex(idx)}
                  className={`relative rounded-2xl overflow-hidden border-2 transition text-left p-1 cursor-pointer ${
                    activeGalleryIndex === idx ? 'border-[#EF3F09] bg-slate-800 shadow-lg scale-105' : 'border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={item.url} alt={item.label} className="w-full h-16 object-cover rounded-xl" />
                  <p className="text-[10px] font-bold text-slate-300 truncate mt-1 px-1">{item.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <AddBookingModal
        isOpen={isAddBookingModalOpen}
        onClose={() => setIsAddBookingModalOpen(false)}
        onSuccess={() => fetchRooms()}
      />

      {/* Detail Room Modal (Rincian Kamar) */}
      {activeDetailRoom && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Rincian Kamar {activeDetailRoom.number}</h3>
                  <p className="text-slate-500 text-xs font-semibold">{activeDetailRoom.type} • {activeDetailRoom.floor}</p>
                </div>
              </div>
              <button type="button" onClick={() => setActiveDetailRoom(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold text-slate-700">
              <div className="p-4 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
                <p>Status Menginap: <strong className="text-blue-600 font-extrabold uppercase">{activeDetailRoom.status}</strong></p>
                <p>Nama Tamu: <strong className="text-slate-900">{activeDetailRoom.guest_name || 'Mr. Alexander Wright'}</strong></p>
                <p>Kode RFID Door Lock: <strong className="text-slate-900">{activeDetailRoom.rfid_code || 'RF-402-A901'}</strong></p>
                <p>Jadwal Check-Out: <strong className="text-slate-900">{activeDetailRoom.check_out || 'Sep 02, 2026'}</strong></p>
                <p>Tarif Dasar: <strong className="text-[#EF3F09] font-black">Rp {activeDetailRoom.rate.toLocaleString('id-ID')} / malam</strong></p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setActiveDetailRoom(null)}
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-2xl font-bold text-xs cursor-pointer"
                >
                  Tutup Rincian
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OOO Repair Log Modal */}
      {activeOooRoom && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <Wrench className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Log Perbaikan (OOO) Kamar {activeOooRoom.number}</h3>
                  <p className="text-slate-500 text-xs font-semibold">Status Maintenance & Teknisi Terkait</p>
                </div>
              </div>
              <button type="button" onClick={() => setActiveOooRoom(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold text-slate-700">
              <div className="p-4 bg-rose-50/80 rounded-2xl space-y-2 border border-rose-100">
                <p>Catatan Perbaikan: <strong className="text-rose-900 font-extrabold">{activeOooRoom.ooo_note || 'Perbaikan AC Central'}</strong></p>
                <p>Teknisi Penanggung Jawab: <strong className="text-slate-900">Agus Setiawan (HK Tech)</strong></p>
                <p>Estimasi Selesai: <strong className="text-slate-900">Hari ini, 18:00 WIB</strong></p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveOooRoom(null)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Tutup Log
                </button>
                <button
                  type="button"
                  onClick={() => handleFinishOoo(activeOooRoom.number)}
                  className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Tandai Perbaikan Selesai</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* KPI Pastel Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-3xl p-6 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-emerald-800 text-[11px] font-black uppercase tracking-wider mb-1">TERSEDIA</p>
              <p className="text-4xl font-black text-emerald-600">24</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center">
              <Key className="w-7 h-7" />
            </div>
          </div>

          <div className="bg-blue-50/60 border border-blue-200/80 rounded-3xl p-6 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-blue-800 text-[11px] font-black uppercase tracking-wider mb-1">TERISI (OCCUPIED)</p>
              <p className="text-4xl font-black text-blue-600">112</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-blue-100/80 text-blue-600 flex items-center justify-center">
              <BedDouble className="w-7 h-7" />
            </div>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/80 rounded-3xl p-6 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-amber-800 text-[11px] font-black uppercase tracking-wider mb-1">PEMBERSIHAN</p>
              <p className="text-4xl font-black text-amber-600">10</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-amber-100/80 text-amber-600 flex items-center justify-center">
              <Clock className="w-7 h-7" />
            </div>
          </div>

          <div className="bg-rose-50/60 border border-rose-200/80 rounded-3xl p-6 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-rose-800 text-[11px] font-black uppercase tracking-wider mb-1">PERBAIKAN (OOO)</p>
              <p className="text-4xl font-black text-rose-600">4</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-rose-100/80 text-rose-600 flex items-center justify-center">
              <Wrench className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* Filter Pills & Search Bar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'Semua Kunci' },
              { id: 'vacant', label: 'Tersedia' },
              { id: 'occupied', label: 'Terisi' },
              { id: 'cleaning', label: 'Pembersihan' },
              { id: 'ooo', label: 'Perbaikan' },
            ].map((pill) => (
              <button
                key={pill.id}
                onClick={() => {
                  setSelectedFilter(pill.id);
                  setCurrentPage(1);
                }}
                className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer ${
                  selectedFilter === pill.id
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedTypeFilter}
              onChange={(e) => {
                setSelectedTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black text-slate-900 focus:outline-none focus:border-[#EF3F09] cursor-pointer"
            >
              <option value="ALL">✨ Semua Tipe Kamar</option>
              <option value="Executive Suite">Executive Suite</option>
              <option value="Deluxe King">Deluxe King</option>
              <option value="Standard Double">Standard Double</option>
              <option value="Standard Single">Standard Single</option>
            </select>

            <select
              value={selectedFloorFilter}
              onChange={(e) => {
                setSelectedFloorFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black text-slate-900 focus:outline-none focus:border-[#EF3F09] cursor-pointer"
            >
              <option value="ALL">🏢 Semua Lantai</option>
              <option value="Lantai 4">Lantai 4</option>
              <option value="Lantai 3">Lantai 3</option>
              <option value="Lantai 2">Lantai 2</option>
              <option value="Lantai 1">Lantai 1</option>
            </select>

            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Cari No Kamar / Tipe / Lantai..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#EF3F09]"
              />
            </div>
          </div>
        </div>

        {/* Room Inventory Cards Grid */}
        {loading ? (
          <p className="py-12 text-center text-slate-400 font-bold">Memuat kamar dari PostgreSQL Server...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pageRooms.map((r) => (
              <div
                key={r.id || r.number}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-2xl transition duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={r.image_url}
                      alt={r.type}
                      className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3">{renderStatusBadge(r.status)}</div>
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingRoom(r)}
                        className="px-2.5 py-1 rounded-xl bg-white/90 hover:bg-white text-slate-800 font-extrabold text-[10px] shadow-md backdrop-blur-sm transition cursor-pointer flex items-center gap-1"
                        title="Edit Data & Foto Kamar"
                      >
                        <Edit className="w-3 h-3 text-[#EF3F09]" />
                        <span>Edit Foto</span>
                      </button>
                      <div className="px-3 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-white font-extrabold text-[10px]">
                        {r.floor || 'Lantai 3'}
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveGalleryRoom(r);
                          setActiveGalleryIndex(0);
                        }}
                        className="px-2.5 py-1 rounded-xl bg-slate-900/85 hover:bg-slate-900 text-white font-extrabold text-[10px] backdrop-blur-md transition cursor-pointer flex items-center gap-1 shadow-md border border-slate-700/60"
                        title="Lihat Galeri Foto Multi-Sudut"
                      >
                        <ImageIcon className="w-3 h-3 text-amber-400" />
                        <span>3 Angle Foto</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-slate-900">Kamar {r.number}</h3>
                      <p className="text-xs font-extrabold text-[#EF3F09]">
                        Rp {r.rate.toLocaleString('id-ID')}
                        <span className="text-[10px] text-slate-400 font-normal">/malam</span>
                      </p>
                    </div>

                    <p className="text-xs text-slate-500 font-semibold">{r.type} • 1 King Bed</p>

                    {r.rfid_code && (
                      <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <span className="text-slate-500 font-medium">RFID Door Lock:</span>
                        <span className="font-extrabold text-slate-900">{r.rfid_code}</span>
                      </div>
                    )}

                    {r.guest_name && (
                      <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                        <span>Tamu: <strong className="text-slate-900">{r.guest_name}</strong></span>
                        <span>Check-Out: <strong className="text-slate-900">{r.check_out}</strong></span>
                      </div>
                    )}

                    {r.housekeeper && (
                      <div className="flex items-center justify-between text-xs bg-emerald-50/80 p-3 rounded-2xl border border-emerald-100">
                        <span className="text-emerald-700 font-medium">Kebersihan:</span>
                        <span className="font-extrabold text-emerald-900">{r.housekeeper}</span>
                      </div>
                    )}

                    {r.ooo_note && (
                      <div className="flex items-center justify-between text-xs bg-rose-50 p-3 rounded-2xl border border-rose-100">
                        <span className="text-rose-700 font-medium">Catatan OOO:</span>
                        <span className="font-extrabold text-rose-900">{r.ooo_note}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0">{renderActionButton(r)}</div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            rowsPerPage={rowsPerPage}
            onPageChange={setCurrentPage}
            onRowsPerPageChange={(rows) => {
              setRowsPerPage(rows);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>
    </div>
  );
};
