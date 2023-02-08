package account

import (
	"errors"
	"fmt"

	"time"

	"github.com/asunlabs/owlly/config"
	"github.com/fatih/color"
	"github.com/gofrs/uuid"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

// ==================================================================== //
// ========================= Email user API  ========================== //
// ==================================================================== //
func CreateEmailUser(emailUser config.ModelEmailUser) config.OWLLY_RESPONSE {
	// ! sync should be called
	defer config.Logger.Sync()

	hashedPassword := HashCredential(emailUser.Password)
	label, err := uuid.NewV4()

	if err != nil {
		config.Logger.Error("account.controller.go: UUID failed")

		return config.OWLLY_RESPONSE{
			Code:    config.ERROR_CODE["UUID_GEN_FAILURE"],
			Message: "UUID failure",
		}
	}

	_username := ""

	if emailUser.Username == "" {
		_username = string(label.Bytes())
	} else {
		_username = emailUser.Username
	}

	cResult := config.DB_HANDLE.Create(&config.ModelEmailUser{
		Email:    emailUser.Email,
		Password: string(hashedPassword),
		Username: _username,
	})

	if cResult.Error != nil {
		config.Logger.Error("account.controller.go: CreateEmailUser failed")

		_error := config.OWLLY_RESPONSE{
			Code:    config.ERROR_CODE["DB_OB_FAILURE"],
			Message: "CreateEmailUser failure",
		}

		return _error
	}

	config.Logger.Info("account.controller.go: new email user created")

	_success := config.OWLLY_RESPONSE{
		Code:    config.SUCCESS_CODE["OK"],
		Message: "CreateEmailUser success",
	}

	return _success
}

// TODO change terminal logging to logger service
func ReadEmailUser(email string) string {
	var emailUser config.ModelEmailUser
	rResult := config.DB_HANDLE.Where("email = ?", email).First(&emailUser)

	if rResult.Error != nil {
		color.Red("account.controller.go: UpdateEmailUser failed to execute")
	}

	color.Green("account.controller.go:DONE: email user record fetched")

	if emailUser.Username != "" {
		return emailUser.Username
	}

	return emailUser.Email
}

// update password
// TODO add password hashing mechanism with https://github.com/golang/crypto/tree/master/bcrypt
func UpdateEmailUserById(id uint, newPassword string) {
	rResult := config.DB_HANDLE.Where("id = ?", id).First(&config.ModelEmailUser{})

	if rResult.Error != nil {
		color.Red("account.controller.go: UpdateEmailUser failed to execute")
	} else {
		// only update a record with the specified id
		config.DB_HANDLE.Model(&config.ModelEmailUser{}).Where("id = ?", id).Update("Password", newPassword)
		message := fmt.Sprintf("account.controller.go:DONE: email user with id %v is updated", id)
		color.Green(message)
	}
}

func DeleteEmailUserById(id uint) {
	rResult := config.DB_HANDLE.Where("id = ?", id).First(&config.ModelEmailUser{})

	if rResult.Error != nil {
		color.Red("account.controller.go: DeleteEmailUser failed to execute")
	} else {
		config.DB_HANDLE.Where("id = ?", id).Delete(&config.ModelEmailUser{})
	}
}

// ==================================================================== //
// ====================== Wallet user API  ======================== //
// ==================================================================== //
func CreateWalletUser(user config.ModelWalletUser) {
	hashedApiKey := HashCredential(user.AlchemyKey)
	hashedPrivateKey := HashCredential(user.PrivateKey)

	cResult := config.DB_HANDLE.Create(&config.ModelWalletUser{
		AlchemyKey: string(hashedApiKey),
		PrivateKey: string(hashedPrivateKey),
	})

	if cResult.Error != nil {
		color.Red("account.controller.go: CreateWalletUser failed to execute")
	} else {
		color.Green(("account.controller.go:DONE: new wallet user created"))
	}
}

func ReadWalletUserById(id uint) {
	rResult := config.DB_HANDLE.Where("id = ?", id).First(&config.ModelWalletUser{})

	if rResult.Error != nil {
		color.Red("account.controller.go: ReadWalletUserById failed to execute")
	} else {
		color.Green(("account.controller.go:DONE: wallet user record fetched"))
	}
}

func UpdateWalletUser(user config.ModelWalletUser) {
	uResult := config.DB_HANDLE.Where("id = ?", user.ID).Updates(&user)

	if uResult.Error != nil {
		color.Red("account.controller.go: UpdateWalletUserById failed to execute")
	} else {
		message := fmt.Sprintf("account.controller.go:DONE: wallet user with id %v is updated", user.ID)
		color.Green(message)
	}
}

func DeleteWalletUserById(id uint) {
	dResult := config.DB_HANDLE.Where("id = ?", id).First(&config.ModelWalletUser{})

	if dResult.Error != nil {
		color.Red("account.controller.go: DeleteWalletUserById failed to execute")
	} else {
		message := fmt.Sprintf("account.controller.go:DONE: wallet user with id %v is delete", id)
		color.Green(message)
	}
}

// ==================================================================== //
// =========================== Bcrypt service  ======================== //
// ==================================================================== //
func HashCredential(password string) []byte {
	// key := []byte(os.Getenv("secret"))

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	if err != nil {
		color.Red("account.service.go: Unable to hash with secret")
	}

	return hashedPassword
}

func ValidatePassword(password string) bool {
	hashedPassword := HashCredential(password)
	cErr := bcrypt.CompareHashAndPassword(hashedPassword, []byte(password))

	if cErr != nil {
		color.Red("account.service.go: Invalid password")
		return false
	}

	return true
}

// ==================================================================== //
// =========================== JWT service  =========================== //
// ==================================================================== //
func CreateToken() *jwt.Token {
	token := jwt.New(&jwt.SigningMethodECDSA{})

	return token
}

func UpdateToken(token *jwt.Token) {
	claims := token.Claims.(jwt.MapClaims)

	claims["expire"] = time.Now().Add(10 * time.Minute)
	claims["authorized"] = true
	claims["user"] = "username"
}

func SignTokenWithSecret(token *jwt.Token) (string, error) {
	secrets := "temp"
	tokenString, err := token.SignedString(secrets)

	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func VerifyToken(tokenString string) {
	jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		_, ok := t.Method.(*jwt.SigningMethodECDSA)

		err := errors.New("Unauthorized")

		// signature fails
		if !ok {
			return "account.service.go: Unauthorized", err
		}

		return "", nil
	})
}
