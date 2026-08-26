# Por qué sí y por qué no — Reintentos e idempotencia

> [⬅️ Clase 112](README.md) · [📚 Parte 8](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | La idempotencia son diez líneas y se leen enteras | Ni reintentos ni claves: todo a mano | Escribir la política de reintento uno mismo |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Igual de explícito, y `tenacity` cubre lo de reintentar | Nada en el framework para ninguna de las dos mitades | Elegir y mantener una dependencia más |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | `@Retryable` declara espera, tope y qué excepciones sí | La otra mitad, la que arregla el problema, no está | Recordar que la anotación no evita el duplicado |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | La biblioteca de resiliencia es la mejor caja del elenco | Lo mismo: cubre reintentar, no evitar el daño | Confundir una cosa con la otra, que es fácil |

## 🧭 Lo que este contrato no puede probar

- **Que la clave sobreviva a un reinicio.** Aquí vive en memoria, como todo lo de
  esta parte. En producción va en una tabla con índice único, y ese índice es lo
  que hace el trabajo cuando dos peticiones llegan a la vez.
- **La concurrencia.** Dos reintentos simultáneos con la misma clave son el caso
  interesante y el que decide si la implementación vale: aquí llegan en fila.
- **La caducidad.** Está declarada y explicada, y no se reproduce: haría falta
  esperar a que venza.
- **El cortacircuitos.** Reintentar tiene un hermano —dejar de intentarlo cuando
  está claro que no va— y es una clase de operación, no de esta parte.

## 💡 Lo que hay que llevarse

Lo primero es separar dos cosas que se nombran juntas y no lo son:

- **Reintentar bien** —espera creciente, tope, no repetir lo que no tiene
  arreglo— reparte el daño mejor. Menos avalancha, menos presión sobre lo que se
  acaba de caer.
- **Que reintentar no haga daño** es lo que arregla el problema. Si el cobro se
  duplica, se duplica igual con espera creciente que sin ella.

Los cuatro frameworks ayudan con lo primero y ninguno con lo segundo, y esta vez
**la ausencia está justificada**: la clave la tiene que poner quien pide, porque
solo él sabe si dos peticiones son el mismo intento. Un framework no puede
adivinarlo, y por eso la idempotencia es un acuerdo entre cliente y servidor y no
una función de biblioteca.

Lo segundo es cómo se implementa de verdad, porque la versión a medias es la
habitual: **hay que guardar la respuesta, no solo la clave**. Recordar «esta
clave ya pasó» y contestar 409 deja a quien reintenta sin el identificador del
cobro, que es justo lo que había ido a buscar. El reintento tiene que ser
indistinguible del original.

Lo tercero es la caducidad, otra vez —igual que en el cerrojo de la clase 111—:
sin ella la tabla de claves crece para siempre; con una demasiado corta, un
reintento tardío se cuela. Un día suele ser razonable. Lo que no vale es no
haberlo decidido.

Y lo cuarto, que es la pregunta que ahorra la mitad del trabajo y ya apareció en
la clase 111: **¿pasa algo si esto se repite?** Leer no hace daño. Recalcular un
agregado tampoco. Poner un campo a un valor concreto, tampoco —eso ya es
idempotente por naturaleza—. Lo que necesita protección es lo que **suma**:
cobrar, mandar, crear. Diseñar las escrituras para que pongan valores en lugar de
incrementarlos quita el problema de raíz, y es más barato que resolverlo.

## Fuentes

- [@rfc9110] *RFC 9110 — HTTP Semantics*. IETF — <https://www.rfc-editor.org/rfc/rfc9110>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
