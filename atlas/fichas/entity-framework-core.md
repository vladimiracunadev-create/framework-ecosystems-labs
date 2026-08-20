# 🗃️ Entity Framework Core — 2016

> [⬅️ Atlas](../README.md) · [🟦 Ecosistema .NET](../ecosistemas/dotnet.md) · [🗂️ Índice](../frameworks.md)

Entity Framework Core es el mapeador de datos de .NET, con **consultas integradas
en el propio lenguaje**. Su contraste con [Dapper](dapper.md) es la versión más
limpia del catálogo del compromiso que enseña el
[módulo 06](../../curriculum/06-persistencia-y-dominio.md).

| | |
|---|---|
| **Aparición** | 2016 (reescritura de Entity Framework, 2008) |
| **Clasificación** | `orm` — mapeador de datos |
| **Ecosistema** | .NET (C#) |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://learn.microsoft.com/ef/core/> |

---

## 💡 Consultas en el lenguaje

```csharp
// Esto NO se ejecuta aquí: construye un árbol de expresión...
var pendientes = contexto.Tareas
    .Where(t => !t.Completada)
    .OrderBy(t => t.CreadaEn)
    .Take(20);

// ...y se traduce a SQL cuando se enumera.
var lista = await pendientes.ToListAsync();
```

La ventaja es real: **el compilador comprueba la consulta**. Un campo mal escrito
no compila, en lugar de fallar en producción.

Y trae una trampa característica que conviene conocer: si una parte de la
expresión **no se puede traducir a SQL**, el comportamiento depende de la versión
—error, o evaluación en memoria tras traer más filas de las necesarias—. Ese
segundo caso es un problema de rendimiento silencioso, primo hermano de la
consulta N+1 que describe la [ficha de Hibernate](hibernate.md).

El diagnóstico es el mismo del módulo 06: **contar consultas y mirar el SQL
generado**, no confiar en que la abstracción hizo lo esperado [@fowler-poeaa].

## 🗂️ Migraciones incluidas

Genera migraciones a partir de los cambios en el modelo, con versión y capacidad
de revertir — la idea que [Rails](rails.md) popularizó, aquí bien integrada con
las herramientas del ecosistema.

Sigue aplicando la advertencia del módulo 06: **una migración generada hay que
leerla antes de aplicarla**. Lo generado no siempre es reversible ni seguro con
datos existentes [@ambler-sadalage-refactoring-databases].

## ⚖️ Frente a Dapper

| | Entity Framework Core | [Dapper](dapper.md) |
| --- | --- | --- |
| Escribes | Consultas en C# | SQL |
| Genera la consulta | Sí | No: solo mapea el resultado |
| Migraciones | Incluidas | Aparte |
| Riesgo | SQL generado que no esperabas | Texto SQL que hay que mantener |
| Encaja en | Dominios con muchas entidades relacionadas | Lecturas complejas, control fino |

Ambos son de la órbita de Microsoft y ambos están mantenidos: **la elección no es
de calidad, sino de qué quieres controlar**.

## 🎓 Las dos lecciones

**1. Consultas comprobadas por el compilador eliminan una clase de errores** y
crean otra: lo que no se puede traducir.

**2. Toda migración generada hay que revisarla.** La herramienta no conoce tus
datos.

## 🔗 Enlaces

- Documentación oficial: <https://learn.microsoft.com/ef/core/>
- [Ficha de Dapper](dapper.md) — la otra columna · [Ficha de Hibernate](hibernate.md) · [Ficha de SQLAlchemy](sqlalchemy.md)
- [Módulo 06](../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@fowler-poeaa] Fowler, Martin. *Patterns of Enterprise Application Architecture*. Addison-Wesley, 2002. ISBN 9780321127426 — <https://openlibrary.org/isbn/9780321127426>
- [@ambler-sadalage-refactoring-databases] Ambler, Scott W.; Sadalage, Pramod J. *Refactoring Databases*. Addison-Wesley, 2006. ISBN 9780321293534 — <https://openlibrary.org/isbn/9780321293534>
