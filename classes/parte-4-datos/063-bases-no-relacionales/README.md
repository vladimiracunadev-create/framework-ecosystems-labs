# Clase 063 — Bases no relacionales

> [⬅️ 062](../062-cache-de-lectura/README.md) · [📚 Parte 4](../README.md) · [🎓 Clases](../../README.md) · [064 ➡️](../064-repositorio-y-dominio/README.md)
>
> Parte **4 — Datos: del SQL a mano al dominio limpio** · Nivel **🟡 intermedio** · Pista **`datos`** (Persistencia)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Modelar el mismo caso sin tablas y ver qué cambia.

## 🧩 La situación

La misma tarea guardada como documento, con sus compromisos declarados.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [Prisma ORM](../../../atlas/fichas/prisma.md) | `orm` | JavaScript/TypeScript | `implementaciones/prisma/` |
| [SQLAlchemy](../../../atlas/fichas/sqlalchemy.md) | `orm` | Python | `implementaciones/sqlalchemy/` |
| [Hibernate ORM](../../../atlas/fichas/hibernate.md) | `orm` | JVM | `implementaciones/hibernate/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 063
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 4](../README.md)
