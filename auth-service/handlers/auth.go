package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"healthcare/auth-service/models"
)

var jwtKey = []byte("your-secret-key") // In production, use environment variable

type RegisterInput struct {
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required,min=6"`
	FirstName string `json:"firstName" binding:"required"`
	LastName  string `json:"lastName" binding:"required"`
}

type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type UpdateProfileInput struct {
	FirstName string `json:"firstName" binding:"required"`
	LastName  string `json:"lastName" binding:"required"`
	Email     string `json:"email" binding:"required,email"`
}

type EmergencyContactInput struct {
	Name  string `json:"name"`
	Phone string `json:"phone"`
}

type BioInformationInput struct {
	FullName          string                 `json:"fullName"`
	DateOfBirth       string                 `json:"dob"`
	Gender            string                 `json:"gender"`
	Address           string                 `json:"address"`
	Phone             string                 `json:"phone"`
	Email             string                 `json:"email"`
	BloodType         string                 `json:"bloodType"`
	Allergies         string                 `json:"allergies"`
	Medications       string                 `json:"medications"`
	ChronicConditions string                 `json:"chronic"`
	InsuranceProvider string                 `json:"insuranceProvider"`
	PolicyNumber      string                 `json:"policyNumber"`
	EmergencyContacts []EmergencyContactInput `json:"emergencyContacts"`
	ProfilePhoto      string                 `json:"profilePhoto"`
	InsuranceCard     string                 `json:"insuranceCard"`
}

type AuthHandler struct {
	db *gorm.DB
}

func NewAuthHandler(db *gorm.DB) *AuthHandler {
	return &AuthHandler{db: db}
}

func (h *AuthHandler) Register(c *gin.Context) {
	Register(c, h.db)
}

func (h *AuthHandler) Login(c *gin.Context) {
	Login(c, h.db)
}

func (h *AuthHandler) VerifyToken(c *gin.Context) {
	VerifyToken(c)
}

func (h *AuthHandler) UpdateProfile(c *gin.Context) {
	UpdateProfile(c, h.db)
}

func (h *AuthHandler) GetUserActivities(c *gin.Context) {
	GetUserActivities(c, h.db)
}

func (h *AuthHandler) UpdateBioInformation(c *gin.Context) {
	// Get user ID from token
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var input BioInformationInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if bio information already exists for this user
	var existingBio models.BioInformation
	result := h.db.Where("user_id = ?", userID).First(&existingBio)

	// Begin transaction
	tx := h.db.Begin()

	if result.Error == nil {
		// Update existing bio information
		existingBio.FullName = input.FullName
		existingBio.DateOfBirth = input.DateOfBirth
		existingBio.Gender = input.Gender
		existingBio.Address = input.Address
		existingBio.Phone = input.Phone
		existingBio.BloodType = input.BloodType
		existingBio.Allergies = input.Allergies
		existingBio.Medications = input.Medications
		existingBio.ChronicConditions = input.ChronicConditions
		existingBio.InsuranceProvider = input.InsuranceProvider
		existingBio.PolicyNumber = input.PolicyNumber
		existingBio.ProfilePhoto = input.ProfilePhoto
		existingBio.InsuranceCard = input.InsuranceCard

		if err := tx.Save(&existingBio).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update bio information"})
			return
		}

		// Delete existing emergency contacts
		if err := tx.Where("bio_info_id = ?", existingBio.ID).Delete(&models.EmergencyContact{}).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update emergency contacts"})
			return
		}

		// Create new emergency contacts
		for _, contact := range input.EmergencyContacts {
			if contact.Name != "" && contact.Phone != "" {
				newContact := models.EmergencyContact{
					BioInfoID: existingBio.ID,
					Name:      contact.Name,
					Phone:     contact.Phone,
					CreatedAt: time.Now(),
					UpdatedAt: time.Now(),
				}
				if err := tx.Create(&newContact).Error; err != nil {
					tx.Rollback()
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create emergency contact"})
					return
				}
			}
		}
	} else {
		// Create new bio information
		newBio := models.BioInformation{
			UserID:            userID.(uint),
			FullName:          input.FullName,
			DateOfBirth:       input.DateOfBirth,
			Gender:            input.Gender,
			Address:           input.Address,
			Phone:             input.Phone,
			BloodType:         input.BloodType,
			Allergies:         input.Allergies,
			Medications:       input.Medications,
			ChronicConditions: input.ChronicConditions,
			InsuranceProvider: input.InsuranceProvider,
			PolicyNumber:      input.PolicyNumber,
			ProfilePhoto:      input.ProfilePhoto,
			InsuranceCard:     input.InsuranceCard,
		}

		if err := tx.Create(&newBio).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create bio information"})
			return
		}

		// Create emergency contacts
		for _, contact := range input.EmergencyContacts {
			if contact.Name != "" && contact.Phone != "" {
				newContact := models.EmergencyContact{
					BioInfoID: newBio.ID,
					Name:      contact.Name,
					Phone:     contact.Phone,
					CreatedAt: time.Now(),
					UpdatedAt: time.Now(),
				}
				if err := tx.Create(&newContact).Error; err != nil {
					tx.Rollback()
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create emergency contact"})
					return
				}
			}
		}
	}

	// Create activity record
	details, _ := json.Marshal(map[string]string{
		"action": "bio_information_update",
		"email":  input.Email,
	})
	if err := createActivity(tx, userID.(uint), "profile_update", string(details)); err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create activity record"})
		return
	}

	// Commit transaction
	tx.Commit()

	c.JSON(http.StatusOK, gin.H{"message": "Bio information updated successfully"})
}

