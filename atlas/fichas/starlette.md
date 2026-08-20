# 🌟 Starlette — 2018

> [⬅️ Atlas](../README.md) · [🐍 Ecosistema Python](../ecosistemas/python.md) · [🗂️ Índice](../frameworks.md)

Starlette es **la base asíncrona sobre la que está construido
[FastAPI](fastapi.md)**, y distinguir uno de otro es uno de los mejores
ejercicios de taxonomía que ofrece el catálogo.

| | |
|---|---|
| **Aparición** | 2018, creado por Tom Christie |
| **Clasificación** | `asgi-toolkit` |
| **Ecosistema** | Python |
| **Licencia** | `BSD-3-Clause` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://www.starlette.io/> |

---

## 🧭 El ejercicio de taxonomía

| | Starlette | FastAPI |
| --- | --- | --- |
| Qué aporta | Transporte asíncrono: enrutado, middleware, WebSocket, respuestas | Validación desde tipos, documentación OpenAPI, inyección |
| Clasificación | Conjunto de herramientas | Framework |
| ¿Puede usarse solo? | Sí | No sin Starlette debajo |

Aplicando las cinco preguntas del
[módulo 00](../../curriculum/00-taxonomia-y-diagnostico.md), la más reveladora es
la cuarta: **¿existe sin otra tecnología por debajo?** FastAPI no. Eso lo
convierte en una capa sobre Starlette, igual que Next.js lo es sobre React.

Y explica algo práctico: cuando en FastAPI necesitas middleware, WebSocket o
control fino de la respuesta, **estás usando Starlette**, y su documentación es
la que responde.

## 🔌 ASGI: la interfaz común del ecosistema

Starlette habla ASGI, la interfaz asíncrona estándar entre servidores y
aplicaciones Python. Eso permite que un middleware escrito para una aplicación
funcione en otra, y que el servidor sea intercambiable.

Es el mismo tipo de acuerdo que los estándares PSR en PHP —ver la
[ficha de Slim](slim.md)— y tiene el mismo efecto para el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md): **reduce el coste
de cambiar de framework**, porque parte del código de transporte sobrevive.

Es también la razón por la que [Tornado](tornado.md), con su modelo propio,
quedó fuera del ecosistema que se formó alrededor de esta interfaz.

## 🎓 Las dos lecciones

**1. Saber qué capa resuelve qué es una habilidad de diagnóstico.** Buscar en la
documentación equivocada es una pérdida de tiempo evitable.

**2. Una interfaz común entre servidor y aplicación es infraestructura
compartida.** Lo que se construye sobre ella es portable; lo que la ignora, no.

## 🔗 Enlaces

- Documentación oficial: <https://www.starlette.io/>
- [Ficha de FastAPI](fastapi.md) — lo que se construye encima · [Ficha de Slim](slim.md)
- [Módulo 00](../../curriculum/00-taxonomia-y-diagnostico.md)

## Fuentes

- [@lubanovic-fastapi] Lubanovic, Bill. *FastAPI: Modern Python Web Development*. O'Reilly Media, 2023. ISBN 9781098135508 — <https://openlibrary.org/isbn/9781098135508>
