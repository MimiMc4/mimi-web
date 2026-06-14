package status

import (
	"context"
	"mimi-back/db"
)

type Service struct {
	queries *db.Queries
}

func NewService(q *db.Queries) *Service {
	return &Service{queries: q}
}

func (s *Service) GetStatus(ctx context.Context) (db.GetStatusRow, error) {
	return s.queries.GetStatus(ctx)
}

func (s *Service) UpdateReading(ctx context.Context, reading string) error {
	return s.queries.UpdateReading(ctx, reading)
}

func (s *Service) UpdateMessage(ctx context.Context, message string) error {
	return s.queries.UpdateMessage(ctx, message)
}
