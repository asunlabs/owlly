package account

import (
	"context"
	"github.com/asunlabs/owlly/config"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// @dev optional data returns as a string array
func HandleEmailSignUp(ctx context.Context) {
	runtime.EventsOn(ctx, config.AUTH_EVENT["sign-up"], func(optionalData ...interface{}) {
		var newEmailUser config.ModelEmailUser
		newEmailUser.Email = optionalData[0].(string)
		newEmailUser.Password = optionalData[1].(string)

		CreateEmailUser(newEmailUser)
	})
}
