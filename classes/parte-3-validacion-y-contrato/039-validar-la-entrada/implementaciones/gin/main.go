package main

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

// Las reglas van en ETIQUETAS de la estructura. Gin las aplica al enlazar, y el
// puntero en `Completada` distingue "no vino" de "vino como false".
type tarea struct {
	Titulo     string `json:"titulo" binding:"required,min=1,max=120"`
	Completada *bool  `json:"completada"`
}

func main() {
	gin.SetMode(gin.ReleaseMode)
	motor := gin.New()

	motor.POST("/tareas", func(c *gin.Context) {
		var entrada tarea
		if err := c.ShouldBindJSON(&entrada); err != nil {
			c.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
			return
		}

		titulo := strings.TrimSpace(entrada.Titulo)
		if titulo == "" {
			c.JSON(http.StatusUnprocessableEntity,
				gin.H{"error": "titulo no puede estar vacío"})
			return
		}

		completada := false
		if entrada.Completada != nil {
			completada = *entrada.Completada
		}

		c.JSON(http.StatusCreated, gin.H{"titulo": titulo, "completada": completada})
	})

	puerto := os.Getenv("PORT")
	if puerto == "" {
		puerto = "3000"
	}
	_ = motor.Run("127.0.0.1:" + puerto)
}
