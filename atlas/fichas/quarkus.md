# ⚛️ Quarkus — 2019

> [⬅️ Atlas](../README.md) · [☕ Ecosistema JVM](../ecosistemas/jvm.md) · [🗂️ Índice](../frameworks.md)

Quarkus existe por un cambio en el entorno, no por una moda: cuando las
aplicaciones pasaron a vivir en contenedores efímeros y funciones que arrancan
bajo demanda, **el arranque lento de la JVM dejó de ser un detalle y pasó a ser
una barrera**.

> **🎯 Por qué está en este programa**
>
> Porque es un caso limpio de cómo **el entorno de ejecución cambia los requisitos
> del framework** ([módulo 12](../../curriculum/12-producto-final.md)). Nada en
> Spring Boot estaba mal; cambió el sitio donde se ejecuta.

| | |
|---|---|
| **Aparición** | 2019, impulsado por Red Hat |
| **Clasificación** | `application-framework` |
| **Ecosistema** | JVM (Java, Kotlin) |
| **Licencia** | `Apache-2.0` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://quarkus.io/guides/> |

---

## 📜 De dónde viene el coste

Un framework tradicional de la JVM hace mucho trabajo **al arrancar**: escanear
clases, leer anotaciones por reflexión, construir el grafo de objetos, preparar
proxies. En un servidor que arranca una vez y vive meses, ese coste se amortiza.
En un contenedor que arranca cien veces al día, o en una función que arranca por
petición, no.

## 💡 La idea: mover trabajo al momento de construir

Quarkus adelanta a la **compilación** casi todo lo que otros hacen al arrancar:
descubrimiento de componentes, procesamiento de anotaciones, construcción del
grafo. Lo que queda para el arranque es poco.

Eso además hace posible compilar a **imagen nativa**, sin JVM, con tiempos de
arranque de milisegundos y consumo de memoria mucho menor.

| | Modelo clásico | Quarkus |
| --- | --- | --- |
| Cuándo se resuelve la inyección | Al arrancar, por reflexión | Al compilar |
| Arranque | Segundos | Milisegundos (nativo) |
| Memoria en reposo | Alta | Baja |
| Coste | Ninguno en construcción | Compilación más lenta y más restricciones |

El compromiso es exactamente el de [Svelte](svelte.md) en el frontend: **cambiar
coste de ejecución por coste y dependencia de la fase de construcción**. Que la
misma decisión aparezca en dos ecosistemas tan distintos es una de las
observaciones que el Atlas quiere hacer visibles.

## ⚖️ Lo que se paga

**1. La reflexión en ejecución deja de ser libre.** Una biblioteca que descubre
clases dinámicamente puede no funcionar en imagen nativa sin configuración
explícita. Eso restringe el ecosistema utilizable.

**2. Compilar nativo es lento.** El ciclo de desarrollo se hace en JVM y la
imagen nativa se reserva para la entrega, lo que significa **dos modos de
ejecución** que hay que probar por separado — con el aviso del
[módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md): nunca
compares uno con el otro.

**3. Ecosistema menor que el de Spring.** Menos ejemplos, menos personas, menos
respuestas publicadas. El [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)
lo puntúa como capacidades del equipo.

## 🎓 Las tres lecciones

**1. El entorno de ejecución cambia los requisitos.** Un framework excelente para
servidores de larga vida puede ser inadecuado para funciones efímeras sin haber
empeorado en nada.

**2. Mover trabajo a la compilación es un patrón, no una novedad.** Aparece en
Quarkus, en Micronaut, en Svelte y en Angular. Reconocerlo abarata entender el
siguiente.

**3. Lo que se gana en arranque se paga en flexibilidad dinámica.** Es un
intercambio, y hay que declararlo.

## 🔗 Enlaces

- Documentación oficial: <https://quarkus.io/guides/>
- [Ficha de Spring Boot](spring-boot.md) · [Ficha de Micronaut](micronaut.md) · [Ficha de Svelte](svelte.md)
- [Ecosistema JVM](../ecosistemas/jvm.md)

## Fuentes

- [@walls-spring-in-action] Walls, Craig. *Spring in Action*, 6.ª ed. Manning Publications, 2022. ISBN 9781617297571 — <https://openlibrary.org/isbn/9781617297571>
- [@poulton-docker] Poulton, Nigel. *Docker Deep Dive*. Packt Publishing, 2020. ISBN 9781800565135 — <https://openlibrary.org/isbn/9781800565135>
