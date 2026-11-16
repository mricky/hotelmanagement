import React, { useRef, useEffect } from 'react';
import { X, Printer, CheckCircle2, FileText, Building2 } from 'lucide-react';

interface TaxInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    code: string;
    guest: string;
    flag: string;
    contact: string;
    room: string;
    check_in: string;
    check_out: string;
    dates: string;
    total: string;
    channel: string;
  } | null;
}

export const TaxInvoiceModal: React.FC<TaxInvoiceModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

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

  if (!isOpen || !booking) return null;

  const invoiceNumber = `INV-TAX-${booking.code.replace(/[^0-9]/g, '') || '88102'}`;
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Calculate Tax & Service Charge breakdown (Room Rate Net + Service 10% + PB1 Tax 10%)
  const totalAmountNum = parseInt(booking.total.replace(/[^0-9]/g, '')) || 3200000;
  
  // Tax formula: Total = Net * 1.21 => Net = Total / 1.21
  const netAmount = Math.round(totalAmountNum / 1.21);
  const serviceCharge = Math.round(netAmount * 0.1);
  const pb1Tax = Math.round((netAmount + serviceCharge) * 0.1);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      onClick={onClose}
      className="printable-modal-overlay fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-6 print:p-0 print:bg-white print:static overflow-y-auto"
    >
      {/* Modal Container Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="printable-modal-card bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 print:max-h-none print:shadow-none print:border-none print:w-full print:max-w-none print:rounded-none"
      >
        
        {/* Sticky Action Header (Hidden when printing) */}
        <div className="p-4 md:p-5 bg-slate-900 text-white flex items-center justify-between sticky top-0 z-20 shrink-0 print:hidden border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-black text-lg shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Faktur Pajak PB1 & Official Guest Folio</h3>
              <p className="text-[11px] text-slate-400 font-semibold">Resmi PB1 (10%) & Service Charge (10%)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-[#EF3F09] hover:bg-orange-600 text-white font-extrabold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Faktur Pajak</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              title="Tutup (Esc)"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Tax Invoice Body */}
        <div ref={printRef} className="printable-receipt-body flex-1 overflow-y-auto p-6 md:p-8 space-y-6 text-slate-900 bg-white font-['Plus_Jakarta_Sans',sans-serif] print:overflow-visible">
          
          {/* Invoice Brand Header with NPWP */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#EF3F09] to-orange-600 flex items-center justify-center font-black text-white text-2xl shadow-md shrink-0">
                GH
              </div>
              <div>
                <h1 className="font-black text-lg text-slate-900 uppercase tracking-tight leading-tight">
                  Grand Horizon Resort & Suite
                </h1>
                <p className="text-[11px] text-slate-500 font-semibold">
                  PT GRAND HORIZON INTERNATIONAL
                </p>
                <p className="text-[11px] text-slate-600 font-bold">
                  NPWP / NPOPKD: <span className="text-slate-900 font-black">01.892.341.2-018.000</span>
                </p>
                <p className="text-[10px] text-slate-400 font-semibold">
                  Jl. Sunset Boulevard No. 88, Nusa Dua Resort, Bali 80363 | Tel: +62 (0361) 894-7700
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-900 rounded-lg text-[10px] font-black uppercase tracking-wider border border-blue-300">
                FAKTUR PAJAK PB1 (OFFICIAL INVOICE)
              </span>
              <p className="text-xs font-black text-slate-900 mt-1">No: {invoiceNumber}</p>
              <p className="text-[10px] text-slate-500 font-semibold">Tanggal: {currentDate}</p>
            </div>
          </div>

          {/* Guest & Billing Details Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tagihan Kepada (Billed To)</span>
              <p className="font-extrabold text-slate-900 text-sm">{booking.guest} ({booking.flag})</p>
              <p className="text-slate-500 font-semibold text-[11px]">{booking.contact}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Informasi Menginap</span>
              <p className="font-extrabold text-slate-900 text-sm">{booking.room}</p>
              <p className="text-slate-500 font-semibold text-[11px]">Channel: {booking.channel} | Res ID: {booking.code}</p>
            </div>

            <div className="col-span-2 pt-2 border-t border-slate-200/60 grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Tanggal Check-In</span>
                <span className="font-bold text-slate-800">{booking.check_in || '2026-08-30'} (14:00 WITA)</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Tanggal Check-Out</span>
                <span className="font-bold text-slate-800">{booking.check_out || '2026-09-02'} (12:00 WITA)</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Status Pembayaran</span>
                <span className="inline-flex items-center gap-1 font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  LUNAS (PAID FULL)
                </span>
              </div>
            </div>
          </div>

          {/* Itemized Folio Billing & Tax Breakdown Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-extrabold uppercase text-[10px]">
                  <th className="py-3 px-4">Deskripsi Layanan & Fasilitas</th>
                  <th className="py-3 px-4 text-center">Qty / Malam</th>
                  <th className="py-3 px-4 text-right">Harga Net Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold">
                <tr>
                  <td className="py-3 px-4">
                    <p className="font-extrabold text-slate-900">{booking.room} (Sewa Kamar Hotel)</p>
                    <p className="text-[11px] text-slate-500 font-medium">Periode: {booking.dates}</p>
                  </td>
                  <td className="py-3 px-4 text-center font-bold">1 Paket</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">
                    Rp {netAmount.toLocaleString('id-ID')}
                  </td>
                </tr>

                {/* Service Charge Row */}
                <tr className="bg-slate-50/50">
                  <td className="py-2.5 px-4 text-slate-700 font-bold" colSpan={2}>
                    Service Charge Biaya Layanan Hotel (10%)
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                    Rp {serviceCharge.toLocaleString('id-ID')}
                  </td>
                </tr>

                {/* PB1 Tax Row */}
                <tr className="bg-slate-50/50">
                  <td className="py-2.5 px-4 text-slate-700 font-bold" colSpan={2}>
                    Pajak Barang & Jasa Tertentu - PB1 / Pajak Hotel (10%)
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                    Rp {pb1Tax.toLocaleString('id-ID')}
                  </td>
                </tr>

                {/* Advance DP 10% Paid Row */}
                <tr className="bg-amber-50/60 text-amber-900 font-bold border-t border-slate-200">
                  <td className="py-2.5 px-4" colSpan={2}>
                    <span>(-) Uang Muka / DP 10% Advance Deposit (Prepaid at Booking)</span>
                  </td>
                  <td className="py-2.5 px-4 text-right text-amber-700 font-black">
                    -Rp {Math.round(totalAmountNum * 0.1).toLocaleString('id-ID')}
                  </td>
                </tr>

                {/* Settlement Paid at Check-In (90%) */}
                <tr className="bg-emerald-50/60 text-emerald-900 font-bold">
                  <td className="py-2.5 px-4" colSpan={2}>
                    <span>(-) Pelunasan Pembayaran Check-In (90% Paid at Arrival)</span>
                  </td>
                  <td className="py-2.5 px-4 text-right text-emerald-700 font-black">
                    -Rp {Math.round(totalAmountNum * 0.9).toLocaleString('id-ID')}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-slate-900 text-white font-black text-sm">
                  <td className="py-3.5 px-4 uppercase" colSpan={2}>
                    Sisa Tagihan Pelunasan (Balance Due Amount)
                  </td>
                  <td className="py-3.5 px-4 text-right text-emerald-400">
                    Rp 0 (LUNAS / PAID FULL)
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Official Tax Statement Note */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900 space-y-1">
            <p className="font-extrabold uppercase tracking-wider text-[10px]">
              Keterangan Resmi Perpajakan Daerah:
            </p>
            <p className="font-medium leading-relaxed">
              Faktur ini merupakan bukti pemungutan **Pajak Hotel PB1 (10%)** dan **Service Charge (10%)** yang sah sesuai Peraturan Daerah dan UU HKPD No. 1 Tahun 2022. Pembayaran telah dilunasi penuh.
            </p>
          </div>

          {/* Signature Block */}
          <div className="grid grid-cols-2 gap-8 pt-4">
            <div className="text-center space-y-12">
              <p className="text-xs font-bold text-slate-500 uppercase">Petugas Kasir & Finance</p>
              <div className="border-b border-slate-400 mx-6"></div>
              <p className="text-xs font-extrabold text-slate-900">Finance & Accounting Dept</p>
            </div>

            <div className="text-center space-y-12">
              <p className="text-xs font-bold text-slate-500 uppercase">Penerima Tagihan (Tamu)</p>
              <div className="border-b border-slate-400 mx-6"></div>
              <p className="text-xs font-extrabold text-slate-900">{booking.guest}</p>
            </div>
          </div>

        </div>

        {/* Sticky Action Footer (Hidden when printing) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0 print:hidden">
          <p className="text-[11px] text-slate-500 font-semibold">
            Tekan <kbd className="px-1.5 py-0.5 bg-slate-200 rounded font-mono text-[10px]">Esc</kbd> atau klik luar untuk menutup
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-extrabold text-xs hover:bg-slate-100 transition cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-[#EF3F09] hover:bg-orange-600 text-white font-extrabold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Faktur Pajak PB1</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
