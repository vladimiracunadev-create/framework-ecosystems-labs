# Por qué sí y por qué no — Estado de conexión con varias instancias

> [⬅️ Clase 109](README.md) · [📚 Parte 8](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | El reparto son diez líneas y se ven enteras | Ninguna ayuda: ni adaptador, ni canal, ni nada | Escribir y operar el reparto uno mismo |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Igual de explícito, y con `httpx` el aviso es una línea | Lo mismo: Starlette da el canal y se acabó | Lo mismo |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | Con STOMP y un intermediario, el reparto es configuración | Sin él, exactamente igual que los otros dos | Añadir una pieza de infraestructura |
| [Socket.IO](../../../atlas/fichas/socketio.md) | El adaptador resuelve esto sin tocar el código de la aplicación | Hace falta un Redis, o el equivalente, funcionando | Una dependencia de infraestructura más que operar |

## 🧭 Lo que este contrato no puede probar

- **Dos máquinas de verdad.** Las dos instancias comparten proceso. Lo que las
  separa —su estado en memoria— está separado de verdad, y el reparto va por
  HTTP; lo que falta es la red entre ellas, con su latencia y sus caídas.
- **El adaptador y el intermediario de mensajes.** Las dos respuestas de fábrica
  necesitan infraestructura que este laboratorio no levanta. Se nombran, se
  explica qué hacen y se escribe a mano lo que hacen por dentro.
- **La escala.** Que el reparto directo crezca al cuadrado es aritmética, no una
  medición: con dos instancias no se ve.
- **Un par caído.** El segundo límite del reparto directo —si una instancia no
  responde, su gente se pierde el mensaje— no está montado.

## 💡 Lo que hay que llevarse

Lo primero es reconocer el fallo por su forma, porque su forma es la peor de
todas: **no da ningún error**. Los dos servidores sanos, las conexiones abiertas,
los mensajes entregados… a quien está conectado al mismo sitio. En pruebas no se
reproduce nunca, porque en pruebas hay una instancia. Aparece el día que se
escala, y el síntoma que llega —«a veces no me llegan los avisos»— no apunta a
ninguna parte.

Lo segundo es la regla que lo detecta sin necesidad de reproducirlo: **si la
lista de conexiones es una variable, ya tienes este fallo**. Da igual que sea un
mapa, un conjunto o un registro de la biblioteca. Está en la memoria de un
proceso, y el segundo proceso no la ve.

Lo tercero es qué hacer, y hay dos caminos con nombre propio:

- **Repartir en directo**, instancia a instancia. Diez líneas, funciona, y tiene
  dos límites que hay que aceptar a sabiendas: crece al cuadrado con el número de
  instancias, y si un par está caído su gente se queda sin el mensaje.
- **Sacar el reparto fuera**, a un canal de mensajes. Es lo que hacen el
  adaptador de Socket.IO y el intermediario de STOMP, y lo que convierte esto en
  configuración en lugar de código.

Y lo cuarto, que es un error de razonamiento muy común: **un almacén compartido
de sesiones no resuelve esto**. Guardar en Redis quién está conectado no reparte
nada, porque la conexión física sigue viviendo en un proceso concreto. Lo que
hace falta no es saber dónde está la gente: es un canal por el que un proceso
pueda decirle algo a otro. Confundir las dos cosas cuesta un sprint.

## Fuentes

- [@socketio-docs] *Socket.IO — Documentación oficial* — <https://socket.io/docs/v4/>
- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
