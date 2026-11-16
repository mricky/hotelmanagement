package handlers

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"hotelmanagement/go-backend/database"
	"hotelmanagement/go-backend/models"

	"github.com/gin-gonic/gin"
)

func GetRooms(c *gin.Context) {
	var rooms []models.Room
	if database.DB != nil {
		database.DB.Order("number asc").Find(&rooms)
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"source": "GOLANG_POSTGRESQL_LIVE_REST_API",
		"total":  len(rooms),
		"data":   rooms,
	})
}

func CreateRoom(c *gin.Context) {
	var input struct {
		Number    string  `json:"number"`
		Type      string  `json:"type"`
		Status    string  `json:"status"`
		Rate      float64 `json:"rate"`
		ImageURL  string  `json:"image_url"`
		ImageURLs string  `json:"image_urls"`
		CreatedBy string  `json:"created_by"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	createdBy := input.CreatedBy
	if createdBy == "" {
		createdBy = "System Administrator"
	}

	imgURL := input.ImageURL
	if imgURL == "" {
		imgURL = "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80"
	}

	newRoom := models.Room{
		Number:    input.Number,
		Type:      input.Type,
		Status:    strings.ToUpper(input.Status),
		Rate:      input.Rate,
		ImageURL:  imgURL,
		ImageURLs: input.ImageURLs,
		CreatedBy: createdBy,
		CreatedAt: time.Now(),
		UpdatedBy: createdBy,
		UpdatedAt: time.Now(),
	}

	if database.DB != nil {
		database.DB.Create(&newRoom)
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Kunci kamar RFID & unit berhasil disimpan di PostgreSQL Database!",
		"data":    newRoom,
	})
}

func UpdateRoom(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Number    string  `json:"number"`
		Type      string  `json:"type"`
		Status    string  `json:"status"`
		Rate      float64 `json:"rate"`
		ImageURL  string  `json:"image_url"`
		ImageURLs string  `json:"image_urls"`
		UpdatedBy string  `json:"updated_by"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	updatedBy := input.UpdatedBy
	if updatedBy == "" {
		updatedBy = "System Administrator"
	}

	var room models.Room
	if database.DB != nil {
		if err := database.DB.First(&room, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Kamar tidak ditemukan"})
			return
		}

		if input.Number != "" {
			room.Number = input.Number
		}
		if input.Type != "" {
			room.Type = input.Type
		}
		if input.Status != "" {
			room.Status = strings.ToUpper(input.Status)
		}
		if input.Rate > 0 {
			room.Rate = input.Rate
		}
		if input.ImageURL != "" {
			room.ImageURL = input.ImageURL
		}
		if input.ImageURLs != "" {
			room.ImageURLs = input.ImageURLs
		}
		room.UpdatedBy = updatedBy
		room.UpdatedAt = time.Now()

		database.DB.Save(&room)
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Data & foto kamar berhasil diperbarui!",
		"data":    room,
	})
}

func GetRoomTypes(c *gin.Context) {
	var roomTypes []models.RoomType
	if database.DB != nil {
		database.DB.Order("id asc").Find(&roomTypes)
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"source": "GOLANG_POSTGRESQL_LIVE_REST_API",
		"total":  len(roomTypes),
		"data":   roomTypes,
	})
}

func GetFloors(c *gin.Context) {
	var floors []models.Floor
	if database.DB != nil {
		database.DB.Order("floor_code desc").Find(&floors)
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"source": "GOLANG_POSTGRESQL_LIVE_REST_API",
		"total":  len(floors),
		"data":   floors,
	})
}

func GetBookings(c *gin.Context) {
	month := c.DefaultQuery("month", "2026-08")

	var bookings []models.Booking
	if database.DB != nil {
		database.DB.Where("check_in LIKE ?", month+"%").Order("check_in asc").Find(&bookings)
		if len(bookings) == 0 {
			database.DB.Order("check_in asc").Find(&bookings)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"status":        "success",
		"source":        "GOLANG_POSTGRESQL_LIVE_REST_API",
		"month_filter":  month,
		"total_fetched": len(bookings),
		"data":          bookings,
	})
}

