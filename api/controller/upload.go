package controller

import (
	"log"
	"net/http"

	"github.com/labstack/echo"

	"etix-tv-manager/api/service/s3"
)

// Upload handler for POST on /upload route.
func Upload(c echo.Context) error {
	name := c.FormValue("name")

	// Source
	file, err := c.FormFile("file")
	if err != nil {
		return err
	}
	src, err := file.Open()
	if err != nil {
		log.Println("Coucou2")
		return err
	}
	//defer src.Close()
	if errr := s3.Upload(name, src); errr != nil {
		return c.NoContent(http.StatusBadRequest)
	}
	return c.NoContent(http.StatusOK)
}
