package main

import (
	"net/http"
	"os"
	"strconv"
	"sync"

	"github.com/gin-gonic/gin"
)

type cuerpo struct {
	Titulo string `json:"titulo"`
}

func main() {
	gin.SetMode(gin.ReleaseMode)
	motor := gin.New()

	var mu sync.Mutex
	tareas := map[string]gin.H{"1": {"id": "1", "titulo": "original"}}
	siguiente := 100

	motor.POST("/tareas", func(c *gin.Context) {
		var entrada cuerpo
		_ = c.ShouldBindJSON(&entrada)
		mu.Lock()
		defer mu.Unlock()
		id := strconv.Itoa(siguiente)
		siguiente++
		tareas[id] = gin.H{"id": id, "titulo": entrada.Titulo}
		c.Header("Location", "/tareas/"+id)
		c.JSON(http.StatusCreated, gin.H{"id": id})
	})

	motor.DELETE("/tareas/:id", func(c *gin.Context) {
		mu.Lock()
		defer mu.Unlock()
		if _, hay := tareas[c.Param("id")]; !hay {
			c.JSON(http.StatusNotFound, gin.H{"error": "no existe"})
			return
		}
		delete(tareas, c.Param("id"))
		// `Status` sin cuerpo: usar `JSON` aquí emitiría contenido con un 204.
		c.Status(http.StatusNoContent)
	})

	motor.GET("/tareas/:id", func(c *gin.Context) {
		mu.Lock()
		defer mu.Unlock()
		tarea, hay := tareas[c.Param("id")]
		if !hay {
			c.JSON(http.StatusNotFound, gin.H{"error": "no existe"})
			return
		}
		c.JSON(http.StatusOK, tarea)
	})

	puerto := os.Getenv("PORT")
	if puerto == "" {
		puerto = "3000"
	}
	_ = motor.Run("127.0.0.1:" + puerto)
}
