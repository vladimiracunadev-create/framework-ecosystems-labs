# Clase 058 — Migraciones

> [⬅️ 057](../057-transacciones/README.md) · [📚 Parte 4](../README.md) · [🎓 Clases](../../README.md) · [059 ➡️](../059-semillas-y-datos-de-prueba/README.md)
>
> Parte **4 — Datos** · Nivel **🟡 intermedio** · Pista **`datos`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Cambiar el esquema **con historia y sin pérdida**: añadir una columna a una tabla
que ya tiene datos, dejar constancia de que se hizo, y que volver a ejecutarlo no
haga nada.

## 🧩 La situación

Una tabla `tareas` con una fila dentro. Hay que añadirle una columna
`prioridad`. La fila que ya existía tiene que sobrevivir con un valor válido.

## 🌐 Las implementaciones

Las cuatro usan **la herramienta de migración real de su ecosistema** —Prisma
Migrate, Alembic, Flyway y las migraciones de EF Core—, no un guion propio. El
código está en [`implementaciones/`](implementaciones/).

Y las cuatro **arrancan borrando la base**, para que las migraciones se ejecuten
de verdad al iniciar y el historial que se consulta lo hayan escrito ellas.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /historial` | `total: 2` |
| `GET /esquema` | `["id", "prioridad", "titulo"]` |
| `GET /tareas` | la fila 1, con `prioridad: 0` |
| `POST /tareas` con prioridad 5 | `201` |
| `GET /tareas` | las dos, con 0 y 5 |
| `POST /migrar` | **`nuevas: 0`**, `total: 2` |
| `GET /esquema` | igual que antes |

Dos decisiones del contrato que no son de adorno:

**El esquema se lee del catálogo de la base**, no del modelo. Preguntarle al
modelo si tiene la columna solo demuestra que el archivo dice lo que dice.
Preguntárselo a la base demuestra que **la migración se aplicó**.

**El último par de casos es la mitad de la clase.** Volver a migrar sobre una
base ya migrada tiene que ser una operación vacía, y comprobarlo es lo que
distingue una migración de un guion de SQL.

## 📖 Qué es realmente una migración

Tres cosas, y ninguna es «el SQL»:

1. **Un archivo con un orden.** `001`, `002`, `V1`, `V2`, una marca de tiempo:
   da igual la forma, importa que dos personas obtengan la misma secuencia.
2. **Una tabla de historia dentro de la propia base.** Es lo que permite
   preguntar «¿esta base va por dónde?» sin adivinar.
3. **La regla de no repetir.** Con 1 y 2, «aplica lo que falte» está definido.

Por eso las cuatro herramientas se parecen tanto pese a venir de mundos
distintos: **es el mismo problema, resuelto igual.**

| Herramienta | Dónde guarda la historia | Qué guarda |
| --- | --- | --- |
| Prisma Migrate | `_prisma_migrations` | una fila por migración, con su resumen |
| Alembic | `alembic_version` | **solo la revisión actual** |
| Flyway | `flyway_schema_history` | una fila por migración, con resumen y duración |
| EF Core | `__EFMigrationsHistory` | una fila por migración |

Alembic es la excepción interesante: guarda **un único valor**, y la historia se
reconstruye recorriendo hacia atrás la cadena de `down_revision` que cada archivo
declara. Es un grafo, no una lista — lo que le permite tener ramas, y lo que hace
que el fallo típico sean **dos cabezas** tras una fusión mal resuelta.

## 🔬 El valor de relleno

```sql
-- Flyway
ALTER TABLE tareas ADD COLUMN prioridad INT NOT NULL DEFAULT 0;
```

```python
# Alembic
op.add_column("tareas", sa.Column("prioridad", sa.Integer, nullable=False, server_default="0"))
```

```csharp
// EF Core
constructor.AddColumn<int>("Prioridad", "Tareas", nullable: false, defaultValue: 0);
```

**Sin el valor por omisión, la migración falla.** No queda mal: falla. La fila que
ya existía se quedaría con `NULL` en una columna declarada `NOT NULL`, y el motor
rechaza la operación entera.

Es la lección más práctica de la clase: **una columna nueva no existe en el
vacío**, existe sobre filas que ya están escritas.

## ⚠️ Lo que este ejemplo simplifica

Aquí la tabla tiene una fila. En una tabla de diez millones, `ADD COLUMN NOT NULL
DEFAULT` puede reescribirla entera y bloquearla mientras tanto, y lo que se hace
es partirlo en tres despliegues:

1. **Añadir la columna como opcional.** Nadie la usa todavía.
2. **Rellenarla por lotes**, mientras la aplicación escribe en los dos sitios.
3. **Exigirla**, una vez que no queda ningún nulo.

Se llama *expandir y contraer*, y existe por una razón que no tiene que ver con
las bases de datos: **el esquema y el código no se despliegan a la vez**. Durante
unos minutos conviven la versión vieja y la nueva, y las dos tienen que
funcionar contra el mismo esquema [@ambler-sadalage-refactoring-databases].

De ahí la regla que resume todo esto: **una migración debe ser compatible con el
código que todavía está corriendo.**

## ⚠️ La otra regla: no se editan las aplicadas

Las cuatro herramientas guardan un resumen —una suma de comprobación— de cada
archivo aplicado. Editar una migración que ya se ejecutó en algún sitio hace que
esa suma deje de cuadrar, y la herramienta se planta.

Parece una molestia y es una protección: **tu base ya tiene el efecto de la
versión vieja**, y el archivo nuevo describe otra cosa. El arreglo es siempre el
mismo: **una migración más**, nunca editar la anterior.

## 🔬 Comparación

| Herramienta | Formato | Aplicar | Revertir |
| --- | --- | --- | --- |
| Prisma Migrate | SQL suelto, generado del esquema | `migrate deploy` | **no lo hace** |
| Alembic | Python, con `upgrade` y `downgrade` | `upgrade head` | `downgrade` |
| Flyway | SQL suelto | automático al arrancar | solo en la edición de pago |
| EF Core | C#, con `Up` y `Down` | `Database.Migrate()` | `database update <nombre>` |

Las dos columnas de la derecha explican una diferencia de filosofía que conviene
conocer antes de elegir:

**Prisma y Flyway son de ida.** La vuelta atrás se escribe como otra migración
hacia adelante. Es más pobre, y también más honesto: `DROP COLUMN` no devuelve los
datos que había en ella, así que la marcha atrás rara vez es la que se cree.

**Alembic y EF Core traen vuelta atrás**, y es realmente útil en desarrollo —
probar una migración, deshacerla, corregirla. En producción se usa mucho menos de
lo que su existencia sugiere.

## 🌐 El comando de producción no es el de desarrollo

| Herramienta | Desarrollo | Producción |
| --- | --- | --- |
| Prisma | `migrate dev` — compara, genera y puede **rehacer la base** | `migrate deploy` |
| EF Core | `migrations add` | `database update` / `Database.Migrate()` |
| Alembic | `revision --autogenerate` | `upgrade head` |
| Flyway | escribir el `.sql` | `migrate` |

Los de la izquierda **escriben archivos y comparan modelos**; los de la derecha
solo aplican lo que falta. Confundirlos es de los errores más caros de esta
categoría, y por eso las implementaciones de esta clase usan los de la derecha.

## ⚠️ Errores frecuentes

- **Dejar `ddl-auto` creando el esquema y añadir Flyway encima.** Dos
  herramientas mandando sobre el mismo esquema, y solo puede mandar una.
- **Añadir una columna `NOT NULL` sin valor por omisión.** Falla con datos
  dentro y pasa en local, donde la tabla está vacía.
- **Editar una migración ya aplicada.** La suma de comprobación deja de cuadrar.
- **Confiar en la marcha atrás para recuperar datos.** No los recupera.
- **Ejecutar el comando de desarrollo en producción.**
- **No versionar las migraciones.** Son parte del código, no un artefacto.
- **Suponer que el esquema y el código se despliegan a la vez.** No lo hacen.

## ✅ Verificación

```bash
node scripts/run-class.mjs 058
```

## 🧪 Reto de transferencia

Quita el `DEFAULT 0` de la segunda migración y vuelve a ejecutar. Fallará **al
arrancar**, no al usar la columna, y con un error del motor —no del ORM. Después
borra la fila de la primera migración y comprueba que con la tabla vacía todo
pasa: es exactamente por eso que este fallo llega tan a menudo a producción.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 057 — Transacciones](../057-transacciones/README.md)
- [Clase 059 — Semillas y datos de prueba](../059-semillas-y-datos-de-prueba/README.md)
- [Módulo 06 — Persistencia y dominio](../../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@ambler-sadalage-refactoring-databases] Ambler, Scott W.; Sadalage, Pramod J. *Refactoring Databases*. Addison-Wesley, 2006. ISBN 9780321293534 — <https://openlibrary.org/isbn/9780321293534>
- [@humble-farley-continuous-delivery] Humble, Jez; Farley, David. *Continuous Delivery*. Addison-Wesley, 2010. ISBN 9780321601919 — <https://openlibrary.org/isbn/9780321601919>
- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
