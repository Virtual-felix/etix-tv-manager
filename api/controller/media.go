package controller

import (
	"net/http"

	"github.com/labstack/echo"

	"etix-tv-manager/api/service/s3"
)

// ListMedia handler for GET on /media/list/:folder route.
func ListMedia(c echo.Context) error {
	folder := c.Param("folder")

	mediaList, err := s3.ListObjects(folder)
	if err != nil {
		return c.NoContent(http.StatusBadRequest)
	}
	return c.JSON(http.StatusOK, mediaList)
}

// RemoveMedia handler for REMOVE on /media route.
func RemoveMedia(c echo.Context) error {
	name := c.FormValue("name")

	err := s3.Remove(name)
	if err != nil {
		return c.NoContent(http.StatusBadRequest)
	}
	return c.NoContent(http.StatusOK)
}

// RenameMedia handler for PUT on /media/rename route.
func RenameMedia(c echo.Context) error {
	name := c.FormValue("name")
	newName := c.FormValue("newname")

	err := s3.Rename(name, newName)
	if err != nil {
		return c.NoContent(http.StatusBadRequest)
	}
	return c.NoContent(http.StatusOK)
}
