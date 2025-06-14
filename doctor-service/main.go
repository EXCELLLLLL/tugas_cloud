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

type Doctor struct {
	gorm.Model
	UserID         uint `gorm:"not null"`
	Specialization string
	LicenseNumber  string         `gorm:"unique"`
	Experience     int            // years of experience
	Education      []Education    `gorm:"foreignKey:DoctorID"`
	Availability   []Availability `gorm:"foreignKey:DoctorID"`
}

type Education struct {
	gorm.Model
	DoctorID    uint `gorm:"not null"`
	Degree      string
	Institution string
	Year        int
	Field       string
}

type Availability struct {
	gorm.Model
	DoctorID    uint `gorm:"not null"`
	DayOfWeek   int  // 0-6 (Sunday-Saturday)
	StartTime   time.Time
	EndTime     time.Time
	IsAvailable bool `gorm:"default:true"`
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
	db.AutoMigrate(&Doctor{}, &Education{}, &Availability{})

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

	// Doctor routes
	doctorRoutes := r.Group("/api/doctors")
	{
		// Create doctor profile
		doctorRoutes.POST("/", func(c *gin.Context) {
			var doctor Doctor
			if err := c.ShouldBindJSON(&doctor); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}

			if err := db.Create(&doctor).Error; err != nil {
				c.JSON(400, gin.H{"error": "Failed to create doctor profile"})
				return
			}

			c.JSON(201, doctor)
		})

		// Get all doctors
		doctorRoutes.GET("/", func(c *gin.Context) {
			var doctors []Doctor
			if err := db.Preload("Education").Preload("Availability").Find(&doctors).Error; err != nil {
				c.JSON(400, gin.H{"error": "Failed to fetch doctors"})
				return
			}

			c.JSON(200, doctors)
		})

		// Get doctor by ID
		doctorRoutes.GET("/:id", func(c *gin.Context) {
			var doctor Doctor
			if err := db.Preload("Education").Preload("Availability").First(&doctor, c.Param("id")).Error; err != nil {
				c.JSON(404, gin.H{"error": "Doctor not found"})
				return
			}

			c.JSON(200, doctor)
		})

		// Update doctor profile
		doctorRoutes.PUT("/:id", func(c *gin.Context) {
			var doctor Doctor
			if err := db.First(&doctor, c.Param("id")).Error; err != nil {
				c.JSON(404, gin.H{"error": "Doctor not found"})
				return
			}

			if err := c.ShouldBindJSON(&doctor); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}

			if err := db.Save(&doctor).Error; err != nil {
				c.JSON(400, gin.H{"error": "Failed to update doctor profile"})
				return
			}

			c.JSON(200, doctor)
		})

		// Add education
		doctorRoutes.POST("/:id/education", func(c *gin.Context) {
			var education Education
			if err := c.ShouldBindJSON(&education); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}

			education.DoctorID = uint(c.GetUint("id"))
			if err := db.Create(&education).Error; err != nil {
				c.JSON(400, gin.H{"error": "Failed to add education"})
				return
			}

			c.JSON(201, education)
		})

		// Update availability
		doctorRoutes.POST("/:id/availability", func(c *gin.Context) {
			var availability Availability
			if err := c.ShouldBindJSON(&availability); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}

			availability.DoctorID = uint(c.GetUint("id"))
			if err := db.Create(&availability).Error; err != nil {
				c.JSON(400, gin.H{"error": "Failed to add availability"})
				return
			}

			c.JSON(201, availability)
		})

		// Get doctors by specialization
		doctorRoutes.GET("/specialization/:specialization", func(c *gin.Context) {
			var doctors []Doctor
			if err := db.Preload("Education").Preload("Availability").Where("specialization = ?", c.Param("specialization")).Find(&doctors).Error; err != nil {
				c.JSON(400, gin.H{"error": "Failed to fetch doctors"})
				return
			}

			c.JSON(200, doctors)
		})
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8086"
	}
	r.Run(":" + port)
}
