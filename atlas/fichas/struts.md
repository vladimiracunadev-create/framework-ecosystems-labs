# ⚠️ Apache Struts — 2000

> [⬅️ Atlas](../README.md) · [☕ Ecosistema JVM](../ecosistemas/jvm.md) · [🗂️ Índice](../frameworks.md)

Struts fue el modelo-vista-controlador estándar de la empresa Java durante casi
una década. Está en el Atlas por lo que enseña su segunda mitad: **es el caso de
estudio de cadena de suministro más caro y mejor documentado del campo**.

La lección no es «Struts era inseguro». Es más incómoda y mucho más útil: **una
corrección publicada no protege a nadie hasta que alguien la aplica**, y en 2017
quedó demostrado a escala de decenas de millones de personas.

> **🎯 Por qué está en este programa**
>
> Porque el [módulo 07](../../curriculum/07-identidad-y-seguridad.md) y el
> [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) piden evaluar la
> **cadena de suministro** y el **tiempo de respuesta ante fallos de seguridad**
> como dimensiones de la decisión. Struts convierte esas dos casillas abstractas
> en una historia con fechas, y las fechas son lo que hace la lección memorable.

| | |
|---|---|
| **Aparición** | 2000, donado a la Apache Software Foundation |
| **Clasificación** | `web-framework` — modelo-vista-controlador del lado del servidor |
| **Ecosistema** | JVM (Java) |
| **Licencia** | `Apache-2.0` |
| **Gobierno** | Apache Software Foundation |
| **Estado** | 🟡 Mantenimiento. No se elige para empezar hoy |
| **Documentación** | <https://struts.apache.org/> |

---

## 📜 Lo que resolvió

Antes de Struts, una aplicación web en Java se escribía con páginas que mezclaban
marcado y lógica: consultas a la base de datos y reglas de negocio incrustadas
entre etiquetas HTML. Era rápido de empezar e imposible de mantener.

Struts impuso una separación que hoy parece obvia:

| Pieza | Responsabilidad |
| --- | --- |
| **Servlet controlador** | Un único punto de entrada que recibe todas las peticiones |
| **Acciones** | Una clase por caso de uso, con la lógica de coordinación |
| **Formularios** | Objetos que reciben y validan la entrada |
| **Configuración** | Un archivo XML que declara qué acción atiende qué ruta |

Fue la primera vez que gran parte del sector Java vio una aplicación web **con
una arquitectura declarada**. Buena parte de la disciplina que después
formalizaron Spring MVC y ASP.NET MVC empieza aquí.

## 💥 2017: la brecha

En marzo de 2017 se publicó una vulnerabilidad crítica en el analizador de un
componente de Struts. Permitía **ejecutar código arbitrario en el servidor
enviando una cabecera HTTP manipulada** — sin autenticarse, sin nada previo
[@cve-2017-5638].

La secuencia importa más que el detalle técnico:

| Momento | Qué ocurrió |
| --- | --- |
| **Marzo de 2017** | Se publica la vulnerabilidad **y la versión corregida**, el mismo día |
| **Marzo de 2017** | Aparecen exploits públicos y comienza la explotación masiva |
| **Meses siguientes** | Una organización con la versión vulnerable sufre una intrusión que expone datos personales de una parte enorme de la población estadounidense |
| **Después** | Investigaciones públicas concluyen que la corrección **existía desde el principio** y no se había aplicado |

**El fallo no fue del framework, y esa es toda la lección.** El proyecto publicó
la corrección de inmediato, con boletín de seguridad, versión y descripción
[@struts-security]. Lo que falló fue el proceso de la organización: no sabía qué
versión tenía desplegada, ni dónde, ni tenía forma de actualizarla rápido.

## 🎯 Lo que este caso obliga a cambiar

### 1. Saber qué tienes desplegado

La pregunta parece trivial y casi nunca tiene respuesta rápida: **¿qué versión de
cada dependencia está ejecutándose ahora mismo, en cada entorno?** Sin un
inventario —lo que hoy se llama lista de materiales de software— no se puede
responder a un aviso de seguridad en horas.

Es lo que el [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)
persigue al pedir versiones fijadas y verificables: no es purismo, es la
diferencia entre reaccionar en horas o en meses.

### 2. Distinguir «vulnerable» de «se está explotando ahora»

No todas las vulnerabilidades son igual de urgentes. CISA mantiene un catálogo
público de las que **se sabe que están siendo explotadas activamente**
[@cisa-kev]: esa lista es la que convierte una tarea de mantenimiento en un
incidente. Priorizar por ella es más eficaz que priorizar por la puntuación de
gravedad a secas.

### 3. Ensayar la actualización antes de necesitarla

Una organización que nunca ha probado a actualizar una dependencia mayor no sabe
cuánto tarda. Y descubrirlo durante una brecha es la peor forma posible de
averiguarlo. El [módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md)
insiste en la misma idea para la vuelta atrás de un despliegue: **ensayarla o no
tenerla**.

### 4. Puntuar el historial de seguridad al elegir

El módulo 11 lo pide explícitamente entre los siete indicadores de salud de un
proyecto: **cuánto tarda en responder a un fallo de seguridad**. Struts respondió
el mismo día. Ese dato, medible y público, es mejor criterio que cualquier
comparativa de rendimiento.

## ⚖️ Lo que sería injusto concluir

**Que Struts es peor que sus alternativas.** Todos los frameworks grandes tienen
vulnerabilidades críticas en su historial; los que no las tienen publicadas suele
ser porque nadie los audita. Un proyecto con boletines de seguridad detallados y
públicos es **más** confiable que uno silencioso, no menos.

**Que el código abierto es el problema.** Aquí funcionó exactamente como debía:
fallo detectado, corregido, publicado y comunicado el mismo día. El eslabón que
falló fue el consumo, no la producción.

## 🎓 Las tres lecciones

**1. Una corrección publicada no protege a nadie hasta que se aplica.** El tiempo
entre la publicación y tu despliegue es tu ventana de exposición, y depende
enteramente de ti.

**2. La cadena de suministro es parte de la elección de framework.** Adoptar un
framework es adoptar su árbol de dependencias y comprometerse a seguir sus
avisos. Esa dimensión debe puntuarse antes, no descubrirse después.

**3. Los frameworks históricos siguen ejecutándose.** Que algo esté en
mantenimiento no significa que esté apagado. Buena parte del software en
producción del mundo corre sobre tecnologías que ya nadie elegiría para empezar,
y esa realidad es justamente el objeto del
[módulo 10](../../curriculum/10-modernizacion-y-migracion.md).

## 🔗 Enlaces

- Documentación oficial: <https://struts.apache.org/>
- [Ecosistema JVM](../ecosistemas/jvm.md) · [Ficha de Spring Boot](spring-boot.md) — su sucesor de hecho
- [Módulo 07](../../curriculum/07-identidad-y-seguridad.md) · [Módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)

## Fuentes

- [@cve-2017-5638] *CVE-2017-5638 — Apache Struts remote code execution*, NIST — National Vulnerability Database, 2017 — <https://nvd.nist.gov/vuln/detail/CVE-2017-5638>
- [@struts-security] *Apache Struts Security Bulletins*, Apache Software Foundation — <https://struts.apache.org/security/>
- [@cisa-kev] *Known Exploited Vulnerabilities Catalog*, CISA — <https://www.cisa.gov/known-exploited-vulnerabilities-catalog>
