package main

import (
	"fmt"
	"io/fs"
	"log"
	"os"
	"strings"
	"time"

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
	fullpath := strings.Join([]string{path, "/config/.env.config"}, "")

	_, statErr := os.Stat(fullpath)

	if os.IsNotExist(statErr) {
		dirErr := os.Mkdir("config", 0644)
		nilChecker(dirErr)
	}

	filePermission := 0644
	writeErr := os.WriteFile(fullpath, bytes, fs.FileMode(filePermission))
	nilChecker(writeErr)
}

func isUpdateFinished() bool {
	isDone := os.Getenv("DONE")
	empty := 0

	if len(isDone) != empty {
		return true
	} else { 
		return false
	}
}

func convertEnvMapToString(envPath string) string {
	dotenvMap, readErr := godotenv.Read(envPath)
	nilChecker(readErr)

	toString, marshalErr := godotenv.Marshal(dotenvMap)
	nilChecker(marshalErr)

	// ascending  sort
	marshalMsg := fmt.Sprintf("CHANGED DOTENV: %s", toString)
	color.Green(marshalMsg)

	return marshalMsg
}

func getCurrenTimestamp() string  {
	now := time.Now().String()
	log.Print(now)
	date := now[0:16]

	return date // yyyy-mm-dd hh-mm
}

func notifyEnvChange(envString string) {

	date := getCurrenTimestamp()
	dateMsg := fmt.Sprintf(".env updated at: %s", date)

	attachment := slack.Attachment{
		Pretext: dateMsg,
	}

	slack.MsgOptionAttachments()
		channelID, timestamp, msgErr := api.PostMessage(
			os.Getenv("SLACK_TEST_CHANNEL_ID"),
			slack.MsgOptionText(envString, false),
			slack.MsgOptionAttachments(attachment),
			slack.MsgOptionAsUser(true),
		)

		nilChecker(msgErr)

		resultMessage := fmt.Sprintf("message posted to %s at %s", channelID, timestamp)
		color.Green(resultMessage)
}

func main() {
	envErr := godotenv.Load(".env")

	beforeBytes, _ := os.ReadFile(".env")
	beforeBytesMsg := fmt.Sprintf("env length before: %d", len(beforeBytes))
	color.Magenta(beforeBytesMsg)
	color.Red(os.Getenv("DONE"))

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
				if event.Has(fsnotify.Write) {
					log.Println("modified file: ", event.Name)
					overwriteEnv()
				}
			case err, ok := <-watcher.Errors:
				nilChecker(err)
				if !ok {
					log.Println("event failing")
				}
			}
		}
	}()

	go func () {
		for {
			if isFinished := isUpdateFinished(); isFinished {
				envString := convertEnvMapToString("./config/.env.config")
				notifyEnvChange(envString)
				break
			}
		}
	}()

	/// @dev starts monitoring the path for changes.
	watcherErr := watcher.Add(".env")
	nilChecker(watcherErr)

	afterBytes, _ := os.ReadFile("./config/.env.config")
	afterBytesMsg := fmt.Sprintf("env length after: %d", len(afterBytes))
	color.Magenta(afterBytesMsg)

	// Block main goroutine forever.
	<-make(chan struct{})
}
