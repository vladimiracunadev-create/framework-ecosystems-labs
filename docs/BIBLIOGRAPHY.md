# Bibliografía

Documento generado por `node scripts/generate-bibliography.mjs`. No editar a mano.

Registro: [`sources/bibliography.json`](../sources/bibliography.json) · **147** fuentes · verificadas el **2026-08-19** · política en [`sources/README.md`](../sources/README.md).

Cada entrada declara un localizador resoluble y es citada al menos una vez en el programa;
`node scripts/verify-sources.mjs` falla si deja de cumplirse cualquiera de las dos condiciones.

## Resumen

| Tipo | Entradas | Verificación |
| --- | ---: | --- |
| Libros | 65 | `https://openlibrary.org/isbn/{isbn13}.json` |
| Artículos | 7 | `https://api.crossref.org/works/{doi}` |
| Normas y especificaciones | 32 | `GET a la URL declarada` |
| Documentación oficial y referencias | 43 | `GET a la URL declarada` |

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

### `banks-porcello-learning-react`

Banks, Alex; Porcello, Eve, *Learning React: Modern Patterns for Developing React Apps*, 2.ª ed., O'Reilly Media, 2020, ISBN 9781492051725

- Localizador: <https://openlibrary.org/isbn/9781492051725>
- Temas: react, frontend, componentes
- Citada en: [`atlas/fichas/react.md`](../atlas/fichas/react.md)

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

### `bibeault-jquery-in-action`

Bibeault, Bear; Katz, Yehuda, *jQuery in Action*, Manning, 2008, ISBN 9781933988351

- Localizador: <https://openlibrary.org/isbn/9781933988351>
- Temas: jquery, dom, navegador
- Citada en: [`atlas/fichas/jquery.md`](../atlas/fichas/jquery.md)

### `brooks-mythical-man-month`

Brooks, Frederick P., *The Mythical Man-Month: Essays on Software Engineering*, aniversario ed., Addison-Wesley Professional, 1995, ISBN 9780201835953

- Localizador: <https://openlibrary.org/isbn/9780201835953>
- Temas: complejidad, segundo sistema, equipos
- Citada en: [`atlas/fichas/angularjs.md`](../atlas/fichas/angularjs.md)

### `brown-make-it-stick`

Brown, Peter C.; Roediger, Henry L.; McDaniel, Mark A., *Make It Stick: The Science of Successful Learning*, Belknap Press of Harvard University Press, 2014, ISBN 9780674729018

- Localizador: <https://openlibrary.org/isbn/9780674729018>
- Temas: pedagogía, recuperación, intercalado
- Citada en: [`assessments/diagnostic.md`](../assessments/diagnostic.md), [`docs/LEARNING-MODEL.md`](../docs/LEARNING-MODEL.md)

### `casciaro-node-patterns`

Casciaro, Mario; Mammino, Luciano, *Node.js Design Patterns*, 3.ª ed., Packt Publishing, 2020, ISBN 9781839214110

- Localizador: <https://openlibrary.org/isbn/9781839214110>
- Temas: node, patrones, asincronía
- Citada en: [`atlas/fichas/express.md`](../atlas/fichas/express.md)

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

### `fain-moiseev-angular`

Fain, Yakov; Moiseev, Anton, *Angular Development with TypeScript*, 2.ª ed., Manning Publications, 2018, ISBN 9781617295348

- Localizador: <https://openlibrary.org/isbn/9781617295348>
- Temas: angular, typescript, inyección
- Citada en: [`atlas/fichas/angularjs.md`](../atlas/fichas/angularjs.md)

### `feathers-legacy-code`

Feathers, Michael C., *Working Effectively with Legacy Code*, Prentice Hall, 2004, ISBN 9780131177055

- Localizador: <https://openlibrary.org/isbn/9780131177055>
- Temas: legado, costuras, refactorización
- Citada en: [`curriculum/10-modernizacion-y-migracion.md`](../curriculum/10-modernizacion-y-migracion.md)

### `fernandez-rails-way`

Fernandez, Obie, *The Rails Way*, Addison-Wesley Professional, 2007, ISBN 9780321445612

- Localizador: <https://openlibrary.org/isbn/9780321445612>
- Temas: rails, convenciones, registro activo
- Citada en: [`atlas/fichas/rails.md`](../atlas/fichas/rails.md)

