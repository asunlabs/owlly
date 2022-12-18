package config

import (
	"errors"

	"github.com/fatih/color"
	"gorm.io/gorm"
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

	// TODO fix gorm UNIQUE constraint failed
	if rErr := DB_HANDLE.Where("id = ?", EnvBot.ID).First(EnvBot).Error; errors.Is(rErr, gorm.ErrRecordNotFound) {
		CreateEnvBotConfig(*EnvBot)
	} else { 
		UpdateEnvBotConfig(*EnvBot)
	}
	color.Cyan("Setup.go: Envbot properly configured")
}
