package config

type Keycode uint;

// custom enum type for channel keycode
const (
	Team Keycode = iota +1 
	Developer
	Designer 
	Welfare 
)