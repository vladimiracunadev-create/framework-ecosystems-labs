# Bibliografía

Documento generado por `node scripts/generate-bibliography.mjs`. No editar a mano.

Registro: [`sources/bibliography.json`](../sources/bibliography.json) · **228** fuentes · verificadas el **2026-08-19** · política en [`sources/README.md`](../sources/README.md).

Cada entrada declara un localizador resoluble y es citada al menos una vez en el programa;
`node scripts/verify-sources.mjs` falla si deja de cumplirse cualquiera de las dos condiciones.

## Resumen

| Tipo | Entradas | Verificación |
| --- | ---: | --- |
| Libros | 100 | `https://openlibrary.org/isbn/{isbn13}.json` |
| Artículos | 7 | `https://api.crossref.org/works/{doi}` |
| Normas y especificaciones | 33 | `GET a la URL declarada` |
| Documentación oficial y referencias | 88 | `GET a la URL declarada` |

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
- Citada en: [`atlas/fichas/drizzle.md`](../atlas/fichas/drizzle.md), [`atlas/fichas/entity-framework-core.md`](../atlas/fichas/entity-framework-core.md), [`curriculum/06-persistencia-y-dominio.md`](../curriculum/06-persistencia-y-dominio.md), [`curriculum/10-modernizacion-y-migracion.md`](../curriculum/10-modernizacion-y-migracion.md)

### `anderson-krathwohl-taxonomy`

Anderson, Lorin W.; Krathwohl, David R., *A Taxonomy for Learning, Teaching, and Assessing: A Revision of Bloom's Taxonomy of Educational Objectives*, Longman, 2001, ISBN 9780321084057

- Localizador: <https://openlibrary.org/isbn/9780321084057>
- Temas: pedagogía, objetivos, evaluación
- Citada en: [`assessments/rubric.md`](../assessments/rubric.md), [`curriculum/00-taxonomia-y-diagnostico.md`](../curriculum/00-taxonomia-y-diagnostico.md), [`docs/LEARNING-MODEL.md`](../docs/LEARNING-MODEL.md)

### `ater-pwa`

Ater, Tal, *Building Progressive Web Apps: Bringing the Power of Native to the Browser*, O'Reilly Media, 2017, ISBN 9781491961650

- Localizador: <https://openlibrary.org/isbn/9781491961650>
- Temas: pwa, offline, movil
- Citada en: [`atlas/fichas/capacitor.md`](../atlas/fichas/capacitor.md), [`atlas/fichas/cordova.md`](../atlas/fichas/cordova.md)

### `banks-porcello-learning-react`

Banks, Alex; Porcello, Eve, *Learning React: Modern Patterns for Developing React Apps*, 2.ª ed., O'Reilly Media, 2020, ISBN 9781492051725

- Localizador: <https://openlibrary.org/isbn/9781492051725>
- Temas: react, frontend, componentes
- Citada en: [`atlas/fichas/jetpack-compose.md`](../atlas/fichas/jetpack-compose.md), [`atlas/fichas/react-router.md`](../atlas/fichas/react-router.md), [`atlas/fichas/react.md`](../atlas/fichas/react.md)

### `bass-software-architecture-practice`

Bass, Len; Clements, Paul; Kazman, Rick, *Software Architecture in Practice*, 4.ª ed., Pearson Education, 2021, ISBN 9780136886099

- Localizador: <https://openlibrary.org/isbn/9780136886099>
- Temas: arquitectura, atributos de calidad, tácticas
- Citada en: [`atlas/fichas/jakarta-faces.md`](../atlas/fichas/jakarta-faces.md), [`curriculum/11-seleccion-y-sostenibilidad.md`](../curriculum/11-seleccion-y-sostenibilidad.md), [`curriculum/12-producto-final.md`](../curriculum/12-producto-final.md)

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
- Citada en: [`atlas/fichas/jquery.md`](../atlas/fichas/jquery.md), [`atlas/fichas/mootools.md`](../atlas/fichas/mootools.md)

### `blandy-programming-rust`

Blandy, Jim; Orendorff, Jason; Tindall, Leonora F. S., *Programming Rust: Fast, Safe Systems Development*, 2.ª ed., O'Reilly Media, 2021, ISBN 9781492052593

- Localizador: <https://openlibrary.org/isbn/9781492052593>
- Temas: rust, sistemas, concurrencia
- Citada en: [`atlas/fichas/actix-web.md`](../atlas/fichas/actix-web.md), [`atlas/fichas/leptos.md`](../atlas/fichas/leptos.md)

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

### `burns-designing-distributed`

Burns, Brendan, *Designing Distributed Systems: Patterns and Paradigms for Scalable, Reliable Services*, O'Reilly Media, 2018, ISBN 9781491983645

- Localizador: <https://openlibrary.org/isbn/9781491983645>
- Temas: patrones, distribución, contenedores
- Citada en: [`atlas/fichas/kubernetes.md`](../atlas/fichas/kubernetes.md)

### `casciaro-node-patterns`

Casciaro, Mario; Mammino, Luciano, *Node.js Design Patterns*, 3.ª ed., Packt Publishing, 2020, ISBN 9781839214110

- Localizador: <https://openlibrary.org/isbn/9781839214110>
- Temas: node, patrones, asincronía
- Citada en: [`atlas/fichas/adonisjs.md`](../atlas/fichas/adonisjs.md), [`atlas/fichas/express.md`](../atlas/fichas/express.md), [`atlas/fichas/fastify.md`](../atlas/fichas/fastify.md), [`atlas/fichas/hapi.md`](../atlas/fichas/hapi.md), [`atlas/fichas/koa.md`](../atlas/fichas/koa.md), [`atlas/fichas/ktor.md`](../atlas/fichas/ktor.md), [`atlas/fichas/sails.md`](../atlas/fichas/sails.md)

### `chacon-straub-pro-git`

Chacon, Scott; Straub, Ben, *Pro Git*, 2.ª ed., Apress, 2014, ISBN 9781484200773

- Localizador: <https://openlibrary.org/isbn/9781484200773>
- Temas: herramientas, control-de-versiones, entorno
- Citada en: 

### `cohn-succeeding-agile`

Cohn, Mike, *Succeeding with Agile: Software Development Using Scrum*, Addison-Wesley, 2009, ISBN 9780321579362

- Localizador: <https://openlibrary.org/isbn/9780321579362>
- Temas: pirámide de pruebas, proceso, equipos
- Citada en: [`curriculum/08-calidad-rendimiento-y-operacion.md`](../curriculum/08-calidad-rendimiento-y-operacion.md)

### `dabit-react-native`

Dabit, Nader, *React Native in Action*, Manning Publications, 2019, ISBN 9781617294051

- Localizador: <https://openlibrary.org/isbn/9781617294051>
- Temas: react native, móvil, puente
- Citada en: [`atlas/fichas/react-native.md`](../atlas/fichas/react-native.md)

### `djirdeh-fullstack-react-native`

Djirdeh, Houssein; Accomazzo, Anthony; Grieco, Sophia, *Fullstack React Native*, Independently published, 2019, ISBN 9781728995557

- Localizador: <https://openlibrary.org/isbn/9781728995557>
- Temas: react native, móvil, componentes
- Citada en: [`atlas/fichas/react-native.md`](../atlas/fichas/react-native.md)

### `donovan-kernighan-go`

Donovan, Alan A. A.; Kernighan, Brian W., *The Go Programming Language*, Addison-Wesley, 2016, ISBN 9780134190440

- Localizador: <https://openlibrary.org/isbn/9780134190440>
- Temas: go, lenguaje, concurrencia
- Citada en: [`atlas/fichas/beego.md`](../atlas/fichas/beego.md), [`atlas/fichas/chi.md`](../atlas/fichas/chi.md), [`atlas/fichas/fiber.md`](../atlas/fichas/fiber.md), [`atlas/fichas/gin.md`](../atlas/fichas/gin.md)

### `ericsson-peak`

Ericsson, Anders; Pool, Robert, *Peak: Secrets from the New Science of Expertise*, Houghton Mifflin Harcourt, 2016, ISBN 9780544456235

- Localizador: <https://openlibrary.org/isbn/9780544456235>
- Temas: pedagogía, práctica deliberada, retroalimentación
- Citada en: [`docs/LEARNING-MODEL.md`](../docs/LEARNING-MODEL.md)

### `evans-ddd`

Evans, Eric, *Domain-Driven Design: Tackling Complexity in the Heart of Software*, Addison-Wesley, 2003, ISBN 9780321125217

- Localizador: <https://openlibrary.org/isbn/9780321125217>
- Temas: dominio, modelado, lenguaje ubicuo
- Citada en: [`atlas/fichas/activerecord.md`](../atlas/fichas/activerecord.md), [`atlas/fichas/hibernate.md`](../atlas/fichas/hibernate.md), [`curriculum/06-persistencia-y-dominio.md`](../curriculum/06-persistencia-y-dominio.md)

