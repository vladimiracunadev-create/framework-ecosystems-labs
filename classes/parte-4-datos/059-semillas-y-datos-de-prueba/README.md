# Clase 059 — Semillas y datos de prueba

> [⬅️ 058](../058-migraciones/README.md) · [📚 Parte 4](../README.md) · [🎓 Clases](../../README.md) · [060 ➡️](../060-cuando-salir-del-orm/README.md)
>
> Parte **4 — Datos** · Nivel **🟢 básico** · Pista **`datos`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Partir siempre del **mismo estado conocido** — y que ejecutar la semilla dos
veces no rompa nada.

## 🧩 La situación

Un catálogo de tres tareas que hay que tener siempre. Alguien añade una a mano.
Se vuelve a sembrar. ¿Qué debería pasar?

## 🌐 Las implementaciones

[Prisma](implementaciones/prisma/), [SQLAlchemy](implementaciones/sqlalchemy/),
[Hibernate](implementaciones/hibernate/) y
[Entity Framework Core](implementaciones/entity-framework-core/).

En las cuatro, **el catálogo es un archivo JSON**, no código. Se revisa en una
pull request como cualquier otro dato, y se puede cargar desde una prueba sin
arrancar nada.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `POST /sembrar` | `creadas: 3`, `total: 3` |
| `GET /tareas` | ids **1, 2, 3** |
| `POST /tareas` "a mano" | `201` |
| `GET /tareas` | `total: 4` |
| `POST /sembrar` | **`creadas: 0`, `total: 4`** |
| `POST /reiniciar` | `creadas: 3`, `total: 3` |
| `GET /tareas` | ids **1, 2, 3** otra vez |

## 📖 Las dos operaciones que casi siempre se confunden

| Operación | Qué hace | Cuándo se usa |
| --- | --- | --- |
| **Sembrar** | asegura que el catálogo está | al desplegar, en cada arranque |
| **Reiniciar** | borra todo y siembra | antes de una prueba, en desarrollo |

Llamar «semilla» a las dos es el origen del accidente clásico: un guion que
funcionaba en local **borra la tabla en producción** porque nadie separó las dos
ideas.

La regla es simple: **sembrar nunca borra.** Si borra, es otra cosa y merece otro
nombre.

## ⚠️ La idempotencia mal hecha

Esta es la forma más extendida, y está mal:

```javascript
if ((await prisma.tarea.count()) === 0) {
  await sembrar();   // «solo si está vacía»
}
```

Funciona el primer día. Después alguien añade una cuarta fila al catálogo, y esa
fila **no entra nunca**: la tabla ya no está vacía. El error no da ningún síntoma
—no falla, no avisa— y aparece semanas más tarde como «en producción falta ese
registro».

La forma correcta es por **identificador**:

```javascript
// Prisma — inserta si no está, actualiza si está
await prisma.tarea.upsert({ where: { id }, update: { titulo }, create: { id, titulo } });
```

```python
s.merge(Tarea(id=fila["id"], titulo=fila["titulo"]))   # SQLAlchemy
```

```java
tareas.save(tarea);   // Hibernate: con un id que ya existe, fusiona
```

```csharp
var existente = await contexto.Tareas.FindAsync(fila.Id);   // EF Core: buscar y decidir
```

Con identificadores fijos, sembrar es idempotente **por fila**: el catálogo puede
crecer, cambiar o reordenarse, y la semilla sigue haciendo lo correcto sin tocar
nada más.

## 🔬 Los identificadores fijos no son un detalle

El contrato exige que tras reiniciar los identificadores vuelvan a ser **1, 2 y
3**. Sin eso, «mismo estado conocido» es mentira: una prueba que dice
`GET /tareas/2` fallaría según cuántas veces se hubiera sembrado antes.

Y conseguirlo obliga a apagar la generación automática:

```csharp
constructor.Entity<Tarea>().Property(t => t.Id).ValueGeneratedNever();
```

