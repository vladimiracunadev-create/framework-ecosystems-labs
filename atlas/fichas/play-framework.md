# ▶️ Play Framework — 2007

> [⬅️ Atlas](../README.md) · [☕ Ecosistema JVM](../ecosistemas/jvm.md) · [🗂️ Índice](../frameworks.md)

Play rompió con dos costumbres muy arraigadas de la JVM de su época: **el ciclo
de compilar, empaquetar y desplegar** para ver un cambio, y **el estado de sesión
en el servidor**.

| | |
|---|---|
| **Aparición** | 2007, creado por Guillaume Bort |
| **Clasificación** | `web-framework` |
| **Ecosistema** | JVM (Scala, Java) |
| **Licencia** | `Apache-2.0` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://www.playframework.com/documentation/latest/Home> |

---

## 💡 Las dos rupturas

**Recarga en caliente.** Guardar un archivo y recargar el navegador: el cambio ya
está. Parece trivial hoy y en 2007 era extraordinario en la JVM, donde lo normal
era empaquetar y redesplegar. La razón por la que importa está en el
[módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md): **el ciclo de
retroalimentación determina cuántas veces al día alguien prueba algo**, y eso es
una propiedad del proceso, no una comodidad.

**Sin estado en el servidor.** Play guarda la sesión en una cookie firmada, no en
memoria del servidor. La consecuencia es que **cualquier instancia puede atender
cualquier petición** — que es exactamente lo que exige una plataforma de
ejecución con procesos efímeros [@twelve-factor], años antes de que eso fuera la
norma.

## 🌊 Modelo reactivo

Play se construyó sobre entrada/salida no bloqueante, con el mismo objetivo que
[Vert.x](vertx.md) y [Node.js](nodejs.md): no ocupar un hilo esperando. Y con la
misma trampa: **una operación bloqueante en el sitio equivocado degrada todo**.

## ⚖️ Por qué no dominó

**1. Scala tiene una curva pronunciada.** Play soporta Java, y su idioma natural
es Scala, cuyo sistema de tipos exige inversión de aprendizaje.

**2. Spring Boot recogió sus ideas.** Recarga en caliente, servidor incrustado y
modelo sin estado llegaron a Spring Boot en 2014, sin cambiar de lenguaje.

**3. Cambios entre versiones mayores.** Play modificó su API de forma
significativa entre versiones, lo que —como enseña la ficha de
[Ember](ember.md)— erosiona la confianza más que cualquier defecto técnico.

## 🎓 Las dos lecciones

**1. Sin estado en el servidor es una decisión de arquitectura, no de
rendimiento.** Determina si puedes escalar horizontalmente sin afinidad de
sesión, y por tanto qué plataformas puedes usar.

**2. Ser el primero no basta.** Play tuvo razón en casi todo y perdió frente a
quien llevó las mismas ideas al lenguaje mayoritario del ecosistema.

## 🔗 Enlaces

- Documentación oficial: <https://www.playframework.com/documentation/latest/Home>
- [Ficha de Spring Boot](spring-boot.md) · [Ficha de Vert.x](vertx.md)
- [Módulo 12](../../curriculum/12-producto-final.md)

## Fuentes

- [@twelve-factor] The Twelve-Factor App — <https://12factor.net/>