### `fain-moiseev-angular`

Fain, Yakov; Moiseev, Anton, *Angular Development with TypeScript*, 2.ª ed., Manning Publications, 2018, ISBN 9781617295348

- Localizador: <https://openlibrary.org/isbn/9781617295348>
- Temas: angular, typescript, inyección
- Citada en: [`atlas/fichas/angularjs.md`](../atlas/fichas/angularjs.md)

### `farrell-web-components`

Farrell, Ben, *Web Components in Action*, Manning, 2019, ISBN 9781617295775

- Localizador: <https://openlibrary.org/isbn/9781617295775>
- Temas: componentes web, estándar, navegador
- Citada en: [`atlas/fichas/lit.md`](../atlas/fichas/lit.md)

### `feathers-legacy-code`

Feathers, Michael C., *Working Effectively with Legacy Code*, Prentice Hall, 2004, ISBN 9780131177055

- Localizador: <https://openlibrary.org/isbn/9780131177055>
- Temas: legado, costuras, refactorización
- Citada en: [`atlas/fichas/uikit.md`](../atlas/fichas/uikit.md), [`curriculum/10-modernizacion-y-migracion.md`](../curriculum/10-modernizacion-y-migracion.md)

### `fernandez-rails-way`

Fernandez, Obie, *The Rails Way*, Addison-Wesley Professional, 2007, ISBN 9780321445612

- Localizador: <https://openlibrary.org/isbn/9780321445612>
- Temas: rails, convenciones, registro activo
- Citada en: [`atlas/fichas/rails.md`](../atlas/fichas/rails.md)

### `flanagan-javascript-definitive`

Flanagan, David, *JavaScript: The Definitive Guide*, 7.ª ed., O'Reilly Media, 2020, ISBN 9781491952023

- Localizador: <https://openlibrary.org/isbn/9781491952023>
- Temas: javascript, lenguaje, referencia
- Citada en: [`atlas/fichas/jquery.md`](../atlas/fichas/jquery.md), [`atlas/fichas/prototype-js.md`](../atlas/fichas/prototype-js.md)

### `ford-evolutionary-architectures`

Ford, Neal; Parsons, Rebecca; Kua, Patrick; Sadalage, Pramod, *Building Evolutionary Architectures: Automated Software Governance*, 2.ª ed., O'Reilly Media, 2023, ISBN 9781492097549

- Localizador: <https://openlibrary.org/isbn/9781492097549>
- Temas: evolución, funciones de aptitud, gobierno
- Citada en: [`atlas/fichas/zend-framework.md`](../atlas/fichas/zend-framework.md), [`curriculum/11-seleccion-y-sostenibilidad.md`](../curriculum/11-seleccion-y-sostenibilidad.md)

### `forsgren-accelerate`

Forsgren, Nicole; Humble, Jez; Kim, Gene, *Accelerate: The Science of Lean Software and DevOps*, IT Revolution Press, 2018, ISBN 9781942788355

- Localizador: <https://openlibrary.org/isbn/9781942788355>
- Temas: métricas, rendimiento de entrega, evidencia
- Citada en: [`atlas/fichas/echo.md`](../atlas/fichas/echo.md), [`curriculum/08-calidad-rendimiento-y-operacion.md`](../curriculum/08-calidad-rendimiento-y-operacion.md), [`curriculum/11-seleccion-y-sostenibilidad.md`](../curriculum/11-seleccion-y-sostenibilidad.md)

### `fowler-poeaa`

Fowler, Martin, *Patterns of Enterprise Application Architecture*, Addison-Wesley, 2002, ISBN 9780321127426

- Localizador: <https://openlibrary.org/isbn/9780321127426>
- Temas: arquitectura, persistencia, dominio
- Citada en: [`atlas/README.md`](../atlas/README.md), [`atlas/fichas/activerecord.md`](../atlas/fichas/activerecord.md), [`atlas/fichas/eloquent.md`](../atlas/fichas/eloquent.md), [`atlas/fichas/entity-framework-core.md`](../atlas/fichas/entity-framework-core.md), [`atlas/fichas/hanami.md`](../atlas/fichas/hanami.md), [`atlas/fichas/hibernate.md`](../atlas/fichas/hibernate.md), [`atlas/fichas/prisma.md`](../atlas/fichas/prisma.md), [`atlas/fichas/sqlalchemy.md`](../atlas/fichas/sqlalchemy.md), [`atlas/fichas/typeorm.md`](../atlas/fichas/typeorm.md), [`atlas/fichas/yii.md`](../atlas/fichas/yii.md), [`curriculum/00-taxonomia-y-diagnostico.md`](../curriculum/00-taxonomia-y-diagnostico.md), [`curriculum/06-persistencia-y-dominio.md`](../curriculum/06-persistencia-y-dominio.md)

### `fowler-refactoring`

Fowler, Martin, *Refactoring: Improving the Design of Existing Code*, 2.ª ed., Addison-Wesley, 2018, ISBN 9780134757599

- Localizador: <https://openlibrary.org/isbn/9780134757599>
- Temas: refactorización, diseño, evolución
- Citada en: [`curriculum/10-modernizacion-y-migracion.md`](../curriculum/10-modernizacion-y-migracion.md)

### `freeman-pro-aspnet-core`

Freeman, Adam, *Pro ASP.NET Core 7*, Manning Publications, 2023, ISBN 9781633437821

- Localizador: <https://openlibrary.org/isbn/9781633437821>
- Temas: aspnet, .net, middleware
- Citada en: [`atlas/fichas/aspnet-core.md`](../atlas/fichas/aspnet-core.md), [`atlas/fichas/aspnet-mvc.md`](../atlas/fichas/aspnet-mvc.md), [`atlas/fichas/aspnet-webforms.md`](../atlas/fichas/aspnet-webforms.md)

### `freeman-head-first-patterns`

Freeman, Eric; Robson, Elisabeth; Bates, Bert; Sierra, Kathy, *Head First Design Patterns*, O'Reilly, 2004, ISBN 9780596007126

- Localizador: <https://openlibrary.org/isbn/9780596007126>
- Temas: patrones, composición, didáctica
- Citada en: [`atlas/fichas/nestjs.md`](../atlas/fichas/nestjs.md)

### `freeman-pryce-goos`

Freeman, Steve; Pryce, Nat, *Growing Object-Oriented Software, Guided by Tests*, Addison-Wesley, 2010, ISBN 9780321503626

- Localizador: <https://openlibrary.org/isbn/9780321503626>
- Temas: pruebas, diseño, dobles
- Citada en: [`atlas/fichas/spring-boot.md`](../atlas/fichas/spring-boot.md), [`atlas/fichas/spring-framework.md`](../atlas/fichas/spring-framework.md)

### `frost-atomic-design`

Frost, Brad, *Atomic Design*, Brad Frost, 2016, ISBN 9780998296609

- Localizador: <https://openlibrary.org/isbn/9780998296609>
- Temas: componentes, sistema de diseño, interfaz
- Citada en: [`atlas/fichas/lit.md`](../atlas/fichas/lit.md)

### `gof-design-patterns`

Gamma, Erich; Helm, Richard; Johnson, Ralph; Vlissides, John, *Design Patterns: Elements of Reusable Object-Oriented Software*, Addison-Wesley Professional, 1994, ISBN 9780201633610

- Localizador: <https://openlibrary.org/isbn/9780201633610>
- Temas: patrones, composición, extensibilidad
- Citada en: [`curriculum/02-arquitectura-de-frameworks.md`](../curriculum/02-arquitectura-de-frameworks.md)

### `geers-micro-frontends`

Geers, Michael, *Micro Frontends in Action*, Manning, 2020, ISBN 9781617296871

- Localizador: <https://openlibrary.org/isbn/9781617296871>
- Temas: frontend, integración, equipos
- Citada en: [`atlas/fichas/nextjs.md`](../atlas/fichas/nextjs.md)

### `geewax-api-design-patterns`

Geewax, JJ, *API Design Patterns*, Manning Publications, 2021, ISBN 9781617295850

- Localizador: <https://openlibrary.org/isbn/9781617295850>
- Temas: api, contratos, compatibilidad
- Citada en: [`curriculum/05-backend-y-api.md`](../curriculum/05-backend-y-api.md)

### `gregg-systems-performance`

Gregg, Brendan, *Systems Performance*, 2.ª ed., Pearson, 2020, ISBN 9780136820154

- Localizador: <https://openlibrary.org/isbn/9780136820154>
- Temas: rendimiento, medición, metodología
- Citada en: [`atlas/fichas/actix-web.md`](../atlas/fichas/actix-web.md), [`atlas/fichas/phalcon.md`](../atlas/fichas/phalcon.md), [`curriculum/08-calidad-rendimiento-y-operacion.md`](../curriculum/08-calidad-rendimiento-y-operacion.md)

### `grigorik-hpbn`

