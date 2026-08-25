# Clase 055 — Relaciones

> [⬅️ 054](../054-data-mapper/README.md) · [📚 Parte 4](../README.md) · [🎓 Clases](../../README.md) · [056 ➡️](../056-el-problema-n-1/README.md)
>
> Parte **4 — Datos** · Nivel **🟡 intermedio** · Pista **`datos`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Modelar **uno a muchos** y recorrerlo: crear una tarea con sus etiquetas, leerlas
de vuelta, y comprobar que borrar la tarea **se lleva las etiquetas por delante**.

## 🧩 La situación

Una tarea tiene etiquetas. Se crean juntas en una operación, se leen juntas, y al
borrar la tarea las etiquetas desaparecen.

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
PORT=3000 java -jar target/clase-055-1.0.0.jar --server.port=3000
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
| `Clase055.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `Program.cs` | código C# |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Las cuatro modelan la misma relación —una tarea tiene muchas etiquetas— y
**difieren en tres decisiones que la declaración esconde**: quién guarda la clave
ajena, qué pasa al borrar el padre, y cuándo se cargan los hijos.

Esa tercera es la que decide si la clase 056 te va a ocurrir.

### Prisma · [`prisma/prisma/schema.prisma`](implementaciones/prisma/prisma/schema.prisma)

```prisma
model Tarea {
  id        Int        @id @default(autoincrement())
  titulo    String
  // La relación se declara en los DOS lados. Prisma usa el lado con `fields` y
  // `references` para saber dónde está la clave ajena.
  etiquetas Etiqueta[]
}

model Etiqueta {
  id      Int    @id @default(autoincrement())
  nombre  String
  tarea   Tarea  @relation(fields: [tareaId], references: [id], onDelete: Cascade)
  tareaId Int
}
```

Las tres decisiones en una sola declaración: `tareaId` dice **dónde vive la clave
ajena**, `onDelete: Cascade` dice **qué pasa al borrar el padre**, y la ausencia
de cualquier opción de carga dice lo tercero — Prisma **no carga sola** la
relación.

```javascript
  const tarea = await prisma.tarea.create({
    data: {
      titulo: peticion.body?.titulo ?? "",
      etiquetas: { create: (peticion.body?.etiquetas ?? []).map((nombre) => ({ nombre })) },
    },
    include: { etiquetas: true },
  });
```

**Escritura anidada**: la tarea y sus etiquetas en una sola operación, y el ORM se
encarga del orden y de la clave ajena. Es lo más cómodo del elenco para este
caso.

```javascript
  const tarea = await prisma.tarea.findUnique({
    where: { id: Number(peticion.params.id) },
    include: { etiquetas: true },
  });
```

Sin `include`, `tarea.etiquetas` **no existe**. Esa decisión evita el problema de
la clase 056 por diseño, y tiene su propio riesgo: un campo que falta es más
fácil de notar que una lista vacía.

### Entity Framework Core · [`entity-framework-core/Program.cs`](implementaciones/entity-framework-core/Program.cs) — el mismo criterio, con otro fallo

```csharp
class Tarea
{
    public int Id { get; set; }
    public string Titulo { get; set; } = "";
    public List<Etiqueta> Etiquetas { get; set; } = [];
}

class Etiqueta
{
    public int Id { get; set; }
    public string Nombre { get; set; } = "";
    public int TareaId { get; set; }
    public Tarea? Tarea { get; set; }
}
```

```csharp
        constructor.Entity<Tarea>()
            .HasMany(t => t.Etiquetas)
            .WithOne(e => e.Tarea!)
            .HasForeignKey(e => e.TareaId)
            .OnDelete(DeleteBehavior.Cascade);
```

La relación se declara **fuera de la entidad**, en el contexto — coherente con el
Data Mapper de la clase 054.

```csharp
        tarea.Etiquetas.Add(new Etiqueta { Nombre = nombre });
```

**Basta con añadir al hijo**: EF Core deduce la clave ajena de la relación. No
hace falta poner los dos lados, a diferencia de JPA.

```csharp
    var tarea = await contexto.Tareas
        .Include(t => t.Etiquetas)
        .FirstOrDefaultAsync(t => t.Id == id);
