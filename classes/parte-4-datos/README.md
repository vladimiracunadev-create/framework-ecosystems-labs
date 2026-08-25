# Parte 4 — Datos: del SQL a mano al dominio limpio

> [⬅️ Parte 3](../parte-3-validacion-y-contrato/README.md) · [🎓 Todas las clases](../README.md) · [📖 Glosario](../../glosario/README.md) · [Parte 5 ➡️](../parte-5-identidad-y-seguridad/README.md)

**Cómo habla cada framework con la base de datos, qué te ahorra y qué te oculta hasta que duele.**

**Clases 51 a 65** · 15 en total · 15 construidas · 14 tecnologías en juego.

## 🧭 De qué va esta parte

Quince clases sobre la frontera más discutida del oficio: **entre el dominio y la base de datos**.

El recorrido va del SQL escrito a mano —donde todo está a la vista y todo es responsabilidad tuya— hasta un dominio que no importa ninguna biblioteca de persistencia y se puede probar sin levantar nada. Por el camino, los dos patrones que se reparten el ecosistema —Active Record y Data Mapper—, el problema que más sistemas ha tumbado en producción —el N+1— y el momento en que conviene salir del ORM.

Aquí el elenco cambia: ya no son frameworks web, son **ORM y constructores de consultas**. Y la comparación gira sobre una propiedad que casi nadie nombra: si su API de consulta acepta SQL como cadena o no, porque de eso depende que la inyección sea posible o imposible por construcción.

## 🎒 Qué da por sabido

- SQL básico: seleccionar, insertar, unir dos tablas.
- Las partes 1 a 3; en particular, que el contrato es el mismo para todas las implementaciones.

## 🎯 Qué sabrás hacer al terminarla

- Conectar, consultar y escribir con cuatro ORM de cuatro ecosistemas, y reconocer qué patrón sigue cada uno.
- Detectar un N+1 midiendo cómo **crece** el número de consultas, no su valor absoluto.
- Elegir la frontera de una transacción y explicar qué se rompe si es demasiado estrecha o demasiado ancha.
- Escribir migraciones repetibles y semillas que no dupliquen al ejecutarse dos veces.
- Aislar el dominio detrás de un repositorio, y demostrarlo comprobando que no importa nada del ORM.
- Probar la lógica de negocio sin base de datos, y saber qué deja de comprobarse al hacerlo.

## 🧵 Por qué en este orden

Las cuatro primeras son el mapa: conectar (051), SQL a mano (052) y los dos patrones que se reparten el terreno (053 y 054).

Las seis siguientes son lo que se rompe en producción: relaciones, N+1, transacciones, migraciones, semillas y el momento de salir del ORM.

Las cinco últimas son de operación y de diseño: el grupo de conexiones, la caché de lectura, lo no relacional, el repositorio y probar sin base.

## 📚 Las clases

