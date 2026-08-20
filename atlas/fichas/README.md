# Fichas del Atlas

> [⬅️ Atlas](../README.md) · [🗂️ Índice completo](../frameworks.md)

Documento generado por `node scripts/generate-atlas.mjs`. No editar a mano.

Una ficha es un **estudio a fondo**: de qué problema nació la tecnología, qué
idea aportó, qué dejó abierto y qué lección deja para decidir hoy. Cada
afirmación se apoya en un libro, una norma o una fuente primaria del propio
proyecto, igual que el resto del programa.

**60 fichas** de las 138 tecnologías del catálogo.
Las demás tienen su contexto en la página de su [ecosistema](../ecosistemas/).

| Ficha | Desde | Ecosistema | Clasificación | Qué enseña |
| --- | ---: | --- | --- | --- |
| [Apache Struts](struts.md) | 2000 | [JVM — Java, Kotlin, Scala y Groovy](../ecosistemas/jvm.md) | `web-framework` | El modelo-vista-controlador estándar de la empresa Java durante años. Sus vulnerabilidades críticas son el caso de estudio obligado sobre cadena de suministro y actualización. |
| [Drupal](drupal.md) | 2001 | [PHP](../ecosistemas/php.md) | `cms` | Gestor de contenidos con modelo de datos configurable, construido sobre componentes de Symfony desde su versión 8. |
| [Hibernate ORM](hibernate.md) | 2001 | [JVM — Java, Kotlin, Scala y Groovy](../ecosistemas/jvm.md) | `orm` | El mapeador objeto-relacional de referencia en Java y el origen de buena parte del vocabulario del campo, incluido el problema de la consulta N+1. |
| [ASP.NET Web Forms](aspnet-webforms.md) | 2002 | [.NET y C#](../ecosistemas/dotnet.md) | `component-framework` | Trasladó el modelo de eventos del escritorio a la web mediante estado de vista en el servidor. Su abstracción sobre HTTP es el ejemplo clásico de por qué el módulo 01 enseña el protocolo primero. |
| [Spring Framework](spring-framework.md) | 2003 | [JVM — Java, Kotlin, Scala y Groovy](../ecosistemas/jvm.md) | `application-framework` | Popularizó la inversión de control y la inyección de dependencias en la empresa, como alternativa ligera a los estándares de la época. |
| [WordPress](wordpress.md) | 2003 | [PHP](../ecosistemas/php.md) | `cms` | No es un framework general y compararlo con uno es un error de categoría. Su licencia copyleft y su modelo de complementos condicionan cualquier decisión construida encima. |
| [Jakarta Faces (JSF)](jakarta-faces.md) | 2004 | [JVM — Java, Kotlin, Scala y Groovy](../ecosistemas/jvm.md) | `component-framework` | Interfaz basada en componentes con estado en servidor, definida como especificación con varias implementaciones. Un modelo de gobierno distinto al de un proyecto único. |
| [Ruby on Rails](rails.md) | 2004 | [Ruby](../ecosistemas/ruby.md) | `full-stack-framework` | Origen de «convención sobre configuración» y de las migraciones de base de datos tal como se entienden hoy. Casi todos los frameworks completos posteriores citan su influencia. |
| [CakePHP](cakephp.md) | 2005 | [PHP](../ecosistemas/php.md) | `full-stack-framework` | Llevó las convenciones de Rails a PHP antes que nadie, con generación de código y ORM incluidos. |
| [Django](django.md) | 2005 | [Python](../ecosistemas/python.md) | `web-framework` | Baterías incluidas: ORM, migraciones, panel de administración, autenticación y formularios. Su panel generado sigue siendo un argumento decisivo para productos internos. |
| [Symfony](symfony.md) | 2005 | [PHP](../ecosistemas/php.md) | `web-framework` | Conjunto de componentes reutilizables además de framework. Buena parte de Laravel, Drupal y otros proyectos se apoya en sus piezas: un caso claro de dependencia invisible. |
| [CodeIgniter](codeigniter.md) | 2006 | [PHP](../ecosistemas/php.md) | `web-framework` | Ligero y sin exigir configuración de servidor especial. Fue la puerta de entrada al patrón modelo-vista-controlador para una generación de programadores PHP. |
| [Grails](grails.md) | 2006 | [JVM — Java, Kotlin, Scala y Groovy](../ecosistemas/jvm.md) | `full-stack-framework` | Convenciones de Rails sobre Spring y Hibernate, con Groovy como lenguaje dinámico de la JVM. |
| [jQuery](jquery.md) | 2006 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `dom-library` | Normalizó un DOM incompatible entre navegadores y popularizó el encadenamiento y los selectores CSS en JavaScript. Buena parte de lo que hoy es API nativa del navegador entró primero como idea suya. |
| [Zend Framework](zend-framework.md) | 2006 | [PHP](../ecosistemas/php.md) | `application-framework` | Framework empresarial de PHP durante una década. Su relevo por Laminas es la guía de migración que conviene leer antes de adoptar cualquier proyecto de un solo patrocinador. |
| [Play Framework](play-framework.md) | 2007 | [JVM — Java, Kotlin, Scala y Groovy](../ecosistemas/jvm.md) | `web-framework` | Recarga en caliente y modelo sin estado en la JVM, con una experiencia de desarrollo inspirada en los frameworks de guion. |
| [Sinatra](sinatra.md) | 2007 | [Ruby](../ecosistemas/ruby.md) | `web-framework` | Definió el estilo minimalista de «verbo, ruta, bloque» que copiaron Flask, Express, Slim y muchos otros. |
| [Yii](yii.md) | 2008 | [PHP](../ecosistemas/php.md) | `full-stack-framework` | Rendimiento y generación de andamiaje como argumentos centrales, con carga perezosa de componentes. |
| [Node.js](nodejs.md) | 2009 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `runtime` | Llevó JavaScript al servidor con un bucle de eventos no bloqueante. No es un framework: es quien ejecuta a todos los de su columna. |
| [AngularJS](angularjs.md) | 2010 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `web-framework` | Popularizó la inyección de dependencias y el enlace bidireccional en el cliente. Su reescritura incompatible como Angular 2 es el caso de estudio más citado sobre coste de migración. |
| [Backbone.js](backbone.md) | 2010 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `mv-library` | Primera estructura ampliamente adoptada para separar modelo y vista en el navegador. Dejó al descubierto el problema que resolverían los frameworks siguientes: sincronizar vista y estado a mano no escala. |
| [Express](express.md) | 2010 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `web-framework` | Definió el modelo de middleware encadenado que copiaron casi todos los frameworks de Node.js. Minimalista no significa biblioteca: posee el bucle de peticiones. |
| [Flask](flask.md) | 2010 | [Python](../ecosistemas/python.md) | `web-framework` | Microframework que dejó a la persona elegir ORM, validación y estructura. El contrapunto exacto de Django dentro del mismo lenguaje. |
| [Knockout](knockout.md) | 2010 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `mvvm-library` | Introdujo el enlace declarativo de datos y los observables en el navegador, la idea que hoy reaparece como «señales». |
| [Slim](slim.md) | 2010 | [PHP](../ecosistemas/php.md) | `web-framework` | Microframework construido sobre los estándares PSR de interoperabilidad, que permiten intercambiar middleware entre frameworks PHP distintos. |
| [Dropwizard](dropwizard.md) | 2011 | [JVM — Java, Kotlin, Scala y Groovy](../ecosistemas/jvm.md) | `application-framework` | Ensambla bibliotecas maduras en un producto operable, con métricas y comprobaciones de salud desde el primer día. |
| [Eloquent (Laravel)](eloquent.md) | 2011 | [PHP](../ecosistemas/php.md) | `orm` | Registro activo en PHP con relaciones expresivas. Su comodidad hace que la consulta N+1 aparezca con especial facilidad. |
| [Ember.js](ember.md) | 2011 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `web-framework` | Convención sobre configuración llevada al cliente, con una política de versiones y migraciones ejemplar: sus guías de actualización son mejores que las de proyectos mucho mayores. |
| [Laravel](laravel.md) | 2011 | [PHP](../ecosistemas/php.md) | `full-stack-framework` | El framework más usado de PHP: ORM Eloquent, migraciones, colas, programación de tareas, pruebas y un ecosistema comercial propio. Redefinió lo que se espera de la experiencia de desarrollo en el lenguaje. |
| [Phalcon](phalcon.md) | 2012 | [PHP](../ecosistemas/php.md) | `full-stack-framework` | Distribuido como extensión compilada de PHP en lugar de código fuente. Rendimiento a cambio de una instalación que no es la habitual del lenguaje. |
| [Eclipse Vert.x](vertx.md) | 2012 | [JVM — Java, Kotlin, Scala y Groovy](../ecosistemas/jvm.md) | `reactive-toolkit` | Modelo de bucle de eventos y bus de mensajes en la JVM, políglota por diseño. |
| [Electron](electron.md) | 2013 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `desktop-runtime` | Empaqueta un navegador completo con la aplicación: máxima compatibilidad, a cambio de tamaño y memoria. |
| [React](react.md) | 2013 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `ui-library` | Impuso la idea de la interfaz como función del estado y el árbol virtual. Es una biblioteca, no un framework: no arranca tu aplicación ni define su ciclo de vida. |
| [Kubernetes](kubernetes.md) | 2014 | [Plataformas de ejecución](../ecosistemas/cloud.md) | `platform` | No es un framework de aplicación y compararlo con uno es un error de categoría. Condiciona, eso sí, las sondas de vida y de disponibilidad que el módulo 12 exige. |
| [Phoenix](phoenix.md) | 2014 | [BEAM — Elixir y Erlang](../ecosistemas/beam.md) | `full-stack-framework` | Aprovecha la máquina virtual de Erlang para manejar cientos de miles de conexiones simultáneas con tolerancia a fallos. |
| [Spring Boot](spring-boot.md) | 2014 | [JVM — Java, Kotlin, Scala y Groovy](../ecosistemas/jvm.md) | `application-framework` | Autoconfiguración y servidor incrustado sobre Spring. Convirtió un framework famoso por su configuración XML en uno de arranque inmediato. |
| [Vue](vue.md) | 2014 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `web-framework` | Adopción progresiva: sirve como etiqueta en una página existente o como framework completo. Su reactividad fina influyó en toda la generación siguiente. |
| [Gatsby](gatsby.md) | 2015 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `react-metaframework` | Popularizó la generación estática con GraphQL como capa de datos unificada. Su declive ilustra el riesgo de una capa de abstracción que hay que aprender aparte. |
| [Preact](preact.md) | 2015 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `ui-library` | Reimplementación compatible con una fracción del tamaño. Útil para razonar sobre cuánto del peso de una biblioteca es esencial y cuánto es accidental. |
| [React Native](react-native.md) | 2015 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `ui-framework` | Usa componentes nativos reales desde JavaScript. El coste del puente entre ambos mundos es su compromiso característico. |
| [Angular](angular.md) | 2016 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `web-framework` | Framework completo con contenedor de dependencias, enrutado, formularios y herramientas en la caja. La opinión arquitectónica más fuerte del ecosistema JavaScript. |
| [Next.js](nextjs.md) | 2016 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `react-metaframework` | Convirtió el renderizado en servidor en la opción por omisión del ecosistema React. Su acoplamiento con una plataforma concreta es la dimensión que el módulo 11 obliga a puntuar. |
| [Svelte](svelte.md) | 2016 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `ui-framework` | Mueve el trabajo del navegador al compilador. Cambia el coste de ejecución por dependencia de la fase de construcción: un compromiso, no una mejora gratuita. |
| [Flutter](flutter.md) | 2017 | [Dart](../ecosistemas/dart.md) | `ui-sdk` | Dibuja su propia interfaz en lugar de usar los componentes del sistema: control total del aspecto a cambio de no heredar los cambios de la plataforma. |
| [NestJS](nestjs.md) | 2017 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `application-framework` | Trae a Node.js el modelo de Angular y Spring: módulos, decoradores e inyección de dependencias por constructor. |
| [FastAPI](fastapi.md) | 2018 | [Python](../ecosistemas/python.md) | `web-framework` | Deriva validación, serialización y documentación OpenAPI de las anotaciones de tipo. Demostró que el tipado opcional de Python podía ser infraestructura, no adorno. |
| [Ktor](ktor.md) | 2018 | [JVM — Java, Kotlin, Scala y Groovy](../ecosistemas/jvm.md) | `web-framework` | Construido sobre corrutinas de Kotlin, con todo el comportamiento añadido mediante plugins explícitos. |
| [Micronaut](micronaut.md) | 2018 | [JVM — Java, Kotlin, Scala y Groovy](../ecosistemas/jvm.md) | `application-framework` | Inyección de dependencias resuelta en compilación, sin reflexión en ejecución. Ataca directamente el coste de arranque de la JVM. |
| [Alpine.js](alpinejs.md) | 2019 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `dom-library` | Comportamiento declarativo en atributos HTML, sin fase de construcción. Recupera el modelo de trabajo de jQuery con el vocabulario reactivo moderno. |
| [Laminas](laminas.md) | 2019 | [PHP](../ecosistemas/php.md) | `application-framework` | Continuación de Zend Framework bajo gobierno de fundación. Ejemplo de transición ordenada de un proyecto corporativo a uno comunitario. |
| [Phoenix LiveView](phoenix-liveview.md) | 2019 | [BEAM — Elixir y Erlang](../ecosistemas/beam.md) | `realtime-ui-framework` | Interfaz interactiva con el estado en el servidor y diferencias enviadas por WebSocket. La alternativa más completa a la aplicación de página única. |
| [Quarkus](quarkus.md) | 2019 | [JVM — Java, Kotlin, Scala y Groovy](../ecosistemas/jvm.md) | `application-framework` | Mueve trabajo del arranque al tiempo de compilación para permitir imágenes nativas y arranques de milisegundos. |
| [htmx](htmx.md) | 2020 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `hypermedia-library` | Devuelve el estado al servidor: el HTML es la respuesta y los atributos deciden qué fragmento se reemplaza. Demuestra que la evolución del campo no es una línea recta hacia el cliente. |
| [Vite](vite.md) | 2020 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `build-tool` | Servidor de desarrollo con módulos nativos y empaquetado solo para producción. Hoy es la base de la mayoría de los metaframeworks. |
| [Astro](astro.md) | 2021 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `web-metaframework` | Arquitectura de islas: por omisión no envía JavaScript y cada componente interactivo se declara explícitamente. Permite mezclar React, Vue y Svelte en la misma página, lo que lo hace un banco de pruebas ideal para comparar. |
| [Compose Multiplatform](compose-multiplatform.md) | 2021 | [JVM — Java, Kotlin, Scala y Groovy](../ecosistemas/jvm.md) | `ui-toolkit` | Lleva el modelo de Compose fuera de Android compartiendo código de interfaz entre plataformas. |
| [Jetpack Compose](jetpack-compose.md) | 2021 | [JVM — Java, Kotlin, Scala y Groovy](../ecosistemas/jvm.md) | `ui-toolkit` | Interfaz declarativa en Android: el mismo cambio de paradigma que vivió la web, una década después. |
| [Lit](lit.md) | 2021 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `web-components-library` | Capa mínima sobre los componentes web del propio estándar. La apuesta por la plataforma en lugar de por el framework. |
| [Qwik](qwik.md) | 2021 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `ui-framework` | Ataca el coste de hidratación reanudando el estado del servidor en lugar de reconstruirlo. Es la respuesta más radical al problema que el módulo 04 mide. |
| [Tauri](tauri.md) | 2022 | [Rust](../ecosistemas/rust.md) | `desktop-runtime` | Usa el motor web del sistema en lugar de incrustar uno: binarios mucho menores, a cambio de diferencias entre plataformas. |

## Orden de lectura sugerido

Las fichas se pueden leer sueltas, pero en este orden cuentan una historia:

1. **Cómo era antes** — Web Forms y Struts: el servidor lo hacía todo, con sus costes.
2. **La convención** — Rails y sus herederos, Django y Laravel.
3. **El navegador toma el mando** — jQuery, AngularJS, React, Vue.
4. **La corrección** — Astro y htmx: el péndulo vuelve, con teoría detrás.
5. **Los que no encajan en esa línea** — Spring Boot, Express, Phoenix.
