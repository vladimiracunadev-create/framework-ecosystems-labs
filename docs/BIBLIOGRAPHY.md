# Bibliografía

Documento generado por `node scripts/generate-bibliography.mjs`. No editar a mano.

Registro: [`sources/bibliography.json`](../sources/bibliography.json) · **97** fuentes · verificadas el **2026-08-19** · política en [`sources/README.md`](../sources/README.md).

Cada entrada declara un localizador resoluble y es citada al menos una vez en el programa;
`node scripts/verify-sources.mjs` falla si deja de cumplirse cualquiera de las dos condiciones.

## Resumen

| Tipo | Entradas | Verificación |
| --- | ---: | --- |
| Libros | 41 | `https://openlibrary.org/isbn/{isbn13}.json` |
| Artículos | 7 | `https://api.crossref.org/works/{doi}` |
| Normas y especificaciones | 28 | `GET a la URL declarada` |
| Documentación oficial y referencias | 21 | `GET a la URL declarada` |

## Libros

Obras de referencia. El localizador apunta al registro del ISBN-13 concreto de la edición citada.

### `adkins-building-secure-reliable`

Adkins, Heather; Beyer, Betsy; Blankinship, Paul; Lewandowski, Piotr; Oprea, Ana; Stubblefield, Adam, *Building Secure and Reliable Systems: Best Practices for Designing, Implementing, and Maintaining Systems*, O'Reilly Media, 2020, ISBN 9781492083122

- Localizador: <https://openlibrary.org/isbn/9781492083122>
- Temas: seguridad, fiabilidad, operación
- Citada en: [`curriculum/07-identidad-y-seguridad.md`](../curriculum/07-identidad-y-seguridad.md)

### `ambler-sadalage-refactoring-databases`

Ambler, Scott W.; Sadalage, Pramod J., *Refactoring Databases: Evolutionary Database Design*, Addison-Wesley, 2006, ISBN 9780321293534

- Localizador: <https://openlibrary.org/isbn/9780321293534>
- Temas: migraciones, esquema, evolución
- Citada en: [`curriculum/06-persistencia-y-dominio.md`](../curriculum/06-persistencia-y-dominio.md), [`curriculum/10-modernizacion-y-migracion.md`](../curriculum/10-modernizacion-y-migracion.md)

### `anderson-krathwohl-taxonomy`

Anderson, Lorin W.; Krathwohl, David R., *A Taxonomy for Learning, Teaching, and Assessing: A Revision of Bloom's Taxonomy of Educational Objectives*, Longman, 2001, ISBN 9780321084057

- Localizador: <https://openlibrary.org/isbn/9780321084057>
- Temas: pedagogía, objetivos, evaluación
- Citada en: [`assessments/rubric.md`](../assessments/rubric.md), [`curriculum/00-taxonomia-y-diagnostico.md`](../curriculum/00-taxonomia-y-diagnostico.md), [`docs/LEARNING-MODEL.md`](../docs/LEARNING-MODEL.md)

### `bass-software-architecture-practice`

Bass, Len; Clements, Paul; Kazman, Rick, *Software Architecture in Practice*, 4.ª ed., Pearson Education, 2021, ISBN 9780136886099

- Localizador: <https://openlibrary.org/isbn/9780136886099>
- Temas: arquitectura, atributos de calidad, tácticas
- Citada en: [`curriculum/11-seleccion-y-sostenibilidad.md`](../curriculum/11-seleccion-y-sostenibilidad.md), [`curriculum/12-producto-final.md`](../curriculum/12-producto-final.md)

### `beck-tdd`

Beck, Kent, *Test-Driven Development: By Example*, Addison-Wesley, 2002, ISBN 9780321146533

- Localizador: <https://openlibrary.org/isbn/9780321146533>
- Temas: pruebas, diseño, ritmo
- Citada en: [`curriculum/08-calidad-rendimiento-y-operacion.md`](../curriculum/08-calidad-rendimiento-y-operacion.md)

### `beyer-sre`

Beyer, Betsy; Jones, Chris; Petoff, Jennifer; Murphy, Niall Richard, *Site Reliability Engineering: How Google Runs Production Systems*, O'Reilly Media, 2016, ISBN 9781491929124

- Localizador: <https://openlibrary.org/isbn/9781491929124>
- Temas: operación, SLO, fiabilidad
- Citada en: [`curriculum/08-calidad-rendimiento-y-operacion.md`](../curriculum/08-calidad-rendimiento-y-operacion.md)

### `brown-make-it-stick`

Brown, Peter C.; Roediger, Henry L.; McDaniel, Mark A., *Make It Stick: The Science of Successful Learning*, Belknap Press of Harvard University Press, 2014, ISBN 9780674729018

- Localizador: <https://openlibrary.org/isbn/9780674729018>
- Temas: pedagogía, recuperación, intercalado
- Citada en: [`assessments/diagnostic.md`](../assessments/diagnostic.md), [`docs/LEARNING-MODEL.md`](../docs/LEARNING-MODEL.md)

### `cohn-succeeding-agile`

Cohn, Mike, *Succeeding with Agile: Software Development Using Scrum*, Addison-Wesley, 2009, ISBN 9780321579362

- Localizador: <https://openlibrary.org/isbn/9780321579362>
- Temas: pirámide de pruebas, proceso, equipos
- Citada en: [`curriculum/08-calidad-rendimiento-y-operacion.md`](../curriculum/08-calidad-rendimiento-y-operacion.md)

### `ericsson-peak`

