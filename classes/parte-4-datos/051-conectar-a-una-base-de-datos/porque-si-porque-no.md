# Por qué sí y por qué no — Conectar a una base de datos

> [⬅️ Clase 051](README.md) · [📚 Parte 4](../README.md)

| ORM | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Prisma](../../../atlas/fichas/prisma.md) | Cliente tipado con el tipo exacto de lo que pediste | Un lenguaje de esquema propio, y su herramienta de migración tiene salvaguardas | Aprender algo que no sirve fuera de Prisma |
| [SQLAlchemy](../../../atlas/fichas/sqlalchemy.md) | Motor y sesión explícitos: se ve exactamente qué vive cuánto | Esa explicitud es también verbosidad | Escribir el ciclo de vida a mano |
| [Hibernate](../../../atlas/fichas/hibernate.md) | Un repositorio es una interfaz vacía; Spring genera el resto | **El código que se ejecuta no está escrito en ningún sitio** | Depurar exige entender el generador |
| [Entity Framework Core](../../../atlas/fichas/entity-framework-core.md) | El contenedor resuelve el ámbito del contexto por ti | Hay que entender los ámbitos de la clase 037 antes | Un ámbito mal elegido es un fallo sutil |

## 🧭 Lo que los cuatro comparten

**La distinción entre lo que vive todo el proceso y lo que vive una petición.**

Se llama de cuatro formas distintas —cliente y consulta, motor y sesión, fuente
de datos y contexto de persistencia, grupo y contexto— y es la misma idea. Quien
la entiende una vez la reconoce en los cuatro; quien no, comete el mismo error en
los cuatro.

Y el error tiene una firma inconfundible: **funciona en desarrollo y agota las
conexiones en producción**, porque con una petición cada vez el desperdicio no se
nota.

## ⚠️ La base embebida no es la de producción

Estas cuatro implementaciones usan SQLite o H2 para que la clase se ejecute sin
instalar nada. Es lo correcto para aprender y **no lo es para desarrollar**.

Las diferencias que muerden al desplegar:

- **Tipos.** SQLite acepta casi cualquier cosa en cualquier columna; PostgreSQL
  no.
- **Concurrencia.** SQLite bloquea el archivo entero al escribir.
- **SQL.** Funciones, ventanas, tipos de fecha y JSON difieren entre motores.

De ahí una regla que la clase 128 desarrolla: **desarrolla contra el motor que vas
a usar**. Un contenedor efímero con PostgreSQL cuesta poco y evita descubrir en
producción que tu consulta no existe en el motor real.

## Fuentes

- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