```java
@Id public Long id;   // sin @GeneratedValue
```

Con una consecuencia que hay que asumir: **si el motor no reparte
identificadores, alguien tiene que repartirlos**. Por eso las tareas añadidas a
mano calculan el suyo a partir del máximo — y por eso, en un sistema real con
escrituras concurrentes, la respuesta suele ser reservar un rango para la semilla
y dejar el resto al motor.

## ⚠️ El detalle de SQLite que aparece al reiniciar

```javascript
// Prisma, después de borrar
await prisma.$executeRawUnsafe("DELETE FROM sqlite_sequence WHERE name = 'Tarea'");
```

```python
# SQLAlchemy: aquí no hace falta
```

**La misma base y comportamientos distintos**, porque los esquemas no son
iguales: Prisma declara `AUTOINCREMENT` y SQLAlchemy no. Con `AUTOINCREMENT`
SQLite guarda el último valor en una tabla aparte que sigue contando aunque
vacíes la tuya; sin él usa el `rowid`, que vuelve solo a 1.

Es un buen recordatorio de que «reproducible» depende de cosas que no están en tu
código.

## 🔬 Comparación

| ORM | Cómo se hace idempotente | Semilla en migraciones |
| --- | --- | --- |
| Prisma | `upsert` | sí, en el SQL de la migración |
| SQLAlchemy | `merge` | sí, con `op.bulk_insert` |
| Hibernate | `save` con id existente | sí, `data.sql` o Flyway |
| EF Core | buscar y decidir | sí, `HasData` en el modelo |

La columna de la derecha señala la otra vía posible: **poner la semilla en la
migración**. Tiene una ventaja real —queda versionada con el esquema— y un coste
que se paga tarde: los datos quedan congelados en un archivo que **no se puede
editar** una vez aplicado (clase 058), así que corregir una errata exige otra
migración.

Regla práctica: **en migraciones lo que el esquema necesita para ser válido; en
la semilla lo que la aplicación necesita para funcionar.**

## ⚠️ Errores frecuentes

- **«Si está vacía, siembra».** El catálogo que crece no entra nunca.
- **Que sembrar borre.** El accidente de producción clásico.
- **Dejar los identificadores al motor.** El estado deja de ser reproducible.
- **Semillas escritas en código.** Nadie las revisa como datos, y no se pueden
  reutilizar desde una prueba.
- **Datos de desarrollo que llegan a producción.** Usuarios de prueba con
  contraseñas conocidas es un fallo de seguridad, no un descuido.
- **Sembrar sin transacción.** Una semilla a medias es peor que ninguna.

## ✅ Verificación

```bash
node scripts/run-class.mjs 059
```

## 🧪 Reto de transferencia

Añade una cuarta fila a `catalogo.json` y vuelve a sembrar **sin reiniciar**.
Debe entrar la nueva y quedarse las tres de antes. Después cambia la semilla a la
forma «si está vacía» y comprueba que la cuarta no entra nunca: ese es el fallo
que esta clase existe para evitar.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 058 — Migraciones](../058-migraciones/README.md)
- [Clase 065 — Probar sin base de datos](../065-probar-sin-base-de-datos/README.md)
- [Módulo 06 — Persistencia y dominio](../../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@ambler-sadalage-refactoring-databases] Ambler, Scott W.; Sadalage, Pramod J. *Refactoring Databases*. Addison-Wesley, 2006. ISBN 9780321293534 — <https://openlibrary.org/isbn/9780321293534>
- [@humble-farley-continuous-delivery] Humble, Jez; Farley, David. *Continuous Delivery*. Addison-Wesley, 2010. ISBN 9780321601919 — <https://openlibrary.org/isbn/9780321601919>
- [@meszaros-xunit] Meszaros, Gerard. *xUnit Test Patterns*. Addison-Wesley, 2007. ISBN 9780131495050 — <https://openlibrary.org/isbn/9780131495050>
