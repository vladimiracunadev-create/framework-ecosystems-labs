# 🔌 Socket.IO — 2010

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Socket.IO popularizó la comunicación bidireccional en tiempo real **antes de que
WebSocket fuera universal**, y su valor real no estaba en la API sino en lo que
resolvía por debajo: reconexión, respaldo de transporte y recuperación de
mensajes.

| | |
|---|---|
| **Aparición** | 2010, creado por Guillermo Rauch |
| **Clasificación** | `realtime-library` |
| **Ecosistema** | Node.js |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://socket.io/docs/v4/> |

---

## 💡 Lo difícil no es el WebSocket

Abrir un WebSocket es sencillo. Lo caro es todo lo demás, y Socket.IO lo trae
resuelto:

| Problema real | Qué hace |
| --- | --- |
| La conexión se cae | Reconexión automática con espera creciente |
| El entorno la bloquea | Respaldo a otro transporte |
| Se pierden mensajes en el corte | Almacenamiento temporal y reenvío |
| Varios servidores | Adaptadores para difundir entre instancias |
| Detectar una conexión muerta | Latido periódico |

Las filas primera y cuarta son las que más se subestiman. La reconexión con
espera creciente es uno de los controles de resiliencia del
[módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md), y sin él una
caída breve del servidor produce una avalancha de reconexiones simultáneas que
impide levantarlo.

Y la cuarta conecta con el
[módulo 12](../../curriculum/12-producto-final.md): **el estado de conexión no
está en tu proceso**, así que difundir a todos los usuarios exige coordinación
entre instancias. Es el mismo requisito operativo que impone
[Phoenix LiveView](phoenix-liveview.md), aquí resuelto con infraestructura
externa en lugar de con el runtime.

## ⚖️ Hoy

WebSocket está en todos los navegadores, así que la razón original —el respaldo de
transporte— pesa menos. Lo que sigue justificándolo es **todo lo demás**:
reconexión, salas, difusión y recuperación de mensajes, que hay que construir
igualmente.

## 🎓 Las dos lecciones

**1. El protocolo es la parte fácil.** Reconexión, pérdida de mensajes y
coordinación entre instancias son el trabajo real.

**2. Mantener estado de conexión cambia la operación.** Afinidad de sesión,
difusión coordinada y reinicios no transparentes son requisitos, no detalles.

## 🔗 Enlaces

- Documentación oficial: <https://socket.io/docs/v4/>
- [Ficha de Phoenix LiveView](phoenix-liveview.md) · [Ficha de Node.js](nodejs.md)
- [Módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md)

## Fuentes

- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
