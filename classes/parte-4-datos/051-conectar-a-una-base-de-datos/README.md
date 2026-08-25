# Clase 051 — Conectar a una base de datos

> [⬅️ 050](../../parte-3-validacion-y-contrato/050-que-rompe-a-quien/README.md) · [📚 Parte 4](../README.md) · [🎓 Clases](../../README.md) · [052 ➡️](../052-sql-a-mano/README.md)
>
> Parte **4 — Datos** · Nivel **🟢 introductorio** · Pista **`datos`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Abrir una conexión, escribir, leer de vuelta y **liberarla bien**. La última
parte es la que decide si el servicio aguanta más de diez minutos con tráfico.

## 🧩 La situación

`GET /salud` responde `{"conectado": true}`. `POST /tareas` guarda y devuelve el
identificador **que asignó la base**. `GET /tareas/1` lo lee de vuelta.

## 📖 Comprobar la conexión: lo que no vale

```javascript
if (prisma) return { conectado: true };   // ❌ no prueba nada
```

El objeto cliente **se construye sin conectar**. Casi todos los ORM abren la
conexión perezosamente, en la primera consulta. Comprobar que el objeto existe
dice que la biblioteca se cargó, no que la base responda.

Las cuatro implementaciones hacen una consulta de verdad:

```javascript
await prisma.$queryRaw`SELECT 1`;                    // Prisma
```
```python
s.execute(text("SELECT 1"))                          # SQLAlchemy
```
```java
jdbc.queryForObject("SELECT 1", Integer.class);      // Hibernate
```
```csharp
await contexto.Database.CanConnectAsync();           // EF Core
```

Es la diferencia entre un punto de salud que informa y uno decorativo — la clase
134 vuelve sobre ello.

## 📖 Los dos objetos: motor y sesión

Todos los ORM de esta clase distinguen dos cosas que se confunden con
frecuencia:

| | Vive | Qué es |
| --- | --- | --- |
| **Motor / cliente / contexto de conexión** | **todo el proceso** | mantiene el grupo de conexiones |
| **Sesión / unidad de trabajo** | **una petición** | acumula cambios y los confirma |

```python
# SQLAlchemy — el motor, UNA vez
motor = create_engine("sqlite:///datos.db")
CrearSesion = sessionmaker(bind=motor)

# La sesión, por petición, y CERRADA siempre
def sesion() -> Iterator[Session]:
    s = CrearSesion()
    try:
        yield s
    finally:
        s.close()
```

**Confundirlos es el error más caro de la clase.** Crear un motor por petición
abre un grupo de conexiones nuevo cada vez: la base llega a su límite de
conexiones en minutos, y el síntoma —«la base no responde»— apunta al sitio
equivocado.

Y el `finally` no es adorno. Sin él, una excepción deja la conexión fuera del
grupo. Cada fallo consume una conexión que nunca vuelve, así que **el servicio se
degrada en proporción a sus errores** — un fallo que empeora justo cuando algo
va mal.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /salud` | `{"conectado":true}` |
| `POST /tareas` `{"titulo":"persistida"}` | `201` · `id: 1` |
| `GET /tareas/1` | `200` · lo escrito |
| `POST /tareas` otra vez | `201` · `id: 2` |
| `GET /tareas/999` | `404` |

El cuarto caso comprueba que **el identificador lo asigna la base**, no el
código: dos escrituras obtienen valores distintos sin que nadie los cuente.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**ORM**](../../../glosario/README.md#orm) *(Mapeador objeto-relacional)* | Una capa que traduce entre filas de una base de datos relacional y objetos del lenguaje. Su valor no es escribir menos SQL: es que la API de consulta **no acepte SQL como cadena**, lo que cierra la inyección por construcción. |

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
PORT=3000 java -jar target/clase-051-1.0.0.jar --server.port=3000
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
| `Clase051.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `Program.cs` | código C# |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Cada una usa **la base embebida de su ecosistema** —SQLite para Node, Python y
.NET; H2 para la JVM— porque el objetivo es que la clase se ejecute sin instalar
un servidor. Lo que se compara es el ORM, no el motor.

