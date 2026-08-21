# Por qué sí y por qué no — El problema N+1

> [⬅️ Clase 056](README.md) · [📚 Parte 4](../README.md)

| ORM | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Prisma](../../../atlas/fichas/prisma.md) | **No carga sola**: el N+1 no puede aparecer por descuido | Olvidar `include` da una relación ausente | Un fallo silencioso en vez de uno lento |
| [Entity Framework Core](../../../atlas/fichas/entity-framework-core.md) | Igual, y con interceptores para contar comandos | Igual: sin `Include`, lista vacía | Igual |
| [SQLAlchemy](../../../atlas/fichas/sqlalchemy.md) | `selectinload` usa dos consultas: nunca multiplica filas | Perezosa por omisión: el N+1 aparece sin escribirlo | Vigilar cada acceso a una relación |
| [Hibernate](../../../atlas/fichas/hibernate.md) | Contador de sentencias nativo; grafos declarativos | Perezosa por omisión, y **fuera de la sesión lanza excepción** | Dos fallos distintos según dónde toques la relación |

## 🧭 Los dos valores por omisión, y sus fallos

**No cargar** —Prisma, EF Core— convierte el olvido en **datos ausentes**. La
lista llega vacía, el cliente muestra «sin etiquetas», y nadie ve un error. Es un
fallo de corrección silencioso.

**Cargar al tocar** —SQLAlchemy, Hibernate— convierte el olvido en **mil
consultas**. Los datos son correctos y el servicio se arrastra. Es un fallo de
rendimiento, visible en el registro de SQL si alguien lo mira.

Y hay un tercer caso, solo en Hibernate: tocar la relación **fuera de la sesión**
lanza una excepción. Es ruidoso, aparece en desarrollo y —contra lo que parece—
es el mejor de los tres, porque no se puede ignorar.

## 💡 Lo que de verdad resuelve esto

No es elegir ORM: es **medir**.

Los cuatro traen un contador de consultas, y con él se puede escribir una prueba
que falle si una ruta pasa de un número. Eso convierte el N+1 en un fallo de
integración continua en lugar de un informe de lentitud seis meses después.

Es la misma idea que Gregg defiende para cualquier problema de rendimiento:
**instrumentar antes de optimizar**, porque sin medición se acaba adivinando —y
la intuición sobre dónde está el tiempo casi siempre se equivoca
[@gregg-systems-performance].

Y explica por qué el contrato de esta clase cuenta consultas en lugar de medir
tiempo: **el tiempo depende de la máquina; el número de consultas, no**.

## Fuentes

- [@gregg-systems-performance] Gregg, Brendan. *Systems Performance*, 2.ª ed. Addison-Wesley, 2020. ISBN 9780136820154 — <https://openlibrary.org/isbn/9780136820154>
