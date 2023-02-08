package account

import (
	"testing"

	"github.com/asunlabs/owlly/config"
)

// TODO add db mocking
func TestEmailUser(t *testing.T) {
	// set hardcoded value
	newUser := config.ModelEmailUser{
		Username: "test",
		Email:    "test@gmail.com",
		Password: "123",
	}

	// call target method
	CreateEmailUser(newUser)
}
