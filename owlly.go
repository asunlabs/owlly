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
	envLists = []string{".env", ".env.test", ".env.development", ".env.production"}
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
	var fullPath string

	for _, v := range envLists {
		path, _ := os.Getwd()
		fullPath = strings.Join([]string{path, "\\config\\", v, ".config"}, "")
		log.Println("path is: ",fullPath)
		bytes, readErr := os.ReadFile(fullPath)
		nilChecker(readErr)	

		// TODO fix not writing file bug
		filePermission := 0644
		writeErr := os.WriteFile(fullPath, bytes, fs.FileMode(filePermission))
		nilChecker(writeErr)
	}
	// if done send a DM to slack channel
	if isDone := isUpdateFinished(); isDone {
		envString := convertEnvMapToString(fullPath)
		onlyOnce.Do(func() {
			notifyEnvChange(envString)
		})
	}
}

func isUpdateFinished() bool {
	var isDone bool

	for _, v := range envLists {
		dir, _ := os.Getwd()
		fullPath := strings.Join([]string{dir, "\\", v}, "")
		_data, _readErr := os.ReadFile(fullPath)

		nilChecker(_readErr)
		
		data := string(_data)
		isDone = strings.Contains(data, config.RESERVED)
	
		log.Printf(".env in root DONE value: %v", isDone)
	}

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
	for _, v := range envLists {
		dir, _ := os.Getwd()
		fullPath := strings.Join([]string{dir, "\\", v}, "")
		log.Println(fullPath)
		_, readErr := os.ReadFile(fullPath)

		nilChecker(readErr)

		watcherErr := watcher.Add(v)
		color.Blue(fmt.Sprintf("watching: %v", v))
		nilChecker(watcherErr)

	}

	// Block main goroutine forever.
	<-make(chan struct{})
}
