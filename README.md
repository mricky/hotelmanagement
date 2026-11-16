# Hotel Management System (`hotelmanagement`)
## Enterprise Property Management System (PMS) & Direct Booking Engine

Sistem Manajemen Properti Perhotelan (PMS) dan Direct Booking Engine berbasis **Laravel 11**, **Inertia.js (React)**, **PostgreSQL 16**, **Redis 7**, dan **Docker Compose** yang dirancang khusus untuk operasional hotel di pasar Bandung.

---

## 🚀 Fitur Utama

- 🏨 **Core Front Office & Room Operations**: Peta status kamar real-time (`CLEAN`, `DIRTY`, `INSPECTED`, `OUT_OF_ORDER`), penanganan Walk-In, serta Input Manual OTA (Agoda, Traveloka, Booking.com).
- 📅 **Interactive Gantt Chart Reservation Calendar**: Matriks visual pemetaan alokasi kamar vs tanggal menginap.
- ⚡ **Redis Temporary Inventory Lock (15 Menit)**: Penguncian stok kamar otomatis saat proses pembayaran langsung di web resmi hotel.
- 📈 **Dynamic Pricing & Revenue Management**:
  - **Weekend Surge Bandung**: Kenaikan harga otomatis (+25%) pada hari Jumat & Sabtu.
  - **Occupancy-Based Surge**: Penyesuaian harga otomatis saat keterisian >80% (+15%) atau sepi <30% (-10%).
  - **Price Guardrails**: Batas minimum & maksimum harga kamar.
- 📱 **Housekeeping Mobile App API**: Endpoint API untuk aplikasi seluler staf dengan upload foto perbaikan kamar.
- 🌙 **Automated Night Audit (Close-Day)**: Posting otomatis biaya kamar harian ke folio tamu, penandaan `NO_SHOW`, dan reset kamar `DIRTY`.
- 💳 **Payment Gateway Webhook**: Validasi Hash Signature SHA-512 Midtrans / Xendit dan pelepasan kunci stok otomatis jika kadaluarsa.
- 📲 **WhatsApp Guest Engagement**: Notifikasi konfirmasi pemesanan, tiket QR digital, dan lokasi hotel via WhatsApp API.

---

## 🛠 Panduan Instalasi & Docker Deployment

### 1. Cloning & Persiapan Environment
```bash
cp .env.example .env
```

### 2. Jalankan Containerization via Docker Compose
```bash
docker-compose up -d --build
```

Container yang akan berjalan:
- `hotelmanagement_app`: PHP-FPM 8.3 Application
- `hotelmanagement_nginx`: Web Server (Port `8000`)
- `hotelmanagement_postgres`: Database PostgreSQL 16 (Port `5432`)
- `hotelmanagement_redis`: Cache & Lock Store Redis 7 (Port `6379`)
- `hotelmanagement_queue`: Background Queue Worker Process

### 3. Migrasi Database & Seeding Demo
```bash
docker-compose exec app php artisan migrate --seed --seeder=PmsDatabaseSeeder
```

### 4. Running Test Suite
```bash
docker-compose exec app php artisan test
```

---

## 📑 Struktur Direktori Utama

```
hotelmanagement/
├── app/
│   ├── Http/Controllers/
│   │   ├── PaymentWebhookController.php
│   │   └── HousekeepingController.php
│   ├── Jobs/
│   │   └── NightAuditJob.php
│   └── Services/
│       ├── DynamicPricingService.php
│       ├── InventoryLockService.php
│       ├── PosIntegrationService.php
│       └── WhatsAppNotificationService.php
├── database/
│   ├── schema.sql
│   └── seeders/PmsDatabaseSeeder.php
├── docker/
│   ├── nginx/conf.d/app.conf
│   └── php/local.ini
├── docker-compose.yml
├── resources/js/Pages/
│   ├── BookingEngine/SearchWidget.jsx
│   └── Bookings/CalendarView.jsx
└── tests/
    ├── Feature/PaymentWebhookTest.php
    └── Unit/DynamicPricingServiceTest.php
```
