# Clase 109 — Estado de conexión con varias instancias

> [⬅️ 108](../108-reconexion-y-mensajes-perdidos/README.md) · [📚 Parte 8](../README.md) · [🎓 Clases](../../README.md) · [110 ➡️](../110-colas-de-trabajo/README.md)
>
> Parte **8 — Tiempo real y trabajo en segundo plano** · Nivel **🔴 avanzado** · Pista **`backend`** (Backend y API)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Difundir a todos los usuarios cuando el servidor no es uno solo.

## 🧩 La situación

Un mensaje enviado a una instancia llega a los conectados a la otra.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | `web-framework` | Node.js | `implementaciones/express/` |
| [FastAPI](../../../atlas/fichas/fastapi.md) | `web-framework` | Python | `implementaciones/fastapi/` |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | `application-framework` | JVM | `implementaciones/spring-boot/` |
| [Socket.IO](../../../atlas/fichas/socketio.md) | `realtime-library` | Node.js | `implementaciones/socketio/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 109
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 8](../README.md)
