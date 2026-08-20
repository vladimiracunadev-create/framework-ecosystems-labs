# Registro de cambios

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el
versionado es [semántico](https://semver.org/lang/es/).

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
