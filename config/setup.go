package config

import (
	"github.com/fatih/color"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var (
	DB_HANDLE     *gorm.DB
	EnvBot        *ModelEnvBot
	DATABASE_NAME = "owlly.db"
	SLACK_EVENT   = map[string]string{
		"update": "SLACK_UPDATE_EVENT",
		"delete": "SLACK_DELETE_EVENT",
	}
	AUTH_EMAIL = map[string]string{
		"sign-up": "AUTH_SIGN_UP_EVENT",
		"sign-in": "AUTH_SIGN_IN_EVENT",
		"logout":  "AUTH_LOGOUT_EVENT",
	}
	AUTH_WALLET = map[string]string{
		"sign-up": "AUTH_SIGN_UP_EVENT",
		"sign-in": "AUTH_SIGN_IN_EVENT",
		"logout":  "AUTH_LOGOUT_EVENT",
	}
	ERROR_CODE = map[string]uint{
		"DB_OB_FAILURE":    777,
		"UUID_GEN_FAILURE": 778,
	}
	SUCCESS_CODE = map[string]uint{
		"OK": 200,
	}
)

type OWLLY_RESPONSE struct {
	Code    uint
	Message string
}

// ==================================================================== //
// ========================= Init SQLite3 DB ========================== //
// ==================================================================== //
func ConnectDB() (bool, string) {
	_db, oErr := gorm.Open(sqlite.Open(DATABASE_NAME), &gorm.Config{})

	if oErr != nil {
		return false, oErr.Error()
	}

	_db.AutoMigrate(&ModelEmailUser{}, &ModelWalletUser{}, &ModelEnvBot{})
	DB_HANDLE = _db

	return true, ""
}

// @dev get event values from front end and update config
func New(
	triggerName string,
	slackBotOauthToken string,
	slackChannelID string,
	slackUserID string,
	slackUserName string,
) {
	var _EnvBot ModelEnvBot

	_EnvBot.TriggerName = triggerName
	_EnvBot.SlackBotOauthToken = slackBotOauthToken
	_EnvBot.SlackChannelID = slackChannelID
	_EnvBot.SlackUserID = slackUserID
	_EnvBot.SlackUserName = slackUserName

	EnvBot = &_EnvBot
	color.Cyan("Setup.go: Envbot properly configured")
}
