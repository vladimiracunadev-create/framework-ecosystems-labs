# Clase 052 — SQL a mano

> [⬅️ 051](../051-conectar-a-una-base-de-datos/README.md) · [📚 Parte 4](../README.md) · [🎓 Clases](../../README.md) · [053 ➡️](../053-active-record/README.md)
>
> Parte **4 — Datos** · Nivel **🟢 básico** · Pista **`datos`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Escribir la consulta y leer el resultado **sin capa intermedia** — y entender por
qué el marcador de parámetro no es una comodidad, sino la frontera entre datos y
código.

## 🧩 La situación

Insertar tareas, leerlas por identificador y buscarlas por título. Todo con SQL
escrito a mano.

<!-- generado: fichas -->

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **Dapper** | micro-ORM de .NET (C#) | 2011 | Apache-2.0 | proyecto independiente |
| **SQLAlchemy** | mapeador objeto-relacional de Python (Python) | 2006 | MIT | proyecto independiente |
| **Drizzle ORM** | mapeador objeto-relacional de JavaScript/TypeScript (TypeScript) | 2022 | Apache-2.0 | proyecto independiente |
| **Active Record (Rails)** | mapeador objeto-relacional de Ruby (Ruby) | 2004 | MIT | proyecto independiente |

### 🔧 Dapper

Mapea resultados de SQL escrito a mano, sin generar consultas. La alternativa deliberada al mapeador completo.

- **Documentación oficial:** <https://github.com/DapperLib/Dapper>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `net10.0, Dapper 2.1.66, Microsoft.Data.Sqlite 10.0.0`
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
| `Clase052.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `Program.cs` | código C# |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

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

### 🔧 Drizzle ORM

Define el esquema en TypeScript y mantiene las consultas próximas al SQL, sin capa de traducción oculta.

- **Documentación oficial:** <https://orm.drizzle.team/docs/overview>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `@libsql/client ^0.15.4, drizzle-orm ^0.45.2, express ^5.1.0`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm install --silent --ignore-scripts
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
| `server.mjs` | código JavaScript (módulo ES) |

### 🔧 Active Record (Rails)

La implementación que dio nombre popular al patrón de registro activo descrito por Fowler.

- **Documentación oficial:** <https://guides.rubyonrails.org/active_record_basics.html>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `rails ~> 8.0, puma ~> 6.4, sqlite3 ~> 2.6`
- **Necesita en el PATH:** `ruby`, `bundle`

Preparar sus dependencias, dentro de su directorio:

```bash
bundle install --quiet
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 bundle exec puma -b tcp://127.0.0.1:3000 config.ru
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `.bundle/config` | archivo del proyecto |
| `Gemfile` | dependencias de Ruby |
| `config.ru` | punto de entrada de Rack, el estándar de servidores de Ruby |
| `config/database.yml` | configuración en YAML |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Cuatro formas de escribir SQL sin mapeo de objetos, en cuatro ecosistemas. Y las
cuatro coinciden en lo único que importa: **el valor viaja aparte del texto de la
consulta**, unido solo por un marcador.

Léelas seguidas mirando cómo se escribe ese marcador. Son cuatro sintaxis para
la misma garantía.

### Dapper · [`dapper/Program.cs`](implementaciones/dapper/Program.cs) — un objeto anónimo son los parámetros

```csharp
    var tarea = await conexion.QuerySingleAsync<Tarea>(
        "INSERT INTO tareas (titulo) VALUES (@titulo) RETURNING id, titulo",
        new { titulo = entrada.Titulo ?? "" });
```

`@titulo` en la sentencia y `new { titulo }` como segundo argumento. El objeto
anónimo **se convierte en parámetros**, no en texto pegado.

Y una propiedad de Dapper que lo define: no gestiona conexiones.

```csharp
static SqliteConnection Conectar() => new(Cadena);
```

```csharp
    using var conexion = Conectar();
```

**Son métodos de extensión sobre `IDbConnection`**, así que quién abre la
conexión y cuándo se cierra es cosa tuya. Es el más ligero del elenco —no hay
contexto, no hay sesión, no hay unidad de trabajo— y a cambio no hay nada que te
recuerde cerrar. El `using` es lo único que lo garantiza.

### SQLAlchemy Core · [`sqlalchemy/main.py`](implementaciones/sqlalchemy/main.py) — marcadores con nombre

```python
        fila = conexion.execute(
            text("INSERT INTO tareas (titulo) VALUES (:titulo) RETURNING id, titulo"),
            {"titulo": titulo},
        ).one()
```

`:titulo` es un **marcador**, no una interpolación de Python. Es un detalle
visual que confunde a quien viene de las f-strings: dentro de esa cadena no pasa
nada; el valor lo pone el motor al ejecutar.

Fíjate en que esto es SQLAlchemy **Core**, sin la capa de mapeo de objetos que la
clase 051 usaba. La misma biblioteca sirve para las dos cosas, y elegir el nivel
es una decisión que la clase 060 desarrolla.

```python
    with motor.begin() as conexion:
```

```python
    with motor.connect() as conexion:
```

Dos formas de abrir: `begin()` abre **una transacción** y confirma al salir del
bloque; `connect()` solo abre la conexión. La escritura usa la primera y las
lecturas la segunda, que es el reparto correcto y el que la clase 057 explica.

### Drizzle · [`drizzle/server.mjs`](implementaciones/drizzle/server.mjs) — una plantilla etiquetada

```javascript
  const { rows } = await db.run(
    sql`INSERT INTO tareas (titulo) VALUES (${titulo}) RETURNING id, titulo`,
  );
```

**Esto no es una plantilla de texto**, aunque lo parezca. `sql` es una función
etiquetada: recibe las partes estáticas y las interpolaciones **por separado**, y
convierte cada `${...}` en un marcador.

Es la misma construcción del lenguaje que hace segura la plantilla `html` de Lit
en la clase 073, aplicada a SQL. Y tiene una consecuencia de diseño elegante:
**concatenar con `+` sería posible y produciría otra cosa**, así que Drizzle exige
la plantilla en lugar de aceptar una cadena.

```javascript
      ? sql`SELECT id, titulo FROM tareas ORDER BY id`
      : sql`SELECT id, titulo FROM tareas WHERE titulo = ${String(titulo)} ORDER BY id`;
```

Y las consultas **se componen como valores**: se elige una u otra antes de
ejecutar. Un objeto `sql`, no una cadena que se va concatenando.

### Active Record en modo crudo · [`activerecord/config.ru`](implementaciones/activerecord/config.ru)

```ruby
    id = ActiveRecord::Base.connection.insert(
      ActiveRecord::Base.sanitize_sql_array(
        ["INSERT INTO tareas (titulo) VALUES (?)", titulo]
      )
    )
```

```ruby
        Tarea.find_by_sql(
          ["SELECT id, titulo FROM tareas WHERE titulo = ? ORDER BY id", params[:titulo]]
```

Un **array** cuyo primer elemento es la sentencia con `?` y el resto son los
valores. Es la forma documentada de escribir SQL a mano en Rails, y la más
distinta de las cuatro: no hay nombres ni plantillas — hay posición.

Y una diferencia de fondo con las otras tres: `sanitize_sql_array` **escapa** el
valor con las reglas del adaptador y produce una cadena, en lugar de enviar el
valor por un canal aparte. El resultado es seguro y el mecanismo no es el mismo;
conviene saberlo porque el escapado depende de que el adaptador sea el correcto
para ese motor.

Fíjate también en que `Tarea` está ahí solo para **recibir las filas**:

```ruby
class Tarea < ActiveRecord::Base
  self.table_name = "tareas"
end
```

Es Active Record usado como no-Active-Record. Enseña que la biblioteca no obliga
a su patrón — la clase 053 muestra el mismo objeto en su modo natural.

### Lo que las cuatro demuestran con el mismo caso

El contrato envía `'; DROP TABLE tareas; --` como título. En las cuatro, **acaba
siendo un título de tarea** y no una orden.

No es porque nadie lo escape a mano ni porque haya una lista de palabras
prohibidas: es porque **cuando la base recibe la sentencia, ya está decidido qué
parte es código**. La clase 074 lleva esa propiedad al ORM completo.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `POST /tareas` "comprar pan" | `201`, `id: 1` |
| `POST /tareas` "regar" | `201`, `id: 2` |
| `GET /tareas/1` | "comprar pan" |
| `GET /tareas/999` | `404 NO_EXISTE` |
| `GET /tareas?titulo=regar` | `total: 1` |
| `GET /tareas?titulo=' OR '1'='1` | **`total: 0`** |
| `POST /tareas` `'; DROP TABLE tareas; --` | `201`, `id: 3` |
| `GET /tareas` | `total: 3` — **la tabla sigue ahí** |
| `GET /tareas/3` | el texto, **tal cual** |

Es el fallo que OWASP lleva años situando entre los más frecuentes y más graves
de las aplicaciones web [@owasp-top10], y esta clase lo cierra con una línea.

**Los tres últimos casos son el corazón de la clase.** La inyección más conocida
del mundo entra por la puerta principal, se guarda como texto y no pasa nada. No
porque nadie la haya filtrado: porque **nunca llegó a ser código**.

## 📖 Por qué la inyección no funciona

Una consulta parametrizada no se envía como una sola cadena. Va en dos partes:

```
sentencia:  SELECT id, titulo FROM tareas WHERE titulo = ?
parámetro:  ' OR '1'='1
```

La base **prepara la sentencia primero** —decide qué es `SELECT`, qué es una
columna, dónde termina la condición— y solo después recibe el valor. Cuando llega
el parámetro, la estructura ya está fijada y no hay forma de cambiarla desde el
valor.

Comparado con lo que hace la concatenación:

```
'SELECT ... WHERE titulo = ' + valor
→ SELECT ... WHERE titulo = '' OR '1'='1'
```

Aquí la base recibe una sola cadena y **no puede saber** qué parte venía del
usuario. La `OR` es una `OR` de verdad.

Esa es la diferencia entera, y explica por qué escapar comillas es una defensa
peor: **el escape trabaja sobre el texto; el parámetro elimina el problema.**

## 🌐 Las cuatro sintaxis, la misma idea

```csharp
// Dapper — un objeto anónimo se convierte en parámetros
conexion.QueryAsync<Tarea>("SELECT ... WHERE titulo = @titulo", new { titulo });
```

```python
# SQLAlchemy Core — marcadores con nombre y un diccionario
conexion.execute(text("SELECT ... WHERE titulo = :titulo"), {"titulo": titulo})
```

```javascript
// Drizzle — plantilla etiquetada: cada ${} es un marcador, no una interpolación
db.run(sql`SELECT ... WHERE titulo = ${titulo}`);
```

```ruby
# Active Record — array con ? posicionales
Tarea.find_by_sql(["SELECT ... WHERE titulo = ?", titulo])
```

La de Drizzle merece un segundo vistazo, porque **se parece a lo peligroso**. Una
plantilla de JavaScript normalmente pega texto; la etiqueta `sql` intercepta esa
plantilla y convierte cada hueco en un marcador. Es la misma sintaxis con
semántica opuesta — y por eso Drizzle **exige la plantilla** en lugar de aceptar
una cadena.

## 🔬 Comparación

| Herramienta | Marcador | Qué devuelve | Qué NO hace |
| --- | --- | --- | --- |
| Dapper | `@nombre` | objetos, mapeados por nombre de columna | seguir cambios, generar SQL, gestionar conexiones |
| SQLAlchemy Core | `:nombre` | filas con acceso por atributo | mapear a clases del dominio |
| Drizzle | `${}` en plantilla `sql` | filas del controlador | nada implícito |
| Active Record | `?` posicional | instancias del modelo | en este modo, generar la consulta |

La columna de la derecha es el argumento entero a favor de esta capa: **no hace
nada que no le pidas**. Sin caché de sesión, sin carga perezosa, sin consultas
que aparecen solas. Lo que escribes es lo que se ejecuta.

Y es también su coste: los cambios de esquema no rompen la compilación, sino una
consulta concreta en tiempo de ejecución.

## ⚠️ Lo que un marcador NO puede ser

```sql
-- Esto NO funciona en ninguna de las cuatro
SELECT * FROM tareas ORDER BY ?
SELECT * FROM ?
```

**Los parámetros solo valen para valores**, nunca para nombres de tabla, de
columna ni para palabras clave [@owasp-cheatsheets]. Es consecuencia directa de lo anterior: la
sentencia se prepara antes de conocer el parámetro, así que su estructura no
puede depender de él.

Cuando hace falta ordenar por una columna que elige el usuario —clase 046— la
única defensa es una **lista blanca**: comprobar que el nombre recibido está
entre los permitidos y usar el valor de tu lista, no el del usuario.

## ⚠️ Errores frecuentes

- **Concatenar «solo esta vez, que es un número».** El día que deja de serlo,
  nadie lo revisa.
- **Confiar en escapar comillas.** Depende del juego de caracteres y de la
  versión; el parámetro no depende de nada.
- **Creer que un ORM protege por sí solo.** Protege sus consultas generadas; el
  SQL crudo que le pases sigue siendo tuyo.
- **Usar un marcador para un nombre de columna.** No es que sea inseguro: no
  funciona.
- **Devolver una fila vacía en lugar de `404`.** El cliente no puede distinguir
  «no existe» de «existe y está vacía».
- **Abrir una conexión por consulta sin cerrarla.** Dapper no las gestiona.

## ✅ Verificación

```bash
node scripts/run-class.mjs 052
```

## 🧪 Reto de transferencia

Sustituye el marcador por concatenación en una sola de las cuatro y vuelve a
ejecutar. El caso de la inyección devolverá **las tres tareas** en lugar de cero,
y el contrato fallará. Es la forma más corta de ver que la protección no está en
la biblioteca: está en la línea que acabas de cambiar.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 053 — Active Record](../053-active-record/README.md)
- [Clase 046 — Filtrado y ordenación](../../parte-3-validacion-y-contrato/046-filtrado-y-ordenacion/README.md)
- [Módulo 06 — Persistencia y dominio](../../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@fowler-poeaa] Fowler, Martin. *Patterns of Enterprise Application Architecture*. Addison-Wesley, 2002. ISBN 9780321127426 — <https://openlibrary.org/isbn/9780321127426>
- [@owasp-top10] OWASP. *OWASP Top 10*. — <https://owasp.org/www-project-top-ten/>
- [@owasp-cheatsheets] OWASP. *OWASP Cheat Sheet Series*. — <https://cheatsheetseries.owasp.org/>
- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
