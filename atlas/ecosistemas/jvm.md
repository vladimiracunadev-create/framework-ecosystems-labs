# ☕ JVM — Java, Kotlin, Scala y Groovy

> [⬅️ Atlas](../README.md) · [🗂️ Índice](../frameworks.md) · [🧭 Taxonomía](../../docs/TAXONOMY.md)

El ecosistema con los **horizontes de mantenimiento más largos** del catálogo y
el único donde una parte importante de lo que se usa son **especificaciones con
varias implementaciones**, no proyectos únicos. Eso cambia por completo el
análisis de gobierno del [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md).

## Por qué este ecosistema es como es

| Condición de la plataforma | Consecuencia en sus frameworks |
| --- | --- |
| **Compatibilidad binaria** tomada muy en serio durante décadas | Código de 2008 sigue ejecutándose; la deuda también sigue viva |
| **Reflexión y anotaciones** potentes en ejecución | La inyección de dependencias por contenedor nació y maduró aquí |
| Arranque de la máquina virtual **históricamente lento** | Toda una generación (Quarkus, Micronaut) existe para atacar ese coste |
| Estándares con **múltiples implementaciones** (Jakarta EE) | Puedes cambiar de proveedor sin reescribir; algo casi imposible en otros ecosistemas |
| Presencia dominante en **banca, seguros y administración** | La documentación de migración es mejor que en ningún otro ecosistema |

## La línea del tiempo

**2000-2003 · Struts y el peso del estándar.** **Apache Struts** fue el
modelo-vista-controlador de referencia de la empresa Java. Sus vulnerabilidades
críticas —y las brechas de datos asociadas— son el caso de estudio obligado del
[módulo 07](../../curriculum/07-identidad-y-seguridad.md) sobre cadena de
suministro: el problema no fue el fallo, sino el tiempo que tardaron las
organizaciones en actualizar.

**2003 · Spring, la alternativa ligera.** Nació como reacción a la complejidad de
los estándares empresariales de la época. Popularizó la **inversión de control** y
la **inyección de dependencias** fuera del mundo académico, y su artículo de
referencia sigue siendo el mejor punto de entrada al concepto
[@fowler-injection]. La ironía es conocida: acabó siendo famoso por su propia
configuración XML.

**2014 · Spring Boot.** Autoconfiguración y servidor incrustado. Convirtió un
framework célebre por sus archivos de configuración en uno de arranque
inmediato. Hoy es el estándar de facto del backend Java.

**2018-2019 · La respuesta al arranque en frío.** Con contenedores y funciones
efímeras, tardar segundos en arrancar dejó de ser aceptable. **Micronaut** resuelve
la inyección en **tiempo de compilación**, sin reflexión. **Quarkus** mueve todo lo
posible al momento de construir para permitir imágenes nativas. Ambos atacan un
coste que era estructural de la plataforma, no de los frameworks.

**Kotlin y la segunda vida.** **Ktor** aprovecha las corrutinas del lenguaje y
construye todo por plugins explícitos: la filosofía opuesta a la
autoconfiguración de Spring Boot, en la misma máquina virtual.

## Especificación frente a proyecto

Es la distinción que este ecosistema enseña mejor que ningún otro:

| | Proyecto único | Especificación |
| --- | --- | --- |
| Ejemplo | Spring Boot | Jakarta Faces, Jakarta EE |
| Quién decide | El proyecto y su patrocinador | Un comité con varias partes |
| Ritmo | Rápido | Lento |
| Cambiar de proveedor | Reescribir | Cambiar la implementación |
| Riesgo característico | Dependencia de un patrocinador | Estancamiento y diseño por comité |

Ninguna de las dos columnas es mejor. La pregunta del módulo 11 es cuál de los
dos riesgos puedes asumir en tu producto y durante cuántos años.

## Las 14 tecnologías

