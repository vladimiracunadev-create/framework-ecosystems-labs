# Por qué sí y por qué no — Qué hace tu framework con el socket

> [⬅️ Clase 025](README.md) · [📚 Parte 1](../README.md)

Esta clase no compara frameworks entre sí: compara **capas**. La pregunta es
cuánta pila quieres debajo de tu código.

| Capa | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| **Sin framework** ([Node.js](../../../atlas/fichas/nodejs.md)) | Transparencia total: no hay nada que no hayas escrito | Escala mal: veinte rutas son una cascada de `if` | Reescribir en cada proyecto lo que ya existe |
| [Gin](../../../atlas/fichas/gin.md) | Muy poco encima de un servidor que ya trae el lenguaje | Aporta poco más que enrutado y utilidades | Todo lo demás lo montas tú |
| [Express](../../../atlas/fichas/express.md) | Envuelve el servidor sin ocultarlo: puedes bajar a Node cuando haga falta | Sin opinión sobre nada más | Cada proyecto acaba con una combinación distinta |
| [FastAPI](../../../atlas/fichas/fastapi.md) | La frontera ASGI permite cambiar de servidor sin tocar la aplicación | Dos piezas que desplegar y un modelo asíncrono que entender | Una pieza más en la operación |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | Cinco capas que resuelven cinco problemas reales; artefacto de una pieza | Arranque más lento y más superficie que entender al depurar | Un fallo en una capa que no escribiste exige aprenderla |

## 🧭 Cuándo bajar una capa

**Casi nunca por rendimiento.** La diferencia entre Express y Node crudo es
despreciable frente a una consulta a base de datos mal hecha. Optimizar ahí es
mirar donde no está el problema — el error que la clase 137 desmonta con
mediciones.

**Sí por comprensión.** Escribir una vez el servidor sin framework cambia cómo
lees la documentación de cualquier framework: dejas de ver magia y ves capas.

**Sí por depuración.** Cuando algo falla en una capa intermedia, saber qué hay
debajo es la diferencia entre diagnosticar y probar cosas al azar. Es lo que
Feathers describe como la ventaja de tener un modelo del sistema antes de
tocarlo [@feathers-legacy-code].

## 🎓 Lo que cierra la parte 1

Las quince clases de esta parte demuestran una tesis del repositorio:

> **Los diez frameworks implementan el mismo estándar.** Sus diferencias están en
> los valores por omisión, en el reparto entre configuración y código, y en qué
> te dejan olvidar.

Ninguna de las quince clases necesitó una capacidad que un framework tuviera y
otro no. Lo que cambió siempre fue **cuánto había que escribir y qué se podía
olvidar sin aviso**.

Ese es el criterio con el que la parte 11 enseña a elegir: no «cuál puede», sino
**cuál hace fácil lo correcto para el equipo que va a mantenerlo**.

## Fuentes

- [@feathers-legacy-code] Feathers, Michael C. *Working Effectively with Legacy Code*. Prentice Hall, 2004. ISBN 9780131177055 — <https://openlibrary.org/isbn/9780131177055>
