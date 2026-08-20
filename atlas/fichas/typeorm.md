# 🗃️ TypeORM — 2016

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

TypeORM llevó a TypeScript los dos patrones clásicos de acceso a datos —**Active
Record** y **Data Mapper**— y dejó al equipo elegir cuál usar. Fue el ORM de
referencia de Node durante años y su historia enseña algo sobre depender de
características experimentales.

| | |
|---|---|
| **Aparición** | 2016 |
| **Clasificación** | `orm` |
| **Ecosistema** | JavaScript / TypeScript |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://typeorm.io/> |

---

## 💡 Los dos patrones, explicados

Fowler los distingue con precisión [@fowler-poeaa]:

| | Active Record | Data Mapper |
| --- | --- | --- |
| **Idea** | El objeto sabe guardarse | Una capa aparte traduce objeto ↔ tabla |
| **Ventaja** | Directo, poco ceremonial | El dominio no sabe que hay base de datos |
| **Coste** | Dominio acoplado al almacenamiento | Más piezas |

```typescript
// Active Record
await tarea.save();

// Data Mapper
await repositorio.save(tarea);
```

La diferencia parece cosmética y no lo es. Con Data Mapper, **las reglas de
negocio se pueden probar sin base de datos**, que es exactamente el argumento del
[módulo 06](../../curriculum/06-persistencia-y-dominio.md) y la razón por la que
la [ficha de SQLAlchemy](sqlalchemy.md) defiende el mismo patrón en PHP.

Ofrecer los dos es honesto: hay proyectos donde Active Record es la respuesta
correcta —la [ficha de Eloquent](eloquent.md) lo argumenta— y proyectos donde el
dominio merece estar aislado.

## ⚖️ La deuda de los decoradores

TypeORM se construyó sobre los decoradores experimentales de TypeScript y sobre
metadatos de tipos en tiempo de ejecución. Durante años funcionó bien; cuando el
estándar de decoradores de JavaScript avanzó por un camino distinto, esa base
quedó desalineada.

Es el riesgo que el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) llama **apostar por
lo experimental**: la característica te da poder antes que a nadie, y te ata a una
versión concreta de la herramienta cuando el estándar toma otra dirección.

[Prisma](prisma.md) y [Drizzle](drizzle.md) evitaron ese acoplamiento por caminos
distintos: uno con un esquema propio, el otro con TypeScript ordinario.

## 🎓 Las dos lecciones

**1. Active Record y Data Mapper resuelven problemas distintos.** La pregunta es
si tu dominio debe poder probarse sin base de datos.

**2. Construir sobre lo experimental es una deuda con fecha desconocida.** Cuando
el estándar diverge, la migración no es opcional.

## 🔗 Enlaces

- Documentación oficial: <https://typeorm.io/>
- [Ficha de Prisma](prisma.md) · [Ficha de Drizzle](drizzle.md) · [Ficha de SQLAlchemy](sqlalchemy.md)
- [Módulo 06](../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@fowler-poeaa] Fowler, Martin. *Patterns of Enterprise Application Architecture*. Addison-Wesley, 2002. ISBN 9780321127426 — <https://openlibrary.org/isbn/9780321127426>
- [@tc39-ecma262] *ECMAScript Language Specification*, TC39 — <https://tc39.es/ecma262/>
