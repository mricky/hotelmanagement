import React, { createContext, useContext, useState } from 'react';

export type Language = 'id' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  id: {
    // Header & Navigation
    'nav.dashboard': 'Ringkasan Eksekutif',
    'nav.bookings': 'Reservasi & Kalender',
    'nav.rooms': 'Inventaris Kamar & RFID',
    'nav.channels': 'OTA Channel Manager',
    'nav.report': 'Cetak PDF Audit',
    'nav.pricing': 'Dynamic Pricing Engine',
    'nav.night_audit': 'Night Audit Harian',
    'nav.guests': 'Database Profil Tamu',
    'nav.room_types': 'Master Tipe Kamar',
    'nav.floors': 'Master Posisi Lantai',
    'nav.housekeeping': 'SOP Kebersihan',
    'nav.users': 'Akun Staf & RBAC',
    'nav.audit_logs': 'Log Aktivitas Staf',

    // Titles & Subtitles
    'dashboard.title': 'Ringkasan Manajemen Eksekutif',
    'dashboard.subtitle': 'Analitik pendapatan harian, persentase okupansi, & statistik operasional hotel',
    'bookings.title': 'Manajemen Reservasi & Kalender Matrix',
    'bookings.subtitle': 'Manajemen reservasi, integrasi OTA channel manager, & jejak audit staf',
    'rooms.title': 'Inventaris Kamar & Encoder Keycard RFID',
    'rooms.subtitle': 'Status kebersihan kamar, pembuatan kunci RFID, & log perbaikan OOO',
    'channels.title': 'Channel Manager 2-Way Allotment Sync',
    'channels.subtitle': 'Singkronisasi otomatis alokasi kamar OTA & simulasi koneksi webhook',
    'pricing.title': 'Dynamic Pricing Engine & Yield Management',
    'pricing.subtitle': 'Pengaturan harga dinamis otomatis berdasarkan tren okupansi & musim ramai',
    'night_audit.title': 'Penutupan Buku Harian & Night Audit Otomatis',
    'night_audit.subtitle': 'Proses penutupan buku harian, verifikasi posting biaya kamar, & penguncian periode',
    'guests.title': 'Database Profil Tamu & Program Loyalitas CRM',
    'guests.subtitle': 'Manajemen data riwayat tamu, kewarganegaraan, & penetapan tier loyalitas',
    'room_types.title': 'Master Tipe Kamar & Tarif Dasar',
    'room_types.subtitle': 'Manajemen jenis kamar, tarif dasar harian, & kapasitas fasilitas',
    'floors.title': 'Master Layout Posisi Lantai & Area',
    'floors.subtitle': 'Manajemen lantai gedung hotel, supervisor penanggung jawab, & rentang nomor',
    'housekeeping.title': 'Inspeksi Kebersihan & Checklist SOP Housekeeping',
    'housekeeping.subtitle': 'Daftar periksa standar operasional kebersihan kamar & area umum hotel',
    'users.title': 'Manajemen Akun Staf & Matriks Hak Akses RBAC',
    'users.subtitle': 'Pengaturan pengguna staf hotel, peranan jabatan, & matriks izin akses modul',
    'audit_logs.title': 'Pusat Log Aktivitas & Jejak Audit Staf',
    'audit_logs.subtitle': 'Jejak audit staf real-time, aktivitas transaksi keuangan, & log keamanan sistem',

    // Actions & Buttons
    'btn.table_view': 'Mode Tabel',
    'btn.calendar_view': 'Mode Kalender Matrix',
    'btn.add_booking': 'Tambah Reservasi Baru',
    'btn.add_room': 'Tambah Kamar Baru',
    'btn.add_pricing': 'Tambah Aturan Harga',
    'btn.run_night_audit': 'Jalankan Night Audit Harian Sekarang',
    'btn.add_guest': 'Tambah Profil Tamu Baru',
    'btn.add_room_type': 'Tambah Tipe Kamar Baru',
    'btn.add_floor': 'Tambah Zona Lantai Baru',
    'btn.add_checklist': 'Tambah Task SOP Baru',
    'btn.add_user': 'Tambah Akun Staf Baru',
    'btn.reset_filter': 'Reset Filter',
    'btn.export_excel': 'Export Laporan (Excel)',
    'btn.search': 'Cari...',

    // System labels
    'label.language': 'Bahasa Indonesia',
    'label.status_active': 'AKTIF',
    'label.status_inactive': 'NONAKTIF',
    'label.all_channels': 'Semua Channel',
  },
  en: {
    // Header & Navigation
    'nav.dashboard': 'Executive Overview',
    'nav.bookings': 'Reservations & Calendar',
    'nav.rooms': 'Room Inventory & RFID',
    'nav.channels': 'OTA Channel Manager',
    'nav.report': 'Print PDF Audit',
    'nav.pricing': 'Dynamic Pricing Engine',
    'nav.night_audit': 'Daily Night Audit',
    'nav.guests': 'Guest Profile Database',
    'nav.room_types': 'Master Room Types',
    'nav.floors': 'Master Floor Layout',
    'nav.housekeeping': 'Housekeeping SOP',
    'nav.users': 'Staff Accounts & RBAC',
    'nav.audit_logs': 'Staff Activity Logs',

    // Titles & Subtitles
    'dashboard.title': 'Executive Management Overview',
    'dashboard.subtitle': 'Daily revenue analytics, room occupancy rates, & operational statistics',
    'bookings.title': 'Reservations & Room Matrix Calendar',
    'bookings.subtitle': 'Reservation management, OTA channel manager sync, & staff audit trails',
    'rooms.title': 'Room Inventory & RFID Keycard Encoder',
    'rooms.subtitle': 'Room cleanliness status, RFID smart key creation, & OOO repair logs',
    'channels.title': 'Channel Manager 2-Way Allotment Sync',
    'channels.subtitle': 'Automated OTA room allotment synchronization & webhook simulation',
    'pricing.title': 'Dynamic Pricing Engine & Yield Management',
    'pricing.subtitle': 'Automated dynamic rate adjustment based on occupancy trends & peak seasons',
    'night_audit.title': 'Night Audit Automation & Daily Business Close',
    'night_audit.subtitle': 'Daily business close process, room charge posting verification, & period lock',
    'guests.title': 'Guest Profile Database & CRM Loyalty Program',
    'guests.subtitle': 'Guest stay history management, nationality identification, & loyalty tier assignment',
    'room_types.title': 'Master Room Types & Base Rates',
    'room_types.subtitle': 'Room category management, daily base rates, & max capacity configuration',
    'floors.title': 'Master Floor Layout & Area Management',
    'floors.subtitle': 'Hotel building floor management, assigned floor supervisors, & room ranges',
    'housekeeping.title': 'Housekeeping Inspection & SOP Checklist',
    'housekeeping.subtitle': 'Standard operational cleanliness inspection checklist for guest rooms & public areas',
    'users.title': 'Staff User Accounts & RBAC Access Matrix',
    'users.subtitle': 'Hotel staff user setup, operational roles, & module access permission matrix',
    'audit_logs.title': 'System Audit Logs & Staff Activity Trail',
    'audit_logs.subtitle': 'Real-time staff audit trail, financial transaction activity, & system security logs',

    // Actions & Buttons
    'btn.table_view': 'Table View',
    'btn.calendar_view': 'Matrix Calendar View',
    'btn.add_booking': 'Add New Reservation',
    'btn.add_room': 'Add New Room',
    'btn.add_pricing': 'Add Pricing Rule',
    'btn.run_night_audit': 'Run Daily Night Audit Now',
    'btn.add_guest': 'Add New Guest Profile',
    'btn.add_room_type': 'Add New Room Type',
    'btn.add_floor': 'Add New Floor Zone',
    'btn.add_checklist': 'Add New SOP Task',
    'btn.add_user': 'Add New Staff Account',
    'btn.reset_filter': 'Reset Filter',
    'btn.export_excel': 'Export Report (Excel)',
    'btn.search': 'Search...',

    // System labels
    'label.language': 'English (UK)',
    'label.status_active': 'ACTIVE',
    'label.status_inactive': 'INACTIVE',
    'label.all_channels': 'All Channels',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('pms_language') as Language) || 'id';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('pms_language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['id'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