Grigorik, Ilya, *High Performance Browser Networking*, O'Reilly Media, 2013, ISBN 9781449344764

- Localizador: <https://openlibrary.org/isbn/9781449344764>
- Temas: http, red, rendimiento
- Citada en: [`curriculum/01-http-eventos-y-contratos.md`](../curriculum/01-http-eventos-y-contratos.md), [`curriculum/04-fullstack-y-renderizado.md`](../curriculum/04-fullstack-y-renderizado.md)

### `grinberg-flask`

Grinberg, Miguel, *Flask Web Development: Developing Web Applications with Python*, 2.ª ed., O'Reilly Media, 2018, ISBN 9781491991732

- Localizador: <https://openlibrary.org/isbn/9781491991732>
- Temas: flask, python, microframework
- Citada en: [`atlas/fichas/bottle.md`](../atlas/fichas/bottle.md), [`atlas/fichas/flask.md`](../atlas/fichas/flask.md)

### `gross-hypermedia-systems`

Gross, Carson; Stepinski, Adam; Akşimşek, Deniz, *Hypermedia Systems*, Big Sky Software, 2024, ISBN 9798990991804

- Localizador: <https://openlibrary.org/isbn/9798990991804>
- Temas: hipermedia, htmx, rest
- Citada en: [`atlas/fichas/hotwire-turbo.md`](../atlas/fichas/hotwire-turbo.md), [`atlas/fichas/htmx.md`](../atlas/fichas/htmx.md)

### `harris-sinatra`

Harris, Alan; Haase, Konstantin, *Sinatra: Up and Running*, O'Reilly Media, 2011, ISBN 9781449323981

- Localizador: <https://openlibrary.org/isbn/9781449323981>
- Temas: sinatra, ruby, microframework
- Citada en: [`atlas/fichas/sinatra.md`](../atlas/fichas/sinatra.md)

### `haverbeke-eloquent-javascript`

Haverbeke, Marijn, *Eloquent JavaScript: A Modern Introduction to Programming*, 3.ª ed., No Starch Press, 2018, ISBN 9781593279509

- Localizador: <https://openlibrary.org/isbn/9781593279509>
- Temas: javascript, dom, fundamentos
- Citada en: [`atlas/fichas/jquery.md`](../atlas/fichas/jquery.md)

### `hightower-kubernetes`

Hightower, Kelsey; Burns, Brendan; Beda, Joe, *Kubernetes: Up and Running*, O'Reilly Media, 2017, ISBN 9781491935675

- Localizador: <https://openlibrary.org/isbn/9781491935675>
- Temas: kubernetes, despliegue, operación
- Citada en: [`atlas/fichas/kubernetes.md`](../atlas/fichas/kubernetes.md)

### `hoffman-web-application-security`

Hoffman, Andrew, *Web Application Security: Exploitation and Countermeasures for Modern Web Applications*, O'Reilly Media, 2020, ISBN 9781492053118

- Localizador: <https://openlibrary.org/isbn/9781492053118>
- Temas: seguridad, web, contramedidas
- Citada en: [`curriculum/07-identidad-y-seguridad.md`](../curriculum/07-identidad-y-seguridad.md)

### `hohpe-woolf-eip`

Hohpe, Gregor; Woolf, Bobby, *Enterprise Integration Patterns: Designing, Building, and Deploying Messaging Solutions*, Addison-Wesley, 2003, ISBN 9780321200686

- Localizador: <https://openlibrary.org/isbn/9780321200686>
- Temas: integración, mensajería, eventos
- Citada en: [`atlas/fichas/vertx.md`](../atlas/fichas/vertx.md), [`curriculum/02-arquitectura-de-frameworks.md`](../curriculum/02-arquitectura-de-frameworks.md), [`curriculum/10-modernizacion-y-migracion.md`](../curriculum/10-modernizacion-y-migracion.md)

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

### `kinney-electron`

Kinney, Steve, *Electron in Action*, Manning Publications, 2018, ISBN 9781617294143

- Localizador: <https://openlibrary.org/isbn/9781617294143>
- Temas: electron, escritorio, navegador incrustado
- Citada en: [`atlas/fichas/electron.md`](../atlas/fichas/electron.md)

### `klabnik-nichols-rust`

Klabnik, Steve; Nichols, Carol, *The Rust Programming Language*, 2.ª ed., No Starch Press, 2023, ISBN 9781718503106

- Localizador: <https://openlibrary.org/isbn/9781718503106>
- Temas: rust, lenguaje, propiedad
- Citada en: [`atlas/fichas/axum.md`](../atlas/fichas/axum.md), [`atlas/fichas/rocket.md`](../atlas/fichas/rocket.md)

### `kleppmann-ddia`

Kleppmann, Martin, *Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems*, O'Reilly Media, 2017, ISBN 9781449373320

- Localizador: <https://openlibrary.org/isbn/9781449373320>
- Temas: persistencia, consistencia, datos
- Citada en: [`curriculum/06-persistencia-y-dominio.md`](../curriculum/06-persistencia-y-dominio.md), [`curriculum/09-movil-escritorio-y-offline.md`](../curriculum/09-movil-escritorio-y-offline.md)

### `lockhart-modern-php`

Lockhart, Josh, *Modern PHP: New Features and Good Practices*, O'Reilly Media, 2015, ISBN 9781491905180

- Localizador: <https://openlibrary.org/isbn/9781491905180>
- Temas: php, estándares, interoperabilidad
- Citada en: [`atlas/fichas/codeigniter.md`](../atlas/fichas/codeigniter.md), [`atlas/fichas/laravel.md`](../atlas/fichas/laravel.md), [`atlas/fichas/slim.md`](../atlas/fichas/slim.md)

### `lubanovic-fastapi`

Lubanovic, Bill, *FastAPI: Modern Python Web Development*, O'Reilly Media, 2023, ISBN 9781098135508

- Localizador: <https://openlibrary.org/isbn/9781098135508>
- Temas: fastapi, python, api
- Citada en: [`atlas/fichas/fastapi.md`](../atlas/fichas/fastapi.md), [`atlas/fichas/litestar.md`](../atlas/fichas/litestar.md), [`atlas/fichas/starlette.md`](../atlas/fichas/starlette.md)

### `macdonald-wordpress`

MacDonald, Matthew, *WordPress: The Missing Manual*, O'Reilly Media, 2014, ISBN 9781449341879

- Localizador: <https://openlibrary.org/isbn/9781449341879>
- Temas: wordpress, cms, contenido
- Citada en: [`atlas/fichas/wordpress.md`](../atlas/fichas/wordpress.md)

### `macrae-vue-up-and-running`

Macrae, Callum, *Vue.js: Up and Running: Building Accessible and Performant Web Apps*, O'Reilly Media, 2018, ISBN 9781491997246

- Localizador: <https://openlibrary.org/isbn/9781491997246>
- Temas: vue, frontend, accesibilidad
- Citada en: [`atlas/fichas/nuxt.md`](../atlas/fichas/nuxt.md), [`atlas/fichas/vue.md`](../atlas/fichas/vue.md)

### `majors-observability`

Majors, Charity; Fong-Jones, Liz; Miranda, George, *Observability Engineering: Achieving Production Excellence*, O'Reilly Media, 2022, ISBN 9781492076445

- Localizador: <https://openlibrary.org/isbn/9781492076445>
- Temas: observabilidad, telemetría, diagnóstico
- Citada en: [`curriculum/08-calidad-rendimiento-y-operacion.md`](../curriculum/08-calidad-rendimiento-y-operacion.md)

### `martin-clean-architecture`

Martin, Robert C., *Clean Architecture: A Craftsman's Guide to Software Structure and Design*, Pearson, 2017, ISBN 9780134494166

- Localizador: <https://openlibrary.org/isbn/9780134494166>
- Temas: arquitectura, límites, dependencias
- Citada en: [`atlas/fichas/compose-multiplatform.md`](../atlas/fichas/compose-multiplatform.md), [`atlas/fichas/swiftui.md`](../atlas/fichas/swiftui.md), [`curriculum/00-taxonomia-y-diagnostico.md`](../curriculum/00-taxonomia-y-diagnostico.md), [`curriculum/02-arquitectura-de-frameworks.md`](../curriculum/02-arquitectura-de-frameworks.md)

### `martin-clean-code`

Martin, Robert C., *Clean Code: A Handbook of Agile Software Craftsmanship*, Prentice Hall, 2008, ISBN 9780132350884

- Localizador: <https://openlibrary.org/isbn/9780132350884>
- Temas: diseño, legibilidad, oficio
- Citada en: [`atlas/fichas/nestjs.md`](../atlas/fichas/nestjs.md)

### `mccord-tate-programming-phoenix`

McCord, Chris; Tate, Bruce; Valim, José, *Programming Phoenix*, Pragmatic Bookshelf, 2016, ISBN 9781680501452

