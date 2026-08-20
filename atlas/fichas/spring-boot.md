# 🍃 Spring Boot — 2014

> [⬅️ Atlas](../README.md) · [☕ Ecosistema JVM](../ecosistemas/jvm.md) · [🗂️ Índice](../frameworks.md)

Spring Boot es el backend por omisión de una parte enorme de la banca, los
seguros y la administración pública del mundo. Y es, además, **el mejor ejemplo
del catálogo de un proyecto que se corrigió a sí mismo sin romper nada**: Spring
se hizo famoso por su configuración interminable, y Spring Boot la eliminó
conservando todo lo anterior.

> **🎯 Por qué está en este programa**
>
> **Es donde la inversión de control se ve con más claridad**
> ([módulo 02](../../curriculum/02-arquitectura-de-frameworks.md)). El contenedor
> de Spring crea los objetos, resuelve sus colaboraciones y gestiona sus alcances.
> Quien entiende ese contenedor reconoce el mismo patrón en NestJS, Angular,
> Micronaut y .NET.
>
> **Y es uno de los cinco laboratorios ejecutables** del programa: implementa el
> contrato canónico y pasa las mismas 20 pruebas de aceptación que los demás, con
> [su desviación declarada](../../labs/04-spring-boot/README.md).

| | |
|---|---|
| **Aparición** | 2014 (Spring Framework, del que deriva: 2003) |
| **Clasificación** | `application-framework` |
| **Ecosistema** | JVM (Java, Kotlin, Groovy) |
| **Licencia** | `Apache-2.0` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://spring.io/projects/spring-boot> |

---

## 📜 Primer acto: Spring contra el peso del estándar

A principios de los 2000, construir una aplicación empresarial en Java exigía
seguir un estándar pesado, con interfaces obligatorias, servidores de aplicaciones
completos y descriptores XML por todas partes. Probar una regla de negocio sin
levantar la infraestructura entera era, en la práctica, imposible.

Spring propuso lo contrario: **objetos Java normales, sin heredar de nada del
framework**, cuyas colaboraciones se les entregan desde fuera.

```java
// La clase no sabe que existe un framework. Recibe lo que necesita y ya.
@Service
class ServicioDeTareas {
  private final RepositorioDeTareas repositorio;

  ServicioDeTareas(RepositorioDeTareas repositorio) {   // inyección por constructor
    this.repositorio = repositorio;
  }

  Tarea crear(String titulo) { /* regla de dominio pura */ }
}
```

La consecuencia es la que persigue el
[módulo 02](../../curriculum/02-arquitectura-de-frameworks.md): esa clase se
puede probar pasándole un doble por el constructor, **sin arrancar servidor ni
contenedor**. Es exactamente lo que hace posible el diseño guiado por pruebas
[@freeman-pryce-goos], y la razón de que la inyección por constructor sea
preferible a cualquier otra forma [@seemann-deursen-di].

Martin Fowler catalogó el patrón —y le puso el nombre por el que hoy se conoce—
en un artículo que sigue siendo el mejor punto de entrada al concepto
[@fowler-injection].

## 😵 La ironía: Spring se volvió lo que combatía

Diez años después, un proyecto Spring típico tenía miles de líneas de XML
declarando qué objeto se construye con qué. Había ganado la batalla contra el
estándar pesado y había construido su propio peso.

Las anotaciones aliviaron parte del problema, pero la configuración de
infraestructura —fuente de datos, transacciones, servidor web, seguridad, gestor
de plantillas— seguía siendo trabajo manual repetido en cada proyecto.

## 💡 Segundo acto: Spring Boot y la autoconfiguración

La idea de Spring Boot cabe en una frase: **si detecto una biblioteca en el
classpath, configuro lo razonable por ti; y si declaras lo tuyo, gana lo tuyo**
[@walls-spring-in-action].

```java
@SpringBootApplication   // una anotación: escaneo de componentes + autoconfiguración
public class Aplicacion {
  public static void main(String[] args) {
    SpringApplication.run(Aplicacion.class, args);   // servidor web incrustado incluido
  }
}
```

Dos decisiones adicionales cambiaron el modelo operativo del ecosistema:

**Servidor incrustado.** La aplicación deja de desplegarse *dentro* de un
servidor y pasa a *ser* un proceso ejecutable. Es lo que la hace compatible con
contenedores y con las expectativas de una plataforma de ejecución
([módulo 12](../../curriculum/12-producto-final.md)).

