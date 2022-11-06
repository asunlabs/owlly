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
	watcher  *fsnotify.Watcher
	api      *slack.Client
	onlyOnce sync.Once
	envList  = []string{".env", ".env.test", ".env.development", ".env.production"}
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

func getEnvList() []string {
	return envList
}

// @dev start watching multiple envs
func registerEnvs() {
	for _, v := range getEnvList() {
		wd, _ := os.Getwd()
		filePath := strings.Join([]string{wd, "/", v}, "")
		
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

func updateEnvs() {
	wd, _ := os.Getwd()

	for _, v := range getEnvList() {
		data, rErr := os.ReadFile(v)
		nilChecker(rErr)

		wrapDirName := "config"
		wrapDirPath := strings.Join([]string{wd, "/", wrapDirName, "/"}, "")
		wrapEnvName := strings.Join([]string{v, ".", wrapDirName}, "")
		wrapEnvFile := strings.Join([]string{wrapDirPath, wrapEnvName}, "")

		// @dev owning user has a read and write permission: 0644
		os.WriteFile(wrapEnvFile, data, fs.FileMode(config.OWNER_PERM))
	}
}

func cleanupEnvs() {
	wd, _ := os.Getwd()
	for _, v := range getEnvList() {
		fullPathForWrapEnv := strings.Join([]string{wd, "/", "config", "/", v, ".config"}, "")
		_, sErr := os.Stat(fullPathForWrapEnv)

		if ok := os.IsExist(sErr); ok {
			rErr := os.Remove(fullPathForWrapEnv)
			nilChecker(rErr)
		}

		_, cErr := os.Create(fullPathForWrapEnv)
		nilChecker(cErr)

		_data, rErr := os.ReadFile(v)
		nilChecker(rErr)

		wErr := os.WriteFile(fullPathForWrapEnv, _data, fs.FileMode(config.OWNER_PERM))
		nilChecker(wErr)
	}

	color.Red("envs config setup done")
}

func sendSlackDM() {
	wd, _ := os.Getwd()

	// has
	envStringMapForWrapEnv := make(map[string]string)
	envStringForWrapEnv := "DEFAULT_VALUE"
	
	for _, v := range getEnvList() {
		if isDone := isUpdateFinished(); isDone[v] {
			fullPathForWrapEnv := strings.Join([]string{wd, "/", "config", "/", v, ".config"}, "")
			wrapEnvName := strings.Join([]string{v, ".config"}, "")

			envStringForWrapEnv = convertEnvMapToString(fullPathForWrapEnv, wrapEnvName)
			envStringMapForWrapEnv[wrapEnvName] = envStringForWrapEnv

			notifyEnvChange(envStringMapForWrapEnv[wrapEnvName], v)
		}
	}
}

func isUpdateFinished() map[string]bool {
	// @dev initialze a map with make
	isDone := make(map[string]bool)

	for _, v := range getEnvList() {
		wd, _ := os.Getwd()
		fullPath := strings.Join([]string{wd, "/", v}, "")

		_data, _rErr := os.ReadFile(fullPath)
		nilChecker(_rErr)
		data := string(_data)

		hasOwllyTrigger := strings.Contains(data, config.RESERVED)
		isDone[v] = hasOwllyTrigger
	}

	return isDone
}

func convertEnvMapToString(envPath string, wrapEnvName string) string {
	dotenvMap, readErr := godotenv.Read(envPath)
	nilChecker(readErr)

	// marshaling map: ascending sort
	marshalMsg, marshalErr := godotenv.Marshal(dotenvMap)
	nilChecker(marshalErr)

	parsedMsg := fmt.Sprintf("file parsed: %v", wrapEnvName)
	color.Green(parsedMsg)

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

func notifyEnvChange(envString string, envFileName string) {
	date, dirPath := getUpdateMetadata()
	dateMsg := fmt.Sprintf("%v updated at: %v", envFileName, date)
	pathMsg := fmt.Sprintf("directory is: %v", dirPath)

	// @dev assert a parsed env value is thread-safe
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
	cleanupEnvs()

	onlyOnce.Do(func() {
		initSlack()
		initWatcher()
	})

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

	sendSlackDM()
	color.Blue("WORK DONE! Exit Owlly 👋")
	os.Exit(1)
}
