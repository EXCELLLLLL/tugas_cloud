package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email        string    `gorm:"uniqueIndex;not null" json:"email"`
	Password     string    `gorm:"not null" json:"-"`
	FirstName    string    `json:"firstName"`
	LastName     string    `json:"lastName"`
	Role         string    `gorm:"default:'user'" json:"role"`
	LastLogin    time.Time `json:"lastLogin"`
	IsActive     bool      `gorm:"default:true" json:"isActive"`
	RefreshToken string    `json:"-"`
}
