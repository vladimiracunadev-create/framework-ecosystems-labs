# Índice del Atlas

> [⬅️ Atlas](README.md) · [📚 Programa](../curriculum/README.md) · [🧭 Taxonomía](../docs/TAXONOMY.md)

Documento generado por `node scripts/generate-atlas.mjs`. No editar a mano.

**138 tecnologías** registradas en [`catalog/frameworks.json`](../catalog/frameworks.json), verificadas el **2026-08-19**.

Estar en el Atlas no es una recomendación. Es una afirmación más modesta y más útil:
esta tecnología existió o existe, hizo algo reconocible, y aquí está su documentación oficial.

## Reparto

| Familia | Tecnologías | Pioneras | Clásicas | Vigentes | Emergentes |
| --- | ---: | ---: | ---: | ---: | ---: |
| [JavaScript y TypeScript](ecosistemas/javascript.md) | 64 | 7 | 17 | 32 | 8 |
| [Python](ecosistemas/python.md) | 12 | 1 | 7 | 3 | 1 |
| [PHP](ecosistemas/php.md) | 12 | 2 | 8 | 2 | 0 |
| [JVM — Java, Kotlin, Scala y Groovy](ecosistemas/jvm.md) | 14 | 1 | 7 | 5 | 1 |
| [.NET y C#](ecosistemas/dotnet.md) | 10 | 1 | 3 | 6 | 0 |
| [Go](ecosistemas/go.md) | 7 | 0 | 1 | 6 | 0 |
| [Rust](ecosistemas/rust.md) | 6 | 0 | 0 | 5 | 1 |
| [Ruby](ecosistemas/ruby.md) | 5 | 0 | 4 | 1 | 0 |
| [BEAM — Elixir y Erlang](ecosistemas/beam.md) | 2 | 0 | 0 | 2 | 0 |
| [Dart](ecosistemas/dart.md) | 1 | 0 | 0 | 1 | 0 |
| [Plataformas de Apple](ecosistemas/apple.md) | 2 | 0 | 1 | 1 | 0 |
| [Escritorio nativo — C y C++](ecosistemas/nativo.md) | 2 | 0 | 2 | 0 | 0 |
| [Plataformas de ejecución](ecosistemas/cloud.md) | 1 | 0 | 0 | 1 | 0 |
| **Total** | **138** | **12** | **50** | **65** | **11** |

## Por clasificación

Esta tabla es el ejercicio del módulo 00 aplicado a todo el catálogo: **nada de esto
son sinónimos**, y las comparaciones entre columnas distintas rara vez significan algo.

La definición de cada etiqueta vive en `catalog/frameworks.json`, junto a los datos
que clasifica, para que no puedan separarse. Es el vocabulario que usa la columna
«Categoría» de todas las clases del programa.

| Clasificación | Cuántas | Qué significa | Ejemplos |
| --- | ---: | --- | --- |
| `angular-metaframework` | 1 | Metaframework construido sobre Angular: le añade rutas de servidor, renderizado y compilación. | Analog |
| `application-framework` | 8 | Framework de aplicación de servidor: además del transporte, gobierna módulos, dependencias y ciclo de vida. | NestJS, Dropwizard, Spring Framework, Micronaut |
| `asgi-toolkit` | 1 | Piezas sueltas sobre la interfaz ASGI de Python. No arranca tu aplicación: la compones tú. | Starlette |
| `build-tool` | 4 | Herramienta de construcción: resuelve dependencias, transforma y empaqueta. No corre en producción. | esbuild, Rollup, webpack, Vite |
| `cms` | 2 | Producto configurable para gestionar contenido. Se administra más que se programa. | Drupal, WordPress |
| `component-framework` | 3 | Modelo de componentes con estado en el servidor que se sincroniza con el navegador. | ASP.NET Web Forms, Blazor, Jakarta Faces (JSF) |
| `desktop-runtime` | 2 | Envuelve una aplicación web en un ejecutable de escritorio con acceso al sistema. | Electron, Tauri |
| `documentation-framework` | 2 | Generador de sitios de documentación: navegación, búsqueda y versiones ya resueltas. | Docusaurus, VitePress |
| `dom-library` | 5 | Biblioteca que manipula el árbol del documento. La llamas tú; no controla el ciclo de vida. | jQuery, MooTools, Prototype, Alpine.js |
| `full-stack-framework` | 12 | Framework que cubre de la petición a la base y a la vista, con convenciones para todo el camino. | Phoenix, Beego, Sails.js, AdonisJS |
| `http-toolkit` | 1 | Piezas de cliente y servidor HTTP que se ensamblan a mano. | aiohttp |
| `hypermedia-library` | 2 | Extiende el HTML para que la propia página describa sus interacciones, sin escribir cliente. | Turbo (Hotwire), htmx |
| `micro-orm` | 1 | Mapea filas a objetos y nada más: sin seguimiento de cambios ni unidad de trabajo. | Dapper |
| `mv-library` | 1 | Biblioteca de modelo y vista de la primera generación, anterior a los frameworks reactivos. | Backbone.js |
| `mvvm-library` | 1 | Biblioteca de enlace bidireccional entre vista y modelo de vista. | Knockout |
| `orm` | 8 | Mapea entidades a tablas y coordina la persistencia: seguimiento de cambios, relaciones y migraciones. | Entity Framework Core, TypeORM, Prisma ORM, Drizzle ORM |
| `platform` | 1 | Plataforma de ejecución y despliegue. No es un framework: es dónde corre lo que escribes. | Kubernetes |
| `react-metaframework` | 3 | Metaframework construido sobre React: rutas, renderizado en servidor y compilación. | Gatsby, Next.js, Remix |
| `reactive-toolkit` | 1 | Piezas asíncronas y reactivas sobre la JVM, ensamblables sin imponer una arquitectura. | Eclipse Vert.x |
| `realtime-library` | 1 | Biblioteca de mensajería bidireccional entre navegador y servidor. | Socket.IO |
| `realtime-ui-framework` | 1 | La interfaz vive en el servidor y solo viajan las diferencias por una conexión persistente. | Phoenix LiveView |
| `routing-library` | 2 | Resuelve el encaminamiento y nada más. Se combina con lo demás. | chi, React Router |
| `rpc-library` | 1 | Llamadas a procedimientos remotos con tipos compartidos entre cliente y servidor. | tRPC |
| `runtime` | 3 | Ejecuta el código y ofrece los servicios base. Un framework corre encima; un runtime no es un framework. | Deno, Node.js, Bun |
| `runtime-bridge` | 2 | Puente que da a una aplicación web acceso a las capacidades nativas del dispositivo. | Apache Cordova, Capacitor |
| `server-toolkit` | 1 | Capa de servidor reutilizable sobre la que se apoyan otros metaframeworks. | Nitro |
| `solid-metaframework` | 1 | Metaframework construido sobre SolidJS. | SolidStart |
| `static-site-generator` | 3 | Genera HTML en la construcción. En producción no hay proceso que responda. | Hugo, Eleventy, Jekyll |
| `svelte-metaframework` | 1 | Metaframework construido sobre Svelte. | SvelteKit |
| `ui-framework` | 19 | Framework de interfaz: posee el ciclo de render y define cómo se estructura la aplicación de cliente. | WPF, Xamarin, Avalonia, .NET MAUI |
| `ui-library` | 3 | Biblioteca de interfaz: renderiza componentes y nada más. No arranca la aplicación ni define su ciclo. | Preact, React, SolidJS |
| `ui-sdk` | 1 | Kit completo de interfaz con su propio motor de dibujo, independiente de los controles del sistema. | Flutter |
| `ui-toolkit` | 8 | Conjunto de componentes y modelo de interfaz para una plataforma concreta. | UIKit, SwiftUI, Dojo Toolkit, Ext JS |
| `vue-metaframework` | 1 | Metaframework construido sobre Vue. | Nuxt |
| `web-components-library` | 1 | Biblioteca para escribir componentes web estándar del navegador. | Lit |
| `web-framework` | 29 | Framework de servidor que posee el bucle de peticiones: encamina, ejecuta tu manejador y responde. | ASP.NET MVC, ASP.NET Core, Echo, Fiber |
| `web-metaframework` | 1 | Metaframework que integra varias bibliotecas de interfaz en un mismo sitio. | Astro |

## Todas las tecnologías

### JavaScript y TypeScript

Contexto y genealogía: [javascript.md](ecosistemas/javascript.md).

| Tecnología | Clasificación | Desde | Era | Estado | Licencia | Documentación |
| --- | --- | ---: | --- | --- | --- | --- |
| [**Backbone.js**](fichas/backbone.md) | `mv-library` | 2010 | 🌱 Pionero | 🟡 mantenimiento | `MIT` | [oficial](https://backbonejs.org/) |
| [**Apache Cordova**](fichas/cordova.md) | `runtime-bridge` | 2009 | 🌱 Pionero | 🟡 mantenimiento | `Apache-2.0` | [oficial](https://cordova.apache.org/docs/en/latest/) |
| [**Dojo Toolkit**](fichas/dojo.md) | `ui-toolkit` | 2004 | 🌱 Pionero | 🟡 mantenimiento | `BSD-3-Clause` | [oficial](https://dojotoolkit.org/documentation/) |
| [**jQuery**](fichas/jquery.md) | `dom-library` | 2006 | 🌱 Pionero | 🟡 mantenimiento | `MIT` | [oficial](https://api.jquery.com/) |
| [**Knockout**](fichas/knockout.md) | `mvvm-library` | 2010 | 🌱 Pionero | 🟡 mantenimiento | `MIT` | [oficial](https://knockoutjs.com/documentation/introduction.html) |
| [**MooTools**](fichas/mootools.md) | `dom-library` | 2006 | 🌱 Pionero | ⚪ histórico | `MIT` | [oficial](https://mootools.net/) |
| [**Prototype**](fichas/prototype-js.md) | `dom-library` | 2005 | 🌱 Pionero | ⚪ histórico | `MIT` | [oficial](https://github.com/prototypejs/prototype) |
| [**AngularJS**](fichas/angularjs.md) | `ui-framework` | 2010 | 🏛️ Clásico | ⚪ histórico | `MIT` | [oficial](https://docs.angularjs.org/guide) |
| [**Aurelia**](fichas/aurelia.md) | `ui-framework` | 2015 | 🏛️ Clásico | 🟡 mantenimiento | `MIT` | [oficial](https://docs.aurelia.io/) |
| [**Ember.js**](fichas/ember.md) | `ui-framework` | 2011 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://guides.emberjs.com/release/) |
| [**Express**](fichas/express.md) | `web-framework` | 2010 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://expressjs.com/) |
| [**Ext JS**](fichas/extjs.md) | `ui-toolkit` | 2007 | 🏛️ Clásico | 🟢 activo | `NOASSERTION` | [oficial](https://docs.sencha.com/extjs/) |
| [**Gatsby**](fichas/gatsby.md) | `react-metaframework` | 2015 | 🏛️ Clásico | 🟡 mantenimiento | `MIT` | [oficial](https://www.gatsbyjs.com/docs/) |
| [**hapi**](fichas/hapi.md) | `web-framework` | 2011 | 🏛️ Clásico | 🟢 activo | `BSD-3-Clause` | [oficial](https://hapi.dev/) |
| [**Ionic**](fichas/ionic.md) | `ui-toolkit` | 2013 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://ionicframework.com/docs) |
| [**Koa**](fichas/koa.md) | `web-framework` | 2013 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://koajs.com/) |
| [**Marko**](fichas/marko.md) | `ui-framework` | 2014 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://markojs.com/docs/) |
| [**Mithril**](fichas/mithril.md) | `ui-framework` | 2014 | 🏛️ Clásico | 🟡 mantenimiento | `MIT` | [oficial](https://mithril.js.org/) |
| [**NativeScript**](fichas/nativescript.md) | `ui-framework` | 2014 | 🏛️ Clásico | 🟢 activo | `Apache-2.0` | [oficial](https://docs.nativescript.org/) |
| [**Rollup**](fichas/rollup.md) | `build-tool` | 2015 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://rollupjs.org/introduction/) |
| [**Sails.js**](fichas/sails.md) | `full-stack-framework` | 2012 | 🏛️ Clásico | 🟡 mantenimiento | `MIT` | [oficial](https://sailsjs.com/documentation) |
| [**Socket.IO**](fichas/socketio.md) | `realtime-library` | 2010 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://socket.io/docs/v4/) |
| [**TypeORM**](fichas/typeorm.md) | `orm` | 2016 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://typeorm.io/) |
| [**webpack**](fichas/webpack.md) | `build-tool` | 2012 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://webpack.js.org/concepts/) |
| [**AdonisJS**](fichas/adonisjs.md) | `full-stack-framework` | 2015 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://docs.adonisjs.com/guides/preface/introduction) |
| [**Alpine.js**](fichas/alpinejs.md) | `dom-library` | 2019 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://alpinejs.dev/start-here) |
| [**Angular**](fichas/angular.md) | `ui-framework` | 2016 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://angular.dev/) |
| [**Astro**](fichas/astro.md) | `web-metaframework` | 2021 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://docs.astro.build/) |
| [**Capacitor**](fichas/capacitor.md) | `runtime-bridge` | 2019 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://capacitorjs.com/docs) |
| [**Deno**](fichas/deno.md) | `runtime` | 2018 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://docs.deno.com/) |
| [**Docusaurus**](fichas/docusaurus.md) | `documentation-framework` | 2017 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://docusaurus.io/docs) |
| [**Electron**](fichas/electron.md) | `desktop-runtime` | 2013 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://www.electronjs.org/docs/latest/) |
| [**Eleventy**](fichas/eleventy.md) | `static-site-generator` | 2018 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://www.11ty.dev/docs/) |
| [**Fastify**](fichas/fastify.md) | `web-framework` | 2016 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://fastify.dev/docs/latest/) |
| [**Turbo (Hotwire)**](fichas/hotwire-turbo.md) | `hypermedia-library` | 2021 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://turbo.hotwired.dev/handbook/introduction) |
| [**htmx**](fichas/htmx.md) | `hypermedia-library` | 2020 | 🟢 Vigente | 🟢 activo | `BSD-2-Clause` | [oficial](https://htmx.org/docs/) |
| [**Lit**](fichas/lit.md) | `web-components-library` | 2021 | 🟢 Vigente | 🟢 activo | `BSD-3-Clause` | [oficial](https://lit.dev/docs/) |
| [**NestJS**](fichas/nestjs.md) | `application-framework` | 2017 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://docs.nestjs.com/) |
| [**Next.js**](fichas/nextjs.md) | `react-metaframework` | 2016 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://nextjs.org/docs) |
| [**Nitro**](fichas/nitro.md) | `server-toolkit` | 2021 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://nitro.build/guide) |
| [**Node.js**](fichas/nodejs.md) | `runtime` | 2009 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://nodejs.org/docs/latest-v22.x/api/) |
| [**Nuxt**](fichas/nuxt.md) | `vue-metaframework` | 2016 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://nuxt.com/docs) |
| [**Preact**](fichas/preact.md) | `ui-library` | 2015 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://preactjs.com/guide/v10/getting-started/) |
| [**Prisma ORM**](fichas/prisma.md) | `orm` | 2021 | 🟢 Vigente | 🟢 activo | `Apache-2.0` | [oficial](https://www.prisma.io/docs) |
| [**React**](fichas/react.md) | `ui-library` | 2013 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://react.dev/) |
| [**React Native**](fichas/react-native.md) | `ui-framework` | 2015 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://reactnative.dev/docs/getting-started) |
| [**React Router**](fichas/react-router.md) | `routing-library` | 2014 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://reactrouter.com/) |
| [**Remix**](fichas/remix.md) | `react-metaframework` | 2021 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://remix.run/docs) |
| [**SolidJS**](fichas/solid.md) | `ui-library` | 2018 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://docs.solidjs.com/) |
| [**Stimulus**](fichas/stimulus.md) | `dom-library` | 2018 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://stimulus.hotwired.dev/handbook/introduction) |
| [**Svelte**](fichas/svelte.md) | `ui-framework` | 2016 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://svelte.dev/docs/svelte) |
| [**SvelteKit**](fichas/sveltekit.md) | `svelte-metaframework` | 2022 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://svelte.dev/docs/kit) |
| [**tRPC**](fichas/trpc.md) | `rpc-library` | 2020 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://trpc.io/docs) |
| [**Vite**](fichas/vite.md) | `build-tool` | 2020 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://vite.dev/guide/) |
| [**VitePress**](fichas/vitepress.md) | `documentation-framework` | 2022 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://vitepress.dev/) |
| [**Vue**](fichas/vue.md) | `ui-framework` | 2014 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://vuejs.org/guide/) |
| [**Analog**](fichas/analog.md) | `angular-metaframework` | 2023 | 🌊 Emergente | 🟢 activo | `MIT` | [oficial](https://analogjs.org/docs) |
| [**Bun**](fichas/bun.md) | `runtime` | 2022 | 🌊 Emergente | 🟢 activo | `MIT` | [oficial](https://bun.com/docs) |
| [**Drizzle ORM**](fichas/drizzle.md) | `orm` | 2022 | 🌊 Emergente | 🟢 activo | `Apache-2.0` | [oficial](https://orm.drizzle.team/docs/overview) |
| [**Elysia**](fichas/elysia.md) | `web-framework` | 2022 | 🌊 Emergente | 🟢 activo | `MIT` | [oficial](https://elysiajs.com/) |
| [**Hono**](fichas/hono.md) | `web-framework` | 2021 | 🌊 Emergente | 🟢 activo | `MIT` | [oficial](https://hono.dev/docs/) |
| [**Qwik**](fichas/qwik.md) | `ui-framework` | 2021 | 🌊 Emergente | 🟢 activo | `MIT` | [oficial](https://qwik.dev/docs/) |
| [**RedwoodJS**](fichas/redwoodjs.md) | `full-stack-framework` | 2020 | 🌊 Emergente | 🟢 activo | `MIT` | [oficial](https://redwoodjs.com/docs) |
| [**SolidStart**](fichas/solidstart.md) | `solid-metaframework` | 2024 | 🌊 Emergente | 🟢 activo | `MIT` | [oficial](https://docs.solidjs.com/solid-start) |

### Python

Contexto y genealogía: [python.md](ecosistemas/python.md).

| Tecnología | Clasificación | Desde | Era | Estado | Licencia | Documentación |
| --- | --- | ---: | --- | --- | --- | --- |
| [**Tornado**](fichas/tornado.md) | `web-framework` | 2009 | 🌱 Pionero | 🟡 mantenimiento | `Apache-2.0` | [oficial](https://www.tornadoweb.org/en/stable/) |
| [**Bottle**](fichas/bottle.md) | `web-framework` | 2009 | 🏛️ Clásico | 🟡 mantenimiento | `MIT` | [oficial](https://bottlepy.org/docs/dev/) |
| [**Django**](fichas/django.md) | `web-framework` | 2005 | 🏛️ Clásico | 🟢 activo | `BSD-3-Clause` | [oficial](https://docs.djangoproject.com/) |
| [**Flask**](fichas/flask.md) | `web-framework` | 2010 | 🏛️ Clásico | 🟢 activo | `BSD-3-Clause` | [oficial](https://flask.palletsprojects.com/) |
| [**Kivy**](fichas/kivy.md) | `ui-framework` | 2011 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://kivy.org/doc/stable/) |
| [**Pyramid**](fichas/pyramid.md) | `web-framework` | 2010 | 🏛️ Clásico | 🟢 activo | `NOASSERTION` | [oficial](https://docs.pylonsproject.org/projects/pyramid/en/latest/) |
| [**Sanic**](fichas/sanic.md) | `web-framework` | 2016 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://sanic.dev/en/guide/) |
| [**SQLAlchemy**](fichas/sqlalchemy.md) | `orm` | 2006 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://docs.sqlalchemy.org/) |
| [**aiohttp**](fichas/aiohttp.md) | `http-toolkit` | 2014 | 🟢 Vigente | 🟢 activo | `Apache-2.0` | [oficial](https://docs.aiohttp.org/en/stable/) |
| [**FastAPI**](fichas/fastapi.md) | `web-framework` | 2018 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://fastapi.tiangolo.com/) |
| [**Starlette**](fichas/starlette.md) | `asgi-toolkit` | 2018 | 🟢 Vigente | 🟢 activo | `BSD-3-Clause` | [oficial](https://www.starlette.io/) |
| [**Litestar**](fichas/litestar.md) | `web-framework` | 2021 | 🌊 Emergente | 🟢 activo | `MIT` | [oficial](https://docs.litestar.dev/) |

### PHP

Contexto y genealogía: [php.md](ecosistemas/php.md).

| Tecnología | Clasificación | Desde | Era | Estado | Licencia | Documentación |
| --- | --- | ---: | --- | --- | --- | --- |
| [**CakePHP**](fichas/cakephp.md) | `full-stack-framework` | 2005 | 🌱 Pionero | 🟢 activo | `MIT` | [oficial](https://book.cakephp.org/) |
| [**CodeIgniter**](fichas/codeigniter.md) | `web-framework` | 2006 | 🌱 Pionero | 🟢 activo | `MIT` | [oficial](https://codeigniter.com/user_guide/) |
| [**Drupal**](fichas/drupal.md) | `cms` | 2001 | 🏛️ Clásico | 🟢 activo | `GPL-2.0-or-later` | [oficial](https://www.drupal.org/docs) |
| [**Laminas**](fichas/laminas.md) | `application-framework` | 2019 | 🏛️ Clásico | 🟢 activo | `BSD-3-Clause` | [oficial](https://docs.laminas.dev/) |
| [**Phalcon**](fichas/phalcon.md) | `full-stack-framework` | 2012 | 🏛️ Clásico | 🟢 activo | `BSD-3-Clause` | [oficial](https://docs.phalcon.io/latest/) |
| [**Slim**](fichas/slim.md) | `web-framework` | 2010 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://www.slimframework.com/docs/v4/) |
| [**Symfony**](fichas/symfony.md) | `web-framework` | 2005 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://symfony.com/doc/current/) |
| [**WordPress**](fichas/wordpress.md) | `cms` | 2003 | 🏛️ Clásico | 🟢 activo | `GPL-2.0-or-later` | [oficial](https://developer.wordpress.org/) |
| [**Yii**](fichas/yii.md) | `full-stack-framework` | 2008 | 🏛️ Clásico | 🟢 activo | `BSD-3-Clause` | [oficial](https://www.yiiframework.com/doc/guide/2.0/en) |
| [**Zend Framework**](fichas/zend-framework.md) | `application-framework` | 2006 | 🏛️ Clásico | ⚪ histórico | `BSD-3-Clause` | [oficial](https://docs.laminas.dev/migration/) |
| [**Eloquent (Laravel)**](fichas/eloquent.md) | `orm` | 2011 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://laravel.com/docs/eloquent) |
| [**Laravel**](fichas/laravel.md) | `full-stack-framework` | 2011 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://laravel.com/docs) |

### JVM — Java, Kotlin, Scala y Groovy

Contexto y genealogía: [jvm.md](ecosistemas/jvm.md).

| Tecnología | Clasificación | Desde | Era | Estado | Licencia | Documentación |
| --- | --- | ---: | --- | --- | --- | --- |
| [**Apache Struts**](fichas/struts.md) | `web-framework` | 2000 | 🌱 Pionero | 🟡 mantenimiento | `Apache-2.0` | [oficial](https://struts.apache.org/) |
| [**Dropwizard**](fichas/dropwizard.md) | `application-framework` | 2011 | 🏛️ Clásico | 🟢 activo | `Apache-2.0` | [oficial](https://www.dropwizard.io/en/stable/) |
| [**Grails**](fichas/grails.md) | `full-stack-framework` | 2006 | 🏛️ Clásico | 🟢 activo | `Apache-2.0` | [oficial](https://docs.grails.org/latest/guide/index.html) |
| [**Hibernate ORM**](fichas/hibernate.md) | `orm` | 2001 | 🏛️ Clásico | 🟢 activo | `LGPL-2.1-or-later` | [oficial](https://hibernate.org/orm/documentation/) |
| [**Jakarta Faces (JSF)**](fichas/jakarta-faces.md) | `component-framework` | 2004 | 🏛️ Clásico | 🟡 mantenimiento | `EPL-2.0` | [oficial](https://jakarta.ee/specifications/faces/) |
| [**Play Framework**](fichas/play-framework.md) | `web-framework` | 2007 | 🏛️ Clásico | 🟢 activo | `Apache-2.0` | [oficial](https://www.playframework.com/documentation/latest/Home) |
| [**Spring Framework**](fichas/spring-framework.md) | `application-framework` | 2003 | 🏛️ Clásico | 🟢 activo | `Apache-2.0` | [oficial](https://docs.spring.io/spring-framework/reference/) |
| [**Eclipse Vert.x**](fichas/vertx.md) | `reactive-toolkit` | 2012 | 🏛️ Clásico | 🟢 activo | `Apache-2.0` | [oficial](https://vertx.io/docs/) |
| [**Jetpack Compose**](fichas/jetpack-compose.md) | `ui-toolkit` | 2021 | 🟢 Vigente | 🟢 activo | `Apache-2.0` | [oficial](https://developer.android.com/compose) |
| [**Ktor**](fichas/ktor.md) | `web-framework` | 2018 | 🟢 Vigente | 🟢 activo | `Apache-2.0` | [oficial](https://ktor.io/docs/) |
| [**Micronaut**](fichas/micronaut.md) | `application-framework` | 2018 | 🟢 Vigente | 🟢 activo | `Apache-2.0` | [oficial](https://docs.micronaut.io/latest/guide/) |
| [**Quarkus**](fichas/quarkus.md) | `application-framework` | 2019 | 🟢 Vigente | 🟢 activo | `Apache-2.0` | [oficial](https://quarkus.io/guides/) |
| [**Spring Boot**](fichas/spring-boot.md) | `application-framework` | 2014 | 🟢 Vigente | 🟢 activo | `Apache-2.0` | [oficial](https://spring.io/projects/spring-boot) |
| [**Compose Multiplatform**](fichas/compose-multiplatform.md) | `ui-toolkit` | 2021 | 🌊 Emergente | 🟢 activo | `Apache-2.0` | [oficial](https://www.jetbrains.com/compose-multiplatform/) |

### .NET y C#

Contexto y genealogía: [dotnet.md](ecosistemas/dotnet.md).

| Tecnología | Clasificación | Desde | Era | Estado | Licencia | Documentación |
| --- | --- | ---: | --- | --- | --- | --- |
| [**ASP.NET Web Forms**](fichas/aspnet-webforms.md) | `component-framework` | 2002 | 🌱 Pionero | ⚪ histórico | `NOASSERTION` | [oficial](https://learn.microsoft.com/aspnet/web-forms/) |
| [**ASP.NET MVC**](fichas/aspnet-mvc.md) | `web-framework` | 2009 | 🏛️ Clásico | ⚪ histórico | `Apache-2.0` | [oficial](https://learn.microsoft.com/aspnet/mvc/) |
| [**WPF**](fichas/wpf.md) | `ui-framework` | 2006 | 🏛️ Clásico | 🟡 mantenimiento | `MIT` | [oficial](https://learn.microsoft.com/dotnet/desktop/wpf/) |
| [**Xamarin**](fichas/xamarin.md) | `ui-framework` | 2011 | 🏛️ Clásico | ⚪ histórico | `MIT` | [oficial](https://learn.microsoft.com/xamarin/) |
| [**ASP.NET Core**](fichas/aspnet-core.md) | `web-framework` | 2016 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://learn.microsoft.com/aspnet/core/) |
| [**Avalonia**](fichas/avalonia.md) | `ui-framework` | 2020 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://docs.avaloniaui.net/) |
| [**Blazor**](fichas/blazor.md) | `component-framework` | 2018 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://learn.microsoft.com/aspnet/core/blazor/) |
| [**Dapper**](fichas/dapper.md) | `micro-orm` | 2011 | 🟢 Vigente | 🟢 activo | `Apache-2.0` | [oficial](https://github.com/DapperLib/Dapper) |
| [**.NET MAUI**](fichas/dotnet-maui.md) | `ui-framework` | 2022 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://learn.microsoft.com/dotnet/maui/) |
| [**Entity Framework Core**](fichas/entity-framework-core.md) | `orm` | 2016 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://learn.microsoft.com/ef/core/) |

### Go

Contexto y genealogía: [go.md](ecosistemas/go.md).

| Tecnología | Clasificación | Desde | Era | Estado | Licencia | Documentación |
| --- | --- | ---: | --- | --- | --- | --- |
| [**Beego**](fichas/beego.md) | `full-stack-framework` | 2012 | 🏛️ Clásico | 🟢 activo | `Apache-2.0` | [oficial](https://beego.me/docs/intro/) |
| [**chi**](fichas/chi.md) | `routing-library` | 2015 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://go-chi.io/) |
| [**Echo**](fichas/echo.md) | `web-framework` | 2015 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://echo.labstack.com/docs) |
| [**esbuild**](fichas/esbuild.md) | `build-tool` | 2020 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://esbuild.github.io/) |
| [**Fiber**](fichas/fiber.md) | `web-framework` | 2020 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://docs.gofiber.io/) |
| [**Gin**](fichas/gin.md) | `web-framework` | 2014 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://gin-gonic.com/en/docs/) |
| [**Hugo**](fichas/hugo.md) | `static-site-generator` | 2013 | 🟢 Vigente | 🟢 activo | `Apache-2.0` | [oficial](https://gohugo.io/documentation/) |

### Rust

Contexto y genealogía: [rust.md](ecosistemas/rust.md).

| Tecnología | Clasificación | Desde | Era | Estado | Licencia | Documentación |
| --- | --- | ---: | --- | --- | --- | --- |
| [**Actix Web**](fichas/actix-web.md) | `web-framework` | 2017 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://actix.rs/docs/) |
| [**axum**](fichas/axum.md) | `web-framework` | 2021 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://docs.rs/axum/) |
| [**Rocket**](fichas/rocket.md) | `web-framework` | 2016 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://rocket.rs/guide/) |
| [**Tauri**](fichas/tauri.md) | `desktop-runtime` | 2022 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://v2.tauri.app/) |
| [**Yew**](fichas/yew.md) | `ui-framework` | 2017 | 🟢 Vigente | 🟢 activo | `Apache-2.0` | [oficial](https://yew.rs/docs/getting-started/introduction) |
| [**Leptos**](fichas/leptos.md) | `ui-framework` | 2022 | 🌊 Emergente | 🟢 activo | `MIT` | [oficial](https://book.leptos.dev/) |

### Ruby

Contexto y genealogía: [ruby.md](ecosistemas/ruby.md).

| Tecnología | Clasificación | Desde | Era | Estado | Licencia | Documentación |
| --- | --- | ---: | --- | --- | --- | --- |
| [**Active Record (Rails)**](fichas/activerecord.md) | `orm` | 2004 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://guides.rubyonrails.org/active_record_basics.html) |
| [**Jekyll**](fichas/jekyll.md) | `static-site-generator` | 2008 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://jekyllrb.com/docs/) |
| [**Ruby on Rails**](fichas/rails.md) | `full-stack-framework` | 2004 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://guides.rubyonrails.org/) |
| [**Sinatra**](fichas/sinatra.md) | `web-framework` | 2007 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://sinatrarb.com/documentation.html) |
| [**Hanami**](fichas/hanami.md) | `full-stack-framework` | 2014 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://guides.hanamirb.org/) |

### BEAM — Elixir y Erlang

Contexto y genealogía: [beam.md](ecosistemas/beam.md).

| Tecnología | Clasificación | Desde | Era | Estado | Licencia | Documentación |
| --- | --- | ---: | --- | --- | --- | --- |
| [**Phoenix**](fichas/phoenix.md) | `full-stack-framework` | 2014 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://hexdocs.pm/phoenix/overview.html) |
| [**Phoenix LiveView**](fichas/phoenix-liveview.md) | `realtime-ui-framework` | 2019 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://hexdocs.pm/phoenix_live_view/) |

### Dart

Contexto y genealogía: [dart.md](ecosistemas/dart.md).

| Tecnología | Clasificación | Desde | Era | Estado | Licencia | Documentación |
| --- | --- | ---: | --- | --- | --- | --- |
| [**Flutter**](fichas/flutter.md) | `ui-sdk` | 2017 | 🟢 Vigente | 🟢 activo | `BSD-3-Clause` | [oficial](https://docs.flutter.dev/) |

### Plataformas de Apple

Contexto y genealogía: [apple.md](ecosistemas/apple.md).

| Tecnología | Clasificación | Desde | Era | Estado | Licencia | Documentación |
| --- | --- | ---: | --- | --- | --- | --- |
| [**UIKit**](fichas/uikit.md) | `ui-toolkit` | 2008 | 🏛️ Clásico | 🟢 activo | `NOASSERTION` | [oficial](https://developer.apple.com/documentation/uikit) |
| [**SwiftUI**](fichas/swiftui.md) | `ui-toolkit` | 2019 | 🟢 Vigente | 🟢 activo | `NOASSERTION` | [oficial](https://developer.apple.com/documentation/swiftui) |

### Escritorio nativo — C y C++

Contexto y genealogía: [nativo.md](ecosistemas/nativo.md).

| Tecnología | Clasificación | Desde | Era | Estado | Licencia | Documentación |
| --- | --- | ---: | --- | --- | --- | --- |
| [**GTK**](fichas/gtk.md) | `ui-toolkit` | 1998 | 🏛️ Clásico | 🟢 activo | `LGPL-2.1-or-later` | [oficial](https://docs.gtk.org/) |
| [**Qt**](fichas/qt.md) | `ui-framework` | 1995 | 🏛️ Clásico | 🟢 activo | `LGPL-3.0-only` | [oficial](https://doc.qt.io/) |

### Plataformas de ejecución

Contexto y genealogía: [cloud.md](ecosistemas/cloud.md).

| Tecnología | Clasificación | Desde | Era | Estado | Licencia | Documentación |
| --- | --- | ---: | --- | --- | --- | --- |
| [**Kubernetes**](fichas/kubernetes.md) | `platform` | 2014 | 🟢 Vigente | 🟢 activo | `Apache-2.0` | [oficial](https://kubernetes.io/docs/home/) |
