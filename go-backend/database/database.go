package database

import (
	"fmt"
	"log"
	"os"
	"time"

	"hotelmanagement/go-backend/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func InitDB() *gorm.DB {
	host := os.Getenv("DB_HOST")
	if host == "" {
		host = "localhost"
	}
	port := os.Getenv("DB_PORT")
	if port == "" {
		port = "5432"
	}
	user := os.Getenv("DB_USER")
	if user == "" {
		user = "postgres"
	}
	password := os.Getenv("DB_PASSWORD")
	if password == "" {
		password = "secretpassword"
	}
	dbname := os.Getenv("DB_NAME")
	if dbname == "" {
		dbname = "hotelmanagement_db"
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Jakarta",
		host, user, password, dbname, port)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Printf("Warning: Failed to connect to PostgreSQL DSN (%v). Falling back to SQLite/In-Memory mode...", err)
		return nil
	}

	log.Println("Successfully connected to PostgreSQL Database!")

	// Auto Migrate Schema
	err = DB.AutoMigrate(
		&models.Room{},
		&models.RoomType{},
		&models.Floor{},
		&models.Booking{},
		&models.Checklist{},
		&models.ChecklistCategory{},
		&models.User{},
		&models.PricingRule{},
		&models.Guest{},
		&models.RolePermission{},
		&models.AuditLog{},
		&models.HotelProfile{},
		&models.MenuItem{},
		&models.POSOrder{},
		&models.HotelService{},
		&models.ServiceOrder{},
		&models.LostItem{},
		&models.APIAccessLog{},
		&models.IdempotencyRecord{},
	)
	if err != nil {
		log.Fatalf("Failed to auto migrate database schemas: %v", err)
	}

	// Seed Initial Data
	SeedData(DB)

	return DB
}

