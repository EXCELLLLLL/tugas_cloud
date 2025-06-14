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

type MedicalRecord struct {
	gorm.Model
	PatientID    uint      `gorm:"not null"`
	DoctorID     uint      `gorm:"not null"`
	Date         time.Time `gorm:"not null"`
	Diagnosis    string
	Prescription string
	Notes        string
	Attachments  []Attachment `gorm:"foreignKey:RecordID"`
}

type Attachment struct {
	gorm.Model
	RecordID uint   `gorm:"not null"`
	Type     string // image, document, etc.
	URL      string
	Name     string
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
	db.AutoMigrate(&MedicalRecord{}, &Attachment{})

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

	// Medical record routes
	recordRoutes := r.Group("/api/records")
	{
		// Create medical record
		recordRoutes.POST("/", func(c *gin.Context) {
			var record MedicalRecord
			if err := c.ShouldBindJSON(&record); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}

			if err := db.Create(&record).Error; err != nil {
				c.JSON(400, gin.H{"error": "Failed to create medical record"})
				return
			}

			c.JSON(201, record)
		})

		// Get patient's medical records
		recordRoutes.GET("/patient/:patientId", func(c *gin.Context) {
			var records []MedicalRecord
			if err := db.Preload("Attachments").Where("patient_id = ?", c.Param("patientId")).Find(&records).Error; err != nil {
				c.JSON(400, gin.H{"error": "Failed to fetch medical records"})
				return
			}

			c.JSON(200, records)
		})

		// Get doctor's medical records
		recordRoutes.GET("/doctor/:doctorId", func(c *gin.Context) {
			var records []MedicalRecord
			if err := db.Preload("Attachments").Where("doctor_id = ?", c.Param("doctorId")).Find(&records).Error; err != nil {
				c.JSON(400, gin.H{"error": "Failed to fetch medical records"})
				return
			}

			c.JSON(200, records)
		})

		// Get specific medical record
		recordRoutes.GET("/:id", func(c *gin.Context) {
			var record MedicalRecord
			if err := db.Preload("Attachments").First(&record, c.Param("id")).Error; err != nil {
				c.JSON(404, gin.H{"error": "Medical record not found"})
				return
			}

			c.JSON(200, record)
		})

		// Update medical record
		recordRoutes.PUT("/:id", func(c *gin.Context) {
			var record MedicalRecord
			if err := db.First(&record, c.Param("id")).Error; err != nil {
				c.JSON(404, gin.H{"error": "Medical record not found"})
				return
			}

			if err := c.ShouldBindJSON(&record); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}

			if err := db.Save(&record).Error; err != nil {
				c.JSON(400, gin.H{"error": "Failed to update medical record"})
				return
			}

			c.JSON(200, record)
		})

		// Add attachment to medical record
		recordRoutes.POST("/:id/attachments", func(c *gin.Context) {
			var attachment Attachment
			if err := c.ShouldBindJSON(&attachment); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}

			attachment.RecordID = uint(c.GetUint("id"))
			if err := db.Create(&attachment).Error; err != nil {
				c.JSON(400, gin.H{"error": "Failed to add attachment"})
				return
			}

			c.JSON(201, attachment)
		})
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8083"
	}
	r.Run(":" + port)
}