Ericsson, Anders; Pool, Robert, *Peak: Secrets from the New Science of Expertise*, Houghton Mifflin Harcourt, 2016, ISBN 9780544456235

- Localizador: <https://openlibrary.org/isbn/9780544456235>
- Temas: pedagogía, práctica deliberada, retroalimentación
- Citada en: [`docs/LEARNING-MODEL.md`](../docs/LEARNING-MODEL.md)

### `evans-ddd`

Evans, Eric, *Domain-Driven Design: Tackling Complexity in the Heart of Software*, Addison-Wesley, 2003, ISBN 9780321125217

- Localizador: <https://openlibrary.org/isbn/9780321125217>
- Temas: dominio, modelado, lenguaje ubicuo
- Citada en: [`curriculum/06-persistencia-y-dominio.md`](../curriculum/06-persistencia-y-dominio.md)

### `feathers-legacy-code`

Feathers, Michael C., *Working Effectively with Legacy Code*, Prentice Hall, 2004, ISBN 9780131177055

- Localizador: <https://openlibrary.org/isbn/9780131177055>
- Temas: legado, costuras, refactorización
- Citada en: [`curriculum/10-modernizacion-y-migracion.md`](../curriculum/10-modernizacion-y-migracion.md)

### `ford-evolutionary-architectures`

Ford, Neal; Parsons, Rebecca; Kua, Patrick; Sadalage, Pramod, *Building Evolutionary Architectures: Automated Software Governance*, 2.ª ed., O'Reilly Media, 2023, ISBN 9781492097549

- Localizador: <https://openlibrary.org/isbn/9781492097549>
- Temas: evolución, funciones de aptitud, gobierno
- Citada en: [`curriculum/11-seleccion-y-sostenibilidad.md`](../curriculum/11-seleccion-y-sostenibilidad.md)

### `forsgren-accelerate`

Forsgren, Nicole; Humble, Jez; Kim, Gene, *Accelerate: The Science of Lean Software and DevOps*, IT Revolution Press, 2018, ISBN 9781942788355

- Localizador: <https://openlibrary.org/isbn/9781942788355>
- Temas: métricas, rendimiento de entrega, evidencia
- Citada en: [`curriculum/08-calidad-rendimiento-y-operacion.md`](../curriculum/08-calidad-rendimiento-y-operacion.md), [`curriculum/11-seleccion-y-sostenibilidad.md`](../curriculum/11-seleccion-y-sostenibilidad.md)

### `fowler-poeaa`

Fowler, Martin, *Patterns of Enterprise Application Architecture*, Addison-Wesley, 2002, ISBN 9780321127426

- Localizador: <https://openlibrary.org/isbn/9780321127426>
- Temas: arquitectura, persistencia, dominio
- Citada en: [`atlas/README.md`](../atlas/README.md), [`curriculum/00-taxonomia-y-diagnostico.md`](../curriculum/00-taxonomia-y-diagnostico.md), [`curriculum/06-persistencia-y-dominio.md`](../curriculum/06-persistencia-y-dominio.md)

### `fowler-refactoring`

Fowler, Martin, *Refactoring: Improving the Design of Existing Code*, 2.ª ed., Addison-Wesley, 2018, ISBN 9780134757599

- Localizador: <https://openlibrary.org/isbn/9780134757599>
- Temas: refactorización, diseño, evolución
- Citada en: [`curriculum/10-modernizacion-y-migracion.md`](../curriculum/10-modernizacion-y-migracion.md)

### `gof-design-patterns`

Gamma, Erich; Helm, Richard; Johnson, Ralph; Vlissides, John, *Design Patterns: Elements of Reusable Object-Oriented Software*, Addison-Wesley Professional, 1994, ISBN 9780201633610

- Localizador: <https://openlibrary.org/isbn/9780201633610>
- Temas: patrones, composición, extensibilidad
- Citada en: [`curriculum/02-arquitectura-de-frameworks.md`](../curriculum/02-arquitectura-de-frameworks.md)

### `geewax-api-design-patterns`

Geewax, JJ, *API Design Patterns*, Manning Publications, 2021, ISBN 9781617295850

- Localizador: <https://openlibrary.org/isbn/9781617295850>
- Temas: api, contratos, compatibilidad
- Citada en: [`curriculum/05-backend-y-api.md`](../curriculum/05-backend-y-api.md)

### `gregg-systems-performance`

Gregg, Brendan, *Systems Performance*, 2.ª ed., Pearson, 2020, ISBN 9780136820154

- Localizador: <https://openlibrary.org/isbn/9780136820154>
- Temas: rendimiento, medición, metodología
- Citada en: [`curriculum/08-calidad-rendimiento-y-operacion.md`](../curriculum/08-calidad-rendimiento-y-operacion.md)

### `grigorik-hpbn`

Grigorik, Ilya, *High Performance Browser Networking*, O'Reilly Media, 2013, ISBN 9781449344764

- Localizador: <https://openlibrary.org/isbn/9781449344764>
- Temas: http, red, rendimiento
- Citada en: [`curriculum/01-http-eventos-y-contratos.md`](../curriculum/01-http-eventos-y-contratos.md), [`curriculum/04-fullstack-y-renderizado.md`](../curriculum/04-fullstack-y-renderizado.md)

### `hoffman-web-application-security`

Hoffman, Andrew, *Web Application Security: Exploitation and Countermeasures for Modern Web Applications*, O'Reilly Media, 2020, ISBN 9781492053118

