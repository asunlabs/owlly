package bot

import (
	"context"
	"log"

	"github.com/asunlabs/owlly/config"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// TODO remove this part
func InitBotModuleListener(ctx context.Context) {
	ListenSlackUpdate(ctx)
}

func ListenSlackUpdate(ctx context.Context) {
	runtime.EventsOn(ctx, config.SLACK_EVENT["update"], func(optionalData ...interface{}) {
		_newConfig := make(map[int]string)

		var newConfig config.ModelEnvBot

		for k, v := range optionalData {
			switch _v := v.(type) {
			case string:
				_newConfig[k] = _v
			default:
				log.Fatal("app.go:EventListener: Invalid config data type")
			}
		}

		newConfig.TriggerName = _newConfig[0]
		newConfig.SlackBotOauthToken = _newConfig[1]
		newConfig.SlackChannelID = _newConfig[2]
		newConfig.SlackUserID = _newConfig[3]
		newConfig.SlackUserName = _newConfig[4]

		// Read config info from frontend and do DB operation
		config.New(
			newConfig.TriggerName,
			newConfig.SlackBotOauthToken,
			newConfig.SlackChannelID,
			newConfig.SlackUserID,
			newConfig.SlackUserName,
		)
	})
}