```

Y aquí está el matiz que separa a EF Core de Prisma aunque tomen la misma
decisión: **sin `Include`, la lista llega vacía** en lugar de no existir.

Evita el N+1 por diseño, y **a cambio el fallo es más silencioso**: una lista
vacía parece un dato —«esta tarea no tiene etiquetas»— y no un olvido. Un campo
ausente, como en Prisma, se nota al primer intento de leerlo.

### SQLAlchemy · [`sqlalchemy/main.py`](implementaciones/sqlalchemy/main.py) — dos cascadas, y por qué hacen falta las dos

```python
    etiquetas: Mapped[list["Etiqueta"]] = relationship(
        back_populates="tarea", cascade="all, delete-orphan"
    )
```

```python
    tarea_id: Mapped[int] = mapped_column(ForeignKey("tareas.id", ondelete="CASCADE"))
    tarea: Mapped[Tarea] = relationship(back_populates="etiquetas")
```

**Dos declaraciones de cascada, y no es redundancia.** `cascade="all,
delete-orphan"` borra las etiquetas al borrar la tarea **desde la sesión**;
`ondelete="CASCADE"` lo garantiza **en la base**.

El primero cubre lo que hace tu aplicación. El segundo cubre lo que hace
cualquier otro que escriba en esa base: otro servicio, una migración, alguien con
un cliente SQL. Poner solo el primero deja filas huérfanas en cuanto alguien
borra por fuera.

```python
# SQLite NO aplica las claves ajenas salvo que se le pida en cada conexion. Es
```

Y un detalle del motor que esta clase destapa: **SQLite no aplica las claves
ajenas por omisión**. Hay que activarlas en cada conexión. Es el tipo de
diferencia entre motores que hace que «funciona en desarrollo» no signifique
nada.

### Hibernate · [`hibernate/…/Aplicacion.java`](implementaciones/hibernate/src/main/java/labs/Aplicacion.java) — la decisión opuesta

```java
        @OneToMany(mappedBy = "tarea", cascade = CascadeType.ALL,
                orphanRemoval = true, fetch = FetchType.LAZY)
        public List<Etiqueta> etiquetas = new ArrayList<>();
```

Las tres decisiones en una anotación. `cascade = ALL` propaga guardar y borrar,
`orphanRemoval` borra el hijo que se saca de la lista, y `mappedBy` dice que la
clave ajena vive en el otro lado.

Y la tercera es la que separa a JPA del resto del elenco: **`fetch = LAZY` es el
valor por omisión de `@OneToMany`**. La lista **no** se carga hasta que se toca —
y entonces se dispara otra consulta.

Es cómodo, es lo que casi nadie cambia, y es **el origen exacto del problema de la
clase 056**. Prisma y EF Core eligieron lo contrario; Hibernate eligió la
comodidad y puso el peligro en el valor por omisión.

## 📖 Las tres decisiones que esconde una relación

### 1. Quién guarda la clave ajena

Siempre el lado «muchos». La etiqueta guarda a qué tarea pertenece; la tarea no
guarda una lista de identificadores.

Los cuatro ORM lo expresan con dos declaraciones —una por lado— y hay una
diferencia práctica notable:

```java
// JPA — hay que poner LOS DOS lados a mano
etiqueta.tarea = tarea;
tarea.etiquetas.add(etiqueta);
```

```csharp
// EF Core — basta con añadir al hijo; deduce la clave ajena
tarea.Etiquetas.Add(new Etiqueta { Nombre = nombre });
```

Olvidar un lado en JPA es un error clásico: el objeto queda en un estado
incoherente y la clave ajena sin valor. El síntoma —una etiqueta huérfana— aparece
lejos de la causa.

### 2. Qué pasa al borrar el padre

```javascript
// Prisma — declarado en el esquema
tarea Tarea @relation(fields: [tareaId], references: [id], onDelete: Cascade)
```

```python
# SQLAlchemy — DOS declaraciones, y hacen falta las dos
etiquetas: Mapped[list["Etiqueta"]] = relationship(cascade="all, delete-orphan")  # el ORM
tarea_id: Mapped[int] = mapped_column(ForeignKey("tareas.id", ondelete="CASCADE"))  # la BASE
```

La distinción de SQLAlchemy es la más honesta de las cuatro y merece entenderse:

- **La cascada del ORM** actúa cuando borras **a través de la sesión**. Carga los
  hijos y los borra uno a uno.
- **La cascada de la base** actúa **siempre**: también cuando borra otro
  servicio, un script de mantenimiento o alguien con un cliente de SQL.