- Localizador: <https://openlibrary.org/isbn/9781492053118>
- Temas: seguridad, web, contramedidas
- Citada en: [`curriculum/07-identidad-y-seguridad.md`](../curriculum/07-identidad-y-seguridad.md)

### `hohpe-woolf-eip`

Hohpe, Gregor; Woolf, Bobby, *Enterprise Integration Patterns: Designing, Building, and Deploying Messaging Solutions*, Addison-Wesley, 2003, ISBN 9780321200686

- Localizador: <https://openlibrary.org/isbn/9780321200686>
- Temas: integración, mensajería, eventos
- Citada en: [`curriculum/02-arquitectura-de-frameworks.md`](../curriculum/02-arquitectura-de-frameworks.md), [`curriculum/10-modernizacion-y-migracion.md`](../curriculum/10-modernizacion-y-migracion.md)

### `humble-farley-continuous-delivery`

Humble, Jez; Farley, David, *Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation*, Addison-Wesley Professional, 2010, ISBN 9780321601919

- Localizador: <https://openlibrary.org/isbn/9780321601919>
- Temas: entrega, canalización, despliegue
- Citada en: [`curriculum/08-calidad-rendimiento-y-operacion.md`](../curriculum/08-calidad-rendimiento-y-operacion.md), [`curriculum/12-producto-final.md`](../curriculum/12-producto-final.md)

### `hunt-thomas-pragmatic`

Hunt, Andrew; Thomas, David, *The Pragmatic Programmer: Your Journey to Mastery*, 20.º aniversario ed., Addison-Wesley, 2019, ISBN 9780135957059

- Localizador: <https://openlibrary.org/isbn/9780135957059>
- Temas: oficio, diseño, criterio
- Citada en: [`curriculum/00-taxonomia-y-diagnostico.md`](../curriculum/00-taxonomia-y-diagnostico.md)

### `kalbag-accessibility-for-everyone`

Kalbag, Laura, *Accessibility for Everyone*, A Book Apart, 2017, ISBN 9781937557614

- Localizador: <https://openlibrary.org/isbn/9781937557614>
- Temas: accesibilidad, inclusión, frontend
- Citada en: [`curriculum/03-frontend-componentes-y-estado.md`](../curriculum/03-frontend-componentes-y-estado.md)

### `khononov-learning-ddd`

Khononov, Vlad, *Learning Domain-Driven Design: Aligning Software Architecture and Business Strategy*, O'Reilly Media, 2021, ISBN 9781098100131

- Localizador: <https://openlibrary.org/isbn/9781098100131>
- Temas: dominio, contextos, arquitectura
- Citada en: [`curriculum/06-persistencia-y-dominio.md`](../curriculum/06-persistencia-y-dominio.md)

### `kleppmann-ddia`

Kleppmann, Martin, *Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems*, O'Reilly Media, 2017, ISBN 9781449373320

- Localizador: <https://openlibrary.org/isbn/9781449373320>
- Temas: persistencia, consistencia, datos
- Citada en: [`curriculum/06-persistencia-y-dominio.md`](../curriculum/06-persistencia-y-dominio.md), [`curriculum/09-movil-escritorio-y-offline.md`](../curriculum/09-movil-escritorio-y-offline.md)

### `majors-observability`

Majors, Charity; Fong-Jones, Liz; Miranda, George, *Observability Engineering: Achieving Production Excellence*, O'Reilly Media, 2022, ISBN 9781492076445

- Localizador: <https://openlibrary.org/isbn/9781492076445>
- Temas: observabilidad, telemetría, diagnóstico
- Citada en: [`curriculum/08-calidad-rendimiento-y-operacion.md`](../curriculum/08-calidad-rendimiento-y-operacion.md)

### `martin-clean-architecture`

Martin, Robert C., *Clean Architecture: A Craftsman's Guide to Software Structure and Design*, Pearson, 2017, ISBN 9780134494166

- Localizador: <https://openlibrary.org/isbn/9780134494166>
- Temas: arquitectura, límites, dependencias
- Citada en: [`curriculum/00-taxonomia-y-diagnostico.md`](../curriculum/00-taxonomia-y-diagnostico.md), [`curriculum/02-arquitectura-de-frameworks.md`](../curriculum/02-arquitectura-de-frameworks.md)

### `meszaros-xunit`

Meszaros, Gerard, *xUnit Test Patterns: Refactoring Test Code*, Addison-Wesley Professional, 2007, ISBN 9780131495050

- Localizador: <https://openlibrary.org/isbn/9780131495050>
- Temas: pruebas, dobles, mantenimiento
- Citada en: [`curriculum/08-calidad-rendimiento-y-operacion.md`](../curriculum/08-calidad-rendimiento-y-operacion.md)

### `newman-building-microservices`

Newman, Sam, *Building Microservices: Designing Fine-Grained Systems*, 2.ª ed., O'Reilly Media, 2020, ISBN 9781492034025

- Localizador: <https://openlibrary.org/isbn/9781492034025>
- Temas: backend, distribución, límites de servicio
- Citada en: [`curriculum/05-backend-y-api.md`](../curriculum/05-backend-y-api.md)

### `norman-design-everyday-things`

Norman, Donald A., *The Design of Everyday Things*, revisada y ampliada ed., Basic Books, 2013, ISBN 9780465050659

- Localizador: <https://openlibrary.org/isbn/9780465050659>
- Temas: diseño, affordances, errores humanos
- Citada en: [`curriculum/03-frontend-componentes-y-estado.md`](../curriculum/03-frontend-componentes-y-estado.md)

