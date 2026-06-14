package main

import (
	"database/sql"
	"log"

	"mimi-back/db"
	"mimi-back/internal/api"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	// DB connection
	conn, err := sql.Open("sqlite3", "/app/data/mimi-back.db")
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	// Initialize db connection
	queries := db.New(conn)

	router := api.SetupRouter(queries)
	
	if err := router.Run(":8080"); err != nil {
		log.Fatal("Error, couldn't start gin router:", err)
	}
}
