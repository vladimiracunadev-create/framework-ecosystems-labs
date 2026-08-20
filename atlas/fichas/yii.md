# ⚡ Yii — 2008

> [⬅️ Atlas](../README.md) · [🐘 Ecosistema PHP](../ecosistemas/php.md) · [🗂️ Índice](../frameworks.md)

Yii —de *Yes It Is*— hizo del **rendimiento** su argumento central en un momento
en que los frameworks PHP competían por funcionalidades. Su técnica principal, la
carga perezosa de componentes, es hoy una expectativa mínima.

| | |
|---|---|
| **Aparición** | 2008, creado por Qiang Xue |
| **Clasificación** | `full-stack-framework` |
| **Ecosistema** | PHP |
| **Licencia** | `BSD-3-Clause` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://www.yiiframework.com/doc/guide/2.0/en> |

---

## 💡 Carga perezosa de componentes

La idea: **no construir lo que no se va a usar en esta petición**. Si una ruta no
toca la caché, el objeto de caché no se crea. En un modelo donde cada petición
arranca de cero —como el de PHP— eso se nota.

Es la misma preocupación que empujó a [Quarkus](quarkus.md) y a
[Micronaut](micronaut.md) en la JVM, con una diferencia de contexto instructiva:
en PHP el coste de arranque se paga **en cada petición**, no una vez al desplegar.
La restricción del entorno vuelve a explicar el diseño del framework.

## 🧰 Generación de andamiaje

Yii incluye una herramienta que genera modelos, controladores y vistas a partir
del esquema de la base de datos. Es velocidad inicial real, y trae el compromiso
que enseña el [módulo 06](../../curriculum/06-persistencia-y-dominio.md):
**generar el dominio desde la tabla invierte la dirección correcta**. El modelo
acaba siendo un reflejo del esquema en lugar de las reglas del negocio, y eso se
paga cuando el dominio crece [@fowler-poeaa].

Es una herramienta excelente para paneles internos y para prototipos; y una mala
base para un dominio con invariantes.

## ⚖️ Su posición hoy

Yii ocupa un espacio intermedio: más convención que [Symfony](symfony.md), menos
ecosistema que [Laravel](laravel.md). Sigue activo y mantenido, con presencia
notable en algunos mercados.

Para el [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md), la
pregunta relevante es la de siempre: qué tamaño tiene su comunidad, cuánta gente
disponible hay y qué política de versiones publica — no cuánta cuota tiene en las
encuestas.

## 🎓 Las dos lecciones

**1. El coste de arranque significa cosas distintas según el modelo de
ejecución.** En PHP se paga por petición; en la JVM, al desplegar. La misma
optimización tiene valor muy distinto.

**2. Generar el dominio desde la base de datos invierte la dirección.** Es rápido
y produce un modelo que refleja tablas en lugar de reglas.

## 🔗 Enlaces

- Documentación oficial: <https://www.yiiframework.com/doc/guide/2.0/en>
- [Ficha de Laravel](laravel.md) · [Ficha de Symfony](symfony.md)
- [Módulo 06](../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@fowler-poeaa] Fowler, Martin. *Patterns of Enterprise Application Architecture*. Addison-Wesley, 2002. ISBN 9780321127426 — <https://openlibrary.org/isbn/9780321127426>
