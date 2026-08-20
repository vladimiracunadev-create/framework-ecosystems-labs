package main

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	motor := gin.New()

	// En Gin la capa se registra con `Use` y continúa con `c.Next()`. Lo
	// interesante: `Next()` está en MEDIO, así que el código de después se
	// ejecuta al volver, con la respuesta ya generada.
	motor.Use(func(c *gin.Context) {
		c.Header("X-Capa", "intermedia")
		c.Next()
	})

	motor.GET("/a", func(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"ruta": "a"}) })
	motor.GET("/b", func(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"ruta": "b"}) })

	motor.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{"error": "no existe"})
	})

	puerto := os.Getenv("PORT")
	if puerto == "" {
		puerto = "3000"
	}
	_ = motor.Run("127.0.0.1:" + puerto)
}