### `nygard-release-it`

Nygard, Michael T., *Release It!: Design and Deploy Production-Ready Software*, 2.ª ed., Pragmatic Bookshelf, 2018, ISBN 9781680502398

- Localizador: <https://openlibrary.org/isbn/9781680502398>
- Temas: estabilidad, operación, fallos
- Citada en: [`curriculum/08-calidad-rendimiento-y-operacion.md`](../curriculum/08-calidad-rendimiento-y-operacion.md), [`curriculum/10-modernizacion-y-migracion.md`](../curriculum/10-modernizacion-y-migracion.md), [`curriculum/12-producto-final.md`](../curriculum/12-producto-final.md)

### `osmani-js-design-patterns`

Osmani, Addy, *Learning JavaScript Design Patterns: A JavaScript and React Developer's Guide*, 2.ª ed., O'Reilly Media, 2023, ISBN 9781098139872

- Localizador: <https://openlibrary.org/isbn/9781098139872>
- Temas: frontend, patrones, javascript
- Citada en: [`curriculum/03-frontend-componentes-y-estado.md`](../curriculum/03-frontend-componentes-y-estado.md)

### `pickering-inclusive-components`

Pickering, Heydon, *Inclusive Components*, Smashing Magazine, 2019, ISBN 9783945749821

- Localizador: <https://openlibrary.org/isbn/9783945749821>
- Temas: accesibilidad, componentes, frontend
- Citada en: [`curriculum/03-frontend-componentes-y-estado.md`](../curriculum/03-frontend-componentes-y-estado.md)

### `richards-ford-fundamentals`

Richards, Mark; Ford, Neal, *Fundamentals of Software Architecture: An Engineering Approach*, O'Reilly Media, 2020, ISBN 9781492043454

- Localizador: <https://openlibrary.org/isbn/9781492043454>
- Temas: arquitectura, compromisos, estilos
- Citada en: [`curriculum/00-taxonomia-y-diagnostico.md`](../curriculum/00-taxonomia-y-diagnostico.md), [`curriculum/04-fullstack-y-renderizado.md`](../curriculum/04-fullstack-y-renderizado.md), [`curriculum/11-seleccion-y-sostenibilidad.md`](../curriculum/11-seleccion-y-sostenibilidad.md), [`curriculum/12-producto-final.md`](../curriculum/12-producto-final.md)

### `richardson-amundsen-restful`

Richardson, Leonard; Amundsen, Mike; Ruby, Sam, *RESTful Web APIs: Services for a Changing World*, O'Reilly Media, 2013, ISBN 9781449358068

- Localizador: <https://openlibrary.org/isbn/9781449358068>
- Temas: http, api, hipermedia
- Citada en: [`curriculum/01-http-eventos-y-contratos.md`](../curriculum/01-http-eventos-y-contratos.md), [`curriculum/05-backend-y-api.md`](../curriculum/05-backend-y-api.md)

### `seemann-deursen-di`

Seemann, Mark; van Deursen, Steven, *Dependency Injection Principles, Practices, and Patterns*, Manning Publications, 2019, ISBN 9781617294730

- Localizador: <https://openlibrary.org/isbn/9781617294730>
- Temas: inversión de control, inyección, ciclo de vida
- Citada en: [`curriculum/02-arquitectura-de-frameworks.md`](../curriculum/02-arquitectura-de-frameworks.md)

### `shostack-threat-modeling`

Shostack, Adam, *Threat Modeling: Designing for Security*, Wiley, 2014, ISBN 9781118809990

- Localizador: <https://openlibrary.org/isbn/9781118809990>
- Temas: seguridad, amenazas, diseño
- Citada en: [`curriculum/07-identidad-y-seguridad.md`](../curriculum/07-identidad-y-seguridad.md)

### `sweller-cognitive-load-theory`

Sweller, John; Ayres, Paul; Kalyuga, Slava, *Cognitive Load Theory*, Springer, 2011, ISBN 9781441981257

- Localizador: <https://openlibrary.org/isbn/9781441981257>
- Temas: pedagogía, carga cognitiva, ejemplos resueltos
- Citada en: [`docs/LEARNING-MODEL.md`](../docs/LEARNING-MODEL.md)

### `vernon-iddd`

Vernon, Vaughn, *Implementing Domain-Driven Design*, Addison-Wesley Professional, 2012, ISBN 9780321834577

- Localizador: <https://openlibrary.org/isbn/9780321834577>
- Temas: dominio, contextos, integración
- Citada en: [`curriculum/06-persistencia-y-dominio.md`](../curriculum/06-persistencia-y-dominio.md)

### `wiggins-mctighe-ubd`

Wiggins, Grant; McTighe, Jay, *Understanding by Design*, 2.ª ampliada ed., Association for Supervision and Curriculum Development, 2005, ISBN 9781416600350

- Localizador: <https://openlibrary.org/isbn/9781416600350>
- Temas: pedagogía, diseño inverso, evidencia de aprendizaje
- Citada en: [`curriculum/12-producto-final.md`](../curriculum/12-producto-final.md), [`docs/LEARNING-MODEL.md`](../docs/LEARNING-MODEL.md)

## Artículos

Investigación con revisión por pares. El localizador es el DOI, resoluble y con metadatos en Crossref.

### `biggs-constructive-alignment`

Biggs, John, *Enhancing teaching through constructive alignment*, Higher Education, 1996, vol. 32, pp. 347-364, DOI 10.1007/BF00138871

