# Por qué sí y por qué no — Limitación de tasa

> [⬅️ Clase 034](README.md) · [📚 Parte 2](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | **En la biblioteca estándar**: cuatro algoritmos y particionado por clave | El estado sigue siendo por proceso | Un almacén compartido para que el cupo sea real |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | Con Spring Cloud Gateway o Resilience4j hay soluciones maduras | Nada incorporado en Spring Boot a secas | Otra dependencia y su configuración |
| [Express](../../../atlas/fichas/express.md) | Bibliotecas conocidas con adaptadores a almacenes externos | Nada incorporado | Elegir biblioteca y almacén |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Fácil de escribir a mano; muy claro qué hace | Nada incorporado | Escribirlo y mantenerlo |

## 🧭 El problema no es el framework

**Es dónde vive el estado.** Los cuatro resuelven bien la parte de decidir; ninguno
resuelve la de compartir esa decisión entre instancias.

Con dos procesos y un cupo de 100, el cliente obtiene 200. Con diez, 1000. El
código parece correcto, las pruebas pasan, y el límite no limita.

Las tres respuestas reales:

1. **Almacén compartido** —un servidor de estructuras en memoria— con contadores
   atómicos. Funciona, y añade una dependencia en el camino de cada petición.
2. **En el servidor de entrada.** Un solo punto ve todo el tráfico y decide.
   Suele ser la mejor opción, y saca la lógica de tu código.
3. **Cupo dividido entre instancias.** Cada una limita a `cupo / N`. Barato,
   impreciso, y se desajusta al escalar.

## 💡 Dónde ponerlo, en serio

**Si tienes un servidor de entrada o una pasarela, ponlo ahí.** Ve todo el
tráfico, no consume recursos de tu aplicación, y rechaza antes de que la petición
llegue siquiera a tu proceso.

Deja en la aplicación los límites que **dependen de lógica de negocio**: cupos por
plan contratado, por usuario, por operación cara. Esos no los puede saber una
pasarela.

Es el mismo criterio que la clase 020 aplicaba a los estáticos y la 023 a la
compresión: **hay trabajo que está mejor fuera**, y reconocerlo forma parte de
diseñar el sistema y no solo el servicio.

## ⚠️ Y la trampa de la clave

Detrás de un servidor de entrada, **todas las peticiones parecen venir de la misma
IP**. Un limitador por IP mal configurado corta a todo el mundo en cuanto un
cliente se pasa.

La corrección es leer la cabecera que identifica al cliente original — y
**validarla**, porque el cliente puede ponerla. Aceptar `X-Forwarded-For` sin
comprobar de qué proxy viene convierte tu limitador en un adorno: basta con
enviar una IP distinta cada vez.

## Fuentes

- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
