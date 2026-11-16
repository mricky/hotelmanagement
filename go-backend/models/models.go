package models

import (
	"time"
)

type Room struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Number    string    `gorm:"uniqueIndex;not null" json:"number"`
	Type      string    `json:"type"`
	Status    string    `json:"status"` // OCCUPIED, VACANT, CLEANING, OOO
	Rate      float64   `json:"rate"`
	ImageURL  string    `json:"image_url"`
	ImageURLs string    `json:"image_urls"`
	CreatedBy string    `json:"created_by"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedBy string    `json:"updated_by"`
	UpdatedAt time.Time `json:"updated_at"`
}

type RoomType struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"uniqueIndex;not null" json:"name"`
	BaseRate  float64   `json:"base_rate"`
	Capacity  string    `json:"capacity"`
	Bed       string    `json:"bed"`
	CreatedBy string    `json:"created_by"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedBy string    `json:"updated_by"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Floor struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	FloorCode  string    `gorm:"uniqueIndex;not null" json:"floor_code"`
	Name       string    `json:"name"`
	Range      string    `json:"range"`
	UnitCount  int       `json:"unit_count"`
	Supervisor string    `json:"supervisor"`
	CreatedBy  string    `json:"created_by"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedBy  string    `json:"updated_by"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type Booking struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Code        string    `gorm:"uniqueIndex;not null" json:"code"`
	Guest       string    `json:"guest"`
	Flag        string    `json:"flag"` // WNI 🇮🇩, WNA 🇬🇧, etc.
	Contact     string    `json:"contact"`
	Room        string    `json:"room"`
	CheckIn     string    `gorm:"column:check_in" json:"check_in"`  // YYYY-MM-DD
	CheckOut    string    `gorm:"column:check_out" json:"check_out"` // YYYY-MM-DD
	Dates       string    `json:"dates"`
	Created     string    `json:"created"`
	CreatedTime string    `json:"created_time"`
	Updated     string    `json:"updated"`
	UpdatedTime string    `json:"updated_time"`
	Status      string    `json:"status"` // Checked In, Confirmed, Completed
	StatusBg    string    `json:"statusBg"`
	Total       string    `json:"total"`
	ActionText  string    `json:"actionText"`
	Channel     string    `json:"channel"` // Direct Web, Agoda, Traveloka, Walk-In
	CreatedBy   string    `json:"created_by"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedBy   string    `json:"updated_by"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Checklist struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Category    string    `json:"category"`
	TaskName    string    `json:"task_name"`
	IsMandatory bool      `json:"is_mandatory"`
	CreatedBy   string    `json:"created_by"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedBy   string    `json:"updated_by"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type ChecklistCategory struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Code      string    `gorm:"uniqueIndex;not null" json:"code"`
	Name      string    `json:"name"`
	CreatedBy string    `json:"created_by"`
	CreatedAt time.Time `json:"created_at"`
}

type AuditLog struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	User      string    `json:"user"`
	Action    string    `json:"action"`
	Module    string    `json:"module"`
	Details   string    `json:"details"`
	IPAddress string    `json:"ip_address"`
	CreatedAt time.Time `json:"created_at"`
}

type User struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `json:"name"`
	Email     string    `gorm:"uniqueIndex;not null" json:"email"`
	Password  string    `json:"password,omitempty"`
	Role      string    `json:"role"`
	EmpID     string    `json:"emp_id"`
	Avatar    string    `json:"avatar"`
	Status    string    `json:"status"`
	CreatedBy string    `json:"created_by"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedBy string    `json:"updated_by"`
	UpdatedAt time.Time `json:"updated_at"`
}

type PricingRule struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Name         string    `json:"name"`
	Condition    string    `json:"condition"`
	Adjustment   string    `json:"adjustment"`
	AppliedRooms string    `json:"applied_rooms"`
	Status       bool      `json:"status"`
	CreatedBy    string    `json:"created_by"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedBy    string    `json:"updated_by"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type Guest struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Name        string    `json:"name"`
	Identity    string    `gorm:"uniqueIndex;not null" json:"identity"`
	Phone       string    `json:"phone"`
	Email       string    `json:"email"`
	Nationality string    `json:"nationality"`
	TotalStays  int       `json:"total_stays"`
	TotalSpend  string    `json:"total_spend"`
	Tier        string    `json:"tier"`
	CreatedBy   string    `json:"created_by"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedBy   string    `json:"updated_by"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type RolePermission struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Module      string `gorm:"uniqueIndex;not null" json:"module"`
	Description string `json:"description"`
	GM          bool   `json:"gm"`
	FO          bool   `json:"fo"`
	HK          bool   `json:"hk"`
	NA          bool   `json:"na"`
}

type HotelProfile struct {
	ID                 uint      `gorm:"primaryKey" json:"id"`
	Name               string    `json:"name"`
	PropertyType       string    `json:"property_type"`
	StarRating         int       `json:"star_rating"`
	Tagline            string    `json:"tagline"`
	LogoURL            string    `json:"logo_url"`
	BannerURL          string    `json:"banner_url"`
	EstablishedYear    int       `json:"established_year"`
	Address            string    `json:"address"`
	City               string    `json:"city"`
	Province           string    `json:"province"`
	Country            string    `json:"country"`
	PostalCode         string    `json:"postal_code"`
	Phone              string    `json:"phone"`
	WhatsApp           string    `json:"whatsapp"`
	Email              string    `json:"email"`
	ReservationEmail   string    `json:"reservation_email"`
	Website            string    `json:"website"`
	MapsURL            string    `json:"maps_url"`
	CheckInTime        string    `json:"check_in_time"`
	CheckOutTime       string    `json:"check_out_time"`
	Currency           string    `json:"currency"`
	Timezone           string    `json:"timezone"`
	DepositPolicy      string    `json:"deposit_policy"`
	CancellationPolicy string    `json:"cancellation_policy"`
	PetPolicy          string    `json:"pet_policy"`
	TaxRate            float64   `json:"tax_rate"`
	ServiceChargeRate  float64   `json:"service_charge_rate"`
	TaxID                   string    `json:"tax_id"`
	BankName                string    `json:"bank_name"`
	BankAccountName         string    `json:"bank_account_name"`
	BankAccountNumber       string    `json:"bank_account_number"`
	Amenities               string    `json:"amenities"` // Comma-separated or JSON list of amenities
	LateCheckoutGraceTime   string    `json:"late_checkout_grace_time"`   // e.g. "13:00"
	LateCheckoutHalfdayPct  float64   `json:"late_checkout_halfday_pct"`  // e.g. 50.0 (%)
	LateCheckoutFulldayTime string    `json:"late_checkout_fullday_time"` // e.g. "18:00"
	LateCheckoutFulldayPct  float64   `json:"late_checkout_fullday_pct"`  // e.g. 100.0 (%)
	UpdatedBy               string    `json:"updated_by"`
	UpdatedAt               time.Time `json:"updated_at"`
}

type MenuItem struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `json:"name"`
	Category  string    `json:"category"` // Makanan, Minuman, Dessert, Room Service
	Price     float64   `json:"price"`
	ImageURL  string    `json:"image_url"`
	IsActive  bool      `json:"is_active"`
	CreatedBy string    `json:"created_by"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedBy string    `json:"updated_by"`
	UpdatedAt time.Time `json:"updated_at"`
}

