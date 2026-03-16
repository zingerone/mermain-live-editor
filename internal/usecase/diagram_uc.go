package usecase

import (
	"context"
	"mermaid-app/internal/domain"
	"time"
)

type diagramUsecase struct {
	repo domain.DiagramRepository
}

func NewDiagramUsecase(r domain.DiagramRepository) domain.DiagramUsecase {
	return &diagramUsecase{repo: r}
}

func (u *diagramUsecase) GetAll(ctx context.Context) ([]domain.Diagram, error) {
	return u.repo.Fetch(ctx)
}

func (u *diagramUsecase) Save(ctx context.Context, d *domain.Diagram) error {
	if d.ID == 0 {
		d.CreatedAt = time.Now()
		return u.repo.Store(ctx, d)
	}
	return u.repo.Update(ctx, d)
}

func (u *diagramUsecase) Delete(ctx context.Context, id int) error {
	return u.repo.Delete(ctx, id)
}
