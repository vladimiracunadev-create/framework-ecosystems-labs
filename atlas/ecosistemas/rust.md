# 🦀 Rust

> [⬅️ Atlas](../README.md) · [🗂️ Índice](../frameworks.md) · [🧭 Taxonomía](../../docs/TAXONOMY.md)

El único ecosistema donde **el compilador es parte del diseño del framework**. Lo
que en otros lenguajes se comprueba con pruebas o se descubre en producción, aquí
suele ser un error de compilación — y el precio se paga en curva de aprendizaje y
en tiempo de construcción.

## Por qué este ecosistema es como es

| Condición del lenguaje | Consecuencia en sus frameworks |
| --- | --- |
| **Propiedad y préstamos** comprobados en compilación | El estado compartido entre peticiones exige decirlo explícitamente; no hay fugas accidentales |
| **Sin runtime asíncrono** en la biblioteca estándar | El framework arrastra su ejecutor (Tokio, casi siempre): una decisión que se hereda |
| **Sin recolector de basura** | Latencias predecibles, sin pausas; a cambio, más trabajo de diseño |
| Sistema de **macros** potente | La ergonomía se compra con macros, y se paga en mensajes de error más difíciles |
| **Compilación lenta** | El ciclo de retroalimentación es más largo que en cualquier otro ecosistema del catálogo |

## Los dos caminos

**axum** se construye sobre las abstracciones de servicio de Tower, de modo que
su middleware es reutilizable fuera del framework: la misma pieza sirve para un
cliente HTTP o un servicio gRPC. Es la vía composicional.

**Rocket** prioriza la ergonomía con macros: las rutas se declaran con
anotaciones y el framework deduce mucho. Es la vía de la comodidad, y su coste
característico son mensajes de error del compilador más difíciles de leer cuando
algo no encaja.

**Actix Web** aparece con frecuencia en la cabeza de las mediciones públicas de
rendimiento. Es exactamente el tipo de afirmación que el
[módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md) obliga a
tratar con cuidado: un número sin protocolo declarado —versión, hardware, carga,
percentiles, repeticiones— no es evidencia, es una anécdota con cifras.

## Rust en el navegador

**Yew** y **Leptos** llevan a WebAssembly [@webassembly-org] los dos modelos de interfaz que
dominan JavaScript: componentes al estilo React el primero, reactividad de grano
fino el segundo. Verlos aquí demuestra que esas arquitecturas **no son propias de
JavaScript**: son ideas independientes del lenguaje, que es justo lo que enseña
el [módulo 03](../../curriculum/03-frontend-componentes-y-estado.md).

El compromiso, medible: el tamaño del artefacto WebAssembly frente al de un
paquete JavaScript equivalente, y el coste de cruzar la frontera hacia el DOM.

## Las 6 tecnologías

<!-- generado:tabla-ecosistema rust -->
| Tecnología | Clasificación | Desde | Era | Estado | Licencia | Documentación |
| --- | --- | ---: | --- | --- | --- | --- |
| [**Actix Web**](../fichas/actix-web.md) | `web-framework` | 2017 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://actix.rs/docs/) |
| [**axum**](../fichas/axum.md) | `web-framework` | 2021 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://docs.rs/axum/) |
| [**Rocket**](../fichas/rocket.md) | `web-framework` | 2016 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://rocket.rs/guide/) |
| [**Tauri**](../fichas/tauri.md) | `desktop-runtime` | 2022 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://v2.tauri.app/) |
| [**Yew**](../fichas/yew.md) | `ui-framework` | 2017 | 🟢 Vigente | 🟢 activo | `Apache-2.0` | [oficial](https://yew.rs/docs/getting-started/introduction) |
| [**Leptos**](../fichas/leptos.md) | `ui-framework` | 2022 | 🌊 Emergente | 🟢 activo | `MIT` | [oficial](https://book.leptos.dev/) |
<!-- fin -->

## Fuentes

- [@webassembly-org] *WebAssembly*, W3C — <https://webassembly.org/>

## Qué aportó cada una

<!-- generado:notas-ecosistema rust -->
- **Actix Web** — Uno de los frameworks HTTP más rápidos en las mediciones públicas. Buen recordatorio de que un número sin protocolo declarado no es evidencia.
- **axum** — Construido sobre las abstracciones de servicio de Tower, lo que hace su middleware reutilizable fuera del framework.
- **Rocket** — Prioriza la ergonomía mediante macros, a costa de depender más del compilador y de sus mensajes de error.
- **Tauri** — Usa el motor web del sistema en lugar de incrustar uno: binarios mucho menores, a cambio de diferencias entre plataformas.
- **Yew** — Modelo de componentes al estilo React sobre WebAssembly, el primero que llevó esa arquitectura fuera de JavaScript.
- **Leptos** — Reactividad de grano fino en Rust y WebAssembly, con funciones de servidor. La misma idea de SolidJS en otro lenguaje.
<!-- fin -->
