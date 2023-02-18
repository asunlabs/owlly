package account

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type MockUser struct {
	gorm.Model
	Email string
	Password string
	Username string 
	HashedPassword string
}

func TestPasswordValidation(t *testing.T) {
	if testing.Short() {
		t.Skip()
	}

	user := MockUser {
		Email: "user@gmail.com",
		Password: "test",
		Username: "user",
		HashedPassword: "",
	}

	hash, gErr := bcrypt.GenerateFromPassword([]byte(user.Password), 0)

	if gErr != nil {
		t.Fail()
		t.Log("bcrypt hash failure")
	}

	user.HashedPassword = string(hash)
	t.Log("hashed password: ", user.HashedPassword)

	passwordFromDB := []byte(user.HashedPassword)
	correctPassword := []byte("test")

	cErr := bcrypt.CompareHashAndPassword(passwordFromDB, correctPassword)

	if cErr != nil {
		t.Fail()
		t.Log("Invalid password")
	}

	invalidPassword := []byte("test1")

	cErrForInvalidPassword := bcrypt.CompareHashAndPassword(passwordFromDB, invalidPassword)
	
	if cErrForInvalidPassword != nil {
		t.Log("Invalid password checked by bcrypt")

		expected := "crypto/bcrypt: hashedPassword is not the hash of the given password"
		actual := cErrForInvalidPassword.Error()

		assert.Equal(t, expected, actual)
	}
}

func TestHashingByInput(t *testing.T) {
	target := MockUser { 
		Email: "hash@gmail.com",
		Password: "hash",
		// default cost is 10
		HashedPassword: "",
	}

	hash, _ := bcrypt.GenerateFromPassword([]byte(target.Password), bcrypt.DefaultCost)
	target.HashedPassword = string(hash)

	t.Run("Check double quote escape character", func(t *testing.T) {
		input := "\"hash\""
		err := bcrypt.CompareHashAndPassword([]byte(target.HashedPassword), []byte(input))

		if err != nil {
			expected := "crypto/bcrypt: hashedPassword is not the hash of the given password"
			actual := err.Error()
			assert.Equal(t, expected, actual)
		}
	})

	t.Run("Check Windows CRLF", func(t *testing.T) {
		input := "hash\r\n"
		err := bcrypt.CompareHashAndPassword([]byte(target.HashedPassword), []byte(input))

		if err != nil {
			expected := "crypto/bcrypt: hashedPassword is not the hash of the given password"
			actual := err.Error()
			assert.Equal(t, expected, actual)
		}
	})

	t.Run("Check Unix LF", func(t *testing.T) {
		input := "hash\n"
		err := bcrypt.CompareHashAndPassword([]byte(target.HashedPassword), []byte(input))

		if err != nil {
			expected := "crypto/bcrypt: hashedPassword is not the hash of the given password"
			actual := err.Error()
			assert.Equal(t, expected, actual)
		}
	})
}

func TestFetchRecordByEmailQuery(t *testing.T) {
	if testing.Short() {
		t.Skip()
	}

	db, oErr := gorm.Open(sqlite.Open("owlly.test.db"), &gorm.Config{})
	if oErr != nil {
		t.Fatalf("Sqlite3 open failure")
	}
	
	mErr := db.AutoMigrate(&MockUser{})
	if mErr != nil {
		t.Fatalf("Table migration failure")
	}

	t.Run("SQL Create should success", func(t *testing.T) {
		if testing.Short() {
			t.Skip()
		}

		cResult := db.Create(&MockUser{
			Email:    "mock1@gmail.com",
			Password: "2",
			Username: "mock test",
		})
	
		if cResult.Error != nil {
			t.FailNow()
		}
	})

	t.Run("SQL Read should success", func(t *testing.T) {
		var emailUser MockUser
		emailInput := "mock1@gmail.com"
		passwordInput := "2"
	
		rResult := db.Limit(1).Find(&emailUser, "email = ?", emailInput)
		
		if rResult.Error != nil {
			t.Fail()
			t.Log("Gorm Find query failure")
		}

		assert.EqualValues(t, emailInput, emailUser.Email)
		assert.EqualValues(t, passwordInput, emailUser.Password)
	})
} 