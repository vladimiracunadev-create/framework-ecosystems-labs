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
