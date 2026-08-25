# Registro de cambios

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el
versionado es [semántico](https://semver.org/lang/es/).

## [0.12.0] — 2026-08-25

El programa deja de empezar por la mitad. Hasta aquí, la primera instrucción
ejecutable del repositorio daba por instalados Node, Python, Java, .NET, PHP,
Ruby y Go; quien no los tuviera recibía siete líneas de `⊘ falta la herramienta`
sin ninguna indicación de qué hacer con ellas.

### Añadido

- **`empezar/`** — el prólogo del programa, para una máquina vacía: qué hay que
  saber antes, cómo se instala cada cadena de herramientas, cómo se ejecuta el
  primer contrato y cómo se lee una clase. Con la **ruta completa de la
  instalación al nivel experto**, nivel a nivel.
- **`empezar/conocimientos-previos.md`** — las seis cosas que el resto del
  programa da por sabidas, explicadas sin dar por supuesto nada: terminal y
  código de salida, cliente/servidor/puerto, petición y respuesta HTTP, JSON,
  gestores de dependencias y archivos de bloqueo, y git.
- **`scripts/doctor.mjs`** — diagnóstico de la máquina: qué cadenas hay, cuántas
  de las 340 implementaciones puedes ejecutar hoy y con qué comando exacto se
  recupera cada una. Distingue tres estados, no dos: instalada, ausente y
  **en el PATH pero no operativa** — un envoltorio roto resuelve, arranca y
  falla, y contarlo como lista sería el verde falso que este repositorio evita.
- **`scripts/lib/cadenas.mjs`** — catálogo de las ocho cadenas con su receta de
  instalación por sistema, su comprobación y su fuente oficial.
- **10 fuentes nuevas** en el registro: las páginas oficiales de instalación de
  las ocho cadenas, el registro de puertos de la IANA y *Pro Git*.

### Cambiado

- La tabla de cadenas de `empezar/README.md` **se genera** desde los
  `ejecutar.json` de todas las implementaciones, y `doctor.mjs --check` entra en
  la cadena de validación y en CI: si una clase estrena un ecosistema y nadie
  regenera, la guía de instalación deja de mentir por omisión.
- `README.md`, `classes/README.md`, `llms.txt` y el sitio abren por `empezar/`.

## [0.8.0] — 2026-08-20

Nace `classes/`: el mismo problema resuelto **en todos los frameworks a la vez**,
con contrato ejecutable. Es la estructura del repositorio políglota trasladada a
los frameworks.

### Añadido

- **149 clases en 12 partes**, de levantar un servidor a migrar sin parar y saber
  salir de un framework. Cada clase declara objetivo, situación, contrato
  verificable y **elenco** —los frameworks para los que ese problema tiene
  sentido—. 53 tecnologías del catálogo aparecen en algún elenco.
- **`classes/_manifest.json`** como fuente única del árbol de clases.
- **`scripts/generate-classes.mjs`** — genera índices y siembra el esqueleto de
  cada clase; `--check` falla si el árbol se desvía del manifiesto. Nunca
  sobrescribe prosa escrita a mano.
- **`scripts/verify-classes.mjs`** — una clase marcada como construida tiene que
  cumplirlo: casos ejecutables, implementaciones presentes con su receta,
  secciones obligatorias y fuentes que resuelven contra la bibliografía.
- **`scripts/run-class.mjs`** — arranca cada implementación, la somete al
  contrato y **declara cuáles omitió** por falta de cadena de herramientas. Un
  verde nunca significa «todo pasó»: significa «esto pasó, esto se omitió».
- **Clase 011 construida** con **diez implementaciones reales** —Express,
  Fastify, FastAPI, Flask, Django, Spring Boot, ASP.NET Core, Laravel, Rails y
  Gin— y cuatro casos verificables.
- **Trabajo de equivalencia en integración continua**: nuevo trabajo `clases` en
  el flujo de aceptación con Node, Python, JVM y .NET instalados.

### Cambiado

- `verify-sources.mjs` verifica también `classes/`: una clase no puede citar una
  fuente que no exista.
- El sitio publica **514 páginas** (antes 203); las clases tienen su grupo en el
  índice.
- Los directorios de dependencias (`vendor/`, `target/`, `bin/`, `obj/`) quedan
  fuera de la validación de enlaces y del control de versiones.

### Corregido

- El lanzador de procesos ya no delega en el intérprete de comandos: `shell:true`
  concatenaba los argumentos sin escaparlos y partía por espacios y comas los
  que llevaban ambos. Ahora resuelve el ejecutable y solo usa el intérprete para
  los envoltorios `.cmd` y `.bat` de Windows.

## [0.9.0] — 2026-08-20

**Parte 1 completa**: quince clases construidas, de levantar un servidor a mirar
qué hay debajo del framework.

### Añadido

- **14 clases nuevas** (012–025): rutas y parámetros, cadena de consulta, verbos
  y su semántica, códigos de estado, cabeceras, cuerpo JSON, negociación de
  contenido, redirecciones, archivos estáticos, subida de archivos, respuesta en
  flujo, compresión, CORS y el recorrido por las capas que hay bajo el framework.
- **103 implementaciones** reales y ejecutables, y **70 casos verificables**.
- **`--cambiadas <ref>`** en el verificador: ejecuta solo las clases que toca un
  cambio. Una clase con diez implementaciones tarda unos cuatro minutos, así que
  ejecutar las 149 en cada empuje costaría horas.
- **`.github/workflows/classes-full.yml`**: el barrido completo, por horario
  semanal y a mano.
- Tres aserciones nuevas en el verificador, todas nacidas de un fallo real:
  `cabeceras_contienen` para cabeceras que son listas de directivas,
  `cabecera_ausente` para comprobar que algo NO está, y `estado_en` para cuando
  el estándar admite varios códigos.
- Soporte de `multipart` en las peticiones del contrato, y preparación en varios
  pasos en `ejecutar.json`.

### Corregido

- **La comparación de JSON era textual.** Un objeto JSON no tiene orden de
  claves [RFC 8259]: Flask serializa ordenando y aparecía como incorrecto.
- **La implementación de Laravel arrastraba estado entre ejecuciones.** El
  servidor de desarrollo de PHP atiende cada petición en un proceso nuevo, así
  que el estado vive en un archivo; ahora se limpia antes de arrancar.
- **Flask devolvía 200 ante un parámetro inválido.** `request.args.get(...,
  type=int)` devuelve el valor por omisión cuando la conversión falla, no `None`.
  El fallo está documentado en la clase 013 porque es exactamente lo que enseña.

## [0.10.0] — 2026-08-20

**Parte 2 completa**: trece clases sobre la tubería, de reconocer el patrón
middleware a distinguir middleware, decorador y aspecto.

### Añadido

- **13 clases nuevas** (026–038): el patrón middleware, el orden de ejecución,
  terminación temprana, registro de peticiones, identificador de correlación,
  manejo centralizado de errores, tiempos de espera, límite de cuerpo,
  limitación de tasa, cabeceras de seguridad, inyección de dependencias, ciclo
  de vida de los objetos y las tres alturas para envolver comportamiento.
- **59 implementaciones nuevas**, hasta 162 en total, y **46 casos verificables
  nuevos**, hasta 116.
- **NestJS entra al elenco** con su propio andamiaje TypeScript en las clases
  036, 037 y 038.
- Tres aserciones nuevas en el verificador: `cabecera_presente`, `json_contiene`
  para respuestas con valores no deterministas, y preparación en varios pasos en
  `ejecutar.json`.

### Corregido

- **El verificador podía probar el servidor de la clase anterior.** En POSIX,
  `go run`, `mvn` y `dotnet run` ejecutan el binario como proceso hijo: matar
  solo al padre lo dejaba vivo con el puerto ocupado. Ahora se mata el grupo de
  procesos entero, se espera a que el puerto se libere, y arrancar sobre un
  puerto ocupado es un error declarado.
- **ASP.NET Core devolvía 400 en lugar de 422** en la clase 013: el enlace
  automático de parámetros rechaza antes de entrar al manejador.
- **La compresión de .NET no tiene umbral de tamaño** y comprimía respuestas de
  cinco letras. El umbral se trae de fuera derivando la tubería.
- **`produces` no fija el tipo de contenido** cuando el cuerpo se escribe en el
  flujo de salida (clase 022).
- **El manejador de 404 de Django recibe el argumento por nombre**: llamarlo
  distinto de `exception` produce un 500 al pedir una ruta inexistente.
- **`app.Run(manejador)` en ASP.NET Core es terminal** y cortaba el enrutado: las
  rutas dejaban de responder. Se sustituye por `MapFallback`.

### Cambiado

- Ante un origen no permitido, **Spring Boot responde 403** y los otros tres
  responden 200 sin la cabecera de autorización. Las dos posturas son
  defendibles, así que el contrato de la clase 024 exige la propiedad de
  seguridad —que la cabecera no esté— y admite ambos códigos.

## [0.11.0] — 2026-08-20

**Parte 3 completa**: doce clases sobre validación y contrato, de rechazar un
título vacío a clasificar un cambio como compatible antes de publicarlo.

### Añadido

- **12 clases nuevas** (039–050): validar la entrada, errores por campo con
  RFC 9457, esquemas, un esquema con tres usos, documentación generada,
  versionado, paginación, filtrado y ordenación, idempotencia, ETags y caché
  condicional, el contrato como prueba, y qué rompe a quién.
- **54 implementaciones nuevas**, hasta 216, y **71 casos verificables nuevos**,
  hasta 187.
- Dos aserciones nuevas del verificador: comparación por **subconjunto** en
  profundidad y comprobación por **subcadena** del cuerpo.

### Corregido

- **El informe de error de preparación era inservible.** Se truncaba a 160
  caracteres, así que un fallo de compilación llegaba como «COMPILATION ERROR :»
  sin archivo ni línea. Ahora filtra las líneas que mencionan un error y conserva
  hasta 900 caracteres.
- **El plazo de Spring resistió tres intentos.** El mecanismo global lanza
  excepciones distintas según la versión y dónde se detecte; con
  `completeOnTimeout` el futuro se completa con el valor dado y no hay excepción
  que traducir.
- **Rechazar campos desconocidos en Spring** es un ajuste del deserializador, no
  una anotación sobre el tipo: `@JsonIgnoreProperties` no basta sobre un `record`.
- Dos errores de compilación que solo aparecieron en integración continua:
  `Map.of` infiriendo `Map<String, Boolean>`, y `AddOpenApi` sin su paquete.

### Cambiado

- Las 49 recetas de Node instalan con `--ignore-scripts`. Empezó como arreglo de
  pnpm y es la opción correcta por su cuenta: un script de instalación es código
  de un tercero corriendo con tus permisos.
- El contrato de la clase 040 exige `campo` y `codigo`, **no el texto legible**.
  Es lo que enseña RFC 9457: el texto es para personas y cambia de idioma; el
  código es el contrato.

## [0.8.2] — 2026-08-20

Rails cierra el elenco de la clase 011: **las diez implementaciones se verifican
en integración continua**.

### Corregido

- **Bundler escribía en el directorio de gemas del sistema.** `bundle install`
  intentaba usar `/var/lib/gems` y fallaba en cualquier máquina donde el usuario
  no fuese administrador, incluido el ejecutor. La implementación de Rails
  declara ahora `BUNDLE_PATH` en su propio `.bundle/config`, así que las gemas
  quedan dentro de la clase.

## [0.8.1] — 2026-08-20

Correcciones de la primera ejecución real de `classes/` en integración continua.
Las tres las descubrió el propio verificador.

### Corregido

- **El trabajo `clases` daba verde con tres implementaciones rotas.** La tubería
  `node ... | tee` devolvía el código de salida de `tee`, no el del verificador.
  Ahora lleva `set -o pipefail`. Es exactamente el defecto que este verificador
  existe para evitar, y estaba en el propio flujo que lo ejecuta.
- **Express y Fastify no arrancaban en integración continua.** `pnpm` subía
  hasta el `pnpm-workspace.yaml` del repositorio, no reconocía el directorio de
  la implementación como paquete y dejaba las dependencias donde no tocaba. Cada
  implementación de Node declara ahora su propia raíz de espacio de trabajo.
- **Laravel respondía 500 en integración continua.** `storage/framework/` y
  `bootstrap/cache/` estaban ignorados por completo, así que no existían en el
  ejecutor y el framework falla al arrancar sin ellos. Se versiona la carpeta
  con un `.gitkeep` y se ignora solo su contenido.

### Cambiado

- El trabajo `clases` instala Bundler: sin él la implementación de Rails se
  omitía en lugar de verificarse. Su tiempo máximo sube a 35 minutos.

## [0.7.0] — 2026-08-20

El Atlas queda completo: **una ficha por cada una de las 138 tecnologías** del
catálogo, ninguna pendiente.

### Añadido

- **50 fichas nuevas**, de 88 a 138. Cierran los cinco frentes que quedaban
  abiertos:
  - **.NET y escritorio**: ASP.NET Core, ASP.NET MVC, Blazor, Entity Framework
    Core, Dapper, WPF, Avalonia, Xamarin, .NET MAUI, Qt y GTK.
  - **Apple**: SwiftUI y UIKit.
  - **Metaframeworks de JavaScript**: Nuxt, Nitro, SvelteKit, Remix,
    React Router, SolidStart, Analog y RedwoodJS.
  - **Servidores y runtimes de Node**: Fastify, Koa, Hono, hapi, Sails,
    AdonisJS, Elysia, Deno, Bun, Socket.IO y tRPC.
  - **Datos, móvil, documentación e histórico**: Prisma, Drizzle, TypeORM;
    Cordova, Capacitor, Ionic, NativeScript; Docusaurus, VitePress;
    Hotwire Turbo, Stimulus; y Prototype.js, MooTools, Dojo, Ext JS, Aurelia,
    Mithril y Marko.
- **2 fuentes nuevas**, hasta 210: *Designing Interfaces* de Tidwell y *Building
  Progressive Web Apps* de Ater, ambas con ISBN-13 contrastado en Open Library.

### Cambiado

- El sitio publica **203 páginas** (antes 103).
- `README.md` y `atlas/README.md` reflejan la cobertura completa: 138 fichas,
  una por tecnología.

### Verificado

- 210/210 fuentes citadas en 180 documentos; ninguna fuente declarada sin uso.
- Cero enlaces relativos rotos entre las 138 fichas, los 13 ecosistemas y los
  13 módulos.

## [0.6.0] — 2026-08-20

Segunda oleada de fichas: de 14 a 38, con 58 fuentes nuevas verificadas.

### Añadido

- **24 fichas**: Angular, Backbone, Knockout, Svelte, Next.js, Preact, Qwik,
  Alpine.js, Ember, Lit, Gatsby, NestJS, Node.js, Vite, Flask, FastAPI, Symfony,
  WordPress, Sinatra, Flutter, React Native, Electron, Tauri y Kubernetes.
- **58 fuentes nuevas**, hasta 205: 29 libros con ISBN-13 contrastado en Open
  Library —*Angular in Action*, *Svelte and Sapper in Action*, *Real-World
  Next.js*, *FastAPI*, *React Native in Action*, *Electron in Action*,
  *Symfony 5: The Fast Track*, *Flutter in Action*, *Kubernetes: Up and
  Running*, *Clean Code*, *Team Topologies*, entre otras— y 29 fuentes
  primarias: *Why Vite*, *Introducing runes*, las señales de Angular, la
  reanudación de Qwik, la arquitectura de Flutter y la de React Native, la guía
  de seguridad de Electron, el modelo de permisos de Tauri, la licencia de
  WordPress, los módulos de Node.js, las propuestas públicas de Ember y las
  decisiones de diseño de Flask.

### Cambiado

- El sitio publica 103 páginas (antes 79).

## [0.5.0] — 2026-08-20

Las fichas del Atlas: catorce estudios a fondo, cada afirmación con su fuente.

### Añadido

- **50 fuentes nuevas** verificadas, hasta 147 en total: 24 libros más con ISBN-13
  contrastado en Open Library —desde *jQuery in Action* y *Learning React* hasta
  *Hypermedia Systems*, *Programming Phoenix* y *Spring in Action*— y 26 fuentes
  primarias: la tesis de Fielding sobre REST, *The Rails Doctrine*, el ensayo de
  Rich Harris sobre el árbol virtual, los ensayos de htmx, la especificación del
  DOM, la de ECMAScript, los boletines de seguridad de Struts, el registro de
  CVE-2017-5638 y el catálogo de vulnerabilidades explotadas de CISA.
- **11 fichas nuevas**: React, AngularJS, Vue, Rails, Django, Spring Boot,
  Struts, ASP.NET Web Forms, Express, htmx y Phoenix. Cada una explica de qué
  problema nació la tecnología, qué idea aportó, qué dejó abierto y qué lección
  deja para decidir hoy.
- `atlas/fichas/README.md` generado, con orden de lectura sugerido: cómo era
  antes, la convención, el navegador toma el mando, la corrección, y los que no
  encajan en esa línea.

### Cambiado

- Las fichas de jQuery, Laravel y Astro pasan a apoyarse en fuentes citadas:
  *jQuery in Action*, la norma del DOM, *Modern PHP*, los estándares PSR, el
  artículo original de Jason Miller sobre arquitectura de islas y otras.
- El sitio publica 79 páginas (antes 67).

## [0.4.0] — 2026-08-20

Segunda capa del programa: el **Atlas**. El núcleo demuestra un contrato en cinco
ecosistemas; el Atlas sitúa 138 tecnologías en su ecosistema y en su era.

### Añadido

- **Catálogo de 138 tecnologías** (antes 34), con esquema ampliado: clasificación,
  familia de ecosistema, lenguaje, era, estado, año de aparición, licencia SPDX,
  gobierno y una nota sobre qué aportó cada una. Entran por fin jQuery, Prototype,
  MooTools, Dojo, Backbone, Knockout, AngularJS, Ember, Laravel, Symfony,
  CodeIgniter, CakePHP, Yii, Zend, Struts, JSF, Web Forms, Astro, htmx, Alpine,
  Turbo, LiveView, Sinatra, Rails y un centenar más.
- **`atlas/`**: portada con las **cinco eras** del campo y el árbol de
  **genealogía** —quién viene de quién—, **13 páginas de ecosistema** que explican
  por qué cada lenguaje produce los frameworks que produce, y fichas a fondo de
  **jQuery**, **Laravel** y **Astro**.
- `scripts/generate-atlas.mjs`: genera el índice y las tablas por ecosistema desde
  el catálogo; `--check` falla si el Atlas se desincroniza. La prosa se escribe a
  mano —es lo que enseña— y las tablas se generan —es lo que se desincroniza.
- `scripts/refresh-catalog.mjs`: comprueba en línea los 138 enlaces de
  documentación oficial y contrasta cada identificador de licencia con la lista
  oficial de SPDX. No bloquea la integración continua.
- El sitio publica el Atlas: 67 páginas frente a 49.

### Cambiado

- `validate-repository.mjs` exige el esquema nuevo del catálogo: sin licencia,
  era, estado, familia ni nota, una entrada no sirve para decidir y no se acepta.
- El Atlas entra en las áreas con trazabilidad: sus citas se validan igual que las
  del currículo.
- Portada del sitio y `README.md` con la capa del Atlas y el reparto por ecosistema.

### Verificado

- Los **138 enlaces** de documentación oficial responden.
- Las **9 licencias** usadas son identificadores SPDX válidos.

## [0.3.0] — 2026-08-19

El repositorio deja de **describir** su tesis y pasa a **demostrarla**: el mismo
contrato, implementado cinco veces, evaluado por el mismo examen ejecutable.

### Corregido

- **El contrato canónico no cumplía lo que el currículo enseñaba.** Los módulos
  03 y 05 exigían errores por campo citando RFC 9457, y `openapi.yaml` declaraba
  un sobre propio `{error:{code,message}}` sin granularidad. El fragmento de
  contrato del módulo 05 mostraba además `Idempotency-Key` como opcional cuando
  el contrato la exigía, y una cabecera `Location` que el contrato no declaraba.
  La prueba de ejemplo del módulo 05 habría fallado contra las implementaciones
  del propio repositorio.
- El generador del sitio y los validadores recorrían `node_modules` de los
  laboratorios, tratando sus archivos como documentos del programa.

### Añadido

- **Contrato TaskFlow 2.0.0**: errores RFC 9457 (`application/problem+json`) con
  los miembros de extensión `code` y `errors[]` por campo; catálogo cerrado de
  12 códigos; `Location` obligatorio en el `201`; `409` al reutilizar una clave
  de idempotencia con otro cuerpo; `413` con límite de 64 KiB; `405` con `Allow`.
- **20 pruebas de aceptación ejecutables** en `contracts/taskflow/acceptance.test.mjs`.
  Solo hablan HTTP: se lanzan sin adaptador contra cualquier implementación, en
  cualquier lenguaje. Toda respuesta de error pasa además por una comprobación
  transversal —sobre correcto, cuatro miembros obligatorios y ninguna filtración
  de trazas, rutas ni consultas.
- `scripts/run-acceptance.mjs`: arranca una implementación, espera a que
  responda, ejecuta el examen y la detiene. Con `--url` apunta a cualquier
  servidor ya en marcha.
- `scripts/verify-contract.mjs`: comprueba que cada código del catálogo se
  ejercita en las pruebas, que las cinco implementaciones pueden emitirlo y que
  **todo extracto del contrato citado en una lección coincide literalmente** con
  el contrato. Nace del fallo corregido arriba.
- Flujo `acceptance.yml`: los cinco ecosistemas —Node.js sin framework, Express,
  FastAPI, Spring Boot y ASP.NET Core— contra el mismo examen, con toolchains
  reales y acciones fijadas por SHA.

### Cambiado

- **Las cinco implementaciones** reescritas para cumplir el contrato 2.0.0, cada
  una con su traductor único de errores y su decisión de orden documentada.
- Las pruebas unitarias de la referencia ahora cubren la validación como función
  pura, el límite inclusivo, el conflicto de idempotencia y la ausencia de
  filtraciones.
- Módulos 01 y 05: secciones de implementación y pruebas reescritas con
  extractos verificados contra el código real y contra el contrato.
- Los seis `README.md` de laboratorios pasan de 9–33 líneas a documentos con el
  hallazgo concreto de cada ecosistema y sus desviaciones declaradas.
- `ACCEPTANCE.md` describe los 20 casos y publica la tabla de desviaciones.

## [0.2.0] — 2026-08-19

Revisión pedagógica y visual completa. El repositorio pasa de ser un esqueleto de
temario a un programa con trazabilidad comprobable y sitio publicado.

### Añadido

- **Registro bibliográfico verificable** en `sources/bibliography.json`: 97
  fuentes con localizador resoluble — 41 libros con ISBN-13 validado contra Open
  Library, 7 artículos con DOI contrastado en Crossref, 28 normas y 21
  referencias oficiales.
- `scripts/verify-sources.mjs`: validación **sin red** del contrato de lección y
  de la trazabilidad. Falla ante una cita a fuente inexistente, una fuente
  declarada y no citada, un libro sin ISBN válido, un artículo sin DOI, una
  lección con menos de cuatro citas, una sección obligatoria ausente o una
  entrada del registro que nadie cita.
- `scripts/refresh-sources.mjs`: revisión **con red** contra los catálogos
  públicos, con reintento ante límite de ritmo. Informa de la deriva; no
  bloquea la integración continua.
- `scripts/generate-bibliography.mjs`: genera `docs/BIBLIOGRAPHY.md` con el mapa
  de qué documento cita qué fuente; `--check` detecta el índice desactualizado.
- `scripts/generate-site.mjs` y `scripts/lib/`: generador de sitio estático sin
  dependencias — portada con métricas, filtro por nivel y ruta, progreso local;
  lector con barra lateral, índice de la página, tema claro y oscuro, diagramas
  y búsqueda; página de fuentes con cada cita enlazada a su localizador;
  manifiesto, trabajador de servicio, mapa del sitio y página 404.
- `sources/README.md`: política de fuentes y procedimiento para añadir una.
- Comprobación de recuerdo y repaso espaciado en los trece módulos.
- Rúbricas de cuatro niveles con descriptores observables, rúbrica transversal de
  honestidad técnica y guion de retroalimentación en `assessments/rubric.md`.
- Flujos `ci.yml` y `pages.yml` con acciones fijadas por SHA, permisos por job,
  concurrencia, tiempos límite, matriz de runtime y verificación de que el sitio
  publicado no sale vacío.

### Cambiado

- **Los trece módulos reescritos** al contrato de doce secciones: de ~25 líneas
  cada uno a lecciones completas con concepto independiente del framework,
  anatomía comparada por dimensiones, implementación comentada, pruebas
  compartidas, seguridad y accesibilidad, tabla de diagnóstico y reto de
  transferencia. Cada módulo declara nivel, horas, prerrequisitos y fuentes.
- `docs/LEARNING-MODEL.md`: cada decisión pedagógica —alineamiento constructivo,
  diseño inverso, ejemplo resuelto con desvanecimiento, recuperación activa,
  práctica distribuida, práctica deliberada— justificada con su fuente.
- `assessments/diagnostic.md`: mapeo pregunta → módulo, práctica escrita y
  repetición programada del diagnóstico.
- `docs/SOURCES.md`: pasa a ser la lista de documentación oficial de las
  tecnologías, separada del registro bibliográfico.
- `PROMPT_MAESTRO.md`: la regla de fuentes y el contrato de lección ampliado
  entran como principios no negociables.
- `templates/LESSON_TEMPLATE.md`: alineada con el contrato que valida el script.
- `scripts/validate-repository.mjs`: comprueba además la numeración continua de
  módulos, la clasificación del catálogo y que el sitio generado no se versione.
- `README.md` reescrito con la regla del repositorio, métricas de trazabilidad y
  la tabla del programa.

### Eliminado

- `.github/workflows/validate.yml`, sustituido por `ci.yml`.

## [0.1.0] — 2026-08-19

- Estructura inicial: catálogo, contrato TaskFlow, currículo, laboratorios,
  proyectos, plantillas y validación básica.
