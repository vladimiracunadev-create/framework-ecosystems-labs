# 🔧 Nitro

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Nitro es el **motor de servidor** que [Nuxt](nuxt.md) extrajo de sí mismo y que
hoy usan también [SolidStart](solidstart.md) y [Analog](analog.md). Es un caso de
libro de una pieza que se vuelve infraestructura compartida entre proyectos que
compiten.

| | |
|---|---|
| **Aparición** | 2021, extraído de Nuxt |
| **Clasificación** | `server-toolkit` |
| **Ecosistema** | JavaScript / TypeScript |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://nitro.build/guide> |

---

## 💡 Adaptadores de despliegue

El problema que resuelve: cada destino de despliegue —un servidor propio, una
función sin servidor, un entorno de borde, un contenedor— espera un formato y un
punto de entrada distintos.

Nitro construye **una vez** y produce la salida adecuada para el destino elegido.
Cambiar de proveedor es cambiar un adaptador, no reescribir.

Para el [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) es
exactamente lo que se busca al preguntar «¿qué coste tiene salir de aquí?»: la
respuesta pasa de «reescribir la capa de servidor» a «cambiar una opción».

## 🧭 El patrón que representa

| Pieza | Nació dentro de | Hoy la usan |
| --- | --- | --- |
| **Nitro** | Nuxt | SolidStart, Analog |
| [Rollup](rollup.md) | Proyecto propio | Vite |
| [esbuild](esbuild.md) | Proyecto propio | Vite y otros |
| [Symfony](symfony.md) (componentes) | Framework Symfony | Laravel, Drupal |
| [Starlette](starlette.md) | Proyecto propio | FastAPI |

Cinco casos del mismo fenómeno, en tres ecosistemas. **Lo más influyente rara vez
es lo más visible**, y evaluar la salud de un framework sin mirar estas piezas es
evaluar la mitad.

## 🎓 Las dos lecciones

**1. Extraer una capa la convierte en bien común.** Y convierte a su mantenedor
en dependencia crítica de proyectos que compiten con él.

**2. Los adaptadores de despliegue son estrategia de salida.** Es una propiedad
de diseño con efecto directo en la matriz de decisión.

## 🔗 Enlaces

- Documentación oficial: <https://nitro.build/guide>
- [Ficha de Nuxt](nuxt.md) · [Ficha de SolidStart](solidstart.md) · [Ficha de Analog](analog.md)
- [Módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)

## Fuentes

- [@twelve-factor] The Twelve-Factor App — <https://12factor.net/>
