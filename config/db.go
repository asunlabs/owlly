package config

import (
	"github.com/fatih/color"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// ==================================================================== //
// ========================= Init SQLite3 DB ========================== //
// ==================================================================== //

var (
	DB_HANDLE *gorm.DB
)

func __ConnectDB() (bool, string) {
	_db, oErr := gorm.Open(sqlite.Open("owlly.db"), &gorm.Config{})

	if oErr != nil {
		return false, oErr.Error()
	}

	_db.AutoMigrate(&OwllyConfig{}, &User{})
	DB_HANDLE = _db

	return true, ""
}

// ==================================================================== //
// ====================== Event-based CRUD DB OP ====================== //
// ==================================================================== //
// EnvBotDB OP

func CreateEnvBotConfig(botConfig ModelEnvBot) {
	cResult := DB_HANDLE.Create(botConfig)

	if cResult.Error != nil {
		color.Red("db.go: CreateEnvBotConfig failed to execute")
	} else {
		color.Green(("db.go:DONE: envbot config created"))
	}
}

func UpdateEnvBotConfig(botConfig ModelEnvBot) {
	uResult := DB_HANDLE.Model(ModelEnvBot{}).Where("id = ?", botConfig.ID).Updates(botConfig)

	if uResult.Error != nil {
		color.Red("db.go: UpdateEnvBotConfig failed to execute")
	} else {
		color.Green(("db.go:DONE: envbot config updated"))
	}
}
