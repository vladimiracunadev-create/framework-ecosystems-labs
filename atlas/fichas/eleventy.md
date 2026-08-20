# 1️⃣1️⃣ Eleventy — 2018

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Eleventy es el contrapunto minimalista de los metaframeworks: **no envía
JavaScript al cliente por omisión** y no impone un lenguaje de plantillas —admite
varios en el mismo proyecto.

| | |
|---|---|
| **Aparición** | 2018, creado por Zach Leatherman |
| **Clasificación** | `static-site-generator` |
| **Ecosistema** | JavaScript |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://www.11ty.dev/docs/> |

---

## 💡 Cero JavaScript de cliente por omisión

Es la misma inversión del valor por defecto que propone [Astro](astro.md), y con
una diferencia: Eleventy **no ofrece un modelo de islas**. Si hace falta
interactividad, se añade a mano —con una etiqueta, con [Alpine](alpinejs.md), con
lo que sea.

Esa restricción es también su propuesta: **para un sitio de contenidos, la mayor
parte de las páginas no necesita nada**, y el generador no debería suponer lo
contrario [@jamstack].

## 🧩 Varios lenguajes de plantilla a la vez

Eleventy acepta Markdown, Nunjucks, Liquid, Handlebars, JavaScript y más — **en
el mismo proyecto**. Es útil en un caso concreto y frecuente: migrar un sitio
existente desde [Jekyll](jekyll.md) o desde otro generador **página a página**,
sin reescribir todas las plantillas de golpe.

Es la figura estranguladora del
[módulo 10](../../curriculum/10-modernizacion-y-migracion.md) aplicada a la capa
de plantillas, y muy pocos generadores lo permiten.

## ⚖️ Lo que no trae

Ni componentes con estado, ni enrutado de cliente, ni hidratación. Para un
producto con interacción rica, el generador equivocado. La decisión es la del
[módulo 04](../../curriculum/04-fullstack-y-renderizado.md): **se elige por
contenido**, y aquí el contenido manda.

## 🎓 Las dos lecciones

**1. No suponer que hace falta JavaScript es una decisión de diseño.** Cambia el
valor por omisión y con él el resultado de la mayoría de los proyectos.

**2. Aceptar varios formatos de plantilla habilita migraciones graduales.** Es
una propiedad de adopción, no una funcionalidad.

## 🔗 Enlaces

- Documentación oficial: <https://www.11ty.dev/docs/>
- [Ficha de Astro](astro.md) · [Ficha de Jekyll](jekyll.md) · [Ficha de Hugo](hugo.md)
- [Módulo 04](../../curriculum/04-fullstack-y-renderizado.md)

## Fuentes

- [@jamstack] *Jamstack* — <https://jamstack.org/>
