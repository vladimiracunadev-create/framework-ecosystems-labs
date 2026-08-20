# 🍰 CakePHP — 2005

> [⬅️ Atlas](../README.md) · [🐘 Ecosistema PHP](../ecosistemas/php.md) · [🗂️ Índice](../frameworks.md)

CakePHP fue **el primero en llevar las convenciones de [Rails](rails.md) a otro
lenguaje**, con apenas un año de diferencia. Es la primera evidencia de que la
idea de Rails iba a viajar por todo el campo.

| | |
|---|---|
| **Aparición** | 2005, creado por Michal Tatarynowicz |
| **Clasificación** | `full-stack-framework` |
| **Ecosistema** | PHP |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://book.cakephp.org/> |

---

## 💡 Convenciones, generación y ORM

CakePHP trajo a PHP el paquete completo de Rails: una clase `Tarea` se
corresponde con la tabla `tareas`, los generadores crean el andamiaje de un
recurso, y el ORM deduce relaciones a partir de los nombres de las claves.

Para el [módulo 02](../../curriculum/02-arquitectura-de-frameworks.md) es el mismo
compromiso que en Rails: **máxima velocidad inicial a cambio de comportamiento
implícito**, con la misma regla —cuanto más implícito, mejor debe ser el
diagnóstico [@ruby-thomas-agile-rails].

## 📜 Su lugar en la genealogía

```
Rails (2004) ──► CakePHP (2005) ──► CodeIgniter (2006) ──► Laravel (2011)
```

Ese linaje explica algo que sorprende a quien llega hoy: **Laravel no inventó las
convenciones de PHP**. Las heredó de una cadena que empieza en Rails y pasa por
aquí. Lo que Laravel aportó fue experiencia de desarrollo y ecosistema, no el
modelo.

## ⚖️ Por qué no lideró

Cuando el ecosistema PHP se modernizó —Composer, espacios de nombres, estándares
PSR—, CakePHP tardó en adaptarse a las nuevas expectativas. Laravel nació ya
dentro de ese mundo y con una atención al detalle en la superficie que resultó
decisiva.

Sigue activo y mantenido: «no lidera» no es «no sirve», y esa distinción importa
para quien tiene un sistema en producción.

## 🎓 Las dos lecciones

**1. Ser el primero en traer una idea no garantiza liderarla.** CakePHP llegó
antes que todos y el liderazgo acabó en otro sitio.

**2. Adaptarse a la modernización del propio lenguaje es una prueba de salud.**
El módulo 11 lo mide como cadencia y política de versiones.

## 🔗 Enlaces

- Documentación oficial: <https://book.cakephp.org/>
- [Ficha de Rails](rails.md) · [Ficha de Laravel](laravel.md) · [Ficha de CodeIgniter](codeigniter.md)
- [Ecosistema PHP](../ecosistemas/php.md)

## Fuentes

- [@ruby-thomas-agile-rails] Ruby, Sam; Thomas, Dave. *Agile Web Development with Rails 7*. Pragmatic Bookshelf, 2022. ISBN 9781680509298 — <https://openlibrary.org/isbn/9781680509298>
