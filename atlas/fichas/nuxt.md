# 💚▲ Nuxt — 2016

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Nuxt es el metaframework de [Vue](vue.md): enrutado por sistema de archivos,
renderizado en servidor, generación estática y datos, sobre el mismo modelo de
componentes.

Su aportación más duradera, sin embargo, no fue para Vue: fue **[Nitro](nitro.md)**,
el motor de servidor que extrajo y que hoy usan también metaframeworks de otros
ecosistemas.

| | |
|---|---|
| **Aparición** | 2016 |
| **Clasificación** | `vue-metaframework` |
| **Ecosistema** | JavaScript / TypeScript |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://nuxt.com/docs> |

---

## 💡 Las mismas decisiones que Next.js, otro ecosistema

| Necesidad | Nuxt |
| --- | --- |
| Enrutado | Por sistema de archivos |
| Renderizado | Estático, servidor, híbrido por ruta |
| Datos | Utilidades de obtención con caché |
| Despliegue | **Adaptadores** por destino, vía Nitro |
| Módulos | Ecosistema propio de extensiones |

La fila de despliegue es la interesante y la que lo diferencia de
[Next.js](nextjs.md): Nuxt separó el motor de servidor del framework, de modo que
el mismo proyecto se despliega en destinos muy distintos cambiando un adaptador.

Para el [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) eso es una
**estrategia de salida incorporada al diseño**: reduce el acoplamiento a una
plataforma concreta, que es la dimensión que la ficha de Next.js señala como la
menos puntuada.

## 🧭 La decisión por contenido

Como todos los metaframeworks, Nuxt permite mezclar estrategias de renderizado
por ruta. Y como enseña el
[módulo 04](../../curriculum/04-fullstack-y-renderizado.md), esa es la forma
correcta de decidir: **por contenido, no por aplicación**.

## 🎓 Las dos lecciones

**1. Extraer una pieza y compartirla multiplica su valor.** Nitro nació dentro de
Nuxt y hoy sostiene a competidores. Es el patrón de
[Symfony](symfony.md) y [Rollup](rollup.md): lo influyente es lo que se
convierte en infraestructura ajena.

**2. Los adaptadores de despliegue reducen el acoplamiento.** Es la diferencia
práctica más relevante entre metaframeworks equivalentes.

## 🔗 Enlaces

- Documentación oficial: <https://nuxt.com/docs>
- [Ficha de Vue](vue.md) · [Ficha de Next.js](nextjs.md) · [Ficha de Nitro](nitro.md)
- [Módulo 04](../../curriculum/04-fullstack-y-renderizado.md)

## Fuentes

- [@macrae-vue-up-and-running] Macrae, Callum. *Vue.js: Up and Running*. O'Reilly Media, 2018. ISBN 9781491997246 — <https://openlibrary.org/isbn/9781491997246>