func (h *AuthHandler) GetProfile(c *gin.Context) {
	// Get user ID from token
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var user models.User
	if result := h.db.First(&user, userID); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":        user.ID,
		"email":     user.Email,
		"firstName": user.FirstName,
		"lastName":  user.LastName,
		"role":      user.Role,
	})
}

func (h *AuthHandler) Logout(c *gin.Context) {
	// In a real application, you might want to invalidate the token
	// For now, we'll just return a success message
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}

func createActivity(db *gorm.DB, userID uint, activityType string, details string) error {
	activity := models.Activity{
		UserID:    userID,
		Type:      activityType,
		Details:   details,
		CreatedAt: time.Now(),
	}
	return db.Create(&activity).Error
}

func Register(c *gin.Context, db *gorm.DB) {
	var input RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if user already exists
	var existingUser models.User
	if result := db.Where("email = ?", input.Email).First(&existingUser); result.Error == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already registered"})
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error hashing password"})
		return
	}

	// Create user
	user := models.User{
		Email:     input.Email,
		Password:  string(hashedPassword),
		FirstName: input.FirstName,
		LastName:  input.LastName,
		Role:      "user", // Set default role
	}

	if result := db.Create(&user); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating user"})
		return
	}

	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"role":    user.Role,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error generating token"})
		return
	}

	// Create activity record
	details, _ := json.Marshal(map[string]string{
		"email":     user.Email,
		"firstName": user.FirstName,
		"lastName":  user.LastName,
	})
	createActivity(db, user.ID, string(models.ActivityLogin), string(details))

	// Return response in the format expected by the frontend
	c.JSON(http.StatusCreated, gin.H{
		"token": tokenString,
		"user": gin.H{
			"id":        user.ID,
			"email":     user.Email,
			"firstName": user.FirstName,
			"lastName":  user.LastName,
			"role":      user.Role,
		},
	})
}

func Login(c *gin.Context, db *gorm.DB) {
	var input LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if result := db.Where("email = ?", input.Email).First(&user); result.Error != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Check password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Update last login
	user.LastLogin = time.Now()
	db.Save(&user)

	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"role":    user.Role,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error generating token"})
		return
	}

	// Create activity record
	createActivity(db, user.ID, string(models.ActivityLogin), "User logged in")

	c.JSON(http.StatusOK, gin.H{
		"token": tokenString,
		"user": gin.H{
			"id":        user.ID,
			"email":     user.Email,
			"firstName": user.FirstName,
			"lastName":  user.LastName,
			"role":      user.Role,
		},
	})
}

func VerifyToken(c *gin.Context) {
	tokenString := c.GetHeader("Authorization")
	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No token provided"})
		return
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	if err != nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	claims := token.Claims.(jwt.MapClaims)
	c.JSON(http.StatusOK, gin.H{
		"user_id": claims["user_id"],
		"email":   claims["email"],
		"role":    claims["role"],
	})
}

func UpdateProfile(c *gin.Context, db *gorm.DB) {
	// Get user ID from token
	tokenString := c.GetHeader("Authorization")
	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No token provided"})
		return
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	if err != nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	claims := token.Claims.(jwt.MapClaims)
	userID := uint(claims["user_id"].(float64))

	// Parse input
	var input UpdateProfileInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if email is already taken by another user
	var existingUser models.User
	if result := db.Where("email = ? AND id != ?", input.Email, userID).First(&existingUser); result.Error == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already taken"})
		return
	}

	// Update user
	var user models.User
	if result := db.First(&user, userID); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Store old values for activity tracking
	oldValues := map[string]string{
		"firstName": user.FirstName,
		"lastName":  user.LastName,
		"email":     user.Email,
	}

	user.FirstName = input.FirstName
	user.LastName = input.LastName
	user.Email = input.Email

	if result := db.Save(&user); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating profile"})
		return
	}

	// Create activity record
	details, _ := json.Marshal(map[string]interface{}{
		"old": oldValues,
		"new": map[string]string{
			"firstName": input.FirstName,
			"lastName":  input.LastName,
			"email":     input.Email,
		},
	})
	createActivity(db, user.ID, string(models.ActivityProfileUpdate), string(details))

	c.JSON(http.StatusOK, gin.H{
		"id":        user.ID,
		"email":     user.Email,
		"firstName": user.FirstName,
		"lastName":  user.LastName,
		"role":      user.Role,
	})
}

func GetUserActivities(c *gin.Context, db *gorm.DB) {
	// Get user ID from token
	tokenString := c.GetHeader("Authorization")
	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No token provided"})
		return
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	if err != nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	claims := token.Claims.(jwt.MapClaims)
	userID := uint(claims["user_id"].(float64))

	// Get activities
	var activities []models.Activity
	if result := db.Where("user_id = ?", userID).Order("created_at desc").Limit(10).Find(&activities); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching activities"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"activities": activities})
}