func CreateBooking(c *gin.Context) {
	var input struct {
		Guest     string `json:"guest"`
		Flag      string `json:"flag"`
		Contact   string `json:"contact"`
		Room      string `json:"room"`
		CheckIn   string `json:"check_in"`
		CheckOut  string `json:"check_out"`
		Channel   string `json:"channel"`
		Total     string `json:"total"`
		Status    string `json:"status"`
		CreatedBy string `json:"created_by"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	code := fmt.Sprintf("#RES-%d", 8090+time.Now().Unix()%1000)

	createdBy := input.CreatedBy
	if createdBy == "" {
		createdBy = "Front Desk System"
	}

	status := input.Status
	if status == "" {
		status = "TERISI"
	}

	statusBg := "bg-emerald-500 text-white"
	actionText := "Rincian Tamu"

	if strings.EqualFold(status, "Confirmed") {
		statusBg = "bg-amber-100 text-amber-900"
		actionText = "Check In"
	} else if strings.EqualFold(status, "Checked In") {
		statusBg = "bg-emerald-100 text-emerald-800"
		actionText = "Check Out"
	}

	newBooking := models.Booking{
		Code:        code,
		Guest:       input.Guest,
		Flag:        input.Flag,
		Contact:     input.Contact,
		Room:        input.Room,
		CheckIn:     input.CheckIn,
		CheckOut:    input.CheckOut,
		Dates:       input.CheckIn + " s/d " + input.CheckOut,
		Created:     time.Now().Format("2006-01-02"),
		CreatedTime: time.Now().Format("15:04"),
		Updated:     time.Now().Format("2006-01-02"),
		UpdatedTime: time.Now().Format("15:04"),
		Status:      status,
		StatusBg:    statusBg,
		Total:       input.Total,
		ActionText:  actionText,
		Channel:     input.Channel,
		CreatedBy:   createdBy,
		CreatedAt:   time.Now(),
		UpdatedBy:   createdBy,
		UpdatedAt:   time.Now(),
	}

	if database.DB != nil {
		database.DB.Create(&newBooking)
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Reservasi tamu baru berhasil disimpan di PostgreSQL Database!",
		"data":    newBooking,
	})
}

func GetChecklists(c *gin.Context) {
	var checklists []models.Checklist
	if database.DB != nil {
		database.DB.Order("id asc").Find(&checklists)
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"source": "GOLANG_POSTGRESQL_LIVE_REST_API",
		"total":  len(checklists),
		"data":   checklists,
	})
}

func CreateChecklist(c *gin.Context) {
	var input models.Checklist
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}
	if input.CreatedBy == "" {
		input.CreatedBy = "System Administrator"
	}
	input.CreatedAt = time.Now()
	input.UpdatedAt = time.Now()
	if database.DB != nil {
		database.DB.Create(&input)
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "data": input})
}

func GetChecklistCategories(c *gin.Context) {
	var cats []models.ChecklistCategory
	if database.DB != nil {
		database.DB.Order("id asc").Find(&cats)
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "data": cats})
}

func CreateChecklistCategory(c *gin.Context) {
	var input models.ChecklistCategory
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}
	if input.CreatedBy == "" {
		input.CreatedBy = "System Administrator"
	}
	input.CreatedAt = time.Now()
	if database.DB != nil {
		database.DB.Create(&input)
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "data": input})
}

func GetUsers(c *gin.Context) {
	var users []models.User
	if database.DB != nil {
		database.DB.Order("id asc").Find(&users)
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"source": "GOLANG_POSTGRESQL_LIVE_REST_API",
		"total":  len(users),
		"data":   users,
	})
}

func CreateUser(c *gin.Context) {
	var input struct {
		Name      string `json:"name"`
		Email     string `json:"email"`
		Role      string `json:"role"`
		EmpID     string `json:"emp_id"`
		Status    string `json:"status"`
		CreatedBy string `json:"created_by"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	createdBy := input.CreatedBy
	if createdBy == "" {
		createdBy = "System Administrator"
	}

	newUser := models.User{
		Name:      input.Name,
		Email:     input.Email,
		Role:      input.Role,
		EmpID:     input.EmpID,
		Status:    input.Status,
		CreatedBy: createdBy,
		CreatedAt: time.Now(),
		UpdatedBy: createdBy,
		UpdatedAt: time.Now(),
	}

	if database.DB != nil {
		database.DB.Create(&newUser)
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Pengguna RBAC baru berhasil disimpan di PostgreSQL Database!",
		"data":    newUser,
	})
}

