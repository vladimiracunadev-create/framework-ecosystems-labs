# Parte 7 — Renderizado y full-stack

> [⬅️ Parte 6](../parte-6-la-interfaz/README.md) · [🎓 Todas las clases](../README.md) · [📖 Glosario](../../glosario/README.md) · [Parte 8 ➡️](../parte-8-tiempo-real-y-segundo-plano/README.md)

**Dónde se genera el HTML, cuándo, y quién carga los datos. La decisión que más afecta a lo que siente el usuario.**

**Clases 93 a 104** · 12 en total · 9 construidas · 8 tecnologías en juego.

## 🧭 De qué va esta parte

Doce clases sobre la pregunta que define la arquitectura de una aplicación web moderna: **¿dónde se genera el HTML, y cuánto JavaScript hace falta después?**

Las cuatro estrategias de renderizado no son opciones de configuración: son compromisos entre lo rápido que se ve la página, lo rápido que responde, cuánto trabaja el servidor y cuánto código viaja. Y la respuesta correcta cambia **por pantalla**, no por proyecto.

Es la parte donde aparecen las ideas más recientes del campo —islas, componentes de servidor, resumibilidad— y también la alternativa que las evita: devolver hipermedia y quedarse con una biblioteca pequeña.

## 🎒 Qué da por sabido

- La parte 6 entera: componentes, estado y reactividad.
- La parte 1, porque el renderizado en servidor sigue siendo una respuesta HTTP.

## 🎯 Qué sabrás hacer al terminarla

- Nombrar las cuatro estrategias de renderizado y decir qué se paga con cada una.
- Explicar qué es la hidratación y por qué es trabajo duplicado.
- Reducir el JavaScript enviado con islas o con componentes de servidor, y medir la diferencia.
- Detectar una cascada de peticiones y romperla cargando los datos junto a la ruta.
- Poner un presupuesto de JavaScript y hacer que se compruebe solo.
- Elegir estrategia **por pantalla** con un criterio declarado, no por defecto del framework.

## 🧵 Por qué en este orden

Las tres primeras fijan el vocabulario: las cuatro estrategias (093), la hidratación (094) y las islas (095), que son la primera respuesta a su coste.

Las cinco del medio son cómo se construye hoy: componentes de servidor, carga de datos junto a la ruta, acciones de formulario, cascadas y HTML en flujo.

Las cuatro últimas son de criterio: metadatos, presupuesto de JavaScript, la alternativa hipermedia y cómo se decide pantalla a pantalla.

## 📚 Las clases

