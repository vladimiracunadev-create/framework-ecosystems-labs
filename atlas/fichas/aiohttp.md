# 🔗 aiohttp — 2014

> [⬅️ Atlas](../README.md) · [🐍 Ecosistema Python](../ecosistemas/python.md) · [🗂️ Índice](../frameworks.md)

aiohttp es **cliente y servidor HTTP asíncronos** sobre la biblioteca estándar de
Python. Está en el Atlas por una razón concreta: es el nivel inmediatamente
inferior a un framework, y verlo aclara qué añade un framework encima.

| | |
|---|---|
| **Aparición** | 2014 |
| **Clasificación** | `http-toolkit` |
| **Ecosistema** | Python |
| **Licencia** | `Apache-2.0` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://docs.aiohttp.org/en/stable/> |

---

## 💡 Las dos mitades

**El cliente** es su uso más extendido, y muchas veces el único: hacer peticiones
HTTP concurrentes sin bloquear. Aparece dentro de aplicaciones que no son web.

**El servidor** es la parte que interesa a este programa. Comparado con la
referencia sin framework del
[módulo 01](../../curriculum/01-http-eventos-y-contratos.md), aiohttp aporta
enrutado y utilidades de petición y respuesta, y **deja fuera** la validación, la
serialización tipada, la documentación del contrato y la inyección.

Ese hueco es exactamente lo que [FastAPI](fastapi.md) y [Litestar](litestar.md)
llenan.

## 🧭 Cliente y servidor a la vez: una observación útil

Que la misma biblioteca haga las dos cosas hace visible algo que el
[módulo 05](../../curriculum/05-backend-y-api.md) enseña: **tu servicio también es
cliente de otros**. Los límites de tamaño, los tiempos de espera, los reintentos
y el corte de circuito que exiges a quien te llama, se los debes a quien llamas.

Un servicio sin tiempo de espera en sus llamadas salientes convierte la lentitud
de una dependencia en su propia caída — el fallo que la
[ficha de Vert.x](vertx.md) describe y que el
[módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md) obliga a
probar con fallo inyectado.

## 🎓 Las dos lecciones

**1. Ver la capa de debajo aclara qué aporta la de arriba.** Es el mismo método
del módulo 01 con la referencia sin framework.

**2. Todo servicio es también cliente.** Los controles que exiges hacia dentro se
aplican igual hacia fuera, y ahí es donde suelen faltar.

## 🔗 Enlaces

- Documentación oficial: <https://docs.aiohttp.org/en/stable/>
- [Ficha de Starlette](starlette.md) · [Ficha de FastAPI](fastapi.md)
- [Módulo 05](../../curriculum/05-backend-y-api.md)

## Fuentes

- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
