package controller

import (
	"log"
	"net/http"

	"github.com/labstack/echo"

	"etix-tv-manager/api/service"
)

// Television controller.
type Television struct {
	ts *service.Television
}

// NewTelevision creates a new controller for televisions.
func NewTelevision(ts *service.Television) *Television {
	tc := &Television{
		ts: ts,
	}
	return tc
}

// List list all televisions.
func (tc *Television) List(ctx echo.Context) error {
	televisions, err := tc.ts.List()
	if err != nil {
		log.Println(err)
		return ctx.String(http.StatusBadRequest, err.Error())
	}
	return ctx.JSON(http.StatusOK, televisions)
}

// Create creates a new television.
func (tc *Television) Create(ctx echo.Context) error {
	name := ctx.FormValue("name")
	ip := ctx.FormValue("ip")

	err := tc.ts.Create(name, ip, uint(0))
	if err != nil {
		log.Println(err)
		return ctx.String(http.StatusBadRequest, err.Error())
	}
	return ctx.NoContent(http.StatusOK)
}

// Update update a television.
func (tc *Television) Update(ctx echo.Context) error {
	name := ctx.FormValue("name")
	ip := ctx.FormValue("ip")
	ID, errID := paramToIntHelper(ctx.Param("id"))
	if errID != nil {
		log.Println(errID)
		return ctx.String(http.StatusBadRequest, errID.Error())
	}
	gID, errgID := paramToIntHelper(ctx.FormValue("gid"))
	if errgID != nil {
		log.Println(errgID)
		return ctx.String(http.StatusBadRequest, errgID.Error())
	}

	err := tc.ts.Update(uint(ID), uint(gID), name, ip)
	if err != nil {
		log.Println(err)
		return ctx.String(http.StatusBadRequest, err.Error())
	}
	return ctx.NoContent(http.StatusOK)
}

// Delete remove a television.
func (tc *Television) Delete(ctx echo.Context) error {
	ID, errID := paramToIntHelper(ctx.Param("id"))
	if errID != nil {
		log.Println(errID)
		return ctx.String(http.StatusBadRequest, errID.Error())
	}
	tc.ts.Delete(uint(ID))
	return ctx.NoContent(http.StatusOK)
}

// CreateGroup create a group for televisions.
func (tc *Television) CreateGroup(ctx echo.Context) error {
	name := ctx.FormValue("name")

	err := tc.ts.CreateGroup(name)
	if err != nil {
		log.Println(err)
		return ctx.String(http.StatusBadRequest, err.Error())
	}
	return ctx.NoContent(http.StatusOK)
}

// ListGroup lst all groups of television.
func (tc *Television) ListGroup(ctx echo.Context) error {
	group, err := tc.ts.ListGroup()
	if err != nil {
		log.Println(err)
		return ctx.String(http.StatusBadRequest, err.Error())
	}
	return ctx.JSON(http.StatusOK, group)
}
