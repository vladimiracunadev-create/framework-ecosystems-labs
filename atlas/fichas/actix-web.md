# 🎭 Actix Web — 2017

> [⬅️ Atlas](../README.md) · [🦀 Ecosistema Rust](../ecosistemas/rust.md) · [🗂️ Índice](../frameworks.md)

Actix Web aparece con frecuencia en la cabeza de las mediciones públicas de
rendimiento de frameworks web. Está en el Atlas precisamente por eso: es la
ocasión de explicar **por qué ese dato, tal como suele presentarse, no sirve para
decidir**.

| | |
|---|---|
| **Aparición** | 2017 |
| **Clasificación** | `web-framework` |
| **Ecosistema** | Rust |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://actix.rs/docs/> |

---

## 📊 «El más rápido» y por qué no basta

Las comparativas públicas miden un escenario concreto —a menudo devolver una
cadena o una consulta trivial— en un entorno concreto. El
[módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md) exige siete
puntos antes de aceptar un número como evidencia:

| Punto del protocolo | Lo que suele faltar en la comparativa |
| --- | --- |
| Versiones exactas | A veces |
| Modo producción en ambos | Casi siempre presente |
| Hardware o instancia | A veces |
| Estado de la caché | Rara vez |
| Forma y duración de la carga | A veces |
| **Percentiles, no promedio** | **Frecuentemente ausente** |
| Repeticiones y variación | **Casi siempre ausente** |

Y falta la pregunta previa, que es la decisiva: **¿qué fracción de la latencia de
tu servicio real es el framework?** En la mayoría de las aplicaciones el tiempo
se va en la base de datos, en la red y en la serialización. Cambiar un framework
por otro un 20 % más rápido en un escenario sintético puede no mover nada
[@gregg-systems-performance].

Nada de esto es una crítica a Actix Web, que es excelente. Es una crítica a
**cómo se usa su cifra** para decidir.

## 💡 Qué aporta de verdad

Rendimiento muy alto y estable, una API madura y un ecosistema propio de
extensiones. Y las garantías del lenguaje: el compilador impide compartir estado
mutable entre peticiones sin decirlo explícitamente, lo que elimina de raíz la
clase de fallo que el [módulo 02](../../curriculum/02-arquitectura-de-frameworks.md)
describe al hablar de alcances — el objeto compartido que filtra datos de un
usuario a otro [@blandy-programming-rust].

## 🧭 Actix Web frente a axum

| | Actix Web | [axum](axum.md) |
| --- | --- | --- |
| Middleware | Propio del framework | Servicios Tower, reutilizables fuera |
| Madurez | Más recorrido | Más reciente, del equipo del runtime |
| Rendimiento | Muy alto | Muy alto |

La diferencia práctica no está en la velocidad: está en **si el middleware que
escribas sirve fuera del framework**.

## 🎓 Las dos lecciones

**1. Un número sin protocolo no es evidencia.** Es la regla del módulo 08 y aquí
tiene su caso más citado.

**2. Optimizar sin medir dónde está el tiempo es cambiar de sitio el problema.**
La primera pregunta es qué fracción del total es el framework.

## 🔗 Enlaces

- Documentación oficial: <https://actix.rs/docs/>
- [Ficha de axum](axum.md) · [Ecosistema Rust](../ecosistemas/rust.md)
- [Módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md)

## Fuentes

- [@gregg-systems-performance] Gregg, Brendan. *Systems Performance*, 2.ª ed. Pearson, 2020. ISBN 9780136820154 — <https://openlibrary.org/isbn/9780136820154>
- [@blandy-programming-rust] Blandy, Jim; Orendorff, Jason. *Programming Rust*, 2.ª ed. O'Reilly Media, 2021. ISBN 9781492052593 — <https://openlibrary.org/isbn/9781492052593>
