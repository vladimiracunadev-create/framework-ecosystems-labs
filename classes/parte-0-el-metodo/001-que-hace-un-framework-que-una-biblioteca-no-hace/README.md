# Clase 001 — Qué hace un framework que una biblioteca no hace

> [📚 Parte 0](../README.md) · [🎓 Clases](../../README.md) · [002 ➡️](../002-inversion-de-control-en-concreto/README.md)
>
> Parte **0 — El método: qué es un framework y cómo se compara** · Nivel **🟢 introductorio** · Pista **`backend`** (Backend y API)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Distinguir biblioteca de framework por quién llama a quién.

## 🧩 La situación

El mismo saludo HTTP escrito con una biblioteca y con un framework: quién controla el bucle.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [Node.js](../../../atlas/fichas/nodejs.md) | `runtime` | JavaScript | `implementaciones/nodejs/` |
| [Express](../../../atlas/fichas/express.md) | `web-framework` | Node.js | `implementaciones/express/` |
| [Flask](../../../atlas/fichas/flask.md) | `web-framework` | Python | `implementaciones/flask/` |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | `application-framework` | JVM | `implementaciones/spring-boot/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 001
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 0](../README.md)
