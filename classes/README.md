# 🎓 Clases

> [⬅️ Repositorio](../README.md) · [🚀 Empezar](../empezar/README.md) · [🗺️ Atlas](../atlas/README.md) · [📚 Programa](../curriculum/README.md)

Aprende el problema una vez. Reconoce cómo lo resuelve cada framework, y por qué sí o por qué no.

**149 clases** en **12 partes**, de lo más simple a lo más
avanzado. 91 construidas, 58 en esqueleto.

Antes de la primera: [**empezar/**](../empezar/README.md) instala las cadenas de
herramientas y explica los conocimientos previos que estas clases dan por
sabidos. `node scripts/doctor.mjs` dice cuántas implementaciones puedes
ejecutar hoy en tu máquina.

## 🧭 El método

Cada clase plantea UNA situación, la fija en un contrato verificable y la resuelve en todos los frameworks de su elenco. El código es real y ejecutable; el verificador ejecuta los que encuentre instalados y declara los que omitió.

Cada clase tiene la misma anatomía:

| Archivo | Qué contiene |
| --- | --- |
| `README.md` | La clase: situación, modelo, implementaciones a la vista, comparación y decisión |
| `contrato.json` | Los casos verificables. Es lo que hace comparable el ejercicio |
| `implementaciones/<framework>/` | El código real de cada framework del elenco |
| `porque-si-porque-no.md` | Por qué esta solución es natural en un framework y forzada en otro |

## 🎬 Los elencos

Los lenguajes son intercambiables: cualquiera suma dos números. **Los frameworks
no.** Spring Boot no implementa una clase de reactividad en el cliente y React no
implementa una de migraciones. Por eso cada clase declara su **elenco**: los
frameworks para los que ese problema tiene sentido.

| Pista | Título | De qué trata | Frameworks |
| --- | --- | --- | --- |
| `backend` | Backend y API | El servidor: recibir una petición, decidir, responder. | 14 |
| `frontend` | Interfaz y estado | El navegador: pintar, reaccionar al usuario, mantener estado. | 10 |
| `fullstack` | Full-stack y renderizado | Los dos lados a la vez: dónde se genera el HTML y quién carga los datos. | 8 |
| `datos` | Persistencia | Hablar con la base de datos sin que el dominio se contamine. | 9 |
| `movil` | Móvil y escritorio | Salir del navegador: una base de código, varias plataformas. | 9 |
| `plataforma` | Plataforma y operación | Lo que no es un framework y aun así decide tu arquitectura. | 6 |

## 📚 Las partes

| # | Parte | Clases | Total |
| --- | --- | --- | --- |
| **0** | [El método: qué es un framework y cómo se compara](parte-0-el-metodo/README.md) | 1–10 | 10 |
| **1** | [Responder: lo primero que hace cualquier framework](parte-1-responder/README.md) | 11–25 | 15 |
| **2** | [La tubería: middleware, filtros e interceptores](parte-2-la-tuberia/README.md) | 26–38 | 13 |
| **3** | [Validación y contrato](parte-3-validacion-y-contrato/README.md) | 39–50 | 12 |
| **4** | [Datos: del SQL a mano al dominio limpio](parte-4-datos/README.md) | 51–65 | 15 |
| **5** | [Identidad y seguridad](parte-5-identidad-y-seguridad/README.md) | 66–78 | 13 |
| **6** | [La interfaz: del HTML del servidor al componente](parte-6-la-interfaz/README.md) | 79–92 | 14 |
| **7** | [Renderizado y full-stack](parte-7-renderizado-y-fullstack/README.md) | 93–104 | 12 |
| **8** | [Tiempo real y trabajo en segundo plano](parte-8-tiempo-real-y-segundo-plano/README.md) | 105–113 | 9 |
| **9** | [Móvil, escritorio y sin conexión](parte-9-movil-escritorio-y-sin-conexion/README.md) | 114–123 | 10 |
| **10** | [Calidad, rendimiento y operación](parte-10-calidad-y-operacion/README.md) | 124–137 | 14 |
| **11** | [Legado, migración y decisión](parte-11-legado-migracion-y-decision/README.md) | 138–149 | 12 |

## ✅ Verificación

```bash
node scripts/run-class.mjs 011
```

El verificador ejecuta cada implementación contra `contrato.json` y **declara
cuáles omitió** por no encontrar su cadena de herramientas instalada. Un
resultado verde nunca significa «todo pasó»: significa «esto pasó, esto se
omitió».
