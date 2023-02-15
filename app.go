package main

import (
	"context"
	core "owlly/v2/core"

	// account "owlly/v2/core/account"
	"owlly/v2/core/account"
	bot "owlly/v2/core/bot"

	config "github.com/asunlabs/owlly/config"
	"github.com/fatih/color"
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
	config.InitLogger()
	defer config.Logger.Sync()
	a.ctx = ctx

	if ok, _ := config.ConnectDB(); ok {
		color.Green("App.go: App successfully started")
		config.Logger.Info("Wails startup success")

		InitEventListeners(ctx)
	} else {
		color.Red("App.go: App launch failed")
		config.Logger.Error("Wails startup failure")
	}
}

// ==================================================================== //
// ========================== Init Owlly app ========================== //
// ==================================================================== //
// @dev bind go method to js to get owlly response, only binded method
type Owlly struct{}

func NewOwlly() *Owlly {
	return &Owlly{}
}

/*
Front end JS modules will call these Go methods
*/
func (o *Owlly) InitEnvBot() bool {
	if ok := core.InitEnvBot_(); ok {
		return true
	}

	return false
}

func (o *Owlly) HandleEmailSignUp() config.OWLLY_RESPONSE {
	return account.CreateEmailUser()
}

// ==================================================================== //
// ======================= Wails event listener ======================= //
// ==================================================================== //
// @dev runtime context should be obtained from the OnStartup or OnDomReady hooks.
// @dev call controller and deliver wails context
func InitEventListeners(ctx context.Context) {
	bot.InitBotModuleListener(ctx)
	account.InitAccountModuleListener(ctx)
}
