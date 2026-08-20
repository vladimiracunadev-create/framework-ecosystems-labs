# 🚀 Rocket — 2016

> [⬅️ Atlas](../README.md) · [🦀 Ecosistema Rust](../ecosistemas/rust.md) · [🗂️ Índice](../frameworks.md)

Rocket apuesta por la **ergonomía**: escribir un servicio en Rust con la brevedad
de un framework de lenguaje dinámico. Lo consigue con macros, y esa decisión trae
un coste muy concreto que merece explicarse.

| | |
|---|---|
| **Aparición** | 2016, creado por Sergio Benitez |
| **Clasificación** | `web-framework` |
| **Ecosistema** | Rust |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://rocket.rs/guide/> |

---

## 💡 Rutas declarativas

```rust
#[post("/tasks", data = "<entrada>")]
fn crear(entrada: Json<CrearTarea>) -> Created<Json<Tarea>> { /* ... */ }
```

La anotación declara verbo, ruta y de dónde sale el cuerpo. Es la brevedad de
[Sinatra](sinatra.md) o [Flask](flask.md) en un lenguaje de tipos estáticos, y el
compilador comprueba que todo encaje.

## ⚖️ El coste de las macros

Una macro genera código antes de compilar. Cuando algo no encaja, **el error del
compilador se refiere al código generado**, no al que escribiste. En Rust, cuyos
mensajes de error son largos incluso en el caso simple, eso puede convertir un
fallo trivial en una sesión de investigación.

Es el mismo compromiso que el [módulo 02](../../curriculum/02-arquitectura-de-frameworks.md)
enuncia para las convenciones: **cuanto más implícito, mejor debe ser el
diagnóstico**. Las macros son magia en tiempo de compilación, y su diagnóstico
depende de cuánto esfuerzo ponga el proyecto en traducir el error de vuelta
[@klabnik-nichols-rust].

## 🧭 Las tres opciones de Rust, comparadas

| | Rocket | [axum](axum.md) | [Actix Web](actix-web.md) |
| --- | --- | --- | --- |
| Prioriza | Ergonomía | Composición | Rendimiento y madurez |
| Mecanismo | Macros | Genéricos y Tower | Actores y su propio middleware |
| Coste característico | Errores del compilador difíciles | Curva de genéricos | Middleware no reutilizable |

Ninguna gana: son tres puntos distintos del mismo eje entre comodidad y control,
que es el eje que recorre todo este Atlas.

## 🎓 Las dos lecciones

**1. La ergonomía se compra con generación de código, y se paga en diagnóstico.**
Vale la pena cuando el proyecto invierte en traducir bien los errores.

**2. Tres frameworks del mismo lenguaje pueden diferir en filosofía más que en
capacidad.** Comparar por funcionalidades aquí no distingue nada; comparar por
compromiso, sí.

## 🔗 Enlaces

- Documentación oficial: <https://rocket.rs/guide/>
- [Ficha de axum](axum.md) · [Ficha de Actix Web](actix-web.md)
- [Ecosistema Rust](../ecosistemas/rust.md)

## Fuentes

- [@klabnik-nichols-rust] Klabnik, Steve; Nichols, Carol. *The Rust Programming Language*, 2.ª ed. No Starch Press, 2023. ISBN 9781718503106 — <https://openlibrary.org/isbn/9781718503106>