### `flanagan-javascript-definitive`

Flanagan, David, *JavaScript: The Definitive Guide*, 7.ª ed., O'Reilly Media, 2020, ISBN 9781491952023

- Localizador: <https://openlibrary.org/isbn/9781491952023>
- Temas: javascript, lenguaje, referencia
- Citada en: [`atlas/fichas/jquery.md`](../atlas/fichas/jquery.md)

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

### `freeman-pro-aspnet-core`

Freeman, Adam, *Pro ASP.NET Core 7*, Manning Publications, 2023, ISBN 9781633437821

- Localizador: <https://openlibrary.org/isbn/9781633437821>
- Temas: aspnet, .net, middleware
- Citada en: [`atlas/fichas/aspnet-webforms.md`](../atlas/fichas/aspnet-webforms.md)

### `freeman-pryce-goos`

Freeman, Steve; Pryce, Nat, *Growing Object-Oriented Software, Guided by Tests*, Addison-Wesley, 2010, ISBN 9780321503626

- Localizador: <https://openlibrary.org/isbn/9780321503626>
- Temas: pruebas, diseño, dobles
- Citada en: [`atlas/fichas/spring-boot.md`](../atlas/fichas/spring-boot.md)

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

### `gross-hypermedia-systems`

Gross, Carson; Stepinski, Adam; Akşimşek, Deniz, *Hypermedia Systems*, Big Sky Software, 2024, ISBN 9798990991804

- Localizador: <https://openlibrary.org/isbn/9798990991804>
- Temas: hipermedia, htmx, rest
- Citada en: [`atlas/fichas/htmx.md`](../atlas/fichas/htmx.md)

### `haverbeke-eloquent-javascript`

Haverbeke, Marijn, *Eloquent JavaScript: A Modern Introduction to Programming*, 3.ª ed., No Starch Press, 2018, ISBN 9781593279509

- Localizador: <https://openlibrary.org/isbn/9781593279509>
- Temas: javascript, dom, fundamentos
- Citada en: [`atlas/fichas/jquery.md`](../atlas/fichas/jquery.md)

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

### `jin-sahni-designing-web-apis`

Jin, Brenda; Sahni, Saurabh; Shevat, Amir, *Designing Web APIs: Building APIs That Developers Love*, O'Reilly Media, 2018, ISBN 9781492026921

- Localizador: <https://openlibrary.org/isbn/9781492026921>
- Temas: api, contrato, diseño
- Citada en: [`atlas/fichas/express.md`](../atlas/fichas/express.md)

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

### `lockhart-modern-php`

Lockhart, Josh, *Modern PHP: New Features and Good Practices*, O'Reilly Media, 2015, ISBN 9781491905180

- Localizador: <https://openlibrary.org/isbn/9781491905180>
- Temas: php, estándares, interoperabilidad
- Citada en: [`atlas/fichas/laravel.md`](../atlas/fichas/laravel.md)

### `macrae-vue-up-and-running`

Macrae, Callum, *Vue.js: Up and Running: Building Accessible and Performant Web Apps*, O'Reilly Media, 2018, ISBN 9781491997246

- Localizador: <https://openlibrary.org/isbn/9781491997246>
- Temas: vue, frontend, accesibilidad
- Citada en: [`atlas/fichas/vue.md`](../atlas/fichas/vue.md)

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

### `mccord-tate-programming-phoenix`

McCord, Chris; Tate, Bruce; Valim, José, *Programming Phoenix*, Pragmatic Bookshelf, 2016, ISBN 9781680501452

- Localizador: <https://openlibrary.org/isbn/9781680501452>
- Temas: phoenix, elixir, tiempo real
- Citada en: [`atlas/fichas/phoenix.md`](../atlas/fichas/phoenix.md)

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

### `osmani-backbone`

Osmani, Addy, *Developing Backbone.js Applications*, O'Reilly Media, 2012, ISBN 9781449328252

- Localizador: <https://openlibrary.org/isbn/9781449328252>
- Temas: backbone, mvc, frontend
- Citada en: [`atlas/fichas/react.md`](../atlas/fichas/react.md)

### `ousterhout-philosophy`

