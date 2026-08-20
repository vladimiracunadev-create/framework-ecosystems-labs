# ⚡ Vite — 2020

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Vite es hoy la base sobre la que se construyen casi todos los metaframeworks del
ecosistema JavaScript, y es una **herramienta de construcción**, no un framework.
Su ficha existe porque explica una parte del campo que suele quedar fuera de las
comparativas: **la fase de construcción es una decisión de arquitectura**.

> **🎯 Por qué está en este programa**
>
> Porque Svelte, SvelteKit, Nuxt, SolidStart, Astro y Qwik dependen de él. Cuando
> el [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) pide mirar el
> árbol de dependencias antes de decidir, Vite es la dependencia compartida que
> casi nadie puntúa — igual que [Symfony](symfony.md) en PHP.

| | |
|---|---|
| **Aparición** | 2020, creado por Evan You (autor de Vue) |
| **Clasificación** | `build-tool` |
| **Ecosistema** | JavaScript / TypeScript |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://vite.dev/guide/> |

---

## 📜 El problema que resolvió

Los empaquetadores clásicos, como webpack, tenían que **procesar toda la
aplicación antes de poder mostrarla**. En un proyecto grande eso significaba
esperar decenas de segundos al arrancar el servidor de desarrollo, y varios
segundos tras cada cambio. Ese retraso sale caro: rompe el ciclo de
retroalimentación, que es lo que hace productivo programar.

Vite observó que **el navegador ya sabe cargar módulos**. Desde 2015 los soporta
de forma nativa, así que en desarrollo no hace falta empaquetar nada: basta con
servir cada archivo cuando el navegador lo pida [@vite-why].

| | Empaquetador clásico | Vite en desarrollo |
| --- | --- | --- |
| Al arrancar | Procesa toda la aplicación | Arranca casi al instante |
| Al cambiar un archivo | Reconstruye lo afectado | Sirve ese archivo |
| Coste | Crece con el tamaño del proyecto | Casi constante |

## 🎭 La decisión interesante: dos modos distintos

Vite hace algo poco intuitivo y muy pragmático: **usa mecanismos diferentes en
desarrollo y en producción**.

- **En desarrollo**, módulos nativos del navegador, sin empaquetar.
- **En producción**, sí empaqueta —con Rollup— porque servir cientos de archivos
  sueltos a un usuario real es peor: cada uno cuesta una petición
  [@wagner-web-performance].

Eso viola un principio que muchos equipos defienden —«que desarrollo y producción
sean idénticos»— y lo hace **a conciencia**, porque los dos entornos optimizan
cosas distintas: uno la velocidad de iteración, otro la de carga.

El [módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md) obliga a
declarar esa asimetría: **nunca compares una aplicación en modo desarrollo con
otra en modo producción**. Con Vite no son solo configuraciones distintas: son
mecanismos distintos.

## ⚖️ Lo que hay que declarar

**1. Es una dependencia compartida y transversal.** Media docena de
metaframeworks dependen de Vite. Su salud es la salud de todos ellos, y eso debe
aparecer en el análisis del módulo 11 aunque tu proyecto nunca lo nombre.

**2. Ata a una fase de construcción.** Con Vite —igual que con Svelte o
TypeScript— no se puede abrir un archivo en el navegador y ver el resultado. Es
un coste real que tecnologías sin construcción, como [htmx](htmx.md) o
[Alpine](alpinejs.md), evitan por diseño.

**3. Los complementos son la superficie de riesgo.** El núcleo es pequeño; el
comportamiento real de un proyecto lo determinan sus complementos, cada uno con
su propio mantenimiento.

## 🧬 El linaje de las herramientas

| Herramienta | Aportó |
| --- | --- |
| **webpack** (2012) | Tratar cualquier recurso como módulo; hizo posible el frontend moderno |
| **Rollup** (2015) | Eliminación de código no usado desde módulos estáticos |
| **esbuild** (2020) | Demostró que el cuello de botella era el lenguaje de la herramienta, no la tarea |
| **Vite** (2020) | Usar los módulos del navegador en desarrollo; empaquetar solo para producción |

Es una genealogía como la de los frameworks, y con la misma lección: cada
herramienta resolvió el dolor de la anterior y creó el suyo. webpack sigue siendo
más configurable que Vite; esa flexibilidad es justo lo que lo hacía difícil.

## 🎓 Las tres lecciones

**1. La velocidad del ciclo de retroalimentación es una propiedad de producto.**
No es comodidad: determina cuántas veces al día alguien prueba algo.

**2. Desarrollo y producción pueden divergir a propósito** — si la divergencia se
declara. Lo peligroso no es que difieran: es medir uno y creer que hablas del
otro.

**3. Las herramientas de construcción son dependencias de primer orden.** Están
en el camino crítico de la entrega y merecen la misma evaluación de salud que el
framework.

## 🔗 Enlaces

- Documentación oficial: <https://vite.dev/guide/>
- [Ecosistema JavaScript](../ecosistemas/javascript.md) · [Módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md)

## Fuentes

- [@wagner-web-performance] Wagner, Jeremy. *Web Performance in Action*. Manning Publications, 2016. ISBN 9781638353768 — <https://openlibrary.org/isbn/9781638353768>
- [@vite-why] *Why Vite*, Vite — <https://vite.dev/guide/why>
