import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { AddMenuItemModal } from '../components/AddMenuItemModal';
import { EditMenuItemModal } from '../components/EditMenuItemModal';
import { QrisPaymentModal } from '../components/QrisPaymentModal';
import { Utensils, Coffee, IceCream, Bed, ShoppingBag, Plus, Minus, Trash2, CreditCard, QrCode, DollarSign, CheckCircle2, Search, AlertCircle, Edit, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image_url: string;
}

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export const PosPage: React.FC = () => {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeRooms, setActiveRooms] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'CHARGE_TO_ROOM' | 'QRIS' | 'CASH' | 'CARD'>('CHARGE_TO_ROOM');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string | null>(null);
  const [isAddMenuModalOpen, setIsAddMenuModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<any | null>(null);
  const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);

  useEffect(() => {
    fetchMenu();
    fetchRooms();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/v1/pos/menu');
      const data = await res.json();
      if (data && data.status === 'success' && Array.isArray(data.data)) {
        setMenuItems(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch menu:', err);
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
    } catch (err) {
      console.error('Failed to fetch rooms for POS:', err);
    }
  };

  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((c) => c.menuItem.id === item.id);
      if (existing) {
        return prevCart.map((c) => (c.menuItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prevCart, { menuItem: item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: number, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((c) => {
          if (c.menuItem.id === itemId) {
            const newQty = c.quantity + delta;
            return newQty > 0 ? { ...c, quantity: newQty } : null;
          }
          return c;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart((prevCart) => prevCart.filter((c) => c.menuItem.id !== itemId));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
  const serviceCharge = subtotal * 0.1; // 10% Service Charge
  const tax = subtotal * 0.1; // 10% PB1 Tax
  const grandTotal = subtotal + serviceCharge + tax;

  const filteredMenu = menuItems.filter((m) => {
    if (selectedCategory !== 'ALL' && m.category !== selectedCategory) return false;
    if (searchQuery && !m.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const selectedRoomObj = activeRooms.find((r) => r.number === selectedRoomNumber);
  const guestNameForRoom = selectedRoomObj ? selectedRoomObj.guest_name || 'Tamu In-House' : 'Tamu Hotel';

  const executeOrderSubmit = async () => {
    setIsSubmitting(true);
    setOrderSuccessMsg(null);

    const orderPayload = {
      room_number: paymentMethod === 'CHARGE_TO_ROOM' ? selectedRoomNumber : '',
      guest_name: paymentMethod === 'CHARGE_TO_ROOM' ? guestNameForRoom : 'Tamu Non-Inhouse',
      items_json: JSON.stringify(
        cart.map((c) => ({
          name: c.menuItem.name,
          qty: c.quantity,
          price: c.menuItem.price,
          total: c.menuItem.price * c.quantity,
        }))
      ),
      subtotal: subtotal,
      service_charge: serviceCharge,
      tax: tax,
      grand_total: grandTotal,
      payment_method: paymentMethod,
      created_by: user ? user.name : 'Kasir Restoran',
    };

    try {
      const res = await fetch('/api/v1/pos/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (data && data.status === 'success') {
        const msg =
          paymentMethod === 'CHARGE_TO_ROOM'
            ? `✅ Pesanan ${data.data.order_number} sebesar Rp ${grandTotal.toLocaleString('id-ID')} BERHASIL DIBEBANKAN ke Folio Kamar ${selectedRoomNumber} (${guestNameForRoom})!`
            : `✅ Pesanan ${data.data.order_number} sebesar Rp ${grandTotal.toLocaleString('id-ID')} LUNAS via ${paymentMethod}!`;

        setOrderSuccessMsg(msg);
        setCart([]);
      } else {
        alert(data.message || 'Gagal memproses pesanan POS.');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProcessOrder = () => {
    if (cart.length === 0) {
      alert('Keranjang pesanan masih kosong!');
      return;
    }

    if (paymentMethod === 'CHARGE_TO_ROOM' && !selectedRoomNumber) {
      alert('Pilih nomor kamar tempat penagihan room charge!');
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
      <Header title="POS Restoran & F&B" subtitle="Penagihan makanan & Room Charge ke Folio Kamar Hotel" />

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[10px] uppercase tracking-wider">
              HOTEL F&B POINT OF SALE
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">Restoran & In-Room Dining POS</h1>
            <p className="text-slate-300 text-xs font-medium mt-1">
              Kasir Aktif: <strong className="text-white">{user ? user.name : 'Kasir Restoran'}</strong> ({user ? user.role : 'Staff'})
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-right">
              <p className="text-[10px] text-amber-200 font-bold uppercase">Room Charge System</p>
              <p className="text-xs font-black text-white">Post Direct to Folio DB</p>
            </div>
          </div>
        </div>

        {/* Order Success Alert */}
        {orderSuccessMsg && (
          <div className="p-4 bg-emerald-50 border-2 border-emerald-500/30 text-emerald-800 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="text-xs font-extrabold">{orderSuccessMsg}</span>
            </div>
            <button
              onClick={() => setOrderSuccessMsg(null)}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-bold px-2 py-1 rounded-lg hover:bg-emerald-100 transition"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Modals for Master Menu CRUD */}
        <AddMenuItemModal
          isOpen={isAddMenuModalOpen}
          onClose={() => setIsAddMenuModalOpen(false)}
          onSuccess={() => fetchMenu()}
        />

        <EditMenuItemModal
          isOpen={!!editingMenuItem}
          item={editingMenuItem}
          onClose={() => setEditingMenuItem(null)}
          onSuccess={() => fetchMenu()}
        />

        <QrisPaymentModal
          isOpen={isQrisModalOpen}
          amount={grandTotal}
          invoiceNumber={`POS-${Date.now().toString().slice(-6)}`}
          customerName={user ? user.name : 'Tamu Hotel'}
          onClose={() => setIsQrisModalOpen(false)}
          onPaymentSuccess={() => executeOrderSubmit()}
        />

        {/* Main Grid: Menu Catalog vs Cart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Menu Catalog Section (8 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Search & Category Filter */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    placeholder="Cari menu makanan atau minuman..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#EF3F09]"
                  />
                </div>

                <button
                  onClick={() => setIsAddMenuModalOpen(true)}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-2xl shadow transition cursor-pointer flex items-center gap-1.5 flex-shrink-0"
                >
                  <PlusCircle className="w-4 h-4 text-amber-400" />
                  <span>+ Master Menu</span>
                </button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { id: 'ALL', label: 'Semua Menu', icon: Utensils },
                  { id: 'Makanan', label: 'Makanan Utama', icon: Utensils },
                  { id: 'Minuman', label: 'Minuman & Kopi', icon: Coffee },
                  { id: 'Dessert', label: 'Dessert', icon: IceCream },
                  { id: 'Room Service', label: 'In-Room Service', icon: Bed },
                ].map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-2xl font-extrabold text-xs transition flex items-center gap-2 flex-shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-[#EF3F09] text-white shadow-md shadow-[#EF3F09]/30'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredMenu.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-20 h-20 rounded-2xl object-cover border border-slate-100"
                      />
                      <button
                        onClick={() => setEditingMenuItem(item)}
                        className="absolute -top-1 -right-1 p-1 bg-white hover:bg-slate-100 text-slate-700 rounded-full shadow-md border border-slate-200 transition cursor-pointer"
                        title="Edit Master Menu"
                      >
                        <Edit className="w-3 h-3 text-[#EF3F09]" />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-extrabold text-[9px] uppercase">
                        {item.category}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 mt-1 line-clamp-2">{item.name}</h4>
                      <p className="text-sm font-extrabold text-[#EF3F09] mt-2">
                        Rp {item.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setEditingMenuItem(item)}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-2xl transition cursor-pointer flex items-center justify-center gap-1"
                      title="Edit Detail & Foto Menu"
                    >
                      <Edit className="w-3.5 h-3.5 text-[#EF3F09]" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => addToCart(item)}
                      className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-2xl shadow transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-400" />
                      <span>Tambah Ke Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart & Billing Section (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xl space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Keranjang Transaksi</h3>
                    <p className="text-slate-400 text-[11px] font-semibold">{cart.length} Jenis Item Terpilih</p>
                  </div>
                </div>
                {cart.length > 0 && (
                  <button
                    onClick={() => setCart([])}
                    className="text-xs text-rose-500 hover:text-rose-700 font-bold transition"
                  >
                    Kosongkan
                  </button>
                )}
              </div>

              {/* Cart Items List */}
              {cart.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <ShoppingBag className="w-12 h-12 mx-auto stroke-1 text-slate-300" />
                  <p className="text-xs font-semibold">Keranjang masih kosong</p>
                  <p className="text-[10px] text-slate-400">Pilih menu di sebelah kiri untuk membuat order</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.menuItem.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-xs font-black text-slate-800 truncate">{item.menuItem.name}</p>
                        <p className="text-[11px] text-slate-500 font-semibold">
                          Rp {item.menuItem.price.toLocaleString('id-ID')} × {item.quantity}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-white rounded-xl border border-slate-200 p-0.5">
                          <button
                            onClick={() => updateQuantity(item.menuItem.id, -1)}
                            className="p-1 hover:bg-slate-100 rounded-lg transition"
                          >
                            <Minus className="w-3 h-3 text-slate-600" />
                          </button>
                          <span className="w-6 text-center text-xs font-black text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.menuItem.id, 1)}
                            className="p-1 hover:bg-slate-100 rounded-lg transition"
                          >
                            <Plus className="w-3 h-3 text-slate-600" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.menuItem.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Payment Method Selector */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                  Metode Pembayaran
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'CHARGE_TO_ROOM', label: 'Charge to Room', icon: Bed },
                    { id: 'QRIS', label: 'QRIS Instant', icon: QrCode },
                    { id: 'CASH', label: 'Tunai / Cash', icon: DollarSign },
                    { id: 'CARD', label: 'Kartu Kredit', icon: CreditCard },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSel = paymentMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-3 rounded-2xl border text-left transition flex items-center gap-2 cursor-pointer ${
                          isSel
                            ? 'border-[#EF3F09] bg-rose-50/50 text-[#EF3F09] font-black'
                            : 'border-slate-200 text-slate-600 font-semibold hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs truncate">{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Charge to Room Selector */}
                {paymentMethod === 'CHARGE_TO_ROOM' && (
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 space-y-2 mt-3">
                    <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-xs">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Post to Room Folio Database</span>
                    </div>
                    <label className="text-[10px] font-bold text-amber-800 block">Pilih Kamar Terisi (Occupied):</label>
                    <select
                      value={selectedRoomNumber}
                      onChange={(e) => setSelectedRoomNumber(e.target.value)}
                      className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#EF3F09] cursor-pointer"
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

              {/* Price Calculation Summary */}
              <div className="p-4 bg-slate-50 rounded-2xl space-y-2 text-xs font-semibold text-slate-600 border border-slate-200/60">
                <div className="flex justify-between">
                  <span>Subtotal Makanan & Minuman</span>
                  <span className="font-bold text-slate-900">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Charge (10%)</span>
                  <span>Rp {serviceCharge.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pajak Restoran PB1 (10%)</span>
                  <span>Rp {tax.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                  <span>Total Tagihan F&B</span>
                  <span className="text-[#EF3F09]">Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Process Order Button */}
              <button
                disabled={cart.length === 0 || isSubmitting}
                onClick={handleProcessOrder}
                className="w-full py-4 bg-[#EF3F09] hover:bg-[#D63405] disabled:bg-slate-300 text-white font-black text-sm rounded-2xl shadow-lg shadow-[#EF3F09]/30 transition transform hover:-translate-y-0.5 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Memproses Transaksi...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{paymentMethod === 'CHARGE_TO_ROOM' ? 'Post ke Folio Kamar' : 'Proses Bayar Lunas'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