- Localizador: <https://openlibrary.org/isbn/9781680501452>
- Temas: phoenix, elixir, tiempo real
- Citada en: [`atlas/fichas/phoenix-liveview.md`](../atlas/fichas/phoenix-liveview.md), [`atlas/fichas/phoenix.md`](../atlas/fichas/phoenix.md)

### `meszaros-xunit`

Meszaros, Gerard, *xUnit Test Patterns: Refactoring Test Code*, Addison-Wesley Professional, 2007, ISBN 9780131495050

- Localizador: <https://openlibrary.org/isbn/9780131495050>
- Temas: pruebas, dobles, mantenimiento
- Citada en: [`curriculum/08-calidad-rendimiento-y-operacion.md`](../curriculum/08-calidad-rendimiento-y-operacion.md)

### `murphy-sre-workbook`

Murphy, Niall Richard; Rensin, David K.; Kawahara, Kent; Thorne, Stephen, *The Site Reliability Workbook: Practical Ways to Implement SRE*, O'Reilly Media, 2018, ISBN 9781492029502

- Localizador: <https://openlibrary.org/isbn/9781492029502>
- Temas: operación, SLO, práctica
- Citada en: [`atlas/fichas/dropwizard.md`](../atlas/fichas/dropwizard.md), [`atlas/fichas/kubernetes.md`](../atlas/fichas/kubernetes.md)

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
- Citada en: [`atlas/fichas/aiohttp.md`](../atlas/fichas/aiohttp.md), [`atlas/fichas/axum.md`](../atlas/fichas/axum.md), [`atlas/fichas/socketio.md`](../atlas/fichas/socketio.md), [`curriculum/08-calidad-rendimiento-y-operacion.md`](../curriculum/08-calidad-rendimiento-y-operacion.md), [`curriculum/10-modernizacion-y-migracion.md`](../curriculum/10-modernizacion-y-migracion.md), [`curriculum/12-producto-final.md`](../curriculum/12-producto-final.md)

### `osmani-js-design-patterns`

Osmani, Addy, *Learning JavaScript Design Patterns: A JavaScript and React Developer's Guide*, 2.ª ed., O'Reilly Media, 2023, ISBN 9781098139872

- Localizador: <https://openlibrary.org/isbn/9781098139872>
- Temas: frontend, patrones, javascript
- Citada en: [`atlas/fichas/mithril.md`](../atlas/fichas/mithril.md), [`curriculum/03-frontend-componentes-y-estado.md`](../curriculum/03-frontend-componentes-y-estado.md)

### `osmani-backbone`

Osmani, Addy, *Developing Backbone.js Applications*, O'Reilly Media, 2012, ISBN 9781449328252

- Localizador: <https://openlibrary.org/isbn/9781449328252>
- Temas: backbone, mvc, frontend
- Citada en: [`atlas/fichas/backbone.md`](../atlas/fichas/backbone.md), [`atlas/fichas/react.md`](../atlas/fichas/react.md)

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

### `porcello-graphql`

Porcello, Eve; Banks, Alex, *Learning GraphQL: Declarative Data Fetching for Modern Web Apps*, O'Reilly Media, 2018, ISBN 9781492030713

- Localizador: <https://openlibrary.org/isbn/9781492030713>
- Temas: graphql, datos, api
- Citada en: [`atlas/fichas/gatsby.md`](../atlas/fichas/gatsby.md), [`atlas/fichas/redwoodjs.md`](../atlas/fichas/redwoodjs.md)

### `potencier-symfony`

Potencier, Fabien, *Symfony 5: The Fast Track*, Symfony SAS, 2019, ISBN 9782918390374

- Localizador: <https://openlibrary.org/isbn/9782918390374>
- Temas: symfony, php, componentes
- Citada en: [`atlas/fichas/symfony.md`](../atlas/fichas/symfony.md)

### `poulton-docker`

Poulton, Nigel, *Docker Deep Dive*, Packt Publishing, 2020, ISBN 9781800565135

- Localizador: <https://openlibrary.org/isbn/9781800565135>
- Temas: contenedores, imágenes, despliegue
- Citada en: [`atlas/fichas/kubernetes.md`](../atlas/fichas/kubernetes.md), [`atlas/fichas/quarkus.md`](../atlas/fichas/quarkus.md)

### `powers-learning-node`

Powers, Shelley, *Learning Node*, O'Reilly Media, 2012, ISBN 9781449326166

- Localizador: <https://openlibrary.org/isbn/9781449326166>
- Temas: node, runtime, asincronía
- Citada en: [`atlas/fichas/nodejs.md`](../atlas/fichas/nodejs.md)

### `ramalho-fluent-python`

Ramalho, Luciano, *Fluent Python*, O'Reilly Media, 2021, ISBN 9781492056355

- Localizador: <https://openlibrary.org/isbn/9781492056355>
- Temas: python, lenguaje, idiomático
- Citada en: [`atlas/fichas/flask.md`](../atlas/fichas/flask.md), [`atlas/fichas/sanic.md`](../atlas/fichas/sanic.md), [`atlas/fichas/tornado.md`](../atlas/fichas/tornado.md)

### `richards-ford-fundamentals`

Richards, Mark; Ford, Neal, *Fundamentals of Software Architecture: An Engineering Approach*, O'Reilly Media, 2020, ISBN 9781492043454

- Localizador: <https://openlibrary.org/isbn/9781492043454>
- Temas: arquitectura, compromisos, estilos
- Citada en: [`curriculum/00-taxonomia-y-diagnostico.md`](../curriculum/00-taxonomia-y-diagnostico.md), [`curriculum/04-fullstack-y-renderizado.md`](../curriculum/04-fullstack-y-renderizado.md), [`curriculum/11-seleccion-y-sostenibilidad.md`](../curriculum/11-seleccion-y-sostenibilidad.md), [`curriculum/12-producto-final.md`](../curriculum/12-producto-final.md)

### `richardson-amundsen-restful`

Richardson, Leonard; Amundsen, Mike; Ruby, Sam, *RESTful Web APIs: Services for a Changing World*, O'Reilly Media, 2013, ISBN 9781449358068

- Localizador: <https://openlibrary.org/isbn/9781449358068>
- Temas: http, api, hipermedia
- Citada en: [`atlas/fichas/htmx.md`](../atlas/fichas/htmx.md), [`atlas/fichas/trpc.md`](../atlas/fichas/trpc.md), [`curriculum/01-http-eventos-y-contratos.md`](../curriculum/01-http-eventos-y-contratos.md), [`curriculum/05-backend-y-api.md`](../curriculum/05-backend-y-api.md)

### `riva-nextjs`

Riva, Michele, *Real-World Next.js*, Packt Publishing, 2022, ISBN 9781801073493

- Localizador: <https://openlibrary.org/isbn/9781801073493>
- Temas: nextjs, renderizado, react
- Citada en: [`atlas/fichas/nextjs.md`](../atlas/fichas/nextjs.md)

### `greenfeld-two-scoops-django`

Roy Greenfeld, Daniel; Roy Greenfeld, Audrey, *Two Scoops of Django: Best Practices for Django*, Two Scoops Press, 2013, ISBN 9781481879705

- Localizador: <https://openlibrary.org/isbn/9781481879705>
- Temas: django, buenas prácticas, estructura
- Citada en: [`atlas/fichas/django.md`](../atlas/fichas/django.md)

### `ruby-thomas-agile-rails`

Ruby, Sam; Thomas, Dave, *Agile Web Development with Rails 7*, Pragmatic Bookshelf, 2022, ISBN 9781680509298

- Localizador: <https://openlibrary.org/isbn/9781680509298>
- Temas: rails, convenciones, full stack
- Citada en: [`atlas/fichas/cakephp.md`](../atlas/fichas/cakephp.md), [`atlas/fichas/grails.md`](../atlas/fichas/grails.md), [`atlas/fichas/rails.md`](../atlas/fichas/rails.md)

### `seemann-deursen-di`

Seemann, Mark; van Deursen, Steven, *Dependency Injection Principles, Practices, and Patterns*, Manning Publications, 2019, ISBN 9781617294730

- Localizador: <https://openlibrary.org/isbn/9781617294730>
- Temas: inversión de control, inyección, ciclo de vida
- Citada en: [`atlas/fichas/micronaut.md`](../atlas/fichas/micronaut.md), [`atlas/fichas/spring-boot.md`](../atlas/fichas/spring-boot.md), [`curriculum/02-arquitectura-de-frameworks.md`](../curriculum/02-arquitectura-de-frameworks.md)

### `shaughnessy-ruby-microscope`

Shaughnessy, Pat, *Ruby Under a Microscope*, No Starch Press, 2014, ISBN 9781593275273

- Localizador: <https://openlibrary.org/isbn/9781593275273>
- Temas: ruby, runtime, metaprogramación
- Citada en: [`atlas/fichas/activerecord.md`](../atlas/fichas/activerecord.md), [`atlas/fichas/sinatra.md`](../atlas/fichas/sinatra.md)

