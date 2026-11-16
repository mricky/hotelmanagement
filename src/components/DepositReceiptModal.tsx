import React, { useRef, useEffect } from 'react';
import { X, Printer, CheckCircle2 } from 'lucide-react';

interface DepositReceiptModalProps {
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

export const DepositReceiptModal: React.FC<DepositReceiptModalProps> = ({
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

  const depositNumber = `DEP-${booking.code.replace(/[^0-9]/g, '') || '88102'}`;
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

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
        className="printable-modal-card bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 print:max-h-none print:shadow-none print:border-none print:w-full print:max-w-none print:rounded-none"
      >
        
        {/* Sticky Action Header (ALWAYS VISIBLE at the top, hidden when printing) */}
        <div className="p-4 md:p-5 bg-slate-900 text-white flex items-center justify-between sticky top-0 z-20 shrink-0 print:hidden border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EF3F09]/20 text-[#EF3F09] border border-[#EF3F09]/30 flex items-center justify-center font-black text-lg shrink-0">
              GH
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Tanda Terima Deposit Resmi</h3>
              <p className="text-[11px] text-slate-400 font-semibold">Security Deposit Receipt Voucher</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-[#EF3F09] hover:bg-orange-600 text-white font-extrabold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak</span>
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

        {/* Printable Deposit Voucher Body (Scrollable inside container) */}
        <div className="printable-receipt-body flex-1 overflow-y-auto p-6 md:p-8 space-y-6 text-slate-900 bg-white font-['Plus_Jakarta_Sans',sans-serif] print:overflow-visible">
          
          {/* Voucher Brand Header */}
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
                  Jl. Sunset Boulevard No. 88, Nusa Dua Resort, Bali 80363 | Tel: +62 (0361) 894-7700
                </p>
                <p className="text-[10px] text-slate-400 font-bold">www.grandhorizon.com | info@grandhorizon.com</p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 rounded-lg text-[10px] font-black uppercase tracking-wider border border-amber-300">
                TANDA TERIMA DEPOSIT
              </span>
              <p className="text-xs font-black text-slate-900 mt-1">Ref: {depositNumber}</p>
              <p className="text-[10px] text-slate-500 font-semibold">{currentDate}</p>
            </div>
          </div>

          {/* Guest & Booking Info Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nama Tamu (Guest Name)</span>
              <p className="font-extrabold text-slate-900 text-sm">{booking.guest} ({booking.flag})</p>
              <p className="text-slate-500 font-semibold text-[11px]">{booking.contact}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kamar & Tipe Kamar</span>
              <p className="font-extrabold text-slate-900 text-sm">{booking.room}</p>
              <p className="text-slate-500 font-semibold text-[11px]">Channel: {booking.channel}</p>
            </div>

            <div className="col-span-2 pt-2 border-t border-slate-200/60 grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">No. Reservasi</span>
                <span className="font-black text-slate-900">{booking.code}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Check-In</span>
                <span className="font-bold text-slate-800">{booking.check_in || '2026-08-30'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Check-Out</span>
                <span className="font-bold text-slate-800">{booking.check_out || '2026-09-02'}</span>
              </div>
            </div>
          </div>

          {/* Deposit Payment Details */}
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-5 bg-emerald-50/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Nominal Deposit Jaminan (Security Deposit Amount)
              </span>
              <span className="text-lg font-black text-emerald-700">Rp 500.000</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-200">
              <div>
                <span className="text-slate-500 font-bold text-[11px] block">Metode Pembayaran Deposit:</span>
                <span className="font-extrabold text-slate-900">QRIS / Credit Card Pre-Auth</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold text-[11px] block">Status Deposit:</span>
                <span className="inline-flex items-center gap-1 font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 text-[10px]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  HELD IN GUARANTEE
                </span>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="space-y-1.5 text-[11px] text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="font-extrabold text-slate-900 uppercase tracking-wider text-[10px]">
              Ketentuan Pengembalian Deposit (Terms & Conditions):
            </p>
            <ol className="list-decimal list-inside space-y-1 font-medium leading-relaxed">
              <li>Uang deposit jaminan sebesar <strong>Rp 500.000</strong> ini akan dikembalikan penuh saat proses <strong>Check-Out</strong>.</li>
              <li>Pengembalian deposit dilakukan setelah tim Housekeeping mengonfirmasi tidak ada klaim kerusakan kamar (*incidental damage*) atau konsumsi minibar yang belum dilunasi.</li>
              <li>Mohon simpan dan tunjukkan bukti resi tanda terima ini kepada petugas Front Desk saat melakukan Check-Out.</li>
            </ol>
          </div>

          {/* Signature Block */}
          <div className="grid grid-cols-2 gap-8 pt-6">
            <div className="text-center space-y-12">
              <p className="text-xs font-bold text-slate-500 uppercase">Petugas Front Desk (Agent)</p>
              <div className="border-b border-slate-400 mx-6"></div>
              <p className="text-xs font-extrabold text-slate-900">Petugas Receptionist (FO)</p>
            </div>

            <div className="text-center space-y-12">
              <p className="text-xs font-bold text-slate-500 uppercase">Tanda Tangan Tamu (Guest Signature)</p>
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
              Tutup Modal
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-[#EF3F09] hover:bg-orange-600 text-white font-extrabold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Kwitansi Deposit</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
