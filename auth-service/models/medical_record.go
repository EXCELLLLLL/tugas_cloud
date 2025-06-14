package models

import (
	"time"
)

type RecordType string

const (
	RecordTypeLab          RecordType = "lab"
	RecordTypeImaging      RecordType = "imaging"
	RecordTypeConsultation RecordType = "consultation"
)

type MedicalRecord struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	UserID      uint      `gorm:"not null" json:"userId"`
	Type        string    `gorm:"not null" json:"type"`
	Provider    string    `gorm:"not null" json:"provider"`
	Department  string    `gorm:"not null" json:"department"`
	Summary     string    `gorm:"type:text" json:"summary"`
	Attachments int       `gorm:"default:0" json:"attachments"`
	Date        time.Time `gorm:"not null" json:"date"`
	CreatedAt   time.Time `gorm:"not null" json:"createdAt"`
	UpdatedAt   time.Time `gorm:"not null" json:"updatedAt"`
	User        User      `gorm:"foreignKey:UserID" json:"-"`
}
