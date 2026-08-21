# Por qué sí y por qué no — Migraciones

> [⬅️ Clase 058](README.md) · [📚 Parte 4](../README.md)

| Herramienta | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| **Prisma Migrate** ([ficha](../../../atlas/fichas/prisma.md)) | Genera el SQL comparando el esquema con la base: no hay que escribirlo | Sin marcha atrás, y `migrate dev` puede rehacer la base entera | Dos comandos que hacen cosas muy distintas |
| **Alembic** ([SQLAlchemy](../../../atlas/fichas/sqlalchemy.md)) | Migraciones en Python: bucles, lotes, lógica de relleno | Un grafo de revisiones, con ramas y fusiones que hay que resolver | Entender el modelo antes de usarlo |
| **Flyway** ([Hibernate](../../../atlas/fichas/hibernate.md)) | SQL puro, sin capa de traducción; se lee tal cual se ejecuta | Sin marcha atrás en la edición libre, y hay que escribirlo todo | Portabilidad entre motores |
| **EF Core** ([ficha](../../../atlas/fichas/entity-framework-core.md)) | Genera y revierte, en C# revisable | Depende de una instantánea del modelo que se corrompe con facilidad | Cuidado al fusionar ramas |

## 🧭 SQL suelto frente a código

**SQL suelto** —Flyway, Prisma— se lee exactamente como se ejecuta. No hay
traducción, no hay sorpresas, y cualquiera que sepa SQL puede revisarlo en una
pull request. A cambio, cada motor tiene su dialecto y no hay lógica: rellenar
una tabla de diez millones de filas por lotes no se escribe cómodamente.

**Código** —Alembic, EF Core— permite exactamente eso: bucles, condiciones,
lotes, transformaciones. Y trae una capa de abstracción que hay que conocer,
además del SQL que acaba generando.

La recomendación práctica es sencilla: **SQL suelto salvo que necesites lógica**.
Y cuando la necesites, escribe la migración de datos aparte de la de esquema —
son dos cosas con riesgos distintos y con tiempos de ejecución distintos.

## 💡 Lo que hay que llevarse

Una migración no es un cambio en la base: es un **cambio desplegado**.

Y desplegar significa que, durante un rato, la versión vieja del código y la
nueva conviven contra el mismo esquema. De ahí sale la única regla que hay que
recordar cuando todo lo demás se olvide:

> **¿Funciona el código que ya está corriendo con este esquema nuevo?**

Si la respuesta es no, la migración no está mal escrita: está **mal partida**.
Hay que dividirla en pasos que sí lo cumplan, aunque sean tres despliegues en
lugar de uno [@humble-farley-continuous-delivery].

Es la misma idea que sostiene la entrega continua entera —cada paso tiene que
dejar el sistema en un estado desplegable—, aplicada al sitio donde más caro sale
ignorarla.

## Fuentes

- [@ambler-sadalage-refactoring-databases] Ambler, Scott W.; Sadalage, Pramod J. *Refactoring Databases*. Addison-Wesley, 2006. ISBN 9780321293534 — <https://openlibrary.org/isbn/9780321293534>
- [@humble-farley-continuous-delivery] Humble, Jez; Farley, David. *Continuous Delivery*. Addison-Wesley, 2010. ISBN 9780321601919 — <https://openlibrary.org/isbn/9780321601919>
