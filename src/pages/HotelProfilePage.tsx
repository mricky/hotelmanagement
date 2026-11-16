import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { 
  Building2, MapPin, Clock, Landmark, Sparkles, Save, CheckCircle2, 
  Globe, Phone, Mail, FileText, AlertCircle, Shield, Image, Star, Award, Wifi, DollarSign
} from 'lucide-react';

interface HotelProfile {
  id?: number;
  name: string;
  property_type: string;
  star_rating: number;
  tagline: string;
  logo_url: string;
  banner_url: string;
  established_year: number;
  address: string;
  city: string;
  province: string;
  country: string;
  postal_code: string;
  phone: string;
  whatsapp: string;
  email: string;
  reservation_email: string;
  website: string;
  maps_url: string;
  check_in_time: string;
  check_out_time: string;
  currency: string;
  timezone: string;
  deposit_policy: string;
  cancellation_policy: string;
  pet_policy: string;
  tax_rate: number;
  service_charge_rate: number;
  tax_id: string;
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
  amenities: string;
  late_checkout_grace_time?: string;
  late_checkout_halfday_pct?: number;
  late_checkout_fullday_time?: string;
  late_checkout_fullday_pct?: number;
  updated_by?: string;
  updated_at?: string;
}

const DEFAULT_AMENITIES_LIST = [
  'Infinity Pool', 'Luxury Spa & Wellness', 'Fitness Center 24/7',
  'Private Beach Access', 'Fine Dining Restaurant', 'Helipad Access',
  'Meeting & Ballroom', 'Free Wi-Fi 6', 'Airport Transfer Service',
  'Valet Parking', 'Kids Club & Playground', 'Executive Lounge',
  'Rooftop Sky Bar', '24/7 Room Service', 'EV Charging Station'
];

