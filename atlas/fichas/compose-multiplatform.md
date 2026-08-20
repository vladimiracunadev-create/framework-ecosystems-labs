# 🧩 Compose Multiplatform — 2021

> [⬅️ Atlas](../README.md) · [☕ Ecosistema JVM](../ecosistemas/jvm.md) · [🗂️ Índice](../frameworks.md)

Compose Multiplatform lleva el modelo de [Jetpack Compose](jetpack-compose.md)
fuera de Android: escritorio, iOS y web, compartiendo el código de interfaz.

Su interés para el Atlas está en el **reparto**: no propone compartirlo todo,
sino distinguir con precisión qué se comparte y qué no.

| | |
|---|---|
| **Aparición** | 2021, desarrollado por JetBrains |
| **Clasificación** | `ui-toolkit` |
| **Ecosistema** | Kotlin |
| **Licencia** | `Apache-2.0` |
| **Estado** | 🌊 Emergente |
| **Documentación** | <https://www.jetbrains.com/compose-multiplatform/> |

---

## 💡 Compartir por capas, no por todo

| Capa | ¿Se comparte? |
| --- | --- |
| **Dominio y casos de uso** | Sí, casi siempre |
| **Acceso a datos y red** | Sí, con abstracciones por plataforma |
| **Interfaz** | Sí con Compose Multiplatform; **es la parte nueva** |
| **Capacidades del dispositivo** | No: cámara, notificaciones, biometría van por plataforma |

La primera fila es la más importante y la más ignorada: **compartir el dominio no
necesita ningún framework de interfaz multiplataforma**. Es lo que el
[módulo 02](../../curriculum/02-arquitectura-de-frameworks.md) llama dominio
independiente, y da la mayor parte del beneficio con el menor riesgo.

Eso convierte a Compose Multiplatform en una decisión **incremental**: se puede
compartir dominio primero y evaluar después si compartir también la interfaz. Muy
pocas tecnologías multiplataforma permiten ese reparto.

## ⚖️ Dónde se sitúa

| | Compose MP | [Flutter](flutter.md) | [React Native](react-native.md) |
| --- | --- | --- | --- |
| Interfaz | Dibujo propio | Dibujo propio | Componentes nativos |
| Lenguaje | Kotlin | Dart | TypeScript |
| Madurez por destino | Android alta; iOS y web menores | Alta en móvil | Alta en móvil |
| Reparto por capas | Explícito y gradual | Todo o nada | Todo o nada |

La fila de madurez es la que hay que declarar en el registro de decisión del
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md): **no todos los
destinos están al mismo nivel**, y presentarlo como uniforme sería inexacto.

## 🎓 Las dos lecciones

**1. Compartir el dominio es la parte barata y de mayor retorno.** No hace falta
un framework multiplataforma para conseguirla: hace falta separar el dominio.

**2. «Multiplataforma» rara vez significa lo mismo en todos los destinos.** La
matriz de decisión necesita una fila por destino, no una casilla general.

## 🔗 Enlaces

- Documentación oficial: <https://www.jetbrains.com/compose-multiplatform/>
- [Ficha de Jetpack Compose](jetpack-compose.md) · [Ficha de Flutter](flutter.md) · [Ficha de React Native](react-native.md)
- [Módulo 09](../../curriculum/09-movil-escritorio-y-offline.md)

## Fuentes

- [@martin-clean-architecture] Martin, Robert C. *Clean Architecture*. Pearson, 2017. ISBN 9780134494166 — <https://openlibrary.org/isbn/9780134494166>
