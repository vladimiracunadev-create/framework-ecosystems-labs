# Clase 108 — Reconexión y mensajes perdidos

> [⬅️ 107](../107-websocket/README.md) · [📚 Parte 8](../README.md) · [🎓 Clases](../../README.md) · [109 ➡️](../109-estado-de-conexion-con-varias-instancias/README.md)
>
> Parte **8 — Tiempo real y trabajo en segundo plano** · Nivel **🔴 avanzado** · Pista **`backend`** (Backend y API)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Sobrevivir a un corte sin perder ni duplicar.

## 🧩 La situación

Tras un corte, el cliente reconecta con espera creciente y recupera lo perdido.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | `web-framework` | Node.js | `implementaciones/express/` |
| [FastAPI](../../../atlas/fichas/fastapi.md) | `web-framework` | Python | `implementaciones/fastapi/` |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | `application-framework` | JVM | `implementaciones/spring-boot/` |
| [Phoenix](../../../atlas/fichas/phoenix.md) | `full-stack-framework` | BEAM | `implementaciones/phoenix/` |
| [Socket.IO](../../../atlas/fichas/socketio.md) | `realtime-library` | Node.js | `implementaciones/socketio/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 108
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 8](../README.md)
