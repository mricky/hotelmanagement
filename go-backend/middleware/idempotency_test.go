package middleware

import (
	"net/http"
	"net/http/httptest"
	"sync/atomic"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestIdempotencyMiddleware(t *testing.T) {
	gin.SetMode(gin.TestMode)

	r := gin.New()
	r.Use(IdempotencyMiddleware())

	var counter int32

	r.POST("/api/v1/test-order", func(c *gin.Context) {
		val := atomic.AddInt32(&counter, 1)
		c.JSON(http.StatusOK, gin.H{
			"status":   "success",
			"order_id": val,
		})
	})

	// 1. First Request with Idempotency-Key "key-xyz"
	req1, _ := http.NewRequest("POST", "/api/v1/test-order", nil)
	req1.Header.Set("Idempotency-Key", "key-xyz")
	w1 := httptest.NewRecorder()
	r.ServeHTTP(w1, req1)

	if w1.Code != http.StatusOK {
		t.Fatalf("Expected status 200 on first request, got %d", w1.Code)
	}
	body1 := w1.Body.String()

	// 2. Second Request with same Idempotency-Key "key-xyz" (simulated retry)
	req2, _ := http.NewRequest("POST", "/api/v1/test-order", nil)
	req2.Header.Set("Idempotency-Key", "key-xyz")
	w2 := httptest.NewRecorder()
	r.ServeHTTP(w2, req2)

	if w2.Code != http.StatusOK {
		t.Fatalf("Expected status 200 on second request, got %d", w2.Code)
	}

	if w2.Header().Get("Idempotent-Replay") != "true" {
		t.Errorf("Expected 'Idempotent-Replay: true' header on second request, got '%s'", w2.Header().Get("Idempotent-Replay"))
	}

	body2 := w2.Body.String()
	if body1 != body2 {
		t.Errorf("Expected identical response body, got first='%s', second='%s'", body1, body2)
	}

	// Verify handler counter was only incremented ONCE
	finalCount := atomic.LoadInt32(&counter)
	if finalCount != 1 {
		t.Errorf("Expected handler to be executed only 1 time, but was executed %d times", finalCount)
	}
}
