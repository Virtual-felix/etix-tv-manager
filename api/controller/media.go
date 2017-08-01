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
