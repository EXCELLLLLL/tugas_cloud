package main

import (
    "database/sql"
    "encoding/json"
    "net/http"
    "time"
)

// HealthResponse represents the health check response
type HealthResponse struct {
    Status    string    `json:"status"`
    Service   string    `json:"service"`
    Database  string    `json:"database"`
    Timestamp time.Time `json:"timestamp"`
    Version   string    `json:"version"`
    Uptime    string    `json:"uptime"`
}

var startTime = time.Now()

// healthCheckHandler returns a handler function for health checks
func healthCheckHandler(db *sql.DB, serviceName string) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        response := HealthResponse{
            Status:    "ok",
            Service:   serviceName,
            Timestamp: time.Now(),
            Version:   "1.0.0",
            Uptime:    time.Since(startTime).String(),
        }

        // Check database connection
        if err := db.Ping(); err != nil {
            response.Status = "error"
            response.Database = "disconnected"
            w.WriteHeader(http.StatusServiceUnavailable)
        } else {
            response.Database = "connected"
        }

        // Set response headers
        w.Header().Set("Content-Type", "application/json")
        if response.Status == "error" {
            w.WriteHeader(http.StatusServiceUnavailable)
        } else {
            w.WriteHeader(http.StatusOK)
        }

        // Encode and send response
        if err := json.NewEncoder(w).Encode(response); err != nil {
            http.Error(w, "Error encoding response", http.StatusInternalServerError)
            return
        }
    }
}

// detailedHealthCheckHandler returns a more detailed health check
func detailedHealthCheckHandler(db *sql.DB, serviceName string) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        response := struct {
            HealthResponse
            MemoryUsage struct {
                Alloc      uint64 `json:"alloc"`
                TotalAlloc uint64 `json:"totalAlloc"`
                Sys        uint64 `json:"sys"`
                NumGC      uint32 `json:"numGC"`
            } `json:"memoryUsage"`
            DatabaseStats struct {
                MaxOpenConnections int `json:"maxOpenConnections"`
                OpenConnections    int `json:"openConnections"`
                InUse             int `json:"inUse"`
                Idle              int `json:"idle"`
            } `json:"databaseStats"`
        }{
            HealthResponse: HealthResponse{
                Status:    "ok",
                Service:   serviceName,
                Timestamp: time.Now(),
                Version:   "1.0.0",
                Uptime:    time.Since(startTime).String(),
            },
        }

        // Get database stats
        if db != nil {
            stats := db.Stats()
            response.DatabaseStats.MaxOpenConnections = stats.MaxOpenConnections
            response.DatabaseStats.OpenConnections = stats.OpenConnections
            response.DatabaseStats.InUse = stats.InUse
            response.DatabaseStats.Idle = stats.Idle

            // Check database connection
            if err := db.Ping(); err != nil {
                response.Status = "error"
                response.Database = "disconnected"
                w.WriteHeader(http.StatusServiceUnavailable)
            } else {
                response.Database = "connected"
            }
        }

        // Set response headers
        w.Header().Set("Content-Type", "application/json")
        if response.Status == "error" {
            w.WriteHeader(http.StatusServiceUnavailable)
        } else {
            w.WriteHeader(http.StatusOK)
        }

        // Encode and send response
        if err := json.NewEncoder(w).Encode(response); err != nil {
            http.Error(w, "Error encoding response", http.StatusInternalServerError)
            return
        }
    }
} 