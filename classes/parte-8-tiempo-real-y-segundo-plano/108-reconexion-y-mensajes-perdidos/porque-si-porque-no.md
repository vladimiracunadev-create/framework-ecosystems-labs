# Por qué sí y por qué no — Reconexión y mensajes perdidos

> [⬅️ Clase 108](README.md) · [📚 Parte 8](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | Las veinte líneas están a la vista y se entienden | Ni reconexión ni historial: las dos cosas a mano | Escribir —y probar— un cliente que reintente bien |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Igual de explícito, y con `query_params` la reanudación son cuatro líneas | Lo mismo: Starlette da el canal y se acabó | Lo mismo |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | STOMP con un intermediario de mensajes convierte esto en configuración | Sin él, exactamente igual que los otros dos | Añadir una pieza de infraestructura a la arquitectura |
| [Socket.IO](../../../atlas/fichas/socketio.md) | Reconecta solo, con espera creciente, fluctuación y tope | Y por eso perder mensajes deja de dar error | Un fallo silencioso, que es el peor tipo de fallo |

## 🧭 Lo que este contrato no puede probar

- **Una desconexión real.** Aquí el corte lo provoca el propio proceso cerrando
  el socket. Un móvil que cambia de antena tarda segundos en enterarse de que la
  conexión murió, y ese tiempo —el de detección— es la mitad del problema en
  producción.
- **La fluctuación.** Las esperas de esta clase son deterministas a propósito,
  para que el contrato las pueda exigir. Un cliente serio les suma un azar, y eso
  no se puede verificar con una comparación de igualdad.
- **La avalancha.** Lo que pasa cuando mil clientes reconectan a la vez es el
  motivo de todo esto y hace falta un banco de pruebas para verlo.
- **El límite del historial.** Aquí cabe todo. La pregunta interesante —qué pasa
  cuando la desconexión dura más de lo que guarda el servidor— no está montada.

## 💡 Lo que hay que llevarse

Lo primero es la distinción, porque casi todo el mundo la salta: **son dos
problemas**. Volver a conectar y no perderse nada. El primero es de red y se
resuelve con una política de reintento. El segundo es de datos y se resuelve con
números de orden y un historial. Resolver el primero y creer que ya está es
exactamente lo que produce el fallo más difícil de diagnosticar de esta parte.

Lo segundo es por qué ese fallo es tan difícil: **no da ningún error**. La
conexión vuelve, la interfaz se pone viva, no hay nada rojo en ninguna consola —y
faltan los mensajes de en medio. Con reconexión automática, como la de Socket.IO,
el síntoma desaparece del todo y solo queda la consecuencia: un dato que nadie vio
pasar. Una biblioteca que resuelve la mitad fácil hace más difícil notar que
falta la otra.

Lo tercero es una comparación que ordena la parte entera. Todo lo que esta clase
escribe a mano —números de orden, «por dónde iba», reintento— **la clase 106 lo
traía de serie**: `Last-Event-ID` es exactamente eso, puesto por el navegador sin
que nadie lo programe. Si la aplicación no necesita mandar cosas hacia el
servidor por el mismo canal, aquí hay una clase entera de trabajo que se ahorra.
Esa es la comparación honesta entre las dos tecnologías, y no la latencia.

Y lo cuarto, la decisión que nadie toma y hay que tomar: **cuánto hacia atrás se
puede reanudar**. Un número de mensajes, o una ventana de tiempo. Si no se decide,
el sistema tiene igualmente un límite —lo que quepa en memoria— y ese límite
cambia con la carga, que es la peor forma posible de tenerlo.

## Fuentes

- [@rfc6455] *RFC 6455 — The WebSocket Protocol*. IETF — <https://www.rfc-editor.org/rfc/rfc6455>
- [@socketio-docs] *Socket.IO — Documentación oficial* — <https://socket.io/docs/v4/>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
