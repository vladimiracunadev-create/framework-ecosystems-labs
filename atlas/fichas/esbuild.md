# ⚡🔨 esbuild — 2020

> [⬅️ Atlas](../README.md) · [🐹 Ecosistema Go](../ecosistemas/go.md) · [🗂️ Índice](../frameworks.md)

esbuild demostró algo incómodo para el ecosistema JavaScript: **el cuello de
botella de sus herramientas no era la tarea, era el lenguaje en que estaban
escritas**. Al reimplementar un empaquetador en Go, los tiempos cayeron en órdenes
de magnitud.

| | |
|---|---|
| **Aparición** | 2020, creado por Evan Wallace |
| **Clasificación** | `build-tool` |
| **Ecosistema** | Go (para proyectos JavaScript) |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://esbuild.github.io/> |

---

## 💡 Por qué fue tan rápido

Tres decisiones, ninguna mágica:

| Decisión | Efecto |
| --- | --- |
| **Escrito en Go**, compilado a nativo | Sin arranque de un intérprete, sin recolección de basura frecuente |
| **Paralelismo real** | Aprovecha todos los núcleos; el modelo de un hilo de Node.js no |
| **Menos pasadas sobre el código** | El diseño evita recorrer el árbol muchas veces |
| **Alcance deliberadamente limitado** | No intenta cubrir todos los casos de webpack |

La cuarta es la que suele omitirse y explica buena parte de la diferencia: **hacer
menos cosas es más rápido**. Comparar esbuild con webpack sin declarar esa
diferencia de alcance sería exactamente el error que el
[módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md) persigue.

## 🧭 Lo que cambió en el ecosistema

esbuild no ganó como herramienta de uso directo: **ganó como pieza interna**.
[Vite](vite.md) lo usa para transformar dependencias; otras herramientas lo
incorporan para partes concretas de su trabajo.

Ese destino —convertirse en infraestructura de otros— es un patrón que el Atlas
repite: [Symfony](symfony.md) en PHP, [Starlette](starlette.md) bajo FastAPI,
Rollup dentro de Vite. **Lo más influyente rara vez es lo más visible**, y el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) pide mirar esas
dependencias que no se nombran.

## 🎓 Las dos lecciones

**1. El lenguaje de una herramienta es una decisión de arquitectura.** Determina
su techo de rendimiento y su modelo de paralelismo.

**2. Limitar el alcance es una técnica de rendimiento legítima** — y hay que
declararla al comparar, o la comparación no significa nada.

## 🔗 Enlaces

- Documentación oficial: <https://esbuild.github.io/>
- [Ficha de Vite](vite.md) — quien lo usa dentro · [Ficha de webpack](webpack.md)
- [Ecosistema Go](../ecosistemas/go.md)

## Fuentes

- [@wagner-web-performance] Wagner, Jeremy. *Web Performance in Action*. Manning Publications, 2016. ISBN 9781638353768 — <https://openlibrary.org/isbn/9781638353768>
- [@vite-why] *Why Vite*, Vite — <https://vite.dev/guide/why>
