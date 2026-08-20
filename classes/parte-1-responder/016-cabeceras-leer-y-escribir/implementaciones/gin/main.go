package main

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	motor := gin.New()

	motor.GET("/eco", func(c *gin.Context) {
		recibido := c.GetHeader("X-Peticion")
		if recibido == "" {
			recibido = "(ninguna)"
		}
		c.Header("X-Respuesta", "servida")
		c.Header("Cache-Control", "no-store")
		c.JSON(http.StatusOK, gin.H{"recibido": recibido})
	})

	puerto := os.Getenv("PORT")
	if puerto == "" {
		puerto = "3000"
	}
	_ = motor.Run("127.0.0.1:" + puerto)
}
