package account

import (
	"context"
	"github.com/asunlabs/owlly/config"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// @dev optional data returns as a string array
func HandleEmailSignUp(ctx context.Context) {
	runtime.EventsOn(ctx, config.AUTH_EMAIL["sign-up"], func(optionalData ...interface{}) {
		var newEmailUser config.ModelEmailUser
		newEmailUser.Email = optionalData[0].(string)
		newEmailUser.Password = optionalData[1].(string)
		// newEmailUser.Username = optionalData[2].(string)

		CreateEmailUser(newEmailUser)
	})
}

func HandleWalletSignUp(ctx context.Context) {
	runtime.EventsOn(ctx, config.AUTH_WALLET["sign-up"], func(optionalData ...interface{}) {
		var newWalletUser config.ModelWalletUser
		newWalletUser.PrivateKey = optionalData[0].(string)
		newWalletUser.AlchemyKey = optionalData[1].(string)

		CreateWalletUser(newWalletUser)
	})
}
