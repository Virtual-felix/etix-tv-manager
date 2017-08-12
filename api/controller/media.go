package controller

import (
	"log"
	"net/http"

	"github.com/labstack/echo"

	"etix-tv-manager/api/service"
)

// Medias controller.
type Medias struct {
	s3 *service.S3
}

// NewMedias creates a new controller for medias.
func NewMedias(s3 *service.S3) *Medias {
	mc := &Medias{
		s3: s3,
	}
	return mc
}

// List handler for GET on /media/list/:folder route.
func (c *Medias) List(ctx echo.Context) error {
	folder := ctx.Param("folder")

	mediaList, err := c.s3.ListObjects(folder)
	if err != nil {
		log.Println(err)
		return ctx.String(http.StatusBadRequest, err.Error())
	}
	return ctx.JSON(http.StatusOK, mediaList)
}

// Remove handler for REMOVE on /media route.
func (c *Medias) Remove(ctx echo.Context) error {
	name := ctx.FormValue("name")

	err := c.s3.Remove(name)
	if err != nil {
		log.Println(err)
		return ctx.String(http.StatusBadRequest, err.Error())
	}
	return ctx.NoContent(http.StatusOK)
}

// Rename handler for PUT on /media/rename route.
func (c *Medias) Rename(ctx echo.Context) error {
	name := ctx.FormValue("name")
	newName := ctx.FormValue("newname")

	err := c.s3.Rename(name, newName)
	if err != nil {
		log.Println(err)
		return ctx.String(http.StatusBadRequest, err.Error())
	}
	return ctx.NoContent(http.StatusOK)
}

// Upload handler for POST on /upload route.
func (c *Medias) Upload(ctx echo.Context) error {
	name := ctx.FormValue("name")

	// Source
	file, err := ctx.FormFile("file")
	if err != nil {
		log.Println(err)
		return ctx.String(http.StatusBadRequest, err.Error())
	}
	src, err := file.Open()
	if err != nil {
		log.Println(err)
		return ctx.String(http.StatusBadRequest, err.Error())
	}
	defer src.Close()
	if errr := c.s3.Upload(name, src); errr != nil {
		log.Println(err)
		return ctx.String(http.StatusBadRequest, err.Error())
	}
	return ctx.NoContent(http.StatusOK)
}
