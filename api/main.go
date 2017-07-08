package main

import (
	"github.com/labstack/echo"

	"etix-tv-manager/api/controller"
)

func main() {
	e := echo.New()
	e.GET("/", controller.HelloWorld)
	e.Logger.Fatal(e.Start(":" + PORT))
}
