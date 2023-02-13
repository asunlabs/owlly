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

		// @dev return value after type casting
		if _email, ok := optionalData[0].(string); ok {
			newEmailUser.Email = _email
		}

		if _password, ok := optionalData[1].(string); ok {
			newEmailUser.Password = _password
		}

		CreateEmailUser(newEmailUser)
	})
}

func HandleWalletSignUp(ctx context.Context) {
	runtime.EventsOn(ctx, config.AUTH_WALLET["sign-up"], func(optionalData ...interface{}) {
		var newWalletUser config.ModelWalletUser

		if _privateKey, ok := optionalData[0].(string); ok {
			newWalletUser.PrivateKey = _privateKey
		}

		if _alchemyKey, ok := optionalData[1].(string); ok {
			newWalletUser.AlchemyKey = _alchemyKey
		}

		CreateWalletUser(newWalletUser)
	})
}
