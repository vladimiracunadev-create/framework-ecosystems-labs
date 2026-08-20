# 🖥️ Escritorio nativo — C y C++

> [⬅️ Atlas](../README.md) · [🗂️ Índice](../frameworks.md) · [🧭 Taxonomía](../../docs/TAXONOMY.md)

**Los frameworks de interfaz más longevos del catálogo que siguen en uso.** Qt es
de 1995 y GTK de 1998: llevan tres décadas en producción, más que la vida entera
de la mayoría de las entradas del Atlas. Están aquí por eso, y porque enseñan dos
cosas que el resto del catálogo esconde.

## Lo que enseñan y nadie más enseña

**1. Que un framework puede durar treinta años.** En un campo donde «vigente»
suele significar cinco años, Qt y GTK obligan a recalibrar. Cuando el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) pregunta por el
horizonte del producto, estas dos son la prueba de que un horizonte de décadas es
posible — y de lo que cuesta: compatibilidad hacia atrás mantenida a pulso,
migraciones mayores muy espaciadas y bien documentadas.

**2. Que la licencia puede ser el factor decisivo.** Qt tiene **licencia dual**:
libre bajo LGPL o comercial. La elección entre una y otra determina si puedes
enlazar estáticamente, si debes publicar cambios y cuánto pagas. Es el ejemplo
canónico de que la licencia no es un trámite del final sino una entrada de la
matriz de decisión, exactamente como enseña el módulo 11 con la lista SPDX.

## Por qué este ecosistema es como es

| Condición de la plataforma | Consecuencia en sus frameworks |
| --- | --- |
| **Sin runtime que instalar**; se compila para cada plataforma | Distribución por plataforma, no un artefacto único |
| **Gestión manual de memoria** en el lenguaje base | El framework aporta su propio modelo de propiedad de objetos |
| Fuerte presencia en **sistemas embebidos e industriales** | Ciclos de vida de producto de diez o veinte años |
| Enlaces a **otros lenguajes** (Python, Rust, C#) | Mucha gente los usa sin escribir C++ |

## El contraste con la generación web

| | Qt / GTK | Electron | Tauri |
| --- | --- | --- | --- |
| Interfaz | Componentes propios compilados | Navegador incrustado | Motor web del sistema |
| Tamaño típico | Decenas de MB | Más de 100 MB | Unos pocos MB |
| Personal necesario | Especialistas en C++ | Cualquier equipo web | Equipo web más algo de Rust |
| Longevidad demostrada | Décadas | Una década | Reciente |
| Diferencias entre plataformas | Las absorbe el framework | Ninguna: el navegador es el mismo | Las hereda del sistema |

Ninguna columna gana. La pregunta del módulo 11 es cuál de esos cuatro costes
—tamaño, personal, longevidad, diferencias— puede asumir tu producto.

## Las 2 tecnologías

<!-- generado:tabla-ecosistema nativo -->
| Tecnología | Clasificación | Desde | Era | Estado | Licencia | Documentación |
| --- | --- | ---: | --- | --- | --- | --- |
| [**GTK**](../fichas/gtk.md) | `ui-toolkit` | 1998 | 🏛️ Clásico | 🟢 activo | `LGPL-2.1-or-later` | [oficial](https://docs.gtk.org/) |
| [**Qt**](../fichas/qt.md) | `ui-framework` | 1995 | 🏛️ Clásico | 🟢 activo | `LGPL-3.0-only` | [oficial](https://doc.qt.io/) |
<!-- fin -->

## Qué aportó cada una

<!-- generado:notas-ecosistema nativo -->
- **GTK** — Base de gran parte del escritorio libre, con enlaces a numerosos lenguajes.
- **Qt** — El framework de interfaz multiplataforma más longevo en uso. Su licencia dual libre y comercial es el ejemplo canónico de esa estrategia.
<!-- fin -->
