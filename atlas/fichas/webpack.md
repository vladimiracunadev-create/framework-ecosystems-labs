# 📦 webpack — 2012

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

webpack hizo posible el frontend moderno con una idea que hoy parece obvia:
**tratar cualquier recurso como un módulo**. No solo JavaScript — también CSS,
imágenes, fuentes y tipos.

Su complejidad de configuración, célebre y merecida, es lo que motivó la
generación siguiente de herramientas.

| | |
|---|---|
| **Aparición** | 2012, creado por Tobias Koppers |
| **Clasificación** | `build-tool` |
| **Ecosistema** | JavaScript |
| **Licencia** | `MIT` |
| **Gobierno** | OpenJS Foundation |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://webpack.js.org/concepts/> |

---

## 📜 El problema que resolvió

Antes de webpack, una página cargaba decenas de etiquetas `<script>` en el orden
correcto —a mano— y el CSS y las imágenes vivían aparte. No había módulos en el
navegador, y las dependencias entre archivos eran conocimiento tribal.

webpack construyó el **grafo de dependencias** a partir de las importaciones y
produjo un paquete con todo en el orden correcto. Y luego dio el paso que lo
distinguió: **cargadores** que permiten importar cualquier cosa.

```javascript
import estilos from "./panel.css";   // ¿importar CSS? En 2012 era una idea rara
import icono from "./icono.svg";
```

Esa idea —el recurso como módulo— es la base de los componentes con estilos
encapsulados, de las imágenes optimizadas en la construcción y de casi todo el
flujo de trabajo actual.

## ⚖️ El coste: configurabilidad total

webpack puede hacer casi cualquier cosa, y **configurarlo era un oficio**.
Aparecieron puestos dedicados a mantener la configuración de construcción de un
proyecto, lo que es en sí un síntoma.

Es un caso de libro de **complejidad accidental** en el sentido del
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md): conocimiento que
hay que adquirir, que no viaja fuera de la herramienta, y que además había que
mantener al día [@wagner-web-performance].

[Vite](vite.md) atacó exactamente eso: menos configuración, valores por omisión
razonables, y una decisión de arquitectura distinta en desarrollo.

## 🧭 Su lugar hoy

Sigue siendo la herramienta más capaz para casos complejos —federación de
módulos, construcciones muy personalizadas, proyectos heredados grandes— y ha
dejado de ser la opción por omisión para empezar.

Para un proyecto existente sobre webpack, el
[módulo 10](../../curriculum/10-modernizacion-y-migracion.md) sugiere lo de
siempre: migrar tiene coste y quedarse también. La pregunta es cuál es mayor, y
se responde con datos —tiempos de construcción, incidencias— no con preferencia.

## 🎓 Las dos lecciones

**1. La flexibilidad total tiene un precio en conocimiento.** Cuando configurar
una herramienta se convierte en un puesto de trabajo, la herramienta tiene un
problema de diseño.

**2. Una idea puede sobrevivir a su implementación.** «Cualquier recurso es un
módulo» está en todas las herramientas actuales; la configuración de webpack, no.

## 🔗 Enlaces

- Documentación oficial: <https://webpack.js.org/concepts/>
- [Ficha de Vite](vite.md) · [Ficha de esbuild](esbuild.md) · [Ficha de Rollup](rollup.md)
- [Módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)

## Fuentes

- [@wagner-web-performance] Wagner, Jeremy. *Web Performance in Action*. Manning Publications, 2016. ISBN 9781638353768 — <https://openlibrary.org/isbn/9781638353768>
