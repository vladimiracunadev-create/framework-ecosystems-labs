# 💎 Ruby

> [⬅️ Atlas](../README.md) · [🗂️ Índice](../frameworks.md) · [🧭 Taxonomía](../../docs/TAXONOMY.md)

**Cinco tecnologías, y una influencia desproporcionada.** Si el
[árbol genealógico del Atlas](../README.md) tuviera un nodo central, sería Rails.
Django, CakePHP, CodeIgniter, Grails, Sails, Laravel y AdonisJS citan sus
convenciones. La mayoría de quienes las usan hoy no ha escrito nunca una línea de
Ruby.

## Por qué este ecosistema es como es

| Condición del lenguaje | Consecuencia en sus frameworks |
| --- | --- |
| **Metaprogramación** muy potente en ejecución | Permite convenciones que parecen magia: un modelo deduce su tabla, sus columnas y sus relaciones |
| Sintaxis con **bloques** expresivos | Hizo posible el estilo «verbo, ruta, bloque» que copió medio mundo |
| **Tipado dinámico** sin comprobación previa | Velocidad inicial altísima; las pruebas dejan de ser opcionales |
| Comunidad centrada en la **experiencia de quien programa** | Las herramientas de generación y las migraciones nacieron como norma, no como añadido |

## Lo que Rails inventó y hoy damos por supuesto

| Idea | Dónde está hoy |
| --- | --- |
| **Convención sobre configuración** | Casi todos los frameworks completos del catálogo |
| **Migraciones de base de datos versionadas** | Django, Laravel, Entity Framework, Prisma, Flyway |
| **Andamiaje generado** desde el modelo | Laravel, Grails, AdonisJS, Yii |
| **Registro activo** como patrón dominante | Eloquent, Django ORM, TypeORM |
| **Pruebas incluidas** desde el primer día | Expectativa universal hoy; no lo era en 2004 |
| **El entorno de desarrollo es parte del producto** | Laravel, Phoenix, Next.js |

Y su descendiente más silencioso: **Sinatra**. Sesenta líneas de idea —un verbo,
una ruta, un bloque— que reaparecen en Flask, Express, Slim, Bottle y una docena
más. Un microframework generó más linaje que muchos frameworks completos.

## La otra herencia: Hotwire

Cuando el resto del campo se mudaba al navegador, el mundo Rails hizo lo
contrario: **Turbo** y **Stimulus** consiguen navegación instantánea y
actualizaciones parciales **sin escribir JavaScript de aplicación**, dejando el
estado en el servidor. Es la misma apuesta que htmx y que Phoenix LiveView, y la
que devolvió al debate la pregunta incómoda: ¿cuántas aplicaciones necesitaban de
verdad una aplicación de página única?

## Las 5 tecnologías

<!-- generado:tabla-ecosistema ruby -->
| Tecnología | Clasificación | Desde | Era | Estado | Licencia | Documentación |
| --- | --- | ---: | --- | --- | --- | --- |
| **Active Record (Rails)** | `orm` | 2004 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://guides.rubyonrails.org/active_record_basics.html) |
| **Jekyll** | `static-site-generator` | 2008 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://jekyllrb.com/docs/) |
| [**Ruby on Rails**](../fichas/rails.md) | `full-stack-framework` | 2004 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://guides.rubyonrails.org/) |
| [**Sinatra**](../fichas/sinatra.md) | `web-framework` | 2007 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://sinatrarb.com/documentation.html) |
| **Hanami** | `full-stack-framework` | 2014 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://guides.hanamirb.org/) |
<!-- fin -->

## Qué aportó cada una

<!-- generado:notas-ecosistema ruby -->
- **Active Record (Rails)** — La implementación que dio nombre popular al patrón de registro activo descrito por Fowler.
- **Jekyll** — El generador estático que popularizó el modelo, impulsado por su integración con GitHub Pages.
- **Ruby on Rails** — Origen de «convención sobre configuración» y de las migraciones de base de datos tal como se entienden hoy. Casi todos los frameworks completos posteriores citan su influencia.
- **Sinatra** — Definió el estilo minimalista de «verbo, ruta, bloque» que copiaron Flask, Express, Slim y muchos otros.
- **Hanami** — Alternativa a Rails con fronteras explícitas entre capas y menos magia implícita.
<!-- fin -->

## Para seguir

- [Módulo 02](../../curriculum/02-arquitectura-de-frameworks.md) — convención frente a configuración, y por qué lo implícito exige mejor diagnóstico.