Y hay una distinción que atraviesa las cuatro y conviene tener antes de leerlas:

| Objeto | Cuánto vive | Por qué |
| --- | --- | --- |
| **Motor / cliente / contexto de conexión** | todo el proceso | mantiene el grupo de conexiones, que es caro de crear |
| **Sesión / unidad de trabajo** | una petición | acumula los cambios y los confirma juntos |

Confundirlos es el error más caro de la parte 4, y las cuatro implementaciones
lo tratan de forma distinta.

### Prisma · [`prisma/schema.prisma`](implementaciones/prisma/prisma/schema.prisma) — un lenguaje propio

```prisma
model Tarea {
  id     Int    @id @default(autoincrement())
  titulo String
}
```

El esquema no se escribe en JavaScript: se escribe en **el lenguaje propio de
Prisma**. De ahí salen el cliente tipado y las migraciones.

Es la decisión que más divide sobre esta herramienta: un lenguaje más que
aprender y otro archivo que mantener, a cambio de un cliente generado con
autocompletado real.

Y en [`prisma/server.mjs`](implementaciones/prisma/server.mjs):

```javascript
const prisma = new PrismaClient();
```

```javascript
  const tarea = await prisma.tarea.create({ data: { titulo: peticion.body?.titulo ?? "" } });
```

`prisma.tarea` existe porque el cliente **se generó** a partir del modelo. No hay
una clase `Tarea` escrita en ningún sitio de este archivo.

**Una instancia para todo el proceso.** Crear un cliente por petición abriría un
grupo de conexiones nuevo cada vez y agotaría la base en minutos — el error más
caro de esta clase, y la 061 lo mide.

```javascript
    servidor.close();
    await prisma.$disconnect();
```

Y cerrar bien al terminar: sin esto las conexiones quedan abiertas hasta que la
base las expire por su cuenta.

### SQLAlchemy · [`sqlalchemy/main.py`](implementaciones/sqlalchemy/main.py) — motor y sesión, separados a la vista

```python
motor = create_engine("sqlite:///datos.db", echo=False)
```

```python
CrearSesion = sessionmaker(bind=motor, expire_on_commit=False)
```

```python
    s = CrearSesion()
    try:
        yield s
    finally:
        s.close()
```

**La implementación que mejor enseña la distinción de la tabla**, porque tiene
dos objetos con dos nombres: el motor se crea una vez y la sesión por petición.

El `finally` no es opcional. Sin él, una excepción deja la conexión fuera del
grupo —no se devuelve— y con tráfico real el grupo se agota en minutos. Es una
fuga que no produce ningún error hasta que produce todos a la vez.

```python
def crear(cuerpo: Cuerpo, s: Annotated[Session, Depends(sesion)]) -> JSONResponse:
```

Y la sesión llega **por inyección de dependencias** (clase 036): el generador con
`yield` es un recurso con apertura y cierre, y FastAPI garantiza el cierre.

### Hibernate · [`hibernate/…/Aplicacion.java`](implementaciones/hibernate/src/main/java/labs/Aplicacion.java) — la interfaz sin implementación

```java
    public interface Tareas extends JpaRepository<Tarea, Long> {
    }
```

**Eso es todo.** Spring Data genera la implementación al arrancar, con `save`,
`findById`, `findAll` y decenas de métodos más deducidos del nombre.

Es lo más declarativo de las cuatro y tiene un coste concreto: **el código que se
ejecuta no está escrito en ningún sitio que puedas leer**. Depurar un
comportamiento raro exige entender el generador, no leer un archivo.

```java
    @Entity
    @Table(name = "tareas")
    public static class Tarea {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        public Long id;
```

La entidad es una clase Java corriente con anotaciones — no un lenguaje aparte
como Prisma. La forma vive en el tipo.

Y la sesión aquí es invisible: la abre y la cierra Spring alrededor de cada
método del repositorio. Cómodo, y la razón de que el problema N+1 de la clase
056 sea tan fácil de provocar sin darse cuenta.

### Entity Framework Core · [`entity-framework-core/Program.cs`](implementaciones/entity-framework-core/Program.cs) — el contenedor decide el ámbito

