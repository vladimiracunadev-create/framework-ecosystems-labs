# Por qué sí y por qué no — Esquemas

> [⬅️ Clase 041](README.md) · [📚 Parte 3](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [FastAPI](../../../atlas/fichas/fastapi.md) | El esquema **se deriva del modelo**: una sola declaración, imposible que diverja | Atado a Pydantic y a su vocabulario | Aprender una biblioteca además del framework |
| [Fastify](../../../atlas/fichas/fastify.md) | El esquema **es** la validación, y además acelera la serialización | JSON Schema a mano es verboso | Escribir más para declarar lo mismo |
| [Express](../../../atlas/fichas/express.md) | Libertad para elegir biblioteca, o escribir el intérprete | Nada incluido | Una dependencia y su vocabulario |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | El tipo anotado sirve de contrato dentro del código | El esquema publicado es **otra fuente de verdad** | Dos cosas que sincronizar a mano |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | Igual: tipos y atributos expresivos | Igual | Igual |

## 🧭 Una fuente de verdad, o dos

Es la única pregunta que decide aquí.

**Una** —FastAPI, Fastify— significa que el esquema publicado **no puede mentir**:
es el mismo objeto que valida. Cambias la regla y la documentación cambia con
ella, sin que nadie tenga que acordarse.

**Dos** —Spring, ASP.NET— significa que hay un tipo y un esquema, y que se
mantienen sincronizados por disciplina. Funciona mientras alguien lo revise, y
falla en silencio: el esquema publicado sigue siendo válido, solo que ya no
describe lo que el servidor acepta.

Ese fallo es especialmente caro porque **el cliente confía en el esquema**. Si
dice que `prioridad` acepta de 1 a 5 y el servidor solo acepta 1 a 3, el cliente
envía datos que valida correctamente y el servidor rechaza.

Existen bibliotecas que derivan el esquema del tipo en las dos plataformas.
Usarlas convierte la fila de abajo en la de arriba, y es la recomendación.

## 🔒 La opción que ninguno trae puesta

**Rechazar campos desconocidos.** Los cuatro los ignoran por omisión.

Es tolerancia deliberada —permite que un cliente antiguo envíe campos que ya no
existen sin romperse— y tiene dos costes:

1. **Un error tipográfico del cliente no se detecta.** El campo se pierde y el
   fallo aparece mucho después, lejos de su causa.
2. **Asignación masiva.** Un campo extra que viaja hasta la base de datos sin
   filtrar es una vía conocida de escalada de privilegios [@owasp-top10].

La regla práctica: **rechaza lo desconocido en la entrada, tolera lo desconocido
en la salida**. Es el principio de robustez aplicado con criterio — ser estricto
con lo que recibes protege; ser estricto con lo que otros te devuelven rompe
integraciones sin necesidad.

## Fuentes

- [@owasp-top10] *OWASP Top 10*, OWASP Foundation — <https://owasp.org/www-project-top-ten/>
