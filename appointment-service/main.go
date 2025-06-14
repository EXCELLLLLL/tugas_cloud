package main

import (
	"log"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Appointment struct {
	gorm.Model
	PatientID   uint      `gorm:"not null"`
	DoctorID    uint      `gorm:"not null"`
	DateTime    time.Time `gorm:"not null"`
	Status      string    `gorm:"default:'scheduled'"` // scheduled, completed, cancelled
	Type        string    // consultation, follow-up, emergency
	Notes       string
	Duration    int    `gorm:"default:30"` // duration in minutes
	MeetingLink string // for virtual appointments
	Location    string // for in-person appointments
}

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Database connection
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=localhost user=postgres password=postgres dbname=healthcare port=5432 sslmode=disable"
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto migrate the schema
	db.AutoMigrate(&Appointment{})

	// Initialize Gin router
	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Appointment routes
	appointmentRoutes := r.Group("/api/appointments")
	{
		// Create appointment
		appointmentRoutes.POST("/", func(c *gin.Context) {
			var appointment Appointment
			if err := c.ShouldBindJSON(&appointment); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}

			if err := db.Create(&appointment).Error; err != nil {
				c.JSON(400, gin.H{"error": "Failed to create appointment"})
				return
			}

			c.JSON(201, appointment)
		})

		// Get appointments for a patient
		appointmentRoutes.GET("/patient/:patientId", func(c *gin.Context) {
			var appointments []Appointment
			if err := db.Where("patient_id = ?", c.Param("patientId")).Find(&appointments).Error; err != nil {
				c.JSON(400, gin.H{"error": "Failed to fetch appointments"})
				return
			}

			c.JSON(200, appointments)
		})

		// Get appointments for a doctor
		appointmentRoutes.GET("/doctor/:doctorId", func(c *gin.Context) {
			var appointments []Appointment
			if err := db.Where("doctor_id = ?", c.Param("doctorId")).Find(&appointments).Error; err != nil {
				c.JSON(400, gin.H{"error": "Failed to fetch appointments"})
				return
			}

			c.JSON(200, appointments)
		})

		// Update appointment
		appointmentRoutes.PUT("/:id", func(c *gin.Context) {
			var appointment Appointment
			if err := db.First(&appointment, c.Param("id")).Error; err != nil {
				c.JSON(404, gin.H{"error": "Appointment not found"})
				return
			}

			if err := c.ShouldBindJSON(&appointment); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}

			if err := db.Save(&appointment).Error; err != nil {
				c.JSON(400, gin.H{"error": "Failed to update appointment"})
				return
			}

			c.JSON(200, appointment)
		})

		// Cancel appointment
		appointmentRoutes.PUT("/:id/cancel", func(c *gin.Context) {
			var appointment Appointment
			if err := db.First(&appointment, c.Param("id")).Error; err != nil {
				c.JSON(404, gin.H{"error": "Appointment not found"})
				return
			}

			appointment.Status = "cancelled"
			if err := db.Save(&appointment).Error; err != nil {
				c.JSON(400, gin.H{"error": "Failed to cancel appointment"})
				return
			}

			c.JSON(200, appointment)
		})
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}
	r.Run(":" + port)
}
