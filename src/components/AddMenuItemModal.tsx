import React, { useState } from 'react';
import { X, Upload, Link as LinkIcon, PlusCircle, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AddMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddMenuItemModal: React.FC<AddMenuItemModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Makanan');
  const [price, setPrice] = useState<number | ''>(75000);
  const [photoMode, setPhotoMode] = useState<'UPLOAD' | 'URL'>('UPLOAD');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

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
    const finalImage = imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';

    try {
      const res = await fetch('/api/v1/pos/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          category: category,
          price: Number(price),
          image_url: finalImage,
          created_by: user ? user.name : 'System Administrator',
        }),
      });

      const data = await res.json();
      if (data && data.status === 'success') {
        onSuccess();
        onClose();
        setName('');
        setPrice(75000);
        setImageUrl('');
        setImagePreview(null);
      } else {
        alert(data.message || 'Gagal menambahkan menu item.');
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
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#EF3F09] flex items-center justify-center font-bold">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Tambah Master Menu Restoran</h3>
              <p className="text-slate-500 text-xs font-semibold">Simpan item makanan/minuman baru di PostgreSQL DB</p>
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
              placeholder="misal: Nasi Goreng Seafood Special"
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
                placeholder="75000"
                value={price}
                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#EF3F09]"
              />
            </div>
          </div>

          {/* Photo Section */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 block">Foto Menu Item</label>

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
                <span>Upload File Laptop</span>
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
                <span>Link URL Foto</span>
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
                <p className="text-xs font-bold text-slate-700">Klik untuk pilih gambar dari Laptop</p>
                <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP hingga 5MB</p>
              </div>
            ) : (
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImagePreview(e.target.value);
                }}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#EF3F09]"
              />
            )}

            {/* Image Live Preview */}
            {imagePreview && (
              <div className="relative h-32 rounded-2xl overflow-hidden border border-slate-200 mt-2">
                <img src={imagePreview} alt="Preview Menu" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-slate-900/80 text-white text-[10px] font-bold">
                  Preview Foto Menu
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-2xl transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-[#EF3F09] hover:bg-[#D63405] text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-[#EF3F09]/30 transition cursor-pointer"
            >
              {loading ? 'Simpan...' : 'Simpan Master Menu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
