package main

import (
	"net/http"
	"os"
	"runtime/debug"
	"strconv"

	"github.com/gin-gonic/gin"
)

// La version de Gin no se escribe a mano: se lee de la informacion de
// construccion que el compilador incrusta en el binario. Un numero copiado a
// mano en un informe de rendimiento es el primer sitio por donde se cuela una
// mentira.
func versionDeGin() string {
	info, ok := debug.ReadBuildInfo()
	if !ok {
		return "desconocida"
	}
	for _, dep := range info.Deps {
		if dep.Path == "github.com/gin-gonic/gin" {
			return dep.Version
		}
	}
	return "desconocida"
}

// Cuantas repeticiones, con un tope.
//
// Sin tope, `?n=10000000` bloquearia el proceso — y una ruta que mide no deberia
// poder tumbar el servicio que mide.
func repeticiones(c *gin.Context) int {
	n, err := strconv.Atoi(c.DefaultQuery("n", "100"))
	if err != nil || n < 1 {
		n = 100
	}
	if n > 2000 {
		n = 2000
	}
	return n
}

func main() {
	gin.SetMode(gin.ReleaseMode)
	motor := gin.New()
	version := versionDeGin()

	motor.GET("/trabajo", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"hecho": true, "vueltas": Vueltas, "huella": trabajo()})
	})

	motor.GET("/medir-mal", func(c *gin.Context) {
		c.JSON(http.StatusOK, medirMal(repeticiones(c)))
	})

	motor.GET("/medir-bien", func(c *gin.Context) {
		c.JSON(http.StatusOK, medirBien(repeticiones(c)))
	})

	motor.GET("/comparar", func(c *gin.Context) {
		c.JSON(http.StatusOK, comparar(repeticiones(c)))
	})

	motor.GET("/entorno", func(c *gin.Context) {
		salida := entorno(version)
		salida["framework"] = "gin " + version
		c.JSON(http.StatusOK, salida)
	})

	puerto := os.Getenv("PORT")
	if puerto == "" {
		puerto = "3000"
	}
	_ = motor.Run("127.0.0.1:" + puerto)
}
