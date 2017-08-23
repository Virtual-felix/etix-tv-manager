package controller

import (
	"log"
	"net/http"

	"github.com/labstack/echo"

	"etix-tv-manager/api/service"
)

// Timeline controller.
type Timeline struct {
	ts *service.Timeline
}

// NewTimeline creates a new controller for timelines.
func NewTimeline(ts *service.Timeline) *Timeline {
	tc := &Timeline{
		ts: ts,
	}
	return tc
}

// List list all timelines.
func (tc *Timeline) List(ctx echo.Context) error {
	timelines, err := tc.ts.List()
	if err != nil {
		log.Println(err)
		return ctx.String(http.StatusBadRequest, err.Error())
	}
	return ctx.JSON(http.StatusOK, timelines)
}

// FindOne return a timeline described by its ID.
func (tc *Timeline) FindOne(ctx echo.Context) error {
	ID, errID := paramToIntHelper(ctx.Param("id"))
	if errID != nil {
		log.Println(errID)
		return ctx.String(http.StatusBadRequest, errID.Error())
	}

	t, err := tc.ts.Get(uint(ID))
	if err != nil {
		log.Println(err)
		return ctx.String(http.StatusBadRequest, err.Error())
	}
	return ctx.JSON(http.StatusOK, t)
}

// Create creates a new timeline.
func (tc *Timeline) Create(ctx echo.Context) error {
	name := ctx.FormValue("name")

	err := tc.ts.Create(name)
	if err != nil {
		log.Println(err)
		return ctx.String(http.StatusBadRequest, err.Error())
	}
	return ctx.NoContent(http.StatusOK)
}

// Update update a timeline.
func (tc *Timeline) Update(ctx echo.Context) error {
	name := ctx.FormValue("name")
	summary, errSum := paramToBoolHelper(ctx.FormValue("summary"))
	if errSum != nil {
		log.Println(errSum)
		return ctx.String(http.StatusBadRequest, errSum.Error())
	}
	ID, errID := paramToIntHelper(ctx.Param("id"))
	if errID != nil {
		log.Println(errID)
		return ctx.String(http.StatusBadRequest, errID.Error())
	}
	err := tc.ts.Update(uint(ID), name, summary)
	if err != nil {
		log.Println(err)
		return ctx.String(http.StatusBadRequest, err.Error())
	}
	return ctx.NoContent(http.StatusOK)
}

// Delete remove a timeline.
func (tc *Timeline) Delete(ctx echo.Context) error {
	return ctx.NoContent(http.StatusOK)
}

// Timeline items

// ListItems list items of a timelines.
func (tc *Timeline) ListItems(ctx echo.Context) error {
	tID, err := paramToIntHelper(ctx.Param("tid"))
	if err != nil {
		log.Println(err)
		return ctx.String(http.StatusBadRequest, err.Error())
	}

	items, err := tc.ts.ListItem(uint(tID))
	if err != nil {
		log.Println(err)
		return ctx.String(http.StatusBadRequest, err.Error())
	}
	return ctx.JSON(http.StatusOK, items)
}

// CreateItems create a new item in a timeline.
func (tc *Timeline) CreateItems(ctx echo.Context) error {
	name := ctx.FormValue("name")
	tID, err := paramToIntHelper(ctx.Param("tid"))
	if err != nil {
		log.Println(err)
		return ctx.String(http.StatusBadRequest, err.Error())
	}
	index, errIndex := paramToIntHelper(ctx.FormValue("index"))
	if errIndex != nil {
		log.Println(errIndex)
		return ctx.String(http.StatusBadRequest, errIndex.Error())
	}

	err = tc.ts.CreateItem(uint(tID), name, "unselected", 0, int(index))
	if err != nil {
		log.Println(err)
		return ctx.String(http.StatusBadRequest, err.Error())
	}
	return ctx.NoContent(http.StatusOK)
}

// UpdateItem update an item of a timeline.
func (tc *Timeline) UpdateItem(ctx echo.Context) error {
	name := ctx.FormValue("name")
	category := ctx.FormValue("category")
	tID, errTID := paramToIntHelper(ctx.FormValue("tid"))
	if errTID != nil {
		log.Println(errTID)
		return ctx.String(http.StatusBadRequest, errTID.Error())
	}
	ID, errID := paramToIntHelper(ctx.Param("id"))
	if errID != nil {
		log.Println(errID)
		return ctx.String(http.StatusBadRequest, errID.Error())
	}
	time, errTime := paramToIntHelper(ctx.FormValue("time"))
	if errTime != nil {
		log.Println(ctx.FormValue("time"))
		log.Println(errTime)
		return ctx.String(http.StatusBadRequest, errTime.Error())
	}
	index, errIndex := paramToIntHelper(ctx.FormValue("index"))
	if errIndex != nil {
		log.Println(errIndex)
		return ctx.String(http.StatusBadRequest, errIndex.Error())
	}

	err := tc.ts.UpdateItem(uint(tID), uint(ID), name, category, int(time), int(index))
	if err != nil {
		log.Println(err)
		return ctx.String(http.StatusBadRequest, err.Error())
	}
	return ctx.NoContent(http.StatusOK)
}

// DeleteItem delete an item of a timeline.
func (tc *Timeline) DeleteItem(ctx echo.Context) error {
	ID, errID := paramToIntHelper(ctx.Param("id"))
	if errID != nil {
		log.Println(errID)
		return ctx.String(http.StatusBadRequest, errID.Error())
	}

	err := tc.ts.DeleteItem(uint(ID))
	if err != nil {
		log.Println(err)
		return ctx.String(http.StatusBadRequest, err.Error())
	}
	return ctx.NoContent(http.StatusOK)
}