Ousterhout, John K., *A Philosophy of Software Design*, 2.ª ed., Yaknyam Press, 2021, ISBN 9781732102217

- Localizador: <https://openlibrary.org/isbn/9781732102217>
- Temas: diseño, complejidad, abstracción
- Citada en: [`atlas/fichas/react.md`](../atlas/fichas/react.md)

### `percival-tdd-python`

Percival, Harry J. W., *Test-Driven Development with Python: Obey the Testing Goat*, 2.ª ed., O'Reilly Media, 2017, ISBN 9781491958704

- Localizador: <https://openlibrary.org/isbn/9781491958704>
- Temas: pruebas, django, tdd
- Citada en: [`atlas/fichas/django.md`](../atlas/fichas/django.md)

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
- Citada en: [`atlas/fichas/htmx.md`](../atlas/fichas/htmx.md), [`curriculum/01-http-eventos-y-contratos.md`](../curriculum/01-http-eventos-y-contratos.md), [`curriculum/05-backend-y-api.md`](../curriculum/05-backend-y-api.md)

### `greenfeld-two-scoops-django`

Roy Greenfeld, Daniel; Roy Greenfeld, Audrey, *Two Scoops of Django: Best Practices for Django*, Two Scoops Press, 2013, ISBN 9781481879705

- Localizador: <https://openlibrary.org/isbn/9781481879705>
- Temas: django, buenas prácticas, estructura
- Citada en: [`atlas/fichas/django.md`](../atlas/fichas/django.md)

### `ruby-thomas-agile-rails`

Ruby, Sam; Thomas, Dave, *Agile Web Development with Rails 7*, Pragmatic Bookshelf, 2022, ISBN 9781680509298

- Localizador: <https://openlibrary.org/isbn/9781680509298>
- Temas: rails, convenciones, full stack
- Citada en: [`atlas/fichas/rails.md`](../atlas/fichas/rails.md)

### `seemann-deursen-di`

Seemann, Mark; van Deursen, Steven, *Dependency Injection Principles, Practices, and Patterns*, Manning Publications, 2019, ISBN 9781617294730

- Localizador: <https://openlibrary.org/isbn/9781617294730>
- Temas: inversión de control, inyección, ciclo de vida
- Citada en: [`atlas/fichas/spring-boot.md`](../atlas/fichas/spring-boot.md), [`curriculum/02-arquitectura-de-frameworks.md`](../curriculum/02-arquitectura-de-frameworks.md)

### `shostack-threat-modeling`

Shostack, Adam, *Threat Modeling: Designing for Security*, Wiley, 2014, ISBN 9781118809990

- Localizador: <https://openlibrary.org/isbn/9781118809990>
- Temas: seguridad, amenazas, diseño
- Citada en: [`curriculum/07-identidad-y-seguridad.md`](../curriculum/07-identidad-y-seguridad.md)

### `stauffer-laravel`

Stauffer, Matt, *Laravel: Up & Running: A Framework for Building Modern PHP Apps*, 2.ª ed., O'Reilly Media, 2019, ISBN 9781492041214

- Localizador: <https://openlibrary.org/isbn/9781492041214>
- Temas: laravel, php, full stack
- Citada en: [`atlas/fichas/laravel.md`](../atlas/fichas/laravel.md)

### `sweller-cognitive-load-theory`

Sweller, John; Ayres, Paul; Kalyuga, Slava, *Cognitive Load Theory*, Springer, 2011, ISBN 9781441981257

- Localizador: <https://openlibrary.org/isbn/9781441981257>
- Temas: pedagogía, carga cognitiva, ejemplos resueltos
- Citada en: [`docs/LEARNING-MODEL.md`](../docs/LEARNING-MODEL.md)

### `thomas-programming-elixir`

Thomas, Dave, *Programming Elixir*, Pragmatic Bookshelf, 2014, ISBN 9781937785581

- Localizador: <https://openlibrary.org/isbn/9781937785581>
- Temas: elixir, concurrencia, beam
- Citada en: [`atlas/fichas/phoenix.md`](../atlas/fichas/phoenix.md)

### `vernon-iddd`

Vernon, Vaughn, *Implementing Domain-Driven Design*, Addison-Wesley Professional, 2012, ISBN 9780321834577

