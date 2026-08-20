# 💧 Drizzle ORM — 2022

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Drizzle responde a [Prisma](prisma.md) con una tesis distinta: **el esquema se
declara en TypeScript**, sin lenguaje propio ni generación de código, y las
consultas se parecen a SQL a propósito.

| | |
|---|---|
| **Aparición** | 2022 |
| **Clasificación** | `orm` |
| **Ecosistema** | JavaScript / TypeScript |
| **Licencia** | `Apache-2.0` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://orm.drizzle.team/docs/overview> |

---

## 💡 TypeScript como lenguaje de esquema

```typescript
export const tareas = pgTable("tareas", {
  id: uuid("id").primaryKey().defaultRandom(),
  titulo: varchar("titulo", { length: 120 }).notNull(),
  completada: boolean("completada").notNull().default(false),
});

const pendientes = await db.select().from(tareas).where(eq(tareas.completada, false));
```

Los tipos salen por inferencia del propio esquema: no hay paso de generación, y el
editor conoce las columnas porque son valores TypeScript ordinarios. Se obtiene la
seguridad de tipos de Prisma **sin la barrera de aprender un lenguaje aparte** que
esa ficha señala como su coste principal.

## 🧭 «Si sabes SQL, sabes Drizzle»

Esa es su promesa, y tiene un coste explícito: **no oculta la base de datos**.
Quien no sabe SQL no va a ser productivo, y quien lo sabe no tiene que aprender
otro lenguaje de consulta.

Es una postura defendible en el marco del
[módulo 06](../../curriculum/06-persistencia-y-dominio.md), donde SQL es
conocimiento base y no un detalle a tapar. Y tiene la contrapartida honesta: el
dominio queda más cerca del almacenamiento que con el Data Mapper de la
[ficha de SQLAlchemy](sqlalchemy.md).

## ⚖️ Lo que hay que mirar antes de adoptarlo

Es joven. En el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) eso se traduce en
preguntas concretas: cuántas versiones con cambios incompatibles ha habido, qué
tamaño tiene el equipo que lo mantiene, y si las migraciones cubren los casos
difíciles —renombrar una columna sin perder datos, desplegar sin parar el
servicio— que Ambler y Sadalage tratan en detalle
[@ambler-sadalage-refactoring-databases].

## 🎓 Las dos lecciones

**1. Se puede tener tipos exactos sin lenguaje propio.** Usar el sistema de tipos
del lenguaje anfitrión evita una barrera permanente.

**2. No ocultar SQL es una decisión, no una carencia.** Aprovecha lo que ya sabes;
a cambio, el dominio queda más pegado al almacenamiento.

## 🔗 Enlaces

- Documentación oficial: <https://orm.drizzle.team/docs/overview>
- [Ficha de Prisma](prisma.md) · [Ficha de TypeORM](typeorm.md)
- [Módulo 06](../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@ambler-sadalage-refactoring-databases] Ambler, Scott W.; Sadalage, Pramod J. *Refactoring Databases*. Addison-Wesley, 2006. ISBN 9780321293534 — <https://openlibrary.org/isbn/9780321293534>
