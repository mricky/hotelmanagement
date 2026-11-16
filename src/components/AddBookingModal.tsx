import React, { useState } from 'react';
import { X, UserCheck, Shield, Check, CreditCard, Lock } from 'lucide-react';

interface AddBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddBookingModal: React.FC<AddBookingModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [nationality, setNationality] = useState<'WNI' | 'WNA'>('WNI');
  const [title, setTitle] = useState('Bpk.');
  const [guestName, setGuestName] = useState('');
  const [identityNo, setIdentityNo] = useState('3273019283740001');
  const [country, setCountry] = useState('Indonesia');
  const [phone, setPhone] = useState('+62 812-3456-7890');
  const [email, setEmail] = useState('tamu@email.com');
  const [room, setRoom] = useState('Kamar 402 - Executive Suite');
  const [channel, setChannel] = useState('Walk-In Resepsionis');
  const [deposit, setDeposit] = useState('Rp 200.000 (Standar Check-In)');
  const [paymentMethod, setPaymentMethod] = useState('Cash / Tunai Resepsionis');
  const [vaultSlot, setVaultSlot] = useState('Slot #KTP-402');
  const [checkIn, setCheckIn] = useState('2026-08-29');
  const [checkOut, setCheckOut] = useState('2026-09-01');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        guest: `${title} ${guestName || 'Dudung Suherman'} (${nationality} ${nationality === 'WNI' ? '🇮🇩' : '🇬🇧'})`,
        flag: nationality === 'WNI' ? '🇮🇩' : '🇬🇧',
        contact: identityNo ? `NIK/KTP: ${identityNo}` : `Paspor: GB-${Math.floor(10000000 + Math.random() * 90000000)}`,
        room: room,
        check_in: checkIn,
        check_out: checkOut,
        channel: channel.includes('Walk-In') ? 'Walk-In' : channel,
        total: 'Rp 3.200.000',
        status: 'TERISI',
      };

      const res = await fetch('/api/v1/bookings', {
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
      console.error('Failed to create booking:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#EF3F09] flex items-center justify-center font-bold">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Form Pendaftaran Tamu Hotel (Registration Card)</h3>
              <p className="text-slate-500 text-xs font-semibold">Standar Operasional Hotel untuk Tamu Lokal (WNI) & WNA (Bule)</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nationality Toggle matching screenshot */}
          <div>
            <label className="block text-[11px] font-black uppercase text-slate-700 mb-2">KATEGORI KEWARGANEGARAAN TAMU</label>
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-50 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setNationality('WNI')}
                className={`py-3 px-4 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-2 ${
                  nationality === 'WNI'
                    ? 'bg-[#EF3F09] text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <span>🇮🇩 Tamu Lokal (WNI)</span>
              </button>
              <button
                type="button"
                onClick={() => setNationality('WNA')}
                className={`py-3 px-4 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-2 ${
                  nationality === 'WNA'
                    ? 'bg-[#EF3F09] text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <span>🌐 Tamu Asing (WNA / Bule)</span>
              </button>
            </div>
          </div>

          {/* Title & Full Name */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">GELAR / TITLE</label>
              <select
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
              >
                <option value="Bpk.">Bpk.</option>
                <option value="Ibu">Ibu</option>
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Ms.">Ms.</option>
                <option value="Dr.">Dr.</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">NAMA LENGKAP SESUAI KTP / PASPOR</label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Contoh: Dudung Suherman ATAU Johnathan Smith"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#EF3F09]"
                required
              />
            </div>
          </div>

          {/* NIK / Paspor & Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">
                {nationality === 'WNI' ? 'NOMOR NIK KTP / SIM (16 DIGIT)' : 'NOMOR PASPOR (PASSPORT NO.)'}
              </label>
              <input
                type="text"
                value={identityNo}
                onChange={(e) => setIdentityNo(e.target.value)}
                placeholder={nationality === 'WNI' ? '3273019283740001' : 'GB-99481204'}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">KEWARGANEGARAAN / NEGARA ASAL</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Indonesia"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">NO. WHATSAPP / TELEPON</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+62 812-3456-7890"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">ALAMAT EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tamu@email.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Room & Channel Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">PILIH KAMAR & TIPE</label>
              <select
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
              >
                <option value="Kamar 402 - Executive Suite">Kamar Executive Suite (Rp 3.200.000/malam)</option>
                <option value="Kamar 305 - Deluxe King">Kamar Deluxe King (Rp 1.900.000/malam)</option>
                <option value="Kamar 201 - Standard Double">Kamar Standard Double (Rp 1.400.000/malam)</option>
                <option value="Kamar 501 - Presidential Suite">Kamar Presidential Suite (Rp 6.500.000/malam)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">CHANNEL / SUMBER PEMESANAN</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
              >
                <option value="Walk-In Resepsionis">Walk-In Resepsionis</option>
                <option value="Direct Web">Direct Web</option>
                <option value="Agoda">Agoda OTA</option>
                <option value="Traveloka">Traveloka OTA</option>
              </select>
            </div>
          </div>

          {/* Yellow Security Deposit & Key Vault Container matching screenshots 2 & 3 */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-amber-700" /> SECURITY GUARANTEE DEPOSIT & VAULT ID FRONT DESK
              </span>
              <span className="px-3 py-1 rounded-xl bg-amber-200/80 text-amber-900 text-[10px] font-black">
                Standar Operasional Check-In
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-amber-900 mb-1">NOMINAL DEPOSIT JAMINAN</label>
                <select
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-amber-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
                >
                  <option value="Rp 200.000 (Standar Check-In)">Rp 200.000 (Standar Check-In)</option>
                  <option value="Rp 500.000 (Suite Room Check-In)">Rp 500.000 (Suite Room Check-In)</option>
                  <option value="Tanpa Deposit">Tanpa Deposit (VIP Exemption)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-amber-900 mb-1">METODE PEMBAYARAN DEPOSIT</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-amber-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
                >
                  <option value="Cash / Tunai Resepsionis">Cash / Tunai Resepsionis</option>
                  <option value="Debit / QRIS Front Desk">Debit / QRIS Front Desk</option>
                  <option value="Credit Card Pre-Authorization">Credit Card Pre-Authorization</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-amber-900 mb-1">PENITIPAN FISIK KARTU IDENTITAS (KTP / PASPOR)</label>
              <select
                value={vaultSlot}
                onChange={(e) => setVaultSlot(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-amber-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
              >
                <option value="Slot #KTP-402">🗄️ KTP Fisik Dititipkan di Brankas Key Vault (Slot #KTP-402)</option>
                <option value="Slot #KTP-305">🗄️ KTP Fisik Dititipkan di Brankas Key Vault (Slot #KTP-305)</option>
                <option value="Slot #KTP-201">🗄️ KTP Fisik Dititipkan di Brankas Key Vault (Slot #KTP-201)</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">TANGGAL CHECK-IN</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">TANGGAL CHECK-OUT</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Footer Buttons */}
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
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan & Registrasi Tamu'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
