import React, { useState, useEffect } from 'react';
import { X, UserPlus, CreditCard, Building2, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';

interface WalkInCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newBooking: any) => void;
}

export const WalkInCheckInModal: React.FC<WalkInCheckInModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [guestName, setGuestName] = useState('');
  const [nationality, setNationality] = useState<'WNI' | 'WNA'>('WNI');
  const [contact, setContact] = useState('');
  const [identityNo, setIdentityNo] = useState('');
  const [roomType, setRoomType] = useState('Standard Double');
  const [roomNumber, setRoomNumber] = useState('205');
  const [stayNights, setStayNights] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('QRIS / Prepayment');

  // Keyboard shortcut: Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Rate Math based on selected room
  let ratePerNight = 1600000;
  if (roomType === 'Deluxe King') ratePerNight = 1900000;
  if (roomType === 'Executive Suite') ratePerNight = 3200000;

  const roomSubtotal = ratePerNight * stayNights;
  const serviceCharge = Math.round(roomSubtotal * 0.1);
  const pb1Tax = Math.round((roomSubtotal + serviceCharge) * 0.1);
  const totalRoomFolio = roomSubtotal + serviceCharge + pb1Tax;
  const securityDeposit = 500000;
  const grandTotalPayment = totalRoomFolio + securityDeposit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !contact) return;

    const resCode = `#RES-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBookingData = {
      id: Date.now(),
      code: resCode,
      guest: guestName,
      flag: nationality === 'WNI' ? '🇲🇨 WNI' : '🌏 WNA',
      contact: contact,
      room: `${roomType} ${roomNumber}`,
      check_in: '2026-08-30',
      check_out: '2026-08-31',
      dates: `30 Aug - 31 Aug (${stayNights} Malam)`,
      created: 'Walk-In Front Desk',
      created_time: 'Baru saja (Walk-In Direct)',
      updated: 'System Front Desk (Walk-In Auto)',
      updated_time: 'Check-In (100% Prepayment Lunas)',
      status: 'Checked In',
      statusBg: 'bg-purple-100 text-purple-900 border border-purple-300 font-extrabold',
      total: `Rp ${totalRoomFolio.toLocaleString('id-ID')}`,
      actionText: 'Check Out',
      channel: 'Walk-In',
    };

    onSuccess(newBookingData);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-6 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 font-['Plus_Jakarta_Sans',sans-serif]"
      >
        {/* Modal Action Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between sticky top-0 z-20 shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-black text-lg shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Registrasi Walk-In Guest Check-In</h3>
              <p className="text-[11px] text-slate-400 font-semibold">Prepayment 100% di Muka + Deposit Jaminan</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 text-slate-900">
          
          {/* Section 1: Guest Identity */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
              <UserPlus className="w-4 h-4 text-purple-600" />
              1. Identitas Tamu Walk-In (Guest Information)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Nama Lengkap Tamu *</label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Contoh: Bpk. Hendra Wijaya"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-black focus:outline-none focus:border-[#EF3F09] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Kewarganegaraan *</label>
                <select
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value as 'WNI' | 'WNA')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-black focus:outline-none focus:border-[#EF3F09] cursor-pointer"
                >
                  <option value="WNI">🇲🇨 WNI (Warga Negara Indonesia)</option>
                  <option value="WNA">🌏 WNA (Foreigner / International)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">No. KTP / Paspor / Identitas</label>
                <input
                  type="text"
                  value={identityNo}
                  onChange={(e) => setIdentityNo(e.target.value)}
                  placeholder="357812098270001"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#EF3F09]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Kontak No. HP / WhatsApp *</label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="hendra@gmail.com / 0812-9988-7711"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#EF3F09]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Room Selection */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
              <Building2 className="w-4 h-4 text-purple-600" />
              2. Pemilihan Kamar Ready & Durasi Menginap
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Tipe Kamar</label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-black focus:outline-none focus:border-[#EF3F09] cursor-pointer"
                >
                  <option value="Standard Double">Standard Double (Rp 1.600.000 / n)</option>
                  <option value="Deluxe King">Deluxe King (Rp 1.900.000 / n)</option>
                  <option value="Executive Suite">Executive Suite (Rp 3.200.000 / n)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">No. Kamar Ready</label>
                <select
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-black focus:outline-none focus:border-[#EF3F09] cursor-pointer"
                >
                  <option value="205">Kamar 205 (Clean Ready)</option>
                  <option value="301">Kamar 301 (Clean Ready)</option>
                  <option value="305">Kamar 305 (Clean Ready)</option>
                  <option value="402">Kamar 402 (Clean Ready)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Durasi (Malam)</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={stayNights}
                  onChange={(e) => setStayNights(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-black focus:outline-none focus:border-[#EF3F09]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Financial Prepayment Math */}
          <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-black text-purple-900 border-b border-purple-200 pb-2">
              <span>Rincian Prepayment Walk-In (100% Paid di Muka)</span>
              <span className="px-2.5 py-0.5 rounded bg-purple-200 text-purple-900 text-[10px]">
                Inc. PB1 10% & Service 10%
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600 font-semibold">
                <span>Subtotal Kamar ({stayNights} Malam x Rp {ratePerNight.toLocaleString('id-ID')}):</span>
                <span className="font-bold text-slate-900">Rp {roomSubtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-semibold">
                <span>Service Charge Biaya Layanan Hotel (10%):</span>
                <span className="font-bold text-slate-900">Rp {serviceCharge.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-semibold">
                <span>Pajak Daerah PB1 / Pajak Hotel (10%):</span>
                <span className="font-bold text-slate-900">Rp {pb1Tax.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-semibold pt-1 border-t border-purple-200">
                <span>Security Deposit Jaminan (Dikembalikan saat Check-Out):</span>
                <span className="font-bold text-emerald-700">+Rp {securityDeposit.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-purple-950 pt-2 border-t border-purple-300">
                <span>Total Pembayaran Diterima di Counter:</span>
                <span className="text-[#EF3F09]">Rp {grandTotalPayment.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Payment Method */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Metode Pembayaran di Counter *</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-black focus:outline-none focus:border-[#EF3F09] cursor-pointer"
            >
              <option value="QRIS / Prepayment">QRIS Instant Prepayment</option>
              <option value="Tunai / Cash Counter">Tunai / Cash Counter</option>
              <option value="EDC Kartu Kredit">EDC Kartu Kredit (Pre-Auth)</option>
              <option value="EDC Kartu Debit">EDC Kartu Debit</option>
            </select>
          </div>

          {/* Modal Submit Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Proses Walk-In Check-In & Terbitkan Faktur</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
