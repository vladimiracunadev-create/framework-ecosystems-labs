# Por qué sí y por qué no — Eventos enviados por el servidor

> [⬅️ Clase 106](README.md) · [📚 Parte 8](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | El formato se lee entero: `res.write` y cuatro reglas | Nada le ayuda: latidos, reanudación y límites van a mano | Escribir el protocolo, aunque sean veinte líneas |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Un generador es exactamente lo que un flujo necesita | Cada conexión ocupa un trabajador de uvicorn | Dimensionar los trabajadores por conexiones, no por peticiones |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | Tres formas incorporadas, una de ellas pensada para escala | La más conocida —`SseEmitter`— gasta un hilo por cliente | Elegir bien entre servlets y WebFlux, y saber por qué |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | El modelo asíncrono no ocupa hilo mientras espera | Sin `FlushAsync` el flujo deja de serlo, y no avisa | Acordarse de vaciar el buffer en cada escritura |

## 🧭 Lo que este contrato no puede probar

- **Que el navegador reconecte.** `EventSource` reconecta solo y manda
  `Last-Event-ID`; aquí se comprueba que el servidor hace lo correcto con esa
  cabecera, no que el navegador la mande. Lo segundo está en el estándar y se ve
  en la clase 128.
- **El latido.** Un flujo real manda un comentario cada treinta segundos para que
  ningún intermediario lo dé por muerto. Aquí los flujos se cierran al acabarse
  los eventos, y está declarado en el código de los cuatro.
- **Cuántas conexiones aguanta cada uno.** La diferencia entre un hilo por cliente
  y un socket por cliente es la decisión más importante de esta clase, y medirla
  pide diez mil conexiones y una máquina que no sea la de nadie.
- **El proxy inverso.** El fallo clásico ocurre fuera de la aplicación. Las cuatro
  mandan la cabecera que lo evita en nginx; con otro intermediario, el nombre
  cambia.

## 💡 Lo que hay que llevarse

Lo primero, y es lo que decide entre esta clase y la siguiente: **esto no es un
protocolo nuevo**. Es una respuesta HTTP que no termina. Pasa por cualquier
proxy, la entiende cualquier balanceador, funciona con la autenticación que ya
tienes, se depura con `curl` y se prueba con el mismo verificador que el resto de
esta obra. Un WebSocket no hace nada de eso.

Lo segundo es el regalo que casi nadie usa: **la reanudación viene en el
estándar**. Poner `id:` en cada evento cuesta cinco caracteres, y a cambio el
navegador reconecta solo y dice por dónde iba. La clase 108 escribe exactamente
eso a mano para WebSocket y le hace falta una clase entera.

Lo tercero es dónde está el coste real, y no está en el protocolo: **está en el
modelo de servidor**. Mil conexiones abiertas son mil hilos en Spring con
servlets y mil sockets en los otros tres. Esa diferencia no aparece en el código
—las cuatro implementaciones se parecen mucho— y decide si esta tecnología te
sirve para cien clientes o para cien mil.

Y lo cuarto, que es de operación y se aprende caro: **el fallo clásico está fuera
de tu aplicación**. Un proxy inverso con buffer convierte un flujo en una
descarga, funciona perfectamente en tu máquina y falla en producción sin ningún
error en el registro. Las cuatro implementaciones mandan `X-Accel-Buffering: no`
por eso, y probarlo detrás del intermediario real antes de celebrar nada es la
única forma de no descubrirlo el día del estreno.

## Fuentes

- [@whatwg-html] *HTML Living Standard*. WHATWG — <https://html.spec.whatwg.org/>
- [@rfc9110] *RFC 9110 — HTTP Semantics*. IETF — <https://www.rfc-editor.org/rfc/rfc9110>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
