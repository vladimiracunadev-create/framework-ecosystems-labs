package main

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"runtime"
	"sort"
	"time"
)

// LA MEDICION, SIN NADA DE GIN DENTRO.
//
// El metodo no depende del framework — por eso este archivo no lo menciona, y
// por eso es el mismo que el de Express, Fastify y axum traducido a Go. Lo que
// cambia entre las cuatro implementaciones es el lenguaje, no lo que se hace.

// LA UNIDAD DE TRABAJO. Determinista y con coste real.
//
// Cuatrocientos hashes encadenados sobre la misma semilla: siempre el mismo
// resultado, siempre el mismo trabajo. Sin coste real no habria cola que medir;
// sin determinismo, cada muestra mediria algo distinto.
const Vueltas = 400

func trabajo() string {
	dato := []byte("clase-007")
	for i := 0; i < Vueltas; i++ {
		suma := sha256.Sum256(dato)
		dato = suma[:]
	}
	return hex.EncodeToString(dato)[:16]
}

func muestrear(n int) []float64 {
	tiempos := make([]float64, 0, n)
	for i := 0; i < n; i++ {
		inicio := time.Now()
		trabajo()
		tiempos = append(tiempos, float64(time.Since(inicio).Nanoseconds())/1e6)
	}
	return tiempos
}

func media(xs []float64) float64 {
	total := 0.0
	for _, x := range xs {
		total += x
	}
	return total / float64(len(xs))
}

// El percentil p de una muestra ya ordenada.
//
// Con el metodo del rango mas cercano: el valor por debajo del cual queda al
// menos el p por ciento de las observaciones. No se interpola, para no inventar
// un numero que nadie midio.
func percentil(ordenados []float64, p float64) float64 {
	indice := int(float64(len(ordenados))*p/100+0.999999) - 1
	if indice < 0 {
		indice = 0
	}
	if indice >= len(ordenados) {
		indice = len(ordenados) - 1
	}
	return ordenados[indice]
}

func redondear(x float64) float64 {
	return float64(int64(x*10000+0.5)) / 10000
}

// LA MEDICION MAL HECHA.
//
// Sin calentar y publicando solo la media. No esta exagerada: es exactamente lo
// que aparece en la mayoria de las comparativas que circulan.
func medirMal(n int) map[string]any {
	tiempos := muestrear(n)
	return map[string]any{
		"muestras":      n,
		"calentamiento": 0,
		"publica":       "solo la media",
		"media_ms":      redondear(media(tiempos)),
		"por_que_esta_mal": []string{
			"no calienta: las primeras muestras miden las caches frias, no el trabajo",
			"publica una media: un solo numero no dice nada sobre la forma de la distribucion",
			"no dice cuantas veces se repitio ni en que maquina",
		},
	}
}

// LA MEDICION BIEN HECHA.
//
// Calienta, mide, ordena y publica la distribucion entera. La media sigue ahi —
// no es que sea falsa, es que sola no basta.
func medirBien(n int) map[string]any {
	calentamiento := n / 5
	if calentamiento < 20 {
		calentamiento = 20
	}
	muestrear(calentamiento)

	tiempos := muestrear(n)
	ordenados := append([]float64(nil), tiempos...)
	sort.Float64s(ordenados)

	return map[string]any{
		"muestras":      n,
		"calentamiento": calentamiento,
		"publica":       "percentiles",
		"media_ms":      redondear(media(tiempos)),
		"p50_ms":        redondear(percentil(ordenados, 50)),
		"p90_ms":        redondear(percentil(ordenados, 90)),
		"p99_ms":        redondear(percentil(ordenados, 99)),
		"maximo_ms":     redondear(ordenados[len(ordenados)-1]),
	}
}

// LO QUE HAY QUE PUBLICAR PARA QUE UN NUMERO SIGNIFIQUE ALGO.
//
// Cuatro datos. Una comparativa a la que le falte uno no se puede reproducir, y
// lo que no se puede reproducir no es una medicion: es una anecdota.
func entorno(versionDelFramework string) map[string]any {
	return map[string]any{
		"publica":               []string{"runtime", "version_del_framework", "nucleos", "modo_de_compilacion"},
		"runtime":               runtime.Version(),
		"version_del_framework": versionDelFramework,
		"nucleos":               runtime.NumCPU(),
		"modo_de_compilacion":   "compilado a codigo maquina por `go run`, sin optimizaciones de enlazado",
		"aviso":                 "estos cuatro datos describen la maquina que ejecuta, no el framework: cambiarla cambia todos los numeros",
	}
}

// LO QUE SE PUEDE AFIRMAR SIN SABER EN QUE MAQUINA SE EJECUTA.
//
// `la_media_oculta_la_cola` es cierto en cualquier ordenador: siempre hay
// peticiones lentas y la media las esconde. Esa afirmacion si se puede meter en
// un contrato.
//
// «Este framework es un 30 % mas rapido que aquel» no, y por eso no esta aqui.
func comparar(n int) map[string]any {
	mal := medirMal(n)
	bien := medirBien(n)

	p99 := bien["p99_ms"].(float64)
	mediaBien := bien["media_ms"].(float64)

	return map[string]any{
		"mal_hecha":                        mal,
		"bien_hecha":                       bien,
		"la_media_oculta_la_cola":          p99 > mediaBien,
		"cuanto_la_oculta":                 fmt.Sprintf("p99 es %.1f× la media", p99/mediaBien),
		"el_calentamiento_cambia_el_numero": mal["media_ms"] != mediaBien,
		"mide_esta_maquina_no_el_framework": true,
		"lo_que_no_se_puede_afirmar":        "que un framework sea mas rapido que otro: eso exige la misma maquina, el mismo trabajo y la distribucion entera",
	}
}
