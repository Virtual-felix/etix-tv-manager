package repository

import (
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"

	"etix-tv-manager/api/model"
)

// TimelineRepository represents a repository that can manage timelines.
type TimelineRepository interface {
	Store(*model.Timeline) error
	Retrieve(id uint) (*model.Timeline, error)
	Update(badge *model.Timeline) error
	Remove(id uint) error
	Find(timelineIds []uint, names []string) ([]*model.Timeline, error)
}

// ORMTimelineRepository represents a timeline repository managed through an ORM.
type ORMTimelineRepository struct {
	orm *gorm.DB
}

// NewORMTimelineRepository creates a new timeline repository using an ORM.
func NewORMTimelineRepository(orm *gorm.DB) *ORMTimelineRepository {
	ar := &ORMTimelineRepository{
		orm: orm,
	}
	return ar
}

// Store stores a new timeline in the repository.
func (ar *ORMTimelineRepository) Store(timeline *model.Timeline) error {
	return ar.orm.Create(timeline).Error
}

// Retrieve gets a timeline from the repository.
func (ar *ORMTimelineRepository) Retrieve(id uint) (*model.Timeline, error) {
	var timeline model.Timeline
	err := ar.orm.First(&timeline, id).Error
	if err == gorm.ErrRecordNotFound {
		return nil, model.ErrNotFound
	}
	return &timeline, err
}

// Update updates an timeline in the repository.
func (ar *ORMTimelineRepository) Update(updatedTimeline *model.Timeline) error {
	var timeline model.Timeline
	err := ar.orm.First(&timeline, updatedTimeline.ID).Error
	if err == gorm.ErrRecordNotFound {
		return model.ErrNotFound
	}
	if err != nil {
		return errors.Wrap(err, "could not get timeline from DB")
	}
	err = ar.orm.Save(&updatedTimeline).Error
	if err != nil {
		return errors.Wrap(err, "could not save timeline in DB")
	}
	return nil
}

// Remove deletes a timeline from the repository.
func (ar *ORMTimelineRepository) Remove(id uint) error {
	var timeline model.Timeline
	err := ar.orm.First(&timeline, id).Error
	if err == gorm.ErrRecordNotFound {
		return model.ErrNotFound
	}
	if err != nil {
		return errors.Wrap(err, "could not get timeline from DB")
	}
	err = ar.orm.Delete(&timeline).Error
	if err != nil {
		return errors.Wrap(err, "could not remove timeline from DB")
	}
	return nil
}

// Find will search for timelines using optional filters
func (ar *ORMTimelineRepository) Find(timelineIDs []uint, names []string) ([]*model.Timeline, error) {
	var timelines []*model.Timeline
	query := ar.orm
	if len(timelineIDs) > 0 {
		query = query.Where("id IN (?)", timelineIDs)
	}
	if len(names) > 0 {
		query = query.Where("name IN (?)", names)
	}
	err := query.Find(&timelines).Error
	return timelines, err
}
