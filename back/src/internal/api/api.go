package api

import (
	"net/http"
	"mimi-back/db"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter(queries *db.Queries) *gin.Engine {
	r := gin.Default()
	r.Use(cors.Default())

	r.GET("/api/status", func(c *gin.Context) {
		status, err := queries.GetStatus(c.Request.Context())
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Couldn't read DB"})
			return
		}
		c.JSON(http.StatusOK, status)
	})

	return r
}
