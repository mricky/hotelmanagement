import React, { useState } from 'react';
import { X, ClipboardCheck, Check } from 'lucide-react';

interface AddChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddChecklistModal: React.FC<AddChecklistModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [category, setCategory] = useState('BEDROOM');
  const [categories, setCategories] = useState<any[]>([]);
  const [taskName, setTaskName] = useState('');
  const [isMandatory, setIsMandatory] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/v1/housekeeping/categories');
      const data = await res.json();
      if (data && data.status === 'success' && Array.isArray(data.data)) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        category,
        task_name: taskName,
        is_mandatory: isMandatory,
      };

      const res = await fetch('/api/v1/housekeeping/checklists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data && data.status === 'success') {
        onSuccess();
        onClose();
        setTaskName('');
      }
    } catch (err) {
      console.error('Failed to create checklist item:', err);
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
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Tambah Task SOP Kebersihan Baru</h3>
              <p className="text-slate-400 text-xs">Simpan tugas SOP housekeeping baru ke database</p>
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
              Kategori Task SOP
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EF3F09]/30 focus:border-[#EF3F09] transition"
            >
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.code}>
                    {cat.name}
                  </option>
                ))
              ) : (
                <>
                  <option value="BEDROOM">BEDROOM (Kamar Tidur)</option>
                  <option value="BATHROOM">BATHROOM (Kamar Mandi)</option>
                  <option value="BALCONY">BALCONY & MINIBAR</option>
                  <option value="SANITATION">SANITATION & DISINFECT</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Deskripsi Tugas SOP Kebersihan
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Pengisian Ulang Amenity Kit & Toothbrush Set Baru"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EF3F09]/30 focus:border-[#EF3F09] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Status Mandatory (Wajib Inspeksi)
            </label>
            <select
              value={isMandatory ? 'true' : 'false'}
              onChange={(e) => setIsMandatory(e.target.value === 'true')}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EF3F09]/30 focus:border-[#EF3F09] transition"
            >
              <option value="true">✓ WAJIB (MANDATORY)</option>
              <option value="false">OPSIONAL (OPTIONAL)</option>
            </select>
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
              <span>{isSubmitting ? 'Memproses...' : 'Simpan Task SOP'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
