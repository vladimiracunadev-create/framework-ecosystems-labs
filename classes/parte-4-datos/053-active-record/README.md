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

## 🌐 Las implementaciones

[Active Record de Rails](implementaciones/activerecord/),
[Eloquent](implementaciones/eloquent/), [el ORM de Django](implementaciones/django/)
y [TypeORM en modo Active Record](implementaciones/typeorm/).

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