- Localizador: <https://doi.org/10.1007/BF00138871>
- Temas: pedagogía, alineamiento, evaluación
- Citada en: [`docs/LEARNING-MODEL.md`](../docs/LEARNING-MODEL.md)

### `dunlosky-effective-techniques`

Dunlosky, John; Rawson, Katherine A.; Marsh, Elizabeth J.; Nathan, Mitchell J.; Willingham, Daniel T., *Improving Students' Learning With Effective Learning Techniques*, Psychological Science in the Public Interest, 2013, vol. 14, pp. 4-58, DOI 10.1177/1529100612453266

- Localizador: <https://doi.org/10.1177/1529100612453266>
- Temas: pedagogía, práctica distribuida, autoexplicación
- Citada en: [`assessments/diagnostic.md`](../assessments/diagnostic.md), [`docs/LEARNING-MODEL.md`](../docs/LEARNING-MODEL.md)

### `evans-assessment-feedback`

Evans, Carol, *Making Sense of Assessment Feedback in Higher Education*, Review of Educational Research, 2013, vol. 83, pp. 70-120, DOI 10.3102/0034654312474350

- Localizador: <https://doi.org/10.3102/0034654312474350>
- Temas: pedagogía, retroalimentación, evaluación
- Citada en: [`assessments/rubric.md`](../assessments/rubric.md), [`docs/LEARNING-MODEL.md`](../docs/LEARNING-MODEL.md)

### `merrill-first-principles`

Merrill, M. David, *First principles of instruction*, Educational Technology Research and Development, 2002, vol. 50, pp. 43-59, DOI 10.1007/BF02505024

- Localizador: <https://doi.org/10.1007/BF02505024>
- Temas: pedagogía, secuencia, transferencia
- Citada en: [`docs/LEARNING-MODEL.md`](../docs/LEARNING-MODEL.md)

### `roediger-karpicke-test-enhanced`

Roediger, Henry L.; Karpicke, Jeffrey D., *Test-Enhanced Learning*, Psychological Science, 2006, vol. 17, pp. 249-255, DOI 10.1111/j.1467-9280.2006.01693.x

- Localizador: <https://doi.org/10.1111/j.1467-9280.2006.01693.x>
- Temas: pedagogía, recuperación, retención
- Citada en: [`assessments/diagnostic.md`](../assessments/diagnostic.md), [`assessments/rubric.md`](../assessments/rubric.md), [`docs/LEARNING-MODEL.md`](../docs/LEARNING-MODEL.md)

### `sweller-1988-cognitive-load`

Sweller, John, *Cognitive Load During Problem Solving: Effects on Learning*, Cognitive Science, 1988, vol. 12, pp. 257-285, DOI 10.1207/s15516709cog1202_4

- Localizador: <https://doi.org/10.1207/s15516709cog1202_4>
- Temas: pedagogía, carga cognitiva
- Citada en: [`docs/LEARNING-MODEL.md`](../docs/LEARNING-MODEL.md)

### `vanlehn-tutoring`

VanLehn, Kurt, *The Relative Effectiveness of Human Tutoring, Intelligent Tutoring Systems, and Other Tutoring Systems*, Educational Psychologist, 2011, vol. 46, pp. 197-221, DOI 10.1080/00461520.2011.611369

- Localizador: <https://doi.org/10.1080/00461520.2011.611369>
- Temas: pedagogía, tutoría, andamiaje
- Citada en: [`docs/LEARNING-MODEL.md`](../docs/LEARNING-MODEL.md)

## Normas y especificaciones

Documentos normativos de organismos públicos o consorcios abiertos.

### `rfc9110`

*RFC 9110 — HTTP Semantics*, IETF, 2022

- Localizador: <https://www.rfc-editor.org/rfc/rfc9110>
- Temas: http, métodos, códigos
- Citada en: [`curriculum/01-http-eventos-y-contratos.md`](../curriculum/01-http-eventos-y-contratos.md)

### `rfc9111`

*RFC 9111 — HTTP Caching*, IETF, 2022

- Localizador: <https://www.rfc-editor.org/rfc/rfc9111>
- Temas: http, caché, rendimiento
- Citada en: [`curriculum/01-http-eventos-y-contratos.md`](../curriculum/01-http-eventos-y-contratos.md), [`curriculum/04-fullstack-y-renderizado.md`](../curriculum/04-fullstack-y-renderizado.md)

### `rfc9112`

*RFC 9112 — HTTP/1.1*, IETF, 2022

- Localizador: <https://www.rfc-editor.org/rfc/rfc9112>
- Temas: http, transporte
- Citada en: [`curriculum/01-http-eventos-y-contratos.md`](../curriculum/01-http-eventos-y-contratos.md)

### `rfc9113`

*RFC 9113 — HTTP/2*, IETF, 2022

- Localizador: <https://www.rfc-editor.org/rfc/rfc9113>
- Temas: http, multiplexación
- Citada en: [`curriculum/01-http-eventos-y-contratos.md`](../curriculum/01-http-eventos-y-contratos.md)

### `rfc9114`

*RFC 9114 — HTTP/3*, IETF, 2022

- Localizador: <https://www.rfc-editor.org/rfc/rfc9114>
- Temas: http, quic
- Citada en: [`curriculum/01-http-eventos-y-contratos.md`](../curriculum/01-http-eventos-y-contratos.md)

### `rfc9457`

*RFC 9457 — Problem Details for HTTP APIs*, IETF, 2023