func SeedData(db *gorm.DB) {
	log.Println("Checking and Seeding Enterprise PMS Data into PostgreSQL...")
	now := time.Now()

	// 1. Seed Rooms
	rooms := []models.Room{
		{Number: "402", Type: "Executive Suite", Status: "OCCUPIED", Rate: 3200000, CreatedBy: "Agus Setiawan (HK Tech)", CreatedAt: now.Add(-24 * time.Hour), UpdatedBy: "Siti Rahma (HK Supervisor)", UpdatedAt: now},
		{Number: "305", Type: "Deluxe King", Status: "CLEANING", Rate: 1900000, CreatedBy: "Agus Setiawan (HK Tech)", CreatedAt: now.Add(-24 * time.Hour), UpdatedBy: "Siti Rahma (HK Supervisor)", UpdatedAt: now},
		{Number: "201", Type: "Standard Double", Status: "VACANT", Rate: 1400000, CreatedBy: "Budi Santoso (Runner)", CreatedAt: now.Add(-48 * time.Hour), UpdatedBy: "Hendra Gunawan (GM)", UpdatedAt: now},
		{Number: "501", Type: "Presidential Suite", Status: "OOO", Rate: 6500000, CreatedBy: "Hendra Gunawan (GM)", CreatedAt: now.Add(-72 * time.Hour), UpdatedBy: "Agus Setiawan (HK Tech)", UpdatedAt: now},
	}
	for _, r := range rooms {
		db.FirstOrCreate(&r, models.Room{Number: r.Number})
	}

	// 2. Seed Room Types
	roomTypes := []models.RoomType{
		{Name: "Executive Suite", BaseRate: 3200000, Capacity: "2 Dewasa + 1 Anak", Bed: "1 Super King Bed", CreatedBy: "System Superadmin (Auto-Seed)", CreatedAt: now.Add(-7 * 24 * time.Hour), UpdatedBy: "System Auto-Seed", UpdatedAt: now},
		{Name: "Deluxe King", BaseRate: 1900000, Capacity: "2 Dewasa", Bed: "1 King Bed", CreatedBy: "System Superadmin (Auto-Seed)", CreatedAt: now.Add(-7 * 24 * time.Hour), UpdatedBy: "System Auto-Seed", UpdatedAt: now},
		{Name: "Standard Double", BaseRate: 1400000, Capacity: "2 Dewasa", Bed: "2 Twin Beds", CreatedBy: "System Superadmin (Auto-Seed)", CreatedAt: now.Add(-7 * 24 * time.Hour), UpdatedBy: "System Auto-Seed", UpdatedAt: now},
		{Name: "Presidential Suite", BaseRate: 6500000, Capacity: "4 Dewasa + 2 Anak", Bed: "1 Super King + Lounge", CreatedBy: "System Superadmin (Auto-Seed)", CreatedAt: now.Add(-7 * 24 * time.Hour), UpdatedBy: "System Auto-Seed", UpdatedAt: now},
	}
	for _, rt := range roomTypes {
		db.FirstOrCreate(&rt, models.RoomType{Name: rt.Name})
	}

	// 3. Seed Floors
	floors := []models.Floor{
		{FloorCode: "FL-05", Name: "Lantai 5 (Penthouse Wing)", Range: "501 - 510", UnitCount: 10, Supervisor: "Siti Rahma", CreatedBy: "System Superadmin (Auto-Seed)", CreatedAt: now.Add(-14 * 24 * time.Hour), UpdatedBy: "Siti Rahma (HK Supervisor)", UpdatedAt: now},
		{FloorCode: "FL-04", Name: "Lantai 4 (Executive Wing)", Range: "401 - 435", UnitCount: 35, Supervisor: "Agus Setiawan", CreatedBy: "System Superadmin (Auto-Seed)", CreatedAt: now.Add(-14 * 24 * time.Hour), UpdatedBy: "Agus Setiawan (Senior HK)", UpdatedAt: now},
		{FloorCode: "FL-03", Name: "Lantai 3 (Deluxe Wing)", Range: "301 - 335", UnitCount: 35, Supervisor: "Agus Setiawan", CreatedBy: "System Superadmin (Auto-Seed)", CreatedAt: now.Add(-14 * 24 * time.Hour), UpdatedBy: "Agus Setiawan (Senior HK)", UpdatedAt: now},
	}
	for _, f := range floors {
		db.FirstOrCreate(&f, models.Floor{FloorCode: f.FloorCode})
	}

	// 4. Seed Bookings
	bookings := []models.Booking{
		{Code: "#RES-6001", Guest: "Lord William Sterling", Flag: "WNA 🇬🇧", Contact: "william@sterling.uk", Room: "Executive Suite 402", CheckIn: "2026-06-24", CheckOut: "2026-06-28", Dates: "2026-06-24 s/d 2026-06-28", Created: "Direct Web (Auto)", CreatedTime: "24 Jun 2026 10:00 WIB", Updated: "System Auto-Seed", UpdatedTime: "28 Jun 2026 12:00 WIB", Status: "Completed", StatusBg: "bg-slate-100 text-slate-700", Total: "Rp 12.800.000", ActionText: "Detail Folio", Channel: "Direct Web"},
		{Code: "#RES-6005", Guest: "Bpk. Bambang Sutrisno", Flag: "WNI 🇮🇩", Contact: "bambang@email.com", Room: "Deluxe King 305", CheckIn: "2026-06-25", CheckOut: "2026-06-29", Dates: "2026-06-25 s/d 2026-06-29", Created: "Agoda API Engine", CreatedTime: "25 Jun 2026 14:00 WIB", Updated: "Bambang (Front Desk)", UpdatedTime: "29 Jun 2026 11:00 WIB", Status: "Completed", StatusBg: "bg-slate-100 text-slate-700", Total: "Rp 7.600.000", ActionText: "Detail Folio", Channel: "Agoda"},
		{Code: "#RES-7012", Guest: "Dr. Michael Chen", Flag: "WNA 🇺🇸", Contact: "mchen@health.org", Room: "Executive Suite 402", CheckIn: "2026-07-05", CheckOut: "2026-07-10", Dates: "2026-07-05 s/d 2026-07-10", Created: "Direct Web (Auto)", CreatedTime: "05 Jul 2026 09:00 WIB", Updated: "System Auto-Seed", UpdatedTime: "10 Jul 2026 11:30 WIB", Status: "Completed", StatusBg: "bg-slate-100 text-slate-700", Total: "Rp 16.000.000", ActionText: "Detail Folio", Channel: "Direct Web"},
		{Code: "#RES-7015", Guest: "Ibu Maya Sastro", Flag: "WNI 🇮🇩", Contact: "maya.sastro@email.com", Room: "Deluxe King 305", CheckIn: "2026-07-24", CheckOut: "2026-07-28", Dates: "2026-07-24 s/d 2026-07-28", Created: "Agoda API Engine", CreatedTime: "24 Jul 2026 15:00 WIB", Updated: "Bambang (Front Desk)", UpdatedTime: "28 Jul 2026 12:00 WIB", Status: "Completed", StatusBg: "bg-slate-100 text-slate-700", Total: "Rp 7.600.000", ActionText: "Detail Folio", Channel: "Agoda"},
		{Code: "#RES-8010", Guest: "Bpk. Ahmad Subagyo", Flag: "WNI 🇮🇩", Contact: "ahmad@subagyo.com", Room: "Standard Double 201", CheckIn: "2026-08-02", CheckOut: "2026-08-05", Dates: "2026-08-02 s/d 2026-08-05", Created: "Walk-In Front Desk", CreatedTime: "02 Aug 2026 08:30 WIB", Updated: "System Auto-Seed", UpdatedTime: "05 Aug 2026 12:00 WIB", Status: "Completed", StatusBg: "bg-slate-100 text-slate-700", Total: "Rp 4.200.000", ActionText: "Detail Folio", Channel: "Walk-In"},
		{Code: "#RES-8012", Guest: "Ibu Ratna Sari", Flag: "WNI 🇮🇩", Contact: "ratna@sari.co.id", Room: "Deluxe King 305", CheckIn: "2026-08-20", CheckOut: "2026-08-23", Dates: "2026-08-20 s/d 2026-08-23", Created: "Walk-In Front Desk", CreatedTime: "20 Aug 2026 10:15 WIB", Updated: "Bambang Sutrisno (FO)", UpdatedTime: "23 Aug 2026 11:45 WIB", Status: "Completed", StatusBg: "bg-slate-100 text-slate-700", Total: "Rp 5.700.000", ActionText: "Detail Folio", Channel: "Walk-In"},
		{Code: "#RES-8025", Guest: "Ms. Clara Oswald", Flag: "WNA 🇬🇧", Contact: "clara@tardis.uk", Room: "Deluxe King 305", CheckIn: "2026-08-05", CheckOut: "2026-08-09", Dates: "2026-08-05 s/d 2026-08-09", Created: "Traveloka Engine", CreatedTime: "05 Aug 2026 11:00 WIB", Updated: "Bambang Sutrisno (FO)", UpdatedTime: "09 Aug 2026 11:30 WIB", Status: "Completed", StatusBg: "bg-slate-100 text-slate-700", Total: "Rp 7.600.000", ActionText: "Detail Folio", Channel: "Traveloka"},
		{Code: "#RES-8028", Guest: "Bpk. Jonatan Christie", Flag: "WNI 🇮🇩", Contact: "jonatan.c@badminton.id", Room: "Standard Double 201", CheckIn: "2026-08-18", CheckOut: "2026-08-21", Dates: "2026-08-18 s/d 2026-08-21", Created: "Traveloka Engine", CreatedTime: "18 Aug 2026 16:45 WIB", Updated: "Bambang Sutrisno (FO)", UpdatedTime: "21 Aug 2026 11:30 WIB", Status: "Completed", StatusBg: "bg-slate-100 text-slate-700", Total: "Rp 4.200.000", ActionText: "Detail Folio", Channel: "Traveloka"},
		{Code: "#RES-8050", Guest: "Bpk. Ridwan Kamil", Flag: "WNI 🇮🇩", Contact: "rk@bandung.go.id", Room: "Presidential Suite 501", CheckIn: "2026-08-15", CheckOut: "2026-08-18", Dates: "2026-08-15 s/d 2026-08-18", Created: "Direct Web (Auto)", CreatedTime: "15 Aug 2026 14:00 WIB", Updated: "System Auto-Seed", UpdatedTime: "18 Aug 2026 12:00 WIB", Status: "Completed", StatusBg: "bg-slate-100 text-slate-700", Total: "Rp 19.500.000", ActionText: "Detail Folio", Channel: "Direct Web"},
		{Code: "#RES-8092", Guest: "Mr. Alexander Wright", Flag: "WNA 🇬🇧", Contact: "alex.wright@email.com", Room: "Executive Suite 402", CheckIn: "2026-08-29", CheckOut: "2026-09-02", Dates: "2026-08-29 s/d 2026-09-02", Created: "Direct Web (Auto)", CreatedTime: "29 Aug 2026 14:00 WIB", Updated: "System Auto-Seed", UpdatedTime: "29 Aug 2026 20:15 WIB", Status: "Checked In", StatusBg: "bg-emerald-100 text-emerald-800", Total: "Rp 12.800.000", ActionText: "Check Out", Channel: "Direct Web"},
		{Code: "#RES-8093", Guest: "Bpk. Dudung Suherman", Flag: "WNI 🇮🇩", Contact: "dudung@email.com", Room: "Deluxe King 305", CheckIn: "2026-08-30", CheckOut: "2026-09-03", Dates: "2026-08-30 s/d 2026-09-03", Created: "Agoda API Engine", CreatedTime: "29 Aug 2026 15:30 WIB", Updated: "Bambang Sutrisno (FO)", UpdatedTime: "29 Aug 2026 21:00 WIB", Status: "Confirmed", StatusBg: "bg-amber-100 text-amber-900", Total: "Rp 7.600.000", ActionText: "Check In", Channel: "Agoda"},
		{Code: "#RES-8095", Guest: "Ms. Clara Oswald (OTA)", Flag: "WNA 🇬🇧", Contact: "clara@tardis.uk", Room: "Deluxe King 305", CheckIn: "2026-08-30", CheckOut: "2026-09-02", Dates: "2026-08-30 s/d 2026-09-02", Created: "Traveloka Engine", CreatedTime: "30 Aug 2026 08:00 WIB", Updated: "System Auto-Sync", UpdatedTime: "30 Aug 2026 08:00 WIB", Status: "Confirmed", StatusBg: "bg-sky-100 text-sky-900", Total: "Rp 5.700.000", ActionText: "Check In", Channel: "Traveloka"},
	}
	for _, b := range bookings {
		var existing models.Booking
		if err := db.Where("code = ?", b.Code).First(&existing).Error; err != nil {
			db.Create(&b)
		} else {
			db.Model(&existing).Updates(b)
		}
	}

	// 5. Seed Checklists
	checklists := []models.Checklist{
		{Category: "BEDROOM", TaskName: "Sprei & Selimut Baru Telah Terpasang (Fresh Linen)", IsMandatory: true, CreatedBy: "Siti Rahma (Supervisor)", CreatedAt: now.Add(-5 * 24 * time.Hour), UpdatedBy: "System Auto-Seed", UpdatedAt: now},
		{Category: "BATHROOM", TaskName: "Handuk Hand & Bath Towel Baru Disiapkan", IsMandatory: true, CreatedBy: "Siti Rahma (Supervisor)", CreatedAt: now.Add(-5 * 24 * time.Hour), UpdatedBy: "Siti Rahma (Supervisor)", UpdatedAt: now},
	}
	for _, c := range checklists {
		db.FirstOrCreate(&c, models.Checklist{TaskName: c.TaskName})
	}

	// 6. Seed Users
	users := []models.User{
		{Name: "Hendra Gunawan", Email: "hendra.gm@grandhorizon.com", Password: "password123", Role: "General Manager", EmpID: "EMP-001", Avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80", Status: "ACTIVE", CreatedBy: "System Superadmin", CreatedAt: now.Add(-30 * 24 * time.Hour), UpdatedBy: "System Auto-Seed", UpdatedAt: now},
		{Name: "Sarah Jenkins", Email: "sarah.j@grandhorizon.com", Password: "password123", Role: "Front Desk Manager", EmpID: "EMP-004", Avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80", Status: "ACTIVE", CreatedBy: "System Superadmin", CreatedAt: now.Add(-20 * 24 * time.Hour), UpdatedBy: "System Auto-Seed", UpdatedAt: now},
		{Name: "Bambang Sutrisno", Email: "bambang.s@grandhorizon.com", Password: "password123", Role: "Front Desk Agent", EmpID: "EMP-012", Avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80", Status: "ACTIVE", CreatedBy: "System Superadmin", CreatedAt: now.Add(-15 * 24 * time.Hour), UpdatedBy: "System Auto-Seed", UpdatedAt: now},
	}
	for _, u := range users {
		var existing models.User
		if err := db.Where("email = ?", u.Email).First(&existing).Error; err != nil {
			db.Create(&u)
		} else {
			db.Model(&existing).Updates(map[string]interface{}{
				"password": u.Password,
				"avatar":   u.Avatar,
			})
		}
	}

	// 7. Seed PricingRules
	pricingRules := []models.PricingRule{
		{Name: "Weekend Surge Pricing", Condition: "Sabtu & Minggu", Adjustment: "+25% Tarif Dasar", AppliedRooms: "Semua Tipe Kamar", Status: true, CreatedBy: "System Superadmin (Auto-Seed)", CreatedAt: now.Add(-10 * 24 * time.Hour), UpdatedBy: "System Auto-Seed", UpdatedAt: now},
		{Name: "High Season Holiday Surge", Condition: "Okupansi > 85%", Adjustment: "+40% Tarif Dasar", AppliedRooms: "Executive Suite & Deluxe King", Status: true, CreatedBy: "System Superadmin (Auto-Seed)", CreatedAt: now.Add(-10 * 24 * time.Hour), UpdatedBy: "System Auto-Seed", UpdatedAt: now},
		{Name: "Early Bird Direct Discount", Condition: "Pemesanan 30 Hari Sebelum Check-In", Adjustment: "-15% Potongan Harga", AppliedRooms: "Direct Web Engine", Status: true, CreatedBy: "System Superadmin (Auto-Seed)", CreatedAt: now.Add(-10 * 24 * time.Hour), UpdatedBy: "System Auto-Seed", UpdatedAt: now},
	}
	for _, pr := range pricingRules {
		db.FirstOrCreate(&pr, models.PricingRule{Name: pr.Name})
	}

	// 8. Seed Guests
	guests := []models.Guest{
		{Name: "Alexander Wright", Identity: "3273019827361928 (KTP)", Phone: "+62 812-9988-7711", Email: "a.wright@horizon.com", Nationality: "🇮🇩 WNI", TotalStays: 12, TotalSpend: "Rp 45.800.000", Tier: "💎 VIP DIAMOND", CreatedBy: "System Auto-Seed", CreatedAt: now.Add(-60 * 24 * time.Hour), UpdatedBy: "System Auto-Seed", UpdatedAt: now},
		{Name: "Siti Rahmawati", Identity: "3204918273641092 (KTP)", Phone: "+62 856-1122-3344", Email: "siti.rahma@gmail.com", Nationality: "🇮🇩 WNI", TotalStays: 8, TotalSpend: "Rp 18.500.000", Tier: "🥇 GOLD MEMBER", CreatedBy: "System Auto-Seed", CreatedAt: now.Add(-40 * 24 * time.Hour), UpdatedBy: "System Auto-Seed", UpdatedAt: now},
		{Name: "John Doe", Identity: "A89102931 (PASPOR)", Phone: "+1 415-555-0192", Email: "johndoe@global.com", Nationality: "🇬🇧 WNA (UK)", TotalStays: 5, TotalSpend: "Rp 32.000.000", Tier: "🥇 GOLD MEMBER", CreatedBy: "System Auto-Seed", CreatedAt: now.Add(-30 * 24 * time.Hour), UpdatedBy: "System Auto-Seed", UpdatedAt: now},
	}
	for _, g := range guests {
		db.FirstOrCreate(&g, models.Guest{Identity: g.Identity})
	}

	// 9. Seed RolePermissions
	rolePermissions := []models.RolePermission{
		{Module: "Master Reservasi & Kalender", Description: "Lihat, tambah, & ubah reservasi menginap tamu", GM: true, FO: true, HK: false, NA: true},
		{Module: "Registration Card Check-In (WNI/WNA)", Description: "Form registrasi KTP/Paspor & deposit jaminan", GM: true, FO: true, HK: false, NA: false},
		{Module: "Inventaris Kamar & Encoder Keycard RFID", Description: "Manajemen unit kamar & tap encoder smart lock", GM: true, FO: true, HK: true, NA: false},
		{Module: "Inspeksi & SOP Housekeeping", Description: "Update status kebersihan kamar & log perbaikan OOO", GM: true, FO: false, HK: true, NA: false},
		{Module: "Pusat Analitik & Laporan Keuangan", Description: "Export Excel CSV & grafik revenue okupansi", GM: true, FO: false, HK: false, NA: true},
		{Module: "Dynamic Pricing Engine", Description: "Pengaturan tarif dasar & penyesuaian weekday/weekend", GM: true, FO: false, HK: false, NA: true},
		{Module: "Manajemen Akun Staf & Matriks RBAC", Description: "Tambah staf baru & ubah hak akses peran operasional", GM: true, FO: false, HK: false, NA: false},
	}
	for _, rp := range rolePermissions {
		db.FirstOrCreate(&rp, models.RolePermission{Module: rp.Module})
	}

	// 10. Seed ChecklistCategories
	checklistCategories := []models.ChecklistCategory{
		{Code: "BEDROOM", Name: "BEDROOM (Kamar Tidur)", CreatedBy: "Siti Rahma (Supervisor)"},
		{Code: "BATHROOM", Name: "BATHROOM (Kamar Mandi)", CreatedBy: "Siti Rahma (Supervisor)"},
		{Code: "BALCONY", Name: "BALCONY & MINIBAR", CreatedBy: "Siti Rahma (Supervisor)"},
		{Code: "SANITATION", Name: "SANITATION & DISINFECT", CreatedBy: "Siti Rahma (Supervisor)"},
	}
	for _, cc := range checklistCategories {
		db.FirstOrCreate(&cc, models.ChecklistCategory{Code: cc.Code})
	}

	// 11. Seed AuditLogs
	auditLogs := []models.AuditLog{
		{User: "Sarah Jenkins (FO)", Action: "CHECK_IN_GUEST", Module: "Reservasi", Details: "Check-in resmi tamu Alexander Wright (Kamar 301 Executive Suite). Deposit Rp 1.000.000 (QRIS).", IPAddress: "192.168.1.104", CreatedAt: now.Add(-2 * time.Hour)},
		{User: "Sarah Jenkins (FO)", Action: "KEYCARD_ENCODED", Module: "Smart Lock RFID", Details: "Keycard RFID #881920 di-encode untuk Kamar 301 (Berlaku s/d 31 Agu 2026).", IPAddress: "192.168.1.104", CreatedAt: now.Add(-2 * time.Hour)},
		{User: "Hendra Gunawan (GM)", Action: "PRICING_RULE_TOGGLED", Module: "Dynamic Pricing", Details: "Aktifkan aturan 'Weekend Surge Pricing (+25%)' di Dynamic Pricing Engine.", IPAddress: "192.168.1.101", CreatedAt: now.Add(-5 * time.Hour)},
		{User: "Siti Rahma (Supervisor)", Action: "HOUSEKEEPING_INSPECTED", Module: "Housekeeping", Details: "Inspeksi kebersihan Kamar 204 selesai. Status diubah dari CLEANING ke VACANT READY.", IPAddress: "192.168.1.110", CreatedAt: now.Add(-8 * time.Hour)},
		{User: "Rina Anggraini (NA)", Action: "NIGHT_AUDIT_EXECUTED", Module: "Night Audit", Details: "Eksekusi Night Audit EOD Lock harian. Total 126 folio diposting otomatis.", IPAddress: "192.168.1.105", CreatedAt: now.Add(-24 * time.Hour)},
	}
	for _, al := range auditLogs {
		db.FirstOrCreate(&al, models.AuditLog{Details: al.Details})
	}

	// 12. Seed HotelProfile
	var count int64
	db.Model(&models.HotelProfile{}).Count(&count)
	if count == 0 {
		profile := models.HotelProfile{
			Name:               "Grand Horizon Resort & Suite",
			PropertyType:       "5-Star Luxury Beachfront Resort",
			StarRating:         5,
			Tagline:            "Experience Unmatched Luxury & World-Class Hospitality",
			LogoURL:            "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80",
			BannerURL:          "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
			EstablishedYear:    2018,
			Address:            "Jl. Sunset Boulevard No. 88, Kawasan Nusa Dua Resort",
			City:               "Kabupaten Badung",
			Province:           "Bali",
			Country:            "Indonesia 🇮🇩",
			PostalCode:         "80363",
			Phone:              "+62 (0361) 894-7700",
			WhatsApp:           "+62 811-9988-7700",
			Email:              "info@grandhorizon.com",
			ReservationEmail:   "reservation@grandhorizon.com",
			Website:            "https://www.grandhorizon.com",
			MapsURL:            "https://maps.google.com/?q=-8.796,115.231",
			CheckInTime:        "14:00 WITA",
			CheckOutTime:       "12:00 WITA",
			Currency:           "IDR (Rp)",
			Timezone:           "Asia/Makassar (WITA)",
			DepositPolicy:      "Wajib deposit jaminan sebesar Rp 500.000 / malam via Tunai, Kartu Kredit, atau QRIS saat Check-In.",
			CancellationPolicy: "Pembatalan gratis hingga 48 jam sebelum tanggal check-in. Pembatalan H-1 dikenakan biaya 1 malam.",
			PetPolicy:          "Dilarang membawa hewan peliharaan (Non-Pet Friendly Property).",
			TaxRate:            10.0,
			ServiceChargeRate:  10.0,
			TaxID:              "01.892.341.2-018.000 (NPWP)",
			BankName:           "Bank Mandiri (Persero) Tbk",
			BankAccountName:    "PT GRAND HORIZON INTERNATIONAL",
			BankAccountNumber:       "145-00-998822-11",
			Amenities:               "Infinity Pool,Luxury Spa & Wellness,Fitness Center 24/7,Private Beach Access,Fine Dining Restaurant,Helipad Access,Meeting & Ballroom,Free Wi-Fi 6,Airport Transfer Service",
			LateCheckoutGraceTime:   "13:00",
			LateCheckoutHalfdayPct:  50.0,
			LateCheckoutFulldayTime: "18:00",
			LateCheckoutFulldayPct:  100.0,
			UpdatedBy:               "System Auto-Seed",
			UpdatedAt:               now,
		}
		db.Create(&profile)
	} else {
		// Ensure late check-out defaults exist
		var existing models.HotelProfile
		if err := db.First(&existing).Error; err == nil {
			if existing.LateCheckoutGraceTime == "" {
				db.Model(&existing).Updates(map[string]interface{}{
					"late_checkout_grace_time":   "13:00",
					"late_checkout_halfday_pct":  50.0,
					"late_checkout_fullday_time": "18:00",
					"late_checkout_fullday_pct":  100.0,
				})
			}
		}
	}

	var menuCount int64
	db.Model(&models.MenuItem{}).Count(&menuCount)
	if menuCount == 0 {
		menuItems := []models.MenuItem{
			{Name: "Nasi Goreng Wagyu Special", Category: "Makanan", Price: 125000, ImageURL: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=400&q=80", IsActive: true, CreatedBy: "System Auto-Seed", CreatedAt: now, UpdatedBy: "System Auto-Seed", UpdatedAt: now},
			{Name: "Sop Buntut Premium Horizon", Category: "Makanan", Price: 185000, ImageURL: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=400&q=80", IsActive: true, CreatedBy: "System Auto-Seed", CreatedAt: now, UpdatedBy: "System Auto-Seed", UpdatedAt: now},
			{Name: "Club Sandwich & French Fries", Category: "Makanan", Price: 95000, ImageURL: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&q=80", IsActive: true, CreatedBy: "System Auto-Seed", CreatedAt: now, UpdatedBy: "System Auto-Seed", UpdatedAt: now},
			{Name: "Es Teh Manis Tropical Lychee", Category: "Minuman", Price: 35000, ImageURL: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80", IsActive: true, CreatedBy: "System Auto-Seed", CreatedAt: now, UpdatedBy: "System Auto-Seed", UpdatedAt: now},
			{Name: "Double Espresso Artisan Coffee", Category: "Minuman", Price: 45000, ImageURL: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80", IsActive: true, CreatedBy: "System Auto-Seed", CreatedAt: now, UpdatedBy: "System Auto-Seed", UpdatedAt: now},
			{Name: "Matcha Lava Cake & Gelato", Category: "Dessert", Price: 65000, ImageURL: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80", IsActive: true, CreatedBy: "System Auto-Seed", CreatedAt: now, UpdatedBy: "System Auto-Seed", UpdatedAt: now},
			{Name: "In-Room Dining Breakfast Package", Category: "Room Service", Price: 150000, ImageURL: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=400&q=80", IsActive: true, CreatedBy: "System Auto-Seed", CreatedAt: now, UpdatedBy: "System Auto-Seed", UpdatedAt: now},
		}
		for _, m := range menuItems {
			db.Create(&m)
		}
	}

	// Seed Services
	var serviceCount int64
	db.Model(&models.HotelService{}).Count(&serviceCount)
	if serviceCount == 0 {
		services := []models.HotelService{
			{Name: "Express Laundry & Press (Cuci Kilat 6 Jam)", Type: "LAUNDRY", UnitPrice: 45000, Unit: "Kg", ImageURL: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=400&q=80", IsActive: true, CreatedBy: "System Auto-Seed", CreatedAt: now, UpdatedBy: "System Auto-Seed", UpdatedAt: now},
			{Name: "Dry Cleaning Setelan Jas / Gaun", Type: "LAUNDRY", UnitPrice: 85000, Unit: "Pcs", ImageURL: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=400&q=80", IsActive: true, CreatedBy: "System Auto-Seed", CreatedAt: now, UpdatedBy: "System Auto-Seed", UpdatedAt: now},
			{Name: "Traditional Balinese Massage (90 Menit)", Type: "SPA", UnitPrice: 350000, Unit: "Session", ImageURL: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80", IsActive: true, CreatedBy: "System Auto-Seed", CreatedAt: now, UpdatedBy: "System Auto-Seed", UpdatedAt: now},
			{Name: "Aromatherapy Body Scrub & Sauna", Type: "SPA", UnitPrice: 420000, Unit: "Paket", ImageURL: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=400&q=80", IsActive: true, CreatedBy: "System Auto-Seed", CreatedAt: now, UpdatedBy: "System Auto-Seed", UpdatedAt: now},
			{Name: "Foot Reflexology Therapy (60 Menit)", Type: "SPA", UnitPrice: 220000, Unit: "Session", ImageURL: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=400&q=80", IsActive: true, CreatedBy: "System Auto-Seed", CreatedAt: now, UpdatedBy: "System Auto-Seed", UpdatedAt: now},
		}
		for _, s := range services {
			db.Create(&s)
		}
	}

	// Seed Lost & Found
	var lostCount int64
	db.Model(&models.LostItem{}).Count(&lostCount)
	if lostCount == 0 {
		lostItems := []models.LostItem{
			{ItemCode: "LNF-20260828-01", ItemName: "Charger Macbook Pro 96W USB-C", Category: "Elektronik", RoomNumber: "402", FounderName: "Siti Rahma (Housekeeping)", Description: "Tertinggal di meja kerja samping tempat tidur", FoundDate: "28 Agu 2026", Status: "DITEMUKAN", CreatedBy: "System Auto-Seed", CreatedAt: now},
			{ItemCode: "LNF-20260829-02", ItemName: "Jam Tangan Fossil Kulit Cokelat", Category: "Perhiasan", RoomNumber: "305", FounderName: "Budi Santoso (Housekeeping)", Description: "Ditemukan di dalam laci meja rias", FoundDate: "29 Agu 2026", Status: "DIHUBUNGI", CreatedBy: "System Auto-Seed", CreatedAt: now},
			{ItemCode: "LNF-20260825-03", ItemName: "Kacamata Hitam RayBan Aviator", Category: "Aksesoris", RoomNumber: "201", FounderName: "Tim Housekeeping", Description: "Tertinggal di area sunbed kolam renang", FoundDate: "25 Agu 2026", Status: "DIAMBIL", ClaimedByGuest: "Alexander Wright", ClaimedAt: now, Notes: "Diambil langsung di Front Desk dengan verifikasi KTP", CreatedBy: "System Auto-Seed", CreatedAt: now},
		}
		for _, l := range lostItems {
			db.Create(&l)
		}
	}

	log.Println("Seeding completed successfully!")
}