### `shostack-threat-modeling`

Shostack, Adam, *Threat Modeling: Designing for Security*, Wiley, 2014, ISBN 9781118809990

- Localizador: <https://openlibrary.org/isbn/9781118809990>
- Temas: seguridad, amenazas, diseño
- Citada en: [`curriculum/07-identidad-y-seguridad.md`](../curriculum/07-identidad-y-seguridad.md)

### `silver-form-design-patterns`

Silver, Adam, *Form Design Patterns*, Smashing Media, 2018, ISBN 9783945749739

- Localizador: <https://openlibrary.org/isbn/9783945749739>
- Temas: formularios, accesibilidad, interfaz
- Citada en: [`atlas/fichas/alpinejs.md`](../atlas/fichas/alpinejs.md)

### `skelton-team-topologies`

Skelton, Matthew; Pais, Manuel, *Team Topologies: Organizing Business and Technology Teams for Fast Flow*, IT Revolution Press, 2019, ISBN 9781942788812

- Localizador: <https://openlibrary.org/isbn/9781942788812>
- Temas: equipos, arquitectura, conway
- Citada en: [`atlas/fichas/kubernetes.md`](../atlas/fichas/kubernetes.md), [`atlas/fichas/nextjs.md`](../atlas/fichas/nextjs.md)

### `stauffer-laravel`

Stauffer, Matt, *Laravel: Up & Running: A Framework for Building Modern PHP Apps*, 2.ª ed., O'Reilly Media, 2019, ISBN 9781492041214

- Localizador: <https://openlibrary.org/isbn/9781492041214>
- Temas: laravel, php, full stack
- Citada en: [`atlas/fichas/eloquent.md`](../atlas/fichas/eloquent.md), [`atlas/fichas/laravel.md`](../atlas/fichas/laravel.md)

### `sweller-cognitive-load-theory`

Sweller, John; Ayres, Paul; Kalyuga, Slava, *Cognitive Load Theory*, Springer, 2011, ISBN 9781441981257

- Localizador: <https://openlibrary.org/isbn/9781441981257>
- Temas: pedagogía, carga cognitiva, ejemplos resueltos
- Citada en: [`atlas/fichas/stimulus.md`](../atlas/fichas/stimulus.md), [`docs/LEARNING-MODEL.md`](../docs/LEARNING-MODEL.md)

### `thomas-programming-elixir`

Thomas, Dave, *Programming Elixir*, Pragmatic Bookshelf, 2014, ISBN 9781937785581

- Localizador: <https://openlibrary.org/isbn/9781937785581>
- Temas: elixir, concurrencia, beam
- Citada en: [`atlas/fichas/phoenix-liveview.md`](../atlas/fichas/phoenix-liveview.md), [`atlas/fichas/phoenix.md`](../atlas/fichas/phoenix.md)

### `tidwell-designing-interfaces`

Tidwell, Jenifer, *Designing Interfaces: Patterns for Effective Interaction Design*, O'Reilly Media, 2005, ISBN 9780596008031

- Localizador: <https://openlibrary.org/isbn/9780596008031>
- Temas: interfaz, patrones, interacción
- Citada en: [`atlas/fichas/redwoodjs.md`](../atlas/fichas/redwoodjs.md), [`atlas/fichas/wpf.md`](../atlas/fichas/wpf.md)

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

### `volkmann-svelte`

Volkmann, Mark, *Svelte and Sapper in Action*, Manning Publications, 2020, ISBN 9781617297946

- Localizador: <https://openlibrary.org/isbn/9781617297946>
- Temas: svelte, compilación, frontend
- Citada en: [`atlas/fichas/svelte.md`](../atlas/fichas/svelte.md), [`atlas/fichas/sveltekit.md`](../atlas/fichas/sveltekit.md)

### `wagner-web-performance`

Wagner, Jeremy, *Web Performance in Action: Building Fast Web Pages*, Manning Publications, 2016, ISBN 9781638353768

- Localizador: <https://openlibrary.org/isbn/9781638353768>
- Temas: rendimiento, construcción, red
- Citada en: [`atlas/fichas/esbuild.md`](../atlas/fichas/esbuild.md), [`atlas/fichas/hugo.md`](../atlas/fichas/hugo.md), [`atlas/fichas/vite.md`](../atlas/fichas/vite.md), [`atlas/fichas/webpack.md`](../atlas/fichas/webpack.md)

### `walls-spring-in-action`

Walls, Craig, *Spring in Action*, 6.ª ed., Manning Publications, 2022, ISBN 9781617297571

- Localizador: <https://openlibrary.org/isbn/9781617297571>
- Temas: spring, inyección, jvm
- Citada en: [`atlas/fichas/quarkus.md`](../atlas/fichas/quarkus.md), [`atlas/fichas/spring-boot.md`](../atlas/fichas/spring-boot.md), [`atlas/fichas/spring-framework.md`](../atlas/fichas/spring-framework.md)

### `wiggins-mctighe-ubd`

Wiggins, Grant; McTighe, Jay, *Understanding by Design*, 2.ª ampliada ed., Association for Supervision and Curriculum Development, 2005, ISBN 9781416600350

- Localizador: <https://openlibrary.org/isbn/9781416600350>
- Temas: pedagogía, diseño inverso, evidencia de aprendizaje
- Citada en: [`curriculum/12-producto-final.md`](../curriculum/12-producto-final.md), [`docs/LEARNING-MODEL.md`](../docs/LEARNING-MODEL.md)

### `wilken-angular-in-action`

Wilken, Jeremy, *Angular in Action*, Manning Publications, 2018, ISBN 9781617293313

- Localizador: <https://openlibrary.org/isbn/9781617293313>
- Temas: angular, typescript, frontend
- Citada en: [`atlas/fichas/angular.md`](../atlas/fichas/angular.md), [`atlas/fichas/aurelia.md`](../atlas/fichas/aurelia.md)

### `williams-wordpress-plugins`

Williams, Brad; Richard, Ozh; Tadlock, Justin, *Professional WordPress Plugin Development*, Wiley, 2011, ISBN 9780470916223

- Localizador: <https://openlibrary.org/isbn/9780470916223>
- Temas: wordpress, extensión, licencias
- Citada en: [`atlas/fichas/wordpress.md`](../atlas/fichas/wordpress.md)

### `windmill-flutter`

Windmill, Eric, *Flutter in Action*, Manning Publications, 2019, ISBN 9781617296147

- Localizador: <https://openlibrary.org/isbn/9781617296147>
- Temas: flutter, dart, móvil
- Citada en: [`atlas/fichas/flutter.md`](../atlas/fichas/flutter.md), [`atlas/fichas/kivy.md`](../atlas/fichas/kivy.md)

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
- Citada en: [`atlas/fichas/dojo.md`](../atlas/fichas/dojo.md), [`atlas/fichas/jquery.md`](../atlas/fichas/jquery.md), [`atlas/fichas/prototype-js.md`](../atlas/fichas/prototype-js.md), [`atlas/fichas/rollup.md`](../atlas/fichas/rollup.md), [`atlas/fichas/typeorm.md`](../atlas/fichas/typeorm.md)

### `iana-port-numbers`

*Service Name and Transport Protocol Port Number Registry*, IANA

- Localizador: <https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml>
- Temas: red, entorno, http
- Citada en: 

### `rfc9110`

*RFC 9110 — HTTP Semantics*, IETF, 2022

- Localizador: <https://www.rfc-editor.org/rfc/rfc9110>
- Temas: http, métodos, códigos
- Citada en: [`curriculum/01-http-eventos-y-contratos.md`](../curriculum/01-http-eventos-y-contratos.md)

### `rfc9111`

*RFC 9111 — HTTP Caching*, IETF, 2022

- Localizador: <https://www.rfc-editor.org/rfc/rfc9111>
- Temas: http, caché, rendimiento
- Citada en: [`atlas/fichas/remix.md`](../atlas/fichas/remix.md), [`curriculum/01-http-eventos-y-contratos.md`](../curriculum/01-http-eventos-y-contratos.md), [`curriculum/04-fullstack-y-renderizado.md`](../curriculum/04-fullstack-y-renderizado.md)

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
- Citada en: [`atlas/fichas/fastify.md`](../atlas/fichas/fastify.md), [`curriculum/05-backend-y-api.md`](../curriculum/05-backend-y-api.md)

### `nist-800-63b`

*SP 800-63B — Digital Identity Guidelines: Authentication and Lifecycle Management*, NIST

- Localizador: <https://pages.nist.gov/800-63-3/sp800-63b.html>
- Temas: identidad, contraseñas, autenticación
- Citada en: [`curriculum/07-identidad-y-seguridad.md`](../curriculum/07-identidad-y-seguridad.md)

### `nist-ssdf`

*SP 800-218 — Secure Software Development Framework (SSDF)*, NIST, 2022

