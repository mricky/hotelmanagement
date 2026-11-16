import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Pagination } from '../components/Pagination';
import { AddRoomTypeModal } from '../components/AddRoomTypeModal';
import { BedDouble, Plus, Check, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface RoomType {
  id: number;
  name: string;
  code: string;
  base_rate: number;
  capacity: number;
  total_units: number;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}

export const RoomTypesPage: React.FC = () => {
  const { t } = useLanguage();
  const [types, setTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/room-types');
      const data = await res.json();
      if (data && data.status === 'success' && Array.isArray(data.data)) {
        setTypes(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalItems = types.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const pageTypes = types.slice(startIndex, startIndex + rowsPerPage);

  const formatDate = (str?: string) => {
    if (!str) return '-';
    try {
      const d = new Date(str);
      if (isNaN(d.getTime())) return str;
      const day = String(d.getDate()).padStart(2, '0');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      return `${day} ${monthNames[d.getMonth()]} ${d.getFullYear()}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} WIB`;
    } catch {
      return str;
    }
  };

  return (
    <div className="flex-1 min-w-0 pb-12">
      <Header
        title={t('room_types.title')}
        subtitle={t('room_types.subtitle')}
      />

      <AddRoomTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchTypes()}
      />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                DAFTAR KATEGORI TIPE KAMAR HOTEL
              </h3>
              <p className="text-slate-500 text-xs font-semibold mt-0.5">
                PostgreSQL Data Record & Jejak Audit Staf
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-[#EF3F09] hover:bg-[#D63405] text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-[#EF3F09]/30 transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Tipe Kamar Baru</span>
            </button>
          </div>

          {loading ? (
            <p className="py-12 text-center text-slate-400 font-bold">Memuat tipe kamar...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase border-b border-slate-200">
                    <th className="py-4 px-6">KODE & NAMA TIPE</th>
                    <th className="py-4 px-6 text-right">TARIF DASAR / MALAM</th>
                    <th className="py-4 px-6 text-center">KAPASITAS TAMU</th>
                    <th className="py-4 px-6 text-center">TOTAL UNIT INVENTARIS</th>
                    <th className="py-4 px-6">DIBUAT OLEH</th>
                    <th className="py-4 px-6">TANGGAL CREATED AT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-bold">
                  {pageTypes.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-5 px-6">
                        <p className="font-extrabold text-slate-900 text-sm">{t.name}</p>
                        <span className="text-[10px] text-slate-400 font-mono">CODE: {t.code}</span>
                      </td>
                      <td className="py-5 px-6 text-right font-black text-[#EF3F09] text-sm">
                        Rp {t.base_rate.toLocaleString('id-ID')}
                      </td>
                      <td className="py-5 px-6 text-center text-slate-800">
                        {t.capacity || 2} Orang
                      </td>
                      <td className="py-5 px-6 text-center">
                        <span className="px-3 py-1 rounded-xl bg-slate-900 text-white text-xs font-extrabold">
                          {t.total_units || 10} Kamar
                        </span>
                      </td>
                      <td className="py-5 px-6 text-slate-700">{t.created_by || 'System Administrator'}</td>
                      <td className="py-5 px-6 text-slate-500 font-semibold">{formatDate(t.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

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
