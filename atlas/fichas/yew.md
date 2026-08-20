# 🕸️ Yew — 2017

> [⬅️ Atlas](../README.md) · [🦀 Ecosistema Rust](../ecosistemas/rust.md) · [🗂️ Índice](../frameworks.md)

Yew fue **el primero en llevar el modelo de componentes de React fuera de
JavaScript**, compilando Rust a WebAssembly. Su valor para el Atlas es esa
demostración: la arquitectura de componentes **no es propiedad de un lenguaje**.

| | |
|---|---|
| **Aparición** | 2017 |
| **Clasificación** | `ui-framework` |
| **Ecosistema** | Rust (WebAssembly) |
| **Licencia** | `Apache-2.0` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://yew.rs/docs/getting-started/introduction> |

---

## 💡 React en otro lenguaje

Componentes, propiedades, estado, árbol virtual y comparación: el mismo modelo
que [React](react.md), escrito en Rust y ejecutado en WebAssembly
[@webassembly-org].

Que la idea sobreviva al cambio de lenguaje, de runtime y de modelo de memoria es
la mejor prueba de la tesis del
[módulo 03](../../curriculum/03-frontend-componentes-y-estado.md): lo que hay que
aprender es **el modelo**, no la API.

## ⚖️ El coste de WebAssembly en la interfaz

| Coste | Por qué |
| --- | --- |
| **Tamaño del artefacto** | Un binario WebAssembly suele pesar más que un paquete JavaScript equivalente |
| **Cruzar al DOM** | WebAssembly no accede al documento directamente: cada operación pasa por una capa de enlace |
| **Herramientas** | Depurar WebAssembly en el navegador es más limitado |

La segunda fila es la estructural y merece entenderse: **una interfaz hace
muchísimas operaciones sobre el documento**, y cada cruce tiene coste. Es
exactamente el mismo problema del puente que describe la
[ficha de React Native](react-native.md), aquí entre WebAssembly y el DOM.

Por eso WebAssembly brilla en cálculo intensivo —imagen, cifrado, simulación— y
compite peor en manipulación de interfaz, que es trabajo de coordinación con el
documento.

## 🧭 Cuándo tiene sentido

**Tiene sentido** cuando ya existe lógica en Rust que se quiere reutilizar en el
navegador, o cuando el cálculo pesado justifica el binario.

**No tiene sentido** solo por evitar JavaScript. El
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) pide justificar con
atributos de calidad medibles, y «no me gusta el lenguaje» no es uno.

## 🎓 Las dos lecciones

**1. La arquitectura de componentes es independiente del lenguaje.** React, Yew,
Leptos, SwiftUI, Compose y Flutter son la misma familia.

**2. WebAssembly no es «más rápido» en general.** Es más rápido en cálculo y
tiene un coste al cruzar hacia el documento. Distinguirlo evita elegir mal.

## 🔗 Enlaces

- Documentación oficial: <https://yew.rs/docs/getting-started/introduction>
- [Ficha de React](react.md) · [Ficha de Leptos](leptos.md) · [Ecosistema Rust](../ecosistemas/rust.md)
- [Módulo 03](../../curriculum/03-frontend-componentes-y-estado.md)

## Fuentes

- [@webassembly-org] *WebAssembly*, W3C — <https://webassembly.org/>
