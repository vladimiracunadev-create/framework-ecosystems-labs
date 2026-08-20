# 🖼️ Qt — 1995

> [⬅️ Atlas](../README.md) · [🖥️ Escritorio nativo](../ecosistemas/nativo.md) · [🗂️ Índice](../frameworks.md)

Qt es **el framework de interfaz más longevo del catálogo que sigue en uso
activo**: treinta años en producción, más que la vida entera de la mayoría de las
entradas del Atlas. Y es el ejemplo canónico de **licencia dual** como modelo de
negocio.

| | |
|---|---|
| **Aparición** | 1995 |
| **Clasificación** | `ui-framework` |
| **Ecosistema** | C++ (con enlaces a Python, Rust y más) |
| **Licencia** | `LGPL-3.0-only`, o comercial |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://doc.qt.io/> |

---

## ⚖️ La licencia dual, y por qué es una decisión de producto

Qt se puede usar bajo licencia libre **o** bajo licencia comercial, y la elección
cambia lo que puedes hacer:

| | Licencia libre (LGPL) | Licencia comercial |
| --- | --- | --- |
| Enlazado dinámico | Sí | Sí |
| **Enlazado estático** | Con condiciones estrictas | Sí |
| Publicar modificaciones de Qt | Obligatorio | No |
| Permitir sustituir la biblioteca al usuario | Obligatorio | No |
| Coste | Cero | Por desarrollador |

Para un dispositivo embebido, donde enlazar estáticamente es lo normal y permitir
al usuario sustituir la biblioteca es inviable, **la licencia decide la
arquitectura y el presupuesto**.

Es exactamente por esto que el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) exige el
identificador SPDX exacto y las obligaciones concretas, no un genérico «es de
código abierto» [@spdx-licenses], [@osi-licenses].

## 🕰️ Treinta años: lo que enseña

En un campo donde «vigente» suele significar cinco años, Qt obliga a recalibrar.
Cuando el módulo 11 pregunta por el horizonte del producto, Qt demuestra que un
horizonte de décadas es posible — y lo que cuesta:

- **Compatibilidad hacia atrás sostenida a pulso** durante versiones mayores.
- **Migraciones grandes muy espaciadas** y muy documentadas.
- Un **modelo de ingresos** que financia ese mantenimiento.

Esa tercera es la menos romántica y la más importante: **el mantenimiento a
treinta años lo paga alguien**. Un proyecto sin modelo de sostenimiento
difícilmente llega tan lejos, y esa es una dimensión de salud que el módulo 11
puntúa.

## 🧭 Su lugar frente a la generación web

| | Qt | [Electron](electron.md) | [Tauri](tauri.md) |
| --- | --- | --- | --- |
| Interfaz | Componentes propios compilados | Navegador incrustado | Motor web del sistema |
| Tamaño | Medio | Alto | Bajo |
| Personal | Especialistas en C++ | Cualquier equipo web | Web más Rust |
| Longevidad demostrada | **Décadas** | Una década | Reciente |
| Embebido e industrial | Sí, es su terreno | No | Limitado |

## 🎓 Las dos lecciones

**1. La licencia puede decidir la arquitectura.** Enlazado estático, embebido y
distribución cerrada son decisiones que la licencia habilita o impide.

**2. La longevidad tiene un modelo económico detrás.** Preguntar quién paga el
mantenimiento es parte de evaluar la salud de un proyecto.

## 🔗 Enlaces

- Documentación oficial: <https://doc.qt.io/>
- [Ficha de GTK](gtk.md) · [Ficha de Electron](electron.md) · [Ficha de Tauri](tauri.md)
- [Módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)

## Fuentes

- [@spdx-licenses] SPDX License List, Linux Foundation — <https://spdx.org/licenses/>
- [@osi-licenses] OSI Approved Licenses, Open Source Initiative — <https://opensource.org/licenses>
