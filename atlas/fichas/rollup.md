# 🎞️ Rollup — 2015

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Rollup introdujo la **eliminación de código no usado** a partir de módulos
estáticos, una técnica que hoy se da por supuesta en cualquier herramienta de
construcción. Y es, además, el empaquetador que [Vite](vite.md) usa para
producción.

| | |
|---|---|
| **Aparición** | 2015, creado por Rich Harris |
| **Clasificación** | `build-tool` |
| **Ecosistema** | JavaScript |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://rollupjs.org/introduction/> |

---

## 💡 Por qué los módulos estáticos importan

La eliminación de código no usado **solo es posible si el sistema de módulos es
estático**: si las importaciones se pueden analizar sin ejecutar el programa.

```javascript
import { formatear } from "./util.js";   // estático: se sabe qué se usa
const util = require(nombreVariable);    // dinámico: no se puede saber
```

Con el primero, la herramienta puede demostrar que el resto de `util.js` no se
usa y no incluirlo. Con el segundo, no.

Es un buen ejemplo de una idea general: **una decisión de diseño del lenguaje
habilita optimizaciones que antes eran imposibles**. La misma observación aparece
en la [ficha de Svelte](svelte.md) con el compilador, y en la de
[Micronaut](micronaut.md) con la inyección en compilación.

## 🧭 Rollup y Vite

Vite usa Rollup para la construcción de producción y módulos nativos del
navegador en desarrollo — ver la [ficha de Vite](vite.md). Ese reparto explica
por qué Rollup sigue siendo relevante aunque poca gente lo use directamente:
**se convirtió en infraestructura de otros**.

Es el mismo patrón que [esbuild](esbuild.md), [Symfony](symfony.md) y
[Starlette](starlette.md): lo más influyente rara vez es lo más visible, y el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) pide mirar esas
dependencias que no se nombran.

## 🎓 Las dos lecciones

**1. Lo estático se puede analizar; lo dinámico, no.** Es la razón de que los
módulos del lenguaje permitan optimizaciones que el sistema anterior no permitía.

**2. Convertirse en infraestructura de otros es una forma de éxito.** Menos
visible que la adopción directa, y más difícil de sustituir.

## 🔗 Enlaces

- Documentación oficial: <https://rollupjs.org/introduction/>
- [Ficha de Vite](vite.md) · [Ficha de webpack](webpack.md) · [Ficha de esbuild](esbuild.md)
- [Ecosistema JavaScript](../ecosistemas/javascript.md)

## Fuentes

- [@tc39-ecma262] *ECMAScript Language Specification*, Ecma International — TC39 — <https://tc39.es/ecma262/>
