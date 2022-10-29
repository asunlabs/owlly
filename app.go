package main

import (
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/fatih/color"
	"github.com/fsnotify/fsnotify"
	"github.com/joho/godotenv"
	"github.com/slack-go/slack"
)

var (
	api *slack.Client
)

func nilChecker(err error) {
	if err != nil {
		color.Red(err.Error())
		os.Exit(1)
	}
}

func initWatcher() *fsnotify.Watcher {
	watcher, err := fsnotify.NewWatcher()
	nilChecker(err)

	return watcher
}

func initSlack() {
	_api := slack.New(os.Getenv("SLACK_BOT_USER_OAUTH_TOKEN"))
	res, err := _api.AuthTest()
	nilChecker(err)

	connectionMsg := fmt.Sprintf("slack API connected to: %s", res.Team)
	color.Green(connectionMsg)

	api = _api
}

func overwriteEnv() {
	bytes, readErr := os.ReadFile("./.env")
	nilChecker(readErr)

	path, _ := os.Getwd()
	fullpath := strings.Join([]string{path, "/config/.env"}, "")

	_, statErr := os.Stat(fullpath)

	if os.IsNotExist(statErr) {
		dirErr := os.Mkdir("config", 0644)
		nilChecker(dirErr)
	}

	writeErr := os.WriteFile(fullpath, bytes, 0644)
	nilChecker(writeErr)
}

func notifyEnvChange() {
	isDone := os.Getenv("DONE")
	empty := 0

	if len(isDone) != empty {
		channelID, timestamp, msgErr := api.PostMessage(
			os.Getenv("SLACK_TEST_CHANNEL_ID"),
			slack.MsgOptionText(".env updated", false),
			slack.MsgOptionAsUser(true),
		)

		nilChecker(msgErr)

		resultMessage := fmt.Sprintf("message posted to %s at %s", channelID, timestamp)
		color.Green(resultMessage)
	}
}

func main() {
	envErr := godotenv.Load(".env")

	beforeBytes, _ := os.ReadFile(".env")
	beforeBytesMsg := fmt.Sprintf("env length before: %d", len(beforeBytes))
	color.Magenta(beforeBytesMsg)

	nilChecker(envErr)

	initSlack()
	watcher := initWatcher()

	go func() {
		for {
			select {
			case event, ok := <-watcher.Events:
				if !ok {
					log.Println("event failing")
				}
				if event.Has(fsnotify.Write) && event.Name == ".env" {
					log.Println("modified file: ", event.Name)
					overwriteEnv()
					notifyEnvChange()
				}
			case err, ok := <-watcher.Errors:
				nilChecker(err)
				if !ok {
					log.Println("event failing")
				}
			}
		}
	}()

	/// @dev starts monitoring the path for changes.
	watcherErr := watcher.Add(".env")
	nilChecker(watcherErr)

	afterBytes, _ := os.ReadFile("./config/.env")
	afterBytesMsg := fmt.Sprintf("env length after: %d", len(afterBytes))
	color.Magenta(afterBytesMsg)

	// Block main goroutine forever.
	<-make(chan struct{})
}
