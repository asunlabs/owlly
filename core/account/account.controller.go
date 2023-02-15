package account

import (
	"context"
	"github.com/asunlabs/owlly/config"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

var (
	NewEmailUser  *config.ModelEmailUser
	NewWalletUser *config.ModelWalletUser
)

func InitAccountModuleListener(ctx context.Context) {
	ListenEmailSignUp(ctx)
	ListenWalletSignUp(ctx)
}

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

func ListenWalletSignUp(ctx context.Context) {
	var _newWalletUser config.ModelWalletUser
	runtime.EventsOn(ctx, config.AUTH_WALLET["sign-up"], func(optionalData ...interface{}) {

		if _privateKey, ok := optionalData[0].(string); ok {
			_newWalletUser.PrivateKey = _privateKey
		}

		if _alchemyKey, ok := optionalData[1].(string); ok {
			_newWalletUser.AlchemyKey = _alchemyKey
		}
	})

	NewWalletUser = &_newWalletUser
}
