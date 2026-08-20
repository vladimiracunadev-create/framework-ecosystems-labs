# 🧡▲ SvelteKit — 2022

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

SvelteKit es el metaframework de [Svelte](svelte.md), con dos decisiones que
merecen atención: **adaptadores de despliegue intercambiables** y una apuesta
fuerte por los **estándares de la plataforma web**.

| | |
|---|---|
| **Aparición** | 2022 (versión 1.0) |
| **Clasificación** | `svelte-metaframework` |
| **Ecosistema** | JavaScript / TypeScript |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://svelte.dev/docs/kit> |

---

## 💡 Formularios que funcionan sin JavaScript

Es su decisión más interesante y la que conecta directamente con el
[módulo 03](../../curriculum/03-frontend-componentes-y-estado.md): las acciones de
formulario de SvelteKit **usan el formulario HTML de verdad**. Si el JavaScript
no ha cargado —o falla— el formulario se envía igualmente y el servidor responde.

Es mejora progresiva aplicada al núcleo del framework
[@mdn-progressive-enhancement], no como consejo opcional. Y responde a una
pregunta incómoda: **¿qué pasa con tu formulario si el guion no carga?** En la
mayoría de las aplicaciones de página única, la respuesta es «nada».

## 🔌 Adaptadores

Como [Nitro](nitro.md) en el ecosistema Vue, SvelteKit separa el destino de
despliegue del código de la aplicación. Cambiar de proveedor es cambiar un
adaptador — una estrategia de salida incorporada al diseño, en el sentido del
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md).

## ⚖️ Lo que hereda de Svelte

Todo lo bueno y todo lo caro: dependencia total del compilador, ecosistema menor,
y lo que se ejecuta no es lo que se escribió. Ver la
[ficha de Svelte](svelte.md) para el compromiso completo [@volkmann-svelte].

## 🎓 Las dos lecciones

**1. Apoyarse en los estándares de la plataforma produce sistemas más robustos.**
Un formulario que funciona sin JavaScript no es nostalgia: es tolerancia a fallos.

**2. Los adaptadores desacoplan la aplicación del proveedor.** Es la diferencia
práctica más relevante al comparar metaframeworks equivalentes.

## 🔗 Enlaces

- Documentación oficial: <https://svelte.dev/docs/kit>
- [Ficha de Svelte](svelte.md) · [Ficha de Nuxt](nuxt.md) · [Ficha de Next.js](nextjs.md)
- [Módulo 04](../../curriculum/04-fullstack-y-renderizado.md)

## Fuentes

- [@volkmann-svelte] Volkmann, Mark. *Svelte and Sapper in Action*. Manning Publications, 2020. ISBN 9781617297946 — <https://openlibrary.org/isbn/9781617297946>
- [@mdn-progressive-enhancement] *Progressive Enhancement*, Mozilla — <https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement>
