# 🚀 Panduan Menjalankan Project Hotel Management System

Dokumen ini berisi panduan langkah demi langkah dan perintah terminal untuk menjalankan aplikasi **Frontend (FE)** dan **Backend (BE)** pada project `hotelmanagement`.

---

## 📋 Prasyarat Sistem (Prerequisites)

Sebelum menjalankan aplikasi, pastikan sistem Anda sudah terinstall:
- **Node.js**: v18.x atau lebih baru (`node -v`)
- **Golang**: v1.20 atau lebih baru (`go version`)
- **PostgreSQL**: v16 (Lokal atau via Docker)
- **Git** & **Docker Compose** (opsional, untuk database/containerization)

---

## 🗄️ Langkah 1: Persiapan Database (PostgreSQL)

Backend Golang membutuhkan database PostgreSQL. Anda bisa menggunakannya via Docker atau PostgreSQL Lokal.

### Cara A: Menggunakan Docker untuk Database & Redis (Direkomendasikan)
Jalankan Service PostgreSQL & Redis bawaan project:
```bash
docker-compose up -d postgres redis
```
> **Info Port DB**:
> - Docker Postgres di mapping ke port `5433` (luar) / `5432` (dalam).
> - Credentials default: User: `postgres`, Pass: `secretpassword`, DB: `hotelmanagement_db`.

### Cara B: Menggunakan PostgreSQL Lokal
Jika menggunakan PostgreSQL yang terinstall di mesin lokal:
1. Pastikan PostgreSQL berjalan di port `5432`.
2. Buat database baru bernama `hotelmanagement_db`.
```sql
CREATE DATABASE hotelmanagement_db;
```

---

## ⚙️ Langkah 2: Menjalankan Backend (Golang REST API)

Backend menggunakan **Golang** (`Gin` framework & `GORM` ORM).

1. Buka terminal dan masuk ke folder `go-backend`:
   ```bash
   cd go-backend
   ```

2. *(Opsional)* Jika perlu menyesuaikan kredensial database (misal ke Docker port 5433):
   ```bash
   export DB_HOST=localhost
   export DB_PORT=5432
   export DB_USER=postgres
   export DB_PASSWORD=secretpassword
   export DB_NAME=hotelmanagement_db
   ```

3. Unduh dependency Go (jika baru pertama kali):
   ```bash
   go mod tidy
   ```

4. Jalankan server Backend:
   ```bash
   go run main.go
   ```

   **Output sukses:**
   ```text
   🚀 Go REST API Backend Server listening on http://localhost:8000
   ```
   - Server Backend aktif di **`http://localhost:8000`**
   - Health check URL: **`http://localhost:8000/api/v1/health`**

---

## 💻 Langkah 3: Menjalankan Frontend (React + Vite SPA)

Frontend menggunakan **React 18**, **TypeScript**, dan **Vite**.

1. Buka terminal baru di root folder project `hotelmanagement`:
   ```bash
   cd /Users/hacaca/Projects/personal/hotelmanagement
   ```

2. Install dependency Node.js (jika belum):
   ```bash
   npm install
   ```

3. Jalankan server development Vite:
   ```bash
   npm run dev
   ```

   **Output sukses:**
   ```text
     VITE v5.1.6  ready in 300 ms

     ➜  Local:   http://localhost:3000/
     ➜  network: use --host to expose
   ```
---

## 🔑 Kredensial Akun Login (Uji Coba Demo)

Gunakan akun berikut untuk melakukan login ke dalam sistem PMS:

| Role / Jabatan | Email | Password Default | Akses Modul Utama |
| :--- | :--- | :--- | :--- |
| **General Manager** | `hendra.gm@grandhorizon.com` | `password123` | Akses Penuh (Full Control), Finansial, System Settings |
| **Front Desk Manager** | `sarah.j@grandhorizon.com` | `password123` | Operational Desk, Reservasi, Keycard & Guest Folio |
| **Front Desk Agent** | `bambang.s@grandhorizon.com` | `password123` | Check-in, Check-out, Room Availability |

> **Catatan Quick Login**: Pada halaman login (`http://localhost:3000/login`), Anda juga dapat mengklik kartu **Quick Login** untuk masing-masing peran di atas tanpa perlu mengetik manual.

---

## 🐳 Opsional: Menjalankan Full Application via Docker Compose

Jika ingin menjalankan seluruh aplikasi dalam container Docker:

```bash
# 1. Salin environment file
cp .env.example .env

# 2. Build dan jalankan seluruh container
docker-compose up -d --build

# 3. Jalankan migrasi database & seeder
docker-compose exec app php artisan migrate --seed --seeder=PmsDatabaseSeeder
```

---

## ⚡ Ringkasan Perintah Cepat (Cheatsheet)

| Komponen | Perintah Terminal | URL Access |
| :--- | :--- | :--- |
| **Database** | `docker-compose up -d postgres redis` | `localhost:5432` / `localhost:5433` |
| **Backend (Golang)** | `cd go-backend && go run main.go` | `http://localhost:8000` |
| **Frontend (React)** | `npm run dev` | `http://localhost:3000` |
| **Build FE Production** | `npm run build` | Hasil di folder `/dist` |
