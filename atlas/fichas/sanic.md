# 💨 Sanic — 2016

> [⬅️ Atlas](../README.md) · [🐍 Ecosistema Python](../ecosistemas/python.md) · [🗂️ Índice](../frameworks.md)

Sanic apareció en el momento exacto de la transición: Python acababa de
incorporar `async`/`await`, y Sanic fue de los primeros en ofrecer **la
familiaridad de Flask con ejecución asíncrona**.

| | |
|---|---|
| **Aparición** | 2016 |
| **Clasificación** | `web-framework` |
| **Ecosistema** | Python |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://sanic.dev/en/guide/> |

---

## 💡 Sintaxis conocida, modelo distinto

```python
@app.get("/tasks")
async def listar(request):      # la única diferencia visible es `async`
    return json({"items": []})
```

Esa mínima diferencia esconde un cambio de modelo completo, y ahí está la trampa
que enseña esta ficha: **una API familiar no implica un modelo de ejecución
familiar**.

Es exactamente el mismo aviso que la [ficha de Fiber](fiber.md) hace en Go al
copiar la API de Express. En un framework síncrono, una operación lenta ocupa un
hilo; en uno asíncrono, **una operación bloqueante dentro de una función `async`
detiene el bucle de eventos entero** y con él todas las peticiones en vuelo.

Es la misma regla de [Node.js](nodejs.md) y de [Vert.x](vertx.md), y se incumple
igual de fácil: basta una biblioteca síncrona llamada desde una corrutina
[@ramalho-fluent-python].

## ⚖️ Su lugar hoy

El espacio que ocupaba Sanic —Python asíncrono con sintaxis sencilla— lo comparte
hoy con [FastAPI](fastapi.md), que añade validación desde tipos y documentación
generada, y con [Litestar](litestar.md).

Sigue activo y con comunidad propia. Para el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md), la pregunta no es
cuál tiene más cuota, sino qué necesita el producto: si no hace falta validación
declarativa ni OpenAPI, la superficie menor de Sanic es un argumento legítimo.

## 🎓 Las dos lecciones

**1. Sintaxis familiar, semántica distinta es una trampa recurrente.** Aparece al
migrar de síncrono a asíncrono y al cambiar de ecosistema conservando la API.

**2. En un bucle de eventos, lo bloqueante es contagioso.** Una sola llamada
síncrona degrada todo el servicio, y el promedio no lo delata: hay que mirar
percentiles.

## 🔗 Enlaces

- Documentación oficial: <https://sanic.dev/en/guide/>
- [Ficha de FastAPI](fastapi.md) · [Ficha de Flask](flask.md) · [Ficha de Node.js](nodejs.md)
- [Módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md)

## Fuentes

- [@ramalho-fluent-python] Ramalho, Luciano. *Fluent Python*, 2.ª ed. O'Reilly Media, 2021. ISBN 9781492056355 — <https://openlibrary.org/isbn/9781492056355>
