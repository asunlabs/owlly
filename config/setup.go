package config

import (
	"fmt"

	"github.com/fatih/color"
)

var (
	EnvBot       *ModelEnvBot
	SLACK_EVENT = map[string]string{
		"update": "SLACK_UPDATE_EVENT",
		"delete": "SLACK_DELETE_EVENT",
	}
	AUTH_EVENT = map[string]string{
		"sign-up": "AUTH_SIGN_UP_EVENT",
		"sign-in": "AUTH_SIGN_IN_EVENT",
		"logout":  "AUTH_LOGOUT_EVENT",
	}
)

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

	if ok, _ := ConnectDB(); ok {
		color.Green("Setup.go: DB connected")
	} else {
		color.Red("Setup.go: DB connection failed")
	}

	// if record exists, update it
	if exists := DB_HANDLE.First(EnvBot); exists.Error == nil {
		DB_HANDLE.Model(EnvBot).Where("id = ?", EnvBot.ID).Updates(EnvBot)
	} else {
		// if new, create it
		cResult := DB_HANDLE.Create(EnvBot)

		if cResult.Error != nil {
			color.Red("Setup.go: DB create op failed")
		}
		msg := fmt.Sprintf("Setup.go: New config from GUI: %v saved to DB", EnvBot)
		color.Cyan(msg)
	}

	color.Cyan("Setup.go: Envbot properly configured")
}