- Localizador: <https://csrc.nist.gov/pubs/sp/800/218/final>
- Temas: cadena de suministro, proceso seguro
- Citada en: [`atlas/fichas/deno.md`](../atlas/fichas/deno.md), [`curriculum/11-seleccion-y-sostenibilidad.md`](../curriculum/11-seleccion-y-sostenibilidad.md)

### `openapi-spec`

*OpenAPI Specification*, OpenAPI Initiative

- Localizador: <https://spec.openapis.org/oas/latest.html>
- Temas: contrato, api, documentación
- Citada en: [`atlas/fichas/elysia.md`](../atlas/fichas/elysia.md), [`atlas/fichas/trpc.md`](../atlas/fichas/trpc.md), [`curriculum/01-http-eventos-y-contratos.md`](../curriculum/01-http-eventos-y-contratos.md), [`curriculum/05-backend-y-api.md`](../curriculum/05-backend-y-api.md)

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
- Citada en: [`atlas/fichas/codeigniter.md`](../atlas/fichas/codeigniter.md), [`atlas/fichas/laminas.md`](../atlas/fichas/laminas.md), [`atlas/fichas/laravel.md`](../atlas/fichas/laravel.md), [`atlas/fichas/slim.md`](../atlas/fichas/slim.md)

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
- Citada en: [`atlas/ecosistemas/rust.md`](../atlas/ecosistemas/rust.md), [`atlas/fichas/blazor.md`](../atlas/fichas/blazor.md), [`atlas/fichas/yew.md`](../atlas/fichas/yew.md)

### `whatwg-fetch`

*Fetch Standard*, WHATWG

- Localizador: <https://fetch.spec.whatwg.org/>
- Temas: frontend, http, CORS
- Citada en: [`atlas/fichas/hono.md`](../atlas/fichas/hono.md), [`curriculum/01-http-eventos-y-contratos.md`](../curriculum/01-http-eventos-y-contratos.md)

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

### `alpine-state`

*Alpine State*, Alpine.js

- Localizador: <https://alpinejs.dev/essentials/state>
- Temas: alpine, estado, atributos
- Citada en: [`atlas/fichas/alpinejs.md`](../atlas/fichas/alpinejs.md)

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

### `astro-docs`

*Astro — Documentación oficial*, Astro

- Localizador: <https://docs.astro.build/>
- Temas: astro, renderizado, islas
- Citada en: 

### `backbone-why`

*Why Backbone?*, Backbone.js

- Localizador: <https://backbonejs.org/#FAQ-why-backbone>
- Temas: backbone, mvc, estado
- Citada en: [`atlas/fichas/backbone.md`](../atlas/fichas/backbone.md)

### `bun-nodejs-apis`

*Node.js API compatibility*, Bun

- Localizador: <https://bun.com/docs/runtime/nodejs-apis>
- Temas: bun, compatibilidad, runtime
- Citada en: [`atlas/fichas/bun.md`](../atlas/fichas/bun.md), [`atlas/fichas/nodejs.md`](../atlas/fichas/nodejs.md)

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

### `composer-download`

*Composer — Download*, Composer

- Localizador: <https://getcomposer.org/download/>
- Temas: entorno, php, dependencias
- Citada en: 

### `deno-v1`

*Deno 1.0*, Deno

- Localizador: <https://deno.com/blog/v1>
- Temas: deno, runtime, permisos
- Citada en: [`atlas/fichas/deno.md`](../atlas/fichas/deno.md), [`atlas/fichas/nodejs.md`](../atlas/fichas/nodejs.md)

### `django-releases`

*Django Release Notes*, Django Software Foundation

- Localizador: <https://docs.djangoproject.com/en/stable/releases/>
- Temas: versiones, soporte, django
- Citada en: [`atlas/fichas/django.md`](../atlas/fichas/django.md)

### `adoptium-temurin`

*Eclipse Temurin Releases*, Eclipse Foundation

- Localizador: <https://adoptium.net/temurin/releases/>
- Temas: entorno, jvm, herramientas
- Citada en: 

### `ember-rfcs`

*Ember RFCs*, Ember.js

- Localizador: <https://rfcs.emberjs.com/>
- Temas: gobierno, proceso, cambios
- Citada en: [`atlas/fichas/angularjs.md`](../atlas/fichas/angularjs.md), [`atlas/fichas/ember.md`](../atlas/fichas/ember.md)

### `ember-octane`

*Ember Octane*, Ember.js

- Localizador: <https://emberjs.com/editions/octane/>
- Temas: ember, migración, ediciones
- Citada en: [`atlas/fichas/ember.md`](../atlas/fichas/ember.md)

### `endoflife-date`

*endoflife.date — Release and support calendars*, endoflife.date

- Localizador: <https://endoflife.date/>
- Temas: soporte, versiones, ciclo de vida
- Citada en: [`atlas/fichas/angularjs.md`](../atlas/fichas/angularjs.md), [`atlas/fichas/sails.md`](../atlas/fichas/sails.md), [`atlas/fichas/xamarin.md`](../atlas/fichas/xamarin.md)

### `fastapi-features`

*FastAPI Features*, FastAPI

- Localizador: <https://fastapi.tiangolo.com/features/>
- Temas: fastapi, tipos, openapi
- Citada en: [`atlas/fichas/fastapi.md`](../atlas/fichas/fastapi.md)

### `fielding-rest-dissertation`

Fielding, Roy T., *Architectural Styles and the Design of Network-based Software Architectures*, University of California, Irvine, 2000

- Localizador: <https://ics.uci.edu/~fielding/pubs/dissertation/top.htm>
- Temas: rest, hipermedia, arquitectura
- Citada en: [`atlas/fichas/htmx.md`](../atlas/fichas/htmx.md)

### `fowler-injection`

Fowler, Martin, *Inversion of Control Containers and the Dependency Injection pattern*, martinfowler.com, 2004

- Localizador: <https://martinfowler.com/articles/injection.html>
- Temas: inversión de control, inyección
- Citada en: [`atlas/ecosistemas/jvm.md`](../atlas/ecosistemas/jvm.md), [`atlas/fichas/spring-boot.md`](../atlas/fichas/spring-boot.md), [`atlas/fichas/spring-framework.md`](../atlas/fichas/spring-framework.md), [`curriculum/02-arquitectura-de-frameworks.md`](../curriculum/02-arquitectura-de-frameworks.md)

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
- Citada en: [`atlas/fichas/dapper.md`](../atlas/fichas/dapper.md), [`curriculum/06-persistencia-y-dominio.md`](../curriculum/06-persistencia-y-dominio.md)

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
- Citada en: [`atlas/fichas/docusaurus.md`](../atlas/fichas/docusaurus.md), [`curriculum/08-calidad-rendimiento-y-operacion.md`](../curriculum/08-calidad-rendimiento-y-operacion.md)

### `go-downloads`

*Download and install Go*, Google

- Localizador: <https://go.dev/doc/install>
- Temas: entorno, go, herramientas
- Citada en: 

### `angular-signals`

*Angular Signals*, Google — Angular

- Localizador: <https://angular.dev/guide/signals>
- Temas: angular, señales, reactividad
- Citada en: [`atlas/fichas/analog.md`](../atlas/fichas/analog.md), [`atlas/fichas/angular.md`](../atlas/fichas/angular.md), [`atlas/fichas/knockout.md`](../atlas/fichas/knockout.md)

### `angularjs-eol`

*AngularJS Version Support Status*, Google — AngularJS

- Localizador: <https://docs.angularjs.org/misc/version-support-status>
- Temas: fin de soporte, migración, ciclo de vida
- Citada en: [`atlas/fichas/angularjs.md`](../atlas/fichas/angularjs.md)

### `flutter-architecture`

*Flutter Architectural Overview*, Google — Flutter

- Localizador: <https://docs.flutter.dev/resources/architectural-overview>
- Temas: flutter, motor gráfico, widgets
- Citada en: [`atlas/fichas/flutter.md`](../atlas/fichas/flutter.md)

### `webdev-rendering`

*Rendering on the Web*, Google — web.dev

- Localizador: <https://web.dev/articles/rendering-on-the-web>
- Temas: renderizado, csr, ssr, ssg
- Citada en: [`curriculum/04-fullstack-y-renderizado.md`](../curriculum/04-fullstack-y-renderizado.md)

### `webdev-vitals`

*Web Vitals*, Google — web.dev

- Localizador: <https://web.dev/articles/vitals>
- Temas: rendimiento, métricas de usuario
- Citada en: [`atlas/fichas/vitepress.md`](../atlas/fichas/vitepress.md), [`curriculum/04-fullstack-y-renderizado.md`](../curriculum/04-fullstack-y-renderizado.md), [`curriculum/08-calidad-rendimiento-y-operacion.md`](../curriculum/08-calidad-rendimiento-y-operacion.md)

### `webdev-offline-cookbook`

*The Offline Cookbook*, Google — web.dev

- Localizador: <https://web.dev/articles/offline-cookbook>
- Temas: offline, estrategias de caché
- Citada en: [`curriculum/09-movil-escritorio-y-offline.md`](../curriculum/09-movil-escritorio-y-offline.md)

### `web-baseline`

*Baseline*, Google — web.dev

- Localizador: <https://web.dev/baseline>
- Temas: compatibilidad, navegador, adopción
- Citada en: [`atlas/fichas/tauri.md`](../atlas/fichas/tauri.md)

### `dora-research`

*DORA Research Program*, Google Cloud — DORA

- Localizador: <https://dora.dev/research/>
- Temas: métricas, entrega, evidencia
- Citada en: [`curriculum/08-calidad-rendimiento-y-operacion.md`](../curriculum/08-calidad-rendimiento-y-operacion.md)

### `graphql-spec`

*GraphQL Specification*, GraphQL Foundation

- Localizador: <https://spec.graphql.org/>
- Temas: graphql, contrato, datos
- Citada en: [`atlas/fichas/gatsby.md`](../atlas/fichas/gatsby.md)

### `htmx-essays`

Gross, Carson, *htmx Essays*, htmx

- Localizador: <https://htmx.org/essays/>
- Temas: hipermedia, htmx, arquitectura
- Citada en: [`atlas/fichas/htmx.md`](../atlas/fichas/htmx.md)

### `rails-doctrine`

Hansson, David Heinemeier, *The Rails Doctrine*, Ruby on Rails

- Localizador: <https://rubyonrails.org/doctrine>
- Temas: rails, convenciones, filosofía
- Citada en: [`atlas/fichas/hotwire-turbo.md`](../atlas/fichas/hotwire-turbo.md), [`atlas/fichas/rails.md`](../atlas/fichas/rails.md)

### `svelte-vdom-essay`

Harris, Rich, *Virtual DOM is pure overhead*, Svelte, 2018

- Localizador: <https://svelte.dev/blog/virtual-dom-is-pure-overhead>
- Temas: svelte, árbol virtual, compilación
- Citada en: [`atlas/fichas/react.md`](../atlas/fichas/react.md), [`atlas/fichas/svelte.md`](../atlas/fichas/svelte.md)

### `twelve-factor`

*The Twelve-Factor App*, Heroku

- Localizador: <https://12factor.net/>
- Temas: configuración, despliegue, paridad de entornos
- Citada en: [`atlas/ecosistemas/cloud.md`](../atlas/ecosistemas/cloud.md), [`atlas/fichas/nitro.md`](../atlas/fichas/nitro.md), [`atlas/fichas/play-framework.md`](../atlas/fichas/play-framework.md), [`curriculum/09-movil-escritorio-y-offline.md`](../curriculum/09-movil-escritorio-y-offline.md), [`curriculum/12-producto-final.md`](../curriculum/12-producto-final.md)

### `hotwire-turbo-handbook`

*Turbo Handbook*, Hotwired

- Localizador: <https://turbo.hotwired.dev/handbook/introduction>
- Temas: hipermedia, turbo, html
- Citada en: 

### `htmx-docs`

*htmx — Documentación oficial*, htmx

- Localizador: <https://htmx.org/docs/>
- Temas: hipermedia, htmx, html
- Citada en: 

### `web-almanac`

*Web Almanac*, HTTP Archive

- Localizador: <https://almanac.httparchive.org/>
- Temas: datos, adopción, web
- Citada en: [`atlas/fichas/jquery.md`](../atlas/fichas/jquery.md)

### `jamstack`

*Jamstack*, Jamstack

- Localizador: <https://jamstack.org/>
- Temas: estático, despliegue, arquitectura
- Citada en: [`atlas/fichas/eleventy.md`](../atlas/fichas/eleventy.md), [`atlas/fichas/gatsby.md`](../atlas/fichas/gatsby.md), [`atlas/fichas/jekyll.md`](../atlas/fichas/jekyll.md), [`atlas/fichas/nextjs.md`](../atlas/fichas/nextjs.md)

### `inkandswitch-local-first`

Kleppmann, Martin; Wiggins, Adam; van Hardenberg, Peter; McGranaghan, Mark, *Local-first software: You own your data, in spite of the cloud*, Ink & Switch, 2019

- Localizador: <https://www.inkandswitch.com/local-first/>
- Temas: offline, sincronización, propiedad de datos
- Citada en: [`curriculum/09-movil-escritorio-y-offline.md`](../curriculum/09-movil-escritorio-y-offline.md)

### `knockout-observables`

*Observables*, Knockout

- Localizador: <https://knockoutjs.com/documentation/observables.html>
- Temas: knockout, observables, señales
- Citada en: [`atlas/fichas/knockout.md`](../atlas/fichas/knockout.md)

### `laravel-releases`

*Laravel Release Notes and Support Policy*, Laravel

- Localizador: <https://laravel.com/docs/releases>
- Temas: versiones, soporte, laravel
- Citada en: [`atlas/fichas/laravel.md`](../atlas/fichas/laravel.md)

### `spdx-licenses`

*SPDX License List*, Linux Foundation

- Localizador: <https://spdx.org/licenses/>
- Temas: licencias, cumplimiento
- Citada en: [`atlas/fichas/extjs.md`](../atlas/fichas/extjs.md), [`atlas/fichas/gtk.md`](../atlas/fichas/gtk.md), [`atlas/fichas/pyramid.md`](../atlas/fichas/pyramid.md), [`atlas/fichas/qt.md`](../atlas/fichas/qt.md), [`curriculum/00-taxonomia-y-diagnostico.md`](../curriculum/00-taxonomia-y-diagnostico.md), [`curriculum/11-seleccion-y-sostenibilidad.md`](../curriculum/11-seleccion-y-sostenibilidad.md)

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

### `react-native-architecture`

*React Native Architecture Overview*, Meta — React Native

- Localizador: <https://reactnative.dev/architecture/overview>
- Temas: react native, puente, móvil
- Citada en: [`atlas/fichas/nativescript.md`](../atlas/fichas/nativescript.md), [`atlas/fichas/react-native.md`](../atlas/fichas/react-native.md)

### `micro-frontends-org`

*Micro Frontends*, micro-frontends.org

- Localizador: <https://micro-frontends.org/>
- Temas: frontend, integración, equipos
- Citada en: [`atlas/fichas/nextjs.md`](../atlas/fichas/nextjs.md)

### `blazor-webforms`

*Blazor for ASP.NET Web Forms Developers*, Microsoft

- Localizador: <https://learn.microsoft.com/dotnet/architecture/blazor-for-web-forms-developers/>
- Temas: migración, web forms, blazor
- Citada en: [`atlas/fichas/aspnet-webforms.md`](../atlas/fichas/aspnet-webforms.md), [`atlas/fichas/blazor.md`](../atlas/fichas/blazor.md)

### `dotnet-sdk-downloads`

*Download .NET*, Microsoft

- Localizador: <https://dotnet.microsoft.com/download>
- Temas: entorno, dotnet, herramientas
- Citada en: 

### `jasonformat-islands`

Miller, Jason, *Islands Architecture*, jasonformat.com, 2020

- Localizador: <https://jasonformat.com/islands-architecture/>
- Temas: islas, hidratación, rendimiento
- Citada en: [`atlas/fichas/astro.md`](../atlas/fichas/astro.md), [`atlas/fichas/marko.md`](../atlas/fichas/marko.md)

### `mdn-web-docs`

*MDN Web Docs*, Mozilla

- Localizador: <https://developer.mozilla.org/en-US/docs/Web>
- Temas: frontend, referencia, navegador
- Citada en: [`curriculum/01-http-eventos-y-contratos.md`](../curriculum/01-http-eventos-y-contratos.md), [`curriculum/03-frontend-componentes-y-estado.md`](../curriculum/03-frontend-componentes-y-estado.md), [`curriculum/04-fullstack-y-renderizado.md`](../curriculum/04-fullstack-y-renderizado.md), [`curriculum/09-movil-escritorio-y-offline.md`](../curriculum/09-movil-escritorio-y-offline.md)

### `mdn-progressive-enhancement`

*Progressive Enhancement*, Mozilla

- Localizador: <https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement>
- Temas: accesibilidad, robustez, frontend
- Citada en: [`atlas/fichas/alpinejs.md`](../atlas/fichas/alpinejs.md), [`atlas/fichas/remix.md`](../atlas/fichas/remix.md), [`atlas/fichas/sveltekit.md`](../atlas/fichas/sveltekit.md)

### `mdn-web-components`

*Web Components*, Mozilla

- Localizador: <https://developer.mozilla.org/en-US/docs/Web/API/Web_components>
- Temas: componentes web, estándar, navegador
- Citada en: [`atlas/fichas/lit.md`](../atlas/fichas/lit.md)

### `cve-2017-5638`

