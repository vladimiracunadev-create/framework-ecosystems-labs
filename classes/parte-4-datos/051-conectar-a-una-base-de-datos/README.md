# Clase 051 — Conectar a una base de datos

> [📚 Parte 4](../README.md) · [🎓 Clases](../../README.md) · [052 ➡️](../052-sql-a-mano/README.md)
>
> Parte **4 — Datos: del SQL a mano al dominio limpio** · Nivel **🟢 introductorio** · Pista **`datos`** (Persistencia)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Abrir una conexión y cerrarla bien.

## 🧩 La situación

Una consulta trivial devuelve el resultado esperado y libera la conexión.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [Prisma ORM](../../../atlas/fichas/prisma.md) | `orm` | JavaScript/TypeScript | `implementaciones/prisma/` |
| [Drizzle ORM](../../../atlas/fichas/drizzle.md) | `orm` | JavaScript/TypeScript | `implementaciones/drizzle/` |
| [SQLAlchemy](../../../atlas/fichas/sqlalchemy.md) | `orm` | Python | `implementaciones/sqlalchemy/` |
| [Eloquent (Laravel)](../../../atlas/fichas/eloquent.md) | `orm` | PHP | `implementaciones/eloquent/` |
| [Active Record (Rails)](../../../atlas/fichas/activerecord.md) | `orm` | Ruby | `implementaciones/activerecord/` |
| [Hibernate ORM](../../../atlas/fichas/hibernate.md) | `orm` | JVM | `implementaciones/hibernate/` |
| [Entity Framework Core](../../../atlas/fichas/entity-framework-core.md) | `orm` | .NET | `implementaciones/entity-framework-core/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 051
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 4](../README.md)
