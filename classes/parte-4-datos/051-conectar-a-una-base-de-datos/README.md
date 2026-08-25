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
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Program.cs` | código C# |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones

Cada una usa **la base embebida de su ecosistema** —SQLite para Node, Python y
.NET; H2 para la JVM— porque el objetivo es que la clase se ejecute sin instalar
un servidor. Lo que se compara es el ORM, no el motor.

### Prisma — cliente generado

```javascript
const tarea = await prisma.tarea.create({ data: { titulo } });
```

El cliente lo genera Prisma desde su esquema propio, y por eso `prisma.tarea`
existe con autocompletado. Es la propuesta que la
[ficha de Prisma](../../../atlas/fichas/prisma.md) describe, con el coste que
señala: un lenguaje más que aprender.

### Hibernate — la interfaz sin implementación

```java
public interface Tareas extends JpaRepository<Tarea, Long> {
}
```

**Eso es todo.** Spring Data genera la implementación al arrancar, con `save`,
`findById`, `findAll` y decenas de métodos más deducidos del nombre.

Es lo más declarativo de las cuatro y tiene un coste concreto: **el código que se
ejecuta no está escrito en ningún sitio que puedas leer**. Depurar exige entender
el generador.

### EF Core — el contexto por petición

```csharp
constructor.Services.AddDbContext<Contexto>(opciones => opciones.UseSqlite(...));
```

`AddDbContext` registra el contexto con ámbito **por petición** —la clase 037— y
mantiene el grupo de conexiones a nivel de proceso. Los dos objetos de la tabla
de arriba, resueltos por el contenedor.

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
