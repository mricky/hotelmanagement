import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { NavLink } from 'react-router-dom';
import { AddBookingModal } from '../components/AddBookingModal';
import { Calendar as CalendarIcon, Table, Plus, UserCheck } from 'lucide-react';

interface Booking {
  id: number;
  code: string;
  guest: string;
  flag: string;
  contact: string;
  room: string;
  check_in: string;
  check_out: string;
  dates: string;
  status: string;
  channel: string;
}

const generateDatesHeader = (monthStr: string) => {
  const parts = monthStr.split('-');
  const year = parseInt(parts[0], 10) || 2026;
  const month = parseInt(parts[1], 10) || 8;
  
  const startDate = new Date(year, month - 1, 28);
  const days: { label: string; dateStr: string }[] = [];
  
  const dayNames = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DES'];

  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dayName = dayNames[d.getDay()];
    const dateNum = String(d.getDate()).padStart(2, '0');
    const mName = monthNames[d.getMonth()];
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    
    days.push({
      label: `${dayName} ${dateNum} ${mName}`,
      dateStr: `${yyyy}-${mm}-${dateNum}`,
    });
  }
  return days;
};

export const CalendarPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [roomsList, setRoomsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('2026-08');
  const [selectedChannel, setSelectedChannel] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedRoomType, setSelectedRoomType] = useState('Semua');
  const [selectedFloor, setSelectedFloor] = useState('Semua');
  const [searchKeyword, setSearchKeyword] = useState('');

  const datesHeader = generateDatesHeader(selectedMonth);

  const filteredRoomsList = roomsList.filter((rm) => {
    if (selectedRoomType !== 'Semua' && rm.type !== selectedRoomType) return false;
    if (selectedFloor !== 'Semua' && rm.floor !== selectedFloor) return false;
    if (searchKeyword) {
      const q = searchKeyword.toLowerCase();
      const matchName = rm.name.toLowerCase().includes(q);
      const matchNum = rm.number.toLowerCase().includes(q);
      const matchType = rm.type.toLowerCase().includes(q);
      if (!matchName && !matchNum && !matchType) return false;
    }
    return true;
  });

  useEffect(() => {
    fetchCalendarData();
  }, [selectedMonth]);

  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      const [roomsRes, bookingsRes] = await Promise.all([
        fetch('/api/v1/rooms'),
        fetch(`/api/v1/bookings?month=${selectedMonth}`),
      ]);

      const roomsData = await roomsRes.json();
      const bookingsData = await bookingsRes.json();

      if (roomsData?.status === 'success' && Array.isArray(roomsData.data)) {
        const enrichedRooms = roomsData.data.map((r: any) => ({
          number: r.number,
          name: `Kamar ${r.number}`,
          type: r.type,
          floor: `Lantai ${r.number ? r.number.charAt(0) : '1'}`,
          dotColor: r.status === 'OCCUPIED' ? 'bg-amber-500' : r.status === 'CLEANING' ? 'bg-purple-500' : 'bg-emerald-500',
        }));
        setRoomsList(enrichedRooms);
      }

      if (bookingsData?.status === 'success' && Array.isArray(bookingsData.data)) {
        setBookings(bookingsData.data);
      }
    } catch (err) {
      console.error('Failed to load dynamic calendar data', err);
    } finally {
      setLoading(false);
    }
  };

  const getChannelStyle = (channel: string) => {
    switch (channel.toLowerCase()) {
      case 'direct web':
      case 'direct':
        return 'bg-emerald-600 border-emerald-700 text-white';
      case 'agoda':
        return 'bg-amber-600 border-amber-700 text-white';
      case 'traveloka':
        return 'bg-blue-600 border-blue-700 text-white';
      case 'walk-in':
      case 'walk-in resepsionis':
        return 'bg-indigo-600 border-indigo-700 text-white';
      default:
        return 'bg-slate-700 border-slate-800 text-white';
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (selectedChannel !== 'Semua' && !b.channel.toLowerCase().includes(selectedChannel.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex-1 min-w-0 pb-12">
      {/* Top Header matching screenshot 1 */}
      <div className="bg-white border-b border-slate-200/80 px-8 py-6 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <NavLink
              to="/bookings"
              className="px-3 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider hover:bg-slate-200 transition"
            >
              Kembali ke Tabel
            </NavLink>
            <span className="text-slate-400 text-xs font-semibold">• Backdate History & Dynamic Month Data</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Kalender Reservasi Interaktif</h1>
          <p className="text-slate-500 text-xs font-semibold mt-0.5">Navigasi bulan, riwayat *backdate*, dan filter channel pemesanan real-time</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-[#EF3F09] hover:bg-[#D63405] text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-[#EF3F09]/30 transition transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
        >
          <UserCheck className="w-4 h-4" />
          <span>Input Reservasi Tamu (WNI / WNA)</span>
        </button>
      </div>

      <AddBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchCalendarData()}
      />

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Control Bar matching screenshot 1 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-extrabold text-slate-900 focus:outline-none focus:border-[#EF3F09]"
            >
              <option value="2026-08">Agustus 2026 (Aktif)</option>
              <option value="2026-07">Juli 2026</option>
              <option value="2026-09">September 2026</option>
            </select>

            <button
              onClick={() => setSelectedMonth('2026-07')}
              className="px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition"
            >
              Bulan Lalu (Backdate)
            </button>

            <button
              onClick={() => setSelectedMonth('2026-08')}
              className="px-4 py-2.5 rounded-2xl bg-[#EF3F09] text-white text-xs font-bold shadow-md shadow-[#EF3F09]/30 transition"
            >
              Hari Ini / Agustus 2026
            </button>

            <button
              onClick={() => setSelectedMonth('2026-09')}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            >
              Bulan Depan
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider mr-1">CHANNEL:</span>
            {['Semua', 'Direct', 'Agoda', 'Traveloka', 'Walk-In'].map((ch) => (
              <button
                key={ch}
                onClick={() => setSelectedChannel(ch)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  selectedChannel === ch
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>

        {/* Room Type & Floor Filter Sub-Bar */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Tipe Kamar:</span>
              <select
                value={selectedRoomType}
                onChange={(e) => setSelectedRoomType(e.target.value)}
                className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:border-[#EF3F09] cursor-pointer"
              >
                <option value="Semua">✨ Semua Tipe Kamar</option>
                <option value="Executive Suite">Executive Suite</option>
                <option value="Deluxe King">Deluxe King</option>
                <option value="Standard Double">Standard Double</option>
                <option value="Standard Single">Standard Single</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Lokasi Lantai:</span>
              <select
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:border-[#EF3F09] cursor-pointer"
              >
                <option value="Semua">🏢 Semua Lantai</option>
                <option value="Lantai 4">Lantai 4 (Top Floor)</option>
                <option value="Lantai 3">Lantai 3 (Upper Floor)</option>
                <option value="Lantai 2">Lantai 2 (Mid Floor)</option>
                <option value="Lantai 1">Lantai 1 (Ground Floor)</option>
              </select>
            </div>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Cari Kamar 402, Deluxe, dll..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-3.5 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#EF3F09]"
            />
          </div>
        </div>

        {/* Interactive Matrix Calendar Table matching screenshot 1 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
          {loading ? (
            <p className="py-12 text-center text-slate-400 font-bold">Memuat kalender reservasi dari Golang Server...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase border-b border-slate-200">
                    <th className="py-4 px-6 w-56 sticky left-0 bg-slate-50 z-10 border-r border-slate-200">KAMAR & TIPE</th>
                    {datesHeader.map((d) => (
                      <th key={d.dateStr} className="py-4 px-3 text-center min-w-[120px] border-r border-slate-100">
                        {d.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredRoomsList.length === 0 ? (
                    <tr>
                      <td colSpan={datesHeader.length + 1} className="py-12 text-center text-slate-400 font-bold">
                        Tidak ada kamar yang cocok dengan kriteria filter tipe/lantai/pencarian ini.
                      </td>
                    </tr>
                  ) : (
                    filteredRoomsList.map((rm) => {
                    const roomBookings = filteredBookings.filter((b) => b.room.includes(rm.number));

                    return (
                      <tr key={rm.number} className="hover:bg-slate-50/50 transition">
                        <td className="py-5 px-6 sticky left-0 bg-white border-r border-slate-200 shadow-sm z-10">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-black text-slate-900 text-sm">{rm.name}</p>
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-extrabold text-slate-700">
                                  Lantai {rm.number[0] || '1'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 font-semibold">{rm.type}</p>
                            </div>
                            <span className={`w-2.5 h-2.5 rounded-full ${rm.dotColor}`}></span>
                          </div>
                        </td>

                        {datesHeader.map((d) => {
                          // Check if any reservation active on this date
                          const activeRes = roomBookings.find(
                            (b) => b.check_in <= d.dateStr && b.check_out >= d.dateStr
                          );

                          // Check if this date is check_in date to render full bar
                          const isStart = activeRes && activeRes.check_in === d.dateStr;

                          return (
                            <td key={d.dateStr} className="py-2 px-1 border-r border-slate-100 relative h-20 align-middle">
                              {activeRes && isStart ? (
                                <div
                                  className={`absolute left-2 top-2 bottom-2 right-[-200px] z-20 rounded-2xl p-3 shadow-lg border flex items-center justify-between ${getChannelStyle(
                                    activeRes.channel
                                  )}`}
                                >
                                  <div className="truncate pr-2">
                                    <p className="font-extrabold text-xs tracking-tight truncate">{activeRes.guest}</p>
                                    <p className="text-[10px] opacity-90 font-medium truncate">
                                      {activeRes.code} • {activeRes.channel} • {activeRes.contact}
                                    </p>
                                  </div>
                                  <span className="px-2.5 py-1 rounded-xl bg-white/20 backdrop-blur-md text-white text-[10px] font-black shrink-0">
                                    {activeRes.status === 'TERISI' ? 'Terisi' : 'Terkonfirmasi'}
                                  </span>
                                </div>
                              ) : null}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
