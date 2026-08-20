# Clase 053 — Active Record

> [⬅️ 052](../052-sql-a-mano/README.md) · [📚 Parte 4](../README.md) · [🎓 Clases](../../README.md) · [054 ➡️](../054-data-mapper/README.md)
>
> Parte **4 — Datos: del SQL a mano al dominio limpio** · Nivel **🟡 intermedio** · Pista **`datos`** (Persistencia)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Dejar que el objeto sepa guardarse.

## 🧩 La situación

El mismo alta y consulta con el objeto como puerta a la tabla.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [Active Record (Rails)](../../../atlas/fichas/activerecord.md) | `orm` | Ruby | `implementaciones/activerecord/` |
| [Eloquent (Laravel)](../../../atlas/fichas/eloquent.md) | `orm` | PHP | `implementaciones/eloquent/` |
| [Django](../../../atlas/fichas/django.md) | `web-framework` | Python | `implementaciones/django/` |
| [TypeORM](../../../atlas/fichas/typeorm.md) | `orm` | JavaScript/TypeScript | `implementaciones/typeorm/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 053
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 4](../README.md)
