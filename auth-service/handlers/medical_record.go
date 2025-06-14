package handlers

import (
	"net/http"
	"strconv"
	"time"

	"healthcare/auth-service/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type MedicalRecordHandler struct {
	db *gorm.DB
}

func NewMedicalRecordHandler(db *gorm.DB) *MedicalRecordHandler {
	return &MedicalRecordHandler{db: db}
}

type CreateMedicalRecordInput struct {
	Type        string    `json:"type" binding:"required"`
	Provider    string    `json:"provider" binding:"required"`
	Department  string    `json:"department" binding:"required"`
	Summary     string    `json:"summary" binding:"required"`
	Attachments int       `json:"attachments"`
	Date        time.Time `json:"date" binding:"required"`
}

type UpdateMedicalRecordInput struct {
	Type        string    `json:"type"`
	Provider    string    `json:"provider"`
	Department  string    `json:"department"`
	Summary     string    `json:"summary"`
	Attachments int       `json:"attachments"`
	Date        time.Time `json:"date"`
}

// GetMedicalRecords returns all medical records for a user
func (h *MedicalRecordHandler) GetMedicalRecords(c *gin.Context) {
	userID := c.GetUint("userID")
	var records []models.MedicalRecord

	if err := h.db.Where("user_id = ?", userID).Order("date DESC").Find(&records).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch medical records"})
		return
	}

	c.JSON(http.StatusOK, records)
}

// GetMedicalRecord returns a specific medical record
func (h *MedicalRecordHandler) GetMedicalRecord(c *gin.Context) {
	userID := c.GetUint("userID")
	recordID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid record ID"})
		return
	}

	var record models.MedicalRecord
	if err := h.db.Where("id = ? AND user_id = ?", recordID, userID).First(&record).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medical record not found"})
		return
	}

	// Log activity
	activity := models.Activity{
		UserID:  userID,
		Type:    string(models.ActivityRecordView),
		Details: "Viewed medical record: " + record.Type,
	}
	h.db.Create(&activity)

	c.JSON(http.StatusOK, record)
}

// CreateMedicalRecord creates a new medical record
func (h *MedicalRecordHandler) CreateMedicalRecord(c *gin.Context) {
	userID := c.GetUint("userID")
	var input CreateMedicalRecordInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	record := models.MedicalRecord{
		UserID:      userID,
		Type:        input.Type,
		Provider:    input.Provider,
		Department:  input.Department,
		Summary:     input.Summary,
		Attachments: input.Attachments,
		Date:        input.Date,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	if err := h.db.Create(&record).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create medical record"})
		return
	}

	// Log activity
	activity := models.Activity{
		UserID:  userID,
		Type:    string(models.ActivityRecordUpdate),
		Details: "Created new medical record: " + record.Type,
	}
	h.db.Create(&activity)

	c.JSON(http.StatusCreated, record)
}

// UpdateMedicalRecord updates an existing medical record
func (h *MedicalRecordHandler) UpdateMedicalRecord(c *gin.Context) {
	userID := c.GetUint("userID")
	recordID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid record ID"})
		return
	}

	var input UpdateMedicalRecordInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var record models.MedicalRecord
	if err := h.db.Where("id = ? AND user_id = ?", recordID, userID).First(&record).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medical record not found"})
		return
	}

	updates := map[string]interface{}{
		"updated_at": time.Now(),
	}

	if input.Type != "" {
		updates["type"] = input.Type
	}
	if input.Provider != "" {
		updates["provider"] = input.Provider
	}
	if input.Department != "" {
		updates["department"] = input.Department
	}
	if input.Summary != "" {
		updates["summary"] = input.Summary
	}
	if input.Attachments > 0 {
		updates["attachments"] = input.Attachments
	}
	if !input.Date.IsZero() {
		updates["date"] = input.Date
	}

	if err := h.db.Model(&record).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update medical record"})
		return
	}

	// Log activity
	activity := models.Activity{
		UserID:  userID,
		Type:    string(models.ActivityRecordUpdate),
		Details: "Updated medical record: " + record.Type,
	}
	h.db.Create(&activity)

	c.JSON(http.StatusOK, record)
}

// DeleteMedicalRecord deletes a medical record
func (h *MedicalRecordHandler) DeleteMedicalRecord(c *gin.Context) {
	userID := c.GetUint("userID")
	recordID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid record ID"})
		return
	}

	var record models.MedicalRecord
	if err := h.db.Where("id = ? AND user_id = ?", recordID, userID).First(&record).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medical record not found"})
		return
	}

	if err := h.db.Delete(&record).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete medical record"})
		return
	}

	// Log activity
	activity := models.Activity{
		UserID:  userID,
		Type:    string(models.ActivityRecordUpdate),
		Details: "Deleted medical record: " + record.Type,
	}
	h.db.Create(&activity)

	c.JSON(http.StatusOK, gin.H{"message": "Medical record deleted successfully"})
}
