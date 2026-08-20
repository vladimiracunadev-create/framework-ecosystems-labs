# 🟣 Ktor — 2018

> [⬅️ Atlas](../README.md) · [☕ Ecosistema JVM](../ecosistemas/jvm.md) · [🗂️ Índice](../frameworks.md)

Ktor es la respuesta de Kotlin a la pregunta «¿y si un framework de la JVM no
trajera nada por omisión?». Todo comportamiento —enrutado, serialización,
autenticación, registro— se **instala explícitamente** como plugin.

Es la filosofía opuesta a la autoconfiguración de [Spring Boot](spring-boot.md),
en la misma máquina virtual.

| | |
|---|---|
| **Aparición** | 2018, desarrollado por JetBrains |
| **Clasificación** | `web-framework` |
| **Ecosistema** | JVM (Kotlin) |
| **Licencia** | `Apache-2.0` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://ktor.io/docs/> |

---

## 💡 Todo explícito, todo instalado

```kotlin
fun Application.module() {
    install(ContentNegotiation) { json() }   // sin esto, no hay JSON
    install(CallLogging)                     // sin esto, no hay registro
    routing {
        post("/tasks") { /* ... */ }
    }
}
```

Leer el arranque de una aplicación Ktor **dice exactamente qué hace**. No hay
comportamiento que aparezca porque una biblioteca esté en el classpath. Para el
[módulo 02](../../curriculum/02-arquitectura-de-frameworks.md), es el extremo
explícito del eje convención/configuración.

El precio es el de siempre en ese extremo, y es el mismo que enseña el
[laboratorio 02](../../labs/02-express-api/README.md) con Express: **se falla por
omisión**. Nada te recuerda que falta el límite de tamaño o las cabeceras de
seguridad.

## 🧵 Corrutinas: concurrencia sin bloquear

Ktor se apoya en las corrutinas de Kotlin, que permiten escribir código asíncrono
con forma secuencial:

```kotlin
val tarea = repositorio.buscar(id)   // no bloquea el hilo, y se lee como si lo hiciera
```

Es el mismo objetivo que persigue el bucle de eventos de [Node.js](nodejs.md)
—no ocupar un hilo esperando— resuelto por el lenguaje en lugar de por el
runtime. Comparar ambos modelos es un buen ejercicio del
[módulo 00](../../curriculum/00-taxonomia-y-diagnostico.md): el lenguaje y el
runtime deciden qué puede hacer el framework.

## ⚖️ Cuándo encaja

**Encaja** en servicios y API donde el equipo ya escribe Kotlin, valora el
control explícito y no necesita el ecosistema de Spring.

**No encaja** cuando se busca que el framework decida por ti, o cuando hace falta
la enorme superficie de integraciones que Spring trae resuelta.

## 🎓 Las dos lecciones

**1. Explícito y minimalista no son lo mismo que «biblioteca».** Ktor posee el
ciclo de la petición: es un framework, con poca superficie.

**2. El lenguaje decide qué modelo de concurrencia es natural.** Las corrutinas
hacen posible una API que en Java puro sería mucho más ruidosa.

## 🔗 Enlaces

- Documentación oficial: <https://ktor.io/docs/>
- [Ficha de Spring Boot](spring-boot.md) — el extremo opuesto · [Ficha de Express](express.md)
- [Ecosistema JVM](../ecosistemas/jvm.md)

## Fuentes

- [@casciaro-node-patterns] Casciaro, Mario; Mammino, Luciano. *Node.js Design Patterns*, 3.ª ed. Packt Publishing, 2020. ISBN 9781839214110 — <https://openlibrary.org/isbn/9781839214110>
