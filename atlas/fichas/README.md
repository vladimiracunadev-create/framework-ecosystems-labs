# Fichas del Atlas

> [⬅️ Atlas](../README.md) · [🗂️ Índice completo](../frameworks.md)

Documento generado por `node scripts/generate-atlas.mjs`. No editar a mano.

Una ficha es un **estudio a fondo**: de qué problema nació la tecnología, qué
idea aportó, qué dejó abierto y qué lección deja para decidir hoy. Cada
afirmación se apoya en un libro, una norma o una fuente primaria del propio
proyecto, igual que el resto del programa.

**14 fichas** de las 138 tecnologías del catálogo.
Las demás tienen su contexto en la página de su [ecosistema](../ecosistemas/).

| Ficha | Desde | Ecosistema | Clasificación | Qué enseña |
| --- | ---: | --- | --- | --- |
| [Apache Struts](struts.md) | 2000 | [JVM — Java, Kotlin, Scala y Groovy](../ecosistemas/jvm.md) | `web-framework` | El modelo-vista-controlador estándar de la empresa Java durante años. Sus vulnerabilidades críticas son el caso de estudio obligado sobre cadena de suministro y actualización. |
| [ASP.NET Web Forms](aspnet-webforms.md) | 2002 | [.NET y C#](../ecosistemas/dotnet.md) | `component-framework` | Trasladó el modelo de eventos del escritorio a la web mediante estado de vista en el servidor. Su abstracción sobre HTTP es el ejemplo clásico de por qué el módulo 01 enseña el protocolo primero. |
| [Ruby on Rails](rails.md) | 2004 | [Ruby](../ecosistemas/ruby.md) | `full-stack-framework` | Origen de «convención sobre configuración» y de las migraciones de base de datos tal como se entienden hoy. Casi todos los frameworks completos posteriores citan su influencia. |
| [Django](django.md) | 2005 | [Python](../ecosistemas/python.md) | `web-framework` | Baterías incluidas: ORM, migraciones, panel de administración, autenticación y formularios. Su panel generado sigue siendo un argumento decisivo para productos internos. |
| [jQuery](jquery.md) | 2006 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `dom-library` | Normalizó un DOM incompatible entre navegadores y popularizó el encadenamiento y los selectores CSS en JavaScript. Buena parte de lo que hoy es API nativa del navegador entró primero como idea suya. |
| [AngularJS](angularjs.md) | 2010 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `web-framework` | Popularizó la inyección de dependencias y el enlace bidireccional en el cliente. Su reescritura incompatible como Angular 2 es el caso de estudio más citado sobre coste de migración. |
| [Express](express.md) | 2010 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `web-framework` | Definió el modelo de middleware encadenado que copiaron casi todos los frameworks de Node.js. Minimalista no significa biblioteca: posee el bucle de peticiones. |
| [Laravel](laravel.md) | 2011 | [PHP](../ecosistemas/php.md) | `full-stack-framework` | El framework más usado de PHP: ORM Eloquent, migraciones, colas, programación de tareas, pruebas y un ecosistema comercial propio. Redefinió lo que se espera de la experiencia de desarrollo en el lenguaje. |
| [React](react.md) | 2013 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `ui-library` | Impuso la idea de la interfaz como función del estado y el árbol virtual. Es una biblioteca, no un framework: no arranca tu aplicación ni define su ciclo de vida. |
| [Phoenix](phoenix.md) | 2014 | [BEAM — Elixir y Erlang](../ecosistemas/beam.md) | `full-stack-framework` | Aprovecha la máquina virtual de Erlang para manejar cientos de miles de conexiones simultáneas con tolerancia a fallos. |
| [Spring Boot](spring-boot.md) | 2014 | [JVM — Java, Kotlin, Scala y Groovy](../ecosistemas/jvm.md) | `application-framework` | Autoconfiguración y servidor incrustado sobre Spring. Convirtió un framework famoso por su configuración XML en uno de arranque inmediato. |
| [Vue](vue.md) | 2014 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `web-framework` | Adopción progresiva: sirve como etiqueta en una página existente o como framework completo. Su reactividad fina influyó en toda la generación siguiente. |
| [htmx](htmx.md) | 2020 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `hypermedia-library` | Devuelve el estado al servidor: el HTML es la respuesta y los atributos deciden qué fragmento se reemplaza. Demuestra que la evolución del campo no es una línea recta hacia el cliente. |
| [Astro](astro.md) | 2021 | [JavaScript y TypeScript](../ecosistemas/javascript.md) | `web-metaframework` | Arquitectura de islas: por omisión no envía JavaScript y cada componente interactivo se declara explícitamente. Permite mezclar React, Vue y Svelte en la misma página, lo que lo hace un banco de pruebas ideal para comparar. |

## Orden de lectura sugerido

Las fichas se pueden leer sueltas, pero en este orden cuentan una historia:

1. **Cómo era antes** — Web Forms y Struts: el servidor lo hacía todo, con sus costes.
2. **La convención** — Rails y sus herederos, Django y Laravel.
3. **El navegador toma el mando** — jQuery, AngularJS, React, Vue.
4. **La corrección** — Astro y htmx: el péndulo vuelve, con teoría detrás.
5. **Los que no encajan en esa línea** — Spring Boot, Express, Phoenix.
