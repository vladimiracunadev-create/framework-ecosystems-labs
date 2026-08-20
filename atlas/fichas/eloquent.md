# 💫 Eloquent — 2011

> [⬅️ Atlas](../README.md) · [🐘 Ecosistema PHP](../ecosistemas/php.md) · [🗂️ Índice](../frameworks.md)

Eloquent es el ORM de [Laravel](laravel.md) y **la implementación más expresiva
del patrón de registro activo** que hay en el catálogo. Su comodidad es real, y
por eso es también donde el problema de la consulta N+1 aparece con más
facilidad.

| | |
|---|---|
| **Aparición** | 2011, con Laravel |
| **Clasificación** | `orm` — registro activo |
| **Ecosistema** | PHP |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://laravel.com/docs/eloquent> |

---

## 💡 El objeto sabe guardarse

```php
class Usuario extends Model {
    public function pedidos() { return $this->hasMany(Pedido::class); }
}

$usuario = Usuario::find(1);
$usuario->nombre = 'Nuevo';
$usuario->save();                 // el objeto ES la fila y sabe persistirse
```

Es el patrón de registro activo tal como lo catalogó Fowler [@fowler-poeaa]:
rapidísimo de escribir, y con el límite conocido —el modelo acumula persistencia,
reglas de negocio, validación y a menudo presentación en la misma clase.

## ⚠️ La consulta N+1, en su forma más silenciosa

```php
// 1 consulta para los usuarios
foreach (Usuario::all() as $usuario) {
    // + 1 consulta MÁS por cada usuario, al tocar la relación
    echo $usuario->pedidos->count();
}

// La solución existe y hay que acordarse de escribirla:
foreach (Usuario::with('pedidos')->get() as $usuario) { /* 2 consultas en total */ }
```

Nada en la primera versión indica que se están lanzando consultas. **Esa
invisibilidad es el problema**, no la técnica.

El diagnóstico del [módulo 06](../../curriculum/06-persistencia-y-dominio.md) es
el único fiable: **contar consultas por caso de uso en una prueba**, con un
umbral. Leer el código buscando el fallo no funciona, porque el fallo no se ve.

## ⚖️ Los tres modelos que colapsan en uno

El módulo 06 insiste en separar modelo de transporte, de dominio y de
persistencia. Con Eloquent los tres tienden a ser la misma clase:

| Uso | Síntoma cuando el proyecto crece |
| --- | --- |
| Fila de la tabla | El esquema condiciona el diseño del dominio |
| Objeto de dominio | Las reglas se mezclan con la persistencia |
| Respuesta de la API | **Campos internos filtrados** al añadir una columna |

La tercera fila es la que produce incidentes: añadir una columna a la tabla la
publica en la API si el modelo se serializa entero. Laravel ofrece recursos de
API para evitarlo, y hay que usarlos deliberadamente.

## 🎓 Las dos lecciones

**1. La comodidad de un ORM se paga en visibilidad.** La consulta que no se ve es
la que no se optimiza.

**2. Separar los tres modelos cuesta al principio y evita la filtración
después.** Es la regla del módulo 06 y aquí es donde más se nota no seguirla.

## 🔗 Enlaces

- Documentación oficial: <https://laravel.com/docs/eloquent>
- [Ficha de Laravel](laravel.md) · [Ficha de Hibernate](hibernate.md) — el mapeador de datos
- [Módulo 06](../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@fowler-poeaa] Fowler, Martin. *Patterns of Enterprise Application Architecture*. Addison-Wesley, 2002. ISBN 9780321127426 — <https://openlibrary.org/isbn/9780321127426>
- [@stauffer-laravel] Stauffer, Matt. *Laravel: Up & Running*, 2.ª ed. O'Reilly Media, 2019. ISBN 9781492041214 — <https://openlibrary.org/isbn/9781492041214>
