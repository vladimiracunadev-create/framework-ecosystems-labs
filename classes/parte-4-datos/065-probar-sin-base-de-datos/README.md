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
PORT=3000 java -jar target/clase-065-1.0.0.jar --server.port=3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `pom.xml` | manifiesto de Maven: el proyecto, su Java, sus dependencias y cómo se empaqueta |
| `src/main/java/labs/Aplicacion.java` | código Java |
| `src/main/resources/application.properties` | configuración de Spring Boot: lo que se ajusta sin tocar el código |

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
| `Clase065.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Program.cs` | código C# |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

En las cuatro, las pruebas están escritas **una sola vez** y se ejecutan contra
las tres estrategias sin cambiar una línea. Eso es posible porque existe la
interfaz de la [clase 064](../064-repositorio-y-dominio/README.md).

Y en las cuatro, la cuarta prueba —la de unicidad— **pasa con motor y falla con
el doble**. Ese fallo no es un error del ejemplo: es el resultado que la clase
viene a enseñar.

### Prisma · [`prisma/server.mjs`](implementaciones/prisma/server.mjs)

**Las tres estrategias, declaradas de entrada:**

```javascript
/**
 * TRES FORMAS DE PROBAR LO MISMO.
 *
 * - `doble`: un objeto en memoria que imita al repositorio. No hay motor.
 * - `en-memoria`: una base de VERDAD, creada para las pruebas y desechable.
 * - `real`: la misma base que usa el servicio.
 *
 * Las cuatro pruebas son idénticas en las tres. Lo que cambia es qué detectan —
 * y una de ellas solo pasa cuando hay un motor detrás.
 */
```

**La restricción vive en la base:**

```javascript
  await cliente.$executeRawUnsafe("CREATE UNIQUE INDEX Tarea_titulo_key ON Tarea(titulo)");
```

**Y el doble, que no la tiene:**

```javascript
  async crear(titulo) {
    const tarea = { id: this.siguiente++, titulo };
    this.filas.set(tarea.id, tarea);
    return tarea;
  }
```

Fíjate en que **el doble no está mal escrito**. Hace exactamente lo mismo que el
repositorio de verdad, que tampoco comprueba la unicidad — la aplica la base.

Ese detalle es la clase entera: el doble no es incorrecto, es **incompleto**, y su
hueco tiene exactamente la forma de lo que el motor hacía por ti sin que nadie lo
escribiera.

**Las cuatro pruebas, iguales para las tres:**

```javascript
  {
    nombre: "la restricción de unicidad la aplica la base, no el código",
    async ejecutar(repositorio) {
      await repositorio.crear("repetida");
      try {
        await repositorio.crear("repetida");
        return false; // no protestó: el hueco del doble
      } catch {
        return true;
      }
    },
  },
```

**Y la ruta que pone el hueco por escrito:**

```javascript
  const indice = PRUEBAS.length - 1;
  respuesta.json({
    prueba: PRUEBAS[indice].nombre,
    doble: porEstrategia["doble"][indice].paso,
    en_memoria: porEstrategia["en-memoria"][indice].paso,
    real: porEstrategia["real"][indice].paso,
  });
```

**Por qué se usa el doble igualmente:**

```javascript
    const inicio = process.hrtime.bigint();
    for (let i = 0; i < 20; i++) await ejecutar(estrategia);
    tiempos[estrategia] = Number((process.hrtime.bigint() - inicio) / 1_000_000n);
```

El contrato no exige una diferencia concreta —eso sería medir la máquina de quien
ejecuta, y la clase 007 explica por qué eso no vale—. Exige solo que **el doble
sea el más rápido**, que es lo estable entre máquinas y lo único que justifica
usarlo.

### SQLAlchemy · [`sqlalchemy/main.py`](implementaciones/sqlalchemy/main.py)

Aquí la base de pruebas es de verdad en memoria, y tiene truco:

```python
motor_pruebas = create_engine(
    "sqlite:///:memory:", connect_args={"check_same_thread": False}, poolclass=StaticPool
)
```

