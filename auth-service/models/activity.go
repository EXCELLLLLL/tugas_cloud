package models

import (
	"time"
)

type ActivityType string

const (
	ActivityProfileUpdate ActivityType = "profile_update"
	ActivityLogin         ActivityType = "login"
	ActivityLogout        ActivityType = "logout"
	ActivityAppointment   ActivityType = "appointment"
	ActivityRecordView    ActivityType = "record_view"
	ActivityRecordUpdate  ActivityType = "record_update"
	ActivityMessage       ActivityType = "message"
)

type Activity struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `gorm:"not null"`
	Type      string    `gorm:"not null"`
	Details   string    `gorm:"type:text"`
	CreatedAt time.Time `gorm:"not null"`
	User      User      `gorm:"foreignKey:UserID"`
}
