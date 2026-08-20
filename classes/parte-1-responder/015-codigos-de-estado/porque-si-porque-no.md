# Por qué sí y por qué no — Códigos de estado

> [⬅️ Clase 015](README.md) · [📚 Parte 1](../README.md)

Aquí la comparación tiene una respuesta menos empatada que de costumbre: **dos
frameworks hacen imposible el error más frecuente y ocho no**.

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | `ResponseEntity.created(uri)` **exige** la URI; `noContent().build()` no admite cuerpo | Más ceremonia que un `return` directo | Verbosidad a cambio de que el error no compile |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | `Results.Created(ruta, valor)` pide la ruta como primer argumento | La familia `Results` hay que conocerla | Un rato de aprendizaje inicial |
| [Rails](../../../atlas/fichas/rails.md) | Códigos por nombre (`:created`) y `head` para respuestas sin cuerpo | El `Location` se pone a mano y se olvida | Disciplina, no tipos |
| [Gin](../../../atlas/fichas/gin.md) | Constantes de la biblioteca estándar: no se teclea el número | Ninguna ayuda con las cabeceras obligatorias | Todo explícito, también lo que se olvida |
| [Express](../../../atlas/fichas/express.md) | `.status().location().json()` se lee como una frase | Nada obliga a nada | El 201 sin `Location` no da ningún aviso |
| [Fastify](../../../atlas/fichas/fastify.md) | Igual que Express, con esquema de respuesta opcional | Igual | Igual |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Código y cabeceras en la misma llamada; documentación generada coherente | No fuerza la cabecera | Igual |
| [Laravel](../../../atlas/fichas/laravel.md) | `noContent()` garantiza el 204 vacío | El `Location` va suelto | Igual |
| [Flask](../../../atlas/fichas/flask.md) | La tupla `(cuerpo, código, cabeceras)` es compacta y clara | Cero comprobaciones | Igual |
| [Django](../../../atlas/fichas/django.md) | Respuesta explícita, sin capas | Cero comprobaciones | Igual |

## 🧭 Hacer que lo correcto sea lo fácil

La diferencia entre las dos primeras filas y las ocho restantes no es de potencia:
es de **diseño de interfaz**. `ResponseEntity.created(uri)` no permite emitir un
201 incompleto porque el método pide la URI. No hace falta recordarlo, ni
revisarlo en una revisión de código, ni escribir una prueba para ello.

Es lo que Ousterhout formula como esconder la complejidad detrás de interfaces que
no admiten mal uso [@ousterhout-philosophy], y lo que Norman llamaría diseñar las
posibilidades de acción para que la equivocación no esté disponible
[@norman-design-everyday-things].

**Dos matices honestos:**

**1. Esa protección tiene precio.** Spring es más verboso en todo, no solo aquí.
Quien elige Express está comprando brevedad, y la brevedad incluye poder
equivocarse. Es un intercambio, no un defecto.

**2. Lo que el framework no fuerza, lo fuerza el contrato.** Los ocho frameworks
sin protección pasan esta clase igual que los dos que la tienen, porque
[`contrato.json`](contrato.json) comprueba el `Location` explícitamente. Una
prueba ejecutable cubre lo que el tipo no cubre — y es la única defensa disponible
cuando el framework no ayuda.

## Fuentes

- [@ousterhout-philosophy] Ousterhout, John. *A Philosophy of Software Design*. Yaknyam Press, 2018. ISBN 9781732102200 — <https://openlibrary.org/isbn/9781732102200>
- [@norman-design-everyday-things] Norman, Don. *The Design of Everyday Things*, ed. revisada. Basic Books, 2013. ISBN 9780465050659 — <https://openlibrary.org/isbn/9780465050659>
