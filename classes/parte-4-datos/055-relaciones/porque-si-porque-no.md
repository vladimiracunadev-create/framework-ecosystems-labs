# Por qué sí y por qué no — Relaciones

> [⬅️ Clase 055](README.md) · [📚 Parte 4](../README.md)

| ORM | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Prisma](../../../atlas/fichas/prisma.md) | La escritura anidada crea padre e hijos en una operación, y el tipo refleja lo que incluiste | Sin `include`, la relación **no existe** en el resultado | Un fallo silencioso: lista ausente en vez de error |
| [SQLAlchemy](../../../atlas/fichas/sqlalchemy.md) | Distingue la cascada del ORM de la de la base: la más honesta de las cuatro | Esa honestidad son dos declaraciones por relación | Escribir dos cosas que parecen una |
| [Hibernate](../../../atlas/fichas/hibernate.md) | `cascade` y `orphanRemoval` cubren todos los casos del ciclo de vida | Hay que poner **los dos lados** a mano, y olvidarlo no da error | Una etiqueta huérfana lejos de su causa |
| [Entity Framework Core](../../../atlas/fichas/entity-framework-core.md) | Deduce la clave ajena por convención: basta con añadir al hijo | Sin `Include`, la lista llega **vacía** | Igual que Prisma: parece un dato, es un olvido |

## 🧭 Dos filosofías sobre cargar

**No cargar salvo que lo pidas** —Prisma, EF Core— hace imposible el problema
N+1 de la clase 056 y **posible un fallo silencioso**: olvidas el `include`, la
lista llega vacía, y el cliente muestra «sin etiquetas» para una tarea que tiene
tres.

**Cargar al tocar** —SQLAlchemy, Hibernate— siempre da el dato correcto y
**puede dar mil consultas**. El fallo es de rendimiento, no de corrección, y se
detecta mirando el registro de SQL.

La elección real no es entre las dos: es **darse cuenta de cuál tienes**. El error
caro en cada una es distinto, y la señal que hay que vigilar también.

## ⚠️ Y la cascada que no es del ORM

Merece repetirse porque es el fallo más silencioso de esta clase.

`cascade="all, delete-orphan"` actúa cuando borras **por la sesión**. Si otro
servicio, un trabajo programado o una persona con un cliente de SQL borra la
fila, esa cascada **no existe**: las etiquetas se quedan apuntando a una tarea que
ya no está.

Solo `ON DELETE CASCADE` en el esquema lo garantiza, porque lo aplica el motor
para cualquiera que escriba. Ambler y Sadalage insisten en la misma idea al
hablar de refactorizar esquemas: **las reglas que protegen la integridad viven en
la base, no en una capa que solo usa una aplicación**
[@ambler-sadalage-refactoring-databases].

Lo correcto es declarar las dos: la de la base para la integridad, la del ORM
para que los objetos en memoria no queden desalineados.

## Fuentes

- [@ambler-sadalage-refactoring-databases] Ambler, Scott W.; Sadalage, Pramod J. *Refactoring Databases*. Addison-Wesley, 2006. ISBN 9780321293534 — <https://openlibrary.org/isbn/9780321293534>
