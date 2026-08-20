# Por qué sí y por qué no — Verbos HTTP y su semántica

> [⬅️ Clase 014](README.md) · [📚 Parte 1](../README.md)

Ningún framework de esta tabla te impide romper la semántica de un verbo. Lo que
cambia es **cuánto te ayuda a respetarla** y qué trae puesto de fábrica.

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | Un método por verbo, legible de un vistazo | No aporta nada sobre la semántica | La promesa de idempotencia depende solo de tu disciplina |
| [Fastify](../../../atlas/fichas/fastify.md) | Igual que Express, con esquema por verbo | Lo mismo | Igual |
| [FastAPI](../../../atlas/fichas/fastapi.md) | El cuerpo llega validado antes de tocar el estado | El estado global entre peticiones es cosa tuya | Ninguno relevante aquí |
| [Flask](../../../atlas/fichas/flask.md) | Decoradores por verbo, muy directo | Sin ayuda semántica | Igual que Express |
| [Django](../../../atlas/fichas/django.md) | Protege por omisión lo que cambia estado; el `405` es explícito | Despachar por método a mano es verboso | Un `if` por verbo, y desactivar la protección a conciencia |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | Una anotación por verbo y `405` automático | La protección real llega con Spring Security, otra pieza | Configuración aparte para algo que otros traen puesto |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | `MapPut`/`MapPost` explícitos y muy poco código | Protección antifalsificación no activa en API mínimas | Recordar activarla cuando hay formularios |
| [Laravel](../../../atlas/fichas/laravel.md) | Distingue grupos `web` y `api`: la decisión es explícita | Elegir mal el grupo da un 419 difícil de diagnosticar | Entender los dos grupos antes de escribir la primera ruta |
| [Rails](../../../atlas/fichas/rails.md) | Rutas de recurso que empujan a usar el verbo correcto | Protege por omisión y hay que desactivarlo para API | Una línea de exención, y saber qué exime |
| [Gin](../../../atlas/fichas/gin.md) | Explícito y rápido; el lenguaje obliga a proteger el estado compartido | Sin ayuda semántica ni protección incluida | Exclusión mutua a mano en cuanto hay estado |

## 🧭 Lo que esta clase deja claro

**La semántica no la garantiza el framework.** Puedes escribir un `PUT` que
acumule o un `GET` que borre en los diez. La promesa la haces tú y la creen el
navegador, la caché y el cliente que reintenta.

Por eso el contrato de esta clase **repite las llamadas y mira el estado
después**. Es la única forma de comprobar una promesa de comportamiento: no
preguntando al código, sino ejercitándolo. Es el mismo principio de las pruebas de
caracterización que Feathers propone para código heredado
[@feathers-legacy-code] — el comportamiento observado manda sobre la intención
declarada.

**Y hay un patrón que solo se ve comparando:** los tres frameworks completos
—Django, Rails, Laravel— traen la protección contra falsificación puesta, y los
micro no. Los tres nacieron sirviendo formularios de navegador, donde esa defensa
es obligatoria. Al construir una API con token hay que apagarla, y conviene saber
exactamente qué se apaga. La clase 072 lo desarrolla.

## Fuentes

- [@feathers-legacy-code] Feathers, Michael C. *Working Effectively with Legacy Code*. Prentice Hall, 2004. ISBN 9780131177055 — <https://openlibrary.org/isbn/9780131177055>
