# 🏢 Ext JS — 2007

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Ext JS trajo componentes de tipo escritorio —cuadrículas editables, árboles,
ventanas, gráficos— a aplicaciones internas de empresa. Y es **la única entrada
del ecosistema JavaScript con licencia comercial**, lo que la convierte en un caso
útil para el [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md).

| | |
|---|---|
| **Aparición** | 2007 (a partir de extensiones para YUI) |
| **Clasificación** | `ui-toolkit` |
| **Ecosistema** | JavaScript |
| **Licencia** | `NOASSERTION` — comercial, con opciones libres históricas |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://docs.sencha.com/extjs/> |

---

## 💡 Su terreno: aplicaciones internas densas

Una cuadrícula con miles de filas, edición en línea, agrupación, filtros y
exportación es un componente muy difícil de construir bien. Ext JS lo traía
resuelto cuando casi nadie lo tenía, y por eso se afianzó en aplicaciones internas
de banca, logística e industria.

Esa es una decisión legítima del módulo 11: **cuando una capacidad concreta y cara
está resuelta, puede justificar la elección entera** — el mismo razonamiento que
la [ficha de Django](django.md) hace con su panel de administración.

## ⚖️ Lo que hay que declarar

**1. La licencia es la dimensión principal.** Coste por desarrollador, condiciones
de distribución y qué ocurre si se deja de pagar. Son preguntas de negocio con
respuesta contractual, no técnica [@spdx-licenses].

**2. La estrategia de salida es cara.** Una aplicación construida sobre sus
componentes tiene poco reutilizable fuera. El módulo 11 pregunta qué quedaría
inservible: aquí, toda la capa de interfaz.

**3. Cambió su modelo de licencia con el tiempo.** Es exactamente el riesgo que el
módulo 11 pide vigilar en las actualizaciones: **la licencia puede cambiar bajo
tus pies**, y el historial de un proyecto en ese aspecto es información.

## 🎓 Las dos lecciones

**1. Una licencia comercial no es descalificación: es una fila más de la matriz**
con coste, condiciones y riesgo de cambio.

**2. Cuanto más completa es la capa de interfaz que adoptas, más caro es
salir.** La estrategia de salida se escribe antes, no después.

## 🔗 Enlaces

- Documentación oficial: <https://docs.sencha.com/extjs/>
- [Ficha de Dojo](dojo.md) · [Ficha de Qt](qt.md) — la otra licencia dual del catálogo
- [Módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)

## Fuentes

- [@spdx-licenses] SPDX License List, Linux Foundation — <https://spdx.org/licenses/>