| # | Clase | Qué resuelve | Nivel | Estado |
| --- | --- | --- | --- | --- |
| [093](093-las-cuatro-estrategias-de-renderizado/README.md) | [Las cuatro estrategias de renderizado](093-las-cuatro-estrategias-de-renderizado/README.md) | Situar cliente, servidor, estático y revalidación en un mismo eje. | 🟡 intermedio | ✅ Construida |
| [094](094-hidratacion/README.md) | [Hidratación](094-hidratacion/README.md) | Entender el coste de revivir en el cliente lo que llegó pintado. | 🔴 avanzado | ✅ Construida |
| [095](095-islas/README.md) | [Islas](095-islas/README.md) | Enviar JavaScript solo donde hace falta. | 🔴 avanzado | ✅ Construida |
| [096](096-componentes-de-servidor/README.md) | [Componentes de servidor](096-componentes-de-servidor/README.md) | Ejecutar componentes donde están los datos y enviar el resultado. | 🔴 avanzado | ✅ Construida |
| [097](097-carga-de-datos-junto-a-la-ruta/README.md) | [Carga de datos junto a la ruta](097-carga-de-datos-junto-a-la-ruta/README.md) | Empezar a cargar al navegar, no al montar. | 🟡 intermedio | ✅ Construida |
| [098](098-acciones-de-formulario/README.md) | [Acciones de formulario](098-acciones-de-formulario/README.md) | Escribir en el servidor desde un formulario que funciona sin JavaScript. | 🟡 intermedio | ✅ Construida |
| [099](099-la-cascada-de-peticiones/README.md) | [La cascada de peticiones](099-la-cascada-de-peticiones/README.md) | Detectar y romper la cadena de esperas encadenadas. | 🔴 avanzado | ✅ Construida |
| [100](100-html-en-flujo/README.md) | [HTML en flujo](100-html-en-flujo/README.md) | Enviar la parte lista sin esperar a la lenta. | 🔴 avanzado | ✅ Construida |
| [101](101-metadatos-y-descubribilidad/README.md) | [Metadatos y descubribilidad](101-metadatos-y-descubribilidad/README.md) | Emitir en el servidor lo que los buscadores y las redes leen. | 🟡 intermedio | ✅ Construida |
| [102](102-presupuesto-de-javascript/README.md) | [Presupuesto de JavaScript](102-presupuesto-de-javascript/README.md) | Poner un límite y hacerlo fallar cuando se supera. | 🔴 avanzado | 🚧 Esqueleto |
| [103](103-hipermedia-como-alternativa/README.md) | [Hipermedia como alternativa](103-hipermedia-como-alternativa/README.md) | Resolver el mismo caso enviando HTML en lugar de estado. | 🔴 avanzado | 🚧 Esqueleto |
| [104](104-elegir-estrategia-por-pantalla/README.md) | [Elegir estrategia por pantalla](104-elegir-estrategia-por-pantalla/README.md) | Aplicar criterio por vista en lugar de una regla para toda la aplicación. | 🔴 avanzado | 🚧 Esqueleto |

## 🎬 Las tecnologías que aparecen

Entre paréntesis, en cuántas clases de esta parte interviene cada una. **Estar aquí no es una recomendación**: es que el problema de esa clase existe de verdad para esa tecnología.

| Ecosistema | Tecnologías |
| --- | --- |
| **JavaScript/TypeScript** | [Next.js](../../atlas/fichas/nextjs.md) (11), [Remix](../../atlas/fichas/remix.md) (10), [Astro](../../atlas/fichas/astro.md) (9), [Nuxt](../../atlas/fichas/nuxt.md) (9), [SvelteKit](../../atlas/fichas/sveltekit.md) (9) |
| **JavaScript** | [htmx](../../atlas/fichas/htmx.md) (1), [Turbo (Hotwire)](../../atlas/fichas/hotwire-turbo.md) (1) |
| **BEAM** | [Phoenix LiveView](../../atlas/fichas/phoenix-liveview.md) (1) |

## 📖 Las palabras que esta parte define

[**Renderizado en el servidor**](../../glosario/README.md#renderizado-en-el-servidor) · [**Generación estática**](../../glosario/README.md#generación-estática) · [**Hidratación**](../../glosario/README.md#hidratación) · [**Isla**](../../glosario/README.md#isla) · [**Componente de servidor**](../../glosario/README.md#componente-de-servidor) · [**Carga de datos junto a la ruta**](../../glosario/README.md#carga-de-datos-junto-a-la-ruta) · [**Cascada de peticiones**](../../glosario/README.md#cascada-de-peticiones) · [**Presupuesto de JavaScript**](../../glosario/README.md#presupuesto-de-javascript) · [**Hipermedia**](../../glosario/README.md#hipermedia)

Todas, con su definición, en el [glosario](../../glosario/README.md).

## ✅ Cómo se ejecuta una clase de esta parte

```bash
node scripts/run-class.mjs 093
```

El verificador arranca cada implementación, la somete a su `contrato.json` y **declara cuáles omitió** por no encontrar su cadena de herramientas. Si te faltan cadenas, `node scripts/doctor.mjs` dice cuáles y cómo se instalan.

## ➡️ Y después

La parte 8 sale del ciclo petición-respuesta: lo que ocurre cuando el servidor tiene algo que contar y nadie ha preguntado.
