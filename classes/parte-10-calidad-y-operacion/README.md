# Parte 10 — Calidad, rendimiento y operación

> [⬅️ Parte 9](../parte-9-movil-escritorio-y-sin-conexion/README.md) · [🎓 Todas las clases](../README.md) · [📖 Glosario](../../glosario/README.md) · [Parte 11 ➡️](../parte-11-legado-migracion-y-decision/README.md)

**Lo que separa un proyecto que funciona en tu máquina de uno que funciona en producción.**

**Clases 124 a 137** · 14 en total · 0 construidas · 9 tecnologías en juego.

## 🧭 De qué va esta parte

Catorce clases sobre lo que separa un proyecto que funciona en tu máquina de un sistema que **alguien puede operar a las tres de la mañana**.

Primero las pruebas: no como obligación moral sino como decisión de coste — qué se prueba rápido y aislado, qué exige una base real, y qué solo se puede comprobar de extremo a extremo. Después la observabilidad, que son tres cosas distintas y no una: registros, métricas y trazas responden a preguntas diferentes.

Y al final lo que decide si el sistema se puede desplegar sin miedo: configuración fuera del artefacto, salud y preparación bien distinguidas, arranque en frío medido, y la regla que ahorra más trabajo inútil que ninguna otra — **medir antes de optimizar**.

## 🎒 Qué da por sabido

- Las partes 1 a 5. Se prueba y se opera lo que ya existe.
- Que habrá más de un entorno y que la configuración no puede estar en el código.

## 🎯 Qué sabrás hacer al terminarla

- Escribir una prueba que falle por la razón correcta, y reconocer cuando pasa por la equivocada.
- Repartir el esfuerzo entre los tres niveles de prueba con un criterio de coste.
- Sustituir una dependencia por un doble sin que la prueba deje de significar algo.
- Emitir registros estructurados, métricas y trazas, y decir qué pregunta contesta cada uno.
- Distinguir salud de preparación, y explicar qué rompe confundirlas.
- Empaquetar una vez y desplegar en varios entornos cambiando solo la configuración.
- Medir antes de optimizar, y presentar la medición por percentiles en lugar de por media.

## 🧵 Por qué en este orden

Las seis primeras son las pruebas, de la más pequeña a la más cara: primera prueba, pirámide, dobles, integración con base real, extremo a extremo y contrato.

Las tres siguientes son la observabilidad: registros, métricas y trazas.

Las cinco últimas son la operación: salud, configuración, empaquetado, arranque en frío y medición.

## 📚 Las clases

