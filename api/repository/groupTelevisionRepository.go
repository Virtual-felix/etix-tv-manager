package repository

import (
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"

	"etix-tv-manager/api/model"
)

// GroupTelevisionRepository represents a repository that can manage group of televisions.
type GroupTelevisionRepository interface {
	Store(*model.GroupTelevision) error
	Retrieve(id uint) (*model.GroupTelevision, error)
	Update(badge *model.GroupTelevision) error
	Remove(id uint) error
	Find() ([]*model.GroupTelevision, error)
}

// ORMGroupTelevisionRepository represents a group of television repository managed through an ORM.
type ORMGroupTelevisionRepository struct {
	orm *gorm.DB
}

// NewORMGroupTelevisionRepository creates a new group of television repository using an ORM.
func NewORMGroupTelevisionRepository(orm *gorm.DB) *ORMGroupTelevisionRepository {
	ar := &ORMGroupTelevisionRepository{
		orm: orm,
	}
	return ar
}

// Store stores a new group in the repository.
func (ar *ORMGroupTelevisionRepository) Store(group *model.GroupTelevision) error {
	return ar.orm.Create(group).Error
}

// Retrieve gets a group from the repository.
func (ar *ORMGroupTelevisionRepository) Retrieve(id uint) (*model.GroupTelevision, error) {
	var group model.GroupTelevision
	err := ar.orm.First(&group, id).Error
	if err == gorm.ErrRecordNotFound {
		return nil, model.ErrNotFound
	}
	return &group, err
}

// Update updates an group in the repository.
func (ar *ORMGroupTelevisionRepository) Update(updatedGroup *model.GroupTelevision) error {
	var group model.GroupTelevision
	err := ar.orm.First(&group, updatedGroup.ID).Error
	if err == gorm.ErrRecordNotFound {
		return model.ErrNotFound
	}
	if err != nil {
		return errors.Wrap(err, "could not get group from DB")
	}
	err = ar.orm.Save(&updatedGroup).Error
	if err != nil {
		return errors.Wrap(err, "could not save group in DB")
	}
	return nil
}

// Remove deletes a group from the repository.
func (ar *ORMGroupTelevisionRepository) Remove(id uint) error {
	var group model.GroupTelevision
	err := ar.orm.First(&group, id).Error
	if err == gorm.ErrRecordNotFound {
		return model.ErrNotFound
	}
	if err != nil {
		return errors.Wrap(err, "could not get group from DB")
	}
	err = ar.orm.Delete(&group).Error
	if err != nil {
		return errors.Wrap(err, "could not remove group from DB")
	}
	return nil
}

// Find will search for group of television.
func (ar *ORMGroupTelevisionRepository) Find() ([]*model.GroupTelevision, error) {
	var group []*model.GroupTelevision
	query := ar.orm
	err := query.Find(&group).Error
	return group, err
}
