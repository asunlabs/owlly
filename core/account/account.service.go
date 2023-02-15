package account

import (
	"encoding/json"
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
func CreateEmailUser() config.OWLLY_RESPONSE {
	// ! sync should be called
	defer config.Logger.Sync()

	hashedPassword := HashCredential(NewEmailUser.Password)
	label, err := uuid.NewV4()

	if err != nil {
		color.Red("account.controller.go: CreateEmailUser failed")
		config.Logger.Error("CreateEmailUser: UUID failed")

		_error := config.OWLLY_RESPONSE{
			Code:    config.ERROR_CODE["UUID_GEN_FAILURE"],
			Message: "UUID failure",
		}
		return _error
	}

	_username := ""

	if NewEmailUser.Username == "" {
		_username = string(label.Bytes())
	} else {
		_username = NewEmailUser.Username
	}

	cResult := config.DB_HANDLE.Create(&config.ModelEmailUser{
		Email:    NewEmailUser.Email,
		Password: string(hashedPassword),
		Username: _username,
	})

	if cResult.Error != nil {
		color.Red("account.controller.go: CreateEmailUser failed")
		config.Logger.Error("CreateEmailUser: gorm Create failed")

		_error := config.OWLLY_RESPONSE{
			Code:    config.ERROR_CODE["DB_OP_FAILURE"],
			Message: "CreateEmailUser failure",
		}

		return _error
	}

	color.Green("account.controller.go: CreateEmailUser success")
	config.Logger.Info("CreateEmailUser: new email user created")

	_success := config.OWLLY_RESPONSE{
		Code:    config.SUCCESS_CODE["OK"],
		Message: "CreateEmailUser success",
	}

	return _success
}

// @dev email user sign-in
func ReadEmailUser(email string, password string) config.OWLLY_RESPONSE {
	defer config.Logger.Sync()

	// @dev DB read
	var emailUser config.ModelEmailUser
	rResult := config.DB_HANDLE.Where("email = ?", email).First(&emailUser)

	if rResult.Error != nil {
		color.Red("account.controller.go: ReadEmailUser failed")
		config.Logger.Error("ReadEmailUser: gorm First failed")

		_error := config.OWLLY_RESPONSE{
			Code:    config.ERROR_CODE["DB_OP_FAILURE"],
			Message: "ReadEmailUser failure",
		}

		return _error
	}

	// @dev password validation
	if ok := ValidatePassword(password); !ok {
		_invalidPasswordError := config.OWLLY_RESPONSE{
			Code:    config.ERROR_CODE["INVALID_AUTH"],
			Message: "ReadEmailUser failure",
		}

		color.Red("account.controller.go: ReadEmailUser failed")
		config.Logger.Error("ReadEmailUser: incorrect password")

		return _invalidPasswordError
	}

	if emailUser.Username != "" {
		_resWithUsername := config.OWLLY_RESPONSE{
			Code:    config.SUCCESS_CODE["OK"],
			Message: "ReadEmailUser success",
			Data:    emailUser.Username,
		}
		return _resWithUsername
	}

	_resWithEmail := config.OWLLY_RESPONSE{
		Code:    config.SUCCESS_CODE["OK"],
		Message: "ReadEmailUser success",
		Data:    emailUser.Email,
	}

	color.Green("account.controller.go: ReadEmailUser success")
	config.Logger.Info("ReadEmailUser: record fetched")

	return _resWithEmail
}

func FetchEmailUser(email string) config.OWLLY_RESPONSE {
	var user config.ModelEmailUser

	rErr := config.DB_HANDLE.Where("email = ?", email).First(&user)

	if rErr.Error != nil {
		_error := config.OWLLY_RESPONSE{
			Code:    config.ERROR_CODE["DB_OP_FAILURE"],
			Message: "FetchEmailUser failure",
		}

		return _error
	}

	out, mErr := json.Marshal(user)

	if mErr != nil {
		_error := config.OWLLY_RESPONSE{
			Code:    config.ERROR_CODE["ENCODING_FAILURE"],
			Message: "FetchEmailUser failure",
		}
		return _error
	}

	_res := config.OWLLY_RESPONSE{
		Code:    config.SUCCESS_CODE["OK"],
		Message: "FetchEmailUser success",
		Data:    string(out),
	}

	return _res
}

func UpdateEmailUserPassword(email string, newPassword string) config.OWLLY_RESPONSE {
	defer config.Logger.Sync()

	var emailUser config.ModelEmailUser
	rResult := config.DB_HANDLE.Where("email = ?", email).First(&emailUser)

	if rResult.Error != nil {
		color.Red("account.controller.go: UpdateEmailUserPassword failed")
		config.Logger.Error("UpdateEmailUserPassword: gorm First failed")

		_error := config.OWLLY_RESPONSE{
			Code:    config.ERROR_CODE["DB_OP_FAILURE"],
			Message: "UpdateEmailUserPassword failure",
		}
		return _error
	}

	_password := HashCredential(newPassword)
	config.DB_HANDLE.Model(&emailUser).
		Where("email = ?", email).
		Update("Password", string(_password))

	color.Green("account.controller.go: UpdateEmailUserPassword success")
	config.Logger.Info("UpdateEmailUserPassword: record updated")

	_success := config.OWLLY_RESPONSE{
		Code:    config.SUCCESS_CODE["OK"],
		Message: "UpdateEmailUserPassword success",
	}

	return _success
}

func DeleteEmailUser(email string) config.OWLLY_RESPONSE {
	defer config.Logger.Sync()

	var emailUser config.ModelEmailUser
	rResult := config.DB_HANDLE.Where("email = ?", email).First(&emailUser)

	if rResult.Error != nil {
		color.Red("account.controller.go: DeleteEmailUser failed")
		config.Logger.Error("DeleteEmailUser: gorm First failed")

		_error := config.OWLLY_RESPONSE{
			Code:    config.ERROR_CODE["DB_OP_FAILURE"],
			Message: "DeleteEmailUser failure",
		}

		return _error
	}

	dResult := config.DB_HANDLE.Where("email = ?", email).Delete(&emailUser)

	if dResult.Error != nil {
		color.Red("account.controller.go: DeleteEmailUser failed")
		config.Logger.Error("DeleteEmailUser: gorm Delete failed")

		_error := config.OWLLY_RESPONSE{
			Code:    config.ERROR_CODE["DB_OP_FAILURE"],
			Message: "DeleteEmailUser failure",
		}

		return _error
	}

	color.Green("account.controller.go: DeleteEmailUser success")
	config.Logger.Info("DeleteEmailUser: record soft deleted")

	_success := config.OWLLY_RESPONSE{
		Code:    config.SUCCESS_CODE["OK"],
		Message: "DeleteEmailUser success",
	}

	return _success
}

// ==================================================================== //
// ====================== Wallet user API  ======================== //
// ==================================================================== //
// TODO add log, db error handling for wallet api
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
	defer config.Logger.Sync()
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	if err != nil {
		color.Red("account.service.go: Unable to hash with secret")
		config.Logger.Error("HashCredential: password comparison failed")
		return []byte{}
	}

	return hashedPassword
}

func ValidatePassword(password string) bool {
	hashedPassword := HashCredential(password)
	cErr := bcrypt.CompareHashAndPassword(hashedPassword, []byte(password))

	if cErr != nil {
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
