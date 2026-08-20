# 📄 Jekyll — 2008

> [⬅️ Atlas](../README.md) · [💎 Ecosistema Ruby](../ecosistemas/ruby.md) · [🗂️ Índice](../frameworks.md)

Jekyll popularizó la **generación estática** y lo hizo por una razón que no era
técnica: su integración con GitHub Pages permitió publicar un sitio desde un
repositorio, sin servidor y sin coste.

| | |
|---|---|
| **Aparición** | 2008, creado por Tom Preston-Werner |
| **Clasificación** | `static-site-generator` |
| **Ecosistema** | Ruby |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://jekyllrb.com/docs/> |

---

## 💡 La idea: contenido en archivos, HTML al construir

Markdown con metadatos al principio, plantillas, y una construcción que produce
HTML estático. La propuesta es la de la primera fila del
[módulo 04](../../curriculum/04-fullstack-y-renderizado.md): **el HTML existe
antes de la petición**, y por tanto no hay servidor de aplicación, ni base de
datos, ni superficie de ataque de ejecución.

Ese último punto merece atención en el
[módulo 07](../../curriculum/07-identidad-y-seguridad.md): un sitio estático
**no tiene inyección SQL ni ejecución remota** porque no ejecuta nada. Es la
reducción de superficie más radical que existe.

## 🌍 Por qué se extendió

La distribución explica más que la tecnología. GitHub Pages construía y publicaba
un repositorio con Jekyll sin configurar nada, y eso puso la generación estática
al alcance de cualquiera con una cuenta.

Es la misma lección que la [ficha de CodeIgniter](codeigniter.md): **las
restricciones y las facilidades de despliegue deciden adopciones**, a menudo por
encima de los méritos técnicos.

Este mismo repositorio publica su sitio de forma equivalente —construido por
integración continua y servido como estático— y por eso su generador escribe un
archivo `.nojekyll`: para pedir que **no** se procese con Jekyll, ya que el HTML
viene ya generado.

## ⚖️ Sus límites

Los tiempos de construcción crecen con el número de páginas, y Ruby como
dependencia es una barrera para equipos que no lo usan. [Hugo](hugo.md) —en Go, y
mucho más rápido— y [Eleventy](eleventy.md) —en JavaScript— ocuparon buena parte
de ese espacio.

## 🎓 Las dos lecciones

**1. Un sitio estático elimina categorías enteras de vulnerabilidad.** No es que
sea más seguro: es que no hay nada que ejecutar.

**2. La facilidad de publicación decide adopciones.** Jekyll ganó por estar
integrado donde la gente ya tenía su código.

## 🔗 Enlaces

- Documentación oficial: <https://jekyllrb.com/docs/>
- [Ficha de Hugo](hugo.md) · [Ficha de Eleventy](eleventy.md) · [Ficha de Astro](astro.md)
- [Módulo 04](../../curriculum/04-fullstack-y-renderizado.md)

## Fuentes

- [@jamstack] *Jamstack* — <https://jamstack.org/>
