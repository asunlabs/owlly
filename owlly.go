package main

import (
	"fmt"
	"io/fs"
	"log"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/asunlabs/owlly/config"
	"github.com/fatih/color"
	"github.com/fsnotify/fsnotify"
	"github.com/joho/godotenv"
	"github.com/slack-go/slack"
)

var (
	api      *slack.Client
	onlyOnce sync.Once
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

func updateAndNotify() {
	bytes, readErr := os.ReadFile("./.env")
	nilChecker(readErr)

	path, _ := os.Getwd()
	fullpath := strings.Join([]string{path, "/config/.env.config"}, "")

	_, statErr := os.Stat(fullpath)

	if os.IsNotExist(statErr) {
		dirErr := os.Mkdir("/config", 0644)
		nilChecker(dirErr)
	}

	filePermission := 0644
	writeErr := os.WriteFile(fullpath, bytes, fs.FileMode(filePermission))
	nilChecker(writeErr)

	// if done send a DM to slack channel
	if isDone := isUpdateFinished(); isDone {
		envString := convertEnvMapToString(fullpath)
		onlyOnce.Do(func() {
			notifyEnvChange(envString)
		})
	}
}

func isUpdateFinished() bool {
	_data, _readErr := os.ReadFile("./.env")
	nilChecker(_readErr)

	data := string(_data)
	isDone := strings.Contains(data, config.RESERVED)

	log.Printf(".env in root DONE value: %v", isDone)

	return isDone
}

func convertEnvMapToString(envPath string) string {
	dotenvMap, readErr := godotenv.Read(envPath)
	nilChecker(readErr)

	// marshaling map: ascending sort
	marshalMsg, marshalErr := godotenv.Marshal(dotenvMap)
	nilChecker(marshalErr)

	color.Green(marshalMsg)

	return marshalMsg
}

func getUpdateMetadata() (string, string) {
	now := time.Now().String()
	log.Print(now)
	date := now[0:16]

	dirPath, dirErr := os.Getwd()
	nilChecker(dirErr)

	return date, dirPath // yyyy-mm-dd hh-mm
}

func notifyEnvChange(envString string) {
	date, dirPath := getUpdateMetadata()
	dateMsg := fmt.Sprintf(".env updated at: %v", date)
	pathMsg := fmt.Sprintf(".env directory is: %v", dirPath)

	attachedEnv := slack.AttachmentField{
		Title: "Copy and paste below texts to update",
		Value: envString,
		Short: false,
	}

	attachment := slack.Attachment{
		Title:   "ENV update",
		Fields:  []slack.AttachmentField{attachedEnv},
		Pretext: dateMsg,
		Footer:  pathMsg,
	}

	postTo := os.Getenv("SLACK_CHANNEL_ID")
	postWhat := slack.MsgOptionAttachments(attachment)
	postAs := slack.MsgOptionAsUser(true)

	channelID, _, msgErr := api.PostMessage(
		postTo,
		postWhat,
		postAs,
	)
	
	nilChecker(msgErr)

	resultMessage := fmt.Sprintf("message posted to channel %v at %v", channelID, date)
	color.Green(resultMessage)
}

func main() {
	envErr := godotenv.Load(".env")

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
					updateAndNotify()
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

	// Block main goroutine forever.
	<-make(chan struct{})
}