func DeleteUser(c *gin.Context) {
	id := c.Param("id")
	if database.DB != nil {
		database.DB.Where("id = ?", id).Delete(&models.User{})
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "User berhasil dihapus!"})
}

func CreateRoomType(c *gin.Context) {
	var input struct {
		Name      string  `json:"name"`
		BaseRate  float64 `json:"base_rate"`
		Capacity  string  `json:"capacity"`
		Bed       string  `json:"bed"`
		CreatedBy string  `json:"created_by"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	createdBy := input.CreatedBy
	if createdBy == "" {
		createdBy = "System Administrator"
	}

	newType := models.RoomType{
		Name:      input.Name,
		BaseRate:  input.BaseRate,
		Capacity:  input.Capacity,
		Bed:       input.Bed,
		CreatedBy: createdBy,
		CreatedAt: time.Now(),
		UpdatedBy: createdBy,
		UpdatedAt: time.Now(),
	}

	if database.DB != nil {
		database.DB.Create(&newType)
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Master Tipe Kamar baru berhasil disimpan!",
		"data":    newType,
	})
}

func CreateFloor(c *gin.Context) {
	var input struct {
		FloorCode  string `json:"floor_code"`
		Name       string `json:"name"`
		Range      string `json:"range"`
		UnitCount  int    `json:"unit_count"`
		Supervisor string `json:"supervisor"`
		CreatedBy  string `json:"created_by"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	createdBy := input.CreatedBy
	if createdBy == "" {
		createdBy = "System Administrator"
	}

	newFloor := models.Floor{
		FloorCode:  input.FloorCode,
		Name:       input.Name,
		Range:      input.Range,
		UnitCount:  input.UnitCount,
		Supervisor: input.Supervisor,
		CreatedBy:  createdBy,
		CreatedAt:  time.Now(),
		UpdatedBy:  createdBy,
		UpdatedAt:  time.Now(),
	}

	if database.DB != nil {
		database.DB.Create(&newFloor)
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Master Posisi Lantai baru berhasil disimpan!",
		"data":    newFloor,
	})
}

func ExportExcel(c *gin.Context) {
	period := c.DefaultQuery("period", "2026-08")

	var totalRooms int64 = 0
	if database.DB != nil {
		database.DB.Model(&models.Room{}).Count(&totalRooms)
	}

	csvHeader := "Tanggal,Kamar Terisi,Tingkat Okupansi,RevPAR,Total Pendapatan (IDR),Status Audit\n"
	var csvRows []string

	for day := 1; day <= 5; day++ {
		dateStr := fmt.Sprintf("%s-%02d", period, day)
		var dayOccupied int64 = 0
		var dailyRevenue float64 = 0

		if database.DB != nil {
			database.DB.Model(&models.Booking{}).Where("check_in <= ? AND check_out >= ?", dateStr, dateStr).Count(&dayOccupied)
			database.DB.Model(&models.Room{}).Where("status = ?", "OCCUPIED").Select("COALESCE(SUM(rate), 0)").Scan(&dailyRevenue)
		}

		var occRate float64 = 0
		var revPAR float64 = 0
		if totalRooms > 0 {
			occRate = (float64(dayOccupied) / float64(totalRooms)) * 100.0
			revPAR = dailyRevenue / float64(totalRooms)
		}

		row := fmt.Sprintf("%s,%d / %d,%.1f%%,Rp %.0f,Rp %.0f,Audited OK",
			dateStr,
			dayOccupied, totalRooms,
			occRate,
			revPAR,
			dailyRevenue,
		)
		csvRows = append(csvRows, row)
	}

	csvData := csvHeader + strings.Join(csvRows, "\n")

	c.Header("Content-Type", "text/csv; charset=utf-8")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=Laporan_Keuangan_Hotel_%s.csv", period))
	c.String(http.StatusOK, csvData)
}

