package main

import (
	"context"
	"log"

	"owlly/v2/core"

	"github.com/asunlabs/owlly/config"
	"github.com/fatih/color"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// ==================================================================== //
// ========================== Init Wails app ========================== //
// ==================================================================== //
type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

// @dev startup is called when the app starts. The context is saved so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	// connect DB
	if ok, _ := config.ConnectDB(); ok {
		color.Green("Setup.go: DB connected")
	} else {
		color.Red("Setup.go: DB connection failed")
	}

	// init listener for Go <=> JS
	EventListener(ctx)
}

// ==================================================================== //
// ========================== Init Owlly app ========================== //
// ==================================================================== //
type Owlly struct{}

func NewOwlly() *Owlly {
	return &Owlly{}
}

// @dev set controller for Wails
func (o *Owlly) InitEnvBot() bool {
	if ok := core.InitEnvBot_(); ok {
		return true
	}

	return false
}

// TODO split service(provider) and controller like Nestjs
func (o *Owlly) CreateEnvBotConfig(botConfig config.ModelEnvBot) {
	config.CreateEnvBotConfig(botConfig)
}

// ==================================================================== //
// ======================= Wails event listener ======================= //
// ==================================================================== //
// @dev runtime context should be obtained from the OnStartup or OnDomReady hooks.
func EventListener(ctx context.Context) {
	runtime.EventsOn(ctx, config.SLACK_EVENT["update"], func(optionalData ...interface{}) {
		_newConfig := make(map[int]string)

		var newConfig config.ModelEnvBot

		for k, v := range optionalData {
			switch _v := v.(type) {
			case string:
				_newConfig[k] = _v
			default:
				log.Fatal("app.go:EventListener: Invalid config data type")
			}
		}

		newConfig.TriggerName = _newConfig[0]
		newConfig.SlackBotOauthToken = _newConfig[1]
		newConfig.SlackChannelID = _newConfig[2]
		newConfig.SlackUserID = _newConfig[3]
		newConfig.SlackUserName = _newConfig[4]

		// Read config info from frontend and do DB operation
		config.New(
			newConfig.TriggerName,
			newConfig.SlackBotOauthToken,
			newConfig.SlackChannelID,
			newConfig.SlackUserID,
			newConfig.SlackUserName,
		)
	})
}
