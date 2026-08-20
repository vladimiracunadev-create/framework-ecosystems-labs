# 🚀 Astro — 2021

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Astro es la respuesta más clara del catálogo a una pregunta incómoda: **¿por qué
una página que solo muestra texto envía medio megabyte de JavaScript?** Su
propuesta —no enviar nada por omisión y declarar explícitamente cada excepción—
invierte el valor por defecto de toda la generación anterior.

Y tiene una propiedad que ningún otro metaframework comparte: **permite usar
React, Vue, Svelte, Solid y Lit en la misma página**. Eso lo convierte en el
mejor banco de pruebas que existe para el tipo de comparación que enseña este
programa.

> **🎯 Por qué está en este programa**
>
> **Hace visible el coste de la hidratación** ([módulo 04](../../curriculum/04-fullstack-y-renderizado.md)).
> En los demás metaframeworks la hidratación es implícita y global; en Astro es
> una decisión que se escribe componente a componente. Lo que en otros sitios hay
> que medir para descubrir, aquí está en el código fuente.
>
> **Permite una comparación honesta entre bibliotecas de interfaz**
> ([módulo 03](../../curriculum/03-frontend-componentes-y-estado.md)): el mismo
> requisito, la misma página, el mismo entorno de construcción, y solo cambia la
> biblioteca. Elimina de un plumazo la mayoría de las variables que arruinan las
> comparaciones publicadas.

| | |
|---|---|
| **Aparición** | 2021 |
| **Clasificación** | `web-metaframework` |
| **Ecosistema** | JavaScript / TypeScript |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://docs.astro.build/> |

---

## 📜 El problema que existía

Hacia 2020, el camino por omisión para hacer un sitio de contenidos había llegado
a un resultado absurdo: un blog, una documentación o una página de producto
—contenido que **no cambia mientras lo lees**— se entregaba como una aplicación
completa de JavaScript que debía descargarse, ejecutarse e hidratarse antes de
responder a un clic.

El coste no era teórico y recaía de forma desigual: quien tenía un teléfono
modesto o una conexión lenta pagaba una factura que el equipo de desarrollo, con
su portátil y su fibra, no veía. El
[módulo 04](../../curriculum/04-fullstack-y-renderizado.md) insiste por esto en
medir **con red limitada**: es la única forma de que la diferencia aparezca.

## 💡 La arquitectura de islas

La idea central, en una frase: **la página es HTML estático, y la interactividad
son islas declaradas dentro de ese HTML** [@astro-islands].

El término no lo acuñó Astro. Jason Miller lo describió en 2020 como patrón
arquitectónico general —renderizar la página en servidor y activar solo regiones
concretas en el cliente— y Astro fue quien lo convirtió en el valor por omisión
de un framework completo [@jasonformat-islands].

```astro
---
// Este bloque se ejecuta SOLO en construcción o en el servidor.
// Nada de lo que hay aquí llega al navegador.
const tareas = await obtenerTareas();
---

<h1>Tareas</h1>

<!-- Estático: cero JavaScript enviado -->
<ul>
  {tareas.map((tarea) => <li>{tarea.title}</li>)}
</ul>

<!-- Isla: se hidrata al ser visible, y solo ella -->
<ContadorInteractivo client:visible />

<!-- Isla: se hidrata solo si el navegador tiene ancho suficiente -->
<PanelLateral client:media="(min-width: 60rem)" />
```

Las directivas `client:*` son la aportación conceptual. Convierten una decisión
que en otros frameworks es global e implícita en una decisión **local y
explícita**:

| Directiva | Cuándo se carga | Uso típico |
| --- | --- | --- |
| *(ninguna)* | Nunca: no se envía JavaScript | La mayoría de la página |
| `client:load` | En cuanto carga la página | Lo que debe responder de inmediato |
| `client:idle` | Cuando el navegador está ocioso | Interacción secundaria |
| `client:visible` | Al entrar en el área visible | Lo que está más abajo |
| `client:media` | Si se cumple una consulta de medios | Componentes solo de escritorio |
| `client:only` | Solo en cliente, sin renderizar en servidor | Lo que depende del navegador |

