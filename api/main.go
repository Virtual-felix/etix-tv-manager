package main

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"

	"etix-tv-manager/api/controller"
)

func main() {
	e := echo.New()
	e.Use(middleware.CORS())
	e.GET("/", controller.HelloWorld)
	e.Logger.Fatal(e.Start(":" + PORT))
}
