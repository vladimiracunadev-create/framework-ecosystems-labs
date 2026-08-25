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

<!-- generado: fichas -->

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **Prisma ORM** | mapeador objeto-relacional de JavaScript/TypeScript (TypeScript) | 2021 | Apache-2.0 | proyecto independiente |
| **SQLAlchemy** | mapeador objeto-relacional de Python (Python) | 2006 | MIT | proyecto independiente |
| **Hibernate ORM** | mapeador objeto-relacional de JVM (Java) | 2001 | LGPL-2.1-or-later | proyecto independiente |
| **Entity Framework Core** | mapeador objeto-relacional de .NET (C#) | 2016 | MIT | proyecto independiente |

### 🔧 Prisma ORM

Esquema propio del que se genera un cliente tipado. Un lenguaje más que aprender, a cambio de tipos exactos.

- **Documentación oficial:** <https://www.prisma.io/docs>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `@prisma/client ^6.16.2, express ^5.1.0, prisma ^6.16.2`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm,install,--silent,--ignore-scripts pnpm,exec,prisma,generate
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node server.mjs
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `prisma/datos.db` | base de datos SQLite del laboratorio |
| `prisma/migration_lock.toml` | archivo del proyecto |
| `prisma/migrations/20260101000000_crear_tareas/migration.sql` | sentencias SQL |
| `prisma/migrations/20260101000100_anadir_prioridad/migration.sql` | sentencias SQL |

### 🔧 SQLAlchemy

Separa explícitamente el constructor de consultas del mapeador, de modo que se puede bajar de nivel sin abandonarlo.

- **Documentación oficial:** <https://docs.sqlalchemy.org/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `fastapi==0.121.3, uvicorn==0.40.0, sqlalchemy==2.0.44, alembic==1.19.1`
- **Necesita en el PATH:** `python`

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 python -m uvicorn main:app --host 127.0.0.1 --port 3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `alembic.ini` | archivo del proyecto |
| `datos.db` | base de datos SQLite del laboratorio |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `main.py` | código Python |
| `migraciones/env.py` | código Python |
| `migraciones/script.py.mako` | archivo del proyecto |
| `migraciones/versions/001_crear_tareas.py` | código Python |
| `migraciones/versions/002_anadir_prioridad.py` | código Python |

### 🔧 Hibernate ORM

El mapeador objeto-relacional de referencia en Java y el origen de buena parte del vocabulario del campo, incluido el problema de la consulta N+1.

- **Documentación oficial:** <https://hibernate.org/orm/documentation/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `spring-boot 3.5.6, Java 21, spring-boot-starter-web, spring-boot-starter-data-jpa, flyway-core, h2`
- **Necesita en el PATH:** `java`, `mvn`

Preparar sus dependencias, dentro de su directorio:

```bash
mvn -q -B package -DskipTests
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 java -jar target/clase-058-1.0.0.jar --server.port=3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `pom.xml` | manifiesto de Maven: el proyecto, su Java, sus dependencias y cómo se empaqueta |
| `src/main/java/labs/Aplicacion.java` | código Java |
| `src/main/resources/application.properties` | configuración de Spring Boot: lo que se ajusta sin tocar el código |
| `src/main/resources/db/migration/V1__crear_tareas.sql` | sentencias SQL |
| `src/main/resources/db/migration/V2__anadir_prioridad.sql` | sentencias SQL |

### 🔧 Entity Framework Core

Mapeador con migraciones y consultas integradas en el lenguaje. El contraste con Dapper ilustra el compromiso entre abstracción y control.

- **Documentación oficial:** <https://learn.microsoft.com/ef/core/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `net10.0, Microsoft.EntityFrameworkCore.Sqlite 10.0.0, Microsoft.EntityFrameworkCore.Design 10.0.0`
- **Necesita en el PATH:** `dotnet`

Preparar sus dependencias, dentro de su directorio:

```bash
dotnet build -c Release --nologo -v quiet
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 dotnet run -c Release --no-build --urls http://127.0.0.1:3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `Clase058.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Migraciones/20260101000000_CrearTareas.cs` | código C# |
| `Migraciones/20260101000100_AnadirPrioridad.cs` | código C# |
| `Migraciones/ContextoModelSnapshot.cs` | código C# |
| `Program.cs` | código C# |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

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
