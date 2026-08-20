# Por qué sí y por qué no — Parámetros de consulta

> [⬅️ Clase 013](README.md) · [📚 Parte 1](../README.md)

Aquí la pregunta es una sola: **¿dónde vive la regla de validación?** En la firma
del manejador, en un esquema aparte, o repetida en cada `if`.

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Tipo, valor por omisión y límites en una línea; el manejador solo ve lo válido | Atado al modelo de tipos de Python y a Pydantic | Una anotación equivocada cambia el comportamiento en producción, no solo la documentación |
| [Fastify](../../../atlas/fichas/fastify.md) | El esquema vale a la vez para validar, convertir y documentar | Hay que escribir JSON Schema, más verboso que una firma | Dos sitios que leer: la ruta y su esquema |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | Restricciones declarativas y un ecosistema de validación maduro | Los códigos de error por omisión son incorrectos para una API | Sin manejador de excepciones, un error del cliente se reporta como 500 |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | Conversión por tipo con muy poco código | No distingue por sí solo ausente de inválido | Mirar la colección de consulta a mano cuando la distinción importa |
| [Express](../../../atlas/fichas/express.md) | Control total y ninguna magia | La regla se repite en cada manejador | El día que cambie el máximo, hay que buscarlo en todos los sitios |
| [Gin](../../../atlas/fichas/gin.md) | El lenguaje impide ignorar el error de conversión | Sin ayuda declarativa: todo a mano | Código repetido, con la ventaja de que no miente |
| [Django](../../../atlas/fichas/django.md) | La cadena de consulta llega cruda y sin sorpresas | Su validación real vive en formularios, que aquí no se usan | Montar el formulario para algo que parecía un `if` |
| [Flask](../../../atlas/fichas/flask.md) | Mínimo y transparente | `type=int` **devuelve el valor por omisión al fallar** | Un fallo silencioso que parece correcto en las pruebas manuales |
| [Laravel](../../../atlas/fichas/laravel.md) | `validate()` resuelve esto en una línea en un proyecto real | El casting de PHP convierte texto inválido en `0` | Comprobar antes de convertir, siempre |
| [Rails](../../../atlas/fichas/rails.md) | `params` cómodo y un `Integer(..., exception: false)` honesto | `to_i` —lo que la mayoría escribe— convierte `"abc"` en `0` | El camino corto es el incorrecto |

## 🧭 El patrón que se repite

Cuatro lenguajes de esta tabla —Python con Flask, PHP, Ruby y JavaScript—
convierten texto inválido en un número **sin avisar**. No es culpa de sus
frameworks, y es a través del framework donde te lo encuentras.

Go es el único donde no puede pasar, porque el error de conversión es un valor de
retorno que el compilador no deja ignorar. Es la misma propiedad que la
[ficha de Gin](../../../atlas/fichas/gin.md) describe como la razón de que los
frameworks de Go sean pequeños: **el lenguaje ya impide cosas que en otros hay que
vigilar**.

De ahí la regla práctica que vale para los diez: **comprueba antes de convertir**,
o usa un framework que convierta y valide en el mismo paso. Lo que no funciona es
convertir y confiar.

## Fuentes

- [@fowler-poeaa] Fowler, Martin. *Patterns of Enterprise Application Architecture*. Addison-Wesley, 2002. ISBN 9780321127426 — <https://openlibrary.org/isbn/9780321127426>
