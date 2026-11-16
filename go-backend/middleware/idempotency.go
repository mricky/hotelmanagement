package middleware

import (
	"bytes"
	"errors"
	"net/http"
	"regexp"
	"strings"
	"sync"
	"time"

	"hotelmanagement/go-backend/database"
	"hotelmanagement/go-backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

var (
	inProgressKeys sync.Map
	memoryCache    sync.Map // isolated test fallback, strictly scoped to gin.TestMode

	// Regex patterns for PCI-DSS & PII sanitization before storing response payloads
	panRegex   = regexp.MustCompile(`(?i)"(card_number|credit_card|pan|account_number)"\s*:\s*"([0-9]{4})[0-9]{4,11}([0-9]{4})"`)
	cvvRegex   = regexp.MustCompile(`(?i)"(cvv|cvc|card_verification)"\s*:\s*"[0-9]{3,4}"`)
	tokenRegex = regexp.MustCompile(`(?i)"(token|secret|password|access_token|refresh_token)"\s*:\s*"[^"]+"`)
	piiRegex   = regexp.MustCompile(`(?i)"(nik|passport|id_number|identity_number)"\s*:\s*"([a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})"`)
)

// MaskSensitiveData redacts credit card PANs, CVVs, passwords, and guest PII
// before storing response bodies in the idempotency audit record.
func MaskSensitiveData(body string) string {
	if body == "" {
		return ""
	}
	s := panRegex.ReplaceAllString(body, `"$1":"$2********$3"`)
	s = cvvRegex.ReplaceAllString(s, `"$1":"***"`)
	s = tokenRegex.ReplaceAllString(s, `"$1":"[REDACTED]"`)
	s = piiRegex.ReplaceAllString(s, `"$1":"$2******$3"`)
	return s
}

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
// Adheres to fail-closed architecture: if the centralized store is down, mutations are rejected.
func IdempotencyMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		key := strings.TrimSpace(c.GetHeader("Idempotency-Key"))
		if key == "" {
			c.Next()
			return
		}

		// 1. Check in-flight duplicate requests (concurrency lock)
		if _, loaded := inProgressKeys.LoadOrStore(key, true); loaded {
			c.AbortWithStatusJSON(http.StatusConflict, gin.H{
				"status":  "error",
				"message": "A request with this Idempotency-Key is currently being processed. Please retry shortly.",
			})
			return
		}
		defer inProgressKeys.Delete(key)

		// 2. Centralized Store Check (Database) - Fail-Closed Architecture
		if database.DB != nil {
			var record models.IdempotencyRecord
			err := database.DB.Where("key = ?", key).First(&record).Error
			if err == nil {
				// Cached idempotency HIT
				c.Header("X-Cache-Lookup", "HIT")
				c.Header("Idempotent-Replay", "true")
				c.Data(record.StatusCode, "application/json; charset=utf-8", []byte(record.ResponseBody))
				c.Abort()
				return
			} else if !errors.Is(err, gorm.ErrRecordNotFound) {
				// Fail-closed on database connection/infrastructure error to prevent double mutations
				c.AbortWithStatusJSON(http.StatusServiceUnavailable, gin.H{
					"status":  "error",
					"message": "Centralized idempotency verification failed due to storage error. Transaction aborted to prevent duplicate financial processing.",
				})
				return
			}
		} else if gin.Mode() != gin.TestMode {
			// Fail-closed in production if centralized persistence store is unavailable
			c.AbortWithStatusJSON(http.StatusServiceUnavailable, gin.H{
				"status":  "error",
				"message": "Centralized idempotency store is unavailable. Transaction aborted to prevent duplicate financial processing.",
			})
			return
		} else {
			// Automated unit test mode fallback (gin.TestMode)
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
			// Mask sensitive PII & cardholder details before persisting
			sanitizedBody := MaskSensitiveData(blw.body.String())
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
					ResponseBody: sanitizedBody,
					CreatedAt:    time.Now(),
				})
			} else if gin.Mode() == gin.TestMode {
				memoryCache.Store(key, memoryRecord{
					StatusCode:   statusCode,
					ResponseBody: sanitizedBody,
					CreatedAt:    time.Now(),
				})
			}
		}
	}
}