- Localizador: <https://www.rfc-editor.org/rfc/rfc9457>
- Temas: api, errores, contrato
- Citada en: [`curriculum/01-http-eventos-y-contratos.md`](../curriculum/01-http-eventos-y-contratos.md), [`curriculum/05-backend-y-api.md`](../curriculum/05-backend-y-api.md)

### `rfc6749`

*RFC 6749 — The OAuth 2.0 Authorization Framework*, IETF, 2012

- Localizador: <https://www.rfc-editor.org/rfc/rfc6749>
- Temas: identidad, autorización
- Citada en: [`curriculum/07-identidad-y-seguridad.md`](../curriculum/07-identidad-y-seguridad.md)

### `rfc9700`

*RFC 9700 — Best Current Practice for OAuth 2.0 Security*, IETF, 2025

- Localizador: <https://www.rfc-editor.org/rfc/rfc9700>
- Temas: identidad, seguridad, oauth
- Citada en: [`curriculum/07-identidad-y-seguridad.md`](../curriculum/07-identidad-y-seguridad.md)

### `rfc7519`

*RFC 7519 — JSON Web Token (JWT)*, IETF, 2015

- Localizador: <https://www.rfc-editor.org/rfc/rfc7519>
- Temas: identidad, tokens
- Citada en: [`curriculum/07-identidad-y-seguridad.md`](../curriculum/07-identidad-y-seguridad.md)

### `rfc8259`

*RFC 8259 — The JavaScript Object Notation (JSON) Data Interchange Format*, IETF, 2017

- Localizador: <https://www.rfc-editor.org/rfc/rfc8259>
- Temas: formato, serialización
- Citada en: [`curriculum/01-http-eventos-y-contratos.md`](../curriculum/01-http-eventos-y-contratos.md), [`curriculum/05-backend-y-api.md`](../curriculum/05-backend-y-api.md)

### `rfc6902`

*RFC 6902 — JavaScript Object Notation (JSON) Patch*, IETF, 2013

- Localizador: <https://www.rfc-editor.org/rfc/rfc6902>
- Temas: api, actualización parcial
- Citada en: [`curriculum/01-http-eventos-y-contratos.md`](../curriculum/01-http-eventos-y-contratos.md)

### `rfc5789`

*RFC 5789 — PATCH Method for HTTP*, IETF, 2010

- Localizador: <https://www.rfc-editor.org/rfc/rfc5789>
- Temas: http, métodos
- Citada en: [`curriculum/01-http-eventos-y-contratos.md`](../curriculum/01-http-eventos-y-contratos.md)

### `rfc6265`

*RFC 6265 — HTTP State Management Mechanism*, IETF, 2011

- Localizador: <https://www.rfc-editor.org/rfc/rfc6265>
- Temas: http, sesiones, cookies
- Citada en: [`curriculum/07-identidad-y-seguridad.md`](../curriculum/07-identidad-y-seguridad.md)

### `rfc8446`

*RFC 8446 — The Transport Layer Security (TLS) Protocol Version 1.3*, IETF, 2018

- Localizador: <https://www.rfc-editor.org/rfc/rfc8446>
- Temas: seguridad, transporte
- Citada en: [`curriculum/07-identidad-y-seguridad.md`](../curriculum/07-identidad-y-seguridad.md)

### `json-schema`

*JSON Schema Specification*, JSON Schema

- Localizador: <https://json-schema.org/specification>
- Temas: validación, contrato
- Citada en: [`curriculum/05-backend-y-api.md`](../curriculum/05-backend-y-api.md)

### `nist-800-63b`

*SP 800-63B — Digital Identity Guidelines: Authentication and Lifecycle Management*, NIST

- Localizador: <https://pages.nist.gov/800-63-3/sp800-63b.html>
- Temas: identidad, contraseñas, autenticación
- Citada en: [`curriculum/07-identidad-y-seguridad.md`](../curriculum/07-identidad-y-seguridad.md)

### `nist-ssdf`

*SP 800-218 — Secure Software Development Framework (SSDF)*, NIST, 2022

- Localizador: <https://csrc.nist.gov/pubs/sp/800/218/final>
- Temas: cadena de suministro, proceso seguro
- Citada en: [`curriculum/11-seleccion-y-sostenibilidad.md`](../curriculum/11-seleccion-y-sostenibilidad.md)

### `openapi-spec`

*OpenAPI Specification*, OpenAPI Initiative

- Localizador: <https://spec.openapis.org/oas/latest.html>
- Temas: contrato, api, documentación
- Citada en: [`curriculum/01-http-eventos-y-contratos.md`](../curriculum/01-http-eventos-y-contratos.md), [`curriculum/05-backend-y-api.md`](../curriculum/05-backend-y-api.md)

### `slsa`

*SLSA — Supply-chain Levels for Software Artifacts*, OpenSSF

- Localizador: <https://slsa.dev/spec/v1.0/>
- Temas: cadena de suministro, procedencia
- Citada en: [`curriculum/11-seleccion-y-sostenibilidad.md`](../curriculum/11-seleccion-y-sostenibilidad.md)

### `owasp-asvs`

*Application Security Verification Standard*, OWASP

- Localizador: <https://owasp.org/www-project-application-security-verification-standard/>
- Temas: seguridad, verificación, requisitos
- Citada en: [`curriculum/07-identidad-y-seguridad.md`](../curriculum/07-identidad-y-seguridad.md)

### `owasp-top10`

*OWASP Top 10*, OWASP

