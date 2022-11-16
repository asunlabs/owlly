package config

import (
	"fmt"

	"github.com/fatih/color"
)

var (
	Owlly *OwllyConfig
)

const (
	EVENT_CONFIG_UPDATE = "form_submit"
)

type OwllyConfig struct {
	TriggerName        string	`json:"triggerName"`
	SlackBotOauthToken string	`json:"slackBotOauthToken"`
	SlackChannelID     string	`json:"slackChannelID"`
	SlackUserID        string	`json:"slackUserID"`
	SlackUserName      string	`json:"slackUserName"`
}

func New(
	triggerName string, 
	slackBotOauthToken string, 
	slackChannelID string,
	slackUserID string,
	slackUserName string,
	) {

	var _Owlly OwllyConfig

	_Owlly.TriggerName = triggerName
	_Owlly.SlackBotOauthToken = slackBotOauthToken
	_Owlly.SlackChannelID = slackChannelID
	_Owlly.SlackUserID = slackUserID
	_Owlly.SlackUserName = slackUserName

	Owlly = &_Owlly
	msg := fmt.Sprintf("Config from GUI: %v", Owlly)
	color.Cyan(msg)
}