<!-- generado:tabla-ecosistema jvm -->
| Tecnología | Clasificación | Desde | Era | Estado | Licencia | Documentación |
| --- | --- | ---: | --- | --- | --- | --- |
| [**Apache Struts**](../fichas/struts.md) | `web-framework` | 2000 | 🌱 Pionero | 🟡 mantenimiento | `Apache-2.0` | [oficial](https://struts.apache.org/) |
| **Dropwizard** | `application-framework` | 2011 | 🏛️ Clásico | 🟢 activo | `Apache-2.0` | [oficial](https://www.dropwizard.io/en/stable/) |
| **Grails** | `full-stack-framework` | 2006 | 🏛️ Clásico | 🟢 activo | `Apache-2.0` | [oficial](https://docs.grails.org/latest/guide/index.html) |
| **Hibernate ORM** | `orm` | 2001 | 🏛️ Clásico | 🟢 activo | `LGPL-2.1-or-later` | [oficial](https://hibernate.org/orm/documentation/) |
| **Jakarta Faces (JSF)** | `component-framework` | 2004 | 🏛️ Clásico | 🟡 mantenimiento | `EPL-2.0` | [oficial](https://jakarta.ee/specifications/faces/) |
| **Play Framework** | `web-framework` | 2007 | 🏛️ Clásico | 🟢 activo | `Apache-2.0` | [oficial](https://www.playframework.com/documentation/latest/Home) |
| **Spring Framework** | `application-framework` | 2003 | 🏛️ Clásico | 🟢 activo | `Apache-2.0` | [oficial](https://docs.spring.io/spring-framework/reference/) |
| **Eclipse Vert.x** | `reactive-toolkit` | 2012 | 🏛️ Clásico | 🟢 activo | `Apache-2.0` | [oficial](https://vertx.io/docs/) |
| **Jetpack Compose** | `ui-toolkit` | 2021 | 🟢 Vigente | 🟢 activo | `Apache-2.0` | [oficial](https://developer.android.com/compose) |
| **Ktor** | `web-framework` | 2018 | 🟢 Vigente | 🟢 activo | `Apache-2.0` | [oficial](https://ktor.io/docs/) |
| **Micronaut** | `application-framework` | 2018 | 🟢 Vigente | 🟢 activo | `Apache-2.0` | [oficial](https://docs.micronaut.io/latest/guide/) |
| **Quarkus** | `application-framework` | 2019 | 🟢 Vigente | 🟢 activo | `Apache-2.0` | [oficial](https://quarkus.io/guides/) |
| [**Spring Boot**](../fichas/spring-boot.md) | `application-framework` | 2014 | 🟢 Vigente | 🟢 activo | `Apache-2.0` | [oficial](https://spring.io/projects/spring-boot) |
| **Compose Multiplatform** | `ui-toolkit` | 2021 | 🌊 Emergente | 🟢 activo | `Apache-2.0` | [oficial](https://www.jetbrains.com/compose-multiplatform/) |
<!-- fin -->

## Qué aportó cada una

<!-- generado:notas-ecosistema jvm -->
- **Apache Struts** — El modelo-vista-controlador estándar de la empresa Java durante años. Sus vulnerabilidades críticas son el caso de estudio obligado sobre cadena de suministro y actualización.
- **Dropwizard** — Ensambla bibliotecas maduras en un producto operable, con métricas y comprobaciones de salud desde el primer día.
- **Grails** — Convenciones de Rails sobre Spring y Hibernate, con Groovy como lenguaje dinámico de la JVM.
- **Hibernate ORM** — El mapeador objeto-relacional de referencia en Java y el origen de buena parte del vocabulario del campo, incluido el problema de la consulta N+1.
- **Jakarta Faces (JSF)** — Interfaz basada en componentes con estado en servidor, definida como especificación con varias implementaciones. Un modelo de gobierno distinto al de un proyecto único.
- **Play Framework** — Recarga en caliente y modelo sin estado en la JVM, con una experiencia de desarrollo inspirada en los frameworks de guion.
- **Spring Framework** — Popularizó la inversión de control y la inyección de dependencias en la empresa, como alternativa ligera a los estándares de la época.
- **Eclipse Vert.x** — Modelo de bucle de eventos y bus de mensajes en la JVM, políglota por diseño.
- **Jetpack Compose** — Interfaz declarativa en Android: el mismo cambio de paradigma que vivió la web, una década después.
- **Ktor** — Construido sobre corrutinas de Kotlin, con todo el comportamiento añadido mediante plugins explícitos.
- **Micronaut** — Inyección de dependencias resuelta en compilación, sin reflexión en ejecución. Ataca directamente el coste de arranque de la JVM.
- **Quarkus** — Mueve trabajo del arranque al tiempo de compilación para permitir imágenes nativas y arranques de milisegundos.
- **Spring Boot** — Autoconfiguración y servidor incrustado sobre Spring. Convirtió un framework famoso por su configuración XML en uno de arranque inmediato.
- **Compose Multiplatform** — Lleva el modelo de Compose fuera de Android compartiendo código de interfaz entre plataformas.
<!-- fin -->

## Para seguir

- [Laboratorio 04](../../labs/04-spring-boot/README.md) — Spring Boot contra el contrato canónico, con su desviación declarada.
- [Módulo 02](../../curriculum/02-arquitectura-de-frameworks.md) — inversión de control, alcances y contenedores.

## Fuentes

- [@fowler-injection] Fowler, Martin. *Inversion of Control Containers and the Dependency Injection pattern*, 2004 — <https://martinfowler.com/articles/injection.html>