- Localizador: <https://openlibrary.org/isbn/9780321834577>
- Temas: dominio, contextos, integración
- Citada en: [`curriculum/06-persistencia-y-dominio.md`](../curriculum/06-persistencia-y-dominio.md)

### `vincent-django-professionals`

Vincent, William S., *Django for Professionals: Production Websites with Python & Django*, Independently published, 2019, ISBN 9781081582166

- Localizador: <https://openlibrary.org/isbn/9781081582166>
- Temas: django, despliegue, producción
- Citada en: [`atlas/fichas/django.md`](../atlas/fichas/django.md)

### `walls-spring-in-action`

Walls, Craig, *Spring in Action*, 6.ª ed., Manning Publications, 2022, ISBN 9781617297571

- Localizador: <https://openlibrary.org/isbn/9781617297571>
- Temas: spring, inyección, jvm
- Citada en: [`atlas/fichas/spring-boot.md`](../atlas/fichas/spring-boot.md)

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

### `tc39-ecma262`

*ECMAScript Language Specification*, Ecma International — TC39

- Localizador: <https://tc39.es/ecma262/>
- Temas: javascript, lenguaje, estándar
- Citada en: [`atlas/fichas/jquery.md`](../atlas/fichas/jquery.md)

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

### `php-fig-psr`

*PSR — PHP Standards Recommendations*, PHP-FIG

- Localizador: <https://www.php-fig.org/psr/>
- Temas: php, interoperabilidad, middleware
- Citada en: [`atlas/fichas/laravel.md`](../atlas/fichas/laravel.md)

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

### `webassembly-org`

*WebAssembly*, W3C — WebAssembly

- Localizador: <https://webassembly.org/>
- Temas: webassembly, runtime, navegador
- Citada en: [`atlas/ecosistemas/rust.md`](../atlas/ecosistemas/rust.md)

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

### `whatwg-dom`

*DOM Standard*, WHATWG

- Localizador: <https://dom.spec.whatwg.org/>
- Temas: dom, eventos, navegador
- Citada en: [`atlas/fichas/jquery.md`](../atlas/fichas/jquery.md)

## Documentación oficial y referencias

Documentación de quien mantiene la tecnología, o texto del autor citado.

### `adr-github`

*Architectural Decision Records*, ADR community

- Localizador: <https://adr.github.io/>
- Temas: decisiones, documentación
- Citada en: [`curriculum/11-seleccion-y-sostenibilidad.md`](../curriculum/11-seleccion-y-sostenibilidad.md), [`curriculum/12-producto-final.md`](../curriculum/12-producto-final.md)

### `struts-security`

*Apache Struts Security Bulletins*, Apache Software Foundation

- Localizador: <https://struts.apache.org/security/>
- Temas: seguridad, struts, actualización
- Citada en: [`atlas/fichas/struts.md`](../atlas/fichas/struts.md)

### `astro-islands`

*Islands Architecture*, Astro

- Localizador: <https://docs.astro.build/en/concepts/islands/>
- Temas: islas, renderizado, hidratación
- Citada en: [`atlas/fichas/astro.md`](../atlas/fichas/astro.md)

### `cisa-kev`

*Known Exploited Vulnerabilities Catalog*, CISA

- Localizador: <https://www.cisa.gov/known-exploited-vulnerabilities-catalog>
- Temas: seguridad, explotación activa, priorización
- Citada en: [`atlas/fichas/struts.md`](../atlas/fichas/struts.md)

### `kubernetes-docs`

*Kubernetes Documentation*, CNCF

- Localizador: <https://kubernetes.io/docs/home/>
- Temas: despliegue, operación
- Citada en: [`curriculum/12-producto-final.md`](../curriculum/12-producto-final.md)

### `django-releases`

*Django Release Notes*, Django Software Foundation

- Localizador: <https://docs.djangoproject.com/en/stable/releases/>
- Temas: versiones, soporte, django
- Citada en: [`atlas/fichas/django.md`](../atlas/fichas/django.md)

### `ember-rfcs`

*Ember RFCs*, Ember.js

- Localizador: <https://rfcs.emberjs.com/>
- Temas: gobierno, proceso, cambios
- Citada en: [`atlas/fichas/angularjs.md`](../atlas/fichas/angularjs.md)

### `endoflife-date`

*endoflife.date — Release and support calendars*, endoflife.date