- Localizador: <https://owasp.org/www-project-top-ten/>
- Temas: seguridad, riesgos
- Citada en: [`curriculum/07-identidad-y-seguridad.md`](../curriculum/07-identidad-y-seguridad.md)

### `owasp-cheatsheets`

*OWASP Cheat Sheet Series*, OWASP

- Localizador: <https://cheatsheetseries.owasp.org/>
- Temas: seguridad, controles, implementación
- Citada en: [`curriculum/07-identidad-y-seguridad.md`](../curriculum/07-identidad-y-seguridad.md)

### `semver`

*Semantic Versioning 2.0.0*, Semantic Versioning

- Localizador: <https://semver.org/>
- Temas: versionado, compatibilidad
- Citada en: [`curriculum/00-taxonomia-y-diagnostico.md`](../curriculum/00-taxonomia-y-diagnostico.md), [`curriculum/11-seleccion-y-sostenibilidad.md`](../curriculum/11-seleccion-y-sostenibilidad.md)

### `w3c-wcag22`

*Web Content Accessibility Guidelines (WCAG) 2.2*, W3C, 2023

- Localizador: <https://www.w3.org/TR/WCAG22/>
- Temas: accesibilidad, criterios
- Citada en: [`curriculum/03-frontend-componentes-y-estado.md`](../curriculum/03-frontend-componentes-y-estado.md)

### `w3c-aria-apg`

*ARIA Authoring Practices Guide*, W3C

- Localizador: <https://www.w3.org/WAI/ARIA/apg/>
- Temas: accesibilidad, patrones, componentes
- Citada en: [`curriculum/03-frontend-componentes-y-estado.md`](../curriculum/03-frontend-componentes-y-estado.md)

### `w3c-service-worker`

*Service Workers*, W3C

- Localizador: <https://w3c.github.io/ServiceWorker/>
- Temas: offline, pwa, caché
- Citada en: [`curriculum/09-movil-escritorio-y-offline.md`](../curriculum/09-movil-escritorio-y-offline.md)

### `whatwg-fetch`

*Fetch Standard*, WHATWG

- Localizador: <https://fetch.spec.whatwg.org/>
- Temas: frontend, http, CORS
- Citada en: [`curriculum/01-http-eventos-y-contratos.md`](../curriculum/01-http-eventos-y-contratos.md)

### `whatwg-html`

*HTML Standard*, WHATWG

- Localizador: <https://html.spec.whatwg.org/multipage/>
- Temas: frontend, semántica, formularios
- Citada en: [`curriculum/03-frontend-componentes-y-estado.md`](../curriculum/03-frontend-componentes-y-estado.md)

## Documentación oficial y referencias

Documentación de quien mantiene la tecnología, o texto del autor citado.

### `adr-github`

*Architectural Decision Records*, ADR community

- Localizador: <https://adr.github.io/>
- Temas: decisiones, documentación
- Citada en: [`curriculum/11-seleccion-y-sostenibilidad.md`](../curriculum/11-seleccion-y-sostenibilidad.md), [`curriculum/12-producto-final.md`](../curriculum/12-producto-final.md)

### `kubernetes-docs`

*Kubernetes Documentation*, CNCF

- Localizador: <https://kubernetes.io/docs/home/>
- Temas: despliegue, operación
- Citada en: [`curriculum/12-producto-final.md`](../curriculum/12-producto-final.md)

### `fowler-injection`

Fowler, Martin, *Inversion of Control Containers and the Dependency Injection pattern*, martinfowler.com, 2004

- Localizador: <https://martinfowler.com/articles/injection.html>
- Temas: inversión de control, inyección
- Citada en: [`atlas/ecosistemas/jvm.md`](../atlas/ecosistemas/jvm.md), [`curriculum/02-arquitectura-de-frameworks.md`](../curriculum/02-arquitectura-de-frameworks.md)

### `fowler-strangler-fig`

Fowler, Martin, *Strangler Fig Application*, martinfowler.com, 2004

- Localizador: <https://martinfowler.com/bliki/StranglerFigApplication.html>
- Temas: migración, legado, incremental
- Citada en: [`curriculum/10-modernizacion-y-migracion.md`](../curriculum/10-modernizacion-y-migracion.md)

### `fowler-test-pyramid`

Fowler, Martin, *Test Pyramid*, martinfowler.com, 2012

- Localizador: <https://martinfowler.com/bliki/TestPyramid.html>
- Temas: pruebas, estrategia
- Citada en: [`curriculum/08-calidad-rendimiento-y-operacion.md`](../curriculum/08-calidad-rendimiento-y-operacion.md)

### `fowler-cqrs`

Fowler, Martin, *CQRS*, martinfowler.com, 2011

- Localizador: <https://martinfowler.com/bliki/CQRS.html>
- Temas: dominio, lectura y escritura
- Citada en: [`curriculum/06-persistencia-y-dominio.md`](../curriculum/06-persistencia-y-dominio.md)

### `fowler-microservice-tradeoffs`

Fowler, Martin, *Microservice Trade-Offs*, martinfowler.com, 2015

- Localizador: <https://martinfowler.com/articles/microservice-trade-offs.html>
- Temas: compromisos, distribución
- Citada en: [`curriculum/05-backend-y-api.md`](../curriculum/05-backend-y-api.md)

### `google-sre-books`

*Google SRE Books*, Google

- Localizador: <https://sre.google/books/>
- Temas: operación, SLO, incidentes
- Citada en: [`curriculum/08-calidad-rendimiento-y-operacion.md`](../curriculum/08-calidad-rendimiento-y-operacion.md)

