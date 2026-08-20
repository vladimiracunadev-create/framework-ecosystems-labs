# 🦕 Deno — 2018

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Deno lo creó **la misma persona que creó [Node.js](nodejs.md)**, y su presentación
fue literalmente una lista de decisiones de las que se arrepentía. Es el caso más
explícito del catálogo de **autocrítica convertida en producto**.

| | |
|---|---|
| **Aparición** | 2018 (versión 1.0 en 2020) |
| **Clasificación** | `runtime` |
| **Ecosistema** | JavaScript / TypeScript |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://docs.deno.com/> |

---

## 🔒 Permisos explícitos: la corrección más importante

En Node.js, cualquier dependencia puede leer archivos, abrir conexiones y leer
variables de entorno **sin pedir permiso**. Instalar un paquete es concederle
acceso completo al sistema.

Deno invierte el valor por omisión [@deno-v1]:

```bash
deno run servidor.ts                          # sin permisos: no puede hacer casi nada
deno run --allow-net=:3000 servidor.ts        # solo escuchar en ese puerto
deno run --allow-net --allow-read=./datos servidor.ts
```

Para el [módulo 07](../../curriculum/07-identidad-y-seguridad.md) esto es el
principio de menor privilegio aplicado al runtime, y para el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) es una respuesta
directa al riesgo de cadena de suministro: **un paquete comprometido no puede
hacer lo que no se le permitió**.

Es la misma idea que la [ficha de Tauri](tauri.md) aplica al escritorio: **cerrado
por omisión es mejor que abierto con lista de comprobaciones**.

## 🧩 Las otras correcciones

| Decisión de Node.js | En Deno |
| --- | --- |
| Sistema de módulos propio, anterior al estándar | Módulos del lenguaje, por URL o registro |
| TypeScript necesita herramienta aparte | Integrado |
| API propias anteriores a los estándares web | Estándares web primero |
| Herramientas de terceros | Formateador, comprobador y pruebas incluidos |

## ⚖️ Por qué Node.js sigue dominando

Porque **el ecosistema es la barrera**, no el diseño. Millones de paquetes,
tutoriales, herramientas y personas formadas siguen ahí. Deno terminó añadiendo
compatibilidad con Node precisamente por eso.

Es la misma lección que la [ficha de Koa](koa.md): un diseño mejor no basta contra
un ecosistema establecido, y **reconocerlo es parte de decidir con criterio**.

## 🎓 Las dos lecciones

**1. Los permisos por omisión son una decisión de seguridad de primer orden.**
Cambiar el valor por defecto cambia el resultado de miles de proyectos.

**2. Un autor puede enumerar los defectos de su obra y la obra seguir ganando.**
Diseño ideal y adopción real son cosas distintas.

## 🔗 Enlaces

- Documentación oficial: <https://docs.deno.com/>
- [Ficha de Node.js](nodejs.md) · [Ficha de Bun](bun.md) · [Ficha de Tauri](tauri.md)
- [Módulo 07](../../curriculum/07-identidad-y-seguridad.md)

## Fuentes

- [@deno-v1] *Deno 1.0*, Deno — <https://deno.com/blog/v1>
- [@nist-ssdf] SP 800-218 — Secure Software Development Framework, NIST, 2022 — <https://csrc.nist.gov/pubs/sp/800/218/final>
