package model

// GroupTelevision represents a television.
type GroupTelevision struct {
	ID   uint   `json:"id" gorm:"primary_key"`
	Name string `json:"name"  validate:"required"`
}

// Television represents a television.
type Television struct {
	ID      uint   `json:"id" gorm:"primary_key"`
	GroupID uint   `json:"gid" validate:"required"`
	Name    string `json:"name"  validate:"required"`
	IP      string `json:"ip" validate:"required"`
}
