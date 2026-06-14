package bot

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"mimi-back/internal/api/status"

	"github.com/gin-gonic/gin"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

type TelegramBot struct {
	api           *tgbotapi.BotAPI
	statusService *status.Service
	Token         string
	AllowedID     int64
}

func NewTelegramBot(token string, allowedIDStr string, statusService *status.Service) (*TelegramBot, error) {
	bot, err := tgbotapi.NewBotAPI(token)
	if err != nil {
		return nil, err
	}

	allowedID, _ := strconv.ParseInt(allowedIDStr, 10, 64)

	return &TelegramBot{
		api:           bot,
		statusService: statusService,
		Token:         token,
		AllowedID:     allowedID,
	}, nil
}

// RegisterWebhook tells telegram where to send POST petitions
func (b *TelegramBot) RegisterWebhook(domain string) error {
	// Usamos el token en la URL por seguridad
	webhookPath := fmt.Sprintf("/api/telegram/webhook/%s", b.Token)
	webhookURL := fmt.Sprintf("https://%s%s", domain, webhookPath)

	wh, _ := tgbotapi.NewWebhook(webhookURL)

	_, err := b.api.Request(wh)
	if err != nil {
		return fmt.Errorf("error setting up the webhook: %w", err)
	}

	log.Printf("Telegram webhook set up on: %s", domain)
	return nil
}

// Controller for the webhook POST petitions
func (b *TelegramBot) HandleWebhook(c *gin.Context) {
	var update tgbotapi.Update

	if err := c.ShouldBindJSON(&update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// If it is not a message or a command, don't do anything
	if update.Message == nil || !update.Message.IsCommand() {
		c.Status(http.StatusOK)
		return
	}

	chatID := update.Message.Chat.ID
	userID := update.Message.From.ID

	//Check if the user is allowed to use the bot
	if b.AllowedID != 0 && userID != b.AllowedID {
		b.api.Send(tgbotapi.NewMessage(chatID, "Unauthorized user."))
		c.Status(http.StatusOK)
		return
	}

	// Command routing
	switch update.Message.Command() {
	case "status":
		stat, err := b.statusService.GetStatus(context.Background())

		var msgText string
		if err != nil {
			msgText = "Error reading the database."
		} else {
			msgText = fmt.Sprintf("Currently reading: %s\nRandom thought: %s", stat.Reading, stat.Message)
		}

		msg := tgbotapi.NewMessage(chatID, msgText)
		b.api.Send(msg)

	case "reading":
		newReading := update.Message.CommandArguments()
		if newReading == "" {
			b.api.Send(tgbotapi.NewMessage(chatID, "Content can`t be empty. Example: /reading Onii-chan wa oshimai!"))
			break
		}

		err := b.statusService.UpdateReading(context.Background(), newReading)
		if err != nil {
			b.api.Send(tgbotapi.NewMessage(chatID, "Error: Failed to update reading."))
		} else {
			b.api.Send(tgbotapi.NewMessage(chatID, "Reading updated to: "+newReading))
		}

	case "message":
		newMessage := update.Message.CommandArguments()
		if newMessage == "" {
			b.api.Send(tgbotapi.NewMessage(chatID, "Content can`t be empty. Example: /message Being meguca is suffering."))
			break
		}

		err := b.statusService.UpdateMessage(context.Background(), newMessage)
		if err != nil {
			b.api.Send(tgbotapi.NewMessage(chatID, "Error: Failed to update message."))
		} else {
			b.api.Send(tgbotapi.NewMessage(chatID, "Message updated to: "+newMessage))
		}
	}

	c.Status(http.StatusOK)
}
