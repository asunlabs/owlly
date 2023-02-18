package account

import (
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/asunlabs/owlly/config"
	"github.com/fatih/color"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

// ==================================================================== //
// ========================= Email user API  ========================== //
// ==================================================================== //
func CreateEmailUser(email string, password string) config.OWLLY_RESPONSE {
	// ! sync should be called
	defer config.Logger.Sync()

	hashedPassword := HashCredential(password)

	cResult := config.DB_HANDLE.Create(&config.ModelEmailUser{
		Email:    email,
		Password: string(hashedPassword),
	})

	if cResult.Error != nil {
		color.Red("account.service.go: CreateEmailUser failed")
		config.Logger.Error("CreateEmailUser: gorm Create failed")

		_error := config.OWLLY_RESPONSE{
			Code:    config.ERROR_CODE["DB_OP_FAILURE"],
			Message: "CreateEmailUser failure",
		}

		return _error
	}

	color.Green("account.service.go: CreateEmailUser success")
	config.Logger.Info("CreateEmailUser: new email user created")

	_success := config.OWLLY_RESPONSE{
		Code:    config.SUCCESS_CODE["OK"],
		Message: "CreateEmailUser success",
	}

	return _success
}

func ReadEmailUser(email string, password string) config.OWLLY_RESPONSE {
	defer config.Logger.Sync()
	
	var emailUser config.ModelEmailUser
	rResult := config.DB_HANDLE.Limit(1).Find(&emailUser, "email = ?", email).Scan(&emailUser)

	if rResult.Error != nil {
		color.Red("account.service.go: ReadEmailUser failed")
		config.Logger.Error("ReadEmailUser: gorm First failed")

		_error := config.OWLLY_RESPONSE{
			Code:    config.ERROR_CODE["DB_OP_FAILURE"],
			Message: "ReadEmailUser failure",
		}

		return _error
	}

	// @dev password validation
	if ok := ValidatePassword(email, password); !ok {
		_invalidPasswordError := config.OWLLY_RESPONSE{
			Code:    config.ERROR_CODE["INVALID_AUTH"],
			Message: "ReadEmailUser failure",
		}

		color.Red("account.service.go: ReadEmailUser failed")
		config.Logger.Error("ReadEmailUser: incorrect password")

		return _invalidPasswordError
	}

	response := config.OWLLY_RESPONSE{
		Code:    config.SUCCESS_CODE["OK"],
		Message: "ReadEmailUser success",
		Data:    emailUser.Email,
	}

	color.Green("account.service.go: ReadEmailUser success")
	config.Logger.Info("ReadEmailUser: record fetched")

	return response
}

func FetchEmailUser(email string) config.OWLLY_RESPONSE {
	var user config.ModelEmailUser
	rErr := config.DB_HANDLE.Where("email = ?", email).Find(&user)

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
	rResult := config.DB_HANDLE.Where("email = ?", email).Find(&emailUser)

	if rResult.Error != nil {
		color.Red("account.service.go: UpdateEmailUserPassword failed")
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

	color.Green("account.service.go: UpdateEmailUserPassword success")
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
		color.Red("account.service.go: DeleteEmailUser failed")
		config.Logger.Error("DeleteEmailUser: gorm First failed")

		_error := config.OWLLY_RESPONSE{
			Code:    config.ERROR_CODE["DB_OP_FAILURE"],
			Message: "DeleteEmailUser failure",
		}

		return _error
	}

	dResult := config.DB_HANDLE.Where("email = ?", email).Delete(&emailUser)

	if dResult.Error != nil {
		color.Red("account.service.go: DeleteEmailUser failed")
		config.Logger.Error("DeleteEmailUser: gorm Delete failed")

		_error := config.OWLLY_RESPONSE{
			Code:    config.ERROR_CODE["DB_OP_FAILURE"],
			Message: "DeleteEmailUser failure",
		}

		return _error
	}

	color.Green("account.service.go: DeleteEmailUser success")
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
		color.Red("account.service.go: CreateWalletUser failed to execute")
	} else {
		color.Green(("account.service.go:DONE: new wallet user created"))
	}
}

func ReadWalletUserById(id uint) {
	rResult := config.DB_HANDLE.Where("id = ?", id).First(&config.ModelWalletUser{})

	if rResult.Error != nil {
		color.Red("account.service.go: ReadWalletUserById failed to execute")
	} else {
		color.Green(("account.service.go:DONE: wallet user record fetched"))
	}
}

func UpdateWalletUser(user config.ModelWalletUser) {
	uResult := config.DB_HANDLE.Where("id = ?", user.ID).Updates(&user)

	if uResult.Error != nil {
		color.Red("account.service.go: UpdateWalletUserById failed to execute")
	} else {
		message := fmt.Sprintf("account.service.go:DONE: wallet user with id %v is updated", user.ID)
		color.Green(message)
	}
}

func DeleteWalletUserById(id uint) {
	dResult := config.DB_HANDLE.Where("id = ?", id).First(&config.ModelWalletUser{})

	if dResult.Error != nil {
		color.Red("account.service.go: DeleteWalletUserById failed to execute")
	} else {
		message := fmt.Sprintf("account.service.go:DONE: wallet user with id %v is delete", id)
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

func ValidatePassword(email string, password string) bool {
	defer config.Logger.Sync() 
	
	var checkValue config.ModelEmailUser 
	rResult := config.DB_HANDLE.Limit(1).Find(&checkValue, "email = ?", email).Scan(&checkValue)

	if rResult.Error != nil {
		color.Red("account.service.go: Unable to scan record with the email")
		config.Logger.Error("ValidatePassword: gorm find failed")
		return false
	}

	hashedPasswordFromDB := checkValue.Password
	
	// @dev bcrypt compares a hashed password saved in database and user input password.
	cErr := bcrypt.CompareHashAndPassword([]byte(hashedPasswordFromDB),[]byte(password))

	return cErr == nil
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
