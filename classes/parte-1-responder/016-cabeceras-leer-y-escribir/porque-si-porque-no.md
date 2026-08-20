# Por qué sí y por qué no — Cabeceras

> [⬅️ Clase 016](README.md) · [📚 Parte 1](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [FastAPI](../../../atlas/fichas/fastapi.md) | La cabecera entra por la firma, con su tipo y su valor por omisión | La conversión de guion bajo a guion medio sorprende al principio | Recordar la regla de nombres |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | `@RequestHeader` declara nombre, obligatoriedad y valor por omisión | Otra anotación más en una firma ya larga | Verbosidad |
| [Express](../../../atlas/fichas/express.md) | `get`/`set` directos y sin sorpresas | Sin ayuda declarativa | Un `??` por cada valor por omisión |
| [Fastify](../../../atlas/fichas/fastify.md) | Acceso crudo al diccionario, rápido | Igual que Express | Igual |
| [Flask](../../../atlas/fichas/flask.md) | `headers.get(nombre, omision)` en una línea | Nada declarativo | Igual |
| [Django](../../../atlas/fichas/django.md) | `peticion.headers` moderno y normalizado | El viejo `META` sigue por debajo y confunde | Dos formas de lo mismo en la documentación antigua |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | Colección tipada con atajos para las cabeceras conocidas | Hay que pedir el primer valor explícitamente | Un `FirstOrDefault()` de ruido |
| [Laravel](../../../atlas/fichas/laravel.md) | API cómoda y valores por omisión prudentes | **Reescribe `Cache-Control`** añadiendo `private` | Tu valor exacto no es el que sale |
| [Rails](../../../atlas/fichas/rails.md) | Añade cabeceras de seguridad razonables por su cuenta | Esas adiciones sorprenden si esperas control total | Comprobar lo que sale, no lo que pusiste |
| [Gin](../../../atlas/fichas/gin.md) | Directo y sin capas | Cadena vacía en lugar de ausencia | La distinción se pierde si no vas al mapa crudo |

## 🧭 La lección que vale para los diez

**Lo que tú pones no siempre es lo que sale.** Laravel añade `private`, Rails
añade cabeceras de seguridad, y cualquier intermediario del camino puede añadir
las suyas.

Eso tiene dos consecuencias prácticas:

1. **Verifica la respuesta, no el código.** El contrato de esta clase comprueba
   lo que llega por el cable, que es lo único que ve el cliente.
2. **Trata las cabeceras de lista como listas.** `Cache-Control`, `Vary`, `Allow`
   y `Accept` son conjuntos de directivas [@rfc9111]. Compararlas como cadenas
   produce fallos falsos, y un equipo que ve fallos falsos deja de mirar los
   rojos — el mecanismo de fatiga que Nygard describe al hablar de alertas
   [@nygard-release-it].

## Fuentes

- [@rfc9111] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Caching*, RFC 9111, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9111>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
