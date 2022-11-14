package config

import (
	"encoding/json"
	"log"
	"os"
	"path/filepath"
	"strings"
)

var (
	Owlly *OwllyConfig
)

type OwllyConfig struct {
	TriggerName        string	`json:"triggerName"`
	SlackBotOauthToken string	`json:"slackBotOauthToken"`
	SlackChannelID     string	`json:"slackChannelID"`
	SlackUserID        string	`json:"slackUserID"`
	SlackUserName      string	`json:"slackUserName"`
}

func New() {
	var _Owlly OwllyConfig
	wd, _ := os.Getwd()
	root := filepath.Dir(wd)
	
	fileName := "owlly.json"
	fullPath := strings.Join([]string{root, "/", fileName}, "")

	data, oErr := os.ReadFile(fullPath)
	
	if oErr != nil {
		log.Fatal(oErr.Error())
	}

	unMarshalErr := json.Unmarshal(data, &_Owlly)

	if unMarshalErr != nil {
		log.Fatal(unMarshalErr.Error())
	}

	Owlly = &_Owlly
}
