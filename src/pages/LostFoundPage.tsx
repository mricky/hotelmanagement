import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Search, Plus, CheckCircle2, AlertCircle, Clock, ShieldCheck, UserCheck, X, FileText, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LostItem {
  id: number;
  item_code: string;
  item_name: string;
  category: string;
  room_number: string;
  founder_name: string;
  description: string;
  found_date: string;
  status: string; // DITEMUKAN, DIHUBUNGI, DIAMBIL, DISPOSABLE
  claimed_by_guest?: string;
  claimed_at?: string;
  notes?: string;
}

export const LostFoundPage: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Elektronik');
  const [roomNumber, setRoomNumber] = useState('');
  const [founderName, setFounderName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Claim Modal State
  const [claimingItem, setClaimingItem] = useState<LostItem | null>(null);
  const [claimedByGuest, setClaimedByGuest] = useState('');
  const [claimStatus, setClaimStatus] = useState('DIAMBIL');
  const [claimNotes, setClaimNotes] = useState('');

  useEffect(() => {
    fetchLostItems();
  }, []);

  const fetchLostItems = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/lost-found');
      const data = await res.json();
      if (data && data.status === 'success' && Array.isArray(data.data)) {
        setItems(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !roomNumber) {
      alert('Mohon isi nama barang dan nomor kamar!');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/v1/lost-found', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_name: itemName,
          category: category,
          room_number: roomNumber,
          founder_name: founderName || (user ? user.name : 'Staf Housekeeping'),
          description: description,
          created_by: user ? user.name : 'System Administrator',
        }),
      });

      const data = await res.json();
      if (data && data.status === 'success') {
        fetchLostItems();
        setIsReportModalOpen(false);
        setItemName('');
        setRoomNumber('');
        setDescription('');
      } else {
        alert(data.message || 'Gagal menyimpan laporan.');
      }
    } catch (e) {
      alert('Terjadi kesalahan koneksi server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimingItem) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/v1/lost-found/${claimingItem.id}/claim`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claimed_by_guest: claimedByGuest,
          status: claimStatus,
          notes: claimNotes,
          updated_by: user ? user.name : 'System Administrator',
        }),
      });

      const data = await res.json();
      if (data && data.status === 'success') {
        fetchLostItems();
        setClaimingItem(null);
        setClaimedByGuest('');
        setClaimNotes('');
      } else {
        alert(data.message || 'Gagal memperbarui status barang.');
      }
    } catch (e) {
      alert('Terjadi kesalahan koneksi server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = items.filter((item) => {
    if (selectedStatus !== 'ALL' && item.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.item_name.toLowerCase().includes(q) ||
        item.item_code.toLowerCase().includes(q) ||
        item.room_number.toLowerCase().includes(q) ||
        item.founder_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const renderStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DITEMUKAN':
        return <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-black text-[10px] uppercase">📦 DITEMUKAN</span>;
      case 'DIHUBUNGI':
        return <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-black text-[10px] uppercase">📞 DIHUBUNGI</span>;
      case 'DIAMBIL':
        return <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase">✅ DIAMBIL TAMU</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-black text-[10px] uppercase">{status}</span>;
    }
  };

  return (
    <div className="flex-1 min-w-0 pb-12">
      <Header title="Housekeeping Lost & Found" subtitle="Pencatatan & pengelolaan barang tamu yang tertinggal di kamar" />

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[10px] uppercase tracking-wider">
              HOUSEKEEPING ASSET SECURITY
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">Lost & Found Management</h1>
            <p className="text-slate-300 text-xs font-medium mt-1">
              Petugas Aktif: <strong className="text-white">{user ? user.name : 'Housekeeping Supervisor'}</strong>
            </p>
          </div>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-6 py-3 bg-[#EF3F09] hover:bg-[#D63405] text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-[#EF3F09]/30 transition transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Laporkan Barang Tertinggal</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Cari kode barang, nama barang, nomor kamar, atau nama penemu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#EF3F09]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { id: 'ALL', label: 'Semua Status' },
              { id: 'DITEMUKAN', label: '📦 Ditemukan' },
              { id: 'DIHUBUNGI', label: '📞 Dihubungi' },
              { id: 'DIAMBIL', label: '✅ Diambil' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id)}
                className={`px-4 py-2 rounded-2xl font-extrabold text-xs transition cursor-pointer ${
                  selectedStatus === st.id
                    ? 'bg-slate-900 text-white shadow'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lost Items Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-900 font-extrabold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4 pl-6">Kode & Barang</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Kamar</th>
                  <th className="p-4">Penemu (Staff)</th>
                  <th className="p-4">Tgl Ditemukan</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Aksi Klaim</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 font-bold">
                      Memuat data Lost & Found dari PostgreSQL...
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 font-bold">
                      Tidak ada data barang tertinggal.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4 pl-6">
                        <span className="text-[10px] font-black text-slate-400 block">{item.item_code}</span>
                        <span className="font-black text-slate-900 text-sm">{item.item_name}</span>
                        {item.description && <p className="text-[11px] text-slate-400 font-normal mt-0.5 line-clamp-1">{item.description}</p>}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold text-[10px] uppercase">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4 font-black text-slate-900">Kamar {item.room_number}</td>
                      <td className="p-4">{item.founder_name}</td>
                      <td className="p-4">{item.found_date}</td>
                      <td className="p-4">{renderStatusBadge(item.status)}</td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => setClaimingItem(item)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[11px] rounded-xl transition cursor-pointer"
                        >
                          Update / Klaim
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Laporkan Barang Tertinggal</h3>
                  <p className="text-slate-500 text-xs font-semibold">Simpan laporan Lost & Found di DB PostgreSQL</p>
                </div>
              </div>
              <button onClick={() => setIsReportModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nama Barang Tertinggal</label>
                <input
                  type="text"
                  required
                  placeholder="misal: Charger Laptop Asus / Jam Tangan / Kacamata"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#EF3F09]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Kategori Barang</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#EF3F09]"
                  >
                    <option value="Elektronik">Elektronik & Gadget</option>
                    <option value="Perhiasan">Perhiasan & Jam</option>
                    <option value="Pakaian">Pakaian & Sepatu</option>
                    <option value="Dokumen">Dokumen & Dompet</option>
                    <option value="Aksesoris">Aksesoris & Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nomor Kamar Ditemukan</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: 402"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#EF3F09]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nama Penemu (Staf Housekeeping)</label>
                <input
                  type="text"
                  placeholder="misal: Siti Rahma (Housekeeping)"
                  value={founderName}
                  onChange={(e) => setFounderName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#EF3F09]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Deskripsi Lokasi / Keterangan</label>
                <textarea
                  rows={3}
                  placeholder="misal: Tertinggal di atas laci meja rias sebelah cermin"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#EF3F09]"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsReportModalOpen(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-2xl">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-[#EF3F09] hover:bg-[#D63405] text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-[#EF3F09]/30">
                  {isSubmitting ? 'Simpan...' : 'Simpan Laporan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Claim Modal */}
      {claimingItem && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Update / Klaim Barang</h3>
                  <p className="text-slate-500 text-xs font-semibold">{claimingItem.item_code} • {claimingItem.item_name}</p>
                </div>
              </div>
              <button onClick={() => setClaimingItem(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleClaimSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Status Barang</label>
                <select
                  value={claimStatus}
                  onChange={(e) => setClaimStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#EF3F09]"
                >
                  <option value="DITEMUKAN">📦 DITEMUKAN (Disimpan di Safety Housekeeping)</option>
                  <option value="DIHUBUNGI">📞 DIHUBUNGI (Tamu telah dikontak)</option>
                  <option value="DIAMBIL">✅ DIAMBIL (Diserahkan ke Tamu)</option>
                  <option value="DISPOSABLE">🗑️ DISPOSABLE (Kadaluarsa / Dimusnahkan)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nama Tamu Yang Mengambil</label>
                <input
                  type="text"
                  placeholder="misal: Bpk. Alexander Wright"
                  value={claimedByGuest}
                  onChange={(e) => setClaimedByGuest(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#EF3F09]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Catatan Penyerahan / Verifikasi Identitas</label>
                <textarea
                  rows={3}
                  placeholder="misal: Verifikasi via foto KTP & serah terima di Front Desk Lobby"
                  value={claimNotes}
                  onChange={(e) => setClaimNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#EF3F09]"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setClaimingItem(null)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-2xl">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-2xl shadow-lg">
                  {isSubmitting ? 'Simpan...' : 'Update Status Barang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
