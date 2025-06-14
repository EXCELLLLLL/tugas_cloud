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

type Bill struct {
	gorm.Model
	PatientID     uint    `gorm:"not null"`
	DoctorID      uint    `gorm:"not null"`
	AppointmentID uint    `gorm:"not null"`
	Amount        float64 `gorm:"not null"`
	Status        string  `gorm:"default:'pending'"` // pending, paid, cancelled
	DueDate       time.Time
	Items         []BillItem `gorm:"foreignKey:BillID"`
}

type BillItem struct {
	gorm.Model
	BillID      uint   `gorm:"not null"`
	Type        string // consultation, procedure, medication, etc.
	Description string
	Amount      float64
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
	db.AutoMigrate(&Bill{}, &BillItem{})

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

	// Billing routes
	billRoutes := r.Group("/api/bills")
	{
		// Create bill
		billRoutes.POST("/", func(c *gin.Context) {
			var bill Bill
			if err := c.ShouldBindJSON(&bill); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}

			if err := db.Create(&bill).Error; err != nil {
				c.JSON(400, gin.H{"error": "Failed to create bill"})
				return
			}

			c.JSON(201, bill)
		})

		// Get patient's bills
		billRoutes.GET("/patient/:patientId", func(c *gin.Context) {
			var bills []Bill
			if err := db.Preload("Items").Where("patient_id = ?", c.Param("patientId")).Find(&bills).Error; err != nil {
				c.JSON(400, gin.H{"error": "Failed to fetch bills"})
				return
			}

			c.JSON(200, bills)
		})

		// Get doctor's bills
		billRoutes.GET("/doctor/:doctorId", func(c *gin.Context) {
			var bills []Bill
			if err := db.Preload("Items").Where("doctor_id = ?", c.Param("doctorId")).Find(&bills).Error; err != nil {
				c.JSON(400, gin.H{"error": "Failed to fetch bills"})
				return
			}

			c.JSON(200, bills)
		})

		// Get specific bill
		billRoutes.GET("/:id", func(c *gin.Context) {
			var bill Bill
			if err := db.Preload("Items").First(&bill, c.Param("id")).Error; err != nil {
				c.JSON(404, gin.H{"error": "Bill not found"})
				return
			}

			c.JSON(200, bill)
		})

		// Update bill status
		billRoutes.PUT("/:id/status", func(c *gin.Context) {
			var bill Bill
			if err := db.First(&bill, c.Param("id")).Error; err != nil {
				c.JSON(404, gin.H{"error": "Bill not found"})
				return
			}

			var status struct {
				Status string `json:"status"`
			}
			if err := c.ShouldBindJSON(&status); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}

			bill.Status = status.Status
			if err := db.Save(&bill).Error; err != nil {
				c.JSON(400, gin.H{"error": "Failed to update bill status"})
				return
			}

			c.JSON(200, bill)
		})

		// Add item to bill
		billRoutes.POST("/:id/items", func(c *gin.Context) {
			var item BillItem
			if err := c.ShouldBindJSON(&item); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}

			item.BillID = uint(c.GetUint("id"))
			if err := db.Create(&item).Error; err != nil {
				c.JSON(400, gin.H{"error": "Failed to add bill item"})
				return
			}

			c.JSON(201, item)
		})
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8084"
	}
	r.Run(":" + port)
}
