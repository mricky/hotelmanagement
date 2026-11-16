import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Pagination } from '../components/Pagination';
import { AddFloorModal } from '../components/AddFloorModal';
import { Layers, Plus, User, Building, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Floor {
  id: number;
  floor_code: string;
  name: string;
  range: string;
  unit_count: number;
  supervisor: string;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}

export const FloorsPage: React.FC = () => {
  const { t } = useLanguage();
  const [floors, setFloors] = useState<Floor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchFloors();
  }, []);

  const fetchFloors = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/floors');
      const data = await res.json();
      if (data && data.status === 'success' && Array.isArray(data.data)) {
        setFloors(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalItems = floors.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const pageFloors = floors.slice(startIndex, startIndex + rowsPerPage);

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
        title={t('floors.title')}
        subtitle={t('floors.subtitle')}
      />

      <AddFloorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchFloors()}
      />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                STRUKTUR ZONA LANTAI HOTEL
              </h3>
              <p className="text-slate-500 text-xs font-semibold mt-0.5">
                PostgreSQL Data Record & Penugasan Supervisor
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-[#EF3F09] hover:bg-[#D63405] text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-[#EF3F09]/30 transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Posisi Lantai Baru</span>
            </button>
          </div>

          {loading ? (
            <p className="py-12 text-center text-slate-400 font-bold">Memuat zona lantai...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase border-b border-slate-200">
                    <th className="py-4 px-6">KODE & NAMA LANTAI</th>
                    <th className="py-4 px-6 text-center">RENTANG KAMAR</th>
                    <th className="py-4 px-6 text-center">TOTAL KAMAR</th>
                    <th className="py-4 px-6">SUPERVISOR LANTAI</th>
                    <th className="py-4 px-6">DIBUAT OLEH</th>
                    <th className="py-4 px-6">TANGGAL CREATED AT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-bold">
                  {pageFloors.map((fl) => (
                    <tr key={fl.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-5 px-6">
                        <p className="font-extrabold text-slate-900 text-sm">{fl.name}</p>
                        <span className="text-[10px] text-slate-400 font-mono">CODE: {fl.floor_code}</span>
                      </td>
                      <td className="py-5 px-6 text-center font-extrabold text-indigo-600">
                        {fl.range}
                      </td>
                      <td className="py-5 px-6 text-center">
                        <span className="px-3 py-1 rounded-xl bg-slate-900 text-white text-xs font-extrabold">
                          {fl.unit_count} Kamar
                        </span>
                      </td>
                      <td className="py-5 px-6 text-slate-900 font-black">{fl.supervisor}</td>
                      <td className="py-5 px-6 text-slate-700">{fl.created_by || 'System Administrator'}</td>
                      <td className="py-5 px-6 text-slate-500 font-semibold">{formatDate(fl.created_at)}</td>
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
