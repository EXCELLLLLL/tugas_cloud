package models

import (
	"time"
	"gorm.io/gorm"
)

// EmergencyContact represents an emergency contact for a user
type EmergencyContact struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	BioInfoID uint      `json:"-"`
	Name      string    `gorm:"not null" json:"name"`
	Phone     string    `gorm:"not null" json:"phone"`
	CreatedAt time.Time `gorm:"not null" json:"createdAt"`
	UpdatedAt time.Time `gorm:"not null" json:"updatedAt"`
}

// BioInformation represents detailed patient bio information
type BioInformation struct {
	gorm.Model
	UserID            uint              `gorm:"uniqueIndex;not null" json:"userId"`
	FullName          string            `json:"fullName"`
	DateOfBirth       string            `json:"dob"`
	Gender            string            `json:"gender"`
	Address           string            `json:"address"`
	Phone             string            `json:"phone"`
	BloodType         string            `json:"bloodType"`
	Allergies         string            `gorm:"type:text" json:"allergies"`
	Medications       string            `gorm:"type:text" json:"medications"`
	ChronicConditions string            `gorm:"type:text" json:"chronic"`
	InsuranceProvider string            `json:"insuranceProvider"`
	PolicyNumber      string            `json:"policyNumber"`
	ProfilePhoto      string            `gorm:"type:text" json:"profilePhoto"`
	InsuranceCard     string            `gorm:"type:text" json:"insuranceCard"`
	EmergencyContacts []EmergencyContact `gorm:"foreignKey:BioInfoID" json:"emergencyContacts"`
	User              User              `gorm:"foreignKey:UserID" json:"-"`
}