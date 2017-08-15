package controller

import (
	"log"
	"net/http"
	"time"

	"github.com/labstack/echo"

	"etix-tv-manager/api/service"
)

// Planification controller.
type Planification struct {
	ts *service.Planification
}

// NewPlanification creates a new controller for planifications.
func NewPlanification(ts *service.Planification) *Planification {
	tc := &Planification{
		ts: ts,
	}
	return tc
}

// List list all planifications.
func (tc *Planification) List(ctx echo.Context) error {
	TVID, errID := paramToIntHelper(ctx.Param("id"))
	if errID != nil {
		log.Println(errID)
		return ctx.String(http.StatusBadRequest, errID.Error())
	}

	planifications, err := tc.ts.List(uint(TVID))
	if err != nil {
		log.Println(err)
		return ctx.String(http.StatusBadRequest, err.Error())
	}
	return ctx.JSON(http.StatusOK, planifications)
}

// Create creates a new planification.
func (tc *Planification) Create(ctx echo.Context) error {
	TVID, errID := paramToIntHelper(ctx.FormValue("tvid"))
	if errID != nil {
		log.Println(errID)
		return ctx.String(http.StatusBadRequest, errID.Error())
	}
	TiID, errTiID := paramToIntHelper(ctx.FormValue("tiid"))
	if errTiID != nil {
		log.Println(errTiID)
		return ctx.String(http.StatusBadRequest, errTiID.Error())
	}
	start, errStart := paramToIntHelper(ctx.FormValue("startat"))
	if errStart != nil {
		log.Println(errStart)
		return ctx.String(http.StatusBadRequest, errStart.Error())
	}
	end, errEnd := paramToIntHelper(ctx.FormValue("endat"))
	if errEnd != nil {
		log.Println(errEnd)
		return ctx.String(http.StatusBadRequest, errEnd.Error())
	}

	err := tc.ts.Create(uint(TVID), uint(TiID), time.Unix(start, 0), time.Unix(end, 0))
	if err != nil {
		log.Println(err)
		return ctx.String(http.StatusBadRequest, err.Error())
	}
	return ctx.NoContent(http.StatusOK)
}

// Update update a planification.
func (tc *Planification) Update(ctx echo.Context) error {
	ID, errID := paramToIntHelper(ctx.Param("id"))
	if errID != nil {
		log.Println(errID)
		return ctx.String(http.StatusBadRequest, errID.Error())
	}
	TVID, errTVID := paramToIntHelper(ctx.FormValue("tvid"))
	if errTVID != nil {
		log.Println(errTVID)
		return ctx.String(http.StatusBadRequest, errTVID.Error())
	}
	TiID, errTiID := paramToIntHelper(ctx.FormValue("tiid"))
	if errTiID != nil {
		log.Println(errTiID)
		return ctx.String(http.StatusBadRequest, errTiID.Error())
	}
	start, errStart := paramToIntHelper(ctx.FormValue("startat"))
	if errStart != nil {
		log.Println(errStart)
		return ctx.String(http.StatusBadRequest, errStart.Error())
	}
	end, errEnd := paramToIntHelper(ctx.FormValue("endat"))
	if errEnd != nil {
		log.Println(errEnd)
		return ctx.String(http.StatusBadRequest, errEnd.Error())
	}

	err := tc.ts.Update(uint(ID), uint(TVID), uint(TiID), time.Unix(start, 0), time.Unix(end, 0))
	if err != nil {
		log.Println(err)
		return ctx.String(http.StatusBadRequest, err.Error())
	}
	return ctx.NoContent(http.StatusOK)
}

// Delete remove a planification.
func (tc *Planification) Delete(ctx echo.Context) error {
	ID, errID := paramToIntHelper(ctx.Param("id"))
	if errID != nil {
		log.Println(errID)
		return ctx.String(http.StatusBadRequest, errID.Error())
	}
	tc.ts.Delete(uint(ID))
	return ctx.NoContent(http.StatusOK)
}
