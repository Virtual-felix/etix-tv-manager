package repository

import (
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"

	"etix-tv-manager/api/model"
)

// PlanificationRepository represents a repository that can manage planifications.
type PlanificationRepository interface {
	Store(*model.Planification) error
	Retrieve(id uint) (*model.Planification, error)
	Update(badge *model.Planification) error
	Remove(id uint) error
	Find(TVIDs []uint) ([]*model.Planification, error)
}

// ORMPlanificationRepository represents a planification repository managed through an ORM.
type ORMPlanificationRepository struct {
	orm *gorm.DB
}

// NewORMPlanificationRepository creates a new planification repository using an ORM.
func NewORMPlanificationRepository(orm *gorm.DB) *ORMPlanificationRepository {
	ar := &ORMPlanificationRepository{
		orm: orm,
	}
	return ar
}

// Store stores a new planification in the repository.
func (ar *ORMPlanificationRepository) Store(planification *model.Planification) error {
	return ar.orm.Create(planification).Error
}

// Retrieve gets a planification from the repository.
func (ar *ORMPlanificationRepository) Retrieve(id uint) (*model.Planification, error) {
	var planification model.Planification
	err := ar.orm.First(&planification, id).Error
	if err == gorm.ErrRecordNotFound {
		return nil, model.ErrNotFound
	}
	return &planification, err
}

// Update updates an planification in the repository.
func (ar *ORMPlanificationRepository) Update(updatedPlanification *model.Planification) error {
	var planification model.Planification
	err := ar.orm.First(&planification, updatedPlanification.ID).Error
	if err == gorm.ErrRecordNotFound {
		return model.ErrNotFound
	}
	if err != nil {
		return errors.Wrap(err, "could not get planification from DB")
	}
	err = ar.orm.Save(&updatedPlanification).Error
	if err != nil {
		return errors.Wrap(err, "could not save planification in DB")
	}
	return nil
}

// Remove deletes a planification from the repository.
func (ar *ORMPlanificationRepository) Remove(id uint) error {
	var planification model.Planification
	err := ar.orm.First(&planification, id).Error
	if err == gorm.ErrRecordNotFound {
		return model.ErrNotFound
	}
	if err != nil {
		return errors.Wrap(err, "could not get planification from DB")
	}
	err = ar.orm.Delete(&planification).Error
	if err != nil {
		return errors.Wrap(err, "could not remove planification from DB")
	}
	return nil
}

// Find will search for planifications using optional filters
func (ar *ORMPlanificationRepository) Find(TVIDs []uint) ([]*model.Planification, error) {
	var planifications []*model.Planification
	query := ar.orm
	if len(TVIDs) > 0 {
		query = query.Where("tv_id IN (?)", TVIDs)
	}
	err := query.Find(&planifications).Error
	return planifications, err
}
