package controller

import (
	"net/http"

	"github.com/labstack/echo"

	"etix-tv-manager/api/service"
)

// HelloWorld handler for GET on / route.
func HelloWorld(c echo.Context) error {
	return c.String(http.StatusOK, service.SecretMessage())
}