**Actuator.** Comprobaciones de salud, métricas e información del entorno como
puntos HTTP listos para usar. La distinción entre sonda de vida y de
disponibilidad que exige el módulo 12 viene aquí de fábrica.

## ⚖️ El compromiso, sin adornos

### Lo que se gana

Un servicio con seguridad, persistencia, métricas y pruebas puede estar en marcha
en una tarde, y **cualquier persona con experiencia en Spring lo entenderá sin
explicación**. En organizaciones grandes con rotación alta, esa uniformidad vale
más que cualquier elegancia.

### Lo que se paga

**1. Magia con diagnóstico desigual.** La autoconfiguración decide mucho por ti.
Cuando decide mal, hay que aprender a leer el informe de condiciones para
entender por qué se activó una configuración y no otra. Es el aviso del módulo 02
en su forma más pura: **cuanto más implícito, mejor debe ser el diagnóstico** — y
aquí el diagnóstico existe, pero hay que saber pedirlo.

**2. Arranque y memoria.** El coste de arranque de la JVM más el escaneo de
componentes hace que Spring Boot no sea la mejor opción para funciones efímeras.
Micronaut y Quarkus existen precisamente para atacar ese punto, resolviendo la
inyección en tiempo de compilación.

**3. El dominio tiende a llenarse de anotaciones.** Es cómodo y acopla: cuando
las clases de negocio llevan anotaciones de persistencia, de transacción y de
serialización, ya no son independientes del framework. La defensa es la del
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md): una función de
aptitud que falle si el dominio importa el framework.

## 🧪 Lo que reveló implementar el contrato del programa

En el [laboratorio 04](../../labs/04-spring-boot/README.md), Spring Boot cumple
las 20 pruebas de aceptación. Dos hallazgos concretos salieron de hacerlo:

**El enlace automático de modelo choca con el orden del contrato.** El contrato
fija que se comprueba tamaño, luego clave de idempotencia, luego se analiza el
cuerpo. El enlace automático analizaría antes de que la clave se haya mirado, así
que el cuerpo se recibe como texto y se analiza a mano. **El automatismo es cómodo
hasta que el contrato exige un orden distinto del suyo.**

**Spring Boot 4 cambió de Jackson 2 a Jackson 3**, con paquetes distintos. El
laboratorio se apoya solo en las dos llamadas cuya firma no cambió entre ambas
versiones. Es el módulo 11 aplicado al propio repositorio: **apoyarse en la parte
estable de una dependencia sale más barato que perseguir sus renombres.**

## 🎓 Las tres lecciones

**1. Un proyecto puede corregir su peor defecto sin romper compatibilidad.**
Spring Boot eliminó la configuración de Spring conservando Spring entero. Es el
contraejemplo de AngularJS y el listón contra el que medir cualquier corrección
de rumbo.

**2. La inyección por constructor no es ceremonia: es lo que hace probable el
dominio.** Si una clase recibe sus colaboraciones, se puede probar sin
infraestructura. Todo lo demás del contenedor es conveniencia.

**3. La uniformidad tiene valor propio en organizaciones grandes.** Que miles de
personas reconozcan la estructura de un proyecto reduce el coste de rotación, y
esa dimensión rara vez aparece en las comparativas técnicas.

## 🔗 Enlaces

- Documentación oficial: <https://spring.io/projects/spring-boot>
- [Ecosistema JVM](../ecosistemas/jvm.md) · [Ficha de Struts](struts.md) — a quien sustituyó
- [Laboratorio 04](../../labs/04-spring-boot/README.md) — contra el contrato canónico

## Fuentes

- [@walls-spring-in-action] Walls, Craig. *Spring in Action*, 6.ª ed. Manning Publications, 2022. ISBN 9781617297571 — <https://openlibrary.org/isbn/9781617297571>
- [@freeman-pryce-goos] Freeman, Steve; Pryce, Nat. *Growing Object-Oriented Software, Guided by Tests*. Addison-Wesley, 2010. ISBN 9780321503626 — <https://openlibrary.org/isbn/9780321503626>
- [@seemann-deursen-di] Seemann, Mark; van Deursen, Steven. *Dependency Injection Principles, Practices, and Patterns*. Manning Publications, 2019. ISBN 9781617294730 — <https://openlibrary.org/isbn/9781617294730>
- [@fowler-injection] Fowler, Martin. *Inversion of Control Containers and the Dependency Injection pattern*, 2004 — <https://martinfowler.com/articles/injection.html>
