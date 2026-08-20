# 📰 WordPress — 2003

> [⬅️ Atlas](../README.md) · [🐘 Ecosistema PHP](../ecosistemas/php.md) · [🗂️ Índice](../frameworks.md)

WordPress mueve una porción enorme de la web y aparece muy poco en las
conversaciones sobre frameworks. Está en el Atlas por dos razones muy concretas,
y ninguna es su cuota de mercado: **es el error de categoría más frecuente del
campo**, y **es donde la licencia deja de ser un trámite y pasa a ser una
restricción de producto**.

> **🎯 Por qué está en este programa**
>
> **Como ejercicio de taxonomía** ([módulo 00](../../curriculum/00-taxonomia-y-diagnostico.md)):
> WordPress no es un framework, es un **gestor de contenidos** — una aplicación
> completa que se administra. Compararlo con Laravel o con Django es comparar un
> producto terminado con una herramienta para construirlos.
>
> **Y como caso de licencia** ([módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)):
> su copyleft impone obligaciones a lo que construyes encima. Es el ejemplo donde
> la casilla «licencia» de la matriz de decisión deja de ser burocracia.

| | |
|---|---|
| **Aparición** | 2003, creado por Matt Mullenweg y Mike Little |
| **Clasificación** | `cms` — **no** es un framework |
| **Ecosistema** | PHP |
| **Licencia** | `GPL-2.0-or-later` — copyleft |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://developer.wordpress.org/> |

---

## 🧭 Las cinco preguntas del módulo 00

| Pregunta | WordPress | Un framework |
| --- | --- | --- |
| ¿Arranca tu código? | Arranca **él**; tú añades funciones a sus enganches | Arranca él, tú rellenas huecos |
| ¿Uso parcial? | No: es una aplicación entera | A veces |
| ¿Define el ciclo de vida? | Sí, y también el **modelo de datos** y la interfaz de administración | Solo el ciclo de la petición |
| ¿Existe sin otra cosa? | Necesita PHP y una base de datos | Igual |
| ¿Quién lo ejecuta? | Tú, o un alojamiento gestionado | Tú |

La tercera fila es la decisiva: un framework te deja definir tu dominio;
WordPress **ya trae el suyo** —entradas, páginas, taxonomías, usuarios,
comentarios— y tu trabajo es extenderlo [@macdonald-wordpress]. Eso es un
producto configurable, no una herramienta de construcción.

## ⚖️ La licencia como restricción de producto

WordPress se distribuye bajo GPL, una licencia **copyleft**: el trabajo derivado
que se distribuya debe publicarse bajo los mismos términos [@wordpress-license].

Las consecuencias prácticas para quien construye encima:

| Situación | Consecuencia |
| --- | --- |
| Complemento que **distribuyes** | La postura del proyecto es que hereda la GPL |
| Tema que **vendes** | Igual: se distribuye bajo GPL |
| Sitio propio que **no distribuyes** | Uso interno; la obligación de publicar no se activa |
| Recursos separables (imágenes, CSS, JavaScript propio) | La postura del proyecto los considera separables en ciertos casos |

Ese es el punto pedagógico, y no depende de estar de acuerdo con la
interpretación: **la licencia del cimiento condiciona el modelo de negocio de lo
que construyes encima**. Es exactamente por lo que el módulo 11 pide el
identificador SPDX exacto y las obligaciones concretas, no un genérico «es de
código abierto».

## 🔌 El modelo de extensión: enganches

WordPress no tiene inyección de dependencias ni middleware. Tiene **enganches**:
puntos donde registras una función para que se llame en un momento del ciclo
[@williams-wordpress-plugins].

```php
// Acción: ejecutar algo en un punto del ciclo
add_action('init', function () { /* ... */ });

// Filtro: transformar un valor que pasa por ahí
add_filter('the_content', function ($contenido) {
    return $contenido . '<p>Añadido al final.</p>';
});
```

Es el mismo concepto que el middleware de Express o los filtros de Spring
—registrar comportamiento en puntos de extensión— con la diferencia clave que
enseña el [módulo 02](../../curriculum/02-arquitectura-de-frameworks.md): **el
orden y las prioridades son globales y compartidos entre todos los complementos
instalados**. Dos complementos que enganchan el mismo punto pueden interferir sin
saber el uno del otro, y ese es el origen de la mayoría de los fallos difíciles
del ecosistema.

## 🛡️ Cadena de suministro

Un sitio típico instala complementos de terceros con acceso completo a la base de
datos y a la ejecución. Cada uno es una dependencia con su propio mantenimiento,
su propia calidad y su propio historial de seguridad.

Es el mismo análisis de la ficha de [Struts](struts.md), con un agravante: aquí
las actualizaciones a menudo las gestiona quien administra el sitio, no un equipo
de desarrollo con inventario de dependencias.

## 🎓 Las tres lecciones

**1. Clasificar mal invalida la comparación.** «WordPress frente a Laravel» no es
una comparación: son categorías distintas. La pregunta correcta es si el producto
necesita un gestor de contenidos o una aplicación a medida.

**2. La licencia es una restricción de producto, no un trámite.** El copyleft del
cimiento condiciona lo que puedes vender y cómo. Se decide antes, no después.

**3. Un modelo de extensión global es potente y frágil.** Cuando el orden de
ejecución lo comparten decenas de complementos que no se conocen entre sí, el
diagnóstico se vuelve el problema principal.

## 🔗 Enlaces

- Documentación oficial: <https://developer.wordpress.org/>
- [Ecosistema PHP](../ecosistemas/php.md) · [Ficha de Laravel](laravel.md)
- [Módulo 00](../../curriculum/00-taxonomia-y-diagnostico.md) — clasificar antes de comparar

## Fuentes

- [@macdonald-wordpress] MacDonald, Matthew. *WordPress: The Missing Manual*. O'Reilly Media, 2014. ISBN 9781449341879 — <https://openlibrary.org/isbn/9781449341879>
- [@williams-wordpress-plugins] Williams, Brad; Richard, Ozh; Tadlock, Justin. *Professional WordPress Plugin Development*. Wiley, 2011. ISBN 9780470916223 — <https://openlibrary.org/isbn/9780470916223>
- [@wordpress-license] *WordPress License (GPL)*, WordPress — <https://wordpress.org/about/license/>
