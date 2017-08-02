package main

import (
	"log"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"

	"etix-tv-manager/api/controller"
	"etix-tv-manager/api/service/s3"
)

func main() {
	e := echo.New()

	// Services initialization
	if err := s3.Init("172.19.0.1:9001", "HS4SFCA35UZHNW3YBHOT", "k9gkHCeMqGB83TKgqIOn38KXmgfpaNEBgQTucXHH", false); err != nil {
		log.Println("Error during s3 initialization: ", err)
	}

	// API configuration
	e.Use(middleware.CORS())

	// Routes descriptions
	e.GET("/", controller.HelloWorld)
	e.POST("/upload", controller.UploadImage)
	e.GET("/media/list/", controller.ListMedia)
	e.GET("/media/list/:folder", controller.ListMedia)
	e.PUT("/media", controller.RemoveMedia)

	// Run
	e.Logger.Fatal(e.Start(":" + PORT))
}
