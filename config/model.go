package config
import (
	"gorm.io/gorm"
)

// ==================================================================== //  
// =========================== Table models =========================== //  
// ==================================================================== // 
// @dev convention: Model prefix, gorm struct

type ModelEmailUser struct {
	gorm.Model
	Email string `json:"email"`
	Password string `json:"password"`
	Username string `json:"username"`
}

type ModelWalletUser struct {
	gorm.Model
	PrivateKey string `json:"privateKey"`
	AlchemyKey string `json:"alchemyKey"`
	Salt string `json:"salt"`
}

type ModelEnvBot struct {
	gorm.Model // embed gorm convention: ID, CreatedAt, UpdatedAt, DeletedAt
	TriggerName        string `json:"triggerName"`
	SlackBotOauthToken string `json:"slackBotOauthToken"`
	SlackChannelID     string `json:"slackChannelID"`
	SlackUserID        string `json:"slackUserID"`
	SlackUserName      string `json:"slackUserName"`
	Salt string `json:"salt"`
}

