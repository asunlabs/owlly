package account

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"golang.org/x/crypto/bcrypt"
)

type MockUser struct { 
	Email string
	Password string
	Username string 
	HashedPassword string
}

func TestPasswordValidation(t *testing.T) {
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
