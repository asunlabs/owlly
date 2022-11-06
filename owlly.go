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
	watcher *fsnotify.Watcher
	api      *slack.Client
	onlyOnce sync.Once
	envList  = []string{".env", ".env.test", ".env.development", ".env.production"}
	customList = []string{}
	slackChannelList = []string{""}
)

func nilChecker(err error) {
	if err != nil {
		color.Red(err.Error())
		os.Exit(1)
	}
}

func initWatcher() {
	_watcher, err := fsnotify.NewWatcher()
	nilChecker(err)

	watcher = _watcher
}

func getEnvList() []string  {
	return envList
}

func getCustomList() []string  {
	return customList
}

// @dev start watching multiple envs
func registerEnvs() {
	for _, v := range getEnvList() {
		wd, _ := os.Getwd()
		filePath := strings.Join([]string{wd, "\\", v}, "")
		log.Println(filePath)
		wErr := watcher.Add(filePath)
		nilChecker(wErr)
		color.Blue(fmt.Sprintf("watching: %v", v))
	}
}

// @dev load multiple envs and init slack instance
func initSlack() {
	for _, v := range envList {
		lErr := godotenv.Load(v)
		nilChecker(lErr)
	}

	_api := slack.New(os.Getenv("SLACK_BOT_USER_OAUTH_TOKEN"))
	res, err := _api.AuthTest()
	nilChecker(err)

	connectionMsg := fmt.Sprintf("slack API connected to: %s", res.Team)
	color.Green(connectionMsg)

	api = _api
}

func updateEnvs()  {
	wd, _ := os.Getwd()
	
	for _, v := range getEnvList() {
		data, rErr := os.ReadFile(v)
		nilChecker(rErr)
		
		wrapDirName := "config"
		wrapDirPath := strings.Join([]string{wd, "\\", wrapDirName, "\\"}, "")
		wrapEnvName := strings.Join([]string{v, ".", wrapDirName}, "")
		wrapEnvFile := strings.Join([]string{wrapDirPath, wrapEnvName}, "")
		
		// @dev owning user has a read and write permission: 0644
		os.WriteFile(wrapEnvFile, data, fs.FileMode(config.OWNER_PERM))
	}
}

func updateAndNotify() {
	var fullPath string

	for _, v := range envList {
		path, _ := os.Getwd()
		fullPath = strings.Join([]string{path, "\\config\\", v, ".config"}, "")
		log.Println("path is: ", fullPath)
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

	for _, v := range envList {
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

/// @dev textify
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


	initSlack()
	initWatcher()

	/// @dev starts monitoring the path for changes.
	registerEnvs()

	go func() {
		for {
			select {
			case event, ok := <-watcher.Events:
				if !ok {
					log.Println("event failing")
				}
				if event.Has(fsnotify.Write) {
					log.Println("modified file: ", event.Name)
					// TODO split update and notify
					// updateAndNotify()
					updateEnvs()
				}
			case err, ok := <-watcher.Errors:
				nilChecker(err)
				if !ok {
					log.Println("event failing")
				}
			}
		}
	}()

	// Block main goroutine forever.
	<-make(chan struct{})
}