type POSOrder struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	OrderNumber   string    `gorm:"uniqueIndex;not null" json:"order_number"`
	RoomNumber    string    `json:"room_number"`
	GuestName     string    `json:"guest_name"`
	ItemsJSON     string    `json:"items_json"`
	Subtotal      float64   `json:"subtotal"`
	ServiceCharge float64   `json:"service_charge"`
	Tax           float64   `json:"tax"`
	GrandTotal    float64   `json:"grand_total"`
	PaymentMethod string    `json:"payment_method"` // CHARGE_TO_ROOM, QRIS, CASH, CARD
	Status        string    `json:"status"`         // POSTED_TO_FOLIO, PAID
	CreatedBy     string    `json:"created_by"`
	CreatedAt     time.Time `json:"created_at"`
}

type HotelService struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `json:"name"`
	Type      string    `json:"type"` // LAUNDRY, SPA
	UnitPrice float64   `json:"unit_price"`
	Unit      string    `json:"unit"` // Kg, Pcs, Session, Paket
	ImageURL  string    `json:"image_url"`
	IsActive  bool      `json:"is_active"`
	CreatedBy string    `json:"created_by"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedBy string    `json:"updated_by"`
	UpdatedAt time.Time `json:"updated_at"`
}

type ServiceOrder struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	OrderNumber   string    `gorm:"uniqueIndex;not null" json:"order_number"`
	ServiceType   string    `json:"service_type"` // LAUNDRY, SPA
	RoomNumber    string    `json:"room_number"`
	GuestName     string    `json:"guest_name"`
	ItemsJSON     string    `json:"items_json"`
	Subtotal      float64   `json:"subtotal"`
	Tax           float64   `json:"tax"`
	GrandTotal    float64   `json:"grand_total"`
	PaymentMethod string    `json:"payment_method"` // CHARGE_TO_ROOM, QRIS, CASH
	Status        string    `json:"status"`         // POSTED_TO_FOLIO, PAID
	Notes         string    `json:"notes"`
	CreatedBy     string    `json:"created_by"`
	CreatedAt     time.Time `json:"created_at"`
}

type LostItem struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	ItemCode       string    `gorm:"uniqueIndex;not null" json:"item_code"`
	ItemName       string    `json:"item_name"`
	Category       string    `json:"category"` // Elektronik, Perhiasan, Pakaian, Dokumen, Lainnya
	RoomNumber     string    `json:"room_number"`
	FounderName    string    `json:"founder_name"`
	Description    string    `json:"description"`
	FoundDate      string    `json:"found_date"`
	Status         string    `json:"status"` // DITEMUKAN, DIHUBUNGI, DIAMBIL, DISPOSABLE
	ClaimedByGuest string    `json:"claimed_by_guest"`
	ClaimedAt      time.Time `json:"claimed_at"`
	Notes          string    `json:"notes"`
	CreatedBy      string    `json:"created_by"`
	CreatedAt      time.Time `json:"created_at"`
}

type APIAccessLog struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	Method     string    `gorm:"size:10;not null" json:"method"`      // GET, POST, PUT, DELETE
	Endpoint   string    `gorm:"size:255;not null" json:"endpoint"`  // /api/v1/rooms
	StatusCode int       `gorm:"not null" json:"status_code"`         // 200, 201, 400, 500
	LatencyMs  float64   `gorm:"type:decimal(10,2)" json:"latency_ms"`// 1.25
	ClientIP   string    `gorm:"size:50" json:"client_ip"`           // ::1
	UserAgent  string    `gorm:"size:255" json:"user_agent"`
	CreatedAt  time.Time `gorm:"autoCreateTime" json:"created_at"`
}

type IdempotencyRecord struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Key          string    `gorm:"uniqueIndex;size:255;not null" json:"key"`
	Endpoint     string    `gorm:"size:255;not null" json:"endpoint"`
	Method       string    `gorm:"size:10;not null" json:"method"`
	StatusCode   int       `gorm:"not null" json:"status_code"`
	ResponseBody string    `gorm:"type:text" json:"response_body"`
	CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"`
}