- Localizador: <https://endoflife.date/>
- Temas: soporte, versiones, ciclo de vida
- Citada en: [`atlas/fichas/angularjs.md`](../atlas/fichas/angularjs.md)

### `fielding-rest-dissertation`

Fielding, Roy T., *Architectural Styles and the Design of Network-based Software Architectures*, University of California, Irvine, 2000

- Localizador: <https://ics.uci.edu/~fielding/pubs/dissertation/top.htm>
- Temas: rest, hipermedia, arquitectura
- Citada en: [`atlas/fichas/htmx.md`](../atlas/fichas/htmx.md)

### `fowler-injection`

Fowler, Martin, *Inversion of Control Containers and the Dependency Injection pattern*, martinfowler.com, 2004

- Localizador: <https://martinfowler.com/articles/injection.html>
- Temas: inversión de control, inyección
- Citada en: [`atlas/ecosistemas/jvm.md`](../atlas/ecosistemas/jvm.md), [`atlas/fichas/spring-boot.md`](../atlas/fichas/spring-boot.md), [`curriculum/02-arquitectura-de-frameworks.md`](../curriculum/02-arquitectura-de-frameworks.md)

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

### `angularjs-eol`

*AngularJS Version Support Status*, Google — AngularJS

- Localizador: <https://docs.angularjs.org/misc/version-support-status>
- Temas: fin de soporte, migración, ciclo de vida
- Citada en: [`atlas/fichas/angularjs.md`](../atlas/fichas/angularjs.md)

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

### `htmx-essays`

Gross, Carson, *htmx Essays*, htmx

- Localizador: <https://htmx.org/essays/>
- Temas: hipermedia, htmx, arquitectura
- Citada en: [`atlas/fichas/htmx.md`](../atlas/fichas/htmx.md)

### `rails-doctrine`

Hansson, David Heinemeier, *The Rails Doctrine*, Ruby on Rails

- Localizador: <https://rubyonrails.org/doctrine>
- Temas: rails, convenciones, filosofía
- Citada en: [`atlas/fichas/rails.md`](../atlas/fichas/rails.md)

### `svelte-vdom-essay`

Harris, Rich, *Virtual DOM is pure overhead*, Svelte, 2018

- Localizador: <https://svelte.dev/blog/virtual-dom-is-pure-overhead>
- Temas: svelte, árbol virtual, compilación
- Citada en: [`atlas/fichas/react.md`](../atlas/fichas/react.md)

### `twelve-factor`

*The Twelve-Factor App*, Heroku

- Localizador: <https://12factor.net/>
- Temas: configuración, despliegue, paridad de entornos
- Citada en: [`atlas/ecosistemas/cloud.md`](../atlas/ecosistemas/cloud.md), [`curriculum/09-movil-escritorio-y-offline.md`](../curriculum/09-movil-escritorio-y-offline.md), [`curriculum/12-producto-final.md`](../curriculum/12-producto-final.md)

### `web-almanac`

*Web Almanac*, HTTP Archive

- Localizador: <https://almanac.httparchive.org/>
- Temas: datos, adopción, web
- Citada en: [`atlas/fichas/jquery.md`](../atlas/fichas/jquery.md)

### `inkandswitch-local-first`

Kleppmann, Martin; Wiggins, Adam; van Hardenberg, Peter; McGranaghan, Mark, *Local-first software: You own your data, in spite of the cloud*, Ink & Switch, 2019

- Localizador: <https://www.inkandswitch.com/local-first/>
- Temas: offline, sincronización, propiedad de datos
- Citada en: [`curriculum/09-movil-escritorio-y-offline.md`](../curriculum/09-movil-escritorio-y-offline.md)

### `laravel-releases`

*Laravel Release Notes and Support Policy*, Laravel

- Localizador: <https://laravel.com/docs/releases>
- Temas: versiones, soporte, laravel
- Citada en: [`atlas/fichas/laravel.md`](../atlas/fichas/laravel.md)

### `spdx-licenses`

*SPDX License List*, Linux Foundation

- Localizador: <https://spdx.org/licenses/>
- Temas: licencias, cumplimiento
- Citada en: [`curriculum/00-taxonomia-y-diagnostico.md`](../curriculum/00-taxonomia-y-diagnostico.md), [`curriculum/11-seleccion-y-sostenibilidad.md`](../curriculum/11-seleccion-y-sostenibilidad.md)

