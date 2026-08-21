# Por qué sí y por qué no — Cuándo salir del ORM

> [⬅️ Clase 060](README.md) · [📚 Parte 4](../README.md)

| ORM | Por qué sí salir | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Prisma](../../../atlas/fichas/prisma.md) | Su lenguaje de consulta es el más limitado de los cuatro: agregaciones complejas no caben | `$queryRaw` devuelve objetos sin tipar contra el esquema | Perder la comprobación que da Prisma |
| [SQLAlchemy](../../../atlas/fichas/sqlalchemy.md) | Casi nunca hace falta: Core expresa ventanas, CTE y agregaciones | Y por eso mismo hay tres formas de escribir lo mismo | Decidir cuál usar |
| [Hibernate](../../../atlas/fichas/hibernate.md) | JPQL se queda corto en cuanto aparece una función del motor | Salir mezcla dos modelos de sesión y el seguimiento de cambios se confunde | Cuidado con las entidades |
| [Entity Framework Core](../../../atlas/fichas/entity-framework-core.md) | `SqlQuery<T>` devuelve un tipo declarado, sin perder el tipado | La frontera entre lo traducible y lo que no lo es cambia entre versiones | Revisar al actualizar |

## 🧭 La pregunta antes de salir

> **¿Qué consulta quiero que se ejecute?**

Si no sabes responderla, salir del ORM no va a ayudar: vas a escribir a mano la
misma consulta que se generaba sola, con más sitios donde equivocarte.

Y si sí sabes responderla —y la que se genera no es esa—, entonces el ORM ya no
te está dando nada que valga la pena defender.

## 🧭 Dónde poner el SQL

Un detalle práctico que decide si esto envejece bien: **el SQL crudo no debe estar
repartido por los controladores**.

Ponlo donde vive el acceso a datos —un repositorio, un módulo de consultas— por
tres razones concretas:

1. **Se encuentra.** El día que migres de motor, `grep` sobre una carpeta.
2. **Se prueba.** Una consulta aislada se puede ejecutar contra una base real sin
   levantar la aplicación.
3. **Se revisa.** Una pull request que toca `consultas/informes.sql` pide otra
   clase de atención que una que toca un controlador.

## 💡 Lo que hay que llevarse

Salir del ORM no es una derrota ni una promoción: es reconocer que **la
abstracción tenía un ámbito** y que esta consulta se sale de él.

Kleppmann lo plantea desde el otro lado: la razón de que existan los mapeadores
es que el modelo relacional y el de objetos no encajan del todo, y ninguna capa
resuelve ese desajuste por completo [@kleppmann-ddia]. La consecuencia práctica
es que **siempre habrá consultas que se salgan**, y que un ORM que no te deje
bajar te obliga a pelearte con él.

Los cuatro de esta clase te dejan bajar, en el mismo proyecto y con la misma
conexión. Es la mejor propiedad que tienen, y la que menos se menciona.

## Fuentes

- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
- [@gregg-systems-performance] Gregg, Brendan. *Systems Performance*, 2.ª ed. Addison-Wesley, 2020. ISBN 9780136820154 — <https://openlibrary.org/isbn/9780136820154>
