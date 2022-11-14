package main

import (
	"context"
		"github.com/wailsapp/wails/v2/pkg/runtime"
	
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// @dev runtime context should be obtained from the OnStartup or OnDomReady hooks.
func EventListener(ctx context.Context)  {
	runtime.EventsOn(ctx, "form_submit", func(optionalData ...interface{}) {
		println(optionalData)
	})
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	EventListener(ctx)
}
