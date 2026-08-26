# Por qué sí y por qué no — Sondeo

> [⬅️ Clase 105](README.md) · [📚 Parte 8](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | La condición se lee entera en seis líneas | Su `etag` automático calcula del cuerpo: ahorra bytes y no ahorra trabajo | Escribirlo a mano si se quiere una marca barata |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Una `Response` explícita deja el 304 a la vista | El camino cómodo del framework siempre lleva cuerpo y 200 | Salirse del camino cómodo para decir «nada nuevo» |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | Lo trae incorporado: `checkNotModified` y un filtro | El filtro que calcula del cuerpo parece gratis y no lo es | Saber cuál de los dos mecanismos estás usando |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | Middleware de caché que entiende `ETag` de serie | `Results.Json` no sabe devolver una ausencia | Bajar al `HttpContext` para un caso de dos líneas |

## 🧭 Lo que este contrato no puede probar

- **El coste real de sondear a escala.** Cinco peticiones por cliente no dicen
  nada; mil clientes preguntando cada cinco segundos son doscientas peticiones
  por segundo, y ahí es donde se decide si el sondeo sirve.
- **El retraso percibido.** Se mide el intervalo, no lo que tarda una persona en
  ver el cambio, que depende también de la latencia y de si la pestaña está en
  segundo plano.
- **El sondeo largo.** Dejar la petición abierta hasta que haya novedad es un
  punto intermedio real entre esta clase y la 106, y no está implementado: su
  mecanismo —una respuesta que no termina— es el de la clase siguiente.
- **Qué pasa con el reloj.** `Last-Modified` tiene resolución de un segundo y dos
  cambios en el mismo segundo son indistinguibles. Por eso aquí la marca es una
  versión y no una fecha.

## 💡 Lo que hay que llevarse

Lo primero es un dato de encuadre para la parte entera: **el sondeo es casi
siempre suficiente**. No hay conexiones abiertas, no hay estado por cliente, no
hay que enseñarle nada al balanceador, y funciona igual detrás de cualquier
intermediario. Las tres clases siguientes son mejores en latencia y peores en
todo lo demás, y conviene llegar a ellas sabiendo qué se deja atrás.

Lo segundo es la técnica, que cabe en dos líneas y casi nadie usa: **una marca de
versión y un `if`**. Con eso, cinco de cada seis respuestas de este sondeo pasan
de treinta y tres bytes a cero. En un sondeo real, con cuerpos de kilobytes, la
proporción es la misma y el ahorro no.

Lo tercero es la distinción que separa un sondeo que escala de uno que no, y no
está en ninguna guía rápida: **de dónde sale la marca**.

- Si la marca se calcula **del cuerpo** —el `etag` automático de Express, el
  filtro de Spring— hay que generar el cuerpo para saber si cambió. Se ahorra la
  transferencia y no se ahorra la consulta.
- Si la marca es **barata** —un número de versión, una fecha de modificación de
  una columna— se puede saber que no hay novedad sin tocar los datos. Eso es lo
  que convierte doscientas peticiones por segundo en doscientas comprobaciones
  triviales.

Y lo cuarto, que es lo que hay que decir en voz alta antes de irse contento:
**el condicional no elimina la petición**. Cinco preguntas siguen siendo cinco
conexiones, cinco entradas en el registro y cinco veces la latencia de red. Lo
que se ahorra es el cuerpo. Quien necesite que el dato llegue en cien
milisegundos no va a llegar ahí sondeando, y ahí empieza la clase 106.

## Fuentes

- [@rfc9110] *RFC 9110 — HTTP Semantics*. IETF — <https://www.rfc-editor.org/rfc/rfc9110>
- [@rfc9111] *RFC 9111 — HTTP Caching*. IETF — <https://www.rfc-editor.org/rfc/rfc9111>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
