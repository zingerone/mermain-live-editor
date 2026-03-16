package main

import (
	"database/sql"
	"log"
	"net/http"
	"mermaid-app/internal/delivery"
	"mermaid-app/internal/repository"
	"mermaid-app/internal/usecase"
	_ "modernc.org/sqlite"
)

func main() {
	db, _ := sql.Open("sqlite", "./diagrams.db")
	db.Exec("CREATE TABLE IF NOT EXISTS diagrams (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, created_at DATETIME)")

	repo := repository.NewSqliteRepository(db)
	uc := usecase.NewDiagramUsecase(repo)
	delivery.NewHttpHandler(uc)

	log.Println("Server running at http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}
