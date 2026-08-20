# Clase 005 — Idiomático frente a traducido

> [⬅️ 004](../004-taxonomia-que-compite-de-verdad-con-que/README.md) · [📚 Parte 0](../README.md) · [🎓 Clases](../../README.md) · [006 ➡️](../006-coste-total-aprender-mantener-contratar-salir/README.md)
>
> Parte **0 — El método: qué es un framework y cómo se compara** · Nivel **🟢 introductorio** · Pista **`backend`** (Backend y API)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Reconocer cuándo un código es el de otro framework disfrazado.

## 🧩 La situación

La misma ruta escrita de forma idiomática y de forma traducida literalmente; qué se pierde.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | `web-framework` | Node.js | `implementaciones/express/` |
| [FastAPI](../../../atlas/fichas/fastapi.md) | `web-framework` | Python | `implementaciones/fastapi/` |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | `application-framework` | JVM | `implementaciones/spring-boot/` |
| [Ruby on Rails](../../../atlas/fichas/rails.md) | `full-stack-framework` | Ruby | `implementaciones/rails/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 005
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 0](../README.md)
