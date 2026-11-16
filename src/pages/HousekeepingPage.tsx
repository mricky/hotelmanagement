import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Pagination } from '../components/Pagination';
import { AddChecklistModal } from '../components/AddChecklistModal';
import { ClipboardCheck, Plus, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Checklist {
  id: number;
  category: string;
  task_name: string;
  is_mandatory: boolean;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}

export const HousekeepingPage: React.FC = () => {
  const { t } = useLanguage();
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchChecklists();
  }, []);

  const fetchChecklists = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/housekeeping/checklists');
      const data = await res.json();
      if (data && data.status === 'success' && Array.isArray(data.data)) {
        setChecklists(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalItems = checklists.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const pageChecklists = checklists.slice(startIndex, startIndex + rowsPerPage);

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
        title={t('housekeeping.title')}
        subtitle={t('housekeeping.subtitle')}
      />

      <AddChecklistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchChecklists()}
      />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                DAFTAR TASK CHECKLIST HOUSEKEEPING
              </h3>
              <p className="text-slate-500 text-xs font-semibold mt-0.5">
                PostgreSQL Data Record & SOP Inspeksi
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/housekeeping/mobile"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <span>📱 Buka Housekeeping Mobile App PWA</span>
              </a>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 bg-[#EF3F09] hover:bg-[#D63405] text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-[#EF3F09]/30 transition transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t('btn.add_checklist')}</span>
              </button>
            </div>
          </div>

          {loading ? (
            <p className="py-12 text-center text-slate-400 font-bold">Memuat checklist SOP...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase border-b border-slate-200">
                    <th className="py-4 px-6">KATEGORI TASK</th>
                    <th className="py-4 px-6">DESKRIPSI TUGAS SOP</th>
                    <th className="py-4 px-6 text-center">STATUS WAJIB (MANDATORY)</th>
                    <th className="py-4 px-6">DIBUAT OLEH</th>
                    <th className="py-4 px-6">TANGGAL CREATED AT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-bold">
                  {pageChecklists.map((chk) => (
                    <tr key={chk.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-5 px-6">
                        <span className="px-3 py-1 rounded-xl bg-slate-900 text-white text-[10px] font-black tracking-wider uppercase">
                          {chk.category}
                        </span>
                      </td>
                      <td className="py-5 px-6 font-extrabold text-slate-900 text-sm">
                        {chk.task_name}
                      </td>
                      <td className="py-5 px-6 text-center">
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                          ✓ WAJIB (MANDATORY)
                        </span>
                      </td>
                      <td className="py-5 px-6 text-slate-700">{chk.created_by || 'Siti Rahma (Supervisor)'}</td>
                      <td className="py-5 px-6 text-slate-500 font-semibold">{formatDate(chk.created_at)}</td>
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