### `google-eng-practices`

*Google Engineering Practices Documentation*, Google

- Localizador: <https://google.github.io/eng-practices/>
- Temas: revisión de código, proceso
- Citada en: [`curriculum/08-calidad-rendimiento-y-operacion.md`](../curriculum/08-calidad-rendimiento-y-operacion.md)

### `webdev-rendering`

*Rendering on the Web*, Google — web.dev

- Localizador: <https://web.dev/articles/rendering-on-the-web>
- Temas: renderizado, csr, ssr, ssg
- Citada en: [`curriculum/04-fullstack-y-renderizado.md`](../curriculum/04-fullstack-y-renderizado.md)

### `webdev-vitals`

*Web Vitals*, Google — web.dev

- Localizador: <https://web.dev/articles/vitals>
- Temas: rendimiento, métricas de usuario
- Citada en: [`curriculum/04-fullstack-y-renderizado.md`](../curriculum/04-fullstack-y-renderizado.md), [`curriculum/08-calidad-rendimiento-y-operacion.md`](../curriculum/08-calidad-rendimiento-y-operacion.md)

### `webdev-offline-cookbook`

*The Offline Cookbook*, Google — web.dev

- Localizador: <https://web.dev/articles/offline-cookbook>
- Temas: offline, estrategias de caché
- Citada en: [`curriculum/09-movil-escritorio-y-offline.md`](../curriculum/09-movil-escritorio-y-offline.md)

### `dora-research`

*DORA Research Program*, Google Cloud — DORA

- Localizador: <https://dora.dev/research/>
- Temas: métricas, entrega, evidencia
- Citada en: [`curriculum/08-calidad-rendimiento-y-operacion.md`](../curriculum/08-calidad-rendimiento-y-operacion.md)

### `twelve-factor`

*The Twelve-Factor App*, Heroku

- Localizador: <https://12factor.net/>
- Temas: configuración, despliegue, paridad de entornos
- Citada en: [`atlas/ecosistemas/cloud.md`](../atlas/ecosistemas/cloud.md), [`curriculum/09-movil-escritorio-y-offline.md`](../curriculum/09-movil-escritorio-y-offline.md), [`curriculum/12-producto-final.md`](../curriculum/12-producto-final.md)

### `inkandswitch-local-first`

Kleppmann, Martin; Wiggins, Adam; van Hardenberg, Peter; McGranaghan, Mark, *Local-first software: You own your data, in spite of the cloud*, Ink & Switch, 2019

- Localizador: <https://www.inkandswitch.com/local-first/>
- Temas: offline, sincronización, propiedad de datos
- Citada en: [`curriculum/09-movil-escritorio-y-offline.md`](../curriculum/09-movil-escritorio-y-offline.md)

### `spdx-licenses`

*SPDX License List*, Linux Foundation

- Localizador: <https://spdx.org/licenses/>
- Temas: licencias, cumplimiento
- Citada en: [`curriculum/00-taxonomia-y-diagnostico.md`](../curriculum/00-taxonomia-y-diagnostico.md), [`curriculum/11-seleccion-y-sostenibilidad.md`](../curriculum/11-seleccion-y-sostenibilidad.md)

### `mdn-web-docs`

*MDN Web Docs*, Mozilla

- Localizador: <https://developer.mozilla.org/en-US/docs/Web>
- Temas: frontend, referencia, navegador
- Citada en: [`curriculum/01-http-eventos-y-contratos.md`](../curriculum/01-http-eventos-y-contratos.md), [`curriculum/03-frontend-componentes-y-estado.md`](../curriculum/03-frontend-componentes-y-estado.md), [`curriculum/04-fullstack-y-renderizado.md`](../curriculum/04-fullstack-y-renderizado.md), [`curriculum/09-movil-escritorio-y-offline.md`](../curriculum/09-movil-escritorio-y-offline.md)

### `osi-licenses`

*OSI Approved Licenses*, Open Source Initiative

- Localizador: <https://opensource.org/licenses>
- Temas: licencias, gobierno
- Citada en: [`curriculum/00-taxonomia-y-diagnostico.md`](../curriculum/00-taxonomia-y-diagnostico.md), [`curriculum/11-seleccion-y-sostenibilidad.md`](../curriculum/11-seleccion-y-sostenibilidad.md)

### `nodejs-docs`

*Node.js API Documentation (v22 LTS)*, OpenJS Foundation

- Localizador: <https://nodejs.org/docs/latest-v22.x/api/>
- Temas: runtime, http, pruebas
- Citada en: [`curriculum/00-taxonomia-y-diagnostico.md`](../curriculum/00-taxonomia-y-diagnostico.md), [`curriculum/01-http-eventos-y-contratos.md`](../curriculum/01-http-eventos-y-contratos.md)

### `opentelemetry-docs`

*OpenTelemetry Documentation*, OpenTelemetry / CNCF

- Localizador: <https://opentelemetry.io/docs/>
- Temas: observabilidad, trazas, métricas
- Citada en: [`curriculum/08-calidad-rendimiento-y-operacion.md`](../curriculum/08-calidad-rendimiento-y-operacion.md)

### `postgresql-docs`

*PostgreSQL Documentation*, PostgreSQL Global Development Group

- Localizador: <https://www.postgresql.org/docs/current/>
- Temas: persistencia, sql, transacciones
- Citada en: [`curriculum/06-persistencia-y-dominio.md`](../curriculum/06-persistencia-y-dominio.md)
