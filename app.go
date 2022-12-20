package main

import (
	"context"
	"github.com/fatih/color"
	config "github.com/asunlabs/owlly/config"
	core "owlly/v2/core"
	// account "github.com/asunlabs/owlly/core/account"
	bot "owlly/v2/core/bot"
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

// @dev Go/Js binding
func (o *Owlly) InitEnvBot() bool {
	if ok := core.InitEnvBot_(); ok {
		return true
	}

	return false
}

func (o *Owlly) CreateEnvBotConfig(botConfig config.ModelEnvBot) {
	bot.CreateEnvBotConfig(botConfig)
}

// ==================================================================== //
// ======================= Wails event listener ======================= //
// ==================================================================== //
// @dev runtime context should be obtained from the OnStartup or OnDomReady hooks.
func EventListener(ctx context.Context) {
	bot.HandleSlackUpdate(ctx)
}