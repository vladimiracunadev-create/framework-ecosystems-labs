# Clase 074 — Inyección SQL

> [⬅️ 073](../073-xss-y-escapado/README.md) · [📚 Parte 5](../README.md) · [🎓 Clases](../../README.md) · [075 ➡️](../075-secretos-y-configuracion/README.md)
>
> Parte **5 — Identidad y seguridad** · Nivel **🟡 intermedio** · Pista **`datos`** (Persistencia)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Comprobar que la consulta parametrizada lo es de verdad.

## 🧩 La situación

La entrada maliciosa se guarda como texto, no se ejecuta.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [Prisma ORM](../../../atlas/fichas/prisma.md) | `orm` | JavaScript/TypeScript | `implementaciones/prisma/` |
| [SQLAlchemy](../../../atlas/fichas/sqlalchemy.md) | `orm` | Python | `implementaciones/sqlalchemy/` |
| [Hibernate ORM](../../../atlas/fichas/hibernate.md) | `orm` | JVM | `implementaciones/hibernate/` |
| [Entity Framework Core](../../../atlas/fichas/entity-framework-core.md) | `orm` | .NET | `implementaciones/entity-framework-core/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 074
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 5](../README.md)
