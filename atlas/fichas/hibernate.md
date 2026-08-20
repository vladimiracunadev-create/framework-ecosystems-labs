# 🗄️ Hibernate ORM — 2001

> [⬅️ Atlas](../README.md) · [☕ Ecosistema JVM](../ecosistemas/jvm.md) · [🗂️ Índice](../frameworks.md)

Hibernate es **el mapeador objeto-relacional de referencia** y el origen de buena
parte del vocabulario que hoy usa todo el campo, incluido el problema de la
**consulta N+1**. Quien entiende Hibernate reconoce Entity Framework, Doctrine,
SQLAlchemy y Prisma: son el mismo patrón con otra sintaxis.

> **🎯 Por qué está en este programa**
>
> Porque es el ejemplo mayor del **desajuste de impedancia**
> ([módulo 06](../../curriculum/06-persistencia-y-dominio.md)): los objetos y las
> tablas no encajan del todo, y un mapeador es una traducción con reglas propias
> que hay que conocer.

| | |
|---|---|
| **Aparición** | 2001, creado por Gavin King |
| **Clasificación** | `orm` — mapeador de datos |
| **Ecosistema** | JVM (Java) |
| **Licencia** | `LGPL-2.1-or-later` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://hibernate.org/orm/documentation/> |

---

## 💡 Mapeador de datos, no registro activo

A diferencia de Eloquent o Active Record, en Hibernate **el objeto no sabe
guardarse**: hay una sesión que lleva la cuenta de qué objetos están gestionados
y qué ha cambiado en ellos [@fowler-poeaa].

Esa sesión es la fuente de casi todo lo bueno y lo difícil:

| Concepto | Qué hace | Dónde sorprende |
| --- | --- | --- |
| **Contexto de persistencia** | Sigue los objetos gestionados | Un objeto fuera de él se comporta distinto |
| **Comprobación de cambios** | Detecta qué campos cambiaron | Modificar un objeto gestionado **guarda sin que llames a guardar** |
| **Escritura diferida** | Agrupa las sentencias y las emite al final | El SQL no se ejecuta cuando parece |
| **Carga perezosa** | Trae las relaciones cuando se acceden | Origen directo de la consulta N+1 |

## ⚠️ La consulta N+1, en su origen

```java
// Una consulta para los pedidos...
List<Pedido> pedidos = sesion.createQuery("from Pedido", Pedido.class).list();
for (Pedido p : pedidos) {
    // ...y UNA MÁS por cada pedido, al tocar la relación perezosa.
    System.out.println(p.getCliente().getNombre());
}
```

Con diez filas en desarrollo no se nota. Con diez mil en producción, sí. Y **no
hay nada en el código que lo delate**: la línea que dispara la consulta parece un
simple acceso a una propiedad.

El diagnóstico que enseña el [módulo 06](../../curriculum/06-persistencia-y-dominio.md)
es el mismo aquí que en cualquier otro mapeador: **contar consultas por caso de
uso en una prueba**, no leer el código buscando el fallo.

## ⚖️ El compromiso

**Se gana:** independencia razonable del motor, gestión de transacciones y de
caché, y un modelo de dominio que puede tener comportamiento y no solo datos —lo
que hace viable el modelado del [módulo 06](../../curriculum/06-persistencia-y-dominio.md)
[@evans-ddd].

**Se paga:** una capa con reglas propias que hay que aprender. El error clásico
no es usar mal SQL: es **creer que no hay SQL**. Cuando el rendimiento importa,
hay que saber qué consulta se está generando, y eso significa mirar el SQL de
todos modos.

## 🎓 Las tres lecciones

**1. Un mapeador no elimina la base de datos: la traduce.** Quien no sabe SQL no
puede diagnosticar un mapeador.

**2. La carga perezosa es cómoda y silenciosa.** Es la causa raíz de la mayoría
de los problemas de rendimiento en aplicaciones con ORM.

**3. Registro activo y mapeador de datos son elecciones distintas, no niveles de
calidad.** Dependen de cuánta lógica tiene el dominio.

## 🔗 Enlaces

- Documentación oficial: <https://hibernate.org/orm/documentation/>
- [Ficha de Spring Boot](spring-boot.md) · [Ecosistema JVM](../ecosistemas/jvm.md)
- [Módulo 06](../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@fowler-poeaa] Fowler, Martin. *Patterns of Enterprise Application Architecture*. Addison-Wesley, 2002. ISBN 9780321127426 — <https://openlibrary.org/isbn/9780321127426>
- [@evans-ddd] Evans, Eric. *Domain-Driven Design*. Addison-Wesley, 2003. ISBN 9780321125217 — <https://openlibrary.org/isbn/9780321125217>
