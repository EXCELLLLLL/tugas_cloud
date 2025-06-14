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

type Notification struct {
	gorm.Model
	UserID   uint   `gorm:"not null"`
	Type     string // appointment, bill, record, etc.
	Title    string
	Message  string
	Read     bool `gorm:"default:false"`
	ReadAt   time.Time
	Data     string // Additional JSON data
	Priority string `gorm:"default:'normal'"` // high, normal, low
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
	db.AutoMigrate(&Notification{})

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

	// Notification routes
	notificationRoutes := r.Group("/api/notifications")
	{
		// Create notification
		notificationRoutes.POST("/", func(c *gin.Context) {
			var notification Notification
			if err := c.ShouldBindJSON(&notification); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}

			if err := db.Create(&notification).Error; err != nil {
				c.JSON(400, gin.H{"error": "Failed to create notification"})
				return
			}

			c.JSON(201, notification)
		})

		// Get user's notifications
		notificationRoutes.GET("/user/:userId", func(c *gin.Context) {
			var notifications []Notification
			if err := db.Where("user_id = ?", c.Param("userId")).Order("created_at desc").Find(&notifications).Error; err != nil {
				c.JSON(400, gin.H{"error": "Failed to fetch notifications"})
				return
			}

			c.JSON(200, notifications)
		})

		// Get unread notifications count
		notificationRoutes.GET("/user/:userId/unread/count", func(c *gin.Context) {
			var count int64
			if err := db.Model(&Notification{}).Where("user_id = ? AND read = ?", c.Param("userId"), false).Count(&count).Error; err != nil {
				c.JSON(400, gin.H{"error": "Failed to get unread count"})
				return
			}

			c.JSON(200, gin.H{"count": count})
		})

		// Mark notification as read
		notificationRoutes.PUT("/:id/read", func(c *gin.Context) {
			var notification Notification
			if err := db.First(&notification, c.Param("id")).Error; err != nil {
				c.JSON(404, gin.H{"error": "Notification not found"})
				return
			}

			notification.Read = true
			notification.ReadAt = time.Now()
			if err := db.Save(&notification).Error; err != nil {
				c.JSON(400, gin.H{"error": "Failed to mark notification as read"})
				return
			}

			c.JSON(200, notification)
		})

		// Mark all notifications as read
		notificationRoutes.PUT("/user/:userId/read-all", func(c *gin.Context) {
			if err := db.Model(&Notification{}).Where("user_id = ? AND read = ?", c.Param("userId"), false).Updates(map[string]interface{}{
				"read":    true,
				"read_at": time.Now(),
			}).Error; err != nil {
				c.JSON(400, gin.H{"error": "Failed to mark notifications as read"})
				return
			}

			c.JSON(200, gin.H{"message": "All notifications marked as read"})
		})

		// Delete notification
		notificationRoutes.DELETE("/:id", func(c *gin.Context) {
			if err := db.Delete(&Notification{}, c.Param("id")).Error; err != nil {
				c.JSON(400, gin.H{"error": "Failed to delete notification"})
				return
			}

			c.JSON(200, gin.H{"message": "Notification deleted"})
		})
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8085"
	}
	r.Run(":" + port)
}
