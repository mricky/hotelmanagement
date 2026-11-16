import React, { useState } from 'react';
import { X, TrendingUp, Percent, Check } from 'lucide-react';

interface AddPricingRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddPricingRuleModal: React.FC<AddPricingRuleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [condition, setCondition] = useState('Sabtu & Minggu');
  const [adjustment, setAdjustment] = useState('+20% Surge Rate');
  const [appliedRooms, setAppliedRooms] = useState('Semua Tipe Kamar');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name,
        condition,
        adjustment,
        applied_rooms: appliedRooms,
        status: true,
      };

      const res = await fetch('/api/v1/pricing-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data && data.status === 'success') {
        onSuccess();
        onClose();
        setName('');
      }
    } catch (err) {
      console.error('Failed to create pricing rule:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 transform transition-all">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EF3F09]/20 text-[#EF3F09] flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Tambah Aturan Pricing Baru</h3>
              <p className="text-slate-400 text-xs">Simpan aturan surge/discount baru ke database</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Aturan Pricing
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Peak Season Holiday Surge"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EF3F09]/30 focus:border-[#EF3F09] transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kondisi Pemicu (Trigger)
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Okupansi > 85%"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EF3F09]/30 focus:border-[#EF3F09] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Penyesuaian Harga
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: +35% Tarif Dasar"
                value={adjustment}
                onChange={(e) => setAdjustment(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EF3F09]/30 focus:border-[#EF3F09] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tipe Kamar Terdampak
            </label>
            <select
              value={appliedRooms}
              onChange={(e) => setAppliedRooms(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EF3F09]/30 focus:border-[#EF3F09] transition"
            >
              <option value="Semua Tipe Kamar">Semua Tipe Kamar</option>
              <option value="Executive Suite & Deluxe King">Executive Suite & Deluxe King</option>
              <option value="Direct Web Engine Only">Direct Web Engine Only</option>
              <option value="Standard Double">Standard Double</option>
            </select>
          </div>

          {/* Action Footer */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-2xl bg-[#EF3F09] hover:bg-[#D63405] text-white text-xs font-extrabold shadow-lg shadow-[#EF3F09]/30 transition transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Memproses...' : 'Simpan Aturan Pricing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
