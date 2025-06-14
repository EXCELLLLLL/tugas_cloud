package main

import (
	"log"
	"os"

	"user-service/middleware"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email     string `gorm:"unique;not null"`
	Password  string `gorm:"not null"`
	FirstName string
	LastName  string
	Role      string `gorm:"default:'patient'"`
	Phone     string
	Address   string
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

	// Auto-migrate the schema
	db.AutoMigrate(&User{})

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

	// Public routes
	r.POST("/api/users/register", func(c *gin.Context) {
		var user User
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}

		// Hash password before saving
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to hash password"})
			return
		}
		user.Password = string(hashedPassword)

		if err := db.Create(&user).Error; err != nil {
			c.JSON(500, gin.H{"error": "Failed to create user"})
			return
		}

		// Generate JWT token
		token, err := middleware.GenerateToken(user.ID, user.Email, user.Role)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to generate token"})
			return
		}

		c.JSON(201, gin.H{
			"message": "User created successfully",
			"token":   token,
		})
	})

	r.POST("/api/users/login", func(c *gin.Context) {
		var loginData struct {
			Email    string `json:"email"`
			Password string `json:"password"`
		}

		if err := c.ShouldBindJSON(&loginData); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}

		var user User
		if err := db.Where("email = ?", loginData.Email).First(&user).Error; err != nil {
			c.JSON(401, gin.H{"error": "Invalid credentials"})
			return
		}

		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginData.Password)); err != nil {
			c.JSON(401, gin.H{"error": "Invalid credentials"})
			return
		}

		token, err := middleware.GenerateToken(user.ID, user.Email, user.Role)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to generate token"})
			return
		}

		c.JSON(200, gin.H{
			"message": "Login successful",
			"token":   token,
		})
	})

	// Protected routes
	authorized := r.Group("/api/users")
	authorized.Use(middleware.AuthMiddleware())
	{
		// Get user profile
		authorized.GET("/profile", func(c *gin.Context) {
			userID, _ := c.Get("user_id")
			var user User
			if err := db.First(&user, userID).Error; err != nil {
				c.JSON(404, gin.H{"error": "User not found"})
				return
			}
			c.JSON(200, user)
		})

		// Update user profile
		authorized.PUT("/profile", func(c *gin.Context) {
			userID, _ := c.Get("user_id")
			var updateData struct {
				FirstName string `json:"first_name"`
				LastName  string `json:"last_name"`
				Phone     string `json:"phone"`
				Address   string `json:"address"`
			}

			if err := c.ShouldBindJSON(&updateData); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}

			if err := db.Model(&User{}).Where("id = ?", userID).Updates(updateData).Error; err != nil {
				c.JSON(500, gin.H{"error": "Failed to update profile"})
				return
			}

			c.JSON(200, gin.H{"message": "Profile updated successfully"})
		})

		// Change password
		authorized.PUT("/change-password", func(c *gin.Context) {
			userID, _ := c.Get("user_id")
			var passwordData struct {
				CurrentPassword string `json:"current_password"`
				NewPassword     string `json:"new_password"`
			}

			if err := c.ShouldBindJSON(&passwordData); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}

			var user User
			if err := db.First(&user, userID).Error; err != nil {
				c.JSON(404, gin.H{"error": "User not found"})
				return
			}

			if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(passwordData.CurrentPassword)); err != nil {
				c.JSON(401, gin.H{"error": "Current password is incorrect"})
				return
			}

			hashedPassword, err := bcrypt.GenerateFromPassword([]byte(passwordData.NewPassword), bcrypt.DefaultCost)
			if err != nil {
				c.JSON(500, gin.H{"error": "Failed to hash password"})
				return
			}

			if err := db.Model(&user).Update("password", string(hashedPassword)).Error; err != nil {
				c.JSON(500, gin.H{"error": "Failed to update password"})
				return
			}

			c.JSON(200, gin.H{"message": "Password changed successfully"})
		})
	}

	// Admin routes
	admin := r.Group("/api/admin")
	admin.Use(middleware.AuthMiddleware(), middleware.RoleMiddleware("admin"))
	{
		// Get all users
		admin.GET("/users", func(c *gin.Context) {
			var users []User
			if err := db.Find(&users).Error; err != nil {
				c.JSON(500, gin.H{"error": "Failed to fetch users"})
				return
			}
			c.JSON(200, users)
		})

		// Update user role
		admin.PUT("/users/:id/role", func(c *gin.Context) {
			userID := c.Param("id")
			var roleData struct {
				Role string `json:"role"`
			}

			if err := c.ShouldBindJSON(&roleData); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}

			if err := db.Model(&User{}).Where("id = ?", userID).Update("role", roleData.Role).Error; err != nil {
				c.JSON(500, gin.H{"error": "Failed to update role"})
				return
			}

			c.JSON(200, gin.H{"message": "Role updated successfully"})
		})
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}
	r.Run(":" + port)
}
