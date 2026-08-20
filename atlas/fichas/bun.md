# 🥟 Bun — 2022

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Bun tomó la estrategia opuesta a [Deno](deno.md): en lugar de corregir el diseño
de [Node.js](nodejs.md), **mantener la compatibilidad** y competir en velocidad de
arranque, de instalación y de ejecución.

Comparar ambas estrategias es un ejercicio útil del
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md).

| | |
|---|---|
| **Aparición** | 2022 |
| **Clasificación** | `runtime` |
| **Ecosistema** | JavaScript / TypeScript |
| **Licencia** | `MIT` |
| **Estado** | 🌊 Emergente |
| **Documentación** | <https://bun.com/docs> |

---

## 🧭 Dos estrategias de sustitución

| | Deno | Bun |
| --- | --- | --- |
| Postura | **Corregir** el diseño | **Compatibilizar** y acelerar |
| Compatibilidad con Node | Añadida después | **Objetivo desde el principio** [@bun-nodejs-apis] |
| Argumento | Seguridad y estándares | Velocidad y herramientas integradas |
| Barrera de adopción | Cambiar de hábitos | Casi ninguna |

Es una distinción que aparece una y otra vez en el Atlas:
[AngularJS](angularjs.md) → Angular corrigió y rompió; [Laminas](laminas.md)
compatibilizó; [Spring Boot](spring-boot.md) corrigió sin romper.

**La estrategia de sustitución predice la adopción tanto como la calidad
técnica.** Bun eligió la vía de menor fricción.

## 💡 Todo en un binario

Runtime, gestor de paquetes, empaquetador y ejecutor de pruebas en un solo
programa. Eso reduce el número de herramientas que instalar y mantener — y con
ellas una parte del árbol de dependencias de desarrollo.

Para el [módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md), el
argumento medible es el **tiempo de instalación y de arranque**, que afecta al
ciclo de retroalimentación y al arranque en frío. Y como siempre: hay que medirlo
en tu proyecto, con el protocolo declarado, no aceptar la cifra publicada.

## ⚖️ Lo que hay que declarar

**1. Es emergente.** Menos recorrido en producción que Node.js, y la
compatibilidad —aunque alta— no es total. Hay que probar el proyecto real, no
suponerlo.

**2. Un solo implementador.** El módulo 11 pregunta por el número de personas y
organizaciones que sostienen un proyecto; aquí la concentración es alta.

## 🎓 Las dos lecciones

**1. Compatibilizar es una estrategia de sustitución legítima y a menudo más
eficaz que corregir.** La fricción de adopción pesa más de lo que parece.

**2. Integrar las herramientas reduce dependencias de desarrollo.** Es una ventaja
de cadena de suministro, no solo de comodidad.

## 🔗 Enlaces

- Documentación oficial: <https://bun.com/docs>
- [Ficha de Node.js](nodejs.md) · [Ficha de Deno](deno.md) · [Ficha de Elysia](elysia.md)
- [Módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)

## Fuentes

- [@bun-nodejs-apis] *Node.js API compatibility*, Bun — <https://bun.com/docs/runtime/nodejs-apis>
