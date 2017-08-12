package repository

import (
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"

	"etix-tv-manager/api/model"
)

// TimelineItemRepository represents a repository that can manage timeline items.
type TimelineItemRepository interface {
	Store(*model.TimelineItem) error
	Retrieve(id uint) (*model.TimelineItem, error)
	Update(badge *model.TimelineItem) error
	Remove(id uint) error
	Find(timelineIds []uint, categories []string) ([]*model.TimelineItem, error)
}

// ORMTimelineItemRepository represents a timelineItem repository managed through an ORM.
type ORMTimelineItemRepository struct {
	orm *gorm.DB
}

// NewORMTimelineItemRepository creates a new timelineItem repository using an ORM.
func NewORMTimelineItemRepository(orm *gorm.DB) *ORMTimelineItemRepository {
	ar := &ORMTimelineItemRepository{
		orm: orm,
	}
	return ar
}

// Store stores a new timelineItem in the repository.
func (ar *ORMTimelineItemRepository) Store(timelineItem *model.TimelineItem) error {
	return ar.orm.Create(timelineItem).Error
}

// Retrieve gets a timelineItem from the repository.
func (ar *ORMTimelineItemRepository) Retrieve(id uint) (*model.TimelineItem, error) {
	var timelineItem model.TimelineItem
	err := ar.orm.First(&timelineItem, id).Error
	if err == gorm.ErrRecordNotFound {
		return nil, model.ErrNotFound
	}
	return &timelineItem, err
}

// Update updates an timelineItem in the repository.
func (ar *ORMTimelineItemRepository) Update(updatedTimelineItem *model.TimelineItem) error {
	var timelineItem model.TimelineItem
	err := ar.orm.First(&timelineItem, updatedTimelineItem.ID).Error
	if err == gorm.ErrRecordNotFound {
		return model.ErrNotFound
	}
	if err != nil {
		return errors.Wrap(err, "could not get timelineItem from DB")
	}
	err = ar.orm.Save(&updatedTimelineItem).Error
	if err != nil {
		return errors.Wrap(err, "could not save timelineItem in DB")
	}
	return nil
}

// Remove deletes a timelineItem from the repository.
func (ar *ORMTimelineItemRepository) Remove(id uint) error {
	var timelineItem model.TimelineItem
	err := ar.orm.First(&timelineItem, id).Error
	if err == gorm.ErrRecordNotFound {
		return model.ErrNotFound
	}
	if err != nil {
		return errors.Wrap(err, "could not get timelineItem from DB")
	}
	err = ar.orm.Delete(&timelineItem).Error
	if err != nil {
		return errors.Wrap(err, "could not remove timelineItem from DB")
	}
	return nil
}

// Find will search for timelineItems using optional filters
func (ar *ORMTimelineItemRepository) Find(timelineIDs []uint, categories []string) ([]*model.TimelineItem, error) {
	var timelineItems []*model.TimelineItem
	query := ar.orm
	if len(timelineIDs) > 0 {
		query = query.Where("timeline_id IN (?)", timelineIDs)
	}
	if len(categories) > 0 {
		query = query.Where("caterogy IN (?)", categories)
	}
	err := query.Order("rank asc").Find(&timelineItems).Error
	return timelineItems, err
}
