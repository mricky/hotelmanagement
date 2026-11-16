package main

import (
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"hotelmanagement/go-backend/database"
	"hotelmanagement/go-backend/handlers"
	"hotelmanagement/go-backend/models"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	log.Println("Starting Grand Horizon Hotel PMS - Go (Golang) REST API Backend Engine...")

	// Initialize PostgreSQL Database & Seed Data
	database.InitDB()

	// Initialize Gin Router
	r := gin.Default()

	// Configure CORS for Frontend Integration
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	r.Use(cors.New(config))

	// API Access Logger Middleware
	r.Use(func(c *gin.Context) {
		startTime := time.Now()
		c.Next()
		latency := float64(time.Since(startTime).Microseconds()) / 1000.0 // ms
		path := c.Request.URL.Path

		if !strings.HasPrefix(path, "/assets") && path != "/favicon.ico" && database.DB != nil {
			database.DB.Create(&models.APIAccessLog{
				Method:     c.Request.Method,
				Endpoint:   path,
				StatusCode: c.Writer.Status(),
				LatencyMs:  latency,
				ClientIP:   c.ClientIP(),
				UserAgent:  c.Request.UserAgent(),
				CreatedAt:  startTime,
			})
		}
	})

	// Serve Static Assets from Vite Dist Directory
	r.Static("/assets", "../dist/assets")
	r.Static("/dist", "../dist")

	// REST API v1 Routes
	v1 := r.Group("/api/v1")
	{
		v1.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"status":    "UP",
				"engine":    "Golang v1.26 + Gin + GORM",
				"database":  "PostgreSQL 16",
				"pms_hotel": "Grand Horizon Resort & Suite",
			})
		})

		v1.POST("/auth/login", handlers.Login)

		v1.GET("/rooms", handlers.GetRooms)
		v1.POST("/rooms", handlers.CreateRoom)
		v1.PUT("/rooms/:id", handlers.UpdateRoom)
		v1.GET("/room-types", handlers.GetRoomTypes)
		v1.POST("/room-types", handlers.CreateRoomType)
		v1.GET("/floors", handlers.GetFloors)
		v1.POST("/floors", handlers.CreateFloor)
		v1.GET("/bookings", handlers.GetBookings)
		v1.POST("/bookings", handlers.CreateBooking)
		v1.GET("/housekeeping/checklists", handlers.GetChecklists)
		v1.POST("/housekeeping/checklists", handlers.CreateChecklist)
		v1.GET("/housekeeping/categories", handlers.GetChecklistCategories)
		v1.POST("/housekeeping/categories", handlers.CreateChecklistCategory)
		v1.GET("/users", handlers.GetUsers)
		v1.POST("/users", handlers.CreateUser)
		v1.DELETE("/users/:id", handlers.DeleteUser)
		v1.GET("/pricing-rules", handlers.GetPricingRules)
		v1.POST("/pricing-rules", handlers.CreatePricingRule)
		v1.POST("/pricing-rules/toggle/:id", handlers.TogglePricingRule)
		v1.GET("/guests", handlers.GetGuests)
		v1.POST("/guests", handlers.CreateGuest)
		v1.GET("/dashboard", handlers.GetDashboardStats)
		v1.GET("/permissions", handlers.GetRolePermissions)
		v1.POST("/permissions/toggle", handlers.ToggleRolePermission)
		v1.POST("/night-audit/run", handlers.RunNightAudit)
		v1.GET("/channel-manager/matrix", handlers.GetChannelMatrix)
		v1.GET("/audit-logs", handlers.GetAuditLogs)
		v1.GET("/analytics/export-excel", handlers.ExportExcel)
		v1.GET("/hotel-profile", handlers.GetHotelProfile)
		v1.PUT("/hotel-profile", handlers.UpdateHotelProfile)
		v1.GET("/pos/menu", handlers.GetMenuItems)
		v1.POST("/pos/menu", handlers.CreateMenuItem)
		v1.PUT("/pos/menu/:id", handlers.UpdateMenuItem)
		v1.DELETE("/pos/menu/:id", handlers.DeleteMenuItem)
		v1.GET("/pos/orders", handlers.GetPOSOrders)
		v1.POST("/pos/orders", handlers.CreatePOSOrder)
		v1.GET("/services", handlers.GetHotelServices)
		v1.POST("/services/orders", handlers.CreateServiceOrder)
		v1.GET("/lost-found", handlers.GetLostItems)
		v1.POST("/lost-found", handlers.CreateLostItem)
		v1.PUT("/lost-found/:id/claim", handlers.ClaimLostItem)
		v1.GET("/api-logs", handlers.GetAPIAccessLogs)
		v1.DELETE("/api-logs", handlers.ClearAPIAccessLogs)
	}

	// SPA Fallback Route
	r.NoRoute(func(c *gin.Context) {
		// Serve dist/index.html if built, otherwise index.html
		if _, err := os.Stat("../dist/index.html"); err == nil {
			c.File("../dist/index.html")
		} else {
			c.File("../index.html")
		}
	})

	port := ":8000"
	log.Printf("🚀 Go REST API Backend Server listening on http://localhost%s\n", port)
	if err := r.Run(port); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}
