import React, { useState, useEffect } from 'react';
import { X, Edit, Upload, Link as LinkIcon, Check, Trash2 } from 'lucide-react';

interface EditRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  room: {
    id: number;
    number: string;
    type: string;
    status: string;
    rate: number;
    image_url?: string;
  } | null;
}

export const EditRoomModal: React.FC<EditRoomModalProps> = ({ isOpen, onClose, onSuccess, room }) => {
  const [number, setNumber] = useState('');
  const [roomType, setRoomType] = useState('Deluxe King');
  const [rate, setRate] = useState('');
  const [status, setStatus] = useState('VACANT');
  const [imageUrl, setImageUrl] = useState('');
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (room) {
      setNumber(room.number || '');
      setRoomType(room.type || 'Deluxe King');
      setRate(room.rate ? room.rate.toString() : '1900000');
      setStatus(room.status || 'VACANT');
      setImageUrl(room.image_url || '');
    }
  }, [room]);

  if (!isOpen || !room) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        number,
        type: roomType,
        status,
        rate: parseFloat(rate) || 1900000,
        image_url: imageUrl,
      };

      const res = await fetch(`/api/v1/rooms/${room.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data && data.status === 'success') {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Failed to update room:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#EF3F09] flex items-center justify-center font-bold">
              <Edit className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Edit Data & Foto Kamar {room.number}</h3>
              <p className="text-slate-500 text-xs font-semibold">Pembaruan Inventaris, Tarif, & Foto Unit Kamar</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">NOMOR KAMAR</label>
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#EF3F09]"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">TIPE / KATEGORI KAMAR</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#EF3F09]"
              >
                <option value="Executive Suite">Executive Suite</option>
                <option value="Deluxe King">Deluxe King</option>
                <option value="Standard Double">Standard Double</option>
                <option value="Presidential Suite">Presidential Suite</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">HARGA DASAR (RP / MALAM)</label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#EF3F09]"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">STATUS KEBERSIHAN</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#EF3F09]"
              >
                <option value="VACANT">✓ TERSEDIA (VACANT)</option>
                <option value="OCCUPIED">TERISI (OCCUPIED)</option>
                <option value="CLEANING">PEMBERSIHAN (DIRTY)</option>
                <option value="OOO">PERBAIKAN (OOO)</option>
              </select>
            </div>
          </div>

          {/* Dual Mode Foto Kamar (Upload File Laptop / Link URL) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-black uppercase text-slate-700">
                GANTI FOTO KAMAR (ROOM PHOTO)
              </label>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    imageMode === 'upload' ? 'bg-white text-[#EF3F09] shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File Laptop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    imageMode === 'url' ? 'bg-white text-[#EF3F09] shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Link URL</span>
                </button>
              </div>
            </div>

            {imageMode === 'upload' ? (
              <div className="space-y-2">
                <label className="border-2 border-dashed border-slate-300 hover:border-[#EF3F09] bg-slate-50 hover:bg-orange-50/40 transition rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer group text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#EF3F09] flex items-center justify-center mb-2 group-hover:scale-110 transition">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-black text-slate-800">
                    Klik untuk memilih foto baru dari Laptop / Drive
                  </p>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                    Format JPG, PNG, WEBP (Otomatis Kompres & Live Preview)
                  </p>
                </label>
              </div>
            ) : (
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-... atau /images/kamar-501.jpg"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#EF3F09]"
              />
            )}

            {imageUrl && (
              <div className="mt-3 flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={imageUrl}
                    alt="Preview Foto Kamar"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-300 shadow-sm shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-900 truncate">
                      {selectedFileName || 'Foto Kamar Active'}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Live Preview Aktif & Siap Disimpan
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl('');
                    setSelectedFileName('');
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                  title="Hapus foto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-2xl bg-[#EF3F09] hover:bg-[#D63405] text-white font-extrabold text-xs shadow-lg shadow-[#EF3F09]/30 transition cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan Kamar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
