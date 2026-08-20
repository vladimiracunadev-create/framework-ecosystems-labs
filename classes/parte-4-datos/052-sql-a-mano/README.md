# Clase 052 — SQL a mano

> [⬅️ 051](../051-conectar-a-una-base-de-datos/README.md) · [📚 Parte 4](../README.md) · [🎓 Clases](../../README.md) · [053 ➡️](../053-active-record/README.md)
>
> Parte **4 — Datos: del SQL a mano al dominio limpio** · Nivel **🟢 introductorio** · Pista **`datos`** (Persistencia)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Escribir la consulta y leer el resultado sin capa intermedia.

## 🧩 La situación

Insertar y leer una tarea con SQL parametrizado.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [Dapper](../../../atlas/fichas/dapper.md) | `micro-orm` | .NET | `implementaciones/dapper/` |
| [SQLAlchemy](../../../atlas/fichas/sqlalchemy.md) | `orm` | Python | `implementaciones/sqlalchemy/` |
| [Drizzle ORM](../../../atlas/fichas/drizzle.md) | `orm` | JavaScript/TypeScript | `implementaciones/drizzle/` |
| [Active Record (Rails)](../../../atlas/fichas/activerecord.md) | `orm` | Ruby | `implementaciones/activerecord/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 052
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 4](../README.md)
