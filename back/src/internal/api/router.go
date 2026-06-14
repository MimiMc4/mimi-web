package api

import (
	"fmt"
	"mimi-back/internal/api/status"
	botPkg "mimi-back/internal/bot"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter(statusHandler *status.Handler, tgBot *botPkg.TelegramBot) *gin.Engine {
	r := gin.Default()
	r.Use(cors.Default())

	api := r.Group("/api")
	{
		api.GET("/status", statusHandler.GetStatus)

		if tgBot != nil {
			webhookPath := fmt.Sprintf("/telegram/webhook/%s", tgBot.Token)
			api.POST(webhookPath, tgBot.HandleWebhook)
		}
	}

	return r
}