```csharp
constructor.Services.AddDbContext<Contexto>(opciones =>
    opciones.UseSqlite("Data Source=datos.db"));
```

Una línea que hace las dos cosas de la tabla: registra el contexto con ámbito
**por petición** —la clase 037— y mantiene el grupo de conexiones **a nivel de
proceso**.

Es el reparto más limpio del elenco, y el que menos se ve: no hay dos objetos con
dos nombres como en SQLAlchemy; hay uno cuyo ciclo de vida lo decide el
contenedor.

```csharp
app.MapPost("/tareas", async (Cuerpo? cuerpo, Contexto contexto) =>
{
    var tarea = new Tarea { Titulo = cuerpo?.Titulo ?? "" };
    contexto.Tareas.Add(tarea);
    await contexto.SaveChangesAsync();
```

`Add` no escribe: **marca**. La escritura ocurre en `SaveChangesAsync`, y eso es
lo que permite acumular varios cambios y confirmarlos juntos — la unidad de
trabajo que la clase 057 convierte en transacciones.

### Lo que las cuatro hacen igual en `/salud`

```javascript
    await prisma.$queryRaw`SELECT 1`;
```

```python
        s.execute(text("SELECT 1"))
```

```java
                jdbc.queryForObject("SELECT 1", Integer.class);
```

```csharp
        var vivo = await contexto.Database.CanConnectAsync();
```

**Una consulta de verdad.** Comprobar que el objeto cliente existe no prueba
nada: se construye sin conectar, y devolvería «conectado» con la base apagada.

Es la misma lección del verde honesto aplicada a una sonda: **lo que no se
ejecuta no se puede afirmar**. La clase 133 la convierte en la distinción entre
salud y preparación.

## 🔍 Lo que esta clase destapó

La implementación de Prisma falló al preparar, con este mensaje:

```text
Error: Prisma Migrate detected that it was invoked by Claude Code.
```

**La herramienta de migración de Prisma detecta que la invoca un agente de IA y
se niega a ejecutarse.** Es una salvaguarda deliberada: una migración puede
destruir datos, y ejecutarla sin una persona delante es un riesgo real.

Es una decisión de producto defendible, y aquí obliga a crear el esquema por otra
vía —SQL directo desde el servidor—. Para esta clase da igual: lo que enseña es
conectar, escribir y leer. Las migraciones son la clase 058.

Merece quedar escrito porque es el tipo de restricción que no aparece en ninguna
documentación de framework y **solo se descubre construyendo**.

## 🔬 Comparación

| ORM | Esquema | Consulta | Objeto de conexión |
| --- | --- | --- | --- |
| Prisma | lenguaje propio | cliente generado | `PrismaClient`, uno por proceso |
| SQLAlchemy | clases de Python | sesión explícita | motor + fábrica de sesiones |
| Hibernate | anotaciones sobre la clase | repositorio generado | fuente de datos de Spring |
| EF Core | clases de C# | `DbSet` en el contexto | contexto por petición |

## ⚠️ Errores frecuentes

- **Crear el cliente o el motor por petición.** Agota las conexiones.
- **No cerrar la sesión en el camino de error.** Se degrada con cada fallo.
- **Comprobar la salud sin consultar.** Un punto de salud decorativo.
- **Credenciales en el código.** Van en configuración — clase 075.
- **Confiar en el valor por omisión del tamaño del grupo.** Clase 061.
- **Usar la base embebida en producción** porque funcionó en la clase.

## ✅ Verificación

```bash
node scripts/run-class.mjs 051
```

## 🧪 Reto de transferencia

Quita el `finally` que cierra la sesión en SQLAlchemy y provoca 20 peticiones que
fallen. Después mira cuántas conexiones quedan abiertas. Es la forma más directa
de entender por qué esa línea existe.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 061 — Grupo de conexiones](../061-grupo-de-conexiones/README.md)
- [Módulo 06 — Persistencia y dominio](../../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@fowler-poeaa] Fowler, Martin. *Patterns of Enterprise Application Architecture*. Addison-Wesley, 2002. ISBN 9780321127426 — <https://openlibrary.org/isbn/9780321127426>
- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