| # | Clase | Qué resuelve | Nivel | Estado |
| --- | --- | --- | --- | --- |
| [124](124-la-primera-prueba/README.md) | [La primera prueba](124-la-primera-prueba/README.md) | Escribir una prueba que falle por la razón correcta. | 🟢 introductorio | 🚧 Esqueleto |
| [125](125-la-piramide-de-pruebas/README.md) | [La pirámide de pruebas](125-la-piramide-de-pruebas/README.md) | Repartir el esfuerzo entre niveles según lo que cada uno detecta. | 🟡 intermedio | 🚧 Esqueleto |
| [126](126-dobles-de-prueba/README.md) | [Dobles de prueba](126-dobles-de-prueba/README.md) | Elegir entre falso, sustituto y simulacro sabiendo qué acopla cada uno. | 🟡 intermedio | 🚧 Esqueleto |
| [127](127-integracion-con-base-real/README.md) | [Integración con base real](127-integracion-con-base-real/README.md) | Probar contra el motor de verdad sin depender de una máquina concreta. | 🟡 intermedio | 🚧 Esqueleto |
| [128](128-pruebas-de-extremo-a-extremo/README.md) | [Pruebas de extremo a extremo](128-pruebas-de-extremo-a-extremo/README.md) | Probar el recorrido completo sin que sea inestable. | 🔴 avanzado | 🚧 Esqueleto |
| [129](129-pruebas-de-contrato/README.md) | [Pruebas de contrato](129-pruebas-de-contrato/README.md) | Verificar que cliente y servidor siguen entendiéndose. | 🔴 avanzado | 🚧 Esqueleto |
| [130](130-registro-estructurado/README.md) | [Registro estructurado](130-registro-estructurado/README.md) | Emitir registros que una máquina pueda consultar. | 🟡 intermedio | 🚧 Esqueleto |
| [131](131-metricas/README.md) | [Métricas](131-metricas/README.md) | Medir lo que importa: tasa, error y latencia. | 🟡 intermedio | 🚧 Esqueleto |
| [132](132-trazas/README.md) | [Trazas](132-trazas/README.md) | Seguir una petición a través de varios procesos. | 🔴 avanzado | 🚧 Esqueleto |
| [133](133-salud-y-preparacion/README.md) | [Salud y preparación](133-salud-y-preparacion/README.md) | Distinguir estar vivo de estar listo para recibir tráfico. | 🟡 intermedio | 🚧 Esqueleto |
| [134](134-configuracion-por-entorno/README.md) | [Configuración por entorno](134-configuracion-por-entorno/README.md) | Un artefacto, varios entornos. | 🟡 intermedio | 🚧 Esqueleto |
| [135](135-empaquetado-y-despliegue/README.md) | [Empaquetado y despliegue](135-empaquetado-y-despliegue/README.md) | Producir un artefacto reproducible. | 🟡 intermedio | 🚧 Esqueleto |
| [136](136-arranque-en-frio/README.md) | [Arranque en frío](136-arranque-en-frio/README.md) | Medir lo que tarda en estar listo y por qué. | 🔴 avanzado | 🚧 Esqueleto |
| [137](137-medir-antes-de-optimizar/README.md) | [Medir antes de optimizar](137-medir-antes-de-optimizar/README.md) | Encontrar el cuello real en lugar del sospechoso habitual. | 🔴 avanzado | 🚧 Esqueleto |

## 🎬 Las tecnologías que aparecen

Entre paréntesis, en cuántas clases de esta parte interviene cada una. **Estar aquí no es una recomendación**: es que el problema de esa clase existe de verdad para esa tecnología.

| Ecosistema | Tecnologías |
| --- | --- |
| **JavaScript/TypeScript** | [React](../../atlas/fichas/react.md) (1), [SolidJS](../../atlas/fichas/solid.md) (1), [Svelte](../../atlas/fichas/svelte.md) (1), [Vue](../../atlas/fichas/vue.md) (1) |
| **JVM** | [Spring Boot](../../atlas/fichas/spring-boot.md) (13), [Quarkus](../../atlas/fichas/quarkus.md) (1) |
| **.NET** | [ASP.NET Core](../../atlas/fichas/aspnet-core.md) (13) |
| **Node.js** | [Express](../../atlas/fichas/express.md) (13) |
| **Python** | [FastAPI](../../atlas/fichas/fastapi.md) (13) |

## 📖 Las palabras que esta parte define

[**Pirámide de pruebas**](../../glosario/README.md#pirámide-de-pruebas) · [**Doble de prueba**](../../glosario/README.md#doble-de-prueba) · [**Prueba de contrato**](../../glosario/README.md#prueba-de-contrato) · [**Registro estructurado**](../../glosario/README.md#registro-estructurado) · [**Métrica**](../../glosario/README.md#métrica) · [**Traza**](../../glosario/README.md#traza) · [**Salud y preparación**](../../glosario/README.md#salud-y-preparación) · [**Empaquetado**](../../glosario/README.md#empaquetado) · [**Arranque en frío**](../../glosario/README.md#arranque-en-frío) · [**Medir antes de optimizar**](../../glosario/README.md#medir-antes-de-optimizar)

Todas, con su definición, en el [glosario](../../glosario/README.md).

## ✅ Cómo se ejecuta una clase de esta parte

```bash
node scripts/run-class.mjs 124
```

El verificador arranca cada implementación, la somete a su `contrato.json` y **declara cuáles omitió** por no encontrar su cadena de herramientas. Si te faltan cadenas, `node scripts/doctor.mjs` dice cuáles y cómo se instalan.

## ➡️ Y después

La parte 11 es la última y la más difícil: sistemas que ya existen, migraciones que no pueden parar y decisiones que hay que defender.
