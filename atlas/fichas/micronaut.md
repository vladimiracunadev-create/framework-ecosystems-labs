# 🔬 Micronaut — 2018

> [⬅️ Atlas](../README.md) · [☕ Ecosistema JVM](../ecosistemas/jvm.md) · [🗂️ Índice](../frameworks.md)

Micronaut ataca el mismo coste que [Quarkus](quarkus.md) —el arranque de la
JVM— con una decisión más quirúrgica: **resolver la inyección de dependencias en
tiempo de compilación y eliminar la reflexión en ejecución**.

> **🎯 Por qué está en este programa**
>
> Porque muestra que la inversión de control del
> [módulo 02](../../curriculum/02-arquitectura-de-frameworks.md) **no obliga a
> resolver el grafo en ejecución**. El mismo patrón, con el trabajo en otro
> momento, y con consecuencias medibles.

| | |
|---|---|
| **Aparición** | 2018, creado por el equipo de Grails (Object Computing) |
| **Clasificación** | `application-framework` |
| **Ecosistema** | JVM (Java, Kotlin, Groovy) |
| **Licencia** | `Apache-2.0` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://docs.micronaut.io/latest/guide/> |

---

## 💡 Inyección sin reflexión

Un contenedor clásico lee las anotaciones **al arrancar**, por reflexión, y
construye el grafo. Micronaut lo hace en la compilación: un procesador de
anotaciones **genera el código de conexión** como si lo hubieras escrito a mano.

| Consecuencia | Por qué |
| --- | --- |
| Arranque rápido | No hay que escanear ni reflexionar |
| Menos memoria | No hay metadatos de reflexión cargados |
| Errores antes | Una dependencia que falta es un **error de compilación**, no de arranque |
| Imagen nativa sencilla | Sin reflexión, casi no hay configuración extra |

La tercera fila es la más interesante para el módulo 02 y la que menos se
menciona: **un ciclo de dependencias o una colaboración sin registrar se detectan
al compilar**, no cuando alguien despliega. Es exactamente lo que la referencia
del módulo 02 consigue a mano al detectar ciclos, elevado a propiedad del
framework [@seemann-deursen-di].

## ⚖️ El compromiso

**Se gana** arranque, memoria y detección temprana de errores de cableado.

**Se paga**:

1. **Compilación más lenta**, porque el procesador de anotaciones trabaja en cada
   construcción.
2. **Menos dinamismo**: registrar componentes en ejecución, en función de la
   configuración, deja de ser trivial.
3. **Ecosistema menor** que el de Spring, con la misma consecuencia de siempre
   para el [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md).

## 🧭 Micronaut y Quarkus, comparados

| | Micronaut | Quarkus |
| --- | --- | --- |
| Enfoque | Inyección en compilación, sin reflexión | Mover al momento de construir todo lo posible |
| Origen | Equipo de Grails | Red Hat |
| Punto fuerte | Modelo muy predecible | Ecosistema de extensiones amplio |
| Ambos | Arranque rápido e imagen nativa viable | |

No son rivales de filosofías opuestas: son dos ataques al mismo coste
estructural de la plataforma. Que aparecieran con un año de diferencia dice que
el problema era real y estaba maduro.

## 🎓 Las tres lecciones

**1. El patrón no obliga al momento.** La inversión de control se puede resolver
al compilar, al arrancar o al pedirlo. La elección tiene consecuencias medibles.

**2. Detectar el error de cableado al compilar es una mejora de calidad, no solo
de velocidad.**

**3. Dos proyectos independientes atacando el mismo coste es señal de que el
coste era estructural**, no una queja aislada.

## 🔗 Enlaces

- Documentación oficial: <https://docs.micronaut.io/latest/guide/>
- [Ficha de Quarkus](quarkus.md) · [Ficha de Spring Boot](spring-boot.md)
- [Módulo 02](../../curriculum/02-arquitectura-de-frameworks.md)

## Fuentes

- [@seemann-deursen-di] Seemann, Mark; van Deursen, Steven. *Dependency Injection Principles, Practices, and Patterns*. Manning Publications, 2019. ISBN 9781617294730 — <https://openlibrary.org/isbn/9781617294730>