**La lista de lo que se envía al navegador es exactamente la lista de directivas
del proyecto.** Se puede auditar leyendo el código, sin herramientas.

## 🔬 Por qué es un banco de pruebas excepcional

Esta es la propiedad que hace a Astro valioso para este programa. En la misma
página, con el mismo empaquetador y el mismo despliegue:

```astro
<ContadorReact    client:visible />
<ContadorVue      client:visible />
<ContadorSvelte   client:visible />
<ContadorSolid    client:visible />
```

Cuatro implementaciones del **mismo requisito** con **todas las variables de
entorno idénticas**. El [módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md)
exige declarar siete puntos del protocolo de medición antes de comparar; aquí
seis de los siete son constantes por construcción, y solo queda variar el que
interesa.

La mayoría de las comparaciones publicadas entre bibliotecas de interfaz no
pueden decir lo mismo: comparan proyectos distintos, con configuraciones
distintas, medidos en máquinas distintas.

> **Reto de transferencia.** Implementa el panel de tareas del
> [módulo 03](../../curriculum/03-frontend-componentes-y-estado.md) cuatro veces
> en la misma página de Astro, cumpliendo las seis pruebas compartidas —incluida
> la de accesibilidad—, y mide el JavaScript enviado por cada isla. Es la
> comparación más limpia que este programa puede pedirte.

## ⚖️ Lo que se paga

**1. No es la herramienta para todo.** Astro está pensado para sitios donde el
contenido domina. Una aplicación con estado compartido entre muchas vistas —un
editor, un panel de control tras autenticación— encaja mejor en un metaframework
orientado a aplicaciones. Elegirlo mal produce el mismo error que enseña el
módulo 04: la estrategia se decide **por contenido**, no por aplicación.

**2. Las islas no comparten estado gratis.** Dos islas son dos árboles
independientes. Comunicarlas exige un canal explícito —eventos, almacén
externo—, que es precisamente lo que un framework de página única resuelve por
omisión. El coste de la arquitectura de islas aparece exactamente cuando la
interactividad deja de ser local.

**3. Mezclar bibliotecas tiene un precio real.** Poder usar React y Vue en la
misma página no significa que convenga: cada una arrastra su propio runtime al
paquete. Es una capacidad de comparación y de migración, no una recomendación de
arquitectura.

## 🧬 Su lugar en la línea del tiempo

Astro pertenece a la quinta era del [Atlas](../README.md#las-cinco-eras), la de
las islas y el regreso del hipermedia, y comparte diagnóstico con dos vecinos que
resuelven lo mismo de otra manera:

| | Astro | Qwik | htmx |
| --- | --- | --- | --- |
| Diagnóstico | Se envía JavaScript innecesario | La hidratación es cara | El estado no debía irse del servidor |
| Solución | Cero por omisión, islas explícitas | Reanudar el estado en vez de reconstruirlo | HTML como respuesta, sin estado en cliente |
| Coste | Estado compartido entre islas | Modelo mental nuevo | Menos interactividad rica |

Los tres son respuestas de la misma década al mismo exceso. Ninguno es la
continuación natural del anterior: son ramas paralelas, y por eso el Atlas las
presenta juntas. Los catálogos de patrones de renderizado del sector recogen las
tres junto a las estrategias clásicas, lo que ayuda a verlas como opciones de un
mismo menú y no como generaciones que se sustituyen [@patterns-dev].

## 🔗 Enlaces

- Documentación oficial: <https://docs.astro.build/>
- [Ecosistema JavaScript](../ecosistemas/javascript.md) — las cuatro eras y dónde encaja
- [Ficha de htmx](htmx.md) · [Ficha de React](react.md)
- [Módulo 04](../../curriculum/04-fullstack-y-renderizado.md) — cinco estrategias de renderizado y cómo medirlas

## Fuentes

- [@astro-islands] *Islands Architecture*, Astro — <https://docs.astro.build/en/concepts/islands/>
- [@jasonformat-islands] Miller, Jason. *Islands Architecture*, jasonformat.com, 2020 — <https://jasonformat.com/islands-architecture/>
- [@patterns-dev] *Patterns.dev — Modern Web App Design Patterns* — <https://www.patterns.dev/>
