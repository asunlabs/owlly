package config

import (
	"log"
	"os"
	"path/filepath"
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
	wd, _ := os.Getwd()
	root := filepath.Dir(wd)
	
	fileName := "owlly.toml"
	fullPath := strings.Join([]string{root, "/", fileName}, "")

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
