# Clase 053 — Active Record

> [⬅️ 052](../052-sql-a-mano/README.md) · [📚 Parte 4](../README.md) · [🎓 Clases](../../README.md) · [054 ➡️](../054-data-mapper/README.md)
>
> Parte **4 — Datos** · Nivel **🟢 básico** · Pista **`datos`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Dejar que el objeto **sepa guardarse** — y ver qué gana y qué pierde a cambio.

## 🧩 La situación

Crear tareas, leerlas, modificarlas y borrarlas. Con una regla: **el título no
puede estar vacío**, y esa regla vive en el modelo.

> **Esta clase y la 054 tienen el mismo contrato, letra por letra.** Es
> deliberado: cuando el comportamiento observable es idéntico, lo único que
> queda por comparar es **dónde vive el conocimiento**.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Active Record**](../../../glosario/README.md#active-record) | El patrón en que el objeto de dominio **sabe guardarse**: `tarea.save()`. Rápido de escribir y difícil de probar sin base de datos, porque el dominio y el almacenamiento son la misma clase. |

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **Active Record (Rails)** | mapeador objeto-relacional de Ruby (Ruby) | 2004 | MIT | proyecto independiente |
| **Eloquent (Laravel)** | mapeador objeto-relacional de PHP (PHP) | 2011 | MIT | proyecto independiente |
| **Django** | framework web de Python (Python) | 2005 | BSD-3-Clause | Django Software Foundation |
| **TypeORM** | mapeador objeto-relacional de JavaScript/TypeScript (TypeScript) | 2016 | MIT | proyecto independiente |

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

### 🔧 Eloquent (Laravel)

Registro activo en PHP con relaciones expresivas. Su comodidad hace que la consulta N+1 aparezca con especial facilidad.

- **Documentación oficial:** <https://laravel.com/docs/eloquent>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `php ^8.2, laravel/framework ^12.0`
- **Necesita en el PATH:** `php`, `composer`

Preparar sus dependencias, dentro de su directorio:

```bash
composer install --no-interaction --quiet
php -r @unlink('database/datos.sqlite'); touch('database/datos.sqlite');
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 php -S 127.0.0.1:3000 -t public
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `app/Models/Tarea.php` | código PHP |
| `bootstrap/app.php` | arranque de Laravel: qué grupo de rutas, qué capas y qué manejo de errores |
| `bootstrap/providers.php` | código PHP |
| `composer.json` | manifiesto de Composer: la versión de PHP y las bibliotecas del proyecto |
| `config/app.php` | código PHP |
| `config/cache.php` | código PHP |
| `config/database.php` | código PHP |
| `config/session.php` | código PHP |

### 🔧 Django

Baterías incluidas: ORM, migraciones, panel de administración, autenticación y formularios. Su panel generado sigue siendo un argumento decisivo para productos internos.

- **Documentación oficial:** <https://docs.djangoproject.com/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `django==6.1`
- **Necesita en el PATH:** `python`

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 python app.py
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `app.py` | código Python |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `requirements.txt` | dependencias de Python, una por línea, con versión fijada |

### 🔧 TypeORM

Ofrece a la vez registro activo y mapeador de datos, lo que lo hace útil para comparar ambos patrones en un mismo proyecto.

- **Documentación oficial:** <https://typeorm.io/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `express ^5.1.0, reflect-metadata ^0.2.2, sql.js ^1.13.0, typeorm ^1.1.0`
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

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Cuatro ORM que siguen el patrón, y una propiedad que comparten y define el
patrón entero: **el modelo es la tabla**. `tarea.save()`, `tarea.delete()`,
`Tarea.find(id)`. El objeto conoce su almacenamiento y lo usa.

Y una consecuencia que las cuatro sacan: si el objeto sabe guardarse, **tiene
sentido que sepa también cuándo no debe hacerlo**. Por eso en las cuatro la
regla de negocio vive en el modelo, no en el controlador.

### Active Record de Rails · [`activerecord/config.ru`](implementaciones/activerecord/config.ru) — el que le dio nombre

```ruby
class Tarea < ActiveRecord::Base
  self.table_name = "tareas"

  validates :titulo, presence: true
```

```ruby
    tarea = Tarea.new(titulo: params[:titulo].to_s, hecha: false)
    if tarea.save
      render json: tarea.salida, status: 201
    else
      render json: { code: "TITULO_REQUERIDO" }, status: 422
    end
```

**En Rails no hay que acordarse de validar.** `save` valida siempre y devuelve
`false` si algo falla; no hay una llamada separada que se pueda olvidar.

Es una diferencia real con Django, donde `save` escribe lo que le des y validar
es un paso aparte. La misma familia de patrón, dos decisiones opuestas sobre lo
que ocurre por omisión.

### Eloquent · [`eloquent/app/Models/Tarea.php`](implementaciones/eloquent/app/Models/Tarea.php) — la regla colgada de un evento

```php
class Tarea extends Model
{
    protected $table = 'tareas';

    protected $fillable = ['titulo', 'hecha'];

    protected $casts = ['hecha' => 'boolean'];
```

```php
        static::saving(function (Tarea $tarea) {
            if (trim((string) $tarea->titulo) === '') {
                throw new RuntimeException('TITULO_REQUERIDO');
            }
        });
```

La regla se engancha al **evento `saving`**, así que se aplica venga la llamada de
donde venga — desde un controlador, desde una tarea programada o desde una
consola. Es la forma más fuerte de las cuatro de garantizar la regla.

`$fillable` merece una nota porque es seguridad y no configuración: **enumera qué
campos se pueden rellenar en masa** desde una petición. Sin esa lista, un cliente
que envíe `{"hecha": true, "es_admin": true}` podría escribir cualquier columna —
la vulnerabilidad de asignación masiva.

### El ORM de Django · [`django/app.py`](implementaciones/django/app.py) — y validar es un paso aparte

```python
class Tarea(models.Model):
    titulo = models.CharField(max_length=120)
    hecha = models.BooleanField(default=False)
```

```python
    def clean(self) -> None:
```

```python
        if not self.titulo.strip():
            raise ValidationError({"titulo": "TITULO_REQUERIDO"})
```

La regla vive en el modelo, igual que en Rails y Eloquent. **Y no se ejecuta
sola**: `save()` en Django escribe lo que le des, y llamar a `clean()` o a
`full_clean()` es responsabilidad de quien guarda.

Es un valor por omisión discutido y con motivo: hace que `save()` sea predecible
y hace que sea fácil escribir datos inválidos sin enterarse. Cuando se usan los
formularios de Django la validación sí ocurre; llamando al modelo directamente,
no.

```python
    INSTALLED_APPS=["__main__"],
```

Y un detalle del montaje que enseña algo del framework: para que Django encuentre
un modelo, su aplicación tiene que estar declarada. En un proyecto normal eso lo
hace el generador; aquí, con todo en un archivo, hay que declarar `__main__` como
aplicación.

### TypeORM en modo Active Record · [`typeorm/server.mjs`](implementaciones/typeorm/server.mjs)

```javascript
class Tarea extends BaseEntity {
```

```javascript
  validar() {
    if (!String(this.titulo ?? "").trim()) {
      const error = new Error("TITULO_REQUERIDO");
      error.codigo = "TITULO_REQUERIDO";
      throw error;
    }
  }
```

**Heredar de `BaseEntity` es lo que convierte la entidad en la puerta a la
tabla**: aparecen `save()`, `remove()`, `findOneBy()` y compañía sobre la propia
clase.

Esa única línea es la comparación más limpia de toda la parte 4, porque **TypeORM
soporta los dos patrones**: la clase 054 usa la misma biblioteca sin `BaseEntity`
y la diferencia se reduce a de qué lado quieres el conocimiento.

```javascript
const EsquemaTarea = new EntitySchema({
  name: "Tarea",
  target: Tarea,
  tableName: "tareas",
```

Sin decoradores ni TypeScript: `EntitySchema` describe la tabla y `target` la ata
a la clase. Es la vía de TypeORM para JavaScript puro, y de paso deja ver que los
decoradores de su documentación son azúcar sobre esto.

```javascript
const fuente = new DataSource({
  type: "sqljs",
```

`sqljs` es SQLite compilado a WebAssembly: **sin módulo nativo y sin guion de
instalación**, que es lo que este repositorio necesita al instalar con
`--ignore-scripts`. Para una clase es ideal; para producción, no — y decirlo es
parte de la clase.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `POST /tareas` "comprar pan" | `201`, `hecha: false` |
| `GET /tareas/1` | la tarea |
| `POST /tareas` con título vacío | `422 TITULO_REQUERIDO` |
| `GET /tareas` | `total: 1` — **no se guardó** |
| `PATCH /tareas/1` `hecha: true` | `200` |
| `GET /tareas/1` | `hecha: true` |
| `DELETE /tareas/1` | `204` |
| `GET /tareas/1` | `404` |

## 📖 Qué es Active Record

Fowler lo define en una frase: **un objeto que envuelve una fila de una tabla,
encapsula el acceso a la base de datos y añade lógica de dominio sobre esos
datos** [@fowler-poeaa].

Las tres cosas juntas. Y lo importante es lo que implica: **el objeto conoce su
almacenamiento.**

```ruby
tarea = Tarea.new(titulo: "comprar pan")
tarea.save        # el propio objeto escribe en la base
tarea.destroy     # y sabe borrarse
Tarea.find(1)     # y la clase sabe buscarse
```

No hay repositorio, no hay mapeador, no hay sesión que gestionar. Cuatro
frameworks distintos y el mismo gesto:

```php
$tarea->save();                       // Eloquent
```

```python
tarea.save()                          # Django
```

```javascript
await tarea.save();                   // TypeORM con BaseEntity
```

## ⚠️ Los cuatro no validan igual

Aquí está la diferencia práctica que más sorprende:

| Framework | ¿`save` valida? | Qué pasa si falla |
| --- | --- | --- |
| Rails | **sí, siempre** | devuelve `false` y llena `errors` |
| Eloquent | **no** | no hay validación de modelo; se cuelga de un evento |
| Django | **no** | `full_clean()` es un paso aparte que hay que llamar |
| TypeORM | **no** | ni siquiera trae validación |

**Solo Rails cumple la promesa completa.** En los otros tres, «el modelo valida»
es algo que tú construyes: un evento `saving` en Eloquent, una llamada explícita
a `full_clean()` en Django, un método propio en TypeORM.

Y el fallo es siempre el mismo: alguien guarda desde otro sitio, se olvida del
paso extra, y la fila inválida entra. Con Rails eso no puede pasar.

## 📖 Por qué gusta tanto

**Porque para un CRUD no hay nada más corto.** Un modelo de seis líneas te da
altas, bajas, consultas, validaciones y relaciones. Rails construyó su reputación
sobre exactamente eso, y sigue siendo cierto.

Y porque **es fácil de leer**. `tarea.save` no exige saber qué es una sesión, una
unidad de trabajo ni un contexto de persistencia. Para quien empieza, es una
diferencia enorme.

## ⚠️ Dónde se rompe

**Cuando la lógica de negocio crece.** El modelo acumula reglas, callbacks,
ámbitos y métodos auxiliares hasta convertirse en la clase de mil líneas por la
que pasa todo. El nombre habitual es *modelo gordo*, y no tiene buena salida:
partirlo exige sacar la lógica fuera, que es justamente lo que el patrón evitaba.

**Cuando hay que probarlo.** El objeto no existe sin su tabla. Probar una regla
de negocio implica una base de datos —o un doble que imite un ORM entero, que es
peor.

**Cuando la tabla y el concepto dejan de coincidir.** Active Record supone
*una clase, una tabla*. Un concepto de negocio repartido en tres tablas, o una
tabla que sirve a dos conceptos, deja de encajar.

**Cuando los callbacks se encadenan.** Un `after_save` que guarda otro modelo con
su propio `after_save` produce cascadas difíciles de seguir y peores de depurar.

## 🔬 Comparación

| Framework | Consulta | Validación | Callbacks |
| --- | --- | --- | --- |
| Rails | `Tarea.where(...)` | `validates` en el modelo | muy usados |
| Eloquent | `Tarea::where(...)` | manual o por evento | eventos y observadores |
| Django | `Tarea.objects.filter(...)` | `full_clean()` explícito | señales |
| TypeORM | `Tarea.find(...)` | ninguna | escuchadores de entidad |

## ⚠️ Errores frecuentes

- **Suponer que `save` valida.** En tres de los cuatro, no.
- **Poner reglas de negocio en callbacks.** Se ejecutan siempre, incluso donde no
  quieres, y aparecen lejos de donde se llamó.
- **Llamar a la base desde un callback.** Cascadas y transacciones sorpresa.
- **Probar la lógica levantando la base.** Funciona, y hace las pruebas lentas y
  frágiles.
- **Devolver el modelo entero como respuesta JSON.** Cualquier columna nueva
  —incluida una sensible— se publica sola.
- **Consultar dentro de un bucle.** Es el problema N+1 de la clase 056.

## ✅ Verificación

```bash
node scripts/run-class.mjs 053
```

## 🧪 Reto de transferencia

Añade una segunda regla —que el título no pase de 120 caracteres— a las cuatro
implementaciones. Cuenta en cuántas hay que tocar **más de un archivo** para que
se aplique siempre. Después haz lo mismo en la clase 054 y compara.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 054 — Data Mapper](../054-data-mapper/README.md) — el mismo contrato, el patrón opuesto
- [Módulo 06 — Persistencia y dominio](../../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@fowler-poeaa] Fowler, Martin. *Patterns of Enterprise Application Architecture*. Addison-Wesley, 2002. ISBN 9780321127426 — <https://openlibrary.org/isbn/9780321127426>
- [@evans-ddd] Evans, Eric. *Domain-Driven Design*. Addison-Wesley, 2003. ISBN 9780321125217 — <https://openlibrary.org/isbn/9780321125217>
- [@martin-clean-architecture] Martin, Robert C. *Clean Architecture*. Prentice Hall, 2017. ISBN 9780134494166 — <https://openlibrary.org/isbn/9780134494166>
