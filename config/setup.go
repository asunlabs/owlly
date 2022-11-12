package config

import (
	"log"
	"os"
	"strings"

	"github.com/BurntSushi/toml"
)

var (
	Owlly *OwllyConfig
)

type OwllyConfig struct {
	TriggerName        string
	SlackBotOauthToken string
	SlackChannelID     string
	SlackUserID        string
	SlackUserName      string
}

func New() {
	var _Owlly OwllyConfig

	path, _ := os.Getwd()
	fileName := "owlly.toml"
	fullPath := strings.Join([]string{path, "/", fileName}, "")

	_, fErr := os.Stat(fullPath)

	if fErr != nil {
		log.Fatal(fErr.Error())
	}

	_, dErr := toml.DecodeFile(fullPath, &_Owlly)

	if dErr != nil {
		log.Fatal(fErr.Error())
	}

	Owlly = &_Owlly
}
