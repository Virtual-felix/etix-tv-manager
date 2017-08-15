package service

import (
	"time"

	"etix-tv-manager/api/model"
	"etix-tv-manager/api/repository"
)

// Planification represents the service responsible for managing planifications.
type Planification struct {
	planificationRepo repository.PlanificationRepository
}

// NewPlanification creates a new planification service for planifications.
func NewPlanification(planificationRepo repository.PlanificationRepository) *Planification {
	return &Planification{
		planificationRepo: planificationRepo,
	}
}

// Create is used to create a new planification.
func (s *Planification) Create(TvID, TiID uint, start, end time.Time) error {
	ti := &model.Planification{TvID: TvID, TiID: TiID, Start: start, End: end}
	return s.planificationRepo.Store(ti)
}

// List is used to list all planifications.
func (s *Planification) List(TvID uint) ([]*model.Planification, error) {
	return s.planificationRepo.Find([]uint{TvID})
}

// Update is used to update a planification.
func (s *Planification) Update(ID, TvID, TiID uint, start, end time.Time) error {
	ti := &model.Planification{ID: ID, TvID: TvID, TiID: TiID, Start: start, End: end}
	return s.planificationRepo.Update(ti)
}

// Delete is used to delete a planification.
func (s *Planification) Delete(ID uint) error {
	return s.planificationRepo.Remove(ID)
}
