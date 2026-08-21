# Por qué sí y por qué no — SQL a mano

> [⬅️ Clase 052](README.md) · [📚 Parte 4](../README.md)

| Herramienta | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Dapper](../../../atlas/fichas/dapper.md) | Rapidísimo y sin magia: ejecuta lo que escribes | Ni migraciones, ni seguimiento de cambios, ni relaciones | Todo lo que un ORM haría, a mano |
| [SQLAlchemy Core](../../../atlas/fichas/sqlalchemy.md) | El SQL a mano y el ORM en la misma biblioteca | Dos formas de hacer lo mismo conviviendo | Decidir cuál usar en cada caso |
| [Drizzle](../../../atlas/fichas/drizzle.md) | Tipado sobre SQL, sin capa de traducción | Ecosistema joven, menos respuestas escritas | Ser de los que encuentran los problemas |
| [Active Record](../../../atlas/fichas/rails.md) | El escape crudo está ahí cuando el generador no llega | Salirse del camino de Rails pierde casi todo lo que da | Perder el resto del framework |

## 🧭 Cuándo esta capa es la correcta

**Sí**, cuando la consulta es el producto: informes, agregaciones, ventanas,
consultas recursivas. Un ORM las genera mal o no las genera, y pelearse con él
cuesta más que escribir el SQL.

**Sí**, cuando el rendimiento importa lo suficiente para mirar el plan de
ejecución. No se puede ajustar lo que no se escribe.

**No**, para un CRUD corriente. Escribir a mano el alta, la baja y la
modificación de veinte tablas es trabajo repetitivo, y cada línea es una
oportunidad de olvidar un marcador.

**No**, si el equipo no tiene a nadie cómodo con SQL. Esta capa no perdona.

## 💡 Lo que hay que llevarse

Fowler describe la capa de acceso a datos como una decisión sobre **cuánto
quieres saber** [@fowler-poeaa]. El SQL a mano es el extremo de saberlo todo: no
hay nada entre tu código y la base, y por tanto no hay nada que te sorprenda.

La sorpresa se cambia por trabajo. Y como la mayoría de las aplicaciones tienen
las dos cosas —mucho CRUD aburrido y unas pocas consultas difíciles—, la
respuesta habitual no es elegir: es **usar el ORM para lo primero y bajar a SQL
para lo segundo**, que es exactamente el tema de la clase 060.

Lo único que no admite matices es el marcador de parámetro. Ahí no hay
compensación que valorar: **concatenar nunca es la opción correcta**.

## Fuentes

- [@fowler-poeaa] Fowler, Martin. *Patterns of Enterprise Application Architecture*. Addison-Wesley, 2002. ISBN 9780321127426 — <https://openlibrary.org/isbn/9780321127426>
- [@owasp-top10] OWASP. *OWASP Top 10*. — <https://owasp.org/www-project-top-ten/>
