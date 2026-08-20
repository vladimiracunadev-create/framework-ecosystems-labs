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
	altas := 0

	motor.GET("/tareas/:id", func(c *gin.Context) {
		mu.Lock()
		defer mu.Unlock()
		tarea, hay := tareas[c.Param("id")]
		if !hay {
			c.Status(http.StatusNotFound)
			return
		}
		c.JSON(http.StatusOK, tarea)
	})

	motor.PUT("/tareas/:id", func(c *gin.Context) {
		var entrada cuerpo
		_ = c.ShouldBindJSON(&entrada)
		mu.Lock()
		defer mu.Unlock()
		tarea := gin.H{"id": c.Param("id"), "titulo": entrada.Titulo}
		tareas[c.Param("id")] = tarea
		c.JSON(http.StatusOK, tarea)
	})

	motor.POST("/tareas", func(c *gin.Context) {
		var entrada cuerpo
		_ = c.ShouldBindJSON(&entrada)
		mu.Lock()
		defer mu.Unlock()
		altas++
		id := "nueva-" + strconv.Itoa(altas)
		tareas[id] = gin.H{"id": id, "titulo": entrada.Titulo}
		c.Header("Location", "/tareas/"+id)
		c.JSON(http.StatusCreated, gin.H{"id": id, "altas": altas})
	})

	puerto := os.Getenv("PORT")
	if puerto == "" {
		puerto = "3000"
	}
	_ = motor.Run("127.0.0.1:" + puerto)
}
