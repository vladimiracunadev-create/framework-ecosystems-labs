# Por qué sí y por qué no — Bases no relacionales

> [⬅️ Clase 063](README.md) · [📚 Parte 4](../README.md)

| ORM | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Prisma](../../../atlas/fichas/prisma.md) | `$queryRaw` llega a `json_each` sin salirse del proyecto | El esquema de Prisma deja de describir los datos: ya solo dice «hay un texto» | Perder lo que Prisma mejor hace |
| [SQLAlchemy](../../../atlas/fichas/sqlalchemy.md) | El tipo `JSON` serializa y deserializa solo | Y no detecta cambios dentro salvo con `MutableDict`: el fallo es silencioso | Recordar reasignar el diccionario entero |
| [Hibernate](../../../atlas/fichas/hibernate.md) | Un `@Lob` y Jackson: nada que aprender | H2 no sabe mirar dentro, así que buscar recorre todo | Una consulta que no escala |

## 🧭 La pregunta que decide el modelo

No es «documental o relacional». Es:

> **¿Lo que leo junto es lo que escribo junto?**

Si la respuesta es sí —un carrito, un pedido, un perfil, una configuración—, el
documento encaja: una lectura, una escritura, una unidad de consistencia.

Si es no —un catálogo que se consulta por diez criterios distintos, informes que
cruzan entidades, datos que otros sistemas también actualizan—, cada consulta
querrá una forma distinta del mismo documento, y acabarás **duplicando el
documento en varias formas** para poder consultarlo. Que es exactamente lo que
las tablas normalizadas evitan.

## 🧭 La respuesta que casi nadie menciona

Las dos, en la misma base.

PostgreSQL con `jsonb` permite tener columnas normalizadas para lo que se
consulta y filtra, y un documento para lo que solo se lee entero. Con índices
sobre campos anidados, transacciones de verdad y sin añadir un sistema nuevo que
operar, respaldar y vigilar.

Para la mayoría de las aplicaciones que creen necesitar una base documental, esa
es la respuesta correcta — y la más barata.

## 💡 Lo que hay que llevarse

«Sin esquema» es la etiqueta más engañosa de esta categoría. El esquema existe
siempre: es la forma que el código espera encontrar.

Lo que decides al elegir un modelo documental es **dónde vive ese esquema y quién
lo hace cumplir**. En la base, con migraciones y errores en la escritura. O en el
código, con compatibilidad hacia atrás y errores en la lectura.

Kleppmann llama a lo segundo *esquema en la lectura*, y su observación práctica
es la que conviene recordar: los datos viejos **no se convierten solos**, así que
el código de lectura carga con todas las formas que ha tenido el documento a lo
largo de su vida [@kleppmann-ddia].

Ninguna de las dos es gratis. La diferencia es cuándo pagas.

## Fuentes

- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
- [@evans-ddd] Evans, Eric. *Domain-Driven Design*. Addison-Wesley, 2003. ISBN 9780321125217 — <https://openlibrary.org/isbn/9780321125217>
