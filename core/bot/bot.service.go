package bot

import (
	"github.com/asunlabs/owlly/config"
	"github.com/fatih/color"
)

// ==================================================================== //
// ====================== Event-based CRUD DB OP ====================== //
// ==================================================================== //
// EnvBot DB OP

func CreateEnvBotConfig(botConfig config.ModelEnvBot) {

	// @dev should t ake a struct pointer as parameter
	cResult := config.DB_HANDLE.Create(&botConfig)

	if cResult.Error != nil {
		color.Red("db.go: CreateEnvBotConfig failed to execute")
	} else {
		color.Green(("db.go:DONE: envbot config created"))
	}
}

// @dev &struct{}: type, &struct: value
func ReadEnvBotConfigById(id uint) {
	var botConfig config.ModelEnvBot

	rResult := config.DB_HANDLE.Where("id = ?", id).First(&botConfig)

	if rResult.Error != nil {
		color.Red("db.go: ReadEnvBotConfigById failed to execute")
	} else {
		color.Green(("db.go:DONE: envbot config record fetched"))
	}
}

func UpdateEnvBotConfig(botConfig config.ModelEnvBot) {
	uResult := config.DB_HANDLE.Model(&botConfig).Where("id = ?", botConfig.ID).Updates(botConfig)

	if uResult.Error != nil {
		color.Red("db.go: UpdateEnvBotConfig failed to execute")
	} else {
		color.Green(("db.go:DONE: envbot config updated"))
	}
}

func DeleteEnvBotConfig(botConfig config.ModelEnvBot) {
	// soft delete
	dResult := config.DB_HANDLE.Where("id = ?", botConfig.ID).Delete(&botConfig)

	if dResult.Error != nil {
		color.Red("db.go: DeleteEnvBotConfig failed to execute")
	} else {
		color.Green(("db.go:DONE: envbot config deleted"))
	}
}
