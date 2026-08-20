# ⚡ Eclipse Vert.x — 2012

> [⬅️ Atlas](../README.md) · [☕ Ecosistema JVM](../ecosistemas/jvm.md) · [🗂️ Índice](../frameworks.md)

Vert.x trajo a la JVM el **bucle de eventos** que Node.js había popularizado tres
años antes, con dos añadidos propios: es **políglota** —el mismo motor con varios
lenguajes de la JVM— y trae un **bus de mensajes** que atraviesa procesos y
nodos.

| | |
|---|---|
| **Aparición** | 2012, creado por Tim Fox |
| **Clasificación** | `reactive-toolkit` |
| **Ecosistema** | JVM (Java, Kotlin, Groovy, Scala) |
| **Licencia** | `Apache-2.0` |
| **Gobierno** | Eclipse Foundation |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://vertx.io/docs/> |

---

## 💡 Verticles y bus de mensajes

La unidad de despliegue es el *verticle*: una pieza de código que se ejecuta en
un bucle de eventos y **no comparte estado** con las demás. Se comunican por un
bus de mensajes:

```java
// Un verticle publica; otro escucha. No comparten memoria.
vertx.eventBus().publish("tareas.creada", json);
```

Esa combinación —aislamiento por paso de mensajes— es la misma idea que sostiene
la [BEAM](../ecosistemas/beam.md) y que [Phoenix](phoenix.md) aprovecha. La
diferencia es que aquí es una **biblioteca sobre la JVM**, no una propiedad de la
máquina virtual: el aislamiento es por convención, no garantizado.

Los patrones de integración por mensajería que Vert.x aplica están catalogados
desde hace dos décadas [@hohpe-woolf-eip], y reconocerlos ayuda: el bus de
eventos, la publicación y suscripción y el punto a punto no son inventos del
framework.

## ⚖️ La regla de oro y su trampa

**Nunca bloquear el bucle de eventos.** Una operación pesada en un hilo de bucle
detiene todo lo que ese hilo atendía — exactamente el mismo riesgo que
[Node.js](nodejs.md).

Vert.x ofrece hilos separados para trabajo bloqueante, y esa es la trampa: **es
fácil olvidarse**, y el síntoma —latencias que se disparan de golpe bajo carga—
aparece tarde y es difícil de atribuir. El
[módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md) lo cubre con
percentiles: el promedio no lo delata, el percentil 99 sí.

## 🧭 Cuándo encaja

**Encaja** cuando el servicio maneja muchísimas conexiones simultáneas con poco
cálculo por cada una: pasarelas, tiempo real, agregadores.

**No encaja** para el CRUD típico, donde el modelo de un hilo por petición es más
simple de escribir y de depurar, y el cuello de botella está en la base de datos.

## 🎓 Las dos lecciones

**1. El mismo modelo de concurrencia aparece en varias plataformas.** Bucle de
eventos en Node.js, en Vert.x y en la BEAM, con garantías distintas. Reconocer el
patrón y **preguntar por las garantías** es lo que enseña el módulo 00.

**2. La regla «no bloquear» es fácil de enunciar y de incumplir.** Cualquier
plataforma con bucle de eventos necesita una forma explícita de aislar el trabajo
pesado, y una prueba que lo verifique.

## 🔗 Enlaces

- Documentación oficial: <https://vertx.io/docs/>
- [Ficha de Node.js](nodejs.md) · [Ficha de Phoenix](phoenix.md)
- [Ecosistema JVM](../ecosistemas/jvm.md)

## Fuentes

- [@hohpe-woolf-eip] Hohpe, Gregor; Woolf, Bobby. *Enterprise Integration Patterns*. Addison-Wesley, 2003. ISBN 9780321200686 — <https://openlibrary.org/isbn/9780321200686>
