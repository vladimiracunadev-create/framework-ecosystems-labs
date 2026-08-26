# 📖 Glosario

> [🏠 Repositorio](../README.md) · [🚀 Empezar](../empezar/README.md) · [🎓 Clases](../classes/README.md) · [🗺️ Atlas](../atlas/README.md)

Todo el vocabulario del programa en un sitio: **138 conceptos** con su definición y **dónde se enseña**, las **138 tecnologías** del catálogo y las **9 cadenas de herramientas**.

Este archivo **se genera**. Los conceptos viven en [`glosario/conceptos.json`](conceptos.json), las tecnologías en [`catalog/frameworks.json`](../catalog/frameworks.json) y las cadenas en [`scripts/lib/cadenas.mjs`](../scripts/lib/cadenas.mjs). Cada concepto declara la clase o el módulo donde se enseña, y `node scripts/generate-glosario.mjs --check` **falla si esa referencia no resuelve** — un glosario cuyos enlaces mienten es peor que no tenerlo.

Las clases marcadas con 🚧 están en esqueleto: el contrato y el elenco están fijados, la prosa todavía no.

## 🔤 Índice alfabético

**A** · [Active Record](#active-record) · [Almacén por petición](#almacén-por-petición) · [Alternativa real](#alternativa-real) · [AOP → Aspecto](#aspecto) · [application/problem+json → RFC 9457](#rfc-9457) · [Archivo de bloqueo](#archivo-de-bloqueo) · [Argon2 → Función de derivación de clave](#función-de-derivación-de-clave) · [Arranque en frío](#arranque-en-frío) · [Aspecto](#aspecto) · [Auditoría](#auditoría) · [Autorización por recurso](#autorización-por-recurso) · [Autorización por rol](#autorización-por-rol)

**Á** · [Ámbito](#ámbito)

**B** · [bcrypt → Función de derivación de clave](#función-de-derivación-de-clave) · [Biblioteca](#biblioteca) · [Breaking change → Cambio incompatible](#cambio-incompatible) · [Bucle de eventos](#bucle-de-eventos)

**C** · [Cabecera](#cabecera) · [Caché condicional](#caché-condicional) · [Cadena de herramientas](#cadena-de-herramientas) · [Cadena de suministro](#cadena-de-suministro) · [Cambio incompatible](#cambio-incompatible) · [Capa → Middleware](#middleware) · [Carga anticipada](#carga-anticipada) · [Carga de datos junto a la ruta](#carga-de-datos-junto-a-la-ruta) · [Carga perezosa](#carga-perezosa) · [Cascada de peticiones](#cascada-de-peticiones) · [Categoría de catálogo](#categoría-de-catálogo) · [Chunked transfer encoding → Codificación troceada](#codificación-troceada) · [Ciclo de vida → Ámbito](#ámbito) · [Clave de lista](#clave-de-lista) · [Codificación troceada](#codificación-troceada) · [Código de estado](#código-de-estado) · [Cola de trabajo](#cola-de-trabajo) · [Comparación en tiempo constante](#comparación-en-tiempo-constante) · [Componente](#componente) · [Componente de servidor](#componente-de-servidor) · [Comprobación previa](#comprobación-previa) · [Configuración por entorno](#configuración-por-entorno) · [Conflicto](#conflicto) · [Consulta parametrizada](#consulta-parametrizada) · [Contenedor de dependencias](#contenedor-de-dependencias) · [Contenedor de inversión de control → Contenedor de dependencias](#contenedor-de-dependencias) · [Contrato](#contrato) · [Convención](#convención) · [Convención sobre configuración → Convención](#convención) · [Cookie](#cookie) · [CORS](#cors) · [Coste total](#coste-total) · [Cross-Site Scripting → XSS](#xss) · [CSP → Política de seguridad de contenido](#política-de-seguridad-de-contenido) · [CSRF](#csrf)

**D** · [Data Mapper](#data-mapper) · [Decorador](#decorador) · [Dependencia](#dependencia) · [Dependencia transitiva](#dependencia-transitiva) · [Doble de prueba](#doble-de-prueba) · [DOM virtual](#dom-virtual)

**E** · [Eager loading → Carga anticipada](#carga-anticipada) · [Efecto](#efecto) · [Elenco](#elenco) · [Empaquetado](#empaquetado) · [Entorno de ejecución → Runtime](#runtime) · [Enumeración de usuarios](#enumeración-de-usuarios) · [Enviar-redirigir-mostrar](#enviar-redirigir-mostrar) · [EOL → Fin de vida](#fin-de-vida) · [Escapado](#escapado) · [Esquema](#esquema) · [Estado](#estado) · [Estado compartido](#estado-compartido) · [Estado del servidor](#estado-del-servidor) · [ETag → Caché condicional](#caché-condicional) · [Event loop → Bucle de eventos](#bucle-de-eventos) · [Evento](#evento) · [Evento de dominio](#evento-de-dominio) · [Eventos enviados por el servidor](#eventos-enviados-por-el-servidor)

**F** · [Fake → Doble de prueba](#doble-de-prueba) · [Falsificación de petición entre sitios → CSRF](#csrf) · [Fijación de sesión](#fijación-de-sesión) · [Filtrado](#filtrado) · [Filtro → Middleware](#middleware) · [Fin de vida](#fin-de-vida) · [Formulario controlado](#formulario-controlado) · [Framework](#framework) · [Función de derivación de clave](#función-de-derivación-de-clave)

**G** · [Generación estática](#generación-estática) · [Grupo de conexiones](#grupo-de-conexiones)

**H** · [Hash de contraseña → Función de derivación de clave](#función-de-derivación-de-clave) · [Health check → Salud y preparación](#salud-y-preparación) · [Hidratación](#hidratación) · [Higuera estranguladora](#higuera-estranguladora) · [Hipermedia](#hipermedia)

**I** · [Idempotencia](#idempotencia) · [Identificador de correlación](#identificador-de-correlación) · [Idiomático](#idiomático) · [Intercambio de recursos entre orígenes → CORS](#cors) · [Interceptor → Middleware](#middleware) · [Inversión de control](#inversión-de-control) · [Inyección SQL](#inyección-sql) · [IoC → Inversión de control](#inversión-de-control) · [Isla](#isla)

**J** · [JWT → Token de acceso](#token-de-acceso)

**K** · [Key → Clave de lista](#clave-de-lista) · [kind → Categoría de catálogo](#categoría-de-catálogo)

**L** · [Lazy loading → Carga perezosa](#carga-perezosa) · [Librería → Biblioteca](#biblioteca) · [Limitación de tasa](#limitación-de-tasa) · [Lockfile → Archivo de bloqueo](#archivo-de-bloqueo)

**M** · [Manifiesto](#manifiesto) · [Mapeador objeto-relacional → ORM](#orm) · [Medir antes de optimizar](#medir-antes-de-optimizar) · [Mejora progresiva](#mejora-progresiva) · [Metaframework](#metaframework) · [Método HTTP](#método-http) · [Método plantilla](#método-plantilla) · [Métrica](#métrica) · [Micro-frontend](#micro-frontend) · [Middleware](#middleware) · [Migración](#migración) · [Migrar sin parar](#migrar-sin-parar) · [Mock → Doble de prueba](#doble-de-prueba)

**N** · [Negociación de contenido](#negociación-de-contenido) · [Nonce](#nonce)

**O** · [OAuth 2.0](#oauth-20) · [Offline-first → Sin conexión primero](#sin-conexión-primero) · [OpenAPI](#openapi) · [OpenID Connect](#openid-connect) · [Origen](#origen) · [ORM](#orm)

**P** · [Paginación](#paginación) · [Percentil](#percentil) · [Pirámide de pruebas](#pirámide-de-pruebas) · [Pista](#pista) · [PKCE](#pkce) · [Política de seguridad de contenido](#política-de-seguridad-de-contenido) · [Polling → Sondeo](#sondeo) · [Pool → Grupo de conexiones](#grupo-de-conexiones) · [POST/Redirect/GET → Enviar-redirigir-mostrar](#enviar-redirigir-mostrar) · [Preflight → Comprobación previa](#comprobación-previa) · [Presupuesto de JavaScript](#presupuesto-de-javascript) · [Principio de Hollywood → Inversión de control](#inversión-de-control) · [Problem Details → RFC 9457](#rfc-9457) · [Problema N+1](#problema-n1) · [Programación orientada a aspectos → Aspecto](#aspecto) · [Prop → Propiedad](#propiedad) · [Propiedad](#propiedad) · [Prueba de caracterización](#prueba-de-caracterización) · [Prueba de contrato](#prueba-de-contrato)

**R** · [Rate limiting → Limitación de tasa](#limitación-de-tasa) · [Reactividad](#reactividad) · [Readiness → Salud y preparación](#salud-y-preparación) · [Redirección](#redirección) · [Registro estructurado](#registro-estructurado) · [Reintento](#reintento) · [Renderizado en el servidor](#renderizado-en-el-servidor) · [Repositorio](#repositorio) · [Respuesta en flujo](#respuesta-en-flujo) · [RFC 9457](#rfc-9457) · [Runtime](#runtime)

**S** · [Salud y preparación](#salud-y-preparación) · [Scope → Ámbito](#ámbito) · [Secreto](#secreto) · [Seed → Semilla](#semilla) · [Seguro (método)](#seguro-método) · [Semilla](#semilla) · [SemVer → Versionado semántico](#versionado-semántico) · [Señal](#señal) · [Sesión](#sesión) · [Signal → Señal](#señal) · [Sin conexión primero](#sin-conexión-primero) · [Sincronización](#sincronización) · [Sondeo](#sondeo) · [SSE → Eventos enviados por el servidor](#eventos-enviados-por-el-servidor) · [SSG → Generación estática](#generación-estática) · [SSR → Renderizado en el servidor](#renderizado-en-el-servidor) · [Strangler fig → Higuera estranguladora](#higuera-estranguladora) · [Streaming → Respuesta en flujo](#respuesta-en-flujo) · [Stub → Doble de prueba](#doble-de-prueba)

**T** · [Tarea programada](#tarea-programada) · [Taxonomía](#taxonomía) · [Terminación temprana](#terminación-temprana) · [Testigo sincronizado](#testigo-sincronizado) · [Token CSRF → Testigo sincronizado](#testigo-sincronizado) · [Token de acceso](#token-de-acceso) · [Toolchain → Cadena de herramientas](#cadena-de-herramientas) · [Transacción](#transacción) · [Traza](#traza)

**U** · [Un hilo por petición](#un-hilo-por-petición)

**V** · [Validación](#validación) · [Verbo HTTP → Método HTTP](#método-http) · [Verde honesto](#verde-honesto) · [Versionado de API](#versionado-de-api) · [Versionado semántico](#versionado-semántico)

**W** · [WebSocket](#websocket)

**X** · [XSS](#xss)

## 🧠 Los conceptos, por área

### El método: qué es un framework y cómo se compara

#### Alternativa real

Lo que puede ocupar el sitio de una tecnología sin cambiar de lenguaje ni de ecosistema. No es lo mismo que un competidor: NestJS compite con Spring Boot y no tiene ninguna alternativa dentro de Node. Es la cifra que importa cuando la pregunta es «¿y si esto no funciona, qué pongo en su lugar?».

> Se enseña en la [clase 004](../classes/parte-0-el-metodo/004-taxonomia-que-compite-de-verdad-con-que/README.md) · se desarrolla en el [módulo 00](../curriculum/00-taxonomia-y-diagnostico.md) · ver también [Taxonomía](#taxonomía), [Coste total](#coste-total), [Categoría de catálogo](#categoría-de-catálogo).

#### Biblioteca

Código de terceros que **tú llamas**. Tú mantienes el control del programa y le pides cosas cuando las necesitas. `node:http` implementa HTTP/1.1 entero y sigue siendo una biblioteca: lo que no hace es llamarte.

También: *(Librería)*

> Se enseña en la [clase 001](../classes/parte-0-el-metodo/001-que-hace-un-framework-que-una-biblioteca-no-hace/README.md) · ver también [Framework](#framework).

#### Bucle de eventos

El modelo de concurrencia de Node.js y de Python asíncrono: **un solo hilo** que atiende muchas peticiones intercalando el trabajo mientras espera. Nada se bloquea salvo que tú lo bloquees — y si lo bloqueas, se paran todas.

También: *(Event loop)*

> Se enseña en la [clase 022](../classes/parte-1-responder/022-respuesta-en-flujo/README.md) · se desarrolla en el [módulo 02](../curriculum/02-arquitectura-de-frameworks.md) · ver también [Un hilo por petición](#un-hilo-por-petición), [Runtime](#runtime).

#### Categoría de catálogo

La etiqueta que dice qué hace una tecnología: `web-framework`, `ui-library`, `orm`, `react-metaframework`… El repositorio usa treinta y siete y las define en `catalog/frameworks.json`, junto a los datos que clasifica. Es la columna «Categoría» de todas las clases, y la que decide si dos tecnologías son comparables.

También: *(kind)*

> Se enseña en la [clase 004](../classes/parte-0-el-metodo/004-taxonomia-que-compite-de-verdad-con-que/README.md) · se desarrolla en el [módulo 00](../curriculum/00-taxonomia-y-diagnostico.md) · ver también [Taxonomía](#taxonomía), [Metaframework](#metaframework).

#### Convención

Una regla que el framework da por supuesta sin que la escribas: que la clase `RaizController` atiende la ruta `raiz#mostrar`, que las plantillas están en un directorio concreto. Menos código, y más cosas que aprender antes de poder leerlo.

También: *(Convención sobre configuración)*

> Se enseña en la [clase 005](../classes/parte-0-el-metodo/005-idiomatico-frente-a-traducido/README.md) · se desarrolla en el [módulo 02](../curriculum/02-arquitectura-de-frameworks.md) · ver también [Idiomático](#idiomático).

#### Coste total

Lo que cuesta un framework más allá del código: aprenderlo, mantenerlo actualizado, encontrar a quien lo conozca y salir de él. Las cuatro dimensiones se deciden juntas y solo la primera es visible el primer día.

> Se enseña en la [clase 006](../classes/parte-0-el-metodo/006-coste-total-aprender-mantener-contratar-salir/README.md) · se desarrolla en el [módulo 11](../curriculum/11-seleccion-y-sostenibilidad.md) · ver también [Fin de vida](#fin-de-vida), [Dependencia](#dependencia).

#### Framework

Código de terceros que **te llama a ti**. Él tiene el bucle de control del programa y tú rellenas los huecos que deja. La definición no menciona el tamaño: Express son unas pocas líneas de API pública y es un framework.

> Se enseña en la [clase 001](../classes/parte-0-el-metodo/001-que-hace-un-framework-que-una-biblioteca-no-hace/README.md) · ver también [Biblioteca](#biblioteca), [Inversión de control](#inversión-de-control).

#### Idiomático

Código escrito como lo escribiría quien conoce ese framework, en lugar de traducido literalmente desde otro. Un Express escrito como si fuera Spring funciona y pierde todo lo que hacía valioso a Express.

> Se enseña en la [clase 005](../classes/parte-0-el-metodo/005-idiomatico-frente-a-traducido/README.md) · ver también [Convención](#convención).

#### Inversión de control

Que el flujo del programa lo dirija el framework y no tu código. Se resume en «no nos llames, nosotros te llamamos». Es medible desde fuera: un manejador registrado y nunca invocado por tu código que aun así se ejecuta una vez por petición.

También: *(IoC, Principio de Hollywood)*

> Se enseña en la [clase 002](../classes/parte-0-el-metodo/002-inversion-de-control-en-concreto/README.md) · se desarrolla en el [módulo 02](../curriculum/02-arquitectura-de-frameworks.md) · ver también [Framework](#framework), [Contenedor de dependencias](#contenedor-de-dependencias), [Método plantilla](#método-plantilla).

#### Metaframework

Un framework construido sobre otro que añade enrutado, renderizado en servidor, carga de datos y empaquetado. Next.js sobre React, Nuxt sobre Vue, SvelteKit sobre Svelte. Compite con otros metaframeworks, no con la biblioteca que lleva dentro.

> Se enseña en la [clase 004](../classes/parte-0-el-metodo/004-taxonomia-que-compite-de-verdad-con-que/README.md) · se desarrolla en el [módulo 00](../curriculum/00-taxonomia-y-diagnostico.md) · ver también [Taxonomía](#taxonomía).

#### Método plantilla

El patrón que formaliza la inversión de control: el esqueleto del algoritmo lo pone quien escribió el framework y tú rellenas pasos concretos. Un servidor HTTP es ese esqueleto —aceptar, leer, elegir manejador, responder, cerrar— y tu manejador es el hueco.

> Se enseña en la [clase 001](../classes/parte-0-el-metodo/001-que-hace-un-framework-que-una-biblioteca-no-hace/README.md) · ver también [Inversión de control](#inversión-de-control).

#### Runtime

El programa que ejecuta tu código: Node.js para JavaScript, CPython para Python, la JVM para Java, el CLR para C#. No es un framework y decide cosas que ningún framework puede cambiar — empezando por el modelo de concurrencia.

También: *(Entorno de ejecución)*

> Se enseña en la [clase 001](../classes/parte-0-el-metodo/001-que-hace-un-framework-que-una-biblioteca-no-hace/README.md) · ver también [Bucle de eventos](#bucle-de-eventos), [Un hilo por petición](#un-hilo-por-petición).

#### Taxonomía

Clasificar antes de comparar. React y Next.js no compiten: uno es biblioteca de interfaz y el otro un metaframework que la usa. Comparar piezas de categorías distintas produce conclusiones que no significan nada.

> Se enseña en la [clase 004](../classes/parte-0-el-metodo/004-taxonomia-que-compite-de-verdad-con-que/README.md) · se desarrolla en el [módulo 00](../curriculum/00-taxonomia-y-diagnostico.md) · ver también [Metaframework](#metaframework), [Elenco](#elenco), [Categoría de catálogo](#categoría-de-catálogo), [Alternativa real](#alternativa-real).

#### Un hilo por petición

El modelo de concurrencia de la JVM y de .NET: cada petición ocupa un hilo del grupo mientras dura. Simple de razonar, y el grupo es finito — doscientas peticiones lentas simultáneas agotan un servidor de doscientos hilos.

> Se enseña en la [clase 022](../classes/parte-1-responder/022-respuesta-en-flujo/README.md) · se desarrolla en el [módulo 02](../curriculum/02-arquitectura-de-frameworks.md) · ver también [Bucle de eventos](#bucle-de-eventos), [Runtime](#runtime), [Grupo de conexiones](#grupo-de-conexiones).

### HTTP: la conversación que hay debajo de todo

#### Cabecera

Metadato de una petición o una respuesta: qué formato lleva el cuerpo, quién eres, qué aceptas de vuelta, cuánto se puede cachear. Los nombres no distinguen mayúsculas, y una misma cabecera puede venir repetida.

> Se enseña en la [clase 016](../classes/parte-1-responder/016-cabeceras-leer-y-escribir/README.md) · ver también [Negociación de contenido](#negociación-de-contenido).

#### Caché condicional

Que el cliente pregunte «¿ha cambiado?» enviando la huella que guardó, y el servidor responda `304` sin cuerpo si no. Ahorra ancho de banda sin renunciar a la frescura.

También: *(ETag)*

> Se enseña en la [clase 048](../classes/parte-3-validacion-y-contrato/048-etags-y-cache-condicional/README.md) · ver también [Negociación de contenido](#negociación-de-contenido).

#### Codificación troceada

La forma en que HTTP/1.1 envía un cuerpo sin declarar su longitud: en trozos, cada uno precedido por su tamaño. Es lo que permite que el cliente empiece a leer antes de que el servidor sepa cuánto va a enviar.

También: *(Chunked transfer encoding)*

> Se enseña en la [clase 022](../classes/parte-1-responder/022-respuesta-en-flujo/README.md) · ver también [Respuesta en flujo](#respuesta-en-flujo).

#### Código de estado

El número de tres cifras de la respuesta. `2xx` salió bien, `3xx` está en otro sitio, `4xx` se equivocó el cliente, `5xx` se equivocó el servidor. La frontera entre `4xx` y `5xx` dice de quién es el problema, y por tanto quién tiene que arreglarlo.

> Se enseña en la [clase 015](../classes/parte-1-responder/015-codigos-de-estado/README.md) · se desarrolla en el [módulo 01](../curriculum/01-http-eventos-y-contratos.md) · ver también [Método HTTP](#método-http).

#### Comprobación previa

La petición `OPTIONS` que el navegador envía antes de una petición entre orígenes que no sea trivial, para preguntar si está permitida. Su respuesta se cachea el tiempo que diga `Access-Control-Max-Age`.

También: *(Preflight)*

> Se enseña en la [clase 024](../classes/parte-1-responder/024-cors/README.md) · ver también [CORS](#cors).

#### CORS

El mecanismo por el que un servidor autoriza a páginas de otro origen a leer sus respuestas. No protege al servidor: protege a los usuarios de otras páginas. Su configuración más insegura empieza siendo la más cómoda — reflejar cualquier origen.

También: *(Intercambio de recursos entre orígenes)*

> Se enseña en la [clase 024](../classes/parte-1-responder/024-cors/README.md) · ver también [Origen](#origen), [Comprobación previa](#comprobación-previa).

#### Enviar-redirigir-mostrar

Responder a un `POST` con una redirección en lugar de con la página. Sin ese patrón, recargar reenvía el formulario y el navegador pregunta «¿reenviar datos?» — creando otro registro.

También: *(POST/Redirect/GET)*

> Se enseña en la [clase 080](../classes/parte-6-la-interfaz/080-formularios-que-funcionan-sin-javascript/README.md) · ver también [Redirección](#redirección), [Idempotencia](#idempotencia).

#### Idempotencia

Que repetir la misma petición produzca el mismo estado final. `PUT` y `DELETE` lo son por definición; `POST` no. La idempotencia **viene de lo que hace el código**, no del verbo: un `PUT` que acumule en vez de reemplazar rompe la promesa.

> Se enseña en la [clase 047](../classes/parte-3-validacion-y-contrato/047-idempotencia/README.md) · ver también [Método HTTP](#método-http), [Reintento](#reintento).

#### Método HTTP

Lo que la petición pretende: `GET` leer, `POST` crear, `PUT` reemplazar entero, `PATCH` modificar una parte, `DELETE` borrar. No es decoración: de que `GET` no cambie nada dependen las cachés, los buscadores y la defensa contra CSRF.

También: *(Verbo HTTP)*

> Se enseña en la [clase 014](../classes/parte-1-responder/014-verbos-http-y-su-semantica/README.md) · se desarrolla en el [módulo 01](../curriculum/01-http-eventos-y-contratos.md) · ver también [Idempotencia](#idempotencia), [Seguro (método)](#seguro-método).

#### Negociación de contenido

Que el mismo recurso se sirva en el formato que el cliente prefiere, según su cabecera `Accept`. Obliga a emitir `Vary: Accept`: sin ella una caché serviría el HTML a quien pidió JSON, porque para ella las dos peticiones son la misma URL.

> Se enseña en la [clase 018](../classes/parte-1-responder/018-negociacion-de-contenido/README.md) · ver también [Cabecera](#cabecera), [Caché condicional](#caché-condicional).

#### Origen

La terna esquema + host + puerto. `https://ejemplo.com` y `https://ejemplo.com:8443` son orígenes distintos. Casi toda la seguridad del navegador está construida sobre esa frontera.

> Se enseña en la [clase 024](../classes/parte-1-responder/024-cors/README.md) · ver también [CORS](#cors), [CSRF](#csrf).

#### Redirección

Una respuesta que dice «está en otro sitio». Se decide en dos ejes: permanente o temporal, y conservando el método o no. `301` permanente, `302` temporal, `307` temporal conservando el método, `308` permanente conservándolo. El `301` se cachea y cuesta retirarlo.

> Se enseña en la [clase 019](../classes/parte-1-responder/019-redirecciones/README.md) · ver también [Código de estado](#código-de-estado), [Enviar-redirigir-mostrar](#enviar-redirigir-mostrar).

#### Respuesta en flujo

Enviar la respuesta a trozos, sin conocer su tamaño total de antemano. Se consigue omitiendo `Content-Length`, lo que activa la codificación troceada. En modelos de un hilo por petición exige mecanismos propios para no retener el hilo.

También: *(Streaming)*

> Se enseña en la [clase 022](../classes/parte-1-responder/022-respuesta-en-flujo/README.md) · ver también [Codificación troceada](#codificación-troceada), [Un hilo por petición](#un-hilo-por-petición).

#### Seguro (método)

Un método que no cambia el estado del servidor. `GET` y `HEAD` lo son. Un `GET` que transfiera dinero es indefendible: bastaría una etiqueta `<img>` en cualquier página para dispararlo.

> Se enseña en la [clase 072](../classes/parte-5-identidad-y-seguridad/072-csrf/README.md) · ver también [Método HTTP](#método-http), [CSRF](#csrf).

### La tubería: middleware, filtros e interceptores

#### Almacén por petición

El sitio donde una capa deja datos para las siguientes sin usar variables globales: `peticion.traza` en Express, `contexto.Items` en .NET, `peticion.state` en Starlette, los atributos de la petición en el mundo de los servlets. Cuatro nombres, un problema.

> Se enseña en la [clase 027](../classes/parte-2-la-tuberia/027-el-orden-importa/README.md) · ver también [Middleware](#middleware), [Identificador de correlación](#identificador-de-correlación).

#### Ámbito

Cuánto vive un objeto que construye el contenedor: uno para todo el proceso, uno por petición, o uno por cada vez que se pide. Un objeto de vida larga que depende de uno de vida corta es un error con nombre — dependencia cautiva.

También: *(Scope, Ciclo de vida)*

> Se enseña en la [clase 037](../classes/parte-2-la-tuberia/037-ciclo-de-vida-de-los-objetos/README.md) · ver también [Contenedor de dependencias](#contenedor-de-dependencias).

#### Aspecto

Comportamiento transversal enganchado a la **ejecución de un método**, no al transporte. A diferencia de un middleware, no sabe nada de HTTP: el mismo aspecto sirve para una petición web, una tarea programada o una prueba.

También: *(Programación orientada a aspectos, AOP)*

> Se enseña en la [clase 038](../classes/parte-2-la-tuberia/038-middleware-decorador-y-aspecto/README.md) · ver también [Middleware](#middleware), [Decorador](#decorador).

#### Contenedor de dependencias

La pieza que construye tus objetos y les entrega lo que necesitan. Es la consecuencia inevitable de la inversión de control: si el framework llama a tu función, alguien tiene que darle sus dependencias, porque tú ya no puedes.

También: *(Contenedor de inversión de control)*

> Se enseña en la [clase 036](../classes/parte-2-la-tuberia/036-inyeccion-de-dependencias/README.md) · se desarrolla en el [módulo 02](../curriculum/02-arquitectura-de-frameworks.md) · ver también [Inversión de control](#inversión-de-control), [Ámbito](#ámbito).

#### Decorador

Una función que recibe otra función, la envuelve y devuelve la envoltura. En Python y TypeScript tiene sintaxis propia; en JavaScript es una llamada corriente. Registrar una ruta con un decorador y con una llamada a método es el mismo mecanismo.

> Se enseña en la [clase 038](../classes/parte-2-la-tuberia/038-middleware-decorador-y-aspecto/README.md) · ver también [Aspecto](#aspecto), [Middleware](#middleware).

#### Identificador de correlación

Un identificador que acompaña a una petición por todos los servicios que atraviesa, para poder seguirla en los registros. Se respeta si viene y se genera si falta, y **se limita en longitud**: entra en los registros y lo controla el cliente.

> Se enseña en la [clase 030](../classes/parte-2-la-tuberia/030-identificador-de-correlacion/README.md) · se desarrolla en el [módulo 08](../curriculum/08-calidad-rendimiento-y-operacion.md) · ver también [Almacén por petición](#almacén-por-petición), [Traza](#traza).

#### Limitación de tasa

Poner un tope de peticiones por cliente y ventana de tiempo. Su respuesta `429` debe llevar `Retry-After`: sin ella el cliente reintenta en bucle, que es lo que se quería evitar. Con varias instancias, el estado tiene que ser compartido.

También: *(Rate limiting)*

> Se enseña en la [clase 034](../classes/parte-2-la-tuberia/034-limitacion-de-tasa/README.md) · ver también [Middleware](#middleware).

#### Middleware

Una pieza que envuelve al manejador: recibe la petición, hace su parte y llama —o no— a la siguiente. La cadena se recorre hacia dentro y se deshace hacia fuera. Cada ecosistema le da un nombre distinto y el mecanismo es el mismo.

También: *(Capa, Filtro, Interceptor)*

> Se enseña en la [clase 026](../classes/parte-2-la-tuberia/026-el-patron-middleware/README.md) · se desarrolla en el [módulo 02](../curriculum/02-arquitectura-de-frameworks.md) · ver también [Terminación temprana](#terminación-temprana), [Aspecto](#aspecto).

#### Terminación temprana

Cortar la cadena respondiendo sin llamar a la siguiente capa. No necesita ningún mecanismo especial: cortar es simplemente no continuar. Es cómo se implementa una comprobación de autenticación.

> Se enseña en la [clase 028](../classes/parte-2-la-tuberia/028-terminacion-temprana/README.md) · ver también [Middleware](#middleware).

### Validación, contrato y API

#### Cambio incompatible

Un cambio que hace fallar a un cliente que funcionaba. Quitar un campo lo es; añadir uno opcional, no. Saber cuál es cuál es lo que permite evolucionar una API sin coordinar despliegues.

También: *(Breaking change)*

> Se enseña en la [clase 050](../classes/parte-3-validacion-y-contrato/050-que-rompe-a-quien/README.md) · ver también [Versionado de API](#versionado-de-api), [Prueba de contrato](#prueba-de-contrato).

#### Esquema

Una descripción declarativa de la forma que deben tener unos datos. Un mismo esquema puede servir para validar la entrada, generar la documentación y tipar el código — tres usos de una sola declaración.

> Se enseña en la [clase 041](../classes/parte-3-validacion-y-contrato/041-esquemas/README.md) · ver también [Validación](#validación), [OpenAPI](#openapi).

#### Filtrado

Acotar una lista por criterios que llegan del cliente. El riesgo no es la sintaxis: es aceptar como campo de ordenación cualquier texto que llegue, que es una inyección con otro nombre.

> Se enseña en la [clase 046](../classes/parte-3-validacion-y-contrato/046-filtrado-y-ordenacion/README.md) · ver también [Paginación](#paginación), [Inyección SQL](#inyección-sql).

#### OpenAPI

El formato estándar para describir una API HTTP: rutas, parámetros, cuerpos y respuestas. Cuando se deriva del código en lugar de escribirse aparte, no puede quedarse desactualizado.

> Se enseña en la [clase 043](../classes/parte-3-validacion-y-contrato/043-documentacion-generada/README.md) · se desarrolla en el [módulo 01](../curriculum/01-http-eventos-y-contratos.md) · ver también [Esquema](#esquema).

#### Paginación

Devolver los resultados por tramos en lugar de todos. Por desplazamiento es fácil y se desordena cuando alguien inserta mientras paginas; por cursor es estable y no permite saltar a la página 37.

> Se enseña en la [clase 045](../classes/parte-3-validacion-y-contrato/045-paginacion/README.md) · ver también [Filtrado](#filtrado).

#### RFC 9457

El formato estándar de los errores de una API HTTP: un objeto con `type`, `title`, `status` y `detail`, más los campos propios que hagan falta. Un `422` que solo diga «datos inválidos» impide construir una interfaz accesible.

También: *(Problem Details, application/problem+json)*

> Se enseña en la [clase 040](../classes/parte-3-validacion-y-contrato/040-errores-por-campo-con-rfc-9457/README.md) · se desarrolla en el [módulo 01](../curriculum/01-http-eventos-y-contratos.md) · ver también [Validación](#validación), [Código de estado](#código-de-estado).

#### Validación

Rechazar entradas que no cumplen las reglas, **antes** de que lleguen al dominio. No es lo mismo que escapar: validar rechaza entradas, escapar neutraliza salidas, y se necesitan las dos en momentos distintos.

> Se enseña en la [clase 039](../classes/parte-3-validacion-y-contrato/039-validar-la-entrada/README.md) · se desarrolla en el [módulo 01](../curriculum/01-http-eventos-y-contratos.md) · ver también [Esquema](#esquema), [Escapado](#escapado).

#### Versionado de API

Cómo se publica un cambio que rompe a los clientes existentes. En la ruta, en una cabecera o por negociación de contenido; lo que no cambia es la obligación de decidir cuánto tiempo se mantiene la versión anterior.

> Se enseña en la [clase 044](../classes/parte-3-validacion-y-contrato/044-versionado-de-api/README.md) · se desarrolla en el [módulo 11](../curriculum/11-seleccion-y-sostenibilidad.md) · ver también [Cambio incompatible](#cambio-incompatible).

### Datos y persistencia

#### Active Record

El patrón en que el objeto de dominio **sabe guardarse**: `tarea.save()`. Rápido de escribir y difícil de probar sin base de datos, porque el dominio y el almacenamiento son la misma clase.

> Se enseña en la [clase 053](../classes/parte-4-datos/053-active-record/README.md) · se desarrolla en el [módulo 06](../curriculum/06-persistencia-y-dominio.md) · ver también [Data Mapper](#data-mapper), [ORM](#orm).

#### Carga anticipada

Pedir los datos relacionados en la misma consulta o en una segunda planificada. Cada ORM la resuelve a su manera —una unión o dos consultas— y las dos son correctas: lo que importa es que el número no crezca con las filas.

También: *(Eager loading)*

> Se enseña en la [clase 056](../classes/parte-4-datos/056-el-problema-n-1/README.md) · ver también [Problema N+1](#problema-n1).

#### Carga perezosa

Traer los datos relacionados solo cuando se acceden. Cómodo, y el origen habitual del problema N+1: la consulta extra ocurre dentro de un bucle donde nadie la ve.

También: *(Lazy loading)*

> Se enseña en la [clase 056](../classes/parte-4-datos/056-el-problema-n-1/README.md) · ver también [Problema N+1](#problema-n1), [Carga anticipada](#carga-anticipada).

#### Data Mapper

El patrón en que el objeto de dominio **no sabe nada** del almacenamiento y una pieza aparte lo traduce. Más ceremonia, y el dominio se puede instanciar y probar sin base de datos.

> Se enseña en la [clase 054](../classes/parte-4-datos/054-data-mapper/README.md) · se desarrolla en el [módulo 06](../curriculum/06-persistencia-y-dominio.md) · ver también [Active Record](#active-record), [Repositorio](#repositorio).

#### Grupo de conexiones

Un conjunto de conexiones a la base de datos que se reutilizan en lugar de abrirse y cerrarse por petición. Abrir una conexión es caro; el tamaño del grupo es un límite duro de concurrencia que casi nadie mira hasta que se agota.

También: *(Pool)*

> Se enseña en la [clase 061](../classes/parte-4-datos/061-grupo-de-conexiones/README.md) · se desarrolla en el [módulo 06](../curriculum/06-persistencia-y-dominio.md) · ver también [Transacción](#transacción).

#### Migración

Un cambio en el esquema de la base de datos, escrito como código, versionado y aplicado en orden. Sin migraciones, el esquema de producción es una suma de comandos que alguien ejecutó a mano y nadie recuerda.

> Se enseña en la [clase 058](../classes/parte-4-datos/058-migraciones/README.md) · se desarrolla en el [módulo 06](../curriculum/06-persistencia-y-dominio.md) · ver también [Semilla](#semilla), [Migrar sin parar](#migrar-sin-parar).

#### ORM

Una capa que traduce entre filas de una base de datos relacional y objetos del lenguaje. Su valor no es escribir menos SQL: es que la API de consulta **no acepte SQL como cadena**, lo que cierra la inyección por construcción.

También: *(Mapeador objeto-relacional)*

> Se enseña en la [clase 051](../classes/parte-4-datos/051-conectar-a-una-base-de-datos/README.md) · se desarrolla en el [módulo 06](../curriculum/06-persistencia-y-dominio.md) · ver también [Active Record](#active-record), [Data Mapper](#data-mapper), [Inyección SQL](#inyección-sql).

#### Problema N+1

Hacer una consulta para la lista y una más por cada elemento. No se detecta con diez filas y tumba el sistema con diez mil. Se resuelve con carga anticipada, y se **mide** por el crecimiento del número de consultas, no por su valor absoluto.

> Se enseña en la [clase 056](../classes/parte-4-datos/056-el-problema-n-1/README.md) · se desarrolla en el [módulo 06](../curriculum/06-persistencia-y-dominio.md) · ver también [Carga anticipada](#carga-anticipada), [Carga perezosa](#carga-perezosa).

#### Repositorio

Una interfaz que el dominio usa para guardar y recuperar sin saber cómo. Su prueba de fuego es que la implementación en memoria y la real sean intercambiables — y que el dominio no importe nada del ORM.

> Se enseña en la [clase 064](../classes/parte-4-datos/064-repositorio-y-dominio/README.md) · se desarrolla en el [módulo 06](../curriculum/06-persistencia-y-dominio.md) · ver también [Data Mapper](#data-mapper).

#### Semilla

Datos de partida que se cargan de forma repetible: los mínimos para que la aplicación funcione, o un juego de prueba. Repetible significa que ejecutarla dos veces no duplica nada.

También: *(Seed)*

> Se enseña en la [clase 059](../classes/parte-4-datos/059-semillas-y-datos-de-prueba/README.md) · ver también [Migración](#migración).

#### Transacción

Un grupo de operaciones que ocurren todas o ninguna. Su frontera es una decisión de diseño: demasiado estrecha deja estados a medias, demasiado ancha retiene bloqueos y conexiones.

> Se enseña en la [clase 057](../classes/parte-4-datos/057-transacciones/README.md) · se desarrolla en el [módulo 06](../curriculum/06-persistencia-y-dominio.md) · ver también [Grupo de conexiones](#grupo-de-conexiones).

### Identidad y seguridad

#### Auditoría

El rastro de quién cambió qué y cuándo. Tres reglas: un solo lugar por donde pasa cada cambio, el instante lo pone el servidor, y el almacén es de solo apéndice y está aparte — si quien borró el dato puede borrar su rastro, el rastro no protege.

> Se enseña en la [clase 076](../classes/parte-5-identidad-y-seguridad/076-auditoria/README.md) · ver también [Registro estructurado](#registro-estructurado).

#### Autorización por recurso

Decidir si **este** dato concreto es tuyo. Ninguna configuración declarativa puede responderlo, porque la respuesta depende del dato: se resuelve poniendo al propietario **en la consulta**, no comprobando después.

> Se enseña en la [clase 071](../classes/parte-5-identidad-y-seguridad/071-autorizacion-por-recurso/README.md) · ver también [Autorización por rol](#autorización-por-rol).

#### Autorización por rol

Decidir qué puede hacer alguien según su clase de usuario. Responde «qué clase de usuario eres» y se puede expresar de forma declarativa, en la configuración o en la ruta.

> Se enseña en la [clase 070](../classes/parte-5-identidad-y-seguridad/070-autorizacion-por-rol/README.md) · se desarrolla en el [módulo 07](../curriculum/07-identidad-y-seguridad.md) · ver también [Autorización por recurso](#autorización-por-recurso).

#### Cadena de suministro

Todo el código que ejecutas y no escribiste, incluidas las dependencias de tus dependencias y los scripts que se ejecutan al instalarlas. Este repositorio instala con `--ignore-scripts` por eso.

> Se enseña en la [clase 078](../classes/parte-5-identidad-y-seguridad/078-dependencias-vulnerables/README.md) · se desarrolla en el [módulo 08](../curriculum/08-calidad-rendimiento-y-operacion.md) · ver también [Dependencia transitiva](#dependencia-transitiva), [Archivo de bloqueo](#archivo-de-bloqueo).

#### Comparación en tiempo constante

Comparar dos secretos tardando lo mismo coincidan o no. Un `==` corriente se detiene en el primer carácter distinto, y esa diferencia de microsegundos permite adivinar el valor carácter a carácter.

> Se enseña en la [clase 068](../classes/parte-5-identidad-y-seguridad/068-contrasenas-bien-guardadas/README.md) · ver también [Función de derivación de clave](#función-de-derivación-de-clave), [CSRF](#csrf).

#### Consulta parametrizada

Una consulta cuyo texto y cuyos valores viajan por caminos distintos, unidos por marcadores (`?`, `:nombre`, `@titulo`). Por eso el motor nunca puede confundir un dato con una instrucción.

> Se enseña en la [clase 074](../classes/parte-5-identidad-y-seguridad/074-inyeccion-sql/README.md) · ver también [Inyección SQL](#inyección-sql).

#### Cookie

Un dato que el servidor pide al navegador que guarde y le devuelva en cada petición. Sus atributos no son decoración: `HttpOnly` la esconde del script de la página y `SameSite` evita que viaje en peticiones que provoca otra página.

> Se enseña en la [clase 066](../classes/parte-5-identidad-y-seguridad/066-sesion-con-cookie/README.md) · ver también [Sesión](#sesión), [CSRF](#csrf).

#### CSRF

El ataque en que una página del atacante provoca una petición a tu sitio y el navegador **adjunta la cookie** — es su trabajo. Se corta con un testigo que el atacante no puede leer ni adivinar, y con `SameSite`.

También: *(Falsificación de petición entre sitios)*

> Se enseña en la [clase 072](../classes/parte-5-identidad-y-seguridad/072-csrf/README.md) · se desarrolla en el [módulo 07](../curriculum/07-identidad-y-seguridad.md) · ver también [Testigo sincronizado](#testigo-sincronizado), [Cookie](#cookie), [Origen](#origen).

#### Enumeración de usuarios

Deducir qué cuentas existen a partir de respuestas distintas. Se cierra respondiendo lo mismo a «no existe» y «clave mala» — **y tardando lo mismo**, verificando contra un resumen señuelo. La respuesta y su tiempo son el mismo mensaje.

> Se enseña en la [clase 068](../classes/parte-5-identidad-y-seguridad/068-contrasenas-bien-guardadas/README.md) · ver también [Función de derivación de clave](#función-de-derivación-de-clave).

#### Escapado

Neutralizar los caracteres que tendrían significado en el destino, **sin destruir el dato**: `<` se convierte en `&lt;` y el texto sigue entero. Escapar no es filtrar, y dónde vive el escapado —en el motor, en el framework o en el tipo— decide qué se puede olvidar.

> Se enseña en la [clase 079](../classes/parte-6-la-interfaz/079-plantillas-en-el-servidor/README.md) · ver también [XSS](#xss), [Validación](#validación).

#### Fijación de sesión

El ataque en que alguien planta un identificador de sesión antes del inicio de sesión y luego lo reutiliza ya autenticado. Se cierra emitiendo un identificador **nuevo** al autenticar.

> Se enseña en la [clase 066](../classes/parte-5-identidad-y-seguridad/066-sesion-con-cookie/README.md) · ver también [Sesión](#sesión).

#### Función de derivación de clave

Una función deliberadamente **lenta** para guardar contraseñas: bcrypt, scrypt, Argon2, PBKDF2. Escribe sus parámetros dentro del resumen, así que verificar no necesita configuración y subirlos mañana no rompe los de ayer.

También: *(Hash de contraseña, bcrypt, Argon2)*

> Se enseña en la [clase 068](../classes/parte-5-identidad-y-seguridad/068-contrasenas-bien-guardadas/README.md) · se desarrolla en el [módulo 07](../curriculum/07-identidad-y-seguridad.md) · ver también [Comparación en tiempo constante](#comparación-en-tiempo-constante), [Enumeración de usuarios](#enumeración-de-usuarios).

#### Inyección SQL

Conseguir que datos de un usuario se interpreten como instrucciones de la consulta. Se cierra por construcción: el valor viaja **separado** del texto de la consulta, unido solo por un marcador. Concatenar es lo único que la abre.

> Se enseña en la [clase 074](../classes/parte-5-identidad-y-seguridad/074-inyeccion-sql/README.md) · se desarrolla en el [módulo 07](../curriculum/07-identidad-y-seguridad.md) · ver también [Consulta parametrizada](#consulta-parametrizada), [ORM](#orm).

#### Nonce

Un valor aleatorio **por respuesta** que autoriza a un script concreto dentro de una política de seguridad de contenido. Un nonce fijo en la configuración no es un nonce: el atacante lo lee en el HTML de ayer.

> Se enseña en la [clase 077](../classes/parte-5-identidad-y-seguridad/077-politica-de-seguridad-de-contenido/README.md) · ver también [Política de seguridad de contenido](#política-de-seguridad-de-contenido).

#### OAuth 2.0

El protocolo por el que una aplicación obtiene permiso para actuar en nombre de un usuario sin conocer su contraseña. En un protocolo de seguridad, la creatividad es el fallo: lo que hay que hacer es implementar exactamente lo que dice.

> Se enseña en la [clase 069](../classes/parte-5-identidad-y-seguridad/069-oauth-2-0-y-openid-connect/README.md) · se desarrolla en el [módulo 07](../curriculum/07-identidad-y-seguridad.md) · ver también [OpenID Connect](#openid-connect), [PKCE](#pkce).

#### OpenID Connect

La capa de identidad sobre OAuth 2.0: añade un `id_token` firmado que dice **quién** es el usuario. OAuth autoriza; OpenID Connect autentica.

> Se enseña en la [clase 069](../classes/parte-5-identidad-y-seguridad/069-oauth-2-0-y-openid-connect/README.md) · ver también [OAuth 2.0](#oauth-20), [Token de acceso](#token-de-acceso).

#### PKCE

La defensa que impide canjear un código de autorización interceptado: quien inicia el flujo envía el resumen de un secreto y solo él puede presentar el original. Sin PKCE, un código robado por el camino se puede canjear.

> Se enseña en la [clase 069](../classes/parte-5-identidad-y-seguridad/069-oauth-2-0-y-openid-connect/README.md) · ver también [OAuth 2.0](#oauth-20).

#### Política de seguridad de contenido

Una cabecera que le dice al navegador qué puede cargar y ejecutar. Es la red que hay debajo cuando el escapado falla: el script inyectado está en el marcado y el navegador se niega a ejecutarlo.

También: *(CSP)*

> Se enseña en la [clase 077](../classes/parte-5-identidad-y-seguridad/077-politica-de-seguridad-de-contenido/README.md) · se desarrolla en el [módulo 07](../curriculum/07-identidad-y-seguridad.md) · ver también [XSS](#xss), [Nonce](#nonce).

#### Secreto

Un valor que no puede aparecer en el código, ni en el registro, ni en una respuesta: claves de firma, contraseñas de base de datos, credenciales. Un endpoint de configuración reporta su **presencia**, nunca su valor.

> Se enseña en la [clase 075](../classes/parte-5-identidad-y-seguridad/075-secretos-y-configuracion/README.md) · se desarrolla en el [módulo 07](../curriculum/07-identidad-y-seguridad.md) · ver también [Configuración por entorno](#configuración-por-entorno).

#### Sesión

Estado de un usuario guardado **en el servidor**, identificado por una cookie opaca. Es lo que permite cerrar sesión de verdad: se borra la entrada del almacén y la cookie robada deja de abrir.

> Se enseña en la [clase 066](../classes/parte-5-identidad-y-seguridad/066-sesion-con-cookie/README.md) · se desarrolla en el [módulo 07](../curriculum/07-identidad-y-seguridad.md) · ver también [Cookie](#cookie), [Token de acceso](#token-de-acceso), [Fijación de sesión](#fijación-de-sesión).

#### Testigo sincronizado

Un valor aleatorio que vive en la sesión y viaja en el cuerpo o en una cabecera —nunca en una cookie sola, que el navegador también adjuntaría—. La página del atacante no puede leerlo porque no puede leer respuestas de otro origen.

También: *(Token CSRF)*

> Se enseña en la [clase 072](../classes/parte-5-identidad-y-seguridad/072-csrf/README.md) · ver también [CSRF](#csrf).

#### Token de acceso

Un dato firmado que el cliente presenta en cada petición y que el servidor verifica **sin consultar nada**. Su cuerpo va codificado, no cifrado: cualquiera que lo tenga puede leerlo. Y lo que no se guarda no se puede revocar.

También: *(JWT)*

> Se enseña en la [clase 067](../classes/parte-5-identidad-y-seguridad/067-token-de-acceso/README.md) · se desarrolla en el [módulo 07](../curriculum/07-identidad-y-seguridad.md) · ver también [Sesión](#sesión), [OAuth 2.0](#oauth-20).

#### XSS

Texto de un usuario que el navegador acaba ejecutando como código. La defensa moderna no es filtrar lo malo: es **escapar todo por omisión** y dejar la vía insegura como una puerta explícita con nombre de peligro.

También: *(Cross-Site Scripting)*

> Se enseña en la [clase 073](../classes/parte-5-identidad-y-seguridad/073-xss-y-escapado/README.md) · se desarrolla en el [módulo 07](../curriculum/07-identidad-y-seguridad.md) · ver también [Escapado](#escapado), [Política de seguridad de contenido](#política-de-seguridad-de-contenido).

### Interfaz, componentes y estado

#### Clave de lista

El identificador estable que se le da a cada elemento de una lista para que el framework sepa cuál es cuál al actualizar. Usar el índice como clave produce errores visibles al reordenar o insertar.

También: *(Key)*

> Se enseña en la [clase 085](../classes/parte-6-la-interfaz/085-listas-y-claves/README.md) · ver también [Componente](#componente).

#### Componente

Una unidad de interfaz con sus datos de entrada, su marcado y su comportamiento. Los datos entran por propiedades y los avisos salen por eventos: hacia abajo datos, hacia arriba eventos.

> Se enseña en la [clase 082](../classes/parte-6-la-interfaz/082-el-primer-componente/README.md) · se desarrolla en el [módulo 03](../curriculum/03-frontend-componentes-y-estado.md) · ver también [Propiedad](#propiedad), [Estado](#estado).

#### DOM virtual

Pintar en una estructura en memoria, compararla con la anterior y aplicar solo las diferencias al DOM real. Simplifica el modelo mental a cambio de un coste de comparación en cada actualización.

> Se enseña en la [clase 092](../classes/parte-6-la-interfaz/092-los-tres-modelos-de-reactividad/README.md) · ver también [Reactividad](#reactividad), [Señal](#señal).

#### Efecto

Trabajo que ocurre fuera del renderizado: pedir datos, suscribirse, tocar el DOM. Su parte difícil no es lanzarlo: es **limpiarlo** cuando el componente desaparece o sus dependencias cambian.

> Se enseña en la [clase 087](../classes/parte-6-la-interfaz/087-efectos-y-ciclo-de-vida/README.md) · se desarrolla en el [módulo 03](../curriculum/03-frontend-componentes-y-estado.md) · ver también [Estado del servidor](#estado-del-servidor).

#### Estado

Un dato que el componente posee y puede cambiar. Cuando cambia, la interfaz se vuelve a pintar. La pregunta difícil no es cómo se declara: es dónde debe vivir.

> Se enseña en la [clase 084](../classes/parte-6-la-interfaz/084-estado-local/README.md) · se desarrolla en el [módulo 03](../curriculum/03-frontend-componentes-y-estado.md) · ver también [Estado compartido](#estado-compartido), [Reactividad](#reactividad).

#### Estado compartido

Estado que necesitan varios componentes que no son padre e hijo. Se resuelve subiéndolo al ancestro común, con un contexto o con un almacén externo — y cada opción cambia qué se vuelve a pintar.

> Se enseña en la [clase 088](../classes/parte-6-la-interfaz/088-estado-compartido/README.md) · se desarrolla en el [módulo 03](../curriculum/03-frontend-componentes-y-estado.md) · ver también [Estado](#estado), [Componente](#componente).

#### Estado del servidor

Datos que viven en el servidor y de los que el cliente guarda una copia. No es estado local: es una **caché**, y sus problemas son de caché — frescura, invalidación, reintentos y peticiones duplicadas.

> Se enseña en la [clase 089](../classes/parte-6-la-interfaz/089-estado-del-servidor-en-el-cliente/README.md) · ver también [Estado](#estado), [Efecto](#efecto).

#### Evento

El aviso que un componente emite hacia arriba para que quien lo usa decida qué hacer. Es la otra mitad de «hacia abajo datos, hacia arriba eventos»: el hijo no cambia lo que recibe, avisa de que algo pasó.

> Se enseña en la [clase 083](../classes/parte-6-la-interfaz/083-propiedades-y-eventos/README.md) · ver también [Propiedad](#propiedad), [Componente](#componente).

#### Formulario controlado

Un campo cuyo valor lo dicta el estado del componente en lugar del DOM. Da control total sobre lo que se puede escribir, y obliga a que cada pulsación pase por el estado.

> Se enseña en la [clase 086](../classes/parte-6-la-interfaz/086-formularios-controlados/README.md) · ver también [Estado](#estado).

#### Propiedad

Un dato que un componente recibe de quien lo usa. Es de solo lectura desde dentro: modificarla rompe la dirección única del flujo de datos.

También: *(Prop)*

> Se enseña en la [clase 083](../classes/parte-6-la-interfaz/083-propiedades-y-eventos/README.md) · ver también [Componente](#componente), [Evento](#evento).

#### Reactividad

Cómo un framework se entera de que algo cambió para volver a pintar. Hay tres modelos: comparar el resultado (DOM virtual), observar el dato (señales) o compilar las dependencias (compilador). Deciden el rendimiento y el estilo del código.

> Se enseña en la [clase 092](../classes/parte-6-la-interfaz/092-los-tres-modelos-de-reactividad/README.md) · se desarrolla en el [módulo 03](../curriculum/03-frontend-componentes-y-estado.md) · ver también [DOM virtual](#dom-virtual), [Señal](#señal).

#### Señal

Un valor que sabe quién lo está leyendo, así que al cambiar puede avisar exactamente a lo que depende de él. Evita la comparación del DOM virtual y devuelve la reactividad al dato.

También: *(Signal)*

> Se enseña en la [clase 092](../classes/parte-6-la-interfaz/092-los-tres-modelos-de-reactividad/README.md) · ver también [Reactividad](#reactividad), [DOM virtual](#dom-virtual).

### Renderizado y full-stack

#### Carga de datos junto a la ruta

Declarar qué datos necesita una pantalla **al lado de su ruta**, no dentro del componente. Permite que el framework los pida en paralelo antes de pintar, en lugar de descubrirlos uno a uno al renderizar.

> Se enseña en la [clase 097](../classes/parte-7-renderizado-y-fullstack/097-carga-de-datos-junto-a-la-ruta/README.md) · se desarrolla en el [módulo 04](../curriculum/04-fullstack-y-renderizado.md) · ver también [Cascada de peticiones](#cascada-de-peticiones), [Componente de servidor](#componente-de-servidor).

#### Cascada de peticiones

Peticiones que solo pueden empezar cuando termina la anterior, porque cada una necesita el resultado de la previa. Es la causa más común de una pantalla lenta que en el perfilador parece rápida.

> Se enseña en la [clase 099](../classes/parte-7-renderizado-y-fullstack/099-la-cascada-de-peticiones/README.md) · ver también [Carga de datos junto a la ruta](#carga-de-datos-junto-a-la-ruta).

#### Componente de servidor

Un componente que se ejecuta **solo** en el servidor y cuyo resultado viaja ya pintado. Su código y sus dependencias no llegan al navegador — puede leer de la base de datos directamente.

> Se enseña en la [clase 096](../classes/parte-7-renderizado-y-fullstack/096-componentes-de-servidor/README.md) · ver también [Hidratación](#hidratación), [Isla](#isla).

#### Generación estática

Generar el HTML una vez, al construir, y servirlo como archivo. Lo más rápido y lo más barato, y solo vale si el contenido no depende de quién mira.

También: *(SSG)*

> Se enseña en la [clase 093](../classes/parte-7-renderizado-y-fullstack/093-las-cuatro-estrategias-de-renderizado/README.md) · ver también [Renderizado en el servidor](#renderizado-en-el-servidor).

#### Hidratación

Volver interactivo un HTML que ya llegó pintado, adjuntándole el JavaScript del componente. Es trabajo duplicado —el servidor pintó y el cliente vuelve a recorrer— y es lo que las islas y la resumibilidad intentan reducir.

> Se enseña en la [clase 094](../classes/parte-7-renderizado-y-fullstack/094-hidratacion/README.md) · se desarrolla en el [módulo 04](../curriculum/04-fullstack-y-renderizado.md) · ver también [Isla](#isla), [Renderizado en el servidor](#renderizado-en-el-servidor).

#### Hipermedia

La alternativa en que el servidor devuelve **HTML** en lugar de datos y el cliente solo lo inserta. Reduce el JavaScript a una biblioteca pequeña y devuelve el renderizado al servidor.

> Se enseña en la [clase 103](../classes/parte-7-renderizado-y-fullstack/103-hipermedia-como-alternativa/README.md) 🚧 · ver también [Mejora progresiva](#mejora-progresiva).

#### Isla

Un trozo interactivo dentro de una página que por lo demás es HTML estático. Solo se hidrata la isla, así que el JavaScript que llega es proporcional a lo que de verdad se mueve.

> Se enseña en la [clase 095](../classes/parte-7-renderizado-y-fullstack/095-islas/README.md) · ver también [Hidratación](#hidratación), [Presupuesto de JavaScript](#presupuesto-de-javascript).

#### Mejora progresiva

Construir primero el caso que funciona sin JavaScript y añadir comportamiento encima. La propiedad que la define: si el JavaScript no llega, lo que queda **sigue funcionando** — la mejora es mejora, no requisito.

> Se enseña en la [clase 081](../classes/parte-6-la-interfaz/081-mejora-progresiva/README.md) · se desarrolla en el [módulo 04](../curriculum/04-fullstack-y-renderizado.md) · ver también [Hipermedia](#hipermedia), [Enviar-redirigir-mostrar](#enviar-redirigir-mostrar).

#### Presupuesto de JavaScript

Un límite declarado de cuántos bytes de JavaScript puede enviar una página, comprobado automáticamente. Sin límite, el peso solo crece — nadie quita una dependencia por su cuenta.

> Se enseña en la [clase 102](../classes/parte-7-renderizado-y-fullstack/102-presupuesto-de-javascript/README.md) · se desarrolla en el [módulo 08](../curriculum/08-calidad-rendimiento-y-operacion.md) · ver también [Isla](#isla).

#### Renderizado en el servidor

Generar el HTML en el servidor en cada petición. La página se ve antes y el servidor trabaja más; el JavaScript llega después para darle vida.

También: *(SSR)*

> Se enseña en la [clase 093](../classes/parte-7-renderizado-y-fullstack/093-las-cuatro-estrategias-de-renderizado/README.md) · se desarrolla en el [módulo 04](../curriculum/04-fullstack-y-renderizado.md) · ver también [Hidratación](#hidratación), [Generación estática](#generación-estática).

### Tiempo real y trabajo en segundo plano

#### Cola de trabajo

Sacar de la petición el trabajo que no tiene que ocurrir ahora: enviar el correo, generar el informe. La petición responde antes y el trabajo se ejecuta después, con reintentos.

> Se enseña en la [clase 110](../classes/parte-8-tiempo-real-y-segundo-plano/110-colas-de-trabajo/README.md) 🚧 · se desarrolla en el [módulo 05](../curriculum/05-backend-y-api.md) · ver también [Reintento](#reintento), [Tarea programada](#tarea-programada).

#### Evento de dominio

Un hecho del negocio que ya ocurrió —«tarea completada»— publicado para que otros reaccionen. Desacopla a quien lo produce de quien lo consume, y hace más difícil seguir el flujo completo.

> Se enseña en la [clase 113](../classes/parte-8-tiempo-real-y-segundo-plano/113-eventos-de-dominio/README.md) 🚧 · se desarrolla en el [módulo 06](../curriculum/06-persistencia-y-dominio.md) · ver también [Cola de trabajo](#cola-de-trabajo).

#### Eventos enviados por el servidor

Un canal HTTP de una sola dirección por el que el servidor empuja mensajes. Reconecta solo y reanuda desde el último identificador recibido, y no necesita otro protocolo.

También: *(SSE)*

> Se enseña en la [clase 106](../classes/parte-8-tiempo-real-y-segundo-plano/106-eventos-enviados-por-el-servidor/README.md) 🚧 · ver también [WebSocket](#websocket), [Sondeo](#sondeo).

#### Reintento

Volver a ejecutar un trabajo que falló. Solo es seguro si el trabajo es idempotente: reintentar un cobro no idempotente cobra dos veces. Y necesita espera creciente, o el reintento tumba lo que ya estaba caído.

> Se enseña en la [clase 112](../classes/parte-8-tiempo-real-y-segundo-plano/112-reintentos-e-idempotencia/README.md) 🚧 · ver también [Idempotencia](#idempotencia), [Cola de trabajo](#cola-de-trabajo).

#### Sondeo

Preguntar cada cierto tiempo si hay novedades. Simple, funciona en todas partes y desperdicia peticiones; el sondeo largo reduce el desperdicio manteniendo la petición abierta.

También: *(Polling)*

> Se enseña en la [clase 105](../classes/parte-8-tiempo-real-y-segundo-plano/105-sondeo/README.md) 🚧 · se desarrolla en el [módulo 05](../curriculum/05-backend-y-api.md) · ver también [Eventos enviados por el servidor](#eventos-enviados-por-el-servidor), [WebSocket](#websocket).

#### Tarea programada

Trabajo que se ejecuta a una hora, no ante una petición. Con varias instancias hace falta decidir quién la ejecuta, o se ejecuta tantas veces como instancias haya.

> Se enseña en la [clase 111](../classes/parte-8-tiempo-real-y-segundo-plano/111-tareas-programadas/README.md) 🚧 · ver también [Cola de trabajo](#cola-de-trabajo).

#### WebSocket

Un canal bidireccional que empieza como una petición HTTP y cambia de protocolo. Da más y cuesta más: la reconexión, el estado de la conexión y el reparto entre instancias son tuyos.

> Se enseña en la [clase 107](../classes/parte-8-tiempo-real-y-segundo-plano/107-websocket/README.md) 🚧 · se desarrolla en el [módulo 05](../curriculum/05-backend-y-api.md) · ver también [Eventos enviados por el servidor](#eventos-enviados-por-el-servidor).

### Móvil, escritorio y sin conexión

#### Conflicto

Dos cambios sobre el mismo dato hechos sin verse. Alguien tiene que decidir cuál gana, y «el último que escribe» es una decisión, no la ausencia de una.

> Se enseña en la [clase 119](../classes/parte-9-movil-escritorio-y-sin-conexion/119-sincronizacion-y-conflictos/README.md) 🚧 · ver también [Sincronización](#sincronización), [Sin conexión primero](#sin-conexión-primero).

#### Sin conexión primero

Diseñar para que la aplicación funcione sin red y sincronice cuando la haya. Cambia el modelo de datos entero: el estado local pasa a ser la fuente y el servidor, un par que reconcilia.

También: *(Offline-first)*

> Se enseña en la [clase 118](../classes/parte-9-movil-escritorio-y-sin-conexion/118-funcionar-sin-conexion/README.md) 🚧 · se desarrolla en el [módulo 09](../curriculum/09-movil-escritorio-y-offline.md) · ver también [Sincronización](#sincronización), [Conflicto](#conflicto).

#### Sincronización

Reconciliar el estado local con el remoto después de trabajar sin conexión. Necesita saber qué cambió, en qué orden y qué hacer cuando las dos partes cambiaron lo mismo.

> Se enseña en la [clase 119](../classes/parte-9-movil-escritorio-y-sin-conexion/119-sincronizacion-y-conflictos/README.md) 🚧 · ver también [Conflicto](#conflicto), [Sin conexión primero](#sin-conexión-primero).

### Calidad, rendimiento y operación

#### Arranque en frío

El tiempo desde que el proceso empieza hasta que puede atender. Irrelevante en un servidor que vive semanas y decisivo cuando el entorno escala a cero — y es donde más se nota lo que un framework hace al arrancar.

> Se enseña en la [clase 136](../classes/parte-10-calidad-y-operacion/136-arranque-en-frio/README.md) 🚧 · se desarrolla en el [módulo 08](../curriculum/08-calidad-rendimiento-y-operacion.md) · ver también [Salud y preparación](#salud-y-preparación), [Empaquetado](#empaquetado).

#### Configuración por entorno

Que lo que cambia entre desarrollo y producción venga de fuera del artefacto —variables de entorno— y no de un `if`. Y que **falte** una variable obligatoria haga fallar el arranque, no la primera petición.

> Se enseña en la [clase 075](../classes/parte-5-identidad-y-seguridad/075-secretos-y-configuracion/README.md) · se desarrolla en el [módulo 08](../curriculum/08-calidad-rendimiento-y-operacion.md) · ver también [Secreto](#secreto), [Empaquetado](#empaquetado).

#### Doble de prueba

Un sustituto de una dependencia real durante una prueba. El riesgo no es usarlos: es que el doble se comporte como nadie, y la prueba pase mientras el sistema real falla.

También: *(Mock, Stub, Fake)*

> Se enseña en la [clase 126](../classes/parte-10-calidad-y-operacion/126-dobles-de-prueba/README.md) 🚧 · se desarrolla en el [módulo 08](../curriculum/08-calidad-rendimiento-y-operacion.md) · ver también [Pirámide de pruebas](#pirámide-de-pruebas), [Prueba de contrato](#prueba-de-contrato).

#### Empaquetado

Convertir el código en un artefacto desplegable: un `.jar`, una imagen de contenedor, un directorio con sus dependencias. El mismo artefacto debe poder ir a todos los entornos, cambiando solo la configuración.

> Se enseña en la [clase 135](../classes/parte-10-calidad-y-operacion/135-empaquetado-y-despliegue/README.md) 🚧 · se desarrolla en el [módulo 08](../curriculum/08-calidad-rendimiento-y-operacion.md) · ver también [Configuración por entorno](#configuración-por-entorno), [Arranque en frío](#arranque-en-frío).

#### Medir antes de optimizar

No tocar el rendimiento sin una medición previa que diga dónde está el coste. La intuición sobre qué es lento acierta poco, y optimizar lo que no era el cuello de botella cuesta lo mismo y no mejora nada.

> Se enseña en la [clase 137](../classes/parte-10-calidad-y-operacion/137-medir-antes-de-optimizar/README.md) 🚧 · se desarrolla en el [módulo 08](../curriculum/08-calidad-rendimiento-y-operacion.md) · ver también [Percentil](#percentil).

#### Métrica

Un número agregado en el tiempo: peticiones por segundo, latencia por percentil, errores por minuto. Responde «¿cómo va el sistema?», no «¿qué le pasó a esta petición?».

> Se enseña en la [clase 131](../classes/parte-10-calidad-y-operacion/131-metricas/README.md) 🚧 · se desarrolla en el [módulo 08](../curriculum/08-calidad-rendimiento-y-operacion.md) · ver también [Traza](#traza), [Registro estructurado](#registro-estructurado).

#### Percentil

El valor por debajo del cual queda un porcentaje de las mediciones. La media esconde a los usuarios lentos; el p95 y el p99 son los que describen lo que la gente sufre.

> Se enseña en la [clase 007](../classes/parte-0-el-metodo/007-como-se-mide-y-como-se-miente-el-rendimiento/README.md) · se desarrolla en el [módulo 08](../curriculum/08-calidad-rendimiento-y-operacion.md) · ver también [Métrica](#métrica), [Medir antes de optimizar](#medir-antes-de-optimizar).

#### Pirámide de pruebas

La proporción entre pruebas rápidas y aisladas, pruebas de integración y pruebas de extremo a extremo. Muchas de las primeras y pocas de las últimas: no por dogma, sino porque el coste de mantenerlas crece hacia arriba.

> Se enseña en la [clase 125](../classes/parte-10-calidad-y-operacion/125-la-piramide-de-pruebas/README.md) 🚧 · se desarrolla en el [módulo 08](../curriculum/08-calidad-rendimiento-y-operacion.md) · ver también [Doble de prueba](#doble-de-prueba).

#### Prueba de contrato

Una prueba que comprueba que dos partes siguen entendiéndose: lo que el productor emite es lo que el consumidor espera. Detecta el cambio incompatible antes del despliegue, sin levantar los dos sistemas.

> Se enseña en la [clase 129](../classes/parte-10-calidad-y-operacion/129-pruebas-de-contrato/README.md) 🚧 · se desarrolla en el [módulo 08](../curriculum/08-calidad-rendimiento-y-operacion.md) · ver también [Cambio incompatible](#cambio-incompatible), [Doble de prueba](#doble-de-prueba).

#### Registro estructurado

Emitir los registros como datos —un objeto por línea— en lugar de como frases. Es lo que permite buscar, filtrar y agregar sin escribir expresiones regulares sobre prosa.

> Se enseña en la [clase 130](../classes/parte-10-calidad-y-operacion/130-registro-estructurado/README.md) 🚧 · se desarrolla en el [módulo 08](../curriculum/08-calidad-rendimiento-y-operacion.md) · ver también [Métrica](#métrica), [Traza](#traza), [Identificador de correlación](#identificador-de-correlación).

#### Salud y preparación

Dos preguntas distintas: **salud** es «¿el proceso está vivo?» y **preparación** es «¿puede atender ya?». Confundirlas hace que un orquestador reinicie un proceso sano o mande tráfico a uno que aún no puede responder.

También: *(Health check, Readiness)*

> Se enseña en la [clase 133](../classes/parte-10-calidad-y-operacion/133-salud-y-preparacion/README.md) 🚧 · se desarrolla en el [módulo 08](../curriculum/08-calidad-rendimiento-y-operacion.md) · ver también [Arranque en frío](#arranque-en-frío).

#### Traza

El recorrido de una petición por todos los servicios que atraviesa, con el tiempo de cada tramo. Responde «¿dónde se fue el tiempo?», que es la pregunta que ni las métricas ni los registros contestan.

> Se enseña en la [clase 132](../classes/parte-10-calidad-y-operacion/132-trazas/README.md) 🚧 · se desarrolla en el [módulo 08](../curriculum/08-calidad-rendimiento-y-operacion.md) · ver también [Métrica](#métrica), [Identificador de correlación](#identificador-de-correlación).

### Legado, migración y decisión

#### Fin de vida

La fecha a partir de la cual una versión deja de recibir correcciones, incluidas las de seguridad. Es un dato público y comprobable, y es la variable que más pesa al elegir con horizonte de años.

También: *(EOL)*

> Se enseña en la [clase 146](../classes/parte-11-legado-migracion-y-decision/146-fin-de-vida-y-soporte/README.md) 🚧 · se desarrolla en el [módulo 11](../curriculum/11-seleccion-y-sostenibilidad.md) · ver también [Coste total](#coste-total), [Versionado semántico](#versionado-semántico).

#### Higuera estranguladora

Migrar sustituyendo el sistema viejo poco a poco, con las dos versiones conviviendo detrás de una fachada que decide a cuál va cada petición. Evita la reescritura total, que es donde mueren los proyectos de migración.

También: *(Strangler fig)*

> Se enseña en la [clase 140](../classes/parte-11-legado-migracion-y-decision/140-la-higuera-estranguladora/README.md) 🚧 · se desarrolla en el [módulo 10](../curriculum/10-modernizacion-y-migracion.md) · ver también [Prueba de caracterización](#prueba-de-caracterización), [Micro-frontend](#micro-frontend).

#### Micro-frontend

Partir una interfaz en aplicaciones independientes que se despliegan por separado. Resuelve un problema de organización a cambio de un coste técnico real: duplicación, coherencia visual y rendimiento.

> Se enseña en la [clase 142](../classes/parte-11-legado-migracion-y-decision/142-micro-frontends/README.md) 🚧 · se desarrolla en el [módulo 10](../curriculum/10-modernizacion-y-migracion.md) · ver también [Higuera estranguladora](#higuera-estranguladora).

#### Migrar sin parar

Cambiar el esquema o el sistema sin cortar el servicio, en pasos que siempre dejan un estado válido: escribir en los dos sitios, copiar lo viejo, leer del nuevo, retirar el antiguo.

> Se enseña en la [clase 143](../classes/parte-11-legado-migracion-y-decision/143-migrar-datos-sin-parar/README.md) 🚧 · se desarrolla en el [módulo 10](../curriculum/10-modernizacion-y-migracion.md) · ver también [Migración](#migración), [Higuera estranguladora](#higuera-estranguladora).

#### Prueba de caracterización

Una prueba que documenta lo que el sistema **hace hoy**, sin juzgar si está bien. Es la red de seguridad antes de tocar código que nadie entiende: si el comportamiento cambia, se entera alguien.

> Se enseña en la [clase 139](../classes/parte-11-legado-migracion-y-decision/139-caracterizar-con-pruebas/README.md) 🚧 · se desarrolla en el [módulo 10](../curriculum/10-modernizacion-y-migracion.md) · ver también [Higuera estranguladora](#higuera-estranguladora).

### Herramientas, archivos y comandos

#### Archivo de bloqueo

El archivo que la herramienta genera junto al manifiesto con la versión **exacta** de cada dependencia y de las dependencias de tus dependencias. Es lo que hace que la instalación de hoy sea igual a la de dentro de seis meses. Se versiona; no se edita a mano.

También: *(Lockfile)*

> Se enseña en la [clase 078](../classes/parte-5-identidad-y-seguridad/078-dependencias-vulnerables/README.md) · ver también [Manifiesto](#manifiesto), [Dependencia transitiva](#dependencia-transitiva).

#### Cadena de herramientas

El conjunto de ejecutables que una implementación necesita para arrancar: `node` y `pnpm`, `python`, `java` y `mvn`, `dotnet`, `php` y `composer`, `ruby` y `bundle`, o `go`. Cada implementación la declara en su `ejecutar.json`.

También: *(Toolchain)*

> ver también [Verde honesto](#verde-honesto), [Manifiesto](#manifiesto).

#### Dependencia

Código de terceros que tu programa necesita para funcionar. Se declara en el manifiesto y se descarga con un comando. Cada una es una decisión que alguien tendrá que entender, actualizar y auditar.

> Se enseña en la [clase 001](../classes/parte-0-el-metodo/001-que-hace-un-framework-que-una-biblioteca-no-hace/README.md) · ver también [Dependencia transitiva](#dependencia-transitiva), [Coste total](#coste-total).

#### Dependencia transitiva

Una dependencia que no elegiste: la trajo otra que sí elegiste. Una aplicación que declara dos suele ejecutar seis, y un aviso de seguridad sobre una transitiva no se arregla actualizándola a ella — o subes a quien la trajo, o fuerzas la versión.

> Se enseña en la [clase 078](../classes/parte-5-identidad-y-seguridad/078-dependencias-vulnerables/README.md) · ver también [Archivo de bloqueo](#archivo-de-bloqueo), [Cadena de suministro](#cadena-de-suministro).

#### Manifiesto

El archivo donde se declaran las dependencias de un proyecto: `package.json`, `requirements.txt`, `pom.xml`, `composer.json`, `Gemfile`, `go.mod`, `*.csproj`. Cada ecosistema tiene el suyo y todos hacen lo mismo.

> Se enseña en la [clase 001](../classes/parte-0-el-metodo/001-que-hace-un-framework-que-una-biblioteca-no-hace/README.md) · ver también [Archivo de bloqueo](#archivo-de-bloqueo), [Dependencia](#dependencia).

#### Versionado semántico

La convención `MAYOR.MENOR.PARCHE`: el primer número anuncia una ruptura, el segundo una función nueva compatible y el tercero una corrección. Los rangos del manifiesto —`^5.1.0`— declaran hasta dónde aceptas actualizaciones automáticas.

También: *(SemVer)*

> Se enseña en la [clase 078](../classes/parte-5-identidad-y-seguridad/078-dependencias-vulnerables/README.md) · se desarrolla en el [módulo 11](../curriculum/11-seleccion-y-sostenibilidad.md) · ver también [Fin de vida](#fin-de-vida).

### El vocabulario de este laboratorio

#### Contrato

El comportamiento exigido, escrito antes que las implementaciones y **idéntico para todas**. Vive en el `contrato.json` de cada clase y es lo que convierte una comparación en una medición. Adaptarlo a un framework la invalida.

> Se enseña en la [clase 003](../classes/parte-0-el-metodo/003-el-contrato-como-unidad-de-comparacion/README.md) · se desarrolla en el [módulo 01](../curriculum/01-http-eventos-y-contratos.md) · ver también [Elenco](#elenco), [Verde honesto](#verde-honesto).

#### Elenco

Los frameworks para los que el problema de una clase existe de verdad. Los lenguajes son intercambiables y los frameworks no: Spring Boot no implementa reactividad en el cliente. Si un framework no lo hace de verdad, **sale del elenco con su explicación** — no se simula.

> Se enseña en la [clase 009](../classes/parte-0-el-metodo/009-el-elenco-por-que-no-todos-resuelven-todo/README.md) · ver también [Taxonomía](#taxonomía), [Contrato](#contrato).

#### Pista

El grupo temático al que pertenece una clase —`backend`, `frontend`, `fullstack`, `datos`, `plataforma`— y que define su elenco por omisión. Está declarada en `classes/_manifest.json`.

> ver también [Elenco](#elenco).

#### Verde honesto

Un resultado que distingue tres estados y nunca los mezcla: **verificada** (se ejecutó y pasó), **fallo** (se ejecutó y falló) y **omitida** (no se ejecutó, y se dice por qué). Un informe que dijera «todo bien» habiendo ejecutado tres de diez estaría mintiendo.

> Se enseña en la [clase 010](../classes/parte-0-el-metodo/010-el-metodo-de-esta-obra/README.md) · ver también [Contrato](#contrato), [Cadena de herramientas](#cadena-de-herramientas).

## 🧰 Las cadenas de herramientas

Los ejecutables que hace falta tener para ejecutar cada ecosistema del laboratorio. La receta completa de instalación está en [`empezar/`](../empezar/README.md), y `node scripts/doctor.mjs` dice cuáles tienes.

| Cadena | Versión de referencia | Se comprueba con | Qué desbloquea |
| --- | --- | --- | --- |
| **Node.js** | 22 o superior | `node --version` | Es el requisito del propio laboratorio: los verificadores, el generador del sitio y el ejecutor de clases son scripts de Node sin dependencias. |
| **Node.js + pnpm** | Node 22 · pnpm 10 | `pnpm --version` | Es el gestor de paquetes admitido para JavaScript y TypeScript. Instala una sola copia de cada dependencia y enlaza el resto, que es lo que hace viable tener decenas de implementaciones con `node_modules` propio. |
| **Python** | 3.11 o superior | `python --version` | Ejecuta las implementaciones de Flask, Django, FastAPI y SQLAlchemy — el ecosistema con más clases del laboratorio junto a Node. |
| **JDK + Apache Maven** | JDK 21 · Maven 3.9 | `java -version` | Compila y ejecuta Spring Boot e Hibernate. Maven no es opcional: las implementaciones declaran sus dependencias en `pom.xml` y se empaquetan antes de arrancar. |
| **.NET SDK** | 8 o superior | `dotnet --version` | Compila y ejecuta ASP.NET Core, Entity Framework Core y Dapper. Un único ejecutable —`dotnet`— restaura, compila y arranca. |
| **PHP + Composer** | PHP 8.2 · Composer 2 | `php --version` | Ejecuta Laravel y Eloquent. Composer aporta además el autocargador PSR-4, que es lo que permite que el controlador frontal de la clase 011 encuentre las clases sin un solo `require`. |
| **Ruby + Bundler** | Ruby 3.3 · Bundler 2 | `ruby --version` | Ejecuta Ruby on Rails y Active Record — el origen de casi todas las convenciones que el resto del catálogo copió después. |
| **Go** | 1.22 o superior | `go version` | Ejecuta Gin. Es la única cadena que no necesita paso de preparación: `go run` resuelve dependencias, compila y arranca en un solo comando. |
| **Rust** | 1.80 o superior | `cargo --version` | Ejecuta axum. Es la única cadena donde el modo de compilación cambia los números de rendimiento en un orden de magnitud: `cargo build` a secas compila sin optimizar, y medir eso no compara nada. |

## 🗂️ Las tecnologías del catálogo

Las 138 tecnologías que el programa sitúa, con su categoría y su ecosistema. Cada una tiene su ficha a fondo en el Atlas. **Estar en el catálogo no es una recomendación**, y el número de descargas o de estrellas no aparece en ninguna entrada.

### JavaScript/TypeScript · 32

| Tecnología | Qué es | Desde | Estado | Ficha |
| --- | --- | ---: | --- | --- |
| **Astro** | web-metaframework | 2021 | activo | [ficha](../atlas/fichas/astro.md) |
| **Bun** | entorno de ejecución | 2022 | activo | [ficha](../atlas/fichas/bun.md) |
| **Capacitor** | runtime-bridge | 2019 | activo | [ficha](../atlas/fichas/capacitor.md) |
| **Deno** | entorno de ejecución | 2018 | activo | [ficha](../atlas/fichas/deno.md) |
| **Docusaurus** | documentation-framework | 2017 | activo | [ficha](../atlas/fichas/docusaurus.md) |
| **Drizzle ORM** | ORM | 2022 | activo | [ficha](../atlas/fichas/drizzle.md) |
| **Electron** | desktop-runtime | 2013 | activo | [ficha](../atlas/fichas/electron.md) |
| **Gatsby** | react-metaframework | 2015 | mantenimiento | [ficha](../atlas/fichas/gatsby.md) |
| **Hono** | framework web | 2021 | activo | [ficha](../atlas/fichas/hono.md) |
| **Ionic** | ui-toolkit | 2013 | activo | [ficha](../atlas/fichas/ionic.md) |
| **Lit** | web-components-library | 2021 | activo | [ficha](../atlas/fichas/lit.md) |
| **NativeScript** | framework de interfaz | 2014 | activo | [ficha](../atlas/fichas/nativescript.md) |
| **Next.js** | react-metaframework | 2016 | activo | [ficha](../atlas/fichas/nextjs.md) |
| **Nitro** | server-toolkit | 2021 | activo | [ficha](../atlas/fichas/nitro.md) |
| **Nuxt** | vue-metaframework | 2016 | activo | [ficha](../atlas/fichas/nuxt.md) |
| **Preact** | biblioteca de interfaz | 2015 | activo | [ficha](../atlas/fichas/preact.md) |
| **Prisma ORM** | ORM | 2021 | activo | [ficha](../atlas/fichas/prisma.md) |
| **Qwik** | framework de interfaz | 2021 | activo | [ficha](../atlas/fichas/qwik.md) |
| **React** | biblioteca de interfaz | 2013 | activo | [ficha](../atlas/fichas/react.md) |
| **React Native** | framework de interfaz | 2015 | activo | [ficha](../atlas/fichas/react-native.md) |
| **React Router** | routing-library | 2014 | activo | [ficha](../atlas/fichas/react-router.md) |
| **RedwoodJS** | full-stack-framework | 2020 | activo | [ficha](../atlas/fichas/redwoodjs.md) |
| **Remix** | react-metaframework | 2021 | activo | [ficha](../atlas/fichas/remix.md) |
| **SolidJS** | biblioteca de interfaz | 2018 | activo | [ficha](../atlas/fichas/solid.md) |
| **SolidStart** | solid-metaframework | 2024 | activo | [ficha](../atlas/fichas/solidstart.md) |
| **Svelte** | framework de interfaz | 2016 | activo | [ficha](../atlas/fichas/svelte.md) |
| **SvelteKit** | svelte-metaframework | 2022 | activo | [ficha](../atlas/fichas/sveltekit.md) |
| **tRPC** | rpc-library | 2020 | activo | [ficha](../atlas/fichas/trpc.md) |
| **TypeORM** | ORM | 2016 | activo | [ficha](../atlas/fichas/typeorm.md) |
| **Vite** | herramienta de construcción | 2020 | activo | [ficha](../atlas/fichas/vite.md) |
| **VitePress** | documentation-framework | 2022 | activo | [ficha](../atlas/fichas/vitepress.md) |
| **Vue** | framework de interfaz | 2014 | activo | [ficha](../atlas/fichas/vue.md) |

### JavaScript · 21

| Tecnología | Qué es | Desde | Estado | Ficha |
| --- | --- | ---: | --- | --- |
| **Alpine.js** | dom-library | 2019 | activo | [ficha](../atlas/fichas/alpinejs.md) |
| **AngularJS** | framework de interfaz | 2010 | historico | [ficha](../atlas/fichas/angularjs.md) |
| **Apache Cordova** | runtime-bridge | 2009 | mantenimiento | [ficha](../atlas/fichas/cordova.md) |
| **Aurelia** | framework de interfaz | 2015 | mantenimiento | [ficha](../atlas/fichas/aurelia.md) |
| **Backbone.js** | mv-library | 2010 | mantenimiento | [ficha](../atlas/fichas/backbone.md) |
| **Dojo Toolkit** | ui-toolkit | 2004 | mantenimiento | [ficha](../atlas/fichas/dojo.md) |
| **Eleventy** | static-site-generator | 2018 | activo | [ficha](../atlas/fichas/eleventy.md) |
| **Ember.js** | framework de interfaz | 2011 | activo | [ficha](../atlas/fichas/ember.md) |
| **Ext JS** | ui-toolkit | 2007 | activo | [ficha](../atlas/fichas/extjs.md) |
| **htmx** | hypermedia-library | 2020 | activo | [ficha](../atlas/fichas/htmx.md) |
| **jQuery** | dom-library | 2006 | mantenimiento | [ficha](../atlas/fichas/jquery.md) |
| **Knockout** | mvvm-library | 2010 | mantenimiento | [ficha](../atlas/fichas/knockout.md) |
| **Marko** | framework de interfaz | 2014 | activo | [ficha](../atlas/fichas/marko.md) |
| **Mithril** | framework de interfaz | 2014 | mantenimiento | [ficha](../atlas/fichas/mithril.md) |
| **MooTools** | dom-library | 2006 | historico | [ficha](../atlas/fichas/mootools.md) |
| **Node.js** | entorno de ejecución | 2009 | activo | [ficha](../atlas/fichas/nodejs.md) |
| **Prototype** | dom-library | 2005 | historico | [ficha](../atlas/fichas/prototype-js.md) |
| **Rollup** | herramienta de construcción | 2015 | activo | [ficha](../atlas/fichas/rollup.md) |
| **Stimulus** | dom-library | 2018 | activo | [ficha](../atlas/fichas/stimulus.md) |
| **Turbo (Hotwire)** | hypermedia-library | 2021 | activo | [ficha](../atlas/fichas/hotwire-turbo.md) |
| **webpack** | herramienta de construcción | 2012 | activo | [ficha](../atlas/fichas/webpack.md) |

### JVM · 12

| Tecnología | Qué es | Desde | Estado | Ficha |
| --- | --- | ---: | --- | --- |
| **Apache Struts** | framework web | 2000 | mantenimiento | [ficha](../atlas/fichas/struts.md) |
| **Dropwizard** | framework de aplicación | 2011 | activo | [ficha](../atlas/fichas/dropwizard.md) |
| **Eclipse Vert.x** | reactive-toolkit | 2012 | activo | [ficha](../atlas/fichas/vertx.md) |
| **Grails** | full-stack-framework | 2006 | activo | [ficha](../atlas/fichas/grails.md) |
| **Hibernate ORM** | ORM | 2001 | activo | [ficha](../atlas/fichas/hibernate.md) |
| **Jakarta Faces (JSF)** | component-framework | 2004 | mantenimiento | [ficha](../atlas/fichas/jakarta-faces.md) |
| **Ktor** | framework web | 2018 | activo | [ficha](../atlas/fichas/ktor.md) |
| **Micronaut** | framework de aplicación | 2018 | activo | [ficha](../atlas/fichas/micronaut.md) |
| **Play Framework** | framework web | 2007 | activo | [ficha](../atlas/fichas/play-framework.md) |
| **Quarkus** | framework de aplicación | 2019 | activo | [ficha](../atlas/fichas/quarkus.md) |
| **Spring Boot** | framework de aplicación | 2014 | activo | [ficha](../atlas/fichas/spring-boot.md) |
| **Spring Framework** | framework de aplicación | 2003 | activo | [ficha](../atlas/fichas/spring-framework.md) |

### PHP · 12

| Tecnología | Qué es | Desde | Estado | Ficha |
| --- | --- | ---: | --- | --- |
| **CakePHP** | full-stack-framework | 2005 | activo | [ficha](../atlas/fichas/cakephp.md) |
| **CodeIgniter** | framework web | 2006 | activo | [ficha](../atlas/fichas/codeigniter.md) |
| **Drupal** | cms | 2001 | activo | [ficha](../atlas/fichas/drupal.md) |
| **Eloquent (Laravel)** | ORM | 2011 | activo | [ficha](../atlas/fichas/eloquent.md) |
| **Laminas** | framework de aplicación | 2019 | activo | [ficha](../atlas/fichas/laminas.md) |
| **Laravel** | full-stack-framework | 2011 | activo | [ficha](../atlas/fichas/laravel.md) |
| **Phalcon** | full-stack-framework | 2012 | activo | [ficha](../atlas/fichas/phalcon.md) |
| **Slim** | framework web | 2010 | activo | [ficha](../atlas/fichas/slim.md) |
| **Symfony** | framework web | 2005 | activo | [ficha](../atlas/fichas/symfony.md) |
| **WordPress** | cms | 2003 | activo | [ficha](../atlas/fichas/wordpress.md) |
| **Yii** | full-stack-framework | 2008 | activo | [ficha](../atlas/fichas/yii.md) |
| **Zend Framework** | framework de aplicación | 2006 | historico | [ficha](../atlas/fichas/zend-framework.md) |

### Python · 12

| Tecnología | Qué es | Desde | Estado | Ficha |
| --- | --- | ---: | --- | --- |
| **aiohttp** | http-toolkit | 2014 | activo | [ficha](../atlas/fichas/aiohttp.md) |
| **Bottle** | framework web | 2009 | mantenimiento | [ficha](../atlas/fichas/bottle.md) |
| **Django** | framework web | 2005 | activo | [ficha](../atlas/fichas/django.md) |
| **FastAPI** | framework web | 2018 | activo | [ficha](../atlas/fichas/fastapi.md) |
| **Flask** | framework web | 2010 | activo | [ficha](../atlas/fichas/flask.md) |
| **Kivy** | framework de interfaz | 2011 | activo | [ficha](../atlas/fichas/kivy.md) |
| **Litestar** | framework web | 2021 | activo | [ficha](../atlas/fichas/litestar.md) |
| **Pyramid** | framework web | 2010 | activo | [ficha](../atlas/fichas/pyramid.md) |
| **Sanic** | framework web | 2016 | activo | [ficha](../atlas/fichas/sanic.md) |
| **SQLAlchemy** | ORM | 2006 | activo | [ficha](../atlas/fichas/sqlalchemy.md) |
| **Starlette** | asgi-toolkit | 2018 | activo | [ficha](../atlas/fichas/starlette.md) |
| **Tornado** | framework web | 2009 | mantenimiento | [ficha](../atlas/fichas/tornado.md) |

### .NET · 8

| Tecnología | Qué es | Desde | Estado | Ficha |
| --- | --- | ---: | --- | --- |
| **.NET MAUI** | framework de interfaz | 2022 | activo | [ficha](../atlas/fichas/dotnet-maui.md) |
| **ASP.NET Core** | framework web | 2016 | activo | [ficha](../atlas/fichas/aspnet-core.md) |
| **Avalonia** | framework de interfaz | 2020 | activo | [ficha](../atlas/fichas/avalonia.md) |
| **Blazor** | component-framework | 2018 | activo | [ficha](../atlas/fichas/blazor.md) |
| **Dapper** | micro-ORM | 2011 | activo | [ficha](../atlas/fichas/dapper.md) |
| **Entity Framework Core** | ORM | 2016 | activo | [ficha](../atlas/fichas/entity-framework-core.md) |
| **WPF** | framework de interfaz | 2006 | mantenimiento | [ficha](../atlas/fichas/wpf.md) |
| **Xamarin** | framework de interfaz | 2011 | historico | [ficha](../atlas/fichas/xamarin.md) |

### Go · 7

| Tecnología | Qué es | Desde | Estado | Ficha |
| --- | --- | ---: | --- | --- |
| **Beego** | full-stack-framework | 2012 | activo | [ficha](../atlas/fichas/beego.md) |
| **chi** | routing-library | 2015 | activo | [ficha](../atlas/fichas/chi.md) |
| **Echo** | framework web | 2015 | activo | [ficha](../atlas/fichas/echo.md) |
| **esbuild** | herramienta de construcción | 2020 | activo | [ficha](../atlas/fichas/esbuild.md) |
| **Fiber** | framework web | 2020 | activo | [ficha](../atlas/fichas/fiber.md) |
| **Gin** | framework web | 2014 | activo | [ficha](../atlas/fichas/gin.md) |
| **Hugo** | static-site-generator | 2013 | activo | [ficha](../atlas/fichas/hugo.md) |

### Node.js · 6

| Tecnología | Qué es | Desde | Estado | Ficha |
| --- | --- | ---: | --- | --- |
| **Express** | framework web | 2010 | activo | [ficha](../atlas/fichas/express.md) |
| **Fastify** | framework web | 2016 | activo | [ficha](../atlas/fichas/fastify.md) |
| **hapi** | framework web | 2011 | activo | [ficha](../atlas/fichas/hapi.md) |
| **Koa** | framework web | 2013 | activo | [ficha](../atlas/fichas/koa.md) |
| **Sails.js** | full-stack-framework | 2012 | mantenimiento | [ficha](../atlas/fichas/sails.md) |
| **Socket.IO** | realtime-library | 2010 | activo | [ficha](../atlas/fichas/socketio.md) |

### Rust · 6

| Tecnología | Qué es | Desde | Estado | Ficha |
| --- | --- | ---: | --- | --- |
| **Actix Web** | framework web | 2017 | activo | [ficha](../atlas/fichas/actix-web.md) |
| **axum** | framework web | 2021 | activo | [ficha](../atlas/fichas/axum.md) |
| **Leptos** | framework de interfaz | 2022 | activo | [ficha](../atlas/fichas/leptos.md) |
| **Rocket** | framework web | 2016 | activo | [ficha](../atlas/fichas/rocket.md) |
| **Tauri** | desktop-runtime | 2022 | activo | [ficha](../atlas/fichas/tauri.md) |
| **Yew** | framework de interfaz | 2017 | activo | [ficha](../atlas/fichas/yew.md) |

### Ruby · 5

| Tecnología | Qué es | Desde | Estado | Ficha |
| --- | --- | ---: | --- | --- |
| **Active Record (Rails)** | ORM | 2004 | activo | [ficha](../atlas/fichas/activerecord.md) |
| **Hanami** | full-stack-framework | 2014 | activo | [ficha](../atlas/fichas/hanami.md) |
| **Jekyll** | static-site-generator | 2008 | activo | [ficha](../atlas/fichas/jekyll.md) |
| **Ruby on Rails** | full-stack-framework | 2004 | activo | [ficha](../atlas/fichas/rails.md) |
| **Sinatra** | framework web | 2007 | activo | [ficha](../atlas/fichas/sinatra.md) |

### Apple · 2

| Tecnología | Qué es | Desde | Estado | Ficha |
| --- | --- | ---: | --- | --- |
| **SwiftUI** | ui-toolkit | 2019 | activo | [ficha](../atlas/fichas/swiftui.md) |
| **UIKit** | ui-toolkit | 2008 | activo | [ficha](../atlas/fichas/uikit.md) |

### BEAM · 2

| Tecnología | Qué es | Desde | Estado | Ficha |
| --- | --- | ---: | --- | --- |
| **Phoenix** | full-stack-framework | 2014 | activo | [ficha](../atlas/fichas/phoenix.md) |
| **Phoenix LiveView** | realtime-ui-framework | 2019 | activo | [ficha](../atlas/fichas/phoenix-liveview.md) |

### .NET Framework · 2

| Tecnología | Qué es | Desde | Estado | Ficha |
| --- | --- | ---: | --- | --- |
| **ASP.NET MVC** | framework web | 2009 | historico | [ficha](../atlas/fichas/aspnet-mvc.md) |
| **ASP.NET Web Forms** | component-framework | 2002 | historico | [ficha](../atlas/fichas/aspnet-webforms.md) |

### Node.js/TypeScript · 2

| Tecnología | Qué es | Desde | Estado | Ficha |
| --- | --- | ---: | --- | --- |
| **AdonisJS** | full-stack-framework | 2015 | activo | [ficha](../atlas/fichas/adonisjs.md) |
| **NestJS** | framework de aplicación | 2017 | activo | [ficha](../atlas/fichas/nestjs.md) |

### TypeScript · 2

| Tecnología | Qué es | Desde | Estado | Ficha |
| --- | --- | ---: | --- | --- |
| **Analog** | angular-metaframework | 2023 | activo | [ficha](../atlas/fichas/analog.md) |
| **Angular** | framework de interfaz | 2016 | activo | [ficha](../atlas/fichas/angular.md) |

### Cloud · 1

| Tecnología | Qué es | Desde | Estado | Ficha |
| --- | --- | ---: | --- | --- |
| **Kubernetes** | plataforma | 2014 | activo | [ficha](../atlas/fichas/kubernetes.md) |

### Dart · 1

| Tecnología | Qué es | Desde | Estado | Ficha |
| --- | --- | ---: | --- | --- |
| **Flutter** | ui-sdk | 2017 | activo | [ficha](../atlas/fichas/flutter.md) |

### Bun/TypeScript · 1

| Tecnología | Qué es | Desde | Estado | Ficha |
| --- | --- | ---: | --- | --- |
| **Elysia** | framework web | 2022 | activo | [ficha](../atlas/fichas/elysia.md) |

### Android · 1

| Tecnología | Qué es | Desde | Estado | Ficha |
| --- | --- | ---: | --- | --- |
| **Jetpack Compose** | ui-toolkit | 2021 | activo | [ficha](../atlas/fichas/jetpack-compose.md) |

### Kotlin · 1

| Tecnología | Qué es | Desde | Estado | Ficha |
| --- | --- | ---: | --- | --- |
| **Compose Multiplatform** | ui-toolkit | 2021 | activo | [ficha](../atlas/fichas/compose-multiplatform.md) |

### C · 1

| Tecnología | Qué es | Desde | Estado | Ficha |
| --- | --- | ---: | --- | --- |
| **GTK** | ui-toolkit | 1998 | activo | [ficha](../atlas/fichas/gtk.md) |

### C++ · 1

| Tecnología | Qué es | Desde | Estado | Ficha |
| --- | --- | ---: | --- | --- |
| **Qt** | framework de interfaz | 1995 | activo | [ficha](../atlas/fichas/qt.md) |

## 🎓 Las partes del programa

| Parte | Tema | Clases | Construidas |
| ---: | --- | ---: | ---: |
| 0 | [El método: qué es un framework y cómo se compara](../classes/parte-0-el-metodo/README.md) | 10 | 10 |
| 1 | [Responder: lo primero que hace cualquier framework](../classes/parte-1-responder/README.md) | 15 | 15 |
| 2 | [La tubería: middleware, filtros e interceptores](../classes/parte-2-la-tuberia/README.md) | 13 | 13 |
| 3 | [Validación y contrato](../classes/parte-3-validacion-y-contrato/README.md) | 12 | 12 |
| 4 | [Datos: del SQL a mano al dominio limpio](../classes/parte-4-datos/README.md) | 15 | 15 |
| 5 | [Identidad y seguridad](../classes/parte-5-identidad-y-seguridad/README.md) | 13 | 13 |
| 6 | [La interfaz: del HTML del servidor al componente](../classes/parte-6-la-interfaz/README.md) | 14 | 14 |
| 7 | [Renderizado y full-stack](../classes/parte-7-renderizado-y-fullstack/README.md) | 12 | 10 |
| 8 | [Tiempo real y trabajo en segundo plano](../classes/parte-8-tiempo-real-y-segundo-plano/README.md) | 9 | 0 |
| 9 | [Móvil, escritorio y sin conexión](../classes/parte-9-movil-escritorio-y-sin-conexion/README.md) | 10 | 0 |
| 10 | [Calidad, rendimiento y operación](../classes/parte-10-calidad-y-operacion/README.md) | 14 | 0 |
| 11 | [Legado, migración y decisión](../classes/parte-11-legado-migracion-y-decision/README.md) | 12 | 0 |

> ¿Falta una palabra? Se añade a [`glosario/conceptos.json`](conceptos.json) con su definición y la clase donde se enseña, y se regenera con `node scripts/generate-glosario.mjs`.
