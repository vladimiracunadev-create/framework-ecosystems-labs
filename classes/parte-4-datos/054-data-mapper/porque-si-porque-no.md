# Por qué sí y por qué no — Data Mapper

> [⬅️ Clase 054](README.md) · [📚 Parte 4](../README.md)

| ORM | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [SQLAlchemy](../../../atlas/fichas/sqlalchemy.md) | Mapeo imperativo: el dominio no menciona el ORM ni una vez | Dos formas de mapear conviviendo, y la declarativa es la que se ve en los tutoriales | Elegir a contracorriente |
| [Hibernate](../../../atlas/fichas/hibernate.md) | Repositorios generados y un ecosistema enorme | Las anotaciones se quedan en la entidad | Una separación de comportamiento, no de metadatos |
| [Entity Framework Core](../../../atlas/fichas/entity-framework-core.md) | Configuración fuera de la clase, y una entidad realmente limpia | Un contexto con ciclo de vida que hay que entender | La clase 051 completa |
| [TypeORM](../../../atlas/fichas/typeorm.md) | Los dos patrones en la misma biblioteca | Sin validación, y un ecosistema más joven | Construir lo que otros dan hecho |

## 🧭 La pregunta que decide

No es «¿cuál es más limpio?». Es:

> **¿Existe alguna regla de negocio que quieras poder probar sin base de datos?**

Si la hay, este patrón te la deja escribir en una clase corriente y comprobarla
en milisegundos. Si no la hay, estás montando andamios alrededor de un CRUD.

## 🧭 El repositorio que no sirve de nada

El fallo más común al adoptar Data Mapper no es técnico:

```python
class Repositorio:
    def query(self):
        return self.sesion.query(Tarea)   # <- devuelve el ORM hacia fuera
```

Un repositorio que expone las consultas del ORM **no esconde nada**. El dominio
sigue dependiendo de él, las pruebas siguen necesitando una base, y encima ahora
hay una clase más.

Un repositorio útil expone **verbos del dominio** —`por_id`, `pendientes_de`,
`guardar`— y devuelve entidades, no consultas. Si la interfaz se puede
implementar con una lista en memoria, el patrón está bien aplicado. Si no, es
decoración.

## 💡 Lo que hay que llevarse

Evans describe el modelo de dominio como un lenguaje compartido entre quien
programa y quien conoce el negocio [@evans-ddd]. Ese lenguaje no puede hablar de
claves ajenas ni de sesiones abiertas.

Data Mapper es lo que hace posible esa conversación: **el dominio se escribe en
los términos del problema, y la traducción a tablas ocurre en otro sitio**.

Y por eso el patrón se justifica solo cuando hay un dominio del que hablar. Con
cuatro campos y ninguna regla, la traducción es lo único que hay — y entonces la
clase 053 gana por goleada.

## Fuentes

- [@evans-ddd] Evans, Eric. *Domain-Driven Design*. Addison-Wesley, 2003. ISBN 9780321125217 — <https://openlibrary.org/isbn/9780321125217>
- [@fowler-poeaa] Fowler, Martin. *Patterns of Enterprise Application Architecture*. Addison-Wesley, 2002. ISBN 9780321127426 — <https://openlibrary.org/isbn/9780321127426>
