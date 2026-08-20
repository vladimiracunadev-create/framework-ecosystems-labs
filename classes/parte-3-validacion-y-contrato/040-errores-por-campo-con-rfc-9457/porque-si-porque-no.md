# Por qué sí y por qué no — Errores por campo

> [⬅️ Clase 040](README.md) · [📚 Parte 3](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Acumula solo, con la ruta completa del campo anidado | Sus mensajes vienen en inglés y con su vocabulario | Un diccionario que traduzca sus tipos a tus códigos |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | `getFieldErrors` da todos los campos que fallaron | Las anotaciones estándar **no tienen hueco para un código** | Una anotación propia, o codificarlo dentro del mensaje |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | `ProblemDetails` de fábrica y `Validator` que acumula | El código estable lo pones tú | Construir la lista a mano |
| [Express](../../../atlas/fichas/express.md) | Control total del formato, sin nada que traducir | Sin mecanismo: acumular es disciplina | El `return` en vez de `push` que informa de un solo error |

## 🧭 Lo que de verdad hay que decidir

**El vocabulario de códigos.** Es una decisión de producto, no de framework, y se
vive durante años:

- Pocos y genéricos —`INVALIDO`— es fácil de escribir y no le sirve al cliente.
- Muchos y específicos —`TITULO_DEMASIADO_LARGO`— sirve y se vuelve inmanejable.
- El punto medio que funciona: **códigos por tipo de fallo** —`REQUERIDO`,
  `LONGITUD`, `VALOR`, `FORMATO`, `TIPO`— combinados con el nombre del campo.

Con eso, `campo: "titulo"` + `codigo: "LONGITUD"` le dice al cliente exactamente
qué hacer, y el conjunto de códigos se queda en media docena.

Geewax lo plantea igual al hablar de errores de API: **el error es parte del
contrato y merece el mismo diseño que el éxito** [@geewax-api-design-patterns].

## 🔒 Y una advertencia de seguridad fácil de pasar por alto

El nombre del campo que devuelves **es el que ve el cliente**, y también el
atacante.

Devolver `usr_tbl_ttl` en lugar de `titulo` filtra el nombre de tu columna, y con
él una pista sobre el esquema de la base de datos. Es información de
reconocimiento gratis, del mismo tipo que la firma del servidor de la clase 035.

La regla: **los nombres de campo del error son los de tu API, no los de tu
almacenamiento**. Si coinciden, que sea porque lo decidiste.

## Fuentes

- [@geewax-api-design-patterns] Geewax, JJ. *API Design Patterns*. Manning, 2021. ISBN 9781617295850 — <https://openlibrary.org/isbn/9781617295850>