| # | Clase | Qué resuelve | Nivel | Estado |
| --- | --- | --- | --- | --- |
| [051](051-conectar-a-una-base-de-datos/README.md) | [Conectar a una base de datos](051-conectar-a-una-base-de-datos/README.md) | Abrir una conexión y cerrarla bien. | 🟢 introductorio | ✅ Construida |
| [052](052-sql-a-mano/README.md) | [SQL a mano](052-sql-a-mano/README.md) | Escribir la consulta y leer el resultado sin capa intermedia. | 🟢 introductorio | ✅ Construida |
| [053](053-active-record/README.md) | [Active Record](053-active-record/README.md) | Dejar que el objeto sepa guardarse. | 🟡 intermedio | ✅ Construida |
| [054](054-data-mapper/README.md) | [Data Mapper](054-data-mapper/README.md) | Separar el dominio del almacenamiento. | 🟡 intermedio | ✅ Construida |
| [055](055-relaciones/README.md) | [Relaciones](055-relaciones/README.md) | Modelar uno a muchos y recorrerlo en los dos sentidos. | 🟡 intermedio | ✅ Construida |
| [056](056-el-problema-n-1/README.md) | [El problema N+1](056-el-problema-n-1/README.md) | Reconocer la consulta que se multiplica y corregirla. | 🔴 avanzado | ✅ Construida |
| [057](057-transacciones/README.md) | [Transacciones](057-transacciones/README.md) | Agrupar operaciones para que ocurran todas o ninguna. | 🟡 intermedio | ✅ Construida |
| [058](058-migraciones/README.md) | [Migraciones](058-migraciones/README.md) | Cambiar el esquema con historia y sin pérdida. | 🟡 intermedio | ✅ Construida |
| [059](059-semillas-y-datos-de-prueba/README.md) | [Semillas y datos de prueba](059-semillas-y-datos-de-prueba/README.md) | Partir siempre del mismo estado conocido. | 🟢 introductorio | ✅ Construida |
| [060](060-cuando-salir-del-orm/README.md) | [Cuándo salir del ORM](060-cuando-salir-del-orm/README.md) | Reconocer la consulta que el mapeador no debe generar. | 🔴 avanzado | ✅ Construida |
| [061](061-grupo-de-conexiones/README.md) | [Grupo de conexiones](061-grupo-de-conexiones/README.md) | Entender el recurso escaso que hay detrás de cada consulta. | 🔴 avanzado | ✅ Construida |
| [062](062-cache-de-lectura/README.md) | [Caché de lectura](062-cache-de-lectura/README.md) | Evitar la consulta repetida y aceptar el coste de la invalidación. | 🔴 avanzado | ✅ Construida |
| [063](063-bases-no-relacionales/README.md) | [Bases no relacionales](063-bases-no-relacionales/README.md) | Modelar el mismo caso sin tablas y ver qué cambia. | 🟡 intermedio | ✅ Construida |
| [064](064-repositorio-y-dominio/README.md) | [Repositorio y dominio](064-repositorio-y-dominio/README.md) | Escribir reglas de negocio que no saben que hay base de datos. | 🔴 avanzado | ✅ Construida |
| [065](065-probar-sin-base-de-datos/README.md) | [Probar sin base de datos](065-probar-sin-base-de-datos/README.md) | Elegir entre doble, base en memoria y base real, sabiendo qué prueba cada uno. | 🔴 avanzado | ✅ Construida |

## 🎬 Las tecnologías que aparecen

Entre paréntesis, en cuántas clases de esta parte interviene cada una. **Estar aquí no es una recomendación**: es que el problema de esa clase existe de verdad para esa tecnología.

| Ecosistema | Tecnologías |
| --- | --- |
| **Python** | [SQLAlchemy](../../atlas/fichas/sqlalchemy.md) (13), [Django](../../atlas/fichas/django.md) (1), [FastAPI](../../atlas/fichas/fastapi.md) (1) |
| **.NET** | [Entity Framework Core](../../atlas/fichas/entity-framework-core.md) (10), [ASP.NET Core](../../atlas/fichas/aspnet-core.md) (1), [Dapper](../../atlas/fichas/dapper.md) (1) |
| **JavaScript/TypeScript** | [Prisma ORM](../../atlas/fichas/prisma.md) (10), [Drizzle ORM](../../atlas/fichas/drizzle.md) (2), [TypeORM](../../atlas/fichas/typeorm.md) (2) |
| **JVM** | [Hibernate ORM](../../atlas/fichas/hibernate.md) (12), [Spring Boot](../../atlas/fichas/spring-boot.md) (1) |
| **Ruby** | [Active Record (Rails)](../../atlas/fichas/activerecord.md) (3) |
| **PHP** | [Eloquent (Laravel)](../../atlas/fichas/eloquent.md) (2) |
| **Node.js** | [Express](../../atlas/fichas/express.md) (1) |

## 📖 Las palabras que esta parte define

[**ORM**](../../glosario/README.md#orm) · [**Active Record**](../../glosario/README.md#active-record) · [**Data Mapper**](../../glosario/README.md#data-mapper) · [**Problema N+1**](../../glosario/README.md#problema-n1) · [**Carga perezosa**](../../glosario/README.md#carga-perezosa) · [**Carga anticipada**](../../glosario/README.md#carga-anticipada) · [**Transacción**](../../glosario/README.md#transacción) · [**Migración**](../../glosario/README.md#migración) · [**Semilla**](../../glosario/README.md#semilla) · [**Grupo de conexiones**](../../glosario/README.md#grupo-de-conexiones) · [**Repositorio**](../../glosario/README.md#repositorio)

Todas, con su definición, en el [glosario](../../glosario/README.md).

## ✅ Cómo se ejecuta una clase de esta parte

```bash
node scripts/run-class.mjs 051
```

El verificador arranca cada implementación, la somete a su `contrato.json` y **declara cuáles omitió** por no encontrar su cadena de herramientas. Si te faltan cadenas, `node scripts/doctor.mjs` dice cuáles y cómo se instalan.

## ➡️ Y después

La parte 5 protege todo lo anterior: quién eres, qué puedes, y qué pasa cuando alguien intenta engañar al sistema.
