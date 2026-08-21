# Por qué sí y por qué no — Transacciones

> [⬅️ Clase 057](README.md) · [📚 Parte 4](../README.md)

| ORM | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Prisma](../../../atlas/fichas/prisma.md) | El cliente de la transacción es **otro objeto**: usar el de fuera se ve | Ese mismo `tx` hay que pasarlo a todo lo que llame | Argumentos que atraviesan capas |
| [SQLAlchemy](../../../atlas/fichas/sqlalchemy.md) | La sesión **ya está** en una transacción; `begin()` solo la hace explícita | Y por eso es fácil olvidar que existe hasta que un `commit` la corta | Saber dónde se confirma |
| [Hibernate](../../../atlas/fichas/hibernate.md) | Una anotación, sin fontanería visible | La regla de las excepciones comprobadas, y las llamadas internas que no pasan por el proxy | Dos comportamientos sorprendentes |
| [Entity Framework Core](../../../atlas/fichas/entity-framework-core.md) | Explícito y legible; `RollbackAsync` se ve | Hay que acordarse de confirmar | Un `Commit` olvidado deshace todo en silencio |

## 🧭 Declarativo frente a explícito

Es la misma tensión de la clase 036, aplicada aquí.

**`@Transactional` es declarativo**: dice *qué* quieres y esconde *cómo*. Se lee
de un vistazo, no ensucia el método, y a cambio su comportamiento depende de
reglas que no están escritas en el código que estás leyendo —qué excepciones
deshacen, si la llamada pasó por el proxy, qué propagación heredó.

**`BeginTransactionAsync` es explícito**: se ve dónde empieza, dónde termina y
qué la deshace. Cuesta más líneas y no tiene sorpresas.

Ninguno de los dos es mejor. Lo que no funciona es **usar el declarativo sin
conocer sus reglas**, y ahí es donde se pierden los diez del contrato.

## 💡 Lo que hay que llevarse

La transacción no es una función de la base de datos que haya que aprender: es la
respuesta a una pregunta que aparece en cuanto una operación de negocio necesita
**más de una escritura**.

Y la pregunta útil no es «¿esto puede fallar?» —todo puede fallar—, sino:

> **Si esto falla justo aquí, ¿qué queda escrito?**

Hacerse esa pregunta en cada punto intermedio es lo que distingue un sistema que
se recupera de uno que acumula estados imposibles. Kleppmann lo formula así: las
transacciones existen porque **los fallos parciales son la norma, no la
excepción**, y sin una forma de agruparlas, cada escritura intermedia es un
estado que alguien tendrá que arreglar a mano [@kleppmann-ddia].

## Fuentes

- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
