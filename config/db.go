package config

import (
	"fmt"

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

func ConnectDB() (bool, string) {
	_db, oErr := gorm.Open(sqlite.Open("owlly.db"), &gorm.Config{})

	if oErr != nil {
		return false, oErr.Error()
	}

	_db.AutoMigrate(&ModelEmailUser{}, &ModelWalletUser{}, &ModelEnvBot{})
	DB_HANDLE = _db

	return true, ""
}

// ==================================================================== //
// ====================== Event-based CRUD DB OP ====================== //
// ==================================================================== //
// EnvBot DB OP

func CreateEnvBotConfig(botConfig ModelEnvBot) {
	// @dev should t ake a struct pointer as parameter
	cResult := DB_HANDLE.Create(&botConfig)

	if cResult.Error != nil {
		color.Red("db.go: CreateEnvBotConfig failed to execute")
	} else {
		color.Green(("db.go:DONE: envbot config created"))
	}
}

func UpdateEnvBotConfig(botConfig ModelEnvBot) {
	uResult := DB_HANDLE.Model(&botConfig).Where("id = ?", botConfig.ID).Updates(botConfig)

	if uResult.Error != nil {
		color.Red("db.go: UpdateEnvBotConfig failed to execute")
	} else {
		color.Green(("db.go:DONE: envbot config updated"))
	}
}

// Account DB OP
// sign up
func CreateEmailUser(emailUser ModelEmailUser)  {
	cResult := DB_HANDLE.Create(&emailUser)

	if cResult.Error != nil {
		color.Red("db.go: CreateEmailUser failed to execute")
	} else {
		color.Green(("db.go:DONE: new email user created"))
	}
}

func ReadEmailUser(email string)  {
	// db.First, db.Last only works with struct pointer parameter
	rResult := DB_HANDLE.Where("email = ?", email).First(&ModelEmailUser{})

	if rResult.Error != nil {
		color.Red("db.go: UpdateEmailUser failed to execute")
	} else {
		color.Green(("db.go:DONE: new email user created"))
	}
}

// update password
// TODO add password hashing mechanism with https://github.com/golang/crypto/tree/master/bcrypt
func UpdateEmailUser(id uint, newPassword string)  {
	rResult := DB_HANDLE.Where("id = ?", id).First(&ModelEmailUser{})
	
	if rResult.Error != nil {
		color.Red("db.go: UpdateEmailUser failed to execute")
	} else {
		// only update a record with the specified id
		DB_HANDLE.Model(&ModelEmailUser{}).Where("id = ?", id).Update("Password", newPassword)
		message := fmt.Sprintf("db.go:DONE: email user with id %v is updated", id)
		color.Green(message)
	}
}

func DeleteEmailUser(id uint)  {
	rResult := DB_HANDLE.Where("id = ?", id).First(&ModelEmailUser{})

	if rResult.Error != nil {
		color.Red("db.go: DeleteEmailUser failed to execute")
	} else {
		DB_HANDLE.Where("id = ?", id).Delete(&ModelEmailUser{})
	}
}
