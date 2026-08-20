# ⚡📄 Hugo — 2013

> [⬅️ Atlas](../README.md) · [🐹 Ecosistema Go](../ecosistemas/go.md) · [🗂️ Índice](../frameworks.md)

Hugo genera miles de páginas estáticas en segundos, y esa cifra no es un detalle
de rendimiento: **es lo que cambia cómo se trabaja**. Cuando construir cuesta
segundos en lugar de minutos, previsualizar deja de ser un trámite.

| | |
|---|---|
| **Aparición** | 2013, creado por Steve Francia |
| **Clasificación** | `static-site-generator` |
| **Ecosistema** | Go |
| **Licencia** | `Apache-2.0` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://gohugo.io/documentation/> |

---

## 💡 La herramienta no tiene por qué estar en el lenguaje del contenido

Hugo está escrito en Go y su contenido es Markdown. Nada obliga a que un
generador de sitios esté escrito en el lenguaje del proyecto — y sin embargo
[Jekyll](jekyll.md) es Ruby, [Eleventy](eleventy.md) es JavaScript, y mucha gente
elige por ahí.

Hugo demostró que **la velocidad de la herramienta importa más que su lenguaje**,
y esa misma observación la repitió después esbuild en el mundo de JavaScript:
el cuello de botella no era la tarea, era el lenguaje de la herramienta.

Se distribuye además como **un único binario sin dependencias**, lo que elimina
la instalación de un entorno completo. Es un argumento de operación que el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) puntúa como coste
total, y que en generación estática pesa mucho.

## ⚖️ Lo que se paga

**1. Su lenguaje de plantillas es peculiar.** El de Go usa notación polaca
—función antes que argumentos— y resulta ajeno para quien viene de otros
sistemas. Es la principal queja recurrente.

**2. La lógica compleja se hace incómoda.** Cuando el sitio necesita
transformaciones elaboradas, el lenguaje de plantillas se queda corto y el
código resulta difícil de leer.

## 🧭 Su lugar

| | Hugo | [Jekyll](jekyll.md) | [Eleventy](eleventy.md) | [Astro](astro.md) |
| --- | --- | --- | --- | --- |
| Velocidad | La mayor | Baja | Media | Media |
| Instalación | Un binario | Entorno Ruby | Entorno Node | Entorno Node |
| Islas interactivas | No | No | Limitado | **Sí, su propuesta** |
| Plantillas | Propias de Go | Liquid | Varias | Componentes |

Hugo es la elección cuando el sitio es **grande y de contenido**. Astro, cuando
hace falta interactividad puntual.

## 🎓 Las dos lecciones

**1. La velocidad de construcción es una propiedad del proceso.** Determina
cuántas veces alguien previsualiza antes de publicar.

**2. Distribuir un binario único elimina una categoría entera de problemas.** Sin
entorno que instalar no hay conflictos de versiones ni de dependencias.

## 🔗 Enlaces

- Documentación oficial: <https://gohugo.io/documentation/>
- [Ficha de Jekyll](jekyll.md) · [Ficha de Eleventy](eleventy.md) · [Ficha de Astro](astro.md)
- [Módulo 04](../../curriculum/04-fullstack-y-renderizado.md)

## Fuentes

- [@wagner-web-performance] Wagner, Jeremy. *Web Performance in Action*. Manning Publications, 2016. ISBN 9781638353768 — <https://openlibrary.org/isbn/9781638353768>
