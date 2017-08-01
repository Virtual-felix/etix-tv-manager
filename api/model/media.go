package model

import (
	"time"
)

// Media represents a media object.
type Media struct {
	Name         string    `json:"name"`
	Size         int64     `json:"size"`
	LastModified time.Time `json:"lastmodified"`
}
