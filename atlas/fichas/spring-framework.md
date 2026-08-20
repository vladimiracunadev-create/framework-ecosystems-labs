# 🌱 Spring Framework — 2003

> [⬅️ Atlas](../README.md) · [☕ Ecosistema JVM](../ecosistemas/jvm.md) · [🗂️ Índice](../frameworks.md)

Spring Framework es **donde la inversión de control salió del ámbito académico y
entró en la empresa**. Todo lo que hoy se da por supuesto —objetos que reciben
sus colaboraciones desde fuera, dominio probable sin infraestructura, contenedor
que construye el grafo— se popularizó aquí.

> **🎯 Por qué está en este programa**
>
> Porque es el origen práctico del [módulo 02](../../curriculum/02-arquitectura-de-frameworks.md).
> Spring Boot es su envoltorio moderno; el patrón que hay debajo es este.

| | |
|---|---|
| **Aparición** | 2003, creado por Rod Johnson |
| **Clasificación** | `application-framework` |
| **Ecosistema** | JVM (Java) |
| **Licencia** | `Apache-2.0` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://docs.spring.io/spring-framework/reference/> |

---

## 📜 Contra qué nació

El estándar empresarial de Java de la época exigía heredar de clases del
servidor, implementar interfaces obligatorias y describir todo en descriptores
XML. Probar una regla de negocio significaba levantar un servidor de
aplicaciones completo.

Spring propuso lo contrario: **objetos Java normales**, sin herencia del
framework, cuyas dependencias se les entregan desde fuera. Martin Fowler
catalogó el patrón y le dio el nombre por el que se conoce
[@fowler-injection]; Spring fue quien lo llevó a producción a escala.

La consecuencia práctica es la que persigue el módulo 02: una clase que recibe
sus colaboraciones **se puede probar pasándole dobles**, sin infraestructura. Eso
es lo que hace viable el diseño guiado por pruebas [@freeman-pryce-goos].

## 🧩 Lo que aporta además del contenedor

| Módulo | Qué resuelve |
| --- | --- |
| **Contenedor** | Construcción del grafo de objetos, alcances, ciclo de vida |
| **Programación orientada a aspectos** | Transacciones, seguridad y registro sin ensuciar el dominio |
| **Abstracción de datos** | Traduce excepciones de cada motor a una jerarquía común |
| **Spring MVC** | El modelo-vista-controlador que sustituyó a [Struts](struts.md) |
| **Gestión de transacciones** | Declarativa, en lugar de escrita a mano en cada método |

La abstracción de transacciones es un buen ejemplo del compromiso del módulo 02:
una anotación reemplaza veinte líneas repetidas, **y esconde cuándo empieza y
termina la transacción**. Cuando algo falla —una transacción que no cubre lo que
se creía, un método interno que no la activa— hay que entender lo que la
anotación oculta [@walls-spring-in-action].

## ⚖️ La ironía documentada

Spring nació contra la configuración XML y acabó siendo célebre por la suya. No
fue mala fe: la flexibilidad exige declarar, y declarar en XML era la técnica de
la época. Las anotaciones aliviaron el síntoma; **Spring Boot atacó la causa** al
decidir por omisión lo razonable.

Es una lección de diseño general: **una herramienta que resuelve un exceso puede
generar el suyo propio**, y reconocerlo a tiempo —como aquí— es lo que separa un
proyecto vivo de uno que se defiende.

## 🎓 Las tres lecciones

**1. La inyección por constructor es lo que hace probable el dominio.** Todo lo
demás del contenedor es conveniencia.

**2. Toda abstracción que oculte una frontera —transacción, seguridad, sesión—
exige saber dónde está esa frontera** cuando algo falla.

**3. Un proyecto puede corregir su propio exceso.** Spring Boot es la prueba, y
el listón contra el que medir a los demás.

## 🔗 Enlaces

- Documentación oficial: <https://docs.spring.io/spring-framework/reference/>
- [Ficha de Spring Boot](spring-boot.md) · [Ficha de Struts](struts.md) · [Ficha de NestJS](nestjs.md)
- [Módulo 02](../../curriculum/02-arquitectura-de-frameworks.md)

## Fuentes

- [@walls-spring-in-action] Walls, Craig. *Spring in Action*, 6.ª ed. Manning Publications, 2022. ISBN 9781617297571 — <https://openlibrary.org/isbn/9781617297571>
- [@freeman-pryce-goos] Freeman, Steve; Pryce, Nat. *Growing Object-Oriented Software, Guided by Tests*. Addison-Wesley, 2010. ISBN 9780321503626 — <https://openlibrary.org/isbn/9780321503626>
- [@fowler-injection] Fowler, Martin. *Inversion of Control Containers and the Dependency Injection pattern*, 2004 — <https://martinfowler.com/articles/injection.html>
