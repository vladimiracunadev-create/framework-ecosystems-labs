package main

import (
	"encoding/json"
	"io"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	motor := gin.New()

	motor.POST("/tareas", func(c *gin.Context) {
		crudo, _ := io.ReadAll(c.Request.Body)

		var cuerpo map[string]any
		if err := json.Unmarshal(crudo, &cuerpo); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "cuerpo JSON mal formado"})
			return
		}

		titulo, ok := cuerpo["titulo"].(string)
		if !ok || titulo == "" {
			c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "titulo es obligatorio"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"id": "1", "titulo": titulo, "completada": false})
	})

	puerto := os.Getenv("PORT")
	if puerto == "" {
		puerto = "3000"
	}
	_ = motor.Run("127.0.0.1:" + puerto)
}
