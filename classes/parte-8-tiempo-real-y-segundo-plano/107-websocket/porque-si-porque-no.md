# Por qué sí y por qué no — WebSocket

> [⬅️ Clase 107](README.md) · [📚 Parte 8](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | `ws` se engancha al servidor que ya hay: Express ni se entera | Nada más: difusión, salas y reconexión van a mano | Escribir lo que las capas de encima regalan |
| [FastAPI](../../../atlas/fichas/fastapi.md) | El decorador se parece al de una ruta y se lee igual | Una tarea ocupada mientras la conexión viva | Dimensionar por conexiones, no por peticiones |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | Es una pieza del framework: inyección y sesión en el apretón | Su camino cómodo —STOMP— es otra capa, no el protocolo | Elegir entre el protocolo y la capa, sabiendo cuál usas |
| [Socket.IO](../../../atlas/fichas/socketio.md) | Eventos con nombre, salas y reconexión de serie | El cliente tiene que ser Socket.IO, y punto | Interoperabilidad, a cambio de comodidad |

## 🧭 Lo que este contrato no puede probar

- **Nada de lo que pasa después del 101.** El verificador de esta obra habla
  HTTP, y a partir del apretón esto ya no lo es. Es la limitación más
  instructiva de la clase: **cualquier herramienta que tengas para HTTP deja de
  servirte**. Los casos 3, 4 y 5 los comprueba cada implementación abriendo
  clientes de verdad.
- **La autenticación.** Las cabeceras viajan una vez, en el apretón. Qué pasa
  cuando la sesión caduca con la conexión abierta es el problema más incómodo de
  esta tecnología y no está implementado aquí.
- **La escala.** Mil conexiones abiertas cuestan cosas muy distintas en un modelo
  de hilos y en uno asíncrono, y esta clase abre dos.
- **Lo que hace un intermediario.** Un proxy que no sepa de esto corta el
  apretón, y otro corta la conexión si no ve tráfico durante un minuto. Aquí no
  hay ninguno delante.

## 💡 Lo que hay que llevarse

Lo primero es la frase que hay que decir antes de elegir esto: **deja de ser
HTTP**. No es una pega retórica, es una lista concreta de cosas que dejan de
funcionar — las herramientas de línea de órdenes, los registros de acceso por
ruta, las cachés, la autenticación por cabecera en cada mensaje, los
intermediarios que no lo entienden, y el verificador de esta obra. Que el
contrato de esta clase no pueda abrir un WebSocket **es la demostración**, no un
defecto del contrato.

Lo segundo es lo que sí se puede comprobar desde fuera, y merece la pena saber
hacerlo: **el apretón de manos**. El servidor devuelve el SHA-1 de la clave del
cliente concatenada con una cadena fija del RFC, en base64. Sale igual en los
cuatro frameworks porque no es de ninguno, y con la clave de ejemplo del RFC la
respuesta es siempre `s3pPLMBiTxaQ9kYGzzhZRbK+xOo=`. Veinte líneas de socket TCP
y ya sabes si un servidor implementa el protocolo de verdad.

Lo tercero es la pregunta que hay que hacerse el primer día y casi nadie hace:
**¿dónde va a vivir la lista de conexiones?** Tres de los cuatro te la dejan a ti,
y lo natural es un conjunto en memoria. Funciona perfectamente con una instancia
y se rompe en silencio con dos: media sala deja de recibir la mitad de los
mensajes. Eso es la clase 109, y la respuesta correcta —un canal de mensajes por
fuera— hay que decidirla antes de tener cien mil líneas escritas alrededor.

Y lo cuarto, sobre las capas de encima. Socket.IO y STOMP regalan eventos con
nombre, salas y reconexión, que son cosas que **todo el mundo acaba
escribiendo**. Cobran interoperabilidad: el cliente tiene que hablar su idioma.
La decisión no es de gusto: depende de quién va a conectarse. Si es siempre un
navegador tuyo, la capa sale a cuenta. Si algún día va a ser un dispositivo, un
servicio en otro lenguaje o alguien con un `curl`, no.

## Fuentes

- [@rfc6455] *RFC 6455 — The WebSocket Protocol*. IETF — <https://www.rfc-editor.org/rfc/rfc6455>
- [@socketio-docs] *Socket.IO — Documentación oficial* — <https://socket.io/docs/v4/>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
