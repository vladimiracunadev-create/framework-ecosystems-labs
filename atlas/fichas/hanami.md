# 🌸 Hanami — 2014

> [⬅️ Atlas](../README.md) · [💎 Ecosistema Ruby](../ecosistemas/ruby.md) · [🗂️ Índice](../frameworks.md)

Hanami es la alternativa a [Rails](rails.md) dentro de su propio ecosistema, con
una tesis explícita: **menos magia implícita y fronteras claras entre capas**.

Su interés para el Atlas es que discute con Rails **en su propio terreno**, lo
que hace la comparación especialmente limpia.

| | |
|---|---|
| **Aparición** | 2014 (antes llamado Lotus) |
| **Clasificación** | `full-stack-framework` |
| **Ecosistema** | Ruby |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://guides.hanamirb.org/> |

---

## 💡 Las tres diferencias

| | Rails | Hanami |
| --- | --- | --- |
| **Persistencia** | Registro activo: el modelo sabe guardarse | **Repositorios**: el dominio no conoce la base de datos |
| **Acciones** | Un controlador con varios métodos | **Una clase por acción**, con su propia entrada y salida |
| **Dependencias** | Constantes globales y autocarga | **Contenedor explícito** |

La primera fila es la más importante y conecta directo con el
[módulo 06](../../curriculum/06-persistencia-y-dominio.md): Hanami elige el
**mapeador de datos** en un ecosistema que hizo famoso el registro activo. El
dominio queda como objetos normales, y la persistencia vive en repositorios
[@fowler-poeaa].

La segunda conecta con el [módulo 02](../../curriculum/02-arquitectura-de-frameworks.md):
una clase por acción hace que las dependencias de cada caso de uso sean
**visibles en su constructor**, en lugar de compartidas por todo el controlador.

## ⚖️ El compromiso

**Se gana** un dominio independiente y probable sin infraestructura —lo que el
módulo 02 persigue— y menos comportamiento implícito que diagnosticar.

**Se paga** más código para lo mismo cuando la aplicación es un CRUD, y un
ecosistema mucho menor: el universo de complementos de Rails no está aquí.

## 🧭 La pregunta que deja

Hanami plantea bien la pregunta del
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md): **¿cuánta magia
compensa?** La respuesta depende de la vida esperada del producto y de la riqueza
del dominio. Para un CRUD con plazo corto, Rails; para un dominio con
invariantes y horizonte largo, la explicitud se cobra sola.

Que ambas opciones existan en el mismo lenguaje, como Django y Flask en Python,
convierte a Ruby en otro buen laboratorio de ese eje.

## 🎓 Las dos lecciones

**1. El mapeador de datos es una opción legítima incluso donde reina el registro
activo.** La elección depende del dominio, no de la costumbre del ecosistema.

**2. Una clase por acción hace visibles las dependencias.** Es una técnica
sencilla con efecto directo en la testabilidad.

## 🔗 Enlaces

- Documentación oficial: <https://guides.hanamirb.org/>
- [Ficha de Rails](rails.md) — la comparación · [Ficha de SQLAlchemy](sqlalchemy.md)
- [Módulo 06](../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@fowler-poeaa] Fowler, Martin. *Patterns of Enterprise Application Architecture*. Addison-Wesley, 2002. ISBN 9780321127426 — <https://openlibrary.org/isbn/9780321127426>
