# 🟨 JavaScript y TypeScript

> [⬅️ Atlas](../README.md) · [🗂️ Índice](../frameworks.md) · [🧭 Taxonomía](../../docs/TAXONOMY.md)

**64 tecnologías, más que las de los otros doce ecosistemas juntos.** No es una
anomalía: es la consecuencia de una posición única. JavaScript es el **único
lenguaje que se ejecuta en el navegador de todo el mundo sin instalar nada**, y
desde 2009 también en el servidor. Esa doble ciudadanía explica casi todo lo que
sigue, incluida su fama de renovación agotadora.

## Por qué este ecosistema se mueve así

| Condición del lenguaje | Consecuencia en sus frameworks |
| --- | --- |
| Se ejecuta en un entorno que **no controlas** (el navegador del usuario) | El tamaño del paquete es una restricción de diseño, no una optimización posterior |
| **No se puede romper la web**: el lenguaje solo añade, nunca quita | La innovación ocurre en bibliotecas, no en el lenguaje; de ahí su número |
| El navegador **no tuvo módulos** hasta 2015 | Una generación entera de herramientas de construcción existe para tapar ese hueco |
| Publicar un paquete **no cuesta nada ni requiere revisión** | Enorme variedad y una superficie de cadena de suministro que el módulo 11 obliga a evaluar |
| El mismo lenguaje **en cliente y servidor** | Es el único ecosistema donde el metaframework tiene sentido pleno |

## La línea del tiempo, en cuatro saltos

**2005-2009 · Normalizar el navegador.** Los navegadores eran incompatibles entre
sí de forma grotesca. Prototype, MooTools, Dojo y sobre todo **jQuery**
existieron para que `$("#x").hide()` funcionara igual en todas partes. jQuery
ganó por su ecosistema de complementos, no por ser el más elegante. Buena parte
de lo que hoy es API nativa —`querySelectorAll`, `fetch`, `classList`— entró
primero como idea suya.

**2010-2015 · El estado se muda al navegador.** Con aplicaciones cada vez más
ricas, manipular el DOM a mano dejó de escalar: la vista y los datos se
desincronizaban. **Backbone** propuso separar modelo y vista; **Knockout** trajo
los observables; **AngularJS** juntó inyección de dependencias y enlace
bidireccional. Y entonces **React** invirtió el planteamiento: en lugar de
sincronizar, **volver a describir la interfaz entera** en función del estado y
dejar que una capa intermedia calcule el mínimo cambio.

**2016-2021 · El metaframework.** Renderizar solo en el cliente tenía un coste
visible: pantallas en blanco, indexación pobre, primeros segundos lentos.
**Next.js**, **Nuxt** y **SvelteKit** reunificaron cliente y servidor bajo un
mismo enrutado. El precio fue nuevo y poco discutido al principio: acoplamiento
a plataformas concretas y el coste de **hidratación** que el
[módulo 04](../../curriculum/04-fullstack-y-renderizado.md) enseña a medir.

**2022-2026 · Islas, señales y vuelta del hipermedia.** Tres respuestas distintas
al mismo exceso. **Astro** no envía JavaScript salvo donde se declare
explícitamente. **SolidJS** y **Svelte 5** recuperan las señales de Knockout con
mejor ergonomía. **htmx** y **Turbo** devuelven el estado al servidor y usan HTML
como formato de respuesta — que es, exactamente, lo que se hacía antes de 2005.

## La fatiga, explicada sin queja

«Cansancio de JavaScript» suele contarse como un defecto moral del ecosistema. Es
más sencillo: **es lo que ocurre cuando un espacio con muchísimos participantes
explora en paralelo un problema mal resuelto**. Los otros ecosistemas exploran
más despacio porque tienen menos gente, o porque un proveedor único decide la
dirección, o porque su lenguaje ya resolvía parte del problema.

La consecuencia práctica para quien elige está en el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md): en este ecosistema
más que en ningún otro, **la salud del proyecto y la estrategia de salida pesan
más que la elegancia de la API**.