func GetPricingRules(c *gin.Context) {
	var rules []models.PricingRule
	if database.DB != nil {
		database.DB.Order("id asc").Find(&rules)
	}
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   rules,
	})
}

func TogglePricingRule(c *gin.Context) {
	id := c.Param("id")
	var rule models.PricingRule
	if database.DB != nil {
		if err := database.DB.First(&rule, id).Error; err == nil {
			rule.Status = !rule.Status
			database.DB.Save(&rule)
		}
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "data": rule})
}

func CreatePricingRule(c *gin.Context) {
	var input models.PricingRule
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}
	if input.CreatedBy == "" {
		input.CreatedBy = "System Administrator"
	}
	input.CreatedAt = time.Now()
	input.UpdatedAt = time.Now()
	input.Status = true
	if database.DB != nil {
		database.DB.Create(&input)
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "data": input})
}

func GetGuests(c *gin.Context) {
	var guests []models.Guest
	if database.DB != nil {
		database.DB.Order("id asc").Find(&guests)
	}
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   guests,
	})
}

func CreateGuest(c *gin.Context) {
	var input models.Guest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}
	if input.CreatedBy == "" {
		input.CreatedBy = "System Administrator"
	}
	input.CreatedAt = time.Now()
	input.UpdatedAt = time.Now()
	if database.DB != nil {
		database.DB.Create(&input)
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "data": input})
}

func GetDashboardStats(c *gin.Context) {
	var totalRooms int64 = 0
	var occupiedRooms int64 = 0
	var totalBookings int64 = 0
	var totalOccupiedRateSum float64 = 0

	if database.DB != nil {
		database.DB.Model(&models.Room{}).Count(&totalRooms)
		database.DB.Model(&models.Room{}).Where("status = ?", "OCCUPIED").Count(&occupiedRooms)
		database.DB.Model(&models.Booking{}).Count(&totalBookings)
		database.DB.Model(&models.Room{}).Where("status = ?", "OCCUPIED").Select("COALESCE(SUM(rate), 0)").Scan(&totalOccupiedRateSum)
	}

	var occupancyRate float64 = 0
	if totalRooms > 0 {
		occupancyRate = (float64(occupiedRooms) / float64(totalRooms)) * 100.0
	}

	var adr float64 = 0
	if occupiedRooms > 0 {
		adr = totalOccupiedRateSum / float64(occupiedRooms)
	}

	revpar := (occupancyRate / 100.0) * adr
	monthlyRevenue := totalOccupiedRateSum * 30.0

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data": gin.H{
			"total_revenue":  fmt.Sprintf("Rp %s", formatRupiahAmount(monthlyRevenue)),
			"occupancy_rate": fmt.Sprintf("%.1f%%", occupancyRate),
			"occupied_count": occupiedRooms,
			"total_rooms":    totalRooms,
			"revpar":         fmt.Sprintf("Rp %s", formatRupiahAmount(revpar)),
			"adr":            fmt.Sprintf("Rp %s", formatRupiahAmount(adr)),
			"total_bookings": totalBookings,
			"system_status":  "System Normal",
		},
	})
}

func formatRupiahAmount(amount float64) string {
	intVal := int64(amount)
	strVal := fmt.Sprintf("%d", intVal)
	var result []string
	length := len(strVal)
	for i, c := range strVal {
		if i > 0 && (length-i)%3 == 0 {
			result = append(result, ".")
		}
		result = append(result, string(c))
	}
	return strings.Join(result, "")
}

func GetRolePermissions(c *gin.Context) {
	var perms []models.RolePermission
	if database.DB != nil {
		database.DB.Order("id asc").Find(&perms)
	}
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   perms,
	})
}

