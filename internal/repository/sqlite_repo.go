package repository

import (
	"context"
	"database/sql"
	"mermaid-app/internal/domain"
)

type sqliteRepo struct {
	Conn *sql.DB
}

func NewSqliteRepository(conn *sql.DB) domain.DiagramRepository {
	return &sqliteRepo{conn}
}

func (m *sqliteRepo) Fetch(ctx context.Context) ([]domain.Diagram, error) {
	rows, err := m.Conn.QueryContext(ctx, "SELECT id, title, content, created_at FROM diagrams ORDER BY created_at DESC")
	if err != nil { return nil, err }
	defer rows.Close()

	var res []domain.Diagram
	for rows.Next() {
		var t domain.Diagram
		rows.Scan(&t.ID, &t.Title, &t.Content, &t.CreatedAt)
		res = append(res, t)
	}
	return res, nil
}

func (m *sqliteRepo) Store(ctx context.Context, d *domain.Diagram) error {
	_, err := m.Conn.ExecContext(ctx, "INSERT INTO diagrams (title, content, created_at) VALUES (?, ?, ?)", d.Title, d.Content, d.CreatedAt)
	return err
}

func (m *sqliteRepo) Update(ctx context.Context, d *domain.Diagram) error {
	_, err := m.Conn.ExecContext(ctx, "UPDATE diagrams SET title = ?, content = ? WHERE id = ?", d.Title, d.Content, d.ID)
	return err
}

func (m *sqliteRepo) Delete(ctx context.Context, id int) error {
	_, err := m.Conn.ExecContext(ctx, "DELETE FROM diagrams WHERE id = ?", id)
	return err
}
