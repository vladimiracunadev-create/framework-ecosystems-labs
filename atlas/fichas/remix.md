# 💿 Remix — 2021

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Remix apostó por **los estándares de la plataforma web** —formularios,
respuestas, caché HTTP— frente a abstracciones propias, en un momento en que el
ecosistema iba en dirección contraria. Su fusión con [React Router](react-router.md)
es además un ejemplo poco común de convergencia entre proyectos.

| | |
|---|---|
| **Aparición** | 2021 |
| **Clasificación** | `react-metaframework` |
| **Ecosistema** | JavaScript / TypeScript |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://remix.run/docs> |

---

## 💡 Usar la plataforma en lugar de reinventarla

| Necesidad | Solución habitual | En Remix |
| --- | --- | --- |
| Enviar datos | Estado de cliente y llamada a la API | **Formulario HTML** con acción de servidor |
| Caché | Capa propia del framework | **Cabeceras HTTP** [@rfc9111] |
| Cargar datos | Efecto en el cliente | Función de carga en el servidor por ruta |
| Errores | Estado de error en el componente | Límites de error por ruta |

La primera fila tiene la consecuencia práctica que más importa: **el formulario
funciona sin JavaScript**. Si el guion falla o aún no ha cargado, el envío ocurre
igual [@mdn-progressive-enhancement].

Y la segunda conecta con el [módulo 01](../../curriculum/01-http-eventos-y-contratos.md):
usar las cabeceras de caché del protocolo en lugar de un mecanismo propio
significa que **los intermediarios entienden tu aplicación** sin saber nada de tu
framework.

## 🔀 La convergencia con React Router

Remix se fusionó con React Router, el enrutador de facto del ecosistema React
durante una década. En lugar de competir, los mismos mantenedores unificaron
ambos proyectos.

Para el [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) es un dato
de gobierno interesante: la convergencia **reduce la fragmentación** y a la vez
concentra dependencia en un solo equipo. Ambas cosas hay que puntuarlas.

## 🎓 Las dos lecciones

**1. La plataforma web ya resolvió muchos problemas.** Formularios, caché y
códigos de estado existen desde hace décadas; usarlos produce sistemas más
simples y más robustos.

**2. Dos proyectos pueden converger en lugar de competir.** Es raro y suele ser
buena noticia para quien los usa.

## 🔗 Enlaces

- Documentación oficial: <https://remix.run/docs>
- [Ficha de React Router](react-router.md) · [Ficha de Next.js](nextjs.md) · [Ficha de SvelteKit](sveltekit.md)
- [Módulo 01](../../curriculum/01-http-eventos-y-contratos.md)

## Fuentes

- [@rfc9111] RFC 9111 — HTTP Caching, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9111>
- [@mdn-progressive-enhancement] *Progressive Enhancement*, Mozilla — <https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement>
