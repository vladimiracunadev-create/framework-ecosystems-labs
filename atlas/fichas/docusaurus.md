# 🦖 Docusaurus — 2017

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Docusaurus es un generador de sitios estáticos especializado en **documentación de
proyectos**, y esa especialización es justamente lo que lo hace útil: trae
resueltos los problemas concretos de documentar software.

| | |
|---|---|
| **Aparición** | 2017, creado en Meta |
| **Clasificación** | `static-site-generator` |
| **Ecosistema** | React |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://docusaurus.io/docs> |

---

## 💡 Lo que trae por saber de qué va

| Problema de documentar software | Qué aporta |
| --- | --- |
| Hay varias versiones vivas del producto | Versionado del sitio completo |
| El proyecto se usa en varios idiomas | Traducción con estructura paralela |
| Nadie encuentra nada | Búsqueda integrada |
| Los enlaces se rompen al reorganizar | Falla la compilación al detectarlos |
| El contenido necesita partes interactivas | MDX: componentes React dentro del Markdown |

La cuarta fila es la más valiosa y la menos anunciada. **Un enlace roto rompe la
compilación**, así que no llega a publicarse. Es el mismo principio que este
programa aplica en [`scripts/verify-sources.mjs`](../../scripts/verify-sources.mjs):
la documentación que no se verifica automáticamente se degrada, porque nadie
revisa a mano lo que ya estaba escrito.

Y el versionado resuelve algo real: quien usa la versión 2 necesita la
documentación de la versión 2, no la de la 4. Sin esa función, cada proyecto lo
improvisa mal.

## ⚖️ El coste

Es un sitio React completo, con su cadena de compilación. Para documentación de un
proyecto grande eso se amortiza; para un sitio pequeño es maquinaria de sobra,
y ahí [VitePress](vitepress.md) o [Eleventy](eleventy.md) piden mucho menos.

Es la pregunta del [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md):
**el coste de la herramienta contra el tamaño del problema**.

## 🎓 Las dos lecciones

**1. Una herramienta especializada trae resuelto lo que no sabías que ibas a
necesitar.** Versionado y traducción no se improvisan bien.

**2. La documentación se degrada si no se verifica automáticamente.** Romper la
compilación con un enlace muerto es la única forma de que no se publique.

## 🔗 Enlaces

- Documentación oficial: <https://docusaurus.io/docs>
- [Ficha de VitePress](vitepress.md) · [Ficha de Eleventy](eleventy.md) · [Ficha de Astro](astro.md)
- [Módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)

## Fuentes

- [@google-eng-practices] *Google Engineering Practices Documentation*, Google — <https://google.github.io/eng-practices/>
