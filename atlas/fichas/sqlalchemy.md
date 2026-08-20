# 🧪 SQLAlchemy — 2006

> [⬅️ Atlas](../README.md) · [🐍 Ecosistema Python](../ecosistemas/python.md) · [🗂️ Índice](../frameworks.md)

SQLAlchemy es **el ORM mejor diseñado del catálogo para el problema que el
[módulo 06](../../curriculum/06-persistencia-y-dominio.md) plantea**: separa
explícitamente el constructor de consultas del mapeador, de modo que se puede
bajar de nivel sin abandonar la herramienta.

| | |
|---|---|
| **Aparición** | 2006, creado por Michael Bayer |
| **Clasificación** | `orm` — mapeador de datos, con capa SQL propia |
| **Ecosistema** | Python |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://docs.sqlalchemy.org/> |

---

## 💡 Dos capas, y puedes elegir dónde trabajar

| Capa | Qué es | Cuándo la usas |
| --- | --- | --- |
| **Core** | Constructor de consultas SQL en Python | Consultas complejas, informes, control fino |
| **ORM** | Mapeador de datos sobre Core | Dominio con objetos y relaciones |

La diferencia con la mayoría de los ORM es que **no hay que salirse de la
herramienta** para escribir una consulta compleja: se baja a la capa Core, que
sigue siendo SQLAlchemy y sigue siendo componible.

Es exactamente la propiedad que evita el escenario que el módulo 06 describe: el
ORM cómodo hasta que aparece la consulta difícil, y entonces cadenas SQL
concatenadas a mano —con su riesgo de inyección— fuera de todo control
[@postgresql-docs].

## 🧩 Mapeador de datos, no registro activo

Como [Hibernate](hibernate.md) y a diferencia de [Eloquent](eloquent.md), el
objeto **no sabe guardarse**: hay una sesión que sigue los objetos y decide
cuándo emitir las sentencias. Eso permite que la clase de dominio sea una clase
normal, con reglas de negocio y sin herencia del framework.

Y con las mismas sorpresas que en Hibernate: la escritura diferida, la
comprobación de cambios y la carga perezosa —origen de la consulta N+1— hay que
conocerlas para diagnosticar [@fowler-poeaa].

## ⚖️ El compromiso

**Se gana** un modelo de dominio limpio, control real del SQL y una de las
mejores documentaciones del ecosistema.

**Se paga** una curva de aprendizaje mayor que la de un ORM de registro activo.
SQLAlchemy no esconde que hay una base de datos: **exige entenderla**, y eso es
una virtud disfrazada de coste.

## 🎓 Las dos lecciones

**1. Un buen ORM tiene una salida hacia abajo.** Sin ella, el día que la consulta
se complica se abandona la herramienta y se pierden sus garantías.

**2. Que el objeto no sepa guardarse es lo que permite un dominio con
comportamiento.** Es la elección del módulo 06 cuando las reglas son ricas.

## 🔗 Enlaces

- Documentación oficial: <https://docs.sqlalchemy.org/>
- [Ficha de Hibernate](hibernate.md) · [Ficha de Eloquent](eloquent.md) — la otra columna
- [Módulo 06](../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@fowler-poeaa] Fowler, Martin. *Patterns of Enterprise Application Architecture*. Addison-Wesley, 2002. ISBN 9780321127426 — <https://openlibrary.org/isbn/9780321127426>
- [@postgresql-docs] PostgreSQL Documentation, PostgreSQL Global Development Group — <https://www.postgresql.org/docs/current/>
