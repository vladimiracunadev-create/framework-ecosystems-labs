# 🦀 axum — 2021

> [⬅️ Atlas](../README.md) · [🦀 Ecosistema Rust](../ecosistemas/rust.md) · [🗂️ Índice](../frameworks.md)

axum se construye sobre **Tower**, una abstracción de servicio genérica, y esa
decisión tiene una consecuencia poco común: **su middleware es reutilizable fuera
del framework**.

| | |
|---|---|
| **Aparición** | 2021, del equipo de Tokio |
| **Clasificación** | `web-framework` |
| **Ecosistema** | Rust |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://docs.rs/axum/> |

---

## 💡 Servicio genérico en lugar de middleware propio

En casi todos los frameworks del Atlas, el middleware está atado a su framework:
uno de Express no funciona en Fastify. En axum, un middleware es un **servicio
Tower** —una función de petición a respuesta— y el mismo componente sirve para un
servidor HTTP, un cliente o un servicio gRPC.

| Componente Tower | Dónde vale |
| --- | --- |
| Tiempo de espera | Servidor, cliente, cualquier servicio |
| Reintento con espera creciente | Igual |
| Limitación de ritmo | Igual |
| Corte de circuito | Igual |

Los cuatro son exactamente los controles que el
[módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md) exige para que
una dependencia lenta no tumbe el servicio [@nygard-release-it]. Que sean piezas
componibles, y no características del framework, es una ventaja de diseño real.

Es el mismo tipo de acuerdo que los estándares PSR en PHP —ver la
[ficha de Slim](slim.md)— resuelto aquí con genéricos en lugar de con interfaces
acordadas.

## 🔬 Extractores: el compilador como validador

```rust
// El tipo del parámetro DECLARA de dónde sale el dato y qué forma tiene.
// Si no encaja, es un error de compilación, no de ejecución.
async fn crear(Json(entrada): Json<CrearTarea>) -> impl IntoResponse { /* ... */ }
```

Es la misma idea que la validación desde tipos de [FastAPI](fastapi.md), con una
diferencia importante: **aquí la comprueba el compilador**, no el runtime. El
coste es una curva de aprendizaje mayor y mensajes de error más largos
[@klabnik-nichols-rust].

## ⚖️ Lo que hay que declarar

**1. Arrastra un runtime asíncrono.** Rust no lo trae en su biblioteca estándar,
así que elegir axum es elegir Tokio. Es una decisión que se hereda y que conviene
escribir en el registro del
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md).

**2. El ciclo de retroalimentación es lento.** Compilar Rust cuesta, y eso afecta
a cuántas veces al día se prueba algo — con el efecto sobre el proceso que
describe la [ficha de Vite](vite.md).

## 🎓 Las dos lecciones

**1. Un middleware reutilizable fuera del framework reduce el coste de cambiar.**
Es estrategia de salida incorporada al diseño.

**2. Los cuatro controles de resiliencia son componibles.** Tiempo de espera,
reintento, límite y corte no son características de un framework: son piezas.

## 🔗 Enlaces

- Documentación oficial: <https://docs.rs/axum/>
- [Ficha de Actix Web](actix-web.md) · [Ficha de Rocket](rocket.md) · [Ficha de Slim](slim.md)
- [Módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md)

## Fuentes

- [@klabnik-nichols-rust] Klabnik, Steve; Nichols, Carol. *The Rust Programming Language*, 2.ª ed. No Starch Press, 2023. ISBN 9781718503106 — <https://openlibrary.org/isbn/9781718503106>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
