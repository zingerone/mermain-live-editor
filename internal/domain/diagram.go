package domain

import (
	"context"
	"time"
)

type Diagram struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	Category  string    `json:"category"` // Tambahkan ini
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

type DiagramRepository interface {
	Fetch(ctx context.Context) ([]Diagram, error)
	Store(ctx context.Context, d *Diagram) error
	Update(ctx context.Context, d *Diagram) error
	Delete(ctx context.Context, id int) error
}

type DiagramUsecase interface {
	GetAll(ctx context.Context) ([]Diagram, error)
	Save(ctx context.Context, d *Diagram) error
	Delete(ctx context.Context, id int) error
}