*CVE-2017-5638 — Apache Struts remote code execution*, NIST — National Vulnerability Database, 2017

- Localizador: <https://nvd.nist.gov/vuln/detail/CVE-2017-5638>
- Temas: vulnerabilidad, struts, cadena de suministro
- Citada en: [`atlas/fichas/struts.md`](../atlas/fichas/struts.md)

### `nuxt-docs`

*Nuxt — Documentación oficial*, Nuxt

- Localizador: <https://nuxt.com/docs>
- Temas: nuxt, carga de datos, renderizado
- Citada en: 

### `osi-licenses`

*OSI Approved Licenses*, Open Source Initiative

- Localizador: <https://opensource.org/licenses>
- Temas: licencias, gobierno
- Citada en: [`atlas/fichas/pyramid.md`](../atlas/fichas/pyramid.md), [`atlas/fichas/qt.md`](../atlas/fichas/qt.md), [`curriculum/00-taxonomia-y-diagnostico.md`](../curriculum/00-taxonomia-y-diagnostico.md), [`curriculum/11-seleccion-y-sostenibilidad.md`](../curriculum/11-seleccion-y-sostenibilidad.md)

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

### `nodejs-downloads`

*Download Node.js*, OpenJS Foundation

- Localizador: <https://nodejs.org/en/download>
- Temas: entorno, javascript, herramientas
- Citada en: 

### `electron-security`

*Electron Security*, OpenJS Foundation — Electron

- Localizador: <https://www.electronjs.org/docs/latest/tutorial/security>
- Temas: electron, seguridad, escritorio
- Citada en: [`atlas/fichas/electron.md`](../atlas/fichas/electron.md)

### `nodejs-esm`

*Node.js ECMAScript Modules*, OpenJS Foundation — Node.js

- Localizador: <https://nodejs.org/api/esm.html>
- Temas: node, módulos, compatibilidad
- Citada en: [`atlas/fichas/nodejs.md`](../atlas/fichas/nodejs.md)

### `opentelemetry-docs`

*OpenTelemetry Documentation*, OpenTelemetry / CNCF

- Localizador: <https://opentelemetry.io/docs/>
- Temas: observabilidad, trazas, métricas
- Citada en: [`curriculum/08-calidad-rendimiento-y-operacion.md`](../curriculum/08-calidad-rendimiento-y-operacion.md)

### `flask-design`

*Design Decisions in Flask*, Pallets Projects — Flask

- Localizador: <https://flask.palletsprojects.com/en/stable/design/>
- Temas: flask, microframework, diseño
- Citada en: [`atlas/fichas/flask.md`](../atlas/fichas/flask.md)

### `patterns-dev`

*Patterns.dev — Modern Web App Design Patterns*, patterns.dev

- Localizador: <https://www.patterns.dev/>
- Temas: patrones, renderizado, frontend
- Citada en: [`atlas/fichas/astro.md`](../atlas/fichas/astro.md)

### `pnpm-installation`

*pnpm — Installation*, pnpm

- Localizador: <https://pnpm.io/installation>
- Temas: entorno, javascript, dependencias
- Citada en: 

### `postgresql-docs`

*PostgreSQL Documentation*, PostgreSQL Global Development Group

- Localizador: <https://www.postgresql.org/docs/current/>
- Temas: persistencia, sql, transacciones
- Citada en: [`atlas/fichas/dapper.md`](../atlas/fichas/dapper.md), [`atlas/fichas/sqlalchemy.md`](../atlas/fichas/sqlalchemy.md), [`curriculum/06-persistencia-y-dominio.md`](../curriculum/06-persistencia-y-dominio.md)

### `preact-differences`

*Differences to React*, Preact

- Localizador: <https://preactjs.com/guide/v10/differences-to-react/>
- Temas: preact, tamaño, compatibilidad
- Citada en: [`atlas/fichas/preact.md`](../atlas/fichas/preact.md)

### `python-packaging`

*Python Packaging User Guide*, Python Packaging Authority

- Localizador: <https://packaging.python.org/>
- Temas: python, entorno, herramientas
- Citada en: 

### `python-downloads`

*Download Python*, Python Software Foundation

- Localizador: <https://www.python.org/downloads/>
- Temas: entorno, python, herramientas
- Citada en: 

### `qwik-resumability`

*Resumable*, Qwik

- Localizador: <https://qwik.dev/docs/concepts/resumable/>
- Temas: qwik, hidratación, reanudación
- Citada en: [`atlas/fichas/qwik.md`](../atlas/fichas/qwik.md)

### `remix-docs`

*Remix — Documentación oficial*, Remix

- Localizador: <https://remix.run/docs>
- Temas: remix, carga de datos, formularios
- Citada en: 

### `ruby-installation`

*Installing Ruby*, Ruby

- Localizador: <https://www.ruby-lang.org/en/documentation/installation/>
- Temas: entorno, ruby, herramientas
- Citada en: 

### `rust-install`

*Install Rust*, Rust Foundation

- Localizador: <https://www.rust-lang.org/tools/install>
- Temas: entorno, rust, herramientas
- Citada en: 

### `solid-reactivity`

*Intro to Reactivity*, SolidJS

- Localizador: <https://docs.solidjs.com/concepts/intro-to-reactivity>
- Temas: solid, señales, reactividad
- Citada en: [`atlas/fichas/knockout.md`](../atlas/fichas/knockout.md), [`atlas/fichas/solid.md`](../atlas/fichas/solid.md), [`atlas/fichas/solidstart.md`](../atlas/fichas/solidstart.md)

### `svelte-runes`

*Introducing runes*, Svelte

- Localizador: <https://svelte.dev/blog/runes>
- Temas: svelte, señales, reactividad
- Citada en: [`atlas/fichas/knockout.md`](../atlas/fichas/knockout.md), [`atlas/fichas/svelte.md`](../atlas/fichas/svelte.md)

### `sveltekit-docs`

*SvelteKit — Documentación oficial*, Svelte

- Localizador: <https://svelte.dev/docs/kit>
- Temas: sveltekit, carga de datos, enrutado
- Citada en: 

### `symfony-components`

*Symfony Components*, Symfony

- Localizador: <https://symfony.com/components>
- Temas: php, componentes, reutilización
- Citada en: [`atlas/fichas/drupal.md`](../atlas/fichas/drupal.md), [`atlas/fichas/laravel.md`](../atlas/fichas/laravel.md), [`atlas/fichas/symfony.md`](../atlas/fichas/symfony.md)

### `symfony-best-practices`

*Symfony Best Practices*, Symfony

- Localizador: <https://symfony.com/doc/current/best_practices.html>
- Temas: php, estructura, convenciones
- Citada en: [`atlas/fichas/symfony.md`](../atlas/fichas/symfony.md)

### `tauri-security`

*Tauri Security*, Tauri

- Localizador: <https://v2.tauri.app/security/>
- Temas: tauri, seguridad, escritorio
- Citada en: [`atlas/fichas/tauri.md`](../atlas/fichas/tauri.md)

### `nextjs-app-router`

*Next.js App Router*, Vercel — Next.js

- Localizador: <https://nextjs.org/docs/app>
- Temas: nextjs, renderizado, enrutado
- Citada en: [`atlas/fichas/nextjs.md`](../atlas/fichas/nextjs.md)

### `vite-why`

*Why Vite*, Vite

- Localizador: <https://vite.dev/guide/why>
- Temas: construcción, módulos, desarrollo
- Citada en: [`atlas/fichas/analog.md`](../atlas/fichas/analog.md), [`atlas/fichas/esbuild.md`](../atlas/fichas/esbuild.md), [`atlas/fichas/vite.md`](../atlas/fichas/vite.md)

### `vue-reactivity`

*Reactivity in Depth*, Vue

- Localizador: <https://vuejs.org/guide/extras/reactivity-in-depth.html>
- Temas: vue, reactividad, señales
- Citada en: [`atlas/fichas/vue.md`](../atlas/fichas/vue.md)

### `wcag-quickref`

*How to Meet WCAG (Quick Reference)*, W3C

- Localizador: <https://www.w3.org/WAI/WCAG22/quickref/>
- Temas: accesibilidad, criterios, verificación
- Citada en: [`atlas/fichas/alpinejs.md`](../atlas/fichas/alpinejs.md), [`atlas/fichas/avalonia.md`](../atlas/fichas/avalonia.md), [`atlas/fichas/dotnet-maui.md`](../atlas/fichas/dotnet-maui.md), [`atlas/fichas/ionic.md`](../atlas/fichas/ionic.md)

### `wordpress-license`

*WordPress License (GPL)*, WordPress

- Localizador: <https://wordpress.org/about/license/>
- Temas: licencia, copyleft, cms
- Citada en: [`atlas/fichas/drupal.md`](../atlas/fichas/drupal.md), [`atlas/fichas/wordpress.md`](../atlas/fichas/wordpress.md)
