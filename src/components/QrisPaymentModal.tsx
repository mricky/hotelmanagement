import React, { useState, useEffect } from 'react';
import { X, QrCode, CheckCircle2, Clock, ShieldCheck, Copy, Check, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface QrisPaymentModalProps {
  isOpen: boolean;
  amount: number;
  invoiceNumber: string;
  customerName?: string;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export const QrisPaymentModal: React.FC<QrisPaymentModalProps> = ({
  isOpen,
  amount,
  invoiceNumber,
  customerName = 'Tamu Hotel',
  onClose,
  onPaymentSuccess,
}) => {
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(300);
      setPaymentDone(false);
      setIsVerifying(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Dynamic QR Code URL using API
  const qrString = `00020101021226670016ID.CO.QRIS.WWW0118936009110020891234520458125303360540${amount}5802ID5931GRAND HORIZON RESORT HOTELS6007BALI016304`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrString)}`;

  const handleCopyNmid = () => {
    navigator.clipboard.writeText('ID10249823901-GH');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateCallback = async () => {
    setIsVerifying(true);
    setTimeout(async () => {
      setIsVerifying(false);
      setPaymentDone(true);

      // Log Audit to PostgreSQL API
      try {
        await fetch('/api/v1/audit-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'QRIS_PAYMENT_SUCCESS',
            module: 'Payment Gateway',
            user: user ? user.name : 'QRIS Engine',
            details: `Pembayaran QRIS Rp ${amount.toLocaleString('id-ID')} (${invoiceNumber}) LUNAS terverifikasi.`,
          }),
        });
      } catch (e) {
        // silent fallback
      }

      setTimeout(() => {
        onPaymentSuccess();
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 text-center flex flex-col items-center">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {paymentDone ? (
          <div className="py-8 space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Pembayaran QRIS Berhasil!</h3>
            <p className="text-xs text-slate-500 font-semibold max-w-xs">
              Transaksi sebesar <strong className="text-slate-900">Rp {amount.toLocaleString('id-ID')}</strong> ({invoiceNumber}) telah lunas terverifikasi.
            </p>
          </div>
        ) : (
          <div className="w-full space-y-5">
            {/* Header Title */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#EF3F09] font-extrabold text-[10px] uppercase tracking-wider">
                <QrCode className="w-3.5 h-3.5" />
                <span>DYNAMIC QRIS PAYMENT GATEWAY</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">Scan QRIS Untuk Membayar</h3>
              <p className="text-slate-500 text-xs font-semibold">
                Bisa pakai BCA, Mandiri, GoPay, OVO, ShopeePay, Dana, LinkAja
              </p>
            </div>

            {/* Merchant & Amount Info Card */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-left">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold">Merchant:</span>
                <span className="font-black text-slate-900">PT GRAND HORIZON RESORT</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold">NMID:</span>
                <div className="flex items-center gap-1 font-bold text-slate-700">
                  <span>ID10249823901-GH</span>
                  <button onClick={handleCopyNmid} className="text-slate-400 hover:text-slate-700">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold">Invoice Ref:</span>
                <span className="font-bold text-slate-700">{invoiceNumber}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="text-xs font-black text-slate-900">Total Pembayaran:</span>
                <span className="text-lg font-black text-[#EF3F09]">Rp {amount.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="relative p-4 bg-white rounded-2xl border-2 border-dashed border-slate-300 shadow-inner inline-block mx-auto">
              <img
                src={qrImageUrl}
                alt="QRIS Code"
                className="w-56 h-56 mx-auto object-contain rounded-lg"
              />
              <div className="mt-2 flex items-center justify-center gap-1 text-[10px] font-bold text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Standard QRIS Bank Indonesia (ASPI)</span>
              </div>
            </div>

            {/* Countdown Timer Badge */}
            <div className="flex items-center justify-center gap-2 text-xs font-extrabold text-amber-700 bg-amber-50 py-2.5 px-4 rounded-xl border border-amber-200">
              <Clock className="w-4 h-4 animate-spin text-amber-600" />
              <span>Sisa Waktu Pembayaran: {formattedTime}</span>
            </div>

            {/* Simulated Payment Trigger for Testing */}
            <button
              onClick={handleSimulateCallback}
              disabled={isVerifying}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-2xl shadow transition cursor-pointer flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Verifikasi Webhook QRIS...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Simulasi Webhook Lunas (Test Mode)</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
