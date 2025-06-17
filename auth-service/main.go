package main

import (
	"fmt"
	"log"
	"os"

	"healthcare/auth-service/handlers"
	"healthcare/auth-service/middleware"
	"healthcare/auth-service/models"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: Error loading .env file: %v", err)
	}

	// Get environment variables
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	// Validate environment variables
	if host == "" || port == "" || user == "" || password == "" || dbname == "" {
		log.Fatal("Missing required environment variables. Please check your .env file")
	}

	// Initialize database
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
			host, user, password, dbname, port)
	}

	log.Printf("Attempting to connect to database at %s:%s", host, port)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	log.Println("Successfully connected to database")

	// Auto-migrate the schema
	log.Println("Running database migrations...")
	if err := db.AutoMigrate(&models.User{}, &models.Activity{}, &models.BioInformation{}, &models.EmergencyContact{}); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}
	log.Println("Database migrations completed")

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(db)

	// Initialize router
	r := gin.Default()

	// Add request logging
	r.Use(gin.Logger())

	// Configure CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	config.AllowCredentials = true
	r.Use(cors.New(config))

	// Simple health check route
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// API routes group
	api := r.Group("/api")
	{
		// Public routes
		log.Println("Setting up public routes...")
		api.POST("/users/register", authHandler.Register)
		api.POST("/users/login", authHandler.Login)
		api.POST("/users/verify", authHandler.VerifyToken)

		// Protected routes
		log.Println("Setting up protected routes...")
		protected := api.Group("/users")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.GET("/profile", authHandler.GetProfile)
			protected.PUT("/profile", authHandler.UpdateProfile)
			protected.POST("/logout", authHandler.Logout)
			protected.POST("/bio", authHandler.UpdateBioInformation)
			protected.GET("/activities", authHandler.GetUserActivities)
		}
	}

	// Debug: Print all registered routes
	routes := r.Routes()
	log.Println("Registered routes:")
	for _, route := range routes {
		log.Printf("Method: %s, Path: %s", route.Method, route.Path)
	}

	// Start server
	port = os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Starting server on port %s...", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
