package config

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// ==================================================================== //  
// ====================== Event-based CRUD DB OP ====================== //  
// ==================================================================== // 

func __ConnectDB() (bool, string) {
	_db, oErr := gorm.Open(sqlite.Open("owlly.db"), &gorm.Config{})

	if oErr != nil {
		return false, oErr.Error()
	}

	_db.AutoMigrate(&OwllyConfig{}, &User{})
	DB_HANDLE = _db

	return true, ""
}
