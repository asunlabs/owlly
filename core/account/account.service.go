package account

// ==================================================================== //
// =========================== Bcrypt service  =========================== //
// ==================================================================== //


// ==================================================================== //
// =========================== JWT service  =========================== //
// ==================================================================== //
// func generateJWT() (string, error)  {
// 	token := jwt.New(&jwt.SigningMethodECDSA{})
// }

// func modifiyJWT(token *jwt.Token) {
// 	claims := token.Claims.(jwt.MapClaims)
// claims["exp"] = time.Now().Add(10 * time.Minute)
// claims["authorized"] = true
// claims["user"] = "username"
// }

// func signTokenWithSecret(token *jwt.Token) (string, error) {
// 	secrets := "jake"
// 	tokenString, err := token.SignedString(secrets)

// 	if err != nil {
// 		return "", err
// 	 }
	
// 	 return tokenString, nil
// }

// func verifyTokenWithExpiration()  {
// 	// token validation logics
// }