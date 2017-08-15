package service

import (
	"etix-tv-manager/api/model"
	"etix-tv-manager/api/repository"
)

// Television represents the service responsible for managing televisions.
type Television struct {
	televisionRepo repository.TelevisionRepository
}

// NewTelevision creates a new television service for televisions.
func NewTelevision(televisionRepo repository.TelevisionRepository) *Television {
	return &Television{
		televisionRepo: televisionRepo,
	}
}

// Create is used to create a new television.
func (s *Television) Create(name, IP string, gID uint) error {
	ti := &model.Television{GroupID: gID, Name: name, IP: IP}
	return s.televisionRepo.Store(ti)
}

// List is used to list all televisions.
func (s *Television) List() ([]*model.Television, error) {
	return s.televisionRepo.Find([]uint{}, []string{})
}

// Update is used to update a television.
func (s *Television) Update(ID, gID uint, name, IP string) error {
	ti := &model.Television{ID: ID, GroupID: gID, Name: name, IP: IP}
	return s.televisionRepo.Update(ti)
}

// Delete is used to delete a television.
func (s *Television) Delete(ID uint) error {
	return s.televisionRepo.Remove(ID)
}

// FindByIP is used to find a television with its IP address.
func (s *Television) FindByIP(IP string) ([]*model.Television, error) {
	return s.televisionRepo.Find([]uint{}, []string{IP})
}
