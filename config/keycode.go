package config

type Keycode uint

// custom enum type for channel keycode
const (
	Team Keycode = iota + 1
	Developer
	Designer
	Welfare

	RESERVED   = "OWLLY_DONE"
	OWNER_PERM = 0644
)
