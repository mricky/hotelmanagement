package middleware

import (
	"bytes"
	"net/http"
	"strings"
	"sync"
	"time"

	"hotelmanagement/go-backend/database"
	"hotelmanagement/go-backend/models"

	"github.com/gin-gonic/gin"
)

var (
	inProgressKeys sync.Map
	memoryCache    sync.Map // fallback when database.DB is nil
)

type memoryRecord struct {
	StatusCode   int
	ResponseBody string
	CreatedAt    time.Time
}

type bodyLogWriter struct {
	gin.ResponseWriter
	body *bytes.Buffer
}

func (w bodyLogWriter) Write(b []byte) (int, error) {
	w.body.Write(b)
	return w.ResponseWriter.Write(b)
}

// IdempotencyMiddleware ensures that state-mutating requests with an 'Idempotency-Key'
// header are executed exactly once, preventing duplicate bookings or payments.
func IdempotencyMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		key := strings.TrimSpace(c.GetHeader("Idempotency-Key"))
		if key == "" {
			c.Next()
			return
		}

		// 1. Check in-flight duplicate requests
		if _, loaded := inProgressKeys.LoadOrStore(key, true); loaded {
			c.AbortWithStatusJSON(http.StatusConflict, gin.H{
				"status":  "error",
				"message": "A request with this Idempotency-Key is currently being processed. Please retry shortly.",
			})
			return
		}
		defer inProgressKeys.Delete(key)

		// 2. Check Database for previously cached response
		if database.DB != nil {
			var record models.IdempotencyRecord
			if err := database.DB.Where("key = ?", key).First(&record).Error; err == nil {
				c.Header("X-Cache-Lookup", "HIT")
				c.Header("Idempotent-Replay", "true")
				c.Data(record.StatusCode, "application/json; charset=utf-8", []byte(record.ResponseBody))
				c.Abort()
				return
			}
		} else {
			// In-memory fallback
			if val, ok := memoryCache.Load(key); ok {
				rec := val.(memoryRecord)
				c.Header("X-Cache-Lookup", "HIT")
				c.Header("Idempotent-Replay", "true")
				c.Data(rec.StatusCode, "application/json; charset=utf-8", []byte(rec.ResponseBody))
				c.Abort()
				return
			}
		}

		// 3. Wrap response writer to capture output body
		blw := &bodyLogWriter{
			ResponseWriter: c.Writer,
			body:           bytes.NewBufferString(""),
		}
		c.Writer = blw

		// Execute downstream handlers
		c.Next()

		// 4. Save response for future idempotent replay if request was successful or client-side error
		statusCode := c.Writer.Status()
		if statusCode > 0 && statusCode < 500 {
			respBody := blw.body.String()
			endpoint := c.FullPath()
			if endpoint == "" {
				endpoint = c.Request.URL.Path
			}

			if database.DB != nil {
				database.DB.Create(&models.IdempotencyRecord{
					Key:          key,
					Endpoint:     endpoint,
					Method:       c.Request.Method,
					StatusCode:   statusCode,
					ResponseBody: respBody,
					CreatedAt:    time.Now(),
				})
			} else {
				memoryCache.Store(key, memoryRecord{
					StatusCode:   statusCode,
					ResponseBody: respBody,
					CreatedAt:    time.Now(),
				})
			}
		}
	}
}