### `react-why`

*Why did we build React?*, Meta — React, 2013

- Localizador: <https://legacy.reactjs.org/blog/2013/06/05/why-react.html>
- Temas: react, motivación, estado
- Citada en: [`atlas/fichas/react.md`](../atlas/fichas/react.md)

### `react-server-components`

*React Server Components*, Meta — React

- Localizador: <https://react.dev/reference/rsc/server-components>
- Temas: react, servidor, renderizado
- Citada en: [`atlas/fichas/react.md`](../atlas/fichas/react.md)

### `blazor-webforms`

*Blazor for ASP.NET Web Forms Developers*, Microsoft

- Localizador: <https://learn.microsoft.com/dotnet/architecture/blazor-for-web-forms-developers/>
- Temas: migración, web forms, blazor
- Citada en: [`atlas/fichas/aspnet-webforms.md`](../atlas/fichas/aspnet-webforms.md)

### `jasonformat-islands`

Miller, Jason, *Islands Architecture*, jasonformat.com, 2020

- Localizador: <https://jasonformat.com/islands-architecture/>
- Temas: islas, hidratación, rendimiento
- Citada en: [`atlas/fichas/astro.md`](../atlas/fichas/astro.md)

### `mdn-web-docs`

*MDN Web Docs*, Mozilla

- Localizador: <https://developer.mozilla.org/en-US/docs/Web>
- Temas: frontend, referencia, navegador
- Citada en: [`curriculum/01-http-eventos-y-contratos.md`](../curriculum/01-http-eventos-y-contratos.md), [`curriculum/03-frontend-componentes-y-estado.md`](../curriculum/03-frontend-componentes-y-estado.md), [`curriculum/04-fullstack-y-renderizado.md`](../curriculum/04-fullstack-y-renderizado.md), [`curriculum/09-movil-escritorio-y-offline.md`](../curriculum/09-movil-escritorio-y-offline.md)

### `cve-2017-5638`

*CVE-2017-5638 — Apache Struts remote code execution*, NIST — National Vulnerability Database, 2017

- Localizador: <https://nvd.nist.gov/vuln/detail/CVE-2017-5638>
- Temas: vulnerabilidad, struts, cadena de suministro
- Citada en: [`atlas/fichas/struts.md`](../atlas/fichas/struts.md)

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

### `openjsf-projects`

*OpenJS Foundation Projects*, OpenJS Foundation

- Localizador: <https://openjsf.org/projects>
- Temas: gobierno, fundación, javascript
- Citada en: [`atlas/fichas/jquery.md`](../atlas/fichas/jquery.md)

### `opentelemetry-docs`

*OpenTelemetry Documentation*, OpenTelemetry / CNCF

- Localizador: <https://opentelemetry.io/docs/>
- Temas: observabilidad, trazas, métricas
- Citada en: [`curriculum/08-calidad-rendimiento-y-operacion.md`](../curriculum/08-calidad-rendimiento-y-operacion.md)

### `patterns-dev`

*Patterns.dev — Modern Web App Design Patterns*, patterns.dev

- Localizador: <https://www.patterns.dev/>
- Temas: patrones, renderizado, frontend
- Citada en: [`atlas/fichas/astro.md`](../atlas/fichas/astro.md)

### `postgresql-docs`

*PostgreSQL Documentation*, PostgreSQL Global Development Group

- Localizador: <https://www.postgresql.org/docs/current/>
- Temas: persistencia, sql, transacciones
- Citada en: [`curriculum/06-persistencia-y-dominio.md`](../curriculum/06-persistencia-y-dominio.md)

### `symfony-components`

*Symfony Components*, Symfony

- Localizador: <https://symfony.com/components>
- Temas: php, componentes, reutilización
- Citada en: [`atlas/fichas/laravel.md`](../atlas/fichas/laravel.md)

### `vue-reactivity`

*Reactivity in Depth*, Vue

- Localizador: <https://vuejs.org/guide/extras/reactivity-in-depth.html>
- Temas: vue, reactividad, señales
- Citada en: [`atlas/fichas/vue.md`](../atlas/fichas/vue.md)
