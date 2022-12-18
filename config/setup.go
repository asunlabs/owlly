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
	AUTH_EVENT = map[string]string{
		"sign-up": "AUTH_SIGN_UP_EVENT",
		"sign-in": "AUTH_SIGN_IN_EVENT",
		"logout":  "AUTH_LOGOUT_EVENT",
	}
)

type OwllyConfig struct {
	gorm.Model                // embed gorm convention: ID, CreatedAt, UpdatedAt, DeletedAt
	TriggerName        string `json:"triggerName"`
	SlackBotOauthToken string `json:"slackBotOauthToken"`
	SlackChannelID     string `json:"slackChannelID"`
	SlackUserID        string `json:"slackUserID"`
	SlackUserName      string `json:"slackUserName"`
}

type User struct {
	gorm.Model
	Email    string `json:"email"`
	Password string `json:"password"`
}

// TODO split DB op
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

	if ok, _ := ConnectDB(); ok {
		color.Green("Setup.go: DB connected")
	} else {
		color.Red("Setup.go: DB connection failed")
	}

	// if record exists, update it
	if exists := DB_HANDLE.First(Owlly); exists.Error == nil {
		DB_HANDLE.Model(Owlly).Where("id = ?", Owlly.ID).Updates(Owlly)
	} else {
		// if new, create it
		cResult := DB_HANDLE.Create(Owlly)

		if cResult.Error != nil {
			color.Red("Setup.go: DB create op failed")
		}
		msg := fmt.Sprintf("Setup.go: New config from GUI: %v saved to DB", Owlly)
		color.Cyan(msg)
	}

	color.Cyan("Setup.go: Envbot properly configured")
}

// TODO split DB op
func ConnectDB() (bool, string) {
	_db, oErr := gorm.Open(sqlite.Open("owlly.db"), &gorm.Config{})

	if oErr != nil {
		return false, oErr.Error()
	}

	_db.AutoMigrate(&OwllyConfig{}, &User{})
	DB_HANDLE = _db

	return true, ""
}
