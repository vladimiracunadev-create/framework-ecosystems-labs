package main

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

// Gin se apoya en `net/http` de la biblioteca estándar, igual que Express en
// `http` de Node. La diferencia con Node: aquí el servidor ya venía con el
// lenguaje, así que el framework no tiene que traerlo.
func main() {
	gin.SetMode(gin.ReleaseMode)
	motor := gin.New()

	motor.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"capa": "gin"})
	})

	motor.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{"error": "no existe"})
	})

	puerto := os.Getenv("PORT")
	if puerto == "" {
		puerto = "3000"
	}
	_ = motor.Run("127.0.0.1:" + puerto)
}
