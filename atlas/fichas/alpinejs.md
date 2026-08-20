# 🏔️ Alpine.js — 2019

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Alpine.js recupera el modelo de trabajo de [jQuery](jquery.md) —añadir
comportamiento a HTML que ya existe— con el vocabulario declarativo de la
generación moderna. Sin fase de construcción, sin paquete que empaquetar, sin
nada que instalar más que una etiqueta.

> **🎯 Por qué está en este programa**
>
> Porque es la prueba de que **el péndulo del [Atlas](../README.md#las-cinco-eras)
> pasa dos veces por el mismo punto**, y porque encaja con una idea que el
> [módulo 03](../../curriculum/03-frontend-componentes-y-estado.md) defiende: la
> mejora progresiva. La página funciona sin JavaScript; Alpine añade
> comportamiento encima [@mdn-progressive-enhancement].

| | |
|---|---|
| **Aparición** | 2019, creado por Caleb Porzio |
| **Clasificación** | `dom-library` |
| **Ecosistema** | JavaScript |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://alpinejs.dev/start-here> |

---

## 💡 Comportamiento en atributos

```html
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js"></script>

<!-- El estado vive en el elemento, y su alcance es ese elemento -->
<div x-data="{ pendientes: 0 }">
  <p>Pendientes: <span x-text="pendientes"></span></p>
  <button @click="pendientes++">Añadir</button>
  <!-- Restricción visible: el límite se muestra, no se castiga después -->
  <button @click="pendientes--" :disabled="pendientes === 0">Quitar</button>
</div>
```

Tres decisiones que merecen atención [@alpine-state]:

1. **El estado tiene alcance local**, delimitado por el elemento que lo declara.
   No hay almacén global salvo que se pida.
2. **La expresión está en el marcado**, como en Knockout, AngularJS o Vue. Es
   legible junto al elemento al que afecta, y difícil de someter a comprobación
   de tipos.
3. **No hay compilación.** Se puede pegar en una página servida por Django, Rails
   o WordPress y funciona.

## 🧭 Dónde encaja de verdad

Alpine no compite con React: compite con **escribir JavaScript suelto en una
página renderizada en servidor**. Su terreno natural son las aplicaciones donde
el HTML lo genera el servidor y solo hacen falta islas pequeñas de interacción —
un menú, un modal, una pestaña, un contador.

Por eso aparece tanto junto a [htmx](htmx.md) y a Laravel: htmx trae fragmentos
del servidor, Alpine gestiona el estado puramente visual que no merece un viaje
de red. Se reparten el trabajo sin solaparse.

## ⚖️ Sus límites, dichos claro

**1. No escala a aplicaciones grandes.** Sin componentes reutilizables de verdad,
sin enrutado, sin herramientas de diagnóstico serias. Cuando la interacción deja
de ser local, se nota rápido.

**2. Las expresiones en atributos no se comprueban.** Un error tipográfico en
`x-text` no lo detecta nada hasta que se ejecuta. Es el mismo compromiso que
tenían AngularJS y Knockout, y una de las razones por las que Angular adoptó
TypeScript.

**3. La accesibilidad sigue siendo tuya.** Alpine facilita mostrar y ocultar; no
sabe nada de foco, de regiones activas ni de nombres accesibles. Los criterios de
WCAG hay que comprobarlos igual [@wcag-quickref], y los patrones de formulario
—errores por campo, agrupación, orden de foco— siguen siendo trabajo de diseño
[@silver-form-design-patterns].

## 🎓 Las tres lecciones

**1. No toda interacción necesita un framework de aplicación.** Un menú
desplegable no justifica un árbol virtual ni una fase de construcción, y decirlo
en voz alta es parte del criterio que persigue el módulo 11.

**2. La mejora progresiva sigue siendo una estrategia válida.** Empezar por HTML
que funciona y añadir comportamiento encima produce sistemas más robustos ante
fallos de red o de guion.

**3. El péndulo vuelve.** Alpine hace en 2019 lo que jQuery hacía en 2006, con la
sintaxis declarativa aprendida por el camino. Reconocerlo evita tratar cada
regreso como una novedad.

## 🔗 Enlaces

- Documentación oficial: <https://alpinejs.dev/start-here>
- [Ficha de jQuery](jquery.md) · [Ficha de htmx](htmx.md) — su compañero habitual
- [Módulo 03](../../curriculum/03-frontend-componentes-y-estado.md)

## Fuentes

- [@silver-form-design-patterns] Silver, Adam. *Form Design Patterns*. Smashing Media, 2018. ISBN 9783945749739 — <https://openlibrary.org/isbn/9783945749739>
- [@alpine-state] *Alpine State*, Alpine.js — <https://alpinejs.dev/essentials/state>
- [@mdn-progressive-enhancement] *Progressive Enhancement*, Mozilla — <https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement>
- [@wcag-quickref] *How to Meet WCAG (Quick Reference)*, W3C — <https://www.w3.org/WAI/WCAG22/quickref/>
