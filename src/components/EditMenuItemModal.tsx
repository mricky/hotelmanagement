import React, { useState, useEffect } from 'react';
import { X, Upload, Link as LinkIcon, Edit, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface EditMenuItemModalProps {
  isOpen: boolean;
  item: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditMenuItemModal: React.FC<EditMenuItemModalProps> = ({ isOpen, item, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Makanan');
  const [price, setPrice] = useState<number | ''>(0);
  const [photoMode, setPhotoMode] = useState<'UPLOAD' | 'URL'>('URL');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setCategory(item.category || 'Makanan');
      setPrice(item.price || 0);
      setImageUrl(item.image_url || '');
      setImagePreview(item.image_url || null);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setImageUrl(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      alert('Mohon isi nama menu dan harga!');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/v1/pos/menu/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          category: category,
          price: Number(price),
          image_url: imageUrl,
          updated_by: user ? user.name : 'System Administrator',
        }),
      });

      const data = await res.json();
      if (data && data.status === 'success') {
        onSuccess();
        onClose();
      } else {
        alert(data.message || 'Gagal mengedit menu item.');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi server.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Yakin ingin menghapus menu "${item.name}" dari database PostgreSQL?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/v1/pos/menu/${item.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data && data.status === 'success') {
        onSuccess();
        onClose();
      } else {
        alert(data.message || 'Gagal menghapus menu item.');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Edit Menu Restoran</h3>
              <p className="text-slate-500 text-xs font-semibold">Perbarui detail & foto di PostgreSQL Database</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Nama Makanan / Minuman</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#EF3F09]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Kategori Menu</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#EF3F09]"
              >
                <option value="Makanan">Makanan Utama</option>
                <option value="Minuman">Minuman & Kopi</option>
                <option value="Dessert">Dessert & Snack</option>
                <option value="Room Service">In-Room Service</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Harga Jual (Rp)</label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#EF3F09]"
              />
            </div>
          </div>

          {/* Photo Section */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 block">Ganti Foto Menu</label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPhotoMode('UPLOAD')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  photoMode === 'UPLOAD'
                    ? 'bg-slate-900 text-white shadow'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Laptop</span>
              </button>

              <button
                type="button"
                onClick={() => setPhotoMode('URL')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  photoMode === 'URL'
                    ? 'bg-slate-900 text-white shadow'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Link URL</span>
              </button>
            </div>

            {photoMode === 'UPLOAD' ? (
              <div className="border-2 border-dashed border-slate-200 hover:border-[#EF3F09] rounded-2xl p-4 text-center bg-slate-50 transition cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                <p className="text-xs font-bold text-slate-700">Klik untuk ganti foto dari Laptop</p>
              </div>
            ) : (
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImagePreview(e.target.value);
                }}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#EF3F09]"
              />
            )}

            {imagePreview && (
              <div className="relative h-32 rounded-2xl overflow-hidden border border-slate-200 mt-2">
                <img src={imagePreview} alt="Preview Menu" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-slate-900/80 text-white text-[10px] font-bold">
                  Preview Foto
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleDelete}
              className="py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-xs rounded-2xl transition cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus Menu</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-2xl transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="py-3 px-6 bg-[#EF3F09] hover:bg-[#D63405] text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-[#EF3F09]/30 transition cursor-pointer"
              >
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
