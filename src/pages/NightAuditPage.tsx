import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Moon, CheckCircle2, ShieldCheck, Play, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AuditStep {
  id: number;
  title: string;
  desc: string;
  status: 'completed' | 'in_progress' | 'pending';
}

export const NightAuditPage: React.FC = () => {
  const { t } = useLanguage();
  const [steps] = useState<AuditStep[]>([
    {
      id: 1,
      title: 'Check-In & Check-Out Status Verification',
      desc: 'Verifikasi seluruh tamu yang belum check-out atau belum memproses kamar.',
      status: 'completed',
    },
    {
      id: 2,
      title: 'Automatic Room Charge Posting',
      desc: 'Proses posting biaya sewa kamar harian & pajak ke seluruh folio aktif.',
      status: 'completed',
    },
    {
      id: 3,
      title: 'F&B & Service Ledger Reconciliation',
      desc: 'Rekonsiliasi transaksi restoran, room service, & laundry harian.',
      status: 'completed',
    },
    {
      id: 4,
      title: 'Daily Business Close & EOD Lock',
      desc: 'Penutupan buku harian resmi & penguncian periode transaksi harian.',
      status: 'completed',
    },
  ]);

  const [auditRunning, setAuditRunning] = useState(false);

  const handleRunAudit = async () => {
    setAuditRunning(true);
    try {
      const res = await fetch('/api/v1/night-audit/run', { method: 'POST' });
      const data = await res.json();
      if (data && data.status === 'success') {
        alert(`✓ Night Audit harian berhasil dijalankan! ${data.message || ''}`);
      }
    } catch (err) {
      console.error(err);
      alert('Gagal menjalankan Night Audit.');
    } finally {
      setAuditRunning(false);
    }
  };

  return (
    <div className="flex-1 min-w-0 pb-12">
      <Header
        title={t('night_audit.title')}
        subtitle={t('night_audit.subtitle')}
      />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Top Audit Action Banner */}
        <div className="bg-[#0B132B] text-white rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Moon className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-black tracking-wide">Night Audit Console — EOD 29 Agustus 2026</h2>
            </div>
            <p className="text-slate-400 text-xs font-semibold max-w-2xl">
              Proses ini akan memposting otomatis biaya kamar harian ke seluruh folio aktif, mencocokkan piutang Kasir Resepsionis, dan mengunci buku harian.
            </p>
          </div>

          <button
            onClick={handleRunAudit}
            disabled={auditRunning}
            className="px-6 py-4 bg-[#EF3F09] hover:bg-[#D63405] disabled:opacity-50 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-[#EF3F09]/30 transition flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{auditRunning ? 'Memproses EOD Night Audit...' : t('btn.run_night_audit')}</span>
          </button>
        </div>

        {/* Steps Checklist Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
          <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">
            CHECKLIST PROSES NIGHT AUDIT HARIAN
          </h3>

          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{step.title}</h4>
                    <p className="text-slate-500 text-xs font-semibold">{step.desc}</p>
                  </div>
                </div>

                <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-extrabold text-xs rounded-xl border border-emerald-200 flex items-center gap-1.5 whitespace-nowrap">
                  <span>VERIFIED OK ✓</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
