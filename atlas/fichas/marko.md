# 🏷️ Marko — 2014

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Marko hizo **renderizado en servidor con hidratación parcial en 2014**, siete años
antes de que la idea se generalizara con el nombre de «arquitectura de islas».
Está en el Atlas por esa anticipación.

| | |
|---|---|
| **Aparición** | 2014, desarrollado en eBay |
| **Clasificación** | `ui-framework` |
| **Ecosistema** | JavaScript |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://markojs.com/docs/> |

---

## 💡 Islas, antes de que se llamaran islas

Marko nació en un sitio de comercio electrónico enorme, donde **la mayor parte de
la página es contenido y solo unas zonas son interactivas**. En lugar de hidratar
todo, hidrataba únicamente los componentes con estado.

Eso es exactamente lo que [Astro](astro.md) popularizó en 2021 y lo que Jason
Miller describió como patrón general en 2020 [@jasonformat-islands].

## 🧭 Por qué la idea tardó

Es la pregunta interesante, y la respuesta es del
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md):

**1. La necesidad no era general todavía.** En 2014 los paquetes eran menores y el
coste de hidratación no dolía tanto.

**2. Faltaba nombre.** Una idea sin nombre es difícil de discutir, comparar y
adoptar. «Arquitectura de islas» hizo por el concepto lo que ninguna
implementación había conseguido.

**3. Estaba dentro de un framework poco conocido.** Una buena idea encerrada en
una herramienta con poco alcance viaja mal.

## 🎓 Las dos lecciones

**1. Tener razón pronto no basta.** Hace falta que el problema duela, que la idea
tenga nombre y que exista una implementación accesible.

**2. Los problemas de escala se resuelven primero donde la escala existe.** eBay
tenía el dolor antes que el resto del sector, y por eso construyó la solución
antes.

## 🔗 Enlaces

- Documentación oficial: <https://markojs.com/docs/>
- [Ficha de Astro](astro.md) — quien popularizó la idea · [Ficha de Qwik](qwik.md)
- [Módulo 04](../../curriculum/04-fullstack-y-renderizado.md)

## Fuentes

- [@jasonformat-islands] Miller, Jason. *Islands Architecture*, jasonformat.com, 2020 — <https://jasonformat.com/islands-architecture/>
