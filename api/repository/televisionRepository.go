package repository

import (
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"

	"etix-tv-manager/api/model"
)

// TelevisionRepository represents a repository that can manage timelines.
type TelevisionRepository interface {
	Store(*model.Television) error
	Retrieve(id uint) (*model.Television, error)
	Update(badge *model.Television) error
	Remove(id uint) error
	Find(timelineIds []uint, names []string) ([]*model.Television, error)
}

// ORMTelevisionRepository represents a television repository managed through an ORM.
type ORMTelevisionRepository struct {
	orm *gorm.DB
}

// NewORMTelevisionRepository creates a new television repository using an ORM.
func NewORMTelevisionRepository(orm *gorm.DB) *ORMTelevisionRepository {
	ar := &ORMTelevisionRepository{
		orm: orm,
	}
	return ar
}

// Store stores a new television in the repository.
func (ar *ORMTelevisionRepository) Store(television *model.Television) error {
	return ar.orm.Create(television).Error
}

// Retrieve gets a television from the repository.
func (ar *ORMTelevisionRepository) Retrieve(id uint) (*model.Television, error) {
	var television model.Television
	err := ar.orm.First(&television, id).Error
	if err == gorm.ErrRecordNotFound {
		return nil, model.ErrNotFound
	}
	return &television, err
}

// Update updates an television in the repository.
func (ar *ORMTelevisionRepository) Update(updatedTimeline *model.Television) error {
	var television model.Television
	err := ar.orm.First(&television, updatedTimeline.ID).Error
	if err == gorm.ErrRecordNotFound {
		return model.ErrNotFound
	}
	if err != nil {
		return errors.Wrap(err, "could not get television from DB")
	}
	err = ar.orm.Save(&updatedTimeline).Error
	if err != nil {
		return errors.Wrap(err, "could not save television in DB")
	}
	return nil
}

// Remove deletes a television from the repository.
func (ar *ORMTelevisionRepository) Remove(id uint) error {
	var television model.Television
	err := ar.orm.First(&television, id).Error
	if err == gorm.ErrRecordNotFound {
		return model.ErrNotFound
	}
	if err != nil {
		return errors.Wrap(err, "could not get television from DB")
	}
	err = ar.orm.Delete(&television).Error
	if err != nil {
		return errors.Wrap(err, "could not remove television from DB")
	}
	return nil
}

// Find will search for televisions using optional filters
func (ar *ORMTelevisionRepository) Find(televisionGroupIDs []uint, names []string) ([]*model.Television, error) {
	var televisions []*model.Television
	query := ar.orm
	if len(televisionGroupIDs) > 0 {
		query = query.Where("groupid IN (?)", televisionGroupIDs)
	}
	if len(names) > 0 {
		query = query.Where("name IN (?)", names)
	}
	err := query.Find(&televisions).Error
	return televisions, err
}
