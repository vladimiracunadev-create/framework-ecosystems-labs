# 🍃 Grails — 2006

> [⬅️ Atlas](../README.md) · [☕ Ecosistema JVM](../ecosistemas/jvm.md) · [🗂️ Índice](../frameworks.md)

Grails llevó las convenciones de [Rails](rails.md) a la JVM, apoyándose en
Groovy —un lenguaje dinámico de la plataforma— y construyendo sobre
[Spring](spring-framework.md) e [Hibernate](hibernate.md).

Es un caso claro de la tesis del [Atlas](../README.md): **la idea de Rails viajó a
casi todos los ecosistemas**, y aquí llegó con dos años de diferencia.

| | |
|---|---|
| **Aparición** | 2006 (como Groovy on Grails) |
| **Clasificación** | `full-stack-framework` |
| **Ecosistema** | JVM (Groovy) |
| **Licencia** | `Apache-2.0` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://docs.grails.org/latest/guide/index.html> |

---

## 💡 Convenciones sobre una base empresarial

```groovy
// Sin configuración: la clase define la tabla, las columnas y las validaciones.
class Tarea {
    String titulo
    boolean completada = false
    static constraints = { titulo blank: false, maxSize: 120 }
}
```

Debajo hay Hibernate y Spring; encima, la brevedad de Rails. Esa combinación fue
su argumento: **productividad de framework dinámico con el ecosistema de la
JVM** —bibliotecas, herramientas, integración con sistemas existentes.

Para el [módulo 02](../../curriculum/02-arquitectura-de-frameworks.md) es un
ejemplo doble: convención sobre configuración **encima** de un contenedor de
inversión de control. Dos capas de comportamiento implícito, con el coste de
diagnóstico multiplicado.

## ⚖️ Por qué su cuota es modesta

**1. Groovy no ganó la posición que buscaba.** Kotlin ocupó el espacio del
lenguaje moderno de la JVM, con tipado estático y respaldo de herramientas.

**2. Spring Boot llegó en 2014** ofreciendo gran parte de la productividad de
Grails **en Java**, sin lenguaje adicional. Ese fue el golpe decisivo.

**3. La magia se paga doble.** Convenciones de Grails sobre configuración
automática de Spring sobre mapeo de Hibernate: cuando algo falla, hay tres capas
que entender.

## 🎓 Las dos lecciones

**1. Las ideas viajan entre ecosistemas y llegan con retraso.** Rails 2004,
CakePHP 2005, Grails 2006, Laravel 2011. Reconocer el patrón hace comprensible
cada llegada.

**2. Apilar capas implícitas multiplica el coste de diagnóstico.** Cada capa de
magia es cómoda por separado; juntas, el rastreo de un fallo cruza tres modelos
mentales.

## 🔗 Enlaces

- Documentación oficial: <https://docs.grails.org/latest/guide/index.html>
- [Ficha de Rails](rails.md) — el original · [Ficha de Spring Boot](spring-boot.md) — quien le quitó el sitio
- [Ecosistema JVM](../ecosistemas/jvm.md)

## Fuentes

- [@ruby-thomas-agile-rails] Ruby, Sam; Thomas, Dave. *Agile Web Development with Rails 7*. Pragmatic Bookshelf, 2022. ISBN 9781680509298 — <https://openlibrary.org/isbn/9781680509298>
