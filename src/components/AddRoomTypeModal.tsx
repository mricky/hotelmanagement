import React, { useState } from 'react';
import { X, Building2, Check } from 'lucide-react';

interface AddRoomTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddRoomTypeModal: React.FC<AddRoomTypeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [baseRate, setBaseRate] = useState(1500000);
  const [capacity, setCapacity] = useState('2 Dewasa, 1 Anak');
  const [bed, setBed] = useState('1 King Size Bed');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name,
        base_rate: Number(baseRate),
        capacity,
        bed,
      };

      const res = await fetch('/api/v1/room-types', {
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
      console.error('Failed to create room type:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 transform transition-all">
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EF3F09]/20 text-[#EF3F09] flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Tambah Tipe Kamar Baru</h3>
              <p className="text-slate-400 text-xs">Simpan kategori & tarif dasar baru ke database</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Tipe Kamar
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Presidential Ocean Suite"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EF3F09]/30 focus:border-[#EF3F09] transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tarif Dasar (IDR)
              </label>
              <input
                type="number"
                required
                value={baseRate}
                onChange={(e) => setBaseRate(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EF3F09]/30 focus:border-[#EF3F09] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kapasitas Tamu
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: 2 Dewasa, 2 Anak"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EF3F09]/30 focus:border-[#EF3F09] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Konfigurasi Tempat Tidur
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: 1 Super King Bed & Sofa Bed"
              value={bed}
              onChange={(e) => setBed(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EF3F09]/30 focus:border-[#EF3F09] transition"
            />
          </div>

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
              <span>{isSubmitting ? 'Memproses...' : 'Simpan Tipe Kamar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
