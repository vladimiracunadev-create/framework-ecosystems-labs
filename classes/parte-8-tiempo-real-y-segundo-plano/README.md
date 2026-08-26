# Parte 8 — Tiempo real y trabajo en segundo plano

> [⬅️ Parte 7](../parte-7-renderizado-y-fullstack/README.md) · [🎓 Todas las clases](../README.md) · [📖 Glosario](../../glosario/README.md) · [Parte 9 ➡️](../parte-9-movil-escritorio-y-sin-conexion/README.md)

**Cuando la respuesta no cabe en el ciclo petición-respuesta: empujar cambios y hacer trabajo fuera de la petición.**

**Clases 105 a 113** · 9 en total · 7 construidas · 5 tecnologías en juego.

## 🧭 De qué va esta parte

Hasta aquí, todo empezaba con una petición. Nueve clases sobre **lo que ocurre cuando no**.

Dos familias de problemas que se parecen y no lo son. **Tiempo real**: el servidor tiene algo que contar y hay que hacérselo llegar a un navegador — con sondeo, con eventos enviados por el servidor o con WebSocket, y cada opción cuesta distinto. Y **trabajo en segundo plano**: algo tiene que ocurrir, pero no ahora ni dentro de la petición.

Es la parte donde el despliegue deja de ser un detalle: casi todo lo de aquí funciona con una instancia y se rompe con dos. Mantener el estado de una conexión, ejecutar una tarea programada una sola vez o repartir mensajes entre procesos son problemas de arquitectura, no de framework.

## 🎒 Qué da por sabido

- Las partes 1 y 2, y la noción de idempotencia de la clase 047.
- Que hay más de una instancia del proceso, o que la habrá.

## 🎯 Qué sabrás hacer al terminarla

- Elegir entre sondeo, eventos enviados por el servidor y WebSocket con un criterio, no por costumbre.
- Reconectar sin perder mensajes, y saber qué hace falta guardar para poder reanudar.
- Sacar de la petición el trabajo que no tiene que ocurrir ahora, con reintentos y espera creciente.
- Hacer idempotente un trabajo que se va a reintentar, y explicar qué pasa si no lo es.
- Ejecutar una tarea programada una sola vez aunque haya diez instancias.
- Publicar un evento de dominio y entender qué se gana y qué se pierde al desacoplar.

## 🧵 Por qué en este orden

Las cuatro primeras son el canal: sondeo, eventos del servidor, WebSocket y qué pasa cuando se corta.

La quinta es la que rompe todo lo anterior al escalar: el estado de conexión con varias instancias.

Las cuatro últimas son el trabajo diferido: colas, tareas programadas, reintentos y eventos de dominio.

## 📚 Las clases

| # | Clase | Qué resuelve | Nivel | Estado |
| --- | --- | --- | --- | --- |
| [105](105-sondeo/README.md) | [Sondeo](105-sondeo/README.md) | Resolver el caso simple preguntando cada cierto tiempo. | 🟢 introductorio | ✅ Construida |
| [106](106-eventos-enviados-por-el-servidor/README.md) | [Eventos enviados por el servidor](106-eventos-enviados-por-el-servidor/README.md) | Empujar en una sola dirección con HTTP normal. | 🟡 intermedio | ✅ Construida |
| [107](107-websocket/README.md) | [WebSocket](107-websocket/README.md) | Abrir un canal bidireccional y usarlo bien. | 🟡 intermedio | ✅ Construida |
| [108](108-reconexion-y-mensajes-perdidos/README.md) | [Reconexión y mensajes perdidos](108-reconexion-y-mensajes-perdidos/README.md) | Sobrevivir a un corte sin perder ni duplicar. | 🔴 avanzado | ✅ Construida |
| [109](109-estado-de-conexion-con-varias-instancias/README.md) | [Estado de conexión con varias instancias](109-estado-de-conexion-con-varias-instancias/README.md) | Difundir a todos los usuarios cuando el servidor no es uno solo. | 🔴 avanzado | ✅ Construida |
| [110](110-colas-de-trabajo/README.md) | [Colas de trabajo](110-colas-de-trabajo/README.md) | Sacar de la petición lo que no tiene que ocurrir ahora. | 🟡 intermedio | ✅ Construida |
| [111](111-tareas-programadas/README.md) | [Tareas programadas](111-tareas-programadas/README.md) | Ejecutar trabajo por tiempo, sin que se duplique entre instancias. | 🟡 intermedio | ✅ Construida |
| [112](112-reintentos-e-idempotencia/README.md) | [Reintentos e idempotencia](112-reintentos-e-idempotencia/README.md) | Reintentar sin causar daño. | 🔴 avanzado | 🚧 Esqueleto |
| [113](113-eventos-de-dominio/README.md) | [Eventos de dominio](113-eventos-de-dominio/README.md) | Desacoplar lo que ocurrió de quién reacciona. | 🔴 avanzado | 🚧 Esqueleto |

## 🎬 Las tecnologías que aparecen

Entre paréntesis, en cuántas clases de esta parte interviene cada una. **Estar aquí no es una recomendación**: es que el problema de esa clase existe de verdad para esa tecnología.

| Ecosistema | Tecnologías |
| --- | --- |
| **Node.js** | [Express](../../atlas/fichas/express.md) (9), [Socket.IO](../../atlas/fichas/socketio.md) (3) |
| **Python** | [FastAPI](../../atlas/fichas/fastapi.md) (9) |
| **JVM** | [Spring Boot](../../atlas/fichas/spring-boot.md) (9) |
| **.NET** | [ASP.NET Core](../../atlas/fichas/aspnet-core.md) (6) |

## 📖 Las palabras que esta parte define

[**Sondeo**](../../glosario/README.md#sondeo) · [**Eventos enviados por el servidor**](../../glosario/README.md#eventos-enviados-por-el-servidor) · [**WebSocket**](../../glosario/README.md#websocket) · [**Cola de trabajo**](../../glosario/README.md#cola-de-trabajo) · [**Tarea programada**](../../glosario/README.md#tarea-programada) · [**Reintento**](../../glosario/README.md#reintento) · [**Evento de dominio**](../../glosario/README.md#evento-de-dominio)

Todas, con su definición, en el [glosario](../../glosario/README.md).

## ✅ Cómo se ejecuta una clase de esta parte

```bash
node scripts/run-class.mjs 105
```

El verificador arranca cada implementación, la somete a su `contrato.json` y **declara cuáles omitió** por no encontrar su cadena de herramientas. Si te faltan cadenas, `node scripts/doctor.mjs` dice cuáles y cómo se instalan.

## ➡️ Y después

La parte 9 sale del navegador: la misma aplicación en un móvil, en un escritorio y sin conexión.
