# Por qué sí y por qué no — El patrón middleware

> [⬅️ Clase 026](README.md) · [📚 Parte 2](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | El modelo de referencia: todo el mundo lo reconoce | Olvidar `siguiente()` cuelga la petición sin error | Un fallo silencioso que se manifiesta como lentitud |
| [Fastify](../../../atlas/fichas/fastify.md) | Ganchos por fase: **no hay `siguiente()` que olvidar** | Cortar la cadena es menos natural que en Express | Aprender qué ocurre en cada fase |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Un decorador y ya está | Las capas se apilan al revés de como se leen | Un orden contraintuitivo — clase 027 |
| [Flask](../../../atlas/fichas/flask.md) | Ganchos claros y sin ceremonia | `after_request` ya tiene la respuesta: no puede evitar el trabajo | Sirve para adornar, no para cortar |
| [Django](../../../atlas/fichas/django.md) | La fábrica separa la inicialización de la ejecución por petición | Forma inusual que confunde al principio | Entender por qué hay dos funciones |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | Filtros e interceptores: dos alturas para dos necesidades | Dos mecanismos que hay que saber distinguir | Elegir mal la altura y no enterarse |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | Cadena explícita y orden = orden de registro | `app.Run(manejador)` es terminal y corta el enrutado | Un error fácil: las rutas dejan de responder |
| [Laravel](../../../atlas/fichas/laravel.md) | Clases con nombre: reutilizables, inyectables, agrupables | No acepta funciones anónimas | Un archivo por capa, aunque sean tres líneas |
| [Rails](../../../atlas/fichas/rails.md) | Rack es el patrón en su forma más pura | Toda la pila de Rails es una pila de capas larga | Depurar exige conocer la pila entera |
| [Gin](../../../atlas/fichas/gin.md) | `Next()` en medio hace visible la ida y la vuelta | Sin ayuda ninguna: todo explícito | Repetición |

## 🧭 Cadena o ganchos: la decisión de fondo

Es el único eje donde estos diez se dividen de verdad, y merece explicarse.

**La cadena** —ocho de diez— da poder: la capa decide si continúa, puede
responder ella misma y puede envolver la ejecución para medirla o reintentarla.
Todo lo de la parte 2 depende de eso: terminación temprana, tiempos de espera,
límites, limitación de tasa.

**Los ganchos** —Fastify y Flask— quitan un error entero: no se puede olvidar
continuar porque no hay nada que continuar. A cambio, cortar el flujo es menos
natural y envolver la ejecución, imposible.

No hay ganador. Hay una pregunta: **¿tus capas necesitan decidir, o solo
observar?** Las que observan —registro, métricas, cabeceras— encajan bien con
ganchos. Las que deciden —autenticación, cupos, plazos— necesitan la cadena.

## ⚠️ El error que esta clase destapó al construirse

En ASP.NET Core, la implementación inicial usaba `app.Run(manejador)` para el
404. **Las rutas `/a` y `/b` dejaron de responder**: `Run` registra una capa
*terminal*, que corta la tubería antes de llegar al enrutado.

Lo correcto es `MapFallback`, que es una ruta comodín y se evalúa después de las
demás. Es un error fácil de cometer y difícil de diagnosticar, porque el síntoma
—todo devuelve 404— parece un problema de enrutado y es un problema de orden.

Y es la mejor ilustración posible de la lección de la clase siguiente: **en una
tubería, dónde pones algo importa tanto como qué pones**.

## Fuentes

- [@richards-ford-fundamentals] Richards, Mark; Ford, Neal. *Fundamentals of Software Architecture*. O'Reilly Media, 2020. ISBN 9781492043454 — <https://openlibrary.org/isbn/9781492043454>
