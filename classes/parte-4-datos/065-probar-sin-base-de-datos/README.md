# Clase 065 — Probar sin base de datos

> [⬅️ 064](../064-repositorio-y-dominio/README.md) · [📚 Parte 4](../README.md) · [🎓 Clases](../../README.md) · [066 ➡️](../../parte-5-identidad-y-seguridad/066-sesion-con-cookie/README.md)
>
> Parte **4 — Datos** · Nivel **🔴 avanzado** · Pista **`datos`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Elegir entre **doble, base en memoria y base real** sabiendo qué prueba cada uno
— y, sobre todo, **qué no prueba**.

## 🧩 La situación

Cuatro pruebas: crear, leer, borrar, y **no admitir dos tareas con el mismo
título**. Las mismas cuatro, ejecutadas contra tres repositorios distintos.

La cuarta es la que decide la clase, porque **esa regla no está en el código**:

```javascript
// Ninguno de los repositorios comprueba la unicidad.
async crear(titulo) { return this.cliente.tarea.create({ data: { titulo } }); }
```

La aplica **la base**, con un índice único. Y por eso el doble no la ve.

## 🌐 Las implementaciones

[Prisma](implementaciones/prisma/), [SQLAlchemy](implementaciones/sqlalchemy/),
[Hibernate](implementaciones/hibernate/) y
[Entity Framework Core](implementaciones/entity-framework-core/).

En las cuatro, las pruebas están escritas **una sola vez** y se ejecutan contra
los tres repositorios sin cambiar una línea. Eso es posible porque existe la
interfaz de la [clase 064](../064-repositorio-y-dominio/README.md).

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /estrategias` | `["doble", "en-memoria", "real"]`, 4 pruebas |
| `GET /probar?estrategia=doble` | **`3 de 4`**, `usa_motor: false` |
| `GET /probar?estrategia=en-memoria` | `4 de 4`, `usa_motor: true` |
| `GET /probar?estrategia=real` | `4 de 4`, `usa_motor: true` |
| `GET /que-se-escapa` | `doble: false`, `en_memoria: true`, `real: true` |
| `GET /comparacion` | `doble_es_el_mas_rapido: true` |

**El `3 de 4` no es un fallo del ejemplo: es el resultado.** El contrato exige
que el doble falle, y falla exactamente donde debe.

## 📖 Las tres estrategias

| | Doble | Base en memoria | Base real |
| --- | --- | --- | --- |
| Velocidad | **microsegundos** | milisegundos | decenas de ms |
| Aislamiento | total | por prueba | hay que limpiar |
| ¿Motor? | no | otro | **el tuyo** |
| Detecta SQL roto | no | sí | sí |
| Detecta restricciones | **no** | sí | sí |
| Detecta lo propio del motor | no | **no** | sí |
| Dónde encaja | pruebas de unidad | pruebas de integración | pruebas de aceptación |

Las dos filas en negrita son las que hay que memorizar.

## ⚠️ El hueco del doble tiene una forma concreta

No es «el doble es menos fiable». Es esto:

> **Un doble sabe lo que tú le enseñaste. La base sabe lo que le declaraste en
> el esquema.**

Todo lo que la base hace *por ti* desaparece cuando la sustituyes:

- Restricciones **únicas** y claves ajenas — la cuarta prueba.
- Valores por omisión, columnas no nulas, tipos.
- Cascadas al borrar (clase 055).
- El orden de un `ORDER BY` que tu diccionario no respeta.
- Transacciones y su vuelta atrás (clase 057).

Y hay un fallo aún peor que ese, porque no se nota: **un doble que sí implementa
la regla**. Si el doble comprobara la unicidad, las cuatro pruebas pasarían… y
seguirías sin saber si el índice existe en la base. El doble estaría probando el
doble.

De ahí la regla práctica: **un doble debe hacer lo mínimo, y su hueco debe ser
visible.** Este falla ruidosamente, que es la mejor propiedad que puede tener.

## ⚠️ Y el hueco de la base en memoria

La segunda columna parece cubrir todo lo de la primera, y **también tiene el
suyo**: es *otro motor*.

En Java el caso es de manual: se prueba con H2 y se despliega contra PostgreSQL.
Lo que se escapa:

- **Dialecto.** `information_schema`, funciones de fecha, `RETURNING`, `ILIKE`.
- **Tipos.** `jsonb`, arrays, `uuid`, enumeraciones — la clase 063 lo enseña: H2
  no sabe mirar dentro de un documento y PostgreSQL sí.
- **Concurrencia.** Niveles de aislamiento y bloqueos no se comportan igual.
- **Planes de ejecución.** Un índice que falta no se nota con 10 filas.
- **Mayúsculas.** Lo que la clase 058 encontró con Flyway y H2.

Con SQLite y estas implementaciones, «en memoria» y «real» son el mismo motor y
las columnas coinciden. **En un proyecto de verdad no coinciden**, y ese hueco es
la razón de que exista la tercera.

## 📖 Entonces, ¿cuál se usa?

Las tres, y en esta proporción:

- **Muchos dobles**, para las reglas de negocio. Son las pruebas de la clase 064:
  se ejecutan en milisegundos, no necesitan limpiar nada y se pueden correr en
  cada guardado del editor.
- **Unas cuantas con motor**, para el mapeo, las consultas y las restricciones.
  Ahí es donde vive el SQL, y el SQL solo se prueba ejecutándolo.
- **Unas pocas contra el motor real**, para lo que solo él sabe hacer.

Es la pirámide de siempre —muchas rápidas abajo, pocas lentas arriba
[@fowler-test-pyramid]—, aplicada a la capa de datos. Y el argumento no es
ideológico, es el último caso del contrato: **el doble es el más rápido**, y la
velocidad es lo que hace que las pruebas se ejecuten de verdad.

## 🔬 Un detalle que rompe las bases en memoria

```python
create_engine("sqlite:///:memory:", poolclass=StaticPool)
```

```csharp
var conexion = new SqliteConnection("Data Source=:memory:");
conexion.Open();   // y NO se cierra
```

**Una base `:memory:` vive mientras dure su conexión.** Sin `StaticPool` en
SQLAlchemy, cada conexión del grupo abre *su propia base vacía*, y las pruebas no
ven lo que acaban de escribir. En EF Core hay que mantener la conexión abierta a
mano por lo mismo.

Es un fallo desconcertante —los datos «desaparecen» entre dos líneas— y tiene
que ver con la clase 061: el grupo de conexiones estaba haciendo justo lo que le
pediste.

## 🔬 Comparación

| ORM | Base de pruebas | Cómo se cambia de repositorio |
| --- | --- | --- |
| Prisma | otro `PrismaClient` con otra URL | a mano |
| SQLAlchemy | `sqlite:///:memory:` con `StaticPool` | a mano |
| Hibernate | otra base H2 con su propio `DataSource` | otra implementación de la interfaz |
| EF Core | `SqliteConnection` en memoria, abierta | `AddScoped<IRepositorio, …>` |