## Frontera que se confunde a diario

- **React no es un framework.** Es una biblioteca de interfaz: no arranca tu
  aplicación, no define su ciclo de vida y no trae enrutado ni datos. Comparar
  React con Angular es comparar una pieza con un producto completo.
- **Next.js no es React.** Es un metaframework *sobre* React, con su propio
  servidor, su construcción y su caché. Sin React no existe.
- **Node.js no es un framework.** Es el runtime: quien ejecuta a todos los demás.
- **Vite no es un framework.** Es una herramienta de construcción, y hoy la base
  de casi todos los metaframeworks.

## Las 64 tecnologías

<!-- generado:tabla-ecosistema javascript -->
| Tecnología | Clasificación | Desde | Era | Estado | Licencia | Documentación |
| --- | --- | ---: | --- | --- | --- | --- |
| [**Backbone.js**](../fichas/backbone.md) | `mv-library` | 2010 | 🌱 Pionero | 🟡 mantenimiento | `MIT` | [oficial](https://backbonejs.org/) |
| **Apache Cordova** | `runtime-bridge` | 2009 | 🌱 Pionero | 🟡 mantenimiento | `Apache-2.0` | [oficial](https://cordova.apache.org/docs/en/latest/) |
| **Dojo Toolkit** | `ui-toolkit` | 2004 | 🌱 Pionero | 🟡 mantenimiento | `BSD-3-Clause` | [oficial](https://dojotoolkit.org/documentation/) |
| [**jQuery**](../fichas/jquery.md) | `dom-library` | 2006 | 🌱 Pionero | 🟡 mantenimiento | `MIT` | [oficial](https://api.jquery.com/) |
| [**Knockout**](../fichas/knockout.md) | `mvvm-library` | 2010 | 🌱 Pionero | 🟡 mantenimiento | `MIT` | [oficial](https://knockoutjs.com/documentation/introduction.html) |
| **MooTools** | `dom-library` | 2006 | 🌱 Pionero | ⚪ histórico | `MIT` | [oficial](https://mootools.net/) |
| **Prototype** | `dom-library` | 2005 | 🌱 Pionero | ⚪ histórico | `MIT` | [oficial](https://github.com/prototypejs/prototype) |
| [**AngularJS**](../fichas/angularjs.md) | `web-framework` | 2010 | 🏛️ Clásico | ⚪ histórico | `MIT` | [oficial](https://docs.angularjs.org/guide) |
| **Aurelia** | `web-framework` | 2015 | 🏛️ Clásico | 🟡 mantenimiento | `MIT` | [oficial](https://docs.aurelia.io/) |
| [**Ember.js**](../fichas/ember.md) | `web-framework` | 2011 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://guides.emberjs.com/release/) |
| [**Express**](../fichas/express.md) | `web-framework` | 2010 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://expressjs.com/) |
| **Ext JS** | `ui-toolkit` | 2007 | 🏛️ Clásico | 🟢 activo | `NOASSERTION` | [oficial](https://docs.sencha.com/extjs/) |
| [**Gatsby**](../fichas/gatsby.md) | `react-metaframework` | 2015 | 🏛️ Clásico | 🟡 mantenimiento | `MIT` | [oficial](https://www.gatsbyjs.com/docs/) |
| **hapi** | `web-framework` | 2011 | 🏛️ Clásico | 🟢 activo | `BSD-3-Clause` | [oficial](https://hapi.dev/) |
| **Ionic** | `ui-toolkit` | 2013 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://ionicframework.com/docs) |
| **Koa** | `web-framework` | 2013 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://koajs.com/) |
| **Marko** | `ui-framework` | 2014 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://markojs.com/docs/) |
| **Mithril** | `ui-framework` | 2014 | 🏛️ Clásico | 🟡 mantenimiento | `MIT` | [oficial](https://mithril.js.org/) |
| **NativeScript** | `ui-framework` | 2014 | 🏛️ Clásico | 🟢 activo | `Apache-2.0` | [oficial](https://docs.nativescript.org/) |
| **Rollup** | `build-tool` | 2015 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://rollupjs.org/introduction/) |
| **Sails.js** | `full-stack-framework` | 2012 | 🏛️ Clásico | 🟡 mantenimiento | `MIT` | [oficial](https://sailsjs.com/documentation) |
| **Socket.IO** | `realtime-library` | 2010 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://socket.io/docs/v4/) |
| **TypeORM** | `orm` | 2016 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://typeorm.io/) |
| **webpack** | `build-tool` | 2012 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://webpack.js.org/concepts/) |
| **AdonisJS** | `full-stack-framework` | 2015 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://docs.adonisjs.com/guides/preface/introduction) |
| [**Alpine.js**](../fichas/alpinejs.md) | `dom-library` | 2019 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://alpinejs.dev/start-here) |
| [**Angular**](../fichas/angular.md) | `web-framework` | 2016 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://angular.dev/) |
| [**Astro**](../fichas/astro.md) | `web-metaframework` | 2021 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://docs.astro.build/) |
| **Capacitor** | `runtime-bridge` | 2019 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://capacitorjs.com/docs) |
| **Deno** | `runtime` | 2018 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://docs.deno.com/) |
| **Docusaurus** | `documentation-framework` | 2017 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://docusaurus.io/docs) |
| [**Electron**](../fichas/electron.md) | `desktop-runtime` | 2013 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://www.electronjs.org/docs/latest/) |
| **Eleventy** | `static-site-generator` | 2018 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://www.11ty.dev/docs/) |
| **Fastify** | `web-framework` | 2016 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://fastify.dev/docs/latest/) |
| **Turbo (Hotwire)** | `hypermedia-library` | 2021 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://turbo.hotwired.dev/handbook/introduction) |
| [**htmx**](../fichas/htmx.md) | `hypermedia-library` | 2020 | 🟢 Vigente | 🟢 activo | `BSD-2-Clause` | [oficial](https://htmx.org/docs/) |
| [**Lit**](../fichas/lit.md) | `web-components-library` | 2021 | 🟢 Vigente | 🟢 activo | `BSD-3-Clause` | [oficial](https://lit.dev/docs/) |
| [**NestJS**](../fichas/nestjs.md) | `application-framework` | 2017 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://docs.nestjs.com/) |
| [**Next.js**](../fichas/nextjs.md) | `react-metaframework` | 2016 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://nextjs.org/docs) |
| **Nitro** | `server-toolkit` | 2021 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://nitro.build/guide) |
| [**Node.js**](../fichas/nodejs.md) | `runtime` | 2009 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://nodejs.org/docs/latest-v22.x/api/) |
| **Nuxt** | `vue-metaframework` | 2016 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://nuxt.com/docs) |
| [**Preact**](../fichas/preact.md) | `ui-library` | 2015 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://preactjs.com/guide/v10/getting-started/) |
| **Prisma ORM** | `orm` | 2021 | 🟢 Vigente | 🟢 activo | `Apache-2.0` | [oficial](https://www.prisma.io/docs) |
| [**React**](../fichas/react.md) | `ui-library` | 2013 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://react.dev/) |
| [**React Native**](../fichas/react-native.md) | `ui-framework` | 2015 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://reactnative.dev/docs/getting-started) |
| **React Router** | `routing-library` | 2014 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://reactrouter.com/) |
| **Remix** | `react-metaframework` | 2021 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://remix.run/docs) |
| **SolidJS** | `ui-library` | 2018 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://docs.solidjs.com/) |
| **Stimulus** | `dom-library` | 2018 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://stimulus.hotwired.dev/handbook/introduction) |
| [**Svelte**](../fichas/svelte.md) | `ui-framework` | 2016 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://svelte.dev/docs/svelte) |
| **SvelteKit** | `svelte-metaframework` | 2022 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://svelte.dev/docs/kit) |
| **tRPC** | `rpc-library` | 2020 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://trpc.io/docs) |
| [**Vite**](../fichas/vite.md) | `build-tool` | 2020 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://vite.dev/guide/) |
| **VitePress** | `documentation-framework` | 2022 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://vitepress.dev/) |
| [**Vue**](../fichas/vue.md) | `web-framework` | 2014 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://vuejs.org/guide/) |
| **Analog** | `angular-metaframework` | 2023 | 🌊 Emergente | 🟢 activo | `MIT` | [oficial](https://analogjs.org/docs) |
| **Bun** | `runtime` | 2022 | 🌊 Emergente | 🟢 activo | `MIT` | [oficial](https://bun.com/docs) |
| **Drizzle ORM** | `orm` | 2022 | 🌊 Emergente | 🟢 activo | `Apache-2.0` | [oficial](https://orm.drizzle.team/docs/overview) |
| **Elysia** | `web-framework` | 2022 | 🌊 Emergente | 🟢 activo | `MIT` | [oficial](https://elysiajs.com/) |
| **Hono** | `web-framework` | 2021 | 🌊 Emergente | 🟢 activo | `MIT` | [oficial](https://hono.dev/docs/) |
| [**Qwik**](../fichas/qwik.md) | `ui-framework` | 2021 | 🌊 Emergente | 🟢 activo | `MIT` | [oficial](https://qwik.dev/docs/) |
| **RedwoodJS** | `full-stack-framework` | 2020 | 🌊 Emergente | 🟢 activo | `MIT` | [oficial](https://redwoodjs.com/docs) |
| **SolidStart** | `solid-metaframework` | 2024 | 🌊 Emergente | 🟢 activo | `MIT` | [oficial](https://docs.solidjs.com/solid-start) |
<!-- fin -->

## Qué aportó cada una

<!-- generado:notas-ecosistema javascript -->
- **Backbone.js** — Primera estructura ampliamente adoptada para separar modelo y vista en el navegador. Dejó al descubierto el problema que resolverían los frameworks siguientes: sincronizar vista y estado a mano no escala.
- **Apache Cordova** — El primer puente masivo entre la web y el móvil, conocido antes como PhoneGap. Definió el debate híbrido frente a nativo.
- **Dojo Toolkit** — Trajo módulos, carga asíncrona y widgets de escritorio a la web años antes de que el lenguaje tuviera módulos propios.
- **jQuery** — Normalizó un DOM incompatible entre navegadores y popularizó el encadenamiento y los selectores CSS en JavaScript. Buena parte de lo que hoy es API nativa del navegador entró primero como idea suya.
- **Knockout** — Introdujo el enlace declarativo de datos y los observables en el navegador, la idea que hoy reaparece como «señales».
- **MooTools** — Competidor directo de jQuery con un modelo de clases propio. Su declive muestra que ganar en elegancia no basta frente a un ecosistema de complementos mayor.
- **Prototype** — Extendía los prototipos nativos del lenguaje. Enseñó por la vía dura por qué modificar objetos globales rompe la interoperabilidad entre bibliotecas.
- **AngularJS** — Popularizó la inyección de dependencias y el enlace bidireccional en el cliente. Su reescritura incompatible como Angular 2 es el caso de estudio más citado sobre coste de migración.
- **Aurelia** — Nació del desacuerdo con la dirección de Angular 2. Apostó por estándares del lenguaje frente a sintaxis propia.
- **Ember.js** — Convención sobre configuración llevada al cliente, con una política de versiones y migraciones ejemplar: sus guías de actualización son mejores que las de proyectos mucho mayores.
- **Express** — Definió el modelo de middleware encadenado que copiaron casi todos los frameworks de Node.js. Minimalista no significa biblioteca: posee el bucle de peticiones.
- **Ext JS** — Componentes de tipo escritorio para aplicaciones internas. Ejemplo de licencia comercial en un espacio dominado por el código abierto: la estrategia de salida importa más aquí que en ningún otro.
- **Gatsby** — Popularizó la generación estática con GraphQL como capa de datos unificada. Su declive ilustra el riesgo de una capa de abstracción que hay que aprender aparte.
- **hapi** — Configuración sobre código: las rutas se declaran como datos. Nació en un entorno de comercio electrónico de alta carga.
- **Ionic** — Componentes con aspecto nativo sobre tecnología web, agnósticos del framework de interfaz que uses.
- **Koa** — Escrito por el equipo de Express para sustituir las devoluciones de llamada por funciones asíncronas y middleware en forma de cebolla.
- **Marko** — Renderizado en servidor con hidratación parcial años antes de que la idea se generalizara con el nombre de «islas».
- **Mithril** — Enrutado, peticiones y vistas en pocos kilobytes. Recuerda que un framework completo no tiene por qué ser grande.
- **NativeScript** — Acceso directo a las API nativas desde JavaScript, sin puente de serialización.
- **Rollup** — Introdujo la eliminación de código no usado a partir de módulos estáticos, hoy una expectativa básica.
- **Sails.js** — Intento temprano de llevar las convenciones de Rails a Node.js, con generación automática de API a partir de modelos.
- **Socket.IO** — Abstrae el tiempo real con reconexión y respaldo automáticos. Popularizó los eventos bidireccionales antes de que WebSocket fuera universal.
- **TypeORM** — Ofrece a la vez registro activo y mapeador de datos, lo que lo hace útil para comparar ambos patrones en un mismo proyecto.
- **webpack** — Hizo posible tratar cualquier recurso como módulo. Su complejidad de configuración motivó la generación siguiente de herramientas.
- **AdonisJS** — El equivalente de Laravel en TypeScript: ORM, autenticación, validación y colas en el mismo producto.
- **Alpine.js** — Comportamiento declarativo en atributos HTML, sin fase de construcción. Recupera el modelo de trabajo de jQuery con el vocabulario reactivo moderno.
- **Angular** — Framework completo con contenedor de dependencias, enrutado, formularios y herramientas en la caja. La opinión arquitectónica más fuerte del ecosistema JavaScript.
- **Astro** — Arquitectura de islas: por omisión no envía JavaScript y cada componente interactivo se declara explícitamente. Permite mezclar React, Vue y Svelte en la misma página, lo que lo hace un banco de pruebas ideal para comparar.
- **Capacitor** — Empaqueta una aplicación web como aplicación nativa y expone las capacidades del dispositivo. Sucesor espiritual de Cordova.
- **Deno** — Creado por el autor de Node.js para corregir sus decisiones iniciales: permisos explícitos, TypeScript integrado y API estándar de la web.
- **Docusaurus** — Framework especializado en documentación técnica, con versionado e internacionalización incluidos.
- **Electron** — Empaqueta un navegador completo con la aplicación: máxima compatibilidad, a cambio de tamaño y memoria.
- **Eleventy** — Generador estático sin cliente por omisión y con múltiples lenguajes de plantilla. El contrapunto minimalista a los metaframeworks.
- **Fastify** — Validación y serialización derivadas de JSON Schema, con un sistema de plugins con encapsulamiento explícito.
- **Turbo (Hotwire)** — Navegación y actualizaciones parciales sin escribir JavaScript de aplicación. La estrategia de Rails frente a la aplicación de página única.
- **htmx** — Devuelve el estado al servidor: el HTML es la respuesta y los atributos deciden qué fragmento se reemplaza. Demuestra que la evolución del campo no es una línea recta hacia el cliente.
- **Lit** — Capa mínima sobre los componentes web del propio estándar. La apuesta por la plataforma en lugar de por el framework.
- **NestJS** — Trae a Node.js el modelo de Angular y Spring: módulos, decoradores e inyección de dependencias por constructor.
- **Next.js** — Convirtió el renderizado en servidor en la opción por omisión del ecosistema React. Su acoplamiento con una plataforma concreta es la dimensión que el módulo 11 obliga a puntuar.
- **Nitro** — Motor de servidor con adaptadores de despliegue, extraído de Nuxt y hoy compartido por varios metaframeworks.
- **Node.js** — Llevó JavaScript al servidor con un bucle de eventos no bloqueante. No es un framework: es quien ejecuta a todos los de su columna.
- **Nuxt** — El equivalente de Next.js sobre Vue, con un motor de servidor propio reutilizable fuera del framework.
- **Preact** — Reimplementación compatible con una fracción del tamaño. Útil para razonar sobre cuánto del peso de una biblioteca es esencial y cuánto es accidental.
- **Prisma ORM** — Esquema propio del que se genera un cliente tipado. Un lenguaje más que aprender, a cambio de tipos exactos.
- **React** — Impuso la idea de la interfaz como función del estado y el árbol virtual. Es una biblioteca, no un framework: no arranca tu aplicación ni define su ciclo de vida.
- **React Native** — Usa componentes nativos reales desde JavaScript. El coste del puente entre ambos mundos es su compromiso característico.
- **React Router** — El enrutador de facto del ecosistema React durante una década, hoy también metaframework.
- **Remix** — Apostó por los estándares de la plataforma web —formularios, respuestas, caché— frente a abstracciones propias. Su fusión con React Router es un ejemplo de convergencia entre proyectos.
- **SolidJS** — Reactividad de grano fino sin árbol virtual: el componente se ejecuta una vez y solo se actualiza lo que leyó el valor cambiado.
- **Stimulus** — Conecta comportamiento a HTML que ya existe, sin poseerlo. Diseñado para acompañar al renderizado en servidor, no para sustituirlo.
- **Svelte** — Mueve el trabajo del navegador al compilador. Cambia el coste de ejecución por dependencia de la fase de construcción: un compromiso, no una mejora gratuita.
- **SvelteKit** — Enrutado por sistema de archivos y adaptadores de despliegue intercambiables, que es una estrategia de salida incorporada al diseño.
- **tRPC** — Elimina el esquema intermedio compartiendo tipos entre cliente y servidor. El compromiso es explícito: solo sirve si ambos extremos son tuyos y hablan TypeScript.
- **Vite** — Servidor de desarrollo con módulos nativos y empaquetado solo para producción. Hoy es la base de la mayoría de los metaframeworks.
- **VitePress** — Documentación sobre Vue y Vite, con hidratación mínima. La documentación oficial de muchos proyectos del ecosistema usa este generador.
- **Vue** — Adopción progresiva: sirve como etiqueta en una página existente o como framework completo. Su reactividad fina influyó en toda la generación siguiente.
- **Analog** — Lleva el modelo de metaframework al ecosistema Angular, que llegó tarde a esa idea.
- **Bun** — Runtime, gestor de paquetes, empaquetador y ejecutor de pruebas en un solo binario. Compite en tiempo de arranque y de instalación.
- **Drizzle ORM** — Define el esquema en TypeScript y mantiene las consultas próximas al SQL, sin capa de traducción oculta.
- **Elysia** — Aprovecha el sistema de tipos para derivar validación y cliente tipado desde la definición de la ruta.
- **Hono** — Diseñado para ejecutarse sobre las API estándar de la web, lo que le permite correr en múltiples runtimes sin adaptador.
- **Qwik** — Ataca el coste de hidratación reanudando el estado del servidor en lugar de reconstruirlo. Es la respuesta más radical al problema que el módulo 04 mide.
- **RedwoodJS** — Intento de traer a JavaScript la integración completa de Rails: generadores, capas y convenciones en un solo producto.
- **SolidStart** — Metaframework de SolidJS construido sobre el mismo motor de servidor que Nuxt, un caso claro de reutilización entre ecosistemas rivales.
<!-- fin -->

## Para seguir

- [Ficha de jQuery](../fichas/jquery.md) — la más influyente y la peor entendida.
- [Ficha de Astro](../fichas/astro.md) — la arquitectura de islas explicada.
- [Módulo 03](../../curriculum/03-frontend-componentes-y-estado.md) — componentes y estado sin depender del framework.
- [Módulo 04](../../curriculum/04-fullstack-y-renderizado.md) — cuándo existe el HTML y qué cuesta cada respuesta.