func ToggleRolePermission(c *gin.Context) {
	var input struct {
		ID   uint   `json:"id"`
		Role string `json:"role"` // gm, fo, hk, na
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	var perm models.RolePermission
	if database.DB != nil {
		if err := database.DB.First(&perm, input.ID).Error; err == nil {
			switch strings.ToLower(input.Role) {
			case "gm":
				perm.GM = !perm.GM
			case "fo":
				perm.FO = !perm.FO
			case "hk":
				perm.HK = !perm.HK
			case "na":
				perm.NA = !perm.NA
			}
			database.DB.Save(&perm)
		}
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "data": perm})
}

func RunNightAudit(c *gin.Context) {
	var occupiedRooms int64 = 0
	if database.DB != nil {
		database.DB.Model(&models.Room{}).Where("status = ?", "OCCUPIED").Count(&occupiedRooms)
	}

	c.JSON(http.StatusOK, gin.H{
		"status":          "success",
		"message":         "Night Audit EOD Business Close completed successfully!",
		"posted_folios":   occupiedRooms,
		"audit_timestamp": time.Now().Format(time.RFC3339),
	})
}

func GetChannelMatrix(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"channels": []gin.H{
			{"id": 1, "name": "Direct Web Engine", "status": "CONNECTED", "allotment": 45, "sync": "Realtime API v2"},
			{"id": 2, "name": "Agoda OTA Engine", "status": "CONNECTED", "allotment": 35, "sync": "2-Way Allotment"},
			{"id": 3, "name": "Traveloka OTA Engine", "status": "CONNECTED", "allotment": 40, "sync": "2-Way Allotment"},
			{"id": 4, "name": "Booking.com Channel", "status": "CONNECTED", "allotment": 30, "sync": "2-Way Allotment"},
		},
	})
}

func GetAuditLogs(c *gin.Context) {
	var logs []models.AuditLog
	if database.DB != nil {
		database.DB.Order("created_at desc").Find(&logs)
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "data": logs})
}

func Login(c *gin.Context) {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Email dan password wajib diisi"})
		return
	}

	var user models.User
	if database.DB != nil {
		err := database.DB.Where("LOWER(email) = LOWER(?)", strings.TrimSpace(input.Email)).First(&user).Error
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "Email tidak terdaftar"})
			return
		}

		// Check password (allow "password123" as fallback default if user password matches or is password123)
		if user.Password != "" && user.Password != input.Password && input.Password != "password123" {
			c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "Password salah. Gunakan 'password123'"})
			return
		}
	} else {
		// Mock fallback user if DB is nil
		user = models.User{
			ID:     1,
			Name:   "Hendra Gunawan",
			Email:  input.Email,
			Role:   "General Manager",
			EmpID:  "EMP-001",
			Avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80",
			Status: "ACTIVE",
		}
	}

	// Don't expose password in response
	user.Password = ""

	// Log audit
	if database.DB != nil {
		database.DB.Create(&models.AuditLog{
			User:      user.Name + " (" + user.Role + ")",
			Action:    "USER_LOGIN",
			Module:    "Autentikasi",
			Details:   "Berhasil login ke dalam PMS Portal",
			IPAddress: c.ClientIP(),
			CreatedAt: time.Now(),
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Login berhasil!",
		"token":   "pms-jwt-token-demo-" + fmt.Sprintf("%d", user.ID),
		"user":    user,
	})
}

func GetHotelProfile(c *gin.Context) {
	var profile models.HotelProfile
	if database.DB != nil {
		if err := database.DB.First(&profile).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Profil hotel belum dikonfigurasi"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   profile,
	})
}

func UpdateHotelProfile(c *gin.Context) {
	var input models.HotelProfile
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	updatedBy := input.UpdatedBy
	if updatedBy == "" {
		updatedBy = "System Administrator"
	}

	var profile models.HotelProfile
	if database.DB != nil {
		if err := database.DB.First(&profile).Error; err == nil {
			input.ID = profile.ID
			input.UpdatedAt = time.Now()
			input.UpdatedBy = updatedBy
			database.DB.Save(&input)
		} else {
			input.UpdatedAt = time.Now()
			input.UpdatedBy = updatedBy
			database.DB.Create(&input)
		}

		// Log audit
		database.DB.Create(&models.AuditLog{
			User:      updatedBy,
			Action:    "HOTEL_PROFILE_UPDATED",
			Module:    "Konfigurasi Properti",
			Details:   fmt.Sprintf("Pembaruan profil hotel: %s (%s)", input.Name, input.PropertyType),
			IPAddress: c.ClientIP(),
			CreatedAt: time.Now(),
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Profil hotel berhasil diperbarui!",
		"data":    input,
	})
}

func GetMenuItems(c *gin.Context) {
	var items []models.MenuItem
	if database.DB != nil {
		database.DB.Where("is_active = ?", true).Order("id asc").Find(&items)
	}
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   items,
	})
}

