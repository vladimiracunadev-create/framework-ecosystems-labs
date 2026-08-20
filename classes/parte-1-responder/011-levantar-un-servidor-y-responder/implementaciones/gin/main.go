package main

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	motor := gin.New()

	motor.GET("/", func(c *gin.Context) {
		c.Data(http.StatusOK, "text/plain; charset=utf-8", []byte("hola"))
	})

	puerto := os.Getenv("PORT")
	if puerto == "" {
		puerto = "3000"
	}
	_ = motor.Run("127.0.0.1:" + puerto)
}
