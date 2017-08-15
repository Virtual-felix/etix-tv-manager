package service

import (
	"etix-tv-manager/api/model"
	"etix-tv-manager/api/repository"
)

// Timeline represents the service responsible for managing timelines.
type Timeline struct {
	timelineRepo     repository.TimelineRepository
	timelineItemRepo repository.TimelineItemRepository
}

// NewTimeline creates a new timeline service for timelines.
func NewTimeline(timelineRepo repository.TimelineRepository, timelineItemRepo repository.TimelineItemRepository) *Timeline {
	return &Timeline{
		timelineRepo:     timelineRepo,
		timelineItemRepo: timelineItemRepo,
	}
}

// Create is used to create a new timeline.
func (s *Timeline) Create(name string) error {
	t := &model.Timeline{Name: name, Summary: true}
	return s.timelineRepo.Store(t)
}

// List is used to list all timelines.
func (s *Timeline) List() ([]*model.Timeline, error) {
	return s.timelineRepo.Find([]uint{}, []string{})
}

// Get is used to get a timeline.
func (s *Timeline) Get(ID uint) (*model.Timeline, error) {
	return s.timelineRepo.Retrieve(ID)
}

// Update is used to update a timeline.
func (s *Timeline) Update(id uint, name string, summary bool) error {
	t := &model.Timeline{ID: id, Name: name, Summary: summary}
	return s.timelineRepo.Update(t)
}

// CreateItem is used to create a new timeline item.
func (s *Timeline) CreateItem(timelineID uint, name, category string, time, index int) error {
	ti := &model.TimelineItem{TimelineID: timelineID, Name: name, Category: category, Time: time, Rank: index}
	return s.timelineItemRepo.Store(ti)
}

// ListItem is used to list all timeline items of a timeline.
func (s *Timeline) ListItem(timelineID uint) ([]*model.TimelineItem, error) {
	return s.timelineItemRepo.Find([]uint{timelineID}, []string{})
}

// UpdateItem is used to update an item of a timeline.
func (s *Timeline) UpdateItem(timelineID, ID uint, name, category string, time, index int) error {
	ti := &model.TimelineItem{ID: ID, TimelineID: timelineID, Name: name, Category: category, Time: time, Rank: index}
	return s.timelineItemRepo.Update(ti)
}

// DeleteItem is used to delete an item of a timeline.
func (s *Timeline) DeleteItem(ID uint) error {
	return s.timelineItemRepo.Remove(ID)
}