Con solo la primera, tu aplicación se comporta bien y **cualquier otra escritura
deja filas huérfanas**. Con solo la segunda, el ORM puede tener objetos en
memoria que ya no existen. Lo correcto es declarar las dos.

### 3. Cuándo se cargan los hijos

Es la decisión que separa esta clase de la siguiente:

| ORM | Por omisión | Cómo se pide |
| --- | --- | --- |
| Prisma | **no se carga** | `include: { etiquetas: true }` |
| EF Core | **no se carga** | `.Include(t => t.Etiquetas)` |
| SQLAlchemy | perezosa: se carga al tocarla | `selectinload(Tarea.etiquetas)` |
| Hibernate | perezosa: se carga al tocarla | `@EntityGraph(attributePaths = "etiquetas")` |

**Los cuatro parten de no cargar, y los dos de abajo cargan solos al tocar.** Esa
diferencia es el origen del problema N+1 de la clase 056: en Prisma y EF Core hay
que pedirlo explícitamente, y olvidarlo da una lista vacía; en SQLAlchemy e
Hibernate olvidarlo da el dato correcto **y una consulta por elemento**.

Un fallo silencioso frente a un fallo de rendimiento. Ninguna elección es
obviamente mejor, y conviene saber cuál te tocó.

## ⚠️ La trampa de SQLite

```python
@event.listens_for(Engine, "connect")
def activar_claves_ajenas(conexion, registro):
    cursor.execute("PRAGMA foreign_keys=ON")
```

**SQLite ignora las claves ajenas salvo que se le pida en cada conexión.** El
esquema las declara, la base las acepta, y no las aplica.

Resultado: el borrado en cascada **no ocurre** y las filas huérfanas aparecen sin
que nada falle. Es una trampa real y muy repetida, porque en desarrollo con
SQLite todo parece correcto hasta que se despliega contra un motor que sí las
aplica — o peor, hasta que alguien mira los datos.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `POST` con dos etiquetas | `201` con las dos |
| `GET /tareas/1` | las dos etiquetas |
| `POST` sin etiquetas | `201` con **lista vacía**, no nulo |
| `GET /etiquetas` | `total: 2` |
| `DELETE /tareas/1` | `204` |
| `GET /etiquetas` | **`total: 0`** |

El tercer caso importa: **una lista vacía y un nulo no son lo mismo** para el
cliente. Y el último es la prueba real de la cascada — sin él, «declaramos la
cascada» sería una afirmación sin respaldo.

## 🔬 Comparación

| ORM | Declaración | Carga por omisión | Cascada |
| --- | --- | --- | --- |
| Prisma | en el esquema propio | ninguna | en el esquema |
| SQLAlchemy | en las dos clases | perezosa | ORM **y** base, por separado |
| Hibernate | anotaciones en las dos clases | perezosa | `cascade` + `orphanRemoval` |
| EF Core | por convención o configuración | ninguna | `OnDelete(Cascade)` |

## ⚠️ Errores frecuentes

- **Poner solo un lado de la relación en JPA.** Clave ajena sin valor.
- **Cascada solo en el ORM.** Otras escrituras dejan huérfanos.
- **Olvidar activar las claves ajenas en SQLite.**
- **Devolver `null` en lugar de lista vacía.** El cliente tiene que comprobar dos
  cosas.
- **Cargar la relación sin necesitarla.** Trabajo y memoria por nada.
- **No cargarla y devolver una lista vacía.** El fallo silencioso de Prisma y EF
  Core.

## ✅ Verificación

```bash
node scripts/run-class.mjs 055
```

## 🧪 Reto de transferencia

Quita el `PRAGMA foreign_keys=ON` de SQLAlchemy y ejecuta el contrato. Comprueba
que **el último caso falla**: las etiquetas sobreviven al borrado. Es la forma más
directa de ver que declarar una restricción no basta si el motor no la aplica.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 056 — El problema N+1](../056-el-problema-n-1/README.md)
- [Módulo 06 — Persistencia y dominio](../../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@fowler-poeaa] Fowler, Martin. *Patterns of Enterprise Application Architecture*. Addison-Wesley, 2002. ISBN 9780321127426 — <https://openlibrary.org/isbn/9780321127426>
- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
- [@ambler-sadalage-refactoring-databases] Ambler, Scott W.; Sadalage, Pramod J. *Refactoring Databases*. Addison-Wesley, 2006. ISBN 9780321293534 — <https://openlibrary.org/isbn/9780321293534>
