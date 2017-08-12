package model

// TimelineItem represents an item of a timeline.
type TimelineItem struct {
	ID         uint   `json:"id" gorm:"primary_key"`
	TimelineID uint   `json:"tid"  validate:"required"`
	Name       string `json:"name"  validate:"required"`
	Category   string `json:"category"  validate:"required"`
	Time       int    `json:"time"  validate:"required"`
	Rank       int    `json:"index" validate:"required"`
}

// Timeline is the model structure representing a timeline.
type Timeline struct {
	ID      uint   `json:"id" gorm:"primary_key"`
	Name    string `json:"name" validate:"required"`
	Summary bool   `json:"summary" validate:"required"`
}
