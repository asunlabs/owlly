package config

import (
	"log"
	"os"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var (
	// database connection handler
	DB *gorm.DB
)

type ChannelInfo struct {
	gorm.Model
	Keycode   Keycode `json:"keycode"`
	ChannelID string  `json:"channelID"` // channel ID generated by Slack, e.g: C099S3WB7PM
	Category  string  `json:"category"`
}

func Connect() {
	_db, openErr := gorm.Open(sqlite.Open("app.db"), &gorm.Config{})

	if openErr != nil {
		log.Println(openErr.Error())
		os.Exit(1)
	}

	DB = _db
}