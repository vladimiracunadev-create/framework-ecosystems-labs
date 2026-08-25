# Clase 060 — Cuándo salir del ORM

> [⬅️ 059](../059-semillas-y-datos-de-prueba/README.md) · [📚 Parte 4](../README.md) · [🎓 Clases](../../README.md) · [061 ➡️](../061-grupo-de-conexiones/README.md)
>
> Parte **4 — Datos** · Nivel **🔴 avanzado** · Pista **`datos`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Reconocer la consulta que el mapeador **no debe generar** — y bajar a SQL sin
perder nada de lo que el ORM te daba.

## 🧩 La situación

Un informe por proyecto: cuántas tareas hay y cuántas están hechas. Se calcula de
dos formas, y **las dos devuelven exactamente lo mismo**.

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
PORT=3000 java -jar target/clase-060-1.0.0.jar --server.port=3000
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
| `Clase060.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Program.cs` | código C# |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Cada una expone **dos rutas que devuelven exactamente lo mismo**: `/informe-orm`
y `/informe-sql`. Y cada una cuenta **cuántas filas le llegaron al proceso**, que
es la medida honesta de esta clase.

Porque el resultado no distingue nada: los dos informes dan las mismas tres
filas. Lo que cambia es **cuánto viajó por la red y cuánto trabajo hizo el
proceso en lugar del motor**.

### Prisma · [`prisma/server.mjs`](implementaciones/prisma/server.mjs)

**Con el ORM:**

```javascript
  const tareas = await prisma.tarea.findMany();
  filasLeidas = tareas.length;

  const porProyecto = new Map();
  for (const tarea of tareas) {
    const acumulado = porProyecto.get(tarea.proyecto) ?? { total: 0, hechas: 0 };
    acumulado.total += 1;
    if (tarea.hecha) acumulado.hechas += 1;
    porProyecto.set(tarea.proyecto, acumulado);
  }
```

Trae **todas** las filas y agrupa en memoria. Con cuatro tareas da igual. Con
cuatro millones, el proceso se queda sin memoria haciendo un trabajo que el motor
sabe hacer sin mover una fila.

**En SQL:**

```javascript
  const filas = await prisma.$queryRaw`
    SELECT proyecto,
           COUNT(*)                        AS total,
           SUM(CASE WHEN hecha THEN 1 ELSE 0 END) AS hechas
      FROM Tarea
     GROUP BY proyecto
    HAVING COUNT(*) >= ${minimo}
     ORDER BY proyecto`;
```

El motor agrupa y devuelve **tres filas**. `$queryRaw` es una plantilla
etiquetada: cada `${}` es un marcador, no una interpolación — la misma
construcción de la clase 052.

**Salir del ORM no significa salir de las consultas parametrizadas.** Eso no se
negocia nunca, y es la diferencia entre `$queryRaw` y `$queryRawUnsafe`.

```javascript
  if (!Number.isInteger(minimo) || minimo < 0) {
    respuesta.status(400).json({ code: "MINIMO_INVALIDO" });
```

Y la validación **antes** de la consulta: un marcador solo vale para un valor, no
para un fragmento de SQL. Si esperas un número, compruébalo tú.

### SQLAlchemy · [`sqlalchemy/main.py`](implementaciones/sqlalchemy/main.py)

```python
    consulta = text("""
        SELECT proyecto,
               COUNT(*)                               AS total,
               SUM(CASE WHEN hecha THEN 1 ELSE 0 END) AS hechas
          FROM tareas
         GROUP BY proyecto
        HAVING COUNT(*) >= :minimo
         ORDER BY proyecto
    """)
```

```python
    if not minimo.isdigit():
        return JSONResponse({"code": "MINIMO_INVALIDO"}, status_code=400)
```

La misma consulta con `:minimo` como marcador. Y SQLAlchemy tiene aquí una
ventaja de diseño: **la misma biblioteca cubre los dos niveles**. Salir del ORM
no significa cambiar de herramienta ni abrir otra conexión — se usa Core donde
hace falta y ORM donde no.

### Hibernate · [`hibernate/…/Aplicacion.java`](implementaciones/hibernate/src/main/java/labs/Aplicacion.java)

```java
        public ResponseEntity<Map<String, Object>> informeSql(
                @RequestParam(name = "minimo", defaultValue = "1") String minimo) {
```

```java
            try {
                limite = Integer.parseInt(minimo);
            } catch (NumberFormatException fallo) {
                return ResponseEntity.status(400).body(Map.of("code", "MINIMO_INVALIDO"));
            }
```

El parámetro llega como **texto** a propósito, aunque Spring sabría convertirlo:
así el `400` lo emite el contrato y no el framework, y la validación queda a la
vista. Es la misma decisión que la clase 013 tomó por el motivo opuesto.

### Entity Framework Core · [`entity-framework-core/Program.cs`](implementaciones/entity-framework-core/Program.cs) — y una nota de honestidad

```csharp
    var tareas = await contexto.Tareas.ToListAsync();
    filasLeidas = tareas.Count;

    var filas = tareas
        .GroupBy(t => t.Proyecto)
        .OrderBy(g => g.Key, StringComparer.Ordinal)
```

Aquí hay una declaración que conviene leer:

```csharp
// CON EL ORM. EF Core traduce `GroupBy` a SQL desde la versión 7, así que aquí
```

**EF Core sí sabría traducir este `GroupBy` a SQL.** El `ToListAsync()` primero
está puesto a propósito para reproducir lo que ocurre de verdad **cuando la
agregación no se puede traducir** — y ese caso existe en todos los ORM, con
funciones de ventana, expresiones específicas del motor o agregados
personalizados.

Decirlo importa: la clase no acusa a EF Core de algo que no hace. Reproduce un
escenario real y avisa de que aquí es artificial.

```csharp
    var filas = await contexto.Database
        .SqlQuery<FilaInforme>($"""
            SELECT proyecto                                AS Proyecto,
                   COUNT(*)                                AS Total,
```

Y la nota de seguridad, otra vez en el cuarto framework: **`SqlQuery` con una
cadena interpolada no interpola**. EF Core intercepta la plantilla y convierte
cada hueco en un parámetro — exactamente como Prisma con `$queryRaw` y Drizzle
con `sql`.

Tres ecosistemas distintos llegaron a la misma solución: **usar la construcción
del lenguaje que separa lo escrito de lo interpolado**, para que salir del ORM no
pueda reabrir la inyección por descuido.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /reiniciar` | 4 tareas, 3 proyectos |
| `GET /informe-orm` | las tres filas del informe |
| `GET /filas-leidas` | **`4`** |
| `GET /informe-sql` | **exactamente las mismas tres filas** |
| `GET /filas-leidas` | **`3`** |
| `GET /informe-sql?minimo=2` | solo `casa` |
| `GET /informe-sql?minimo=0 OR 1=1` | `400 MINIMO_INVALIDO` |

**Cuatro frente a tres no impresiona.** Ese es el punto: con cuatro tareas la
diferencia es invisible, y es exactamente lo que hace que este problema llegue a
producción. Con cuatro millones de tareas y tres proyectos, un informe trae
**cuatro millones de filas** y el otro **tres**.

## 📖 Lo que el motor sabe hacer y tu proceso no

```javascript
// Traerse todo y agrupar en memoria
const tareas = await prisma.tarea.findMany();
for (const tarea of tareas) { /* acumular */ }
```

```sql
-- Dejar que el motor agrupe
SELECT proyecto, COUNT(*), SUM(CASE WHEN hecha THEN 1 ELSE 0 END)
  FROM Tarea GROUP BY proyecto
```

La versión en memoria hace tres cosas que la del motor no hace: **mueve** las
filas por la red, las **materializa** como objetos y las **recorre** en tu
proceso. Ninguna de las tres es gratis, y las tres crecen con el número de filas.

La del motor, además, puede usar un índice para agrupar. Tu bucle no.

## ⚠️ Cuándo sí conviene salir

No es «cuando el ORM va lento»: es cuando **la consulta es el producto**.

- **Agregaciones sobre muchas filas.** Justo esta clase.
- **Funciones de ventana.** `ROW_NUMBER`, `LAG`, sumas acumuladas. Casi ningún
  ORM las expresa bien.
- **Consultas recursivas.** Árboles y jerarquías con `WITH RECURSIVE`.
- **Cosas propias del motor.** Búsqueda de texto completo, JSON, geometría,
  `DISTINCT ON`.
- **Escrituras masivas.** Un `UPDATE ... WHERE` toca un millón de filas sin
  cargar ninguna.
- **Cuando has leído el plan de ejecución** y sabes qué quieres que haga.

Y cuándo **no**:

- Porque el ORM «no te gusta». Eso no es una razón técnica.
- Antes de haber medido. Es la clase 056: sin medición, se adivina.
- Para un CRUD. Escribir a mano el alta y la baja de veinte tablas es trabajo
  repetitivo y una oportunidad por línea de olvidar un marcador.

## ⚠️ Lo que NO se abandona al salir

```javascript
// Prisma: `$queryRaw` es una plantilla etiquetada, no una interpolación
await prisma.$queryRaw`... HAVING COUNT(*) >= ${minimo}`;
```

```csharp
// EF Core: `SqlQuery` con cadena interpolada tampoco interpola
contexto.Database.SqlQuery<FilaInforme>($"... HAVING COUNT(*) >= {limite}");
```

```java
jdbc.query("... HAVING COUNT(*) >= ?", mapeador, minimo);
```

```python
conexion.execute(text("... HAVING COUNT(*) >= :minimo"), {"minimo": int(minimo)})
```

**Las cuatro API de SQL crudo siguen siendo parametrizadas**, y las dos primeras
lo son de una forma que confunde: parecen interpolación de cadenas y no lo son.
La biblioteca intercepta la plantilla antes de que el motor de cadenas la junte.

Hay una variante que **sí** concatena —`$queryRawUnsafe`, `FromSqlRaw` con una
cadena ya montada—, y su nombre lleva la advertencia dentro.

## 🔬 El último caso del contrato

```javascript
if (!Number.isInteger(minimo) || minimo < 0) → 400 MINIMO_INVALIDO
```

`?minimo=0 OR 1=1` no devuelve datos de más: devuelve **400**. Y no lo consigue
el marcador, lo consigue la validación.

Es el matiz que la clase 052 dejaba abierto: **el marcador protege el valor, no
el tipo**. Si esperas un número y llega texto, el marcador lo pasará
obedientemente como texto y la consulta fallará o devolverá algo raro. Validar
antes es lo que convierte eso en un `400` claro.

Y donde el marcador directamente no llega —un nombre de columna en `ORDER BY`—
la única defensa sigue siendo una lista blanca.

## 🔬 Comparación

| ORM | API de SQL crudo | Devuelve | Variante sin parámetros |
| --- | --- | --- | --- |
| Prisma | `$queryRaw` (plantilla) | objetos planos | `$queryRawUnsafe` |
| SQLAlchemy | `text()` con `:nombre` | filas con atributos | concatenar a mano |
| Hibernate | `JdbcTemplate` con `?` | lo que diga el mapeador | concatenar a mano |
| EF Core | `SqlQuery<T>` (interpolada) | tipo declarado | `FromSqlRaw` |

Fíjate en la columna «devuelve»: **ninguna de las cuatro pierde el tipado**. Salir
del ORM no obliga a volver a los diccionarios sueltos.

## 📖 Lo mejor de esta clase: no hay que elegir

El informe en SQL vive **en el mismo proyecto, con la misma conexión y dentro de
la misma transacción** que el resto del código. No es una biblioteca aparte ni un
servicio distinto.

Por eso la respuesta práctica casi nunca es «ORM o SQL», sino **ORM para el CRUD y
SQL para las tres consultas que importan** — que en una aplicación típica son,
literalmente, unas tres.

## ⚠️ Errores frecuentes

- **Agregar en memoria.** Funciona en desarrollo con datos de juguete.
- **Salir del ORM sin medir.** A veces la consulta generada ya estaba bien.
- **Usar la variante «unsafe» por costumbre.** El nombre avisa.
- **Creer que el marcador valida el tipo.** No lo hace.
- **Meter SQL de un motor concreto sin decirlo.** Ata el proyecto en silencio.
- **Devolver entidades desde SQL crudo.** El seguimiento de cambios se comporta
  de forma sorprendente; para un informe, un tipo de solo lectura.

## ✅ Verificación

```bash
node scripts/run-class.mjs 060
```

## 🧪 Reto de transferencia

Sube la semilla a 100 000 tareas y compara `/filas-leidas` de las dos rutas. Serán
**100 000 y 3**. Después mide el tiempo: la diferencia será mucho mayor que la
proporción entre esos números, porque el coste no es solo mover filas — es
construir cien mil objetos que se tiran acto seguido.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 052 — SQL a mano](../052-sql-a-mano/README.md)
- [Clase 056 — El problema N+1](../056-el-problema-n-1/README.md)
- [Módulo 06 — Persistencia y dominio](../../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
- [@gregg-systems-performance] Gregg, Brendan. *Systems Performance*, 2.ª ed. Addison-Wesley, 2020. ISBN 9780136820154 — <https://openlibrary.org/isbn/9780136820154>
- [@owasp-cheatsheets] OWASP. *OWASP Cheat Sheet Series*. — <https://cheatsheetseries.owasp.org/>
