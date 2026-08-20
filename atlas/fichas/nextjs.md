# ▲ Next.js — 2016

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Next.js es la forma en que **la mayoría de la gente usa React hoy**, y el
metaframework que convirtió el renderizado en servidor en la opción por omisión
de un ecosistema que llevaba años renderizando solo en el cliente.

También es el caso más claro del catálogo de una dimensión que casi ninguna
comparativa puntúa: **el acoplamiento a una plataforma concreta**.

> **🎯 Por qué está en este programa**
>
> **Porque toma por ti las ocho decisiones que React deja abiertas**
> ([módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)): enrutado,
> renderizado, datos, caché, construcción, despliegue, optimización de imágenes y
> límites cliente/servidor. Comparar «React» con «Angular» es incorrecto;
> comparar «Next.js» con «Angular» ya tiene sentido.
>
> **Y porque mezcla las cinco estrategias de renderizado en un mismo proyecto**
> ([módulo 04](../../curriculum/04-fullstack-y-renderizado.md)), que es
> exactamente lo que ese módulo pide hacer: decidir **por contenido**, no por
> aplicación.

| | |
|---|---|
| **Aparición** | 2016, creado por Vercel (entonces ZEIT) |
| **Clasificación** | `react-metaframework` |
| **Ecosistema** | JavaScript / TypeScript |
| **Licencia** | `MIT` |
| **Gobierno** | Vercel |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://nextjs.org/docs> |

---

## 📜 El problema que resolvió

Hacia 2016, una aplicación React típica era un archivo HTML casi vacío y un
paquete de JavaScript. Las consecuencias eran conocidas: primera pantalla en
blanco, indexación pobre y una experiencia mala en dispositivos modestos.

Renderizar en el servidor **se podía hacer** —React lo permitía— pero exigía
montar a mano el servidor, el enrutado, la división del paquete, la hidratación y
la sincronización de datos entre ambos lados. Muy pocos equipos lo hacían bien.

Next.js empaquetó todo eso con una convención simple: **un archivo en una
carpeta es una ruta**. A partir de ahí, el framework decide cómo se renderiza
cada una [@riva-nextjs].

## 💡 Las cinco estrategias en un mismo proyecto

Esta es su aportación más didáctica y la razón de que encaje tan bien con el
módulo 04. En el mismo repositorio conviven:

| Estrategia | Cuándo existe el HTML | Uso típico en un producto real |
| --- | --- | --- |
| Estático | Al construir | Portada, marketing, documentación |
| Estático con revalidación | Al construir, se renueva por tiempo o evento | Catálogo, listados |
| Servidor por petición | En cada petición | Panel personalizado |
| Cliente | Tras cargar el guion | Editores, zonas muy interactivas |
| Streaming | Por partes, según se resuelven | Páginas con una parte lenta |

El **enrutador de aplicación** llevó esto más lejos: por omisión, un componente
se ejecuta **solo en el servidor** y no llega al navegador salvo que se marque lo
contrario [@nextjs-app-router]. Es la misma inversión del valor por defecto que
propone [Astro](astro.md), aplicada dentro del modelo de React con
[componentes de servidor](react.md).

## ⚖️ Lo que hay que declarar antes de elegirlo

**1. El acoplamiento a la plataforma es la dimensión que casi nadie puntúa.**
Next.js es MIT y se puede desplegar en cualquier sitio, pero algunas capacidades
—revalidación bajo demanda, optimización de imágenes, funciones en el borde,
middleware— tienen su implementación más directa y mejor documentada en la
plataforma de quien lo desarrolla. Fuera de ahí funcionan, con más trabajo propio.

Eso no es una acusación: es exactamente el tipo de hecho que el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) obliga a
**escribir en el registro de decisión** en lugar de descubrir en la factura.

**2. El modelo mental es doble.** Con componentes de servidor y de cliente
conviviendo, hay que saber en todo momento **dónde se ejecuta** cada línea. Es
potente y es una fuente nueva de errores: importar en el servidor algo que espera
el navegador, o al revés.

**3. La caché ha cambiado varias veces.** Es la parte del framework que más ha
evolucionado, con comportamientos por omisión distintos entre versiones mayores.
Para un producto de vida larga, esa cadencia es un coste de mantenimiento que hay
que puntuar.

**4. Sobra para un sitio de contenidos.** Si la página es texto y no necesita
estado de cliente, Astro o un generador estático hacen el mismo trabajo enviando
mucho menos [@jamstack].

## 🧩 Cuando el producto crece: varios equipos, un frontend

En organizaciones grandes aparece un problema que ningún framework resuelve solo:
**varios equipos entregando en la misma interfaz**. Las arquitecturas de
micro-frontends abordan esa coordinación —integración en el servidor, en la
construcción o en tiempo de ejecución— y su coste real es organizativo antes que
técnico [@geers-micro-frontends], [@micro-frontends-org].

Es la ley de Conway en acción: la arquitectura acaba reflejando la estructura de
los equipos, y conviene decidir esa correspondencia en lugar de heredarla
[@skelton-team-topologies].

## 🎓 Las tres lecciones

**1. Un metaframework es «la biblioteca más ocho decisiones».** Compararlo con
una biblioteca suelta no es comparar cosas equivalentes.

**2. El acoplamiento a plataforma se puntúa antes, no después.** Preguntar «¿qué
capacidades funcionan igual fuera de su plataforma preferida?» es parte del
registro de decisión.

**3. Decidir el renderizado por contenido, no por aplicación.** Next.js lo
permite; el error caro es elegir una sola estrategia para todo el producto.

## 🔗 Enlaces

- Documentación oficial: <https://nextjs.org/docs>
- [Ficha de React](react.md) · [Ficha de Astro](astro.md) — el contrapunto
- [Módulo 04](../../curriculum/04-fullstack-y-renderizado.md)

## Fuentes

- [@riva-nextjs] Riva, Michele. *Real-World Next.js*. Packt Publishing, 2022. ISBN 9781801073493 — <https://openlibrary.org/isbn/9781801073493>
- [@geers-micro-frontends] Geers, Michael. *Micro Frontends in Action*. Manning, 2020. ISBN 9781617296871 — <https://openlibrary.org/isbn/9781617296871>
- [@skelton-team-topologies] Skelton, Matthew; Pais, Manuel. *Team Topologies*. IT Revolution Press, 2019. ISBN 9781942788812 — <https://openlibrary.org/isbn/9781942788812>
- [@nextjs-app-router] *Next.js App Router*, Vercel — Next.js — <https://nextjs.org/docs/app>
- [@jamstack] *Jamstack* — <https://jamstack.org/>
- [@micro-frontends-org] *Micro Frontends*, micro-frontends.org — <https://micro-frontends.org/>
