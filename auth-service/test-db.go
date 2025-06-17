package main

import (
	"fmt"
	"log"
	"os"
	"time"

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

	// Print connection details (without password)
	fmt.Printf("Attempting to connect to:\n")
	fmt.Printf("Host: %s\n", host)
	fmt.Printf("Port: %s\n", port)
	fmt.Printf("User: %s\n", user)
	fmt.Printf("Database: %s\n", dbname)

	// Create DSN
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		host, user, password, dbname, port)

	// Try to connect with timeout
	fmt.Println("\nTesting connection...")

	// Set a timeout for the connection attempt
	timeout := time.After(10 * time.Second)
	done := make(chan bool)

	go func() {
		db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			fmt.Printf("\nConnection failed: %v\n", err)
			done <- false
			return
		}

		// Test the connection
		sqlDB, err := db.DB()
		if err != nil {
			fmt.Printf("\nFailed to get database instance: %v\n", err)
			done <- false
			return
		}

		if err := sqlDB.Ping(); err != nil {
			fmt.Printf("\nPing failed: %v\n", err)
			done <- false
			return
		}

		fmt.Println("\nConnection successful!")
		done <- true
	}()

	select {
	case <-timeout:
		fmt.Println("\nConnection timed out after 10 seconds")
		fmt.Println("\nTroubleshooting steps:")
		fmt.Println("1. Check if RDS instance is running")
		fmt.Println("2. Verify security group allows inbound traffic on port 5432")
		fmt.Println("3. Check if RDS is publicly accessible")
		fmt.Println("4. Verify VPC settings and route tables")
		fmt.Println("5. Check if your IP is allowed in the security group")
	case success := <-done:
		if success {
			fmt.Println("\nDatabase connection test passed!")
		}
	}
}
