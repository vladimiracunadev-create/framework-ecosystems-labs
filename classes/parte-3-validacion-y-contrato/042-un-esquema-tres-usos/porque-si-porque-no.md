# Por qué sí y por qué no — Un esquema, tres usos

> [⬅️ Clase 042](README.md) · [📚 Parte 3](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [FastAPI](../../../atlas/fichas/fastapi.md) | **Una declaración**: validación, tipos y documento salen de ella | Todo pasa por Pydantic, con su vocabulario y sus versiones | Aprender una biblioteca además del framework |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | springdoc **lee las anotaciones de validación**: el límite no se repite | Otra dependencia, y su versión hay que vigilarla | Una pieza más en el árbol |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | El generador viene **en la plataforma** desde .NET 9 | Menos maduro que las alternativas con años encima | Casos raros que aún no cubre |
| [NestJS](../../../atlas/fichas/nestjs.md) | Decoradores expresivos y un ecosistema ordenado | Dos vocabularios: el límite aparece dos veces | Repetir el número, aunque sea en la línea de al lado |

Y una quinta que declara el elenco y no está implementada aquí:
[Elysia](../../../atlas/fichas/elysia.md), que hace lo mismo que FastAPI en
TypeScript sobre Bun. Se deja fuera porque exigiría añadir otro runtime a la
integración continua para enseñar lo que las cuatro de arriba ya enseñan.

## 🧭 Lo que de verdad se está comprando

**Que la documentación no pueda mentir.**

No es comodidad. Un documento de API que miente es peor que no tener documento:
el cliente se fía, valida contra él, y descubre el desajuste con un 422 que su
código consideraba imposible. El fallo está en tu servidor y lo depura otro.

Los cuatro frameworks lo resuelven porque el documento **se deriva** de lo que
valida. El caso que no está en la tabla —escribir el documento a mano en un
archivo aparte— es el que produce la divergencia, y sigue siendo muy común.

## ⚠️ Y el límite, dicho sin rodeos

La declaración expresa **la forma**: tipo, longitud, rango, presencia. No expresa:

- reglas entre campos,
- reglas que necesitan consultar datos,
- reglas de negocio.

Es la misma frontera de la clase 039. Quien espere que el esquema valide su
dominio se lleva una decepción; quien lo use para la parte mecánica se ahorra la
mayor parte del trabajo repetitivo.

Geewax lo plantea igual al hablar de contratos de API: el esquema define la
superficie, y el comportamiento **hay que documentarlo aparte** porque no cabe en
él [@geewax-api-design-patterns].

## Fuentes

- [@geewax-api-design-patterns] Geewax, JJ. *API Design Patterns*. Manning, 2021. ISBN 9781617295850 — <https://openlibrary.org/isbn/9781617295850>
