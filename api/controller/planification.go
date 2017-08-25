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
	ps *service.Planification
	ts *service.Television
}

// NewPlanification creates a new controller for planifications.
func NewPlanification(ps *service.Planification, ts *service.Television) *Planification {
	tc := &Planification{
		ps: ps,
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

	planifications, err := tc.ps.List(uint(TVID))
	if err != nil {
		log.Println(err)
		return ctx.String(http.StatusBadRequest, err.Error())
	}
	return ctx.JSON(http.StatusOK, planifications)
}

// ListForTv list all planifications for a TV.
func (tc *Planification) ListForTv(ctx echo.Context) error {
	ip := ctx.RealIP()
	log.Println("IP REQUESTING PLANIFICATIONS:", ip)

	tv, err := tc.ts.FindByIP(ip)
	if err != nil {
		log.Println(err)
		return ctx.String(http.StatusBadRequest, err.Error())
	}
	if len(tv) == 0 {
		return ctx.NoContent(http.StatusOK)
	}
	planifications, err := tc.ps.List(tv[0].ID)
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

	err := tc.ps.Create(uint(TVID), uint(TiID), time.Unix(start, 0), time.Unix(end, 0))
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

	err := tc.ps.Update(uint(ID), uint(TVID), uint(TiID), time.Unix(start, 0), time.Unix(end, 0))
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
	tc.ps.Delete(uint(ID))
	return ctx.NoContent(http.StatusOK)
}
