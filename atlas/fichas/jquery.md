# 🔷 jQuery — 2006

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

jQuery es **la tecnología más influyente y peor entendida del catálogo**. Se la
cita como ejemplo de lo que ya no hay que usar, y casi nunca se explica que buena
parte de lo que hoy se considera «la plataforma web» entró primero como idea
suya. Su ficha existe para deshacer ese malentendido.

> **🎯 Por qué está en este programa**
>
> Por tres razones, y ninguna es nostálgica.
>
> **Es el ejemplo canónico de biblioteca frente a framework** ([módulo 00](../../curriculum/00-taxonomia-y-diagnostico.md)):
> jQuery nunca arranca tu aplicación, nunca define un ciclo de vida y nunca te
> llama. Tú la llamas a ella. Quien entiende por qué jQuery *no* es un framework
> ha entendido la inversión de control.
>
> **Es el mejor caso de éxito de una API que se volvió estándar.** Cuando una
> biblioteca resuelve tan bien un problema que la plataforma acaba absorbiendo su
> solución, su declive es una victoria, no un fracaso.
>
> **Y su modelo de trabajo ha vuelto.** htmx y Alpine.js hacen en 2020 lo que
> jQuery hacía en 2006: añadir comportamiento a HTML que ya existe. El péndulo
> del [Atlas](../README.md#las-cinco-eras) pasa dos veces por el mismo punto.

| | |
|---|---|
| **Aparición** | Enero de 2006, presentada por John Resig en el BarCamp de Nueva York |
| **Clasificación** | `dom-library` — biblioteca, **no** framework |
| **Ecosistema** | JavaScript, navegador |
| **Licencia** | `MIT` (fue dual MIT/GPL en sus primeros años) |
| **Gobierno** | OpenJS Foundation |
| **Estado** | 🟡 Mantenimiento activo: correcciones y seguridad, sin dirección nueva |
| **Documentación** | <https://api.jquery.com/> |

---

## 📜 El problema que existía

Hoy cuesta imaginarlo. En 2006, **el mismo código no funcionaba en dos
navegadores distintos**, y no en detalles menores:

| Tarea | Internet Explorer | Los demás |
| --- | --- | --- |
| Registrar un manejador de evento | `attachEvent`, con `this` apuntando a otro sitio | `addEventListener` |
| Obtener el objetivo del evento | `event.srcElement` | `event.target` |
| Petición al servidor | `new ActiveXObject("Microsoft.XMLHTTP")` | `new XMLHttpRequest()` |
| Medir el tamaño de un elemento | El modelo de caja incluía el borde | No lo incluía |
| Seleccionar por clase | No existía | No existía tampoco |

Escribir una página interactiva significaba escribir **dos o tres versiones de
cada operación**, con ramas por navegador esparcidas por todo el código. No era
un problema de arquitectura: era un problema de compatibilidad, y consumía la
mayor parte del tiempo. El manual de referencia del ecosistema dedicaba capítulos
enteros a catalogar esas diferencias [@flanagan-javascript-definitive].

## 💡 Lo que jQuery hizo

Cuatro decisiones, todas copiadas después.

### 1. Selectores CSS para buscar en el documento

```javascript
// Antes: recorrer el árbol a mano buscando por clase
var nodos = document.getElementsByTagName("li");
for (var i = 0; i < nodos.length; i++) {
  if (nodos[i].className.indexOf("activo") >= 0) { /* ... */ }
}

// Con jQuery: el mismo lenguaje que ya usabas en la hoja de estilos
$("li.activo")
```

Ese selector lo resolvía **Sizzle**, el motor que jQuery incluía. Años después,
los navegadores incorporaron `document.querySelectorAll` con la misma sintaxis.
La idea ganó tan claramente que dejó de necesitar a jQuery.

### 2. Operar sobre conjuntos, no sobre elementos sueltos

```javascript
$("li.activo").addClass("resaltado").fadeIn(200);
```

No hay bucle. La colección **es** el objeto sobre el que operas, y cada método
devuelve la colección para poder encadenar. Es una idea de programación funcional
en un momento en que casi nadie escribía JavaScript así.

### 3. Normalizar los eventos

```javascript
$("#boton").on("click", function (evento) {
  evento.preventDefault();  // funcionaba igual en todos los navegadores
  console.log(this);        // this apuntaba al elemento, siempre
});
```

El libro de referencia de la época enseñaba jQuery precisamente por ahí: no como
una API que memorizar, sino como una forma distinta de pensar el documento
[@bibeault-jquery-in-action].

### 4. Hacer las peticiones asíncronas usables

`$.ajax` popularizó el término AJAX más que ninguna otra herramienta. La API
`fetch` que hoy usa la referencia del
[módulo 01](../../curriculum/01-http-eventos-y-contratos.md) resuelve el mismo
problema con la misma forma conceptual.

## 🧬 Lo que se convirtió en plataforma

Esta es la parte de la historia que casi nunca se cuenta:

| Idea de jQuery | Hoy es |
| --- | --- |
| `$(selector)` con sintaxis CSS | `document.querySelectorAll()` |
| `$(el).addClass()` / `removeClass()` | `element.classList` |
| `$.ajax` | `fetch()` |
| `$(document).ready()` | `defer` en el guion, o `DOMContentLoaded` |
| `$(el).on()` normalizado | `addEventListener` ya coherente entre navegadores |
| `$.each` sobre colecciones | Los métodos de iteración del propio lenguaje |

**Cuando alguien dice «ya no necesitas jQuery», está describiendo el éxito de
jQuery.** La biblioteca dejó de ser necesaria porque su propuesta ganó.

Dos de esas absorciones están hoy en normas vivas: el modelo de objetos del
documento y sus eventos [@whatwg-dom], y los métodos de iteración y las promesas
que entraron en la especificación del lenguaje [@tc39-ecma262]. Aprender la
plataforma hoy —el documento, los eventos, `fetch`— es aprender lo que jQuery
normalizó primero [@haverbeke-eloquent-javascript].

## ⚖️ Lo que jQuery no resolvió

Y aquí está la razón real de su relevo. jQuery hizo cómodo **manipular el
documento**, pero no dijo nada sobre **de dónde sale el estado de la aplicación**.

```javascript
// El patrón que se rompía al crecer
$("#contador").text(pendientes);
$("#titulo").text("Tienes " + pendientes + " pendientes");
$("#vacio").toggle(pendientes === 0);
```

Tres instrucciones que deben ejecutarse **todas** cada vez que `pendientes`
cambie. Si alguien añade una cuarta parte de la interfaz y olvida actualizarla,
la pantalla muestra dos números distintos para lo mismo. En una aplicación
pequeña se controla; en una de cincuenta pantallas, no.

Ese es exactamente el fallo que el
[módulo 03](../../curriculum/03-frontend-componentes-y-estado.md) llama **estado
derivado duplicado**, y la razón de ser de todo lo que vino después: Backbone
separando modelo y vista, Knockout con observables, React proponiendo
`vista = f(estado)`.

**jQuery no fue superado por ser lento ni por ser antiguo. Fue superado porque
resolvía un problema —la incompatibilidad— que dejó de existir, y no resolvía el
siguiente —la sincronización— que empezaba a doler.**

## 🔄 Lo que se ha modernizado

No es una foto fija:

- **Licencia única MIT**, tras años de licencia dual.
- **jQuery 3** eliminó API obsoletas y adoptó promesas conformes al estándar.
- **Módulos** para importar solo lo que se usa, en vez del archivo completo.
- **Gobierno de fundación**: el proyecto se aloja en la OpenJS Foundation, no
  depende de una persona ni de una empresa [@openjsf-projects].
- Sigue recibiendo **correcciones de seguridad**, que es lo que importa cuando
  una tecnología está presente en tantísimo código en producción. Los informes
  anuales sobre el estado de la web siguen registrando su presencia año tras año
  [@web-almanac], y eso convierte cada aviso de seguridad suyo en un asunto de
  alcance amplio.

## 🎓 Las tres lecciones

**1. Clasificar bien antes de comparar.** jQuery es una biblioteca. Compararla
con Angular o con React-más-su-ecosistema es un error de categoría de manual
([módulo 00](../../curriculum/00-taxonomia-y-diagnostico.md)).

**2. Una tecnología puede «morir» por haber ganado.** Cuando la plataforma
absorbe tu propuesta, dejas de ser necesario. Distinguir ese final del de una
tecnología abandonada es parte de evaluar la salud de un proyecto
([módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)).

**3. Retirar una dependencia también es una migración.** Muchos proyectos
siguieron con jQuery mucho después de necesitarlo, porque quitarlo significaba
tocar cientos de archivos sin ningún cambio visible para el usuario. Es el patrón
de la figura estranguladora del
[módulo 10](../../curriculum/10-modernizacion-y-migracion.md) aplicado a una
biblioteca en lugar de a un sistema.

## 🔗 Enlaces

- Documentación oficial: <https://api.jquery.com/>
- [Ecosistema JavaScript](../ecosistemas/javascript.md) — dónde encaja en la línea del tiempo
- [Ficha de React](react.md) — quien resolvió lo que jQuery dejó abierto
- [Ficha de htmx](htmx.md) — el mismo modelo de trabajo, veinte años después
- [Módulo 03](../../curriculum/03-frontend-componentes-y-estado.md) — el problema que jQuery dejó abierto

## Fuentes

- [@bibeault-jquery-in-action] Bibeault, Bear; Katz, Yehuda. *jQuery in Action*. Manning, 2008. ISBN 9781933988351 — <https://openlibrary.org/isbn/9781933988351>
- [@flanagan-javascript-definitive] Flanagan, David. *JavaScript: The Definitive Guide*, 7.ª ed. O'Reilly Media, 2020. ISBN 9781491952023 — <https://openlibrary.org/isbn/9781491952023>
- [@haverbeke-eloquent-javascript] Haverbeke, Marijn. *Eloquent JavaScript*, 3.ª ed. No Starch Press, 2018. ISBN 9781593279509 — <https://openlibrary.org/isbn/9781593279509>
- [@whatwg-dom] *DOM Standard*, WHATWG — <https://dom.spec.whatwg.org/>
- [@tc39-ecma262] *ECMAScript Language Specification*, Ecma International — TC39 — <https://tc39.es/ecma262/>
- [@openjsf-projects] *OpenJS Foundation Projects*, OpenJS Foundation — <https://openjsf.org/projects>
- [@web-almanac] *Web Almanac*, HTTP Archive — <https://almanac.httparchive.org/>
