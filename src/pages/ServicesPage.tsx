import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Sparkles, Bed, ShoppingBag, Plus, Minus, Trash2, CheckCircle2, AlertCircle, Shirt, Flower2, Search, QrCode, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { QrisPaymentModal } from '../components/QrisPaymentModal';

interface HotelService {
  id: number;
  name: string;
  type: string; // LAUNDRY, SPA
  unit_price: number;
  unit: string;
  image_url: string;
}

interface CartItem {
  service: HotelService;
  quantity: number;
}

export const ServicesPage: React.FC = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<HotelService[]>([]);
  const [activeRooms, setActiveRooms] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'LAUNDRY' | 'SPA'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'CHARGE_TO_ROOM' | 'QRIS' | 'CASH'>('CHARGE_TO_ROOM');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);

  useEffect(() => {
    fetchServices();
    fetchRooms();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/v1/services');
      const data = await res.json();
      if (data && data.status === 'success' && Array.isArray(data.data)) {
        setServices(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/v1/rooms');
      const data = await res.json();
      if (data && data.status === 'success' && Array.isArray(data.data)) {
        const enriched = data.data.map((r: any) => ({
          ...r,
          guest_name: r.guest_name || 'Tamu In-House',
        }));
        setActiveRooms(enriched);
        if (enriched.length > 0) setSelectedRoomNumber(enriched[0].number);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addToCart = (service: HotelService) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.service.id === service.id);
      if (existing) {
        return prev.map((c) => (c.service.id === service.id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { service: service, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.service.id === id) {
            const qty = c.quantity + delta;
            return qty > 0 ? { ...c, quantity: qty } : null;
          }
          return c;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((c) => c.service.id !== id));
  };

  const subtotal = cart.reduce((acc, c) => acc + c.service.unit_price * c.quantity, 0);
  const tax = subtotal * 0.1; // 10% PB1 / Tax
  const grandTotal = subtotal + tax;

  const filteredServices = services.filter((s) => {
    if (activeTab !== 'ALL' && s.type !== activeTab) return false;
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const selectedRoomObj = activeRooms.find((r) => r.number === selectedRoomNumber);
  const guestNameForRoom = selectedRoomObj ? selectedRoomObj.guest_name || 'Tamu In-House' : 'Tamu Hotel';

  const executeOrderSubmit = async () => {
    setIsSubmitting(true);
    setSuccessMsg(null);

    const payload = {
      service_type: activeTab === 'ALL' ? 'LAUNDRY & SPA' : activeTab,
      room_number: paymentMethod === 'CHARGE_TO_ROOM' ? selectedRoomNumber : '',
      guest_name: paymentMethod === 'CHARGE_TO_ROOM' ? guestNameForRoom : 'Tamu Non-Inhouse',
      items_json: JSON.stringify(
        cart.map((c) => ({
          name: c.service.name,
          qty: c.quantity,
          unit: c.service.unit,
          price: c.service.unit_price,
          total: c.service.unit_price * c.quantity,
        }))
      ),
      subtotal: subtotal,
      tax: tax,
      grand_total: grandTotal,
      payment_method: paymentMethod,
      notes: notes,
      created_by: user ? user.name : 'Staf Layanan Hotel',
    };

    try {
      const res = await fetch('/api/v1/services/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data && data.status === 'success') {
        const msg =
          paymentMethod === 'CHARGE_TO_ROOM'
            ? `✅ Layanan ${data.data.order_number} (Rp ${grandTotal.toLocaleString('id-ID')}) BERHASIL DIBEBANKAN ke Folio Kamar ${selectedRoomNumber} (${guestNameForRoom})!`
            : `✅ Layanan ${data.data.order_number} (Rp ${grandTotal.toLocaleString('id-ID')}) LUNAS via ${paymentMethod}!`;

        setSuccessMsg(msg);
        setCart([]);
        setNotes('');
      } else {
        alert(data.message || 'Gagal memproses pesanan layanan.');
      }
    } catch (e) {
      alert('Terjadi kesalahan koneksi server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProcessOrder = () => {
    if (cart.length === 0) {
      alert('Keranjang pesanan layanan masih kosong!');
      return;
    }
    if (paymentMethod === 'CHARGE_TO_ROOM' && !selectedRoomNumber) {
      alert('Pilih nomor kamar untuk penagihan room charge!');
      return;
    }
    if (paymentMethod === 'QRIS') {
      setIsQrisModalOpen(true);
      return;
    }
    executeOrderSubmit();
  };

  return (
    <div className="flex-1 min-w-0 pb-12">
      <Header title="Layanan Tambahan (Laundry & Spa)" subtitle="Penagihan layanan cuci kilat, dry clean, & perawatan spa ke Room Folio" />

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Banner Top */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-extrabold text-[10px] uppercase tracking-wider">
              HOTEL EXTRA SERVICES BILLING
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">Laundry & Luxury Spa Service</h1>
            <p className="text-slate-300 text-xs font-medium mt-1">
              Petugas Aktif: <strong className="text-white">{user ? user.name : 'Staf Layanan'}</strong> ({user ? user.role : 'Staff'})
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-right">
            <p className="text-[10px] text-purple-200 font-bold uppercase">Folio Room Charge</p>
            <p className="text-xs font-black text-white">Direct Post to PostgreSQL DB</p>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border-2 border-emerald-500/30 text-emerald-800 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="text-xs font-extrabold">{successMsg}</span>
            </div>
            <button
              onClick={() => setSuccessMsg(null)}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-bold px-2 py-1 rounded-lg hover:bg-emerald-100 transition"
            >
              Tutup
            </button>
          </div>
        )}

        <QrisPaymentModal
          isOpen={isQrisModalOpen}
          amount={grandTotal}
          invoiceNumber={`SVC-${Date.now().toString().slice(-6)}`}
          customerName={user ? user.name : 'Tamu Hotel'}
          onClose={() => setIsQrisModalOpen(false)}
          onPaymentSuccess={() => executeOrderSubmit()}
        />

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Catalog Left */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  placeholder="Cari jenis layanan laundry atau spa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex gap-2">
                {[
                  { id: 'ALL', label: 'Semua Layanan', icon: Sparkles },
                  { id: 'LAUNDRY', label: '🧺 Laundry & Dry Clean', icon: Shirt },
                  { id: 'SPA', label: '💆‍♀️ Spa & Wellness', icon: Flower2 },
                ].map((t) => {
                  const Icon = t.icon;
                  const isActive = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id as any)}
                      className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs transition flex items-center gap-2 cursor-pointer ${
                        isActive
                          ? 'bg-purple-700 text-white shadow-md shadow-purple-700/30'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Service Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="flex gap-4">
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-20 h-20 rounded-2xl object-cover border border-slate-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-extrabold text-[9px] uppercase">
                        {service.type}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 mt-1 line-clamp-2">{service.name}</h4>
                      <p className="text-sm font-extrabold text-purple-700 mt-2">
                        Rp {service.unit_price.toLocaleString('id-ID')} <span className="text-xs font-semibold text-slate-400">/ {service.unit}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(service)}
                    className="w-full mt-4 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-2xl shadow transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-purple-300" />
                    <span>Tambah Ke Order</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Right */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xl space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Keranjang Layanan</h3>
                    <p className="text-slate-400 text-[11px] font-semibold">{cart.length} Item Terpilih</p>
                  </div>
                </div>
                {cart.length > 0 && (
                  <button onClick={() => setCart([])} className="text-xs text-rose-500 hover:text-rose-700 font-bold">
                    Kosongkan
                  </button>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <ShoppingBag className="w-12 h-12 mx-auto stroke-1 text-slate-300" />
                  <p className="text-xs font-semibold">Keranjang layanan masih kosong</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.service.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-xs font-black text-slate-800 truncate">{item.service.name}</p>
                        <p className="text-[11px] text-slate-500 font-semibold">
                          Rp {item.service.unit_price.toLocaleString('id-ID')} × {item.quantity} {item.service.unit}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-white rounded-xl border border-slate-200 p-0.5">
                          <button onClick={() => updateQuantity(item.service.id, -1)} className="p-1 hover:bg-slate-100 rounded-lg">
                            <Minus className="w-3 h-3 text-slate-600" />
                          </button>
                          <span className="w-6 text-center text-xs font-black text-slate-900">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.service.id, 1)} className="p-1 hover:bg-slate-100 rounded-lg">
                            <Plus className="w-3 h-3 text-slate-600" />
                          </button>
                        </div>
                        <button onClick={() => removeFromCart(item.service.id)} className="p-1.5 text-rose-500 hover:text-rose-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Payment Method */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">Metode Penagihan</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'CHARGE_TO_ROOM', label: 'Room Folio', icon: Bed },
                    { id: 'QRIS', label: 'QRIS', icon: QrCode },
                    { id: 'CASH', label: 'Tunai', icon: DollarSign },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSel = paymentMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-3 rounded-2xl border text-left transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          isSel ? 'border-purple-600 bg-purple-50 text-purple-700 font-black' : 'border-slate-200 text-slate-600 font-semibold hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-xs">{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                {paymentMethod === 'CHARGE_TO_ROOM' && (
                  <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200/80 space-y-2 mt-3">
                    <div className="flex items-center gap-1.5 text-purple-900 font-extrabold text-xs">
                      <AlertCircle className="w-4 h-4 text-purple-600" />
                      <span>Post to Room Folio Database</span>
                    </div>
                    <label className="text-[10px] font-bold text-purple-800 block">Pilih Kamar Terisi (Occupied):</label>
                    <select
                      value={selectedRoomNumber}
                      onChange={(e) => setSelectedRoomNumber(e.target.value)}
                      className="w-full p-2.5 bg-white border border-purple-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 cursor-pointer"
                    >
                      {activeRooms.length === 0 ? (
                        <option value="">Memuat daftar kamar terisi...</option>
                      ) : (
                        activeRooms.map((r) => (
                          <option key={r.id || r.number} value={r.number}>
                            Kamar {r.number} ({r.type}) - {r.guest_name || 'Tamu In-House'}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Catatan Khusus Layanan</label>
                <input
                  type="text"
                  placeholder="misal: Minta pewangi lavender / Cuci kilat selesai 4 jam"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-purple-600"
                />
              </div>

              {/* Summary */}
              <div className="p-4 bg-slate-50 rounded-2xl space-y-2 text-xs font-semibold text-slate-600 border border-slate-200/60">
                <div className="flex justify-between">
                  <span>Subtotal Layanan</span>
                  <span className="font-bold text-slate-900">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pajak (10%)</span>
                  <span>Rp {tax.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                  <span>Total Tagihan Layanan</span>
                  <span className="text-purple-700">Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <button
                disabled={cart.length === 0 || isSubmitting}
                onClick={handleProcessOrder}
                className="w-full py-4 bg-purple-700 hover:bg-purple-800 disabled:bg-slate-300 text-white font-black text-sm rounded-2xl shadow-lg shadow-purple-700/30 transition transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? <span>Memproses...</span> : <><CheckCircle2 className="w-5 h-5" /><span>{paymentMethod === 'CHARGE_TO_ROOM' ? 'Post ke Folio Kamar' : 'Proses Bayar Lunas'}</span></>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
