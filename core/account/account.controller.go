package account

import (
	"context"
	"github.com/asunlabs/owlly/config"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

var (
	NewEmailUser *config.ModelEmailUser
)

// @dev optional data returns as a string array
func ListenEmailSignUp(ctx context.Context) {
	var _newEmailUser config.ModelEmailUser

	runtime.EventsOn(ctx, config.AUTH_EMAIL["sign-up"], func(optionalData ...interface{}) {
		// @dev return value after type casting
		if _email, ok := optionalData[0].(string); ok {
			_newEmailUser.Email = _email
		}

		if _password, ok := optionalData[1].(string); ok {
			_newEmailUser.Password = _password
		}
	})

	NewEmailUser = &_newEmailUser
}

// TODO fix callback return
func ListenWalletSignUp(ctx context.Context) {
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
