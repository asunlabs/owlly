package account

import (
	"context"

	"github.com/asunlabs/owlly/config"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// TODO add sign in, sign up event
func ListenEmailSignUp(ctx context.Context)  {
	runtime.EventsOn(ctx, config.AUTH_EVENT["sign-up"], func(optionalData ...interface{}) {
		var newEmailUser config.ModelEmailUser
		CreateEmailUser(newEmailUser)
	})
}