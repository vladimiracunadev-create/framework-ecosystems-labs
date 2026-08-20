package main

import (
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
)

const porOmision = 20

func main() {
	gin.SetMode(gin.ReleaseMode)
	motor := gin.New()

	motor.GET("/tareas", func(c *gin.Context) {
		bruto := c.Query("limite")
		if bruto == "" {
			c.JSON(http.StatusOK, gin.H{"limite": porOmision})
			return
		}

		limite, err := strconv.Atoi(bruto)
		if err != nil || limite < 1 || limite > 100 {
			c.JSON(http.StatusUnprocessableEntity,
				gin.H{"error": "limite debe ser un entero entre 1 y 100"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"limite": limite})
	})

	puerto := os.Getenv("PORT")
	if puerto == "" {
		puerto = "3000"
	}
	_ = motor.Run("127.0.0.1:" + puerto)
}