```python
# `sqlite:///:memory:` con `StaticPool` mantiene UNA conexion viva, y con ella la
# base entera. Sin `StaticPool`, cada conexion abriria su propia base vacia y las
# pruebas no verian nada de lo que escribieron.
```

Es una de esas trampas que cuestan una tarde: las pruebas escriben, leen y no
encuentran nada, sin ningún error. La clase 061 explicó qué es un grupo de
conexiones; esta muestra por qué a veces hay que apagarlo.

```python
def prueba_unicidad(repositorio) -> bool:
    repositorio.crear("repetida")
    try:
        repositorio.crear("repetida")
        return False  # no protesto: el hueco del doble
    except IntegrityError:
        return True
```

`IntegrityError` es de SQLAlchemy, no de SQLite: el ORM traduce el error del
motor a una excepción propia. Por eso esta misma prueba seguiría valiendo al
cambiar a PostgreSQL — cosa que no ocurriría capturando el error nativo.

### Hibernate · [`hibernate/…/Aplicacion.java`](implementaciones/hibernate/src/main/java/labs/Aplicacion.java)

La restricción se declara en la entidad y el esquema la hereda:

```java
        @Column(nullable = false, unique = true)
```

Y la estrategia «en memoria» es **una segunda base H2**, no un doble:

```java
            DriverManagerDataSource fuente = new DriverManagerDataSource(
                    "jdbc:h2:mem:pruebas065;DB_CLOSE_DELAY=-1");
```

```java
            // Una SEGUNDA base H2, distinta de la del servicio. Es el equivalente
            // exacto de lo que se hace en un proyecto real: un motor de pruebas
            // desechable, separado del de produccion.
```

`DB_CLOSE_DELAY=-1` es el equivalente de H2 al `StaticPool` de SQLAlchemy y a la
conexión abierta de SQLite: **mantener viva la base entre conexiones**. Los tres
ecosistemas tienen el mismo problema y tres nombres distintos para la solución.

```java
            return switch (estrategia) {
                case "doble" -> new Doble();
                case "en-memoria" -> new RepositorioJdbc(pruebas);
                default -> new RepositorioJpa(tareas);
            };
```

Con una advertencia que el mundo JVM aprendió por las malas: **H2 no es
PostgreSQL**. Probar contra H2 y desplegar contra PostgreSQL deja fuera todo lo
que distingue a un motor de otro —tipos, funciones, comportamiento de las
transacciones, mensajes de error—. De ahí que hoy la recomendación sea
Testcontainers: el mismo motor de producción, en un contenedor desechable.

### Entity Framework Core · [`entity-framework-core/Program.cs`](implementaciones/entity-framework-core/Program.cs)

```csharp
        constructor.Entity<Tarea>().HasIndex(t => t.Titulo).IsUnique();
```

Y la misma técnica de mantener viva la base, por tercera vez:

```csharp
var conexionPruebas = new SqliteConnection("Data Source=:memory:");
conexionPruebas.Open();
```

```csharp
// La conexión de la base en memoria se mantiene ABIERTA a propósito: SQLite
// destruye una base `:memory:` en cuanto se cierra su última conexión, y las
// pruebas no verían nada de lo que escribieron.
```

```csharp
IRepositorio RepositorioDe(string estrategia) => estrategia switch
{
    "doble" => new Doble(),
    "en-memoria" => new RepositorioEfCore(opcionesPruebas),
    _ => new RepositorioEfCore(opcionesReales),
};
```

Aquí conviene señalar lo que la implementación **no** usa, porque es un error
común: EF Core trae un proveedor `InMemory`, y la propia documentación de
Microsoft desaconseja usarlo para probar. No es una base relacional — no aplica
restricciones de unicidad, no aplica claves foráneas, no ejecuta SQL. Es
exactamente el doble de esta clase con nombre de base de datos, y por eso aquí la
estrategia «en-memoria» es **SQLite en memoria**, que sí es un motor.

```csharp
        catch (DbUpdateException)
        {
            return true;
        }
```

`DbUpdateException` es la excepción de EF Core, igual que `IntegrityError` en
SQLAlchemy: el ORM normaliza el fallo del motor. Cuatro implementaciones, cuatro
formas de decir lo mismo — **la base protestó, y el doble no sabía protestar**.

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
