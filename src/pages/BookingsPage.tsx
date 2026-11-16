import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Header } from '../components/Header';
import { Pagination } from '../components/Pagination';
import { Search, Calendar, Plus, Table, Clock, AlertTriangle, CheckCircle2, X, FileText, Printer, UserPlus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { DepositReceiptModal } from '../components/DepositReceiptModal';
import { TaxInvoiceModal } from '../components/TaxInvoiceModal';
import { WalkInCheckInModal } from '../components/WalkInCheckInModal';

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
  created: string;
  created_time: string;
  updated: string;
  updated_time: string;
  status: string;
  statusBg: string;
  total: string;
  actionText: string;
  channel: string;
}

export const BookingsPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('2026-08');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // Walk-In Check-In Modal State
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);

  // Deposit Receipt Modal State
  const [depositBookingForReceipt, setDepositBookingForReceipt] = useState<Booking | null>(null);

  // Tax Invoice Modal State
  const [taxBookingForInvoice, setTaxBookingForInvoice] = useState<Booking | null>(null);

  // Late Check-Out Modal States
  const [checkoutBooking, setCheckoutBooking] = useState<Booking | null>(null);
  const [lateFeeCategory, setLateFeeCategory] = useState<'normal' | 'halfday' | 'fullday'>('halfday');
  const [lateFeeAmount, setLateFeeAmount] = useState(0);
  const [waiveFee, setWaiveFee] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchBookings();
  }, [selectedMonth]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/bookings?month=${selectedMonth}`);
      const data = await res.json();
      if (data && data.status === 'success' && Array.isArray(data.data)) {
        setBookings(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch bookings from Golang API:', err);
    } finally {
      setLoading(false);
    }
  };

  const getChannelStyle = (ch: string) => {
    switch (ch.toLowerCase()) {
      case 'direct':
      case 'direct web':
      case 'direct web engine':
        return {
          inactiveBg: 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100',
          activeBg: 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/40 border-emerald-600 scale-105',
          badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: '🌐',
          label: 'Direct Web',
        };
      case 'agoda':
        return {
          inactiveBg: 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100',
          activeBg: 'bg-amber-500 text-white shadow-lg shadow-amber-500/40 border-amber-500 scale-105',
          badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
          icon: '⚡',
          label: 'Agoda',
        };
      case 'traveloka':
        return {
          inactiveBg: 'bg-sky-50 text-sky-700 border-sky-300 hover:bg-sky-100',
          activeBg: 'bg-sky-500 text-white shadow-lg shadow-sky-500/40 border-sky-500 scale-105',
          badgeBg: 'bg-sky-50 text-sky-900 border-sky-200',
          icon: '✈️',
          label: 'Traveloka',
        };
      case 'walk-in':
      case 'walkin':
        return {
          inactiveBg: 'bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100',
          activeBg: 'bg-purple-600 text-white shadow-lg shadow-purple-600/40 border-purple-600 scale-105',
          badgeBg: 'bg-purple-50 text-purple-900 border-purple-200',
          icon: '🚶',
          label: 'Walk-In',
        };
      case 'booking.com':
      case 'booking':
        return {
          inactiveBg: 'bg-indigo-50 text-indigo-700 border-indigo-300 hover:bg-indigo-100',
          activeBg: 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 border-indigo-600 scale-105',
          badgeBg: 'bg-indigo-50 text-indigo-900 border-indigo-200',
          icon: '🏨',
          label: 'Booking.com',
        };
      default:
        return {
          inactiveBg: 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200',
          activeBg: 'bg-slate-900 text-white shadow-lg shadow-slate-900/40 border-slate-900 scale-105',
          badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: '🌟',
          label: ch === 'all' ? t('label.all_channels') : ch,
        };
    }
  };

  // Advanced Filtering Logic
  const filteredBookings = bookings.filter((b) => {
    // 1. Channel Filter
    if (selectedChannel !== 'all' && b.channel.toLowerCase() !== selectedChannel.toLowerCase()) {
      return false;
    }
    // 2. Keyword Search
    if (searchKeyword) {
      const q = searchKeyword.toLowerCase();
      const matchGuest = b.guest.toLowerCase().includes(q);
      const matchCode = b.code.toLowerCase().includes(q);
      const matchRoom = b.room.toLowerCase().includes(q);
      if (!matchGuest && !matchCode && !matchRoom) return false;
    }
    // 3. Custom Date Period Filter
    if (filterStartDate && b.check_in < filterStartDate) return false;
    if (filterEndDate && b.check_in > filterEndDate) return false;

    return true;
  });

  // Pagination Math
  const totalItems = filteredBookings.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const pageBookings = filteredBookings.slice(startIndex, startIndex + rowsPerPage);

  const handleOtaCheckIn = (booking: Booking) => {
    const updatedBooking = {
      ...booking,
      status: 'Checked In',
      statusBg: 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold',
      actionText: 'Check Out',
      updated: 'Front Desk Staf',
      updated_time: `Hari ini (Prepaid via ${booking.channel})`,
    };

    setBookings((prev) =>
      prev.map((b) => (b.id === booking.id ? updatedBooking : b))
    );

    // Auto-open Deposit Receipt Modal (Rp 500.000) for guest
    setDepositBookingForReceipt(updatedBooking);
  };

  const handleSettleBalance = (bookingId: number) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'Checked In',
              statusBg: 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold',
              actionText: 'Check Out',
              updated: 'Front Desk Staf',
              updated_time: 'Hari ini (Pelunasan 90% Lunas)',
            }
          : b
      )
    );
  };

  const handleInitiateCheckOut = (booking: Booking) => {
    // Parse room rate (e.g. "Rp 12.800.000" or "Rp 3.200.000 per night")
    let baseRate = 3200000;
    if (booking.total.includes('12.800')) baseRate = 3200000;
    if (booking.total.includes('7.600')) baseRate = 1900000;
    if (booking.total.includes('4.200')) baseRate = 1400000;

    // Standard Current Time check simulation (Late Check-Out after 13:00)
    // Assume current check-out attempt is 14:30 WITA (Overtime Half-Day 50%)
    const category = 'halfday';
    const fee = baseRate * 0.5; // 50% charge

    setLateFeeCategory(category);
    setLateFeeAmount(fee);
    setWaiveFee(false);
    setCheckoutBooking(booking);
  };

  const handleConfirmCheckOut = () => {
    if (!checkoutBooking) return;

    // Update status to Completed
    setBookings((prev) =>
      prev.map((b) =>
        b.id === checkoutBooking.id
          ? {
              ...b,
              status: 'Completed',
              statusBg: 'bg-slate-100 text-slate-700',
              actionText: 'Detail Folio',
              total: waiveFee
                ? b.total
                : `Rp ${(parseInt(b.total.replace(/[^0-9]/g, '')) + lateFeeAmount).toLocaleString('id-ID')}`,
              updated: user ? `${user.name} (${user.role})` : 'System Administrator',
              updated_time: 'Hari ini (Check Out)',
            }
          : b
      )
    );

    setCheckoutBooking(null);
  };

  return (
    <div className="flex-1 min-w-0 pb-12">
      <Header
        title={t('bookings.title')}
        subtitle={t('bookings.subtitle')}
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* View Mode Switcher & Walk-In Button */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <NavLink
              to="/bookings"
              className="px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-bold transition flex items-center gap-2 shadow-md"
            >
              <Table className="w-4 h-4" />
              <span>{t('btn.table_view')}</span>
            </NavLink>

            <NavLink
              to="/bookings/calendar"
              className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>{t('btn.calendar_view')}</span>
            </NavLink>
          </div>

          <button
            onClick={() => setIsWalkInModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-lg shadow-purple-600/30 transition cursor-pointer flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Walk-In Check-In</span>
          </button>
        </div>

        {/* Top Action Bar & Channel Filter Pills matching screenshot */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Color-coded Channel Filter Pills */}
            <div className="flex flex-wrap items-center gap-2.5">
              {['all', 'Direct Web', 'Agoda', 'Traveloka', 'Walk-In', 'Booking.com'].map((ch) => {
                const style = getChannelStyle(ch);
                const isActive = selectedChannel.toLowerCase() === ch.toLowerCase();
                return (
                  <button
                    key={ch}
                    onClick={() => {
                      setSelectedChannel(ch);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-2xl text-xs font-black transition cursor-pointer border flex items-center gap-1.5 ${
                      isActive ? style.activeBg : style.inactiveBg
                    }`}
                  >
                    <span>{style.icon}</span>
                    <span>{style.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-500">Bulan Period:</label>
              <select
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-900 focus:outline-none focus:border-[#EF3F09]"
              >
                <option value="2026-06">Juni 2026</option>
                <option value="2026-07">Juli 2026</option>
                <option value="2026-08">Agustus 2026</option>
                <option value="2026-09">September 2026</option>
                <option value="2026-10">Oktober 2026</option>
              </select>
            </div>
          </div>

          {/* Search & Custom Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Cari Nama Tamu / Res ID / Kamar..."
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#EF3F09]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 shrink-0">Dari:</span>
              <input
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 shrink-0">Sampai:</span>
              <input
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Master Reservations Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <h3 className="font-black text-sm text-slate-900 uppercase tracking-tight">Data Reservasi Tamu Hotel</h3>
              <span className="px-3 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-black">
                {totalItems} Records
              </span>
            </div>
            <p className="text-slate-400 text-xs font-semibold">PostgreSQL Golang Live Sync</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Res ID</th>
                  <th className="py-3.5 px-4">Channel OTA</th>
                  <th className="py-3.5 px-4">Identitas Tamu (WNI/WNA)</th>
                  <th className="py-3.5 px-4">Kamar</th>
                  <th className="py-3.5 px-4">Check-In / Out</th>
                  <th className="py-3.5 px-4">Audit Staf (Dibuat & Diubah)</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Total Folio</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400 font-bold">
                      Memuat data reservasi dari Golang PostgreSQL Server...
                    </td>
                  </tr>
                ) : pageBookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400 font-bold">
                      Tidak ada data reservasi yang cocok dengan kriteria filter.
                    </td>
                  </tr>
                ) : (
                  pageBookings.map((item) => {
                    const chStyle = getChannelStyle(item.channel || 'Direct Web');
                    return (
                      <tr key={item.id || item.code} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4 font-black text-slate-900">{item.code}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-3 py-1 rounded-xl text-xs font-black border inline-flex items-center gap-1.5 ${chStyle.badgeBg}`}>
                            <span>{chStyle.icon}</span>
                            <span>{chStyle.label}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{item.guest}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-blue-800">
                              {item.flag}
                            </span>
                          </p>
                          <p className="text-xs text-slate-500">{item.contact}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="text-slate-900 font-extrabold text-xs">{item.room}</p>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-black text-slate-700">
                            Lantai {item.room.match(/\d+/)?.[0]?.[0] || '1'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-xs">{item.dates}</td>
                        <td className="py-3.5 px-4 text-xs">
                          <p className="font-bold text-slate-800">Dibuat: {item.created}</p>
                          <p className="text-[10px] text-slate-400">{item.created_time}</p>
                          <p className="font-semibold text-emerald-700 mt-0.5">Diubah: {item.updated}</p>
                          <p className="text-[10px] text-slate-400">{item.updated_time}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${item.statusBg}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-black text-slate-900">{item.total}</td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setTaxBookingForInvoice(item)}
                              title="Lihat & Cetak Faktur Pajak PB1 Resmi"
                              className="px-2.5 py-1.5 text-xs font-extrabold rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition cursor-pointer flex items-center gap-1"
                            >
                              <FileText className="w-3.5 h-3.5 text-blue-600" />
                              <span>Faktur Pajak</span>
                            </button>

                            <button
                              onClick={() => setDepositBookingForReceipt(item)}
                              title="Cetak Tanda Terima Deposit Tamu"
                              className="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer flex items-center gap-1"
                            >
                              <Printer className="w-3.5 h-3.5 text-slate-600" />
                              <span>Slip Deposit</span>
                            </button>

                            {item.status === 'Checked In' || item.actionText === 'Check Out' ? (
                              <button
                                onClick={() => handleInitiateCheckOut(item)}
                                className="px-3 py-1.5 text-xs font-extrabold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition cursor-pointer flex items-center gap-1"
                              >
                                <Clock className="w-3.5 h-3.5" />
                                <span>Check Out</span>
                              </button>
                            ) : item.status === 'Confirmed' || item.actionText === 'Check In' ? (
                              ['agoda', 'traveloka', 'booking.com', 'booking'].includes(item.channel.toLowerCase()) ? (
                                <button
                                  onClick={() => handleOtaCheckIn(item)}
                                  title="Check-In Tamu OTA (100% Prepaid) & Cetak Slip Deposit"
                                  className="px-3 py-1.5 text-xs font-extrabold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition cursor-pointer flex items-center gap-1"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Check-In OTA & Slip Deposit</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleSettleBalance(item.id)}
                                  title="Terima Pelunasan Sisa 90% saat Check-In"
                                  className="px-3 py-1.5 text-xs font-extrabold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition cursor-pointer flex items-center gap-1"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Pelunasan 90% & Check In</span>
                                </button>
                              )
                            ) : (
                              <button className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition cursor-pointer">
                                {item.actionText}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Reusable Enterprise Pagination Bar */}
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

      {/* LATE CHECK-OUT CONFIRMATION MODAL */}
      {checkoutBooking && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Konfirmasi Check-Out Tamu</h3>
                  <p className="text-xs text-slate-400">Pemeriksaan Waktu Check-Out & Extra Charge</p>
                </div>
              </div>
              <button
                onClick={() => setCheckoutBooking(null)}
                className="text-slate-400 hover:text-white p-1 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Guest Details */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Nama Tamu:</span>
                  <span className="text-xs font-black text-slate-900">{checkoutBooking.guest}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Nomor Kamar:</span>
                  <span className="text-xs font-black text-slate-900">{checkoutBooking.room}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Standard Check-Out Time:</span>
                  <span className="text-xs font-extrabold text-slate-700">12:00 WITA</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Waktu Check-Out Saat Ini:</span>
                  <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    14:30 WITA (Overtime +2.5 jam)
                  </span>
                </div>
              </div>

              {/* Late Check-Out Penalty Alert */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 space-y-2">
                <div className="flex items-center gap-2 text-xs font-black">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Denda Keterlambatan Check-Out (Overtime Fee)</span>
                </div>
                <p className="text-xs text-amber-800 font-medium leading-relaxed">
                  Tamu melakukan check-out pada pukul **14:30 WITA** (melebihi batas Grace Period 13:00 WITA). Sesuai aturan hotel, dikenakan denda **Half-Day Charge (50% dari Tarif Kamar)**.
                </p>

                <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900">Biaya Denda Half-Day (50%):</span>
                  <span className="text-sm font-black text-[#EF3F09]">
                    +Rp {lateFeeAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Waive Option Toggle */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between cursor-pointer" onClick={() => setWaiveFee(!waiveFee)}>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">Gratiskan Denda (Manager Complimentary)</p>
                  <p className="text-[11px] text-slate-500 font-semibold">Bebaskan biaya denda dengan persetujuan General Manager</p>
                </div>
                <input
                  type="checkbox"
                  checked={waiveFee}
                  onChange={(e) => setWaiveFee(e.target.checked)}
                  className="w-4 h-4 text-[#EF3F09] rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setCheckoutBooking(null)}
                className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs font-extrabold hover:bg-slate-100 transition cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleConfirmCheckOut}
                className="px-6 py-2.5 rounded-2xl bg-[#EF3F09] hover:bg-orange-600 text-white text-xs font-extrabold shadow-lg shadow-[#EF3F09]/30 transition cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Proses Check-Out & Cetak Folio</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WALK-IN CHECK-IN REGISTRATION MODAL */}
      <WalkInCheckInModal
        isOpen={isWalkInModalOpen}
        onClose={() => setIsWalkInModalOpen(false)}
        onSuccess={(newWalkInBooking) => {
          setBookings((prev) => [newWalkInBooking, ...prev]);
        }}
      />

      {/* PRINTABLE SECURITY DEPOSIT RECEIPT MODAL */}
      <DepositReceiptModal
        isOpen={!!depositBookingForReceipt}
        onClose={() => setDepositBookingForReceipt(null)}
        booking={depositBookingForReceipt}
      />

      {/* PRINTABLE OFFICIAL FAKTUR PAJAK PB1 MODAL */}
      <TaxInvoiceModal
        isOpen={!!taxBookingForInvoice}
        onClose={() => setTaxBookingForInvoice(null)}
        booking={taxBookingForInvoice}
      />
    </div>
  );
};
