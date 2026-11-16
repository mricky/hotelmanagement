import React, { useState, useEffect } from 'react';
import { X, Layers, Check } from 'lucide-react';

interface AddFloorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddFloorModal: React.FC<AddFloorModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [floorCode, setFloorCode] = useState('FL-04');
  const [name, setName] = useState('Lantai 4 - Penthouse & Suite Level');
  const [range, setRange] = useState('401 - 410');
  const [unitCount, setUnitCount] = useState(10);
  const [supervisor, setSupervisor] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/v1/users');
      const data = await res.json();
      if (data && data.status === 'success' && Array.isArray(data.data)) {
        setUsers(data.data);
        if (data.data.length > 0) {
          setSupervisor(data.data[0].name);
        }
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        floor_code: floorCode,
        name,
        range,
        unit_count: Number(unitCount),
        supervisor,
      };

      const res = await fetch('/api/v1/floors', {
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
      console.error('Failed to create floor:', err);
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
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Tambah Zona Lantai Baru</h3>
              <p className="text-slate-400 text-xs">Simpan rentang nomor & supervisor lantai baru ke database</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kode Lantai
              </label>
              <input
                type="text"
                required
                placeholder="FL-04"
                value={floorCode}
                onChange={(e) => setFloorCode(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EF3F09]/30 focus:border-[#EF3F09] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Supervisor Lantai (Akun Staf DB)
              </label>
              <select
                value={supervisor}
                onChange={(e) => setSupervisor(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EF3F09]/30 focus:border-[#EF3F09] transition"
              >
                {users.length > 0 ? (
                  users.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name} ({u.role})
                    </option>
                  ))
                ) : (
                  <option value="Siti Rahmawati">Siti Rahmawati (Housekeeping)</option>
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Posisi / Level Lantai
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Lantai 4 - Penthouse & Suite Level"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EF3F09]/30 focus:border-[#EF3F09] transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Rentang Nomor Kamar
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: 401 - 410"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EF3F09]/30 focus:border-[#EF3F09] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Jumlah Total Unit Kamar
              </label>
              <input
                type="number"
                required
                value={unitCount}
                onChange={(e) => setUnitCount(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EF3F09]/30 focus:border-[#EF3F09] transition"
              />
            </div>
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
              <span>{isSubmitting ? 'Memproses...' : 'Simpan Posisi Lantai'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