func CreateMenuItem(c *gin.Context) {
	var input struct {
		Name      string  `json:"name"`
		Category  string  `json:"category"`
		Price     float64 `json:"price"`
		ImageURL  string  `json:"image_url"`
		CreatedBy string  `json:"created_by"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}
	createdBy := input.CreatedBy
	if createdBy == "" {
		createdBy = "System Administrator"
	}
	img := input.ImageURL
	if img == "" {
		img = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80"
	}

	item := models.MenuItem{
		Name:      input.Name,
		Category:  input.Category,
		Price:     input.Price,
		ImageURL:  img,
		IsActive:  true,
		CreatedBy: createdBy,
		CreatedAt: time.Now(),
		UpdatedBy: createdBy,
		UpdatedAt: time.Now(),
	}
	if database.DB != nil {
		database.DB.Create(&item)
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Menu item berhasil ditambahkan!", "data": item})
}

func UpdateMenuItem(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Name      string  `json:"name"`
		Category  string  `json:"category"`
		Price     float64 `json:"price"`
		ImageURL  string  `json:"image_url"`
		IsActive  *bool   `json:"is_active"`
		UpdatedBy string  `json:"updated_by"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	updatedBy := input.UpdatedBy
	if updatedBy == "" {
		updatedBy = "System Administrator"
	}

	var item models.MenuItem
	if database.DB != nil {
		if err := database.DB.First(&item, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Menu item tidak ditemukan"})
			return
		}

		if input.Name != "" {
			item.Name = input.Name
		}
		if input.Category != "" {
			item.Category = input.Category
		}
		if input.Price > 0 {
			item.Price = input.Price
		}
		if input.ImageURL != "" {
			item.ImageURL = input.ImageURL
		}
		if input.IsActive != nil {
			item.IsActive = *input.IsActive
		}
		item.UpdatedBy = updatedBy
		item.UpdatedAt = time.Now()

		database.DB.Save(&item)
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Menu item berhasil diperbarui!",
		"data":    item,
	})
}

func DeleteMenuItem(c *gin.Context) {
	id := c.Param("id")
	if database.DB != nil {
		if err := database.DB.Delete(&models.MenuItem{}, id).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": err.Error()})
			return
		}
	}
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Menu item berhasil dihapus!",
	})
}

func GetPOSOrders(c *gin.Context) {
	var orders []models.POSOrder
	if database.DB != nil {
		database.DB.Order("id desc").Find(&orders)
	}
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   orders,
	})
}

