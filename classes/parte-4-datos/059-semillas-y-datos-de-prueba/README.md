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

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Semilla**](../../../glosario/README.md#semilla) *(Seed)* | Datos de partida que se cargan de forma repetible: los mínimos para que la aplicación funcione, o un juego de prueba. Repetible significa que ejecutarla dos veces no duplica nada. |

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
pnpm install --silent --ignore-scripts
pnpm exec prisma generate
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node server.mjs
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `catalogo.json` | datos en JSON usados por la implementación |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `prisma/schema.prisma` | esquema de Prisma: el modelo de datos del que se genera el cliente |
| `server.mjs` | código JavaScript (módulo ES) |

### 🔧 SQLAlchemy

Separa explícitamente el constructor de consultas del mapeador, de modo que se puede bajar de nivel sin abandonarlo.

- **Documentación oficial:** <https://docs.sqlalchemy.org/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `fastapi==0.121.3, uvicorn==0.40.0, sqlalchemy==2.0.44`
- **Necesita en el PATH:** `python`

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 python -m uvicorn main:app --host 127.0.0.1 --port 3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `catalogo.json` | datos en JSON usados por la implementación |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `main.py` | código Python |
| `requirements.txt` | dependencias de Python, una por línea, con versión fijada |

### 🔧 Hibernate ORM

El mapeador objeto-relacional de referencia en Java y el origen de buena parte del vocabulario del campo, incluido el problema de la consulta N+1.

- **Documentación oficial:** <https://hibernate.org/orm/documentation/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `spring-boot 3.5.6, Java 21, spring-boot-starter-web, spring-boot-starter-data-jpa, h2`
- **Necesita en el PATH:** `java`, `mvn`

Preparar sus dependencias, dentro de su directorio:

```bash
mvn -q -B package -DskipTests
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 java -jar target/clase-059-1.0.0.jar --server.port=3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `pom.xml` | manifiesto de Maven: el proyecto, su Java, sus dependencias y cómo se empaqueta |
| `src/main/java/labs/Aplicacion.java` | código Java |
| `src/main/resources/application.properties` | configuración de Spring Boot: lo que se ajusta sin tocar el código |
| `src/main/resources/catalogo.json` | datos en JSON usados por la implementación |

### 🔧 Entity Framework Core

Mapeador con migraciones y consultas integradas en el lenguaje. El contraste con Dapper ilustra el compromiso entre abstracción y control.

- **Documentación oficial:** <https://learn.microsoft.com/ef/core/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `net10.0, Microsoft.EntityFrameworkCore.Sqlite 10.0.0`
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
| `Clase059.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `Program.cs` | código C# |
| `catalogo.json` | datos en JSON usados por la implementación |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

En las cuatro, **el catálogo es un archivo JSON**, no código:

```json
[
  { "id": 1, "titulo": "comprar pan" },
  { "id": 2, "titulo": "regar" },
  { "id": 3, "titulo": "llamar" }
]
```

Eso tiene dos consecuencias prácticas que valen la decisión: **se revisa en una
pull request como cualquier otro dato**, y **se puede cargar desde una prueba sin
arrancar nada**.

Y las cuatro son idempotentes de la misma manera —y no de la que casi todo el
mundo usa.

### Prisma · [`prisma/server.mjs`](implementaciones/prisma/server.mjs) — `upsert`

```javascript
const catalogo = JSON.parse(await readFile(new URL("./catalogo.json", import.meta.url), "utf8"));
```

```javascript
  for (const fila of catalogo) {
    const antes = await prisma.tarea.findUnique({ where: { id: fila.id } });
    await prisma.tarea.upsert({
      where: { id: fila.id },
      update: { titulo: fila.titulo },
      create: fila,
    });
```

`upsert` crea si no existe y actualiza si existe: **una sola operación** para las
dos ramas.

Como los identificadores del catálogo son **fijos**, sembrar dos veces deja el
mismo estado — y no se lleva por delante lo que hayan añadido otros.

### SQLAlchemy · [`sqlalchemy/main.py`](implementaciones/sqlalchemy/main.py) — `merge`

```python
CATALOGO = json.loads((Path(__file__).parent / "catalogo.json").read_text(encoding="utf-8"))
```

```python
        for fila in CATALOGO:
            if s.get(Tarea, fila["id"]) is None:
                creadas += 1
            s.merge(Tarea(id=fila["id"], titulo=fila["titulo"]))
        s.commit()
```

`merge` es el `upsert` de SQLAlchemy: inserta si no existe, actualiza si existe.
El `get` previo está solo para **contar** cuántas se crearon, que es lo que el
contrato mide.

### Hibernate · [`hibernate/…/Aplicacion.java`](implementaciones/hibernate/src/main/java/labs/Aplicacion.java) — `save` con identificador

```java
            for (Fila fila : catalogo) {
                if (!tareas.existsById(fila.id())) {
                    creadas++;
                }
                Tarea tarea = new Tarea();
                tarea.id = fila.id();
                tarea.titulo = fila.titulo();
                tareas.save(tarea);
            }
```

Aquí no hay método `upsert`: **`save` con un identificador que ya existe hace una
fusión en lugar de un alta**. Es un comportamiento que sorprende la primera vez
—`save` suena a insertar— y es exactamente lo que hace falta aquí.

```java
        public int reiniciar() {
            tareas.deleteAllInBatch();
            return sembrar();
        }
```

Y **reiniciar es otra operación**: borra y vuelve a sembrar. Mezclarla con
sembrar sería el error de diseño de esta clase — una semilla que borra no se
puede ejecutar en producción.

### Entity Framework Core · [`entity-framework-core/Program.cs`](implementaciones/entity-framework-core/Program.cs) — buscar y decidir

```csharp
    foreach (var fila in catalogo)
    {
        var existente = await contexto.Tareas.FindAsync(fila.Id);
        if (existente is null)
        {
            contexto.Tareas.Add(new Tarea { Id = fila.Id, Titulo = fila.Titulo });
            creadas++;
        }
        else
        {
            existente.Titulo = fila.Titulo;
        }
```

**EF Core no tiene una operación de inserción-o-actualización**: se busca y se
decide. Es más código y es más explícito — se ve exactamente qué pasa en cada
rama.

Los cuatro llegan al mismo sitio por caminos distintos, y eso vuelve a decir algo
del dominio: cuando cuatro ORM inventan la misma operación con tres nombres,
**el problema es del problema**.

### La alternativa que falla, y por qué se ve tanto

```javascript
 * La alternativa que se ve mucho —«si la tabla está vacía, siembra»— falla en
```

Sembrar solo si la tabla está vacía es lo primero que se le ocurre a cualquiera,
y funciona el primer día.

**Falla en cuanto el catálogo crece.** La fila nueva no entra nunca, porque la
tabla ya no está vacía. Y falla en silencio: nadie ve un error, simplemente el
dato que se añadió al catálogo no aparece en producción.

La idempotencia **por identificador** —la de las cuatro implementaciones— no
tiene ese problema: cada fila se compara consigo misma.

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
