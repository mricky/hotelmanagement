import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Pagination } from '../components/Pagination';
import { AddGuestModal } from '../components/AddGuestModal';
import { Users, Search, Plus, ShieldCheck, Award, Phone, Mail, MapPin, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Guest {
  id: number;
  name: string;
  identity: string;
  phone: string;
  email: string;
  nationality: string;
  total_stays: number;
  total_spend: string;
  tier: string;
}

export const GuestsPage: React.FC = () => {
  const { t } = useLanguage();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/guests');
      const data = await res.json();
      if (data && data.status === 'success' && Array.isArray(data.data)) {
        setGuests(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch guests:', err);
    } finally {
      setLoading(false);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [nationalityFilter, setNationalityFilter] = useState<'ALL' | 'WNI' | 'WNA'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filteredGuests = guests.filter((g) => {
    if (nationalityFilter === 'WNI') {
      const isWni = g.nationality.toUpperCase().includes('WNI') || g.identity.toUpperCase().includes('KTP');
      if (!isWni) return false;
    } else if (nationalityFilter === 'WNA') {
      const isWna = g.nationality.toUpperCase().includes('WNA') || g.identity.toUpperCase().includes('PASPOR');
      if (!isWna) return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        g.name.toLowerCase().includes(q) ||
        g.identity.toLowerCase().includes(q) ||
        g.email.toLowerCase().includes(q) ||
        g.nationality.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalItems = filteredGuests.length;
  const totalPages = Math.ceil(filteredGuests.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const pageGuests = filteredGuests.slice(startIndex, startIndex + rowsPerPage);

  const wniCount = guests.filter(g => g.nationality.toUpperCase().includes('WNI') || g.identity.toUpperCase().includes('KTP')).length;
  const wnaCount = guests.filter(g => g.nationality.toUpperCase().includes('WNA') || g.identity.toUpperCase().includes('PASPOR')).length;

  return (
    <div className="flex-1 min-w-0 pb-12">
      <Header
        title={t('guests.title')}
        subtitle={t('guests.subtitle')}
      />

      <AddGuestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchGuests()}
      />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Top Filter Bar: Search + WNI/WNA Pill Filters */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 flex-1">
            {/* Search Input */}
            <div className="relative min-w-[280px] flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Cari Nama Tamu / KTP NIK / Paspor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#EF3F09]"
              />
            </div>

            {/* WNI / WNA Filter Pills */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
              <button
                onClick={() => {
                  setNationalityFilter('ALL');
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 ${
                  nationalityFilter === 'ALL'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <span>🌟 Semua Tamu ({guests.length})</span>
              </button>

              <button
                onClick={() => {
                  setNationalityFilter('WNI');
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 ${
                  nationalityFilter === 'WNI'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <span>🇮🇩 Tamu WNI ({wniCount})</span>
              </button>

              <button
                onClick={() => {
                  setNationalityFilter('WNA');
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 ${
                  nationalityFilter === 'WNA'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <span>🌐 Tamu WNA ({wnaCount})</span>
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-[#EF3F09] hover:bg-[#D63405] text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-[#EF3F09]/30 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Pendaftaran Tamu CRM Baru</span>
          </button>
        </div>

        {/* Guests Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
              DATABASE PROFIL TAMU REGULER & VIP
            </h3>
            <span className="px-3 py-1 bg-slate-900 text-white rounded-xl text-xs font-black">
              {totalItems} Profil Tamu
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase border-b border-slate-200">
                  <th className="py-4 px-6">PROFIL TAMU</th>
                  <th className="py-4 px-6">IDENTITAS (NIK / PASPOR)</th>
                  <th className="py-4 px-6">KONTAK</th>
                  <th className="py-4 px-6 text-center">TOTAL menginap</th>
                  <th className="py-4 px-6 text-right">LIFETIME SPEND</th>
                  <th className="py-4 px-6 text-center">TIER LOYALTY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-bold">
                {pageGuests.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-5 px-6">
                      <p className="font-extrabold text-slate-900 text-sm">{g.name}</p>
                      <span className="text-[10px] text-slate-400 font-semibold">{g.nationality}</span>
                    </td>
                    <td className="py-5 px-6 text-slate-700">{g.identity}</td>
                    <td className="py-5 px-6 space-y-0.5">
                      <p className="text-slate-900 font-bold">{g.phone}</p>
                      <p className="text-slate-400 font-medium">{g.email}</p>
                    </td>
                    <td className="py-5 px-6 text-center text-slate-900 font-black text-sm">
                      {g.total_stays} Kali
                    </td>
                    <td className="py-5 px-6 text-right font-black text-[#EF3F09]">{g.total_spend}</td>
                    <td className="py-5 px-6 text-center">
                      <span className="px-3 py-1 rounded-full bg-slate-900 text-white font-extrabold text-[10px]">
                        {g.tier}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
