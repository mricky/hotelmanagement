import React, { useState } from 'react';
import { Header } from '../components/Header';
import { AddPricingRuleModal } from '../components/AddPricingRuleModal';
import { TrendingUp, Zap, Percent, Calendar, ShieldCheck, Check, Plus, ToggleLeft, ToggleRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PricingRule {
  id: number;
  name: string;
  condition: string;
  adjustment: string;
  applied_rooms: string;
  status: boolean;
}

export const PricingPage: React.FC = () => {
  const { t } = useLanguage();
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/pricing-rules');
      const data = await res.json();
      if (data && data.status === 'success' && Array.isArray(data.data)) {
        setRules(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch pricing rules:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRule = async (id: number) => {
    try {
      const res = await fetch(`/api/v1/pricing-rules/toggle/${id}`, { method: 'POST' });
      const data = await res.json();
      if (data && data.status === 'success') {
        fetchRules();
      }
    } catch (err) {
      console.error('Failed to toggle pricing rule:', err);
    }
  };

  return (
    <div className="flex-1 min-w-0 pb-12">
      <Header
        title={t('pricing.title')}
        subtitle={t('pricing.subtitle')}
      />

      <AddPricingRuleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchRules()}
      />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* KPI Header Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-[11px] font-black uppercase tracking-wider mb-1">ALGORITMA DYNAMIC PRICING</p>
              <p className="text-2xl font-black text-slate-900">AKTIF (AUTOMATIC)</p>
              <span className="text-emerald-600 text-xs font-bold">✓ Yield Rate Optimization</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Zap className="w-7 h-7" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-[11px] font-black uppercase tracking-wider mb-1">RATA-RATA SURGE WEEKEND</p>
              <p className="text-2xl font-black text-[#EF3F09]">+25.0%</p>
              <span className="text-slate-500 text-xs font-bold">Sabtu & Minggu</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#EF3F09] flex items-center justify-center font-bold">
              <TrendingUp className="w-7 h-7" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-[11px] font-black uppercase tracking-wider mb-1">PROFIL REVENUE BOOST</p>
              <p className="text-2xl font-black text-indigo-600">+Rp 245 Jt / Bln</p>
              <span className="text-slate-500 text-xs font-bold">Estimasi Tambahan Omzet</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Percent className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* Pricing Rules Management Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                MATRIKS ATURAN PENYESUAIAN TARIF (PRICING RULES)
              </h3>
              <p className="text-slate-500 text-xs font-semibold mt-0.5">
                Aktifkan atau nonaktifkan aturan otomatis berikut secara real-time
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-[#EF3F09] hover:bg-[#D63405] text-white font-extrabold text-xs rounded-2xl shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Aturan Pricing Baru</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase border-b border-slate-200">
                  <th className="py-4 px-6">NAMA ATURAN PRICING</th>
                  <th className="py-4 px-6">KONDISI PEMICU (TRIGGER)</th>
                  <th className="py-4 px-6">PENYESUAIAN HARGA</th>
                  <th className="py-4 px-6">TIPE KAMAR TERDAMPAK</th>
                  <th className="py-4 px-6 text-center">STATUS DYNAMIC PRICING</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-bold">
                {rules.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-5 px-6">
                      <p className="font-extrabold text-slate-900 text-sm">{r.name}</p>
                    </td>
                    <td className="py-5 px-6 text-slate-600 font-semibold">{r.condition}</td>
                    <td className="py-5 px-6 font-black text-[#EF3F09]">{r.adjustment}</td>
                    <td className="py-5 px-6 text-slate-700">{r.applied_rooms}</td>
                    <td className="py-5 px-6 text-center">
                      <button
                        onClick={() => handleToggleRule(r.id)}
                        className={`px-4 py-2 rounded-2xl font-black text-xs transition cursor-pointer flex items-center justify-center gap-2 mx-auto ${
                          r.status
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {r.status ? (
                          <>
                            <ToggleRight className="w-5 h-5 text-emerald-600" />
                            <span>AKTIF</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-5 h-5 text-slate-400" />
                            <span>NON-AKTIF</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
