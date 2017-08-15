package model

import "time"

// Planification represents a planification.
type Planification struct {
	ID    uint      `json:"id" gorm:"primary_key"`
	TvID  uint      `json:"tvid"`
	TiID  uint      `json:"tiid"`
	Start time.Time `json:"startAt"`
	End   time.Time `json:"endAt"`
}
