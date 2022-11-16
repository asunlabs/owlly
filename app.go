package main

import (
	"context"

	"github.com/asunlabs/owlly/config"
	"owlly/v2/core"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

type StartOwlly struct { }

func NewOwlly() *StartOwlly {
	return &StartOwlly{}
}

func (s *StartOwlly) Init()  {
	core.InitOwlly()
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// @dev runtime context should be obtained from the OnStartup or OnDomReady hooks.
func EventListener(ctx context.Context)  {	
	runtime.EventsOn(ctx, config.EVENT_CONFIG_UPDATE, func(optionalData ...interface{}) {
		_newConfig := make(map[int]string)

		var newConfig config.OwllyConfig

		for k, v := range optionalData {
			_newConfig[k] = v.(string)
		}
		newConfig.TriggerName = _newConfig[0]
		newConfig.SlackBotOauthToken = _newConfig[1]
		newConfig.SlackChannelID = _newConfig[2]
		newConfig.SlackUserID = _newConfig[3]
		newConfig.SlackUserName = _newConfig[4]

		config.New(
			newConfig.TriggerName,
			newConfig.SlackBotOauthToken,
			newConfig.SlackChannelID,
			newConfig.SlackUserID,
			newConfig.SlackUserName,
		)
	})
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	EventListener(ctx)
}
