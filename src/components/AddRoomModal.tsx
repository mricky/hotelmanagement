import React, { useState } from 'react';
import { X, Key, Wifi, Check, Upload, Link as LinkIcon, Image as ImageIcon, Trash2 } from 'lucide-react';

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddRoomModal: React.FC<AddRoomModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [number, setNumber] = useState('501');
  const [floor, setFloor] = useState('Lantai 5 (Penthouse Wing)');
  const [roomType, setRoomType] = useState('Presidential Suite');
  const [rate, setRate] = useState('6500000');
  const [rfidCode, setRfidCode] = useState('RF-501-8891-B');
  const [imageUrl, setImageUrl] = useState('');
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [status, setStatus] = useState('Tersedia');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

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

  const handleTapCard = () => {
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const newRfid = `RF-${number}-${randomHex}-B`;
    setRfidCode(newRfid);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        number: number.startsWith('Kamar') ? number.replace('Kamar ', '') : number,
        type: roomType,
        status: status === 'Tersedia' ? 'VACANT' : status === 'Pembersihan' ? 'CLEANING' : 'OOO',
        rate: parseFloat(rate) || 1400000,
        image_url: imageUrl || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80',
      };

      const res = await fetch('/api/v1/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data && data.status === 'success') {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Failed to create room:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Tambah Kunci Kamar RFID Baru</h3>
              <p className="text-slate-500 text-xs font-semibold">Penambahan Unit Kamar & Integrasi Encoder Keycard RFID</p>
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
                placeholder="Contoh: Kamar 501"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#EF3F09]"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">POSISI LANTAI</label>
              <select
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#EF3F09]"
              >
                <option value="Lantai 5 (Penthouse Wing)">Lantai 5 (Penthouse Wing)</option>
                <option value="Lantai 4 (Executive Wing)">Lantai 4 (Executive Wing)</option>
                <option value="Lantai 3 (Deluxe Wing)">Lantai 3 (Deluxe Wing)</option>
                <option value="Lantai 2 (Standard Wing)">Lantai 2 (Standard Wing)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">TIPE / KATEGORI KAMAR</label>
              <select
                value={roomType}
                onChange={(e) => {
                  setRoomType(e.target.value);
                  if (e.target.value === 'Executive Suite') setRate('3200000');
                  else if (e.target.value === 'Deluxe King') setRate('1900000');
                  else if (e.target.value === 'Standard Double') setRate('1400000');
                  else if (e.target.value === 'Presidential Suite') setRate('6500000');
                }}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#EF3F09]"
              >
                <option value="Executive Suite">Executive Suite (Rp 3.200.000/malam)</option>
                <option value="Deluxe King">Deluxe King (Rp 1.900.000/malam)</option>
                <option value="Standard Double">Standard Double (Rp 1.400.000/malam)</option>
                <option value="Presidential Suite">Presidential Suite (Rp 6.500.000/malam)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">HARGA DASAR (RP / MALAM)</label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="6500000"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#EF3F09]"
                required
              />
            </div>
          </div>

          {/* Yellow RFID Encoder Box matching screenshot */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-900 uppercase tracking-wide">
                ENCODER KUNCI KARTU RFID (MIFARE 13.56 MHZ)
              </span>
              <span className="px-3 py-1 rounded-xl bg-amber-200/80 text-amber-900 text-[10px] font-black flex items-center gap-1">
                <Wifi className="w-3 h-3 text-amber-700" /> USB / NFC Connected
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={rfidCode}
                onChange={(e) => setRfidCode(e.target.value)}
                className="flex-1 px-4 py-3 bg-white border border-amber-200 rounded-2xl text-xs font-black text-slate-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleTapCard}
                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold text-xs rounded-2xl shadow transition cursor-pointer flex items-center gap-1.5"
              >
                <Key className="w-4 h-4" />
                <span>Tap Kartu</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">STATUS KEBERSIHAN AWAL</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#EF3F09]"
            >
              <option value="Tersedia">✓ Tersedia (Bersih & Siap)</option>
              <option value="Pembersihan">Pembersihan (Dirty / Cleaning)</option>
              <option value="Perbaikan">Perbaikan (Out of Order)</option>
            </select>
          </div>

          {/* Dual Mode Foto Kamar (Upload File Laptop / Link URL) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-black uppercase text-slate-700">
                FOTO KAMAR (ROOM PHOTO)
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
                    Klik untuk memilih foto dari Laptop / Drive
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
                      {selectedFileName || 'Foto Kamar Terpilih'}
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
              <span>{isSubmitting ? 'Menyimpan...' : 'Encode & Simpan Kunci RFID'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
