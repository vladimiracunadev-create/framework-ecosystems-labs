# 🐧 GTK — 1998

> [⬅️ Atlas](../README.md) · [🖥️ Escritorio nativo](../ecosistemas/nativo.md) · [🗂️ Índice](../frameworks.md)

GTK es la base de buena parte del escritorio libre y, como [Qt](qt.md), lleva más
de un cuarto de siglo en producción. Su rasgo distintivo es otro: **está escrito
en C y se usa desde muchísimos lenguajes**.

| | |
|---|---|
| **Aparición** | 1998 (extraído del programa de edición de imagen GIMP) |
| **Clasificación** | `ui-toolkit` |
| **Ecosistema** | C, con enlaces a Python, Rust, Vala, JavaScript y más |
| **Licencia** | `LGPL-2.1-or-later` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://docs.gtk.org/> |

---

## 💡 C como lengua franca

Escribir la biblioteca en C tiene una consecuencia que explica su alcance: **casi
todos los lenguajes saben llamar a C**. Eso convierte a GTK en un toolkit
utilizable desde Python, Rust, Vala o JavaScript sin reimplementarlo.

Es la misma estrategia que hace de C el sustrato de tantas cosas, y una lección
de diseño de API: **cuanto más pequeño y estable es el punto de acuerdo, más
lejos llega**. La [ficha de chi](chi.md) hace la misma observación en Go con las
interfaces pequeñas.

## ⚖️ LGPL: qué obliga exactamente

GTK usa LGPL, que es copyleft **débil**: se puede enlazar desde software
propietario, siempre que el usuario pueda sustituir la biblioteca por otra
versión. En la práctica: enlazado dinámico sí, estático con condiciones.

Comparado con la GPL de [WordPress](wordpress.md) —que alcanza al trabajo
derivado— y con la MIT de la mayoría del catálogo, GTK ocupa el punto intermedio.
Tres niveles de obligación que el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) obliga a distinguir
por su identificador exacto [@spdx-licenses].

## 🧭 Su terreno

Aplicaciones de escritorio en Linux, herramientas del propio entorno de
escritorio y software que necesita integrarse con él. Fuera de ahí compite peor
que Qt, cuyo soporte multiplataforma es más completo.

Y comparte con Qt las dos lecciones de su ecosistema: **treinta años de
horizonte** y **la licencia como criterio de decisión**, no como trámite.

## 🎓 Las dos lecciones

**1. Un punto de acuerdo pequeño y estable llega más lejos.** C como interfaz
hizo a GTK utilizable desde media docena de lenguajes.

**2. Copyleft débil, copyleft fuerte y permisiva son tres cosas distintas.**
Distinguirlas por su identificador SPDX es parte de decidir bien.

## 🔗 Enlaces

- Documentación oficial: <https://docs.gtk.org/>
- [Ficha de Qt](qt.md) · [Ficha de WordPress](wordpress.md) — el copyleft fuerte
- [Módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)

## Fuentes

- [@spdx-licenses] SPDX License List, Linux Foundation — <https://spdx.org/licenses/>
