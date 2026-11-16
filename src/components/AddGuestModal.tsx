import React, { useState } from 'react';
import { X, UserCheck, Check } from 'lucide-react';

interface AddGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddGuestModal: React.FC<AddGuestModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [identity, setIdentity] = useState('');
  const [phone, setPhone] = useState('+62 812-3456-7890');
  const [email, setEmail] = useState('');
  const [nationality, setNationality] = useState('🇮🇩 WNI');
  const [tier, setTier] = useState('🥇 GOLD MEMBER');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name,
        identity,
        phone,
        email,
        nationality,
        total_stays: 1,
        total_spend: 'Rp 2.500.000',
        tier,
      };

      const res = await fetch('/api/v1/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data && data.status === 'success') {
        onSuccess();
        onClose();
        setName('');
        setIdentity('');
      }
    } catch (err) {
      console.error('Failed to create guest:', err);
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
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Daftar Profil Tamu CRM Baru</h3>
              <p className="text-slate-400 text-xs">Simpan NIK/Paspor & profil tamu baru ke database</p>
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
              Nama Lengkap Tamu
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Alexander Wright"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EF3F09]/30 focus:border-[#EF3F09] transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nomor Identitas (KTP / Paspor)
              </label>
              <input
                type="text"
                required
                placeholder="3273019827361928 (KTP)"
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EF3F09]/30 focus:border-[#EF3F09] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kewarganegaraan
              </label>
              <select
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EF3F09]/30 focus:border-[#EF3F09] transition"
              >
                <option value="🇮🇩 WNI">🇮🇩 WNI (Indonesia)</option>
                <option value="🇬BWNA (UK)">🇬🇧 WNA (United Kingdom)</option>
                <option value="🇸🇬 WNA (SG)">🇸🇬 WNA (Singapore)</option>
                <option value="🇺🇸 WNA (US)">🇺🇸 WNA (United States)</option>
                <option value="🇦🇺 WNA (AU)">🇦🇺 WNA (Australia)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nomor Telepon / WhatsApp
              </label>
              <input
                type="text"
                required
                placeholder="+62 812-9988-7711"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EF3F09]/30 focus:border-[#EF3F09] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="guest@horizon.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EF3F09]/30 focus:border-[#EF3F09] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tier Keanggotaan Loyalty
            </label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EF3F09]/30 focus:border-[#EF3F09] transition"
            >
              <option value="💎 VIP DIAMOND">💎 VIP DIAMOND</option>
              <option value="🥇 GOLD MEMBER">🥇 GOLD MEMBER</option>
              <option value="🥈 SILVER MEMBER">🥈 SILVER MEMBER</option>
              <option value="🥉 BRONZE MEMBER">🥉 BRONZE MEMBER</option>
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
              <span>{isSubmitting ? 'Memproses...' : 'Simpan Profil Tamu'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
