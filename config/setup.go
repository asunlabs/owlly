package config

import (
	"fmt"

	"github.com/fatih/color"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var (
	Owlly       *OwllyConfig
	SLACK_EVENT = map[string]string{
		"update": "SLACK_UPDATE_EVENT",
		"delete": "SLACK_DELETE_EVENT",
	}
	DB_HANDLE *gorm.DB
)

type OwllyConfig struct {
	TriggerName        string `json:"triggerName"`
	SlackBotOauthToken string `json:"slackBotOauthToken"`
	SlackChannelID     string `json:"slackChannelID"`
	SlackUserID        string `json:"slackUserID"`
	SlackUserName      string `json:"slackUserName"`
}

// @dev get event values from front end and update config
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

	ok, _ := ConnectDB()

	if ok {
		DB_HANDLE.Model(&OwllyConfig{}).Updates(&_Owlly)
		msg := fmt.Sprintf("Config from GUI: %v saved to DB", Owlly)
		color.Cyan(msg)
	} else {
		color.Red("DB connection failed")
	}
}

func ConnectDB() (bool, string) {
	_db, oErr := gorm.Open(sqlite.Open("owlly.db"), &gorm.Config{})

	if oErr != nil {
		return false, oErr.Error()
	}

	_db.AutoMigrate(&OwllyConfig{})
	DB_HANDLE = _db

	return true, ""
}