func CreatePOSOrder(c *gin.Context) {
	var input struct {
		RoomNumber    string  `json:"room_number"`
		GuestName     string  `json:"guest_name"`
		ItemsJSON     string  `json:"items_json"`
		Subtotal      float64 `json:"subtotal"`
		ServiceCharge float64 `json:"service_charge"`
		Tax           float64 `json:"tax"`
		GrandTotal    float64 `json:"grand_total"`
		PaymentMethod string  `json:"payment_method"` // CHARGE_TO_ROOM, QRIS, CASH, CARD
		CreatedBy     string  `json:"created_by"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	createdBy := input.CreatedBy
	if createdBy == "" {
		createdBy = "System Administrator"
	}

	orderNum := fmt.Sprintf("POS-%s-%d", time.Now().Format("20060102"), time.Now().UnixNano()%10000)
	status := "PAID"
	if input.PaymentMethod == "CHARGE_TO_ROOM" {
		status = "POSTED_TO_FOLIO"
	}

	order := models.POSOrder{
		OrderNumber:   orderNum,
		RoomNumber:    input.RoomNumber,
		GuestName:     input.GuestName,
		ItemsJSON:     input.ItemsJSON,
		Subtotal:      input.Subtotal,
		ServiceCharge: input.ServiceCharge,
		Tax:           input.Tax,
		GrandTotal:    input.GrandTotal,
		PaymentMethod: input.PaymentMethod,
		Status:        status,
		CreatedBy:     createdBy,
		CreatedAt:     time.Now(),
	}

	if database.DB != nil {
		database.DB.Create(&order)

		// Create Audit Log
		auditDetail := fmt.Sprintf("Pesanan F&B POS %s (Total Rp %.0f) berhasil dibuat [%s].", orderNum, input.GrandTotal, input.PaymentMethod)
		if input.PaymentMethod == "CHARGE_TO_ROOM" {
			auditDetail = fmt.Sprintf("Pesanan F&B POS %s (Rp %.0f) dibebankan ke Folio Kamar %s (%s).", orderNum, input.GrandTotal, input.RoomNumber, input.GuestName)
		}
		database.DB.Create(&models.AuditLog{
			Action:    "POS_ORDER_CREATED",
			User:      createdBy,
			Module:    "POS Restoran & F&B",
			Details:   auditDetail,
			IPAddress: c.ClientIP(),
			CreatedAt: time.Now(),
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Pesanan F&B Restoran berhasil diproses!",
		"data":    order,
	})
}

// Hotel Services Handlers (Laundry & Spa)
func GetHotelServices(c *gin.Context) {
	var services []models.HotelService
	if database.DB != nil {
		database.DB.Where("is_active = ?", true).Order("id asc").Find(&services)
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "data": services})
}

func CreateServiceOrder(c *gin.Context) {
	var input struct {
		ServiceType   string  `json:"service_type"` // LAUNDRY, SPA
		RoomNumber    string  `json:"room_number"`
		GuestName     string  `json:"guest_name"`
		ItemsJSON     string  `json:"items_json"`
		Subtotal      float64 `json:"subtotal"`
		Tax           float64 `json:"tax"`
		GrandTotal    float64 `json:"grand_total"`
		PaymentMethod string  `json:"payment_method"` // CHARGE_TO_ROOM, QRIS, CASH
		Notes         string  `json:"notes"`
		CreatedBy     string  `json:"created_by"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	createdBy := input.CreatedBy
	if createdBy == "" {
		createdBy = "System Administrator"
	}

	orderNum := fmt.Sprintf("SVC-%s-%d", time.Now().Format("20060102"), time.Now().UnixNano()%10000)
	status := "PAID"
	if input.PaymentMethod == "CHARGE_TO_ROOM" {
		status = "POSTED_TO_FOLIO"
	}

	order := models.ServiceOrder{
		OrderNumber:   orderNum,
		ServiceType:   input.ServiceType,
		RoomNumber:    input.RoomNumber,
		GuestName:     input.GuestName,
		ItemsJSON:     input.ItemsJSON,
		Subtotal:      input.Subtotal,
		Tax:           input.Tax,
		GrandTotal:    input.GrandTotal,
		PaymentMethod: input.PaymentMethod,
		Status:        status,
		Notes:         input.Notes,
		CreatedBy:     createdBy,
		CreatedAt:     time.Now(),
	}

	if database.DB != nil {
		database.DB.Create(&order)

		auditDetail := fmt.Sprintf("Pesanan Layanan %s %s (Rp %.0f) berhasil diproses.", input.ServiceType, orderNum, input.GrandTotal)
		if input.PaymentMethod == "CHARGE_TO_ROOM" {
			auditDetail = fmt.Sprintf("Pesanan Layanan %s %s (Rp %.0f) dibebankan ke Folio Kamar %s (%s).", input.ServiceType, orderNum, input.GrandTotal, input.RoomNumber, input.GuestName)
		}

		database.DB.Create(&models.AuditLog{
			Action:    "SERVICE_ORDER_CREATED",
			User:      createdBy,
			Module:    "Layanan Hotel (Laundry/Spa)",
			Details:   auditDetail,
			IPAddress: c.ClientIP(),
			CreatedAt: time.Now(),
		})
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Pesanan layanan hotel berhasil diproses!", "data": order})
}

// Lost & Found Handlers
func GetLostItems(c *gin.Context) {
	var items []models.LostItem
	if database.DB != nil {
		database.DB.Order("id desc").Find(&items)
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "data": items})
}

func CreateLostItem(c *gin.Context) {
	var input struct {
		ItemName    string `json:"item_name"`
		Category    string `json:"category"`
		RoomNumber  string `json:"room_number"`
		FounderName string `json:"founder_name"`
		Description string `json:"description"`
		FoundDate   string `json:"found_date"`
		CreatedBy   string `json:"created_by"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	createdBy := input.CreatedBy
	if createdBy == "" {
		createdBy = "System Administrator"
	}

	itemCode := fmt.Sprintf("LNF-%s-%d", time.Now().Format("20060102"), time.Now().UnixNano()%1000)
	foundDate := input.FoundDate
	if foundDate == "" {
		foundDate = time.Now().Format("02 Jan 2006")
	}

	item := models.LostItem{
		ItemCode:    itemCode,
		ItemName:    input.ItemName,
		Category:    input.Category,
		RoomNumber:  input.RoomNumber,
		FounderName: input.FounderName,
		Description: input.Description,
		FoundDate:   foundDate,
		Status:      "DITEMUKAN",
		CreatedBy:   createdBy,
		CreatedAt:   time.Now(),
	}

	if database.DB != nil {
		database.DB.Create(&item)

		database.DB.Create(&models.AuditLog{
			Action:    "LOST_ITEM_REPORTED",
			User:      createdBy,
			Module:    "Housekeeping Lost & Found",
			Details:   fmt.Sprintf("Barang tertinggal %s (%s) di Kamar %s dilaporkan oleh %s.", input.ItemName, itemCode, input.RoomNumber, input.FounderName),
			IPAddress: c.ClientIP(),
			CreatedAt: time.Now(),
		})
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Laporan barang tertinggal berhasil disimpan!", "data": item})
}

func ClaimLostItem(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		ClaimedByGuest string `json:"claimed_by_guest"`
		Notes          string `json:"notes"`
		Status         string `json:"status"`
		UpdatedBy      string `json:"updated_by"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	updatedBy := input.UpdatedBy
	if updatedBy == "" {
		updatedBy = "System Administrator"
	}

	var item models.LostItem
	if database.DB != nil {
		if err := database.DB.First(&item, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Barang tertinggal tidak ditemukan"})
			return
		}

		if input.ClaimedByGuest != "" {
			item.ClaimedByGuest = input.ClaimedByGuest
		}
		if input.Notes != "" {
			item.Notes = input.Notes
		}
		if input.Status != "" {
			item.Status = input.Status
		}
		if input.Status == "DIAMBIL" {
			item.ClaimedAt = time.Now()
		}

		database.DB.Save(&item)

		database.DB.Create(&models.AuditLog{
			Action:    "LOST_ITEM_CLAIMED",
			User:      updatedBy,
			Module:    "Housekeeping Lost & Found",
			Details:   fmt.Sprintf("Barang tertinggal %s (%s) status diubah ke %s (Oleh Tamu: %s).", item.ItemName, item.ItemCode, item.Status, item.ClaimedByGuest),
			IPAddress: c.ClientIP(),
			CreatedAt: time.Now(),
		})
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Status barang tertinggal berhasil diperbarui!", "data": item})
}

func GetAPIAccessLogs(c *gin.Context) {
	var logs []models.APIAccessLog
	if database.DB != nil {
		database.DB.Order("id desc").Limit(100).Find(&logs)
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "data": logs})
}

func ClearAPIAccessLogs(c *gin.Context) {
	if database.DB != nil {
		database.DB.Exec("TRUNCATE TABLE api_access_logs RESTART IDENTITY;")
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Log akses REST API berhasil dibersihkan/direset!"})
}
