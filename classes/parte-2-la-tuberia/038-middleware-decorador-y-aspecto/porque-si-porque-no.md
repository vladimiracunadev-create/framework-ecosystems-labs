# Por qué sí y por qué no — Middleware, decorador y aspecto

> [⬅️ Clase 038](README.md) · [📚 Parte 2](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | **Aspectos reales**: envuelven métodos, no peticiones | Funcionan por proxy: una llamada interna no pasa por él | Un mecanismo invisible que falla de forma desconcertante |
| [FastAPI](../../../atlas/fichas/fastapi.md) | El decorador es **sintaxis del lenguaje**: no hace falta tecnología aparte | Solo envuelve lo que decoras explícitamente | Sin selección por patrón: hay que ir función a función |
| [NestJS](../../../atlas/fichas/nestjs.md) | Interceptores con acceso a clase, método y resultado | Atados a la petición: no cubren lo que no viene por HTTP | Duplicar la lógica para tareas y colas |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | Filtros de punto final ligeros y componibles | Sin aspectos de serie | Otra pieza si necesitas envolver métodos |

## 🧭 La pregunta de una línea

**¿Lo que quieres envolver es una petición HTTP, o una operación?**

- **Una petición** → capa de transporte. Cabeceras, CORS, compresión,
  autenticación, cupos, plazos. Todo lo de la parte 2.
- **Una operación** → aspecto o decorador. Auditar un cobro, reintentar una
  llamada, cachear un cálculo, abrir una transacción.

La segunda categoría es la que se implementa mal con más frecuencia. Una
auditoría escrita como middleware **audita el HTTP**, no la operación: el mismo
cobro disparado por una tarea nocturna o por un consumidor de cola pasa sin
registro.

Y cuando alguien lo descubre, normalmente es porque falta media auditoría en un
informe.

## ⚠️ El precio de la magia

Un aspecto hace que **el código que se ejecuta no esté donde se lee**. El método
se comporta distinto de lo que dice su cuerpo, y el punto de llamada no da
ninguna pista.

Ousterhout lo señala como una forma de complejidad especialmente cara: la que
obliga a saber cosas que no están escritas donde miras
[@ousterhout-philosophy].

En Spring hay además una trampa concreta que conviene conocer antes de tropezar:
**una llamada desde dentro del mismo objeto no pasa por el proxy**, así que el
aspecto no se aplica. Es el mismo mecanismo por el que `@Transactional` y
`@Cacheable` fallan silenciosamente en llamadas internas — probablemente el
desconcierto más repetido del ecosistema Spring.

**Cuándo compensa:** cuando la preocupación es de verdad transversal —auditoría,
transacciones, reintentos, caché— y escribirla a mano en cada sitio garantiza que
alguien la olvide. Ahí el aspecto cambia un olvido silencioso por una indirección
documentada, y ese cambio sale a cuenta.

## Fuentes

- [@ousterhout-philosophy] Ousterhout, John. *A Philosophy of Software Design*. Yaknyam Press, 2018. ISBN 9781732102200 — <https://openlibrary.org/isbn/9781732102200>
