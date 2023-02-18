package account

import (
	"context"
	"github.com/asunlabs/owlly/config"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

var (
	WalletUser	  *config.ModelWalletUser
	NewWalletUser *config.ModelWalletUser
)

func InitAccountModuleListener(ctx context.Context) {
	ListenWalletSignIn(ctx)
	ListenWalletSignUp(ctx)
}

// TODO remove this part
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

func ListenWalletSignIn(ctx context.Context) {
	var _walletUser config.ModelWalletUser
	runtime.EventsOn(ctx, config.AUTH_WALLET["sign-in"], func(optionalData ...interface{}) {

		if _privateKey, ok := optionalData[0].(string); ok {
			_walletUser.PrivateKey = _privateKey
		}
	})

	NewWalletUser = &_walletUser
}
