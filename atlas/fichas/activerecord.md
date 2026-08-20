# 🎬 Active Record (Rails) — 2004

> [⬅️ Atlas](../README.md) · [💎 Ecosistema Ruby](../ecosistemas/ruby.md) · [🗂️ Índice](../frameworks.md)

Active Record de Rails es **la implementación que dio nombre popular al patrón**
que Martin Fowler había catalogado un año antes. Casi todo el mundo que hoy dice
«registro activo» está pensando, sin saberlo, en esta implementación.

| | |
|---|---|
| **Aparición** | 2004, con Rails |
| **Clasificación** | `orm` — registro activo |
| **Ecosistema** | Ruby |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://guides.rubyonrails.org/active_record_basics.html> |

---

## 💡 El patrón, y su implementación más pura

Fowler describió el registro activo como «un objeto que envuelve una fila,
encapsula el acceso a la base de datos y añade lógica de dominio»
[@fowler-poeaa]. Rails lo llevó al extremo con metaprogramación:

```ruby
class Tarea < ApplicationRecord
  belongs_to :usuario
  validates :titulo, presence: true, length: { maximum: 120 }
end

# Los métodos de acceso a columnas NO están escritos: se generan leyendo el esquema.
tarea = Tarea.new(titulo: "Comparar ecosistemas")
tarea.save
```

Nadie declaró `titulo` como atributo. Active Record **consulta el esquema de la
tabla y genera los métodos** [@shaughnessy-ruby-microscope]. Esa es la magia que
hace Rails tan breve, y la razón de que el modelo dependa de la base de datos
para existir.

## 🗂️ Migraciones: la aportación que se olvida

Junto al ORM llegaron las migraciones versionadas, y esa es probablemente la
contribución más duradera de Rails al campo entero — ver la
[ficha de Rails](rails.md).

## ⚖️ El límite, en una frase

**El modelo es a la vez fila, dominio y a menudo respuesta.** Los tres modelos que
el [módulo 06](../../curriculum/06-persistencia-y-dominio.md) insiste en separar
colapsan en una clase, con dos síntomas conocidos:

1. **El esquema condiciona el diseño del dominio**: se modela lo que es fácil de
   guardar, no lo que es cierto del negocio [@evans-ddd].
2. **Los campos internos se filtran** en la API al serializar el modelo entero.

Y la consulta N+1, con la misma facilidad que en [Eloquent](eloquent.md), y el
mismo diagnóstico: contar consultas por caso de uso en una prueba.

## 🎓 Las dos lecciones

**1. Una implementación puede apropiarse del nombre de un patrón.** Conviene
distinguir el patrón general de la implementación concreta al comparar.

**2. Generar los métodos desde el esquema es lo que hace Rails breve y lo que ata
el dominio a la tabla.** Es el mismo hecho visto desde dos lados.

## 🔗 Enlaces

- Documentación oficial: <https://guides.rubyonrails.org/active_record_basics.html>
- [Ficha de Rails](rails.md) · [Ficha de Eloquent](eloquent.md) · [Ficha de SQLAlchemy](sqlalchemy.md)
- [Módulo 06](../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@fowler-poeaa] Fowler, Martin. *Patterns of Enterprise Application Architecture*. Addison-Wesley, 2002. ISBN 9780321127426 — <https://openlibrary.org/isbn/9780321127426>
- [@evans-ddd] Evans, Eric. *Domain-Driven Design*. Addison-Wesley, 2003. ISBN 9780321125217 — <https://openlibrary.org/isbn/9780321125217>
- [@shaughnessy-ruby-microscope] Shaughnessy, Pat. *Ruby Under a Microscope*. No Starch Press, 2014. ISBN 9781593275273 — <https://openlibrary.org/isbn/9781593275273>