En las cuatro, **cambiar de estrategia es cambiar una línea**. Que sea tan barato
no es casualidad: es lo que compraste en la clase 064.

## ⚠️ Errores frecuentes

- **Que el doble implemente las reglas de la base.** Prueba el doble.
- **Confiar solo en el doble.** El esquema deja de estar probado.
- **Confiar solo en la base real.** Las pruebas tardan y se dejan de ejecutar.
- **Suponer que H2 se comporta como PostgreSQL.** No lo hace.
- **Compartir estado entre pruebas.** Cada una se trae el suyo (clase 059).
- **Cerrar la conexión de una base `:memory:`.** Se lleva la base.
- **Probar el ORM.** `save` funciona; lo tuyo es el mapeo y las restricciones.

## ✅ Verificación

```bash
node scripts/run-class.mjs 065
```

## 🧪 Reto de transferencia

Haz que el doble compruebe la unicidad. Las cuatro pruebas pasarán en las tres
estrategias, y **habrás perdido la única señal** que te decía si el índice único
existe en la base. Después borra el índice del esquema y comprueba que las
pruebas siguen en verde. Ese es el estado en el que están muchas suites reales.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 064 — Repositorio y dominio](../064-repositorio-y-dominio/README.md)
- [Clase 059 — Semillas y datos de prueba](../059-semillas-y-datos-de-prueba/README.md)
- [Módulo 06 — Persistencia y dominio](../../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@meszaros-xunit] Meszaros, Gerard. *xUnit Test Patterns*. Addison-Wesley, 2007. ISBN 9780131495050 — <https://openlibrary.org/isbn/9780131495050>
- [@fowler-test-pyramid] Fowler, Martin. *The Practical Test Pyramid / TestPyramid*. martinfowler.com — <https://martinfowler.com/bliki/TestPyramid.html>
- [@beck-tdd] Beck, Kent. *Test-Driven Development: By Example*. Addison-Wesley, 2002. ISBN 9780321146533 — <https://openlibrary.org/isbn/9780321146533>
