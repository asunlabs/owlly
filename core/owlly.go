package core

import (
	"fmt"
	"io/fs"
	"log"
	"os"
	"path/filepath"
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
	root string
	watcher  *fsnotify.Watcher
	api      *slack.Client
	onlyOnce sync.Once
	envList  = []string{
		".env",
		".env.test",
		".env.development",
		".env.production",
		".env.dev",
		".env.stage",
		".env.prod",
		".env.local",
		".env.development.local",
		".env.test.local",
		".env.production.local",
	}
)

func nilChecker(err error) (bool, string) {
	if err != nil {
		color.Red(err.Error())
		return false, err.Error()
	}

	return true, ""
}

func initWatcher() {
	_watcher, err := fsnotify.NewWatcher()
	nilChecker(err)

	watcher = _watcher
}

func getEnvList() []string {
	return envList
}

func hasNamedEnvFiles(filePath string) bool {
	var result bool

	_, fErr := os.Stat(filePath)

	if os.IsNotExist(fErr) {
		result = false
	}

	if !os.IsNotExist(fErr) {
		result = true
	}

	return result
}

// @dev start watching multiple envs
func registerEnvs() {
	wd, _ := os.Getwd()

	for _, v := range getEnvList() {
		filePath := strings.Join([]string{wd, "/", v}, "")

		// add only existing envs
		ok := hasNamedEnvFiles(filePath)

		if ok {
			wErr := watcher.Add(filePath)
			nilChecker(wErr)
			color.Blue(fmt.Sprintf("watching: %v", v))
		}
	}
}

// @dev load multiple envs and init slack instance
func initSlack() {
	wd, _ := os.Getwd()
	for _, v := range envList {
		filePath := strings.Join([]string{wd, "/", v}, "")
		ok := hasNamedEnvFiles(filePath)

		if ok {
			lErr := godotenv.Load(filePath)
			nilChecker(lErr)
		}
	}

	_api := slack.New(config.Owlly.SlackBotOauthToken)
	res, err := _api.AuthTest()
	nilChecker(err)

	connectionMsg := fmt.Sprintf("slack API connected to: %s", res.Team)
	color.Green(connectionMsg)

	api = _api
}

func updateEnvs() {
	wd, _ := os.Getwd()

	for _, v := range getEnvList() {
		filePath := strings.Join([]string{wd, "/", v}, "")

		ok := hasNamedEnvFiles(filePath)

		if ok {
			data, rErr := os.ReadFile(filePath)
			nilChecker(rErr)

			wrapDirName := "config"
			wrapDirPath := strings.Join([]string{wd, "/", wrapDirName, "/"}, "")
			wrapEnvName := strings.Join([]string{v, ".", wrapDirName}, "")
			wrapEnvFile := strings.Join([]string{wrapDirPath, wrapEnvName}, "")

			// @dev owning user has a read and write permission: 0644
			ownerPerm := 0644
			os.WriteFile(wrapEnvFile, data, fs.FileMode(ownerPerm))
		}
	}
}

func cleanupEnvs() {
	userEnvList := []string{}
	wd, _ := os.Getwd()

	for _, v := range getEnvList() {
		ok := hasNamedEnvFiles(strings.Join([]string{wd, "/", v}, ""))
		if ok {
			userEnvList = append(userEnvList, v)
		}
	}

	for _, v := range userEnvList {
		fullPathForWrapEnv := strings.Join([]string{wd, "/", "config", "/", v, ".config"}, "")
		rootEnvPath := strings.Join([]string{wd, "/", v}, "")

		ok := hasNamedEnvFiles(fullPathForWrapEnv)

		if ok {
			rErr := os.Remove(fullPathForWrapEnv)
			nilChecker(rErr)
		}

		_, cErr := os.Create(fullPathForWrapEnv)
		nilChecker(cErr)

		_data, rErr := os.ReadFile(rootEnvPath)
		nilChecker(rErr)

		ownerPerm := 0644
		wErr := os.WriteFile(fullPathForWrapEnv, _data, fs.FileMode(ownerPerm))
		nilChecker(wErr)
	}
	color.Red("envs config setup done")
}

func sendSlackDM() {
	wd, _ := os.Getwd()
	envStringMapForWrapEnv := make(map[string]string)
	envStringForWrapEnv := "DEFAULT_VALUE"

	for _, v := range getEnvList() {
		filePath := strings.Join([]string{wd, "/", v}, "")

		ok := hasNamedEnvFiles(filePath)

		if ok {
			if isDone := isUpdateFinished(); isDone[v] {

				fullPathForWrapEnv := strings.Join(
					[]string{wd, "/", "config", "/", v, ".config"},
					"",
				)
				wrapEnvName := strings.Join([]string{v, ".config"}, "")

				envStringForWrapEnv = convertEnvMapToString(fullPathForWrapEnv, wrapEnvName)
				envStringMapForWrapEnv[wrapEnvName] = envStringForWrapEnv

				notifyEnvChange(envStringMapForWrapEnv[wrapEnvName], v)
			}
		}
	}
}

func isUpdateFinished() map[string]bool {
	// @dev initialze a map with make
	isDone := make(map[string]bool)
	wd, _ := os.Getwd()

	for _, v := range getEnvList() {
		fullPath := strings.Join([]string{wd, "/", v}, "")

		ok := hasNamedEnvFiles(fullPath)

		if ok {
			_data, _rErr := os.ReadFile(fullPath)
			nilChecker(_rErr)
			data := string(_data)

			hasOwllyTrigger := strings.Contains(data, config.Owlly.TriggerName)
			isDone[v] = hasOwllyTrigger
		}
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
	date := now[0:16]

	dirPath, dirErr := os.Getwd()
	nilChecker(dirErr)

	return date, dirPath // yyyy-mm-dd hh-mm
}

func notifyEnvChange(envString string, envFileName string) {
	date, dirPath := getUpdateMetadata()

	pathMsg := fmt.Sprintf("directory is: %v", dirPath)
	footer := fmt.Sprintf("%v at: %v", envFileName, pathMsg)

	// @dev assert a parsed env value is thread-safe
	attachedEnv := slack.AttachmentField{
		Title: "🔐🔐🔐🔐🔐🔐🔐🔐🔐🔐🔐🔐",
		Value: envString,
		Short: false,
	}

	postBy := fmt.Sprintf("%v updated %v", config.Owlly.SlackUserName, envFileName)

	attachment := slack.Attachment{
		Title:    postBy,
		Fields:   []slack.AttachmentField{attachedEnv},
		Footer:   footer,
		AuthorID: config.Owlly.SlackUserID,
	}

	postTo := config.Owlly.SlackChannelID
	postWhat := slack.MsgOptionAttachments(attachment)

	channelID, _, msgErr := api.PostMessage(
		postTo,
		postWhat,
	)

	nilChecker(msgErr)

	resultMessage := fmt.Sprintf("message posted to channel %v at %v", channelID, date)
	color.Green(resultMessage)
}

func InitEnvBot_() bool {
	wd, _ := os.Getwd()
	root = filepath.Dir(wd)

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
			case event, _ := <-watcher.Events:
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
	color.Blue("WORK DONE! 👋")

	return true
}
