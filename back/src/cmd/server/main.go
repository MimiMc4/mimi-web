package main

import (
	"database/sql"
	"log"
	"os"

	"mimi-back/db"
	"mimi-back/internal/api"
	"mimi-back/internal/api/status"
	botPkg "mimi-back/internal/bot"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	conn, err := sql.Open("sqlite3", "/app/data/mimi-back.db")
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	queries := db.New(conn)
	statusService := status.NewService(queries)

	// Initialize bot
	var tgBot *botPkg.TelegramBot
	telegramToken := os.Getenv("TELEGRAM_BOT_TOKEN")
	allowedID := os.Getenv("ALLOWED_TELEGRAM_ID")

	if telegramToken != "" {
		tgBot, err = botPkg.NewTelegramBot(telegramToken, allowedID, statusService)
		if err != nil {
			log.Fatal("Error initializing telegram bot:", err)
		}

		domain := "mimi.tehe.moe"

		if err := tgBot.RegisterWebhook(domain); err != nil {
			log.Fatal("Error registring webhook:", err)
		}
	} else {
		log.Println("Warning: undefined TELEGRAM_BOT_TOKEN, unactive bot")
	}

	statusHandler := status.NewHandler(statusService)
	router := api.SetupRouter(statusHandler, tgBot)

	if err := router.Run(":8080"); err != nil {
		log.Fatal("Error, couldn't start gin router:", err)
	}
}
