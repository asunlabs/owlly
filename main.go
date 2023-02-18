package main

import (
	"embed"
	"os"

	"github.com/asunlabs/owlly/config"
	"github.com/fatih/color"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	config.InitLogger()
	defer config.Logger.Sync()

	// Create an instance of the app structure
	app := NewApp()
	owlly := NewOwlly()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "owlly",
		Width:  400,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
			owlly,
		},
	})

	if err != nil {
		color.Red("Main.go: Wails running up failed")
		config.Logger.Error("main function failure")
		os.Exit(1)
	}
}
