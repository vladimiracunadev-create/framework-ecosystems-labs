# Clase 054 — Data Mapper

> [⬅️ 053](../053-active-record/README.md) · [📚 Parte 4](../README.md) · [🎓 Clases](../../README.md) · [055 ➡️](../055-relaciones/README.md)
>
> Parte **4 — Datos: del SQL a mano al dominio limpio** · Nivel **🟡 intermedio** · Pista **`datos`** (Persistencia)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Separar el dominio del almacenamiento.

## 🧩 La situación

El mismo alta y consulta con un repositorio que traduce objeto y tabla.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [Hibernate ORM](../../../atlas/fichas/hibernate.md) | `orm` | JVM | `implementaciones/hibernate/` |
| [SQLAlchemy](../../../atlas/fichas/sqlalchemy.md) | `orm` | Python | `implementaciones/sqlalchemy/` |
| [Entity Framework Core](../../../atlas/fichas/entity-framework-core.md) | `orm` | .NET | `implementaciones/entity-framework-core/` |
| [TypeORM](../../../atlas/fichas/typeorm.md) | `orm` | JavaScript/TypeScript | `implementaciones/typeorm/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 054
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 4](../README.md)
