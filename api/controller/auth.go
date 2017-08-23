package controller

import (
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"

	"etix-tv-manager/api/model"
	"etix-tv-manager/api/service"
)

// Auth controller.
type Auth struct {
	ls *service.Ldap
}

// NewAuth creates a new controller for authentification.
func NewAuth(ls *service.Ldap) *Auth {
	return &Auth{
		ls: ls,
	}
}

// Login connect the user to the app using LDAP.
func (ac *Auth) Login(c echo.Context) error {
	username := c.FormValue("username")
	password := c.FormValue("password")

	if err := ac.ls.CheckCredentials(username, password); err != nil {
		return echo.ErrUnauthorized
	}
	// Create token
	token := jwt.New(jwt.SigningMethodHS256)

	// Set claims
	claims := token.Claims.(jwt.MapClaims)
	claims["name"] = "Jon Snow"
	claims["admin"] = true
	claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

	// Generate encoded token and send it as response.
	t, err := token.SignedString([]byte("secret"))
	//NOTE: To rework.
	if err != nil {
		return err
	}

	auth := &model.Auth{
		Token: t,
	}

	return c.JSON(http.StatusOK, auth)
}
