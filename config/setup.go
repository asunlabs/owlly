package config

import (
	"os"
	"strings"

	"github.com/fatih/color"
	"go.uber.org/zap"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var (
	DB_HANDLE   *gorm.DB
	EnvBot      *ModelEnvBot
	Logger      *zap.SugaredLogger
	SLACK_EVENT = map[string]string{
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
		"DB_OP_FAILURE":    777,
		"UUID_GEN_FAILURE": 778,
		"ZAP_FAILURE":      779,
	}
	SUCCESS_CODE = map[string]uint{
		"OK": 200,
	}
)

const (
	DATABASE_NAME = "owlly.db"
	LOG_DIR_NAME  = "logs"
)

// @dev return response with data for getter: e.g account.service.go:ReadEmailUser
type OWLLY_RESPONSE struct {
	Code    uint
	Message string
	Data    string
}

// ==================================================================== //
// ========================= Init SQLite3 DB ========================== //
// ==================================================================== //
func ConnectDB() (bool, string) {
	_db, oErr := gorm.Open(sqlite.Open(DATABASE_NAME), &gorm.Config{})

	if oErr != nil {
		color.Red("Setup.go: DB connection failed")
		Logger.Error("ConnectDB failure")
		return false, oErr.Error()
	}

	_db.AutoMigrate(&ModelEmailUser{}, &ModelWalletUser{}, &ModelEnvBot{})
	DB_HANDLE = _db

	color.Green("Setup.go: DB connected")
	Logger.Info("ConnectDB success")

	return true, ""
}

// @dev get event values from front end and update config
// TODO move this implementation to wails event listener
func New(
	triggerName string,
	slackBotOauthToken string,
	slackChannelID string,
	slackUserID string,
	slackUserName string,
) {
	InitLogger()
	defer Logger.Sync()

	var _EnvBot ModelEnvBot

	_EnvBot.TriggerName = triggerName
	_EnvBot.SlackBotOauthToken = slackBotOauthToken
	_EnvBot.SlackChannelID = slackChannelID
	_EnvBot.SlackUserID = slackUserID
	_EnvBot.SlackUserName = slackUserName

	EnvBot = &_EnvBot

	color.Cyan("Setup.go: Envbot properly configured")
	Logger.Infof("New success %v", EnvBot)
}

/*
@dev Applications should take care to call Sync before exiting.
@dev Check out logger configs below

	Level:            NewAtomicLevelAt(DebugLevel),
	Development:      true,
	Encoding:         "console",
	EncoderConfig:    NewDevelopmentEncoderConfig(),
	OutputPaths:      []string{"stderr"},
	ErrorOutputPaths: []string{"stderr"},
*/
func InitLogger() {
	root, _ := os.Getwd()
	_output := strings.Join([]string{root, LOG_DIR_NAME, "output-log.txt"}, "/")
	_error := strings.Join([]string{root, LOG_DIR_NAME, "error-log.txt"}, "/")

	options := zap.NewDevelopmentConfig()
	options.OutputPaths = []string{_output}
	options.ErrorOutputPaths = []string{_error}

	_logger, _ := options.Build()
	Logger = _logger.Sugar()
}