export const HotelProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'location' | 'policies' | 'finance' | 'amenities'>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<HotelProfile>({
    name: 'Grand Horizon Resort & Suite',
    property_type: '5-Star Luxury Beachfront Resort',
    star_rating: 5,
    tagline: 'Experience Unmatched Luxury & World-Class Hospitality',
    logo_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80',
    banner_url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    established_year: 2018,
    address: 'Jl. Sunset Boulevard No. 88, Kawasan Nusa Dua Resort',
    city: 'Kabupaten Badung',
    province: 'Bali',
    country: 'Indonesia 🇮🇩',
    postal_code: '80363',
    phone: '+62 (0361) 894-7700',
    whatsapp: '+62 811-9988-7700',
    email: 'info@grandhorizon.com',
    reservation_email: 'reservation@grandhorizon.com',
    website: 'https://www.grandhorizon.com',
    maps_url: 'https://maps.google.com/?q=-8.796,115.231',
    check_in_time: '14:00 WITA',
    check_out_time: '12:00 WITA',
    currency: 'IDR (Rp)',
    timezone: 'Asia/Makassar (WITA)',
    deposit_policy: 'Wajib deposit jaminan sebesar Rp 500.000 / malam via Tunai, Kartu Kredit, atau QRIS saat Check-In.',
    cancellation_policy: 'Pembatalan gratis hingga 48 jam sebelum tanggal check-in. Pembatalan H-1 dikenakan biaya 1 malam.',
    pet_policy: 'Dilarang membawa hewan peliharaan (Non-Pet Friendly Property).',
    tax_rate: 10,
    service_charge_rate: 10,
    tax_id: '01.892.341.2-018.000 (NPWP)',
    bank_name: 'Bank Mandiri (Persero) Tbk',
    bank_account_name: 'PT GRAND HORIZON INTERNATIONAL',
    bank_account_number: '145-00-998822-11',
    amenities: 'Infinity Pool,Luxury Spa & Wellness,Fitness Center 24/7,Private Beach Access,Fine Dining Restaurant,Helipad Access,Meeting & Ballroom,Free Wi-Fi 6,Airport Transfer Service',
    late_checkout_grace_time: '13:00',
    late_checkout_halfday_pct: 50,
    late_checkout_fullday_time: '18:00',
    late_checkout_fullday_pct: 100,
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/hotel-profile');
      const json = await res.json();
      if (res.ok && json.status === 'success' && json.data) {
        setFormData(json.data);
      }
    } catch (err) {
      console.error('Failed to load hotel profile', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (field: keyof HotelProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    const currentList = formData.amenities ? formData.amenities.split(',').map((s) => s.trim()) : [];
    let updated: string[];
    if (currentList.includes(amenity)) {
      updated = currentList.filter((item) => item !== amenity);
    } else {
      updated = [...currentList, amenity];
    }
    handleChange('amenities', updated.join(','));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToastMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/v1/hotel-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();

      if (res.ok && json.status === 'success') {
        setToastMessage('Profil Hotel & Konfigurasi Properti berhasil diperbarui!');
        if (json.data) setFormData(json.data);
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        setErrorMessage(json.message || 'Gagal memperbarui profil hotel.');
      }
    } catch (err) {
      setErrorMessage('Gagal terhubung ke server.');
    } finally {
      setSaving(false);
    }
  };

  const selectedAmenities = formData.amenities ? formData.amenities.split(',').map((s) => s.trim()) : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      <Header
        title="Profil & Konfigurasi Properti Hotel"
        subtitle="Manajemen identitas resmi, alamat, kebijakan check-in/out, pajak PB1, dan fasilitas properti PMS"
      />

      <div className="max-w-7xl mx-auto px-6 pt-6 space-y-6">
        
        {/* Banner Preview & Identity Card */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl">
          <div className="h-44 md:h-56 relative overflow-hidden">
            <img
              src={formData.banner_url || "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80"}
              alt="Hotel Banner"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          </div>

          <div className="p-6 md:p-8 -mt-16 relative z-10 flex flex-wrap items-end justify-between gap-6">
            <div className="flex items-end gap-5">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-slate-900 border-4 border-slate-950 overflow-hidden shadow-2xl shrink-0">
                <img
                  src={formData.logo_url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80"}
                  alt="Hotel Logo"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1 text-white">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full bg-[#EF3F09]/20 text-[#EF3F09] border border-[#EF3F09]/30 text-[10px] font-black uppercase tracking-wider">
                    {formData.property_type || '5-Star Luxury Resort'}
                  </span>
                  <div className="flex items-center text-amber-400">
                    {[...Array(formData.star_rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight">{formData.name}</h1>
                <p className="text-xs text-slate-300 font-medium italic">{formData.tagline}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#EF3F09] to-orange-600 text-white font-extrabold text-xs shadow-lg shadow-[#EF3F09]/30 hover:brightness-110 active:scale-[0.99] transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan Profil'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Alert */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-extrabold flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-800 text-xs font-extrabold flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'general'
                ? 'bg-slate-900 text-white shadow'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>1. Identitas & Profil Utama</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('location')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'location'
                ? 'bg-slate-900 text-white shadow'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>2. Lokasi & Kontak Operasional</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('policies')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'policies'
                ? 'bg-slate-900 text-white shadow'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>3. Kebijakan & Check-In/Out</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('finance')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'finance'
                ? 'bg-slate-900 text-white shadow'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>4. Pajak PB1 & Rekening Bank</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('amenities')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'amenities'
                ? 'bg-slate-900 text-white shadow'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>5. Fasilitas Properti ({selectedAmenities.length})</span>
          </button>
        </div>

        {/* Tab Contents Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm space-y-6">
          
          {/* TAB 1: IDENTITAS & PROFIL UTAMA */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#EF3F09]" />
                  Informasi & Identitas Properti Hotel
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Atur nama resmi, klasifikasi bintang, slogan, dan link aset media visual properti.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Nama Resmi Hotel / Resort *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Tipe Kategori Properti *
                  </label>
                  <select
                    value={formData.property_type}
                    onChange={(e) => handleChange('property_type', e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition cursor-pointer"
                  >
                    <option value="5-Star Luxury Beachfront Resort">5-Star Luxury Beachfront Resort</option>
                    <option value="4-Star Deluxe City Hotel">4-Star Deluxe City Hotel</option>
                    <option value="3-Star Standard Hotel">3-Star Standard Hotel</option>
                    <option value="Boutique & Heritage Hotel">Boutique & Heritage Hotel</option>
                    <option value="Private Luxury Villa & Suites">Private Luxury Villa & Suites</option>
                    <option value="Business & Convention Hotel">Business & Convention Hotel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Klasifikasi Bintang (Star Rating 1-5) *
                  </label>
                  <select
                    value={formData.star_rating}
                    onChange={(e) => handleChange('star_rating', parseInt(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition cursor-pointer"
                  >
                    <option value={5}>5 Bintang (Luxury / Bintang Lima)</option>
                    <option value={4}>4 Bintang (Deluxe Hotel)</option>
                    <option value={3}>3 Bintang (Standard Hotel)</option>
                    <option value={2}>2 Bintang (Economy Hotel)</option>
                    <option value={1}>1 Bintang (Budget Guest House)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Tahun Berdiri / Didirikan
                  </label>
                  <input
                    type="number"
                    value={formData.established_year}
                    onChange={(e) => handleChange('established_year', parseInt(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Tagline / Slogan Hotel
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => handleChange('tagline', e.target.value)}
                    placeholder="e.g. Experience Unmatched Luxury & World-Class Hospitality"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    URL Logo Properti (Image Link)
                  </label>
                  <input
                    type="url"
                    value={formData.logo_url}
                    onChange={(e) => handleChange('logo_url', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-bold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    URL Banner Utama (Hero Image Link)
                  </label>
                  <input
                    type="url"
                    value={formData.banner_url}
                    onChange={(e) => handleChange('banner_url', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-bold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LOKASI & KONTAK OPERASIONAL */}
          {activeTab === 'location' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  Alamat Fisik & Kontak Operasional Hotel
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Informasi alamat untuk bukti registrasi tamu (Reg Card), invoice folio, dan kontak layanan pelanggan.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Alamat Lengkap Jalan / Kompleks *
                  </label>
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-900 font-bold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Kota / Kabupaten *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Provinsi & Kode Pos
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Provinsi"
                      value={formData.province}
                      onChange={(e) => handleChange('province', e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-bold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition"
                    />
                    <input
                      type="text"
                      placeholder="Kode Pos"
                      value={formData.postal_code}
                      onChange={(e) => handleChange('postal_code', e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-bold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    No. Telepon Front Desk *
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    No. WhatsApp Service CS
                  </label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Email Informasi Umum *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Email Khusus Departemen Reservasi
                  </label>
                  <input
                    type="email"
                    value={formData.reservation_email}
                    onChange={(e) => handleChange('reservation_email', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Website Resmi Properti
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-bold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Google Maps Link / Lokasi
                  </label>
                  <input
                    type="url"
                    value={formData.maps_url}
                    onChange={(e) => handleChange('maps_url', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-bold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KEBIJAKAN & WAKTU */}
          {activeTab === 'policies' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  Kebijakan Operasional & Waktu Check-In/Out
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Atur jam resmi check-in/out, kebijakan deposit jaminan, dan aturan pembatalan kamar.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Waktu Standard Check-In *
                  </label>
                  <select
                    value={formData.check_in_time}
                    onChange={(e) => handleChange('check_in_time', e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition cursor-pointer"
                  >
                    <option value="14:00 WITA">14:00 WITA (Default Standard)</option>
                    <option value="14:00 WIB">14:00 WIB</option>
                    <option value="15:00 WITA">15:00 WITA</option>
                    <option value="13:00 WITA">13:00 WITA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Waktu Standard Check-Out *
                  </label>
                  <select
                    value={formData.check_out_time}
                    onChange={(e) => handleChange('check_out_time', e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition cursor-pointer"
                  >
                    <option value="12:00 WITA">12:00 WITA (Default Standard)</option>
                    <option value="12:00 WIB">12:00 WIB</option>
                    <option value="11:00 WITA">11:00 WITA</option>
                    <option value="13:00 WITA">13:00 WITA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Mata Uang Default PMS
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition cursor-pointer"
                  >
                    <option value="IDR (Rp)">IDR (Rp) - Indonesian Rupiah</option>
                    <option value="USD ($)">USD ($) - United States Dollar</option>
                    <option value="EUR (€)">EUR (€) - Euro</option>
                    <option value="SGD (S$)">SGD (S$) - Singapore Dollar</option>
                    <option value="AUD (A$)">AUD (A$) - Australian Dollar</option>
                    <option value="GBP (£)">GBP (£) - British Pound Sterling</option>
                    <option value="JPY (¥)">JPY (¥) - Japanese Yen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Zona Waktu Properti
                  </label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => handleChange('timezone', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition cursor-pointer"
                  >
                    <option value="Asia/Makassar (WITA)">Asia/Makassar (WITA - UTC+8)</option>
                    <option value="Asia/Jakarta (WIB)">Asia/Jakarta (WIB - UTC+7)</option>
                    <option value="Asia/Jayapura (WIT)">Asia/Jayapura (WIT - UTC+9)</option>
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                  </select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                      Kebijakan Deposit & Jaminan Tamu
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400">Pilih Preset Standard:</span>
                      <select
                        onChange={(e) => {
                          if (e.target.value) handleChange('deposit_policy', e.target.value);
                        }}
                        className="bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1 text-[11px] font-extrabold text-slate-700 focus:outline-none cursor-pointer"
                      >
                        <option value="">-- Pilih Template Deposit --</option>
                        <option value="Deposit jaminan Rp 500.000 / malam via Tunai, QRIS, atau Pre-Auth Kartu Kredit. Dikembalikan penuh saat Check-Out jika tidak ada kerusakan.">
                          Rp 500.000 / malam (Standard Hotel)
                        </option>
                        <option value="Deposit jaminan Rp 1.000.000 / malam untuk tipe Executive Suite & Villa. Dikembalikan penuh saat Check-Out.">
                          Rp 1.000.000 / malam (Luxury / Suite)
                        </option>
                        <option value="Wajib pembayaran deposit sebesar 1 malam pertama sebelum konfirmasi check-in.">
                          Deposit 1 Malam Pertama
                        </option>
                        <option value="Bebas deposit jaminan (No Deposit Required). Semua biaya ekstra dilunasi langsung saat transaksi.">
                          Tanpa Deposit (No Deposit Required)
                        </option>
                      </select>
                    </div>
                  </div>
                  <textarea
                    rows={2}
                    value={formData.deposit_policy}
                    onChange={(e) => handleChange('deposit_policy', e.target.value)}
                    placeholder="Contoh: Deposit jaminan Rp 500.000 / malam dikembalikan penuh saat check-out..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-900 font-bold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition resize-none"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                      Kebijakan Pembatalan Reservasi (Cancellation Policy)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400">Pilih Preset Standard:</span>
                      <select
                        onChange={(e) => {
                          if (e.target.value) handleChange('cancellation_policy', e.target.value);
                        }}
                        className="bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1 text-[11px] font-extrabold text-slate-700 focus:outline-none cursor-pointer"
                      >
                        <option value="">-- Pilih Template Pembatalan --</option>
                        <option value="Pembatalan GRATIS s/d 24 jam sebelum waktu check-in (14:00). Pembatalan pada hari-H dikenakan denda 1 malam.">
                          Flexible 24 Jam (Gratis Batal H-1)
                        </option>
                        <option value="Pembatalan GRATIS s/d 48 jam sebelum tanggal check-in. Pembatalan dalam 48 jam dikenakan biaya 100% dari total booking.">
                          Flexible 48 Jam (Gratis Batal H-2)
                        </option>
                        <option value="Non-Refundable. Reservasi bersifat final dan tidak dapat dibatalkan, diubah tanggal, atau diuangkan kembali.">
                          Non-Refundable (Tidak Bisa Batal)
                        </option>
                        <option value="Pembatalan GRATIS s/d 7 hari sebelum check-in. Pembatalan kurang dari 7 hari dikenakan denda 50% dari total booking.">
                          Moderate 7 Hari (Gratis Batal H-7)
                        </option>
                      </select>
                    </div>
                  </div>
                  <textarea
                    rows={2}
                    value={formData.cancellation_policy}
                    onChange={(e) => handleChange('cancellation_policy', e.target.value)}
                    placeholder="Contoh: Pembatalan gratis s/d 24 jam sebelum check-in..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-900 font-bold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition resize-none"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                    Kebijakan Hewan Peliharaan (Pet Policy)
                  </label>
                  <select
                    value={formData.pet_policy}
                    onChange={(e) => handleChange('pet_policy', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition cursor-pointer"
                  >
                    <option value="Dilarang membawa hewan peliharaan (Non-Pet Friendly Property).">Dilarang membawa hewan peliharaan (Non-Pet Friendly)</option>
                    <option value="Diperbolehkan membawa hewan peliharaan (Pet Friendly Property).">Diperbolehkan membawa hewan peliharaan (Pet Friendly)</option>
                    <option value="Hewan peliharaan kecil saja (Max 10kg).">Hewan peliharaan kecil saja (Max 10kg)</option>
                  </select>
                </div>

                {/* Late Check-Out Fee Rules Section Card */}
                <div className="md:col-span-2 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-4">
                  <div className="flex items-center justify-between border-b border-amber-500/10 pb-3">
                    <div>
                      <h4 className="text-sm font-black text-amber-900 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600" />
                        Konfigurasi Denda Late Check-Out (Overtime Rules)
                      </h4>
                      <p className="text-xs text-amber-700 font-medium">
                        Atur batas toleransi (grace period) dan perhitungan persentase denda keterlambatan check-out tamu.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-[10px] font-black uppercase">
                      Auto-Calculated in PMS
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[11px] font-extrabold text-amber-900 mb-1">
                        Batas Grace Period (Gratis)
                      </label>
                      <input
                        type="text"
                        value={formData.late_checkout_grace_time || '13:00'}
                        onChange={(e) => handleChange('late_checkout_grace_time', e.target.value)}
                        placeholder="13:00"
                        className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-black text-amber-900 focus:outline-none focus:border-amber-500"
                      />
                      <span className="text-[10px] text-amber-600 font-semibold block mt-1">S/d jam ini = Rp 0 Charge</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold text-amber-900 mb-1">
                        Half-Day Denda (%)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={formData.late_checkout_halfday_pct || 50}
                          onChange={(e) => handleChange('late_checkout_halfday_pct', parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-amber-200 rounded-xl pl-3 pr-7 py-2 text-xs font-black text-amber-900 focus:outline-none focus:border-amber-500"
                        />
                        <span className="absolute right-3 top-2 text-xs font-black text-amber-500">%</span>
                      </div>
                      <span className="text-[10px] text-amber-600 font-semibold block mt-1">13:01 s/d 18:00 (Tarif Kamar)</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold text-amber-900 mb-1">
                        Batas Full-Day Cutoff
                      </label>
                      <input
                        type="text"
                        value={formData.late_checkout_fullday_time || '18:00'}
                        onChange={(e) => handleChange('late_checkout_fullday_time', e.target.value)}
                        placeholder="18:00"
                        className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-black text-amber-900 focus:outline-none focus:border-amber-500"
                      />
                      <span className="text-[10px] text-amber-600 font-semibold block mt-1">Setelah jam ini = Charge Full</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold text-amber-900 mb-1">
                        Full-Day Denda (%)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={formData.late_checkout_fullday_pct || 100}
                          onChange={(e) => handleChange('late_checkout_fullday_pct', parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-amber-200 rounded-xl pl-3 pr-7 py-2 text-xs font-black text-amber-900 focus:outline-none focus:border-amber-500"
                        />
                        <span className="absolute right-3 top-2 text-xs font-black text-amber-500">%</span>
                      </div>
                      <span className="text-[10px] text-amber-600 font-semibold block mt-1">&gt; 18:00 (Tarif 1 Malam)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PAJAK & REKENING BANK */}
          {activeTab === 'finance' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-emerald-600" />
                  Perpajakan PB1, Service Charge & Rekening Bank
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Konfigurasi tarif pajak pemerintah (PB1), persentase service charge folio, serta nomor rekening bank pembayaran.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Pajak Pemerintah / PB1 (%) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={formData.tax_rate}
                      onChange={(e) => handleChange('tax_rate', parseFloat(e.target.value) || 0)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-8 py-3 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition"
                    />
                    <span className="absolute right-4 top-3 text-xs font-black text-slate-400">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Service Charge Folio (%) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={formData.service_charge_rate}
                      onChange={(e) => handleChange('service_charge_rate', parseFloat(e.target.value) || 0)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-8 py-3 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition"
                    />
                    <span className="absolute right-4 top-3 text-xs font-black text-slate-400">%</span>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Nomor NPWP Properti / Tax ID
                  </label>
                  <input
                    type="text"
                    value={formData.tax_id}
                    onChange={(e) => handleChange('tax_id', e.target.value)}
                    placeholder="e.g. 01.892.341.2-018.000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Nama Bank Pembayaran
                  </label>
                  <select
                    value={formData.bank_name}
                    onChange={(e) => handleChange('bank_name', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition cursor-pointer"
                  >
                    <option value="Bank Mandiri (Persero) Tbk">Bank Mandiri (Persero) Tbk</option>
                    <option value="Bank Central Asia (BCA)">Bank Central Asia (BCA)</option>
                    <option value="Bank Rakyat Indonesia (BRI)">Bank Rakyat Indonesia (BRI)</option>
                    <option value="Bank Negara Indonesia (BNI)">Bank Negara Indonesia (BNI)</option>
                    <option value="Bank Syariah Indonesia (BSI)">Bank Syariah Indonesia (BSI)</option>
                    <option value="Bank CIMB Niaga">Bank CIMB Niaga</option>
                    <option value="Bank Permata">Bank Permata</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Nomor Rekening Bank
                  </label>
                  <input
                    type="text"
                    value={formData.bank_account_number}
                    onChange={(e) => handleChange('bank_account_number', e.target.value)}
                    placeholder="e.g. 145-00-998822-11"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Nama Pemilik Rekening (Account Name)
                  </label>
                  <input
                    type="text"
                    value={formData.bank_account_name}
                    onChange={(e) => handleChange('bank_account_name', e.target.value)}
                    placeholder="e.g. PT GRAND HORIZON INTERNATIONAL"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-[#EF3F09] focus:bg-white transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FASILITAS PROPERTI (AMENITIES) */}
          {activeTab === 'amenities' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  Daftar Fasilitas Utama (Property Amenities)
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Pilih fasilitas resmi yang tersedia di properti untuk ditampilkan pada OTA Channel & website resmi.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {DEFAULT_AMENITIES_LIST.map((item) => {
                  const isChecked = selectedAmenities.includes(item);
                  return (
                    <div
                      key={item}
                      onClick={() => toggleAmenity(item)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between select-none ${
                        isChecked
                          ? 'bg-[#EF3F09]/10 border-[#EF3F09]/40 text-slate-900 font-extrabold shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 font-bold hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xs">{item}</span>
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                          isChecked
                            ? 'bg-[#EF3F09] border-[#EF3F09] text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-400 font-semibold">
              Terakhir diperbarui oleh: <span className="text-slate-700 font-bold">{formData.updated_by || 'System Administrator'}</span>
            </p>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#EF3F09] to-orange-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#EF3F09]/30 hover:brightness-110 active:scale-[0.99] transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Menyimpan...' : 'Simpan Profil Hotel'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
