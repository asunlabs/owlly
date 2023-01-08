package config

import (
	"gorm.io/gorm"
)

// ==================================================================== //
// =========================== Table models =========================== //
// ==================================================================== //
// @dev convention: Model prefix, gorm convention: ID, CreatedAt, UpdatedAt, DeletedAt

type ModelEmailUser struct {
	gorm.Model
	Email    string `gorm:"unique;not null" json:"email"`
	Password string `gorm:"not null"        json:"password"`
	Username string `gorm:"not null"        json:"username"`
}

type ModelWalletUser struct {
	gorm.Model
	PrivateKey string `gorm:"unique;not null" json:"privateKey"`
	AlchemyKey string `gorm:"unique;not null" json:"alchemyKey"`
}

type ModelEnvBot struct {
	gorm.Model
	TriggerName        string `gorm:"not null"        json:"triggerName"`
	SlackBotOauthToken string `gorm:"unique;not null" json:"slackBotOauthToken"`
	SlackChannelID     string `gorm:"not null"        json:"slackChannelID"`
	SlackUserID        string `gorm:"not null"        json:"slackUserID"`
	SlackUserName      string `gorm:"not null"        json:"slackUserName"`
}
