# 💧 Drupal — 2001

> [⬅️ Atlas](../README.md) · [🐘 Ecosistema PHP](../ecosistemas/php.md) · [🗂️ Índice](../frameworks.md)

Drupal es un gestor de contenidos con una diferencia importante respecto a
[WordPress](wordpress.md): **el modelo de datos es configurable**. En lugar de
partir de «entradas y páginas», permite definir tipos de contenido con sus campos
y relaciones desde la interfaz de administración.

| | |
|---|---|
| **Aparición** | 2001, creado por Dries Buytaert |
| **Clasificación** | `cms` — **no** es un framework |
| **Ecosistema** | PHP |
| **Licencia** | `GPL-2.0-or-later` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://www.drupal.org/docs> |

---

## 💡 Modelo de datos como configuración

La propuesta: definir el dominio **sin programar**. Un tipo de contenido
«Producto» con sus campos, sus relaciones y sus permisos se crea desde la
interfaz.

Es potente y tiene una consecuencia que el
[módulo 06](../../curriculum/06-persistencia-y-dominio.md) ayuda a ver: **el
modelo de dominio vive en la base de datos, no en el repositorio**. Eso complica
tres cosas que damos por hechas en un proyecto de código:

| Práctica habitual | Cómo se complica |
| --- | --- |
| Revisar un cambio de modelo | No está en un archivo que se pueda leer en una revisión |
| Reproducir un entorno | Hay que exportar e importar configuración |
| Migrar entre entornos | Existe un sistema de configuración exportable, y es trabajo aparte |

Drupal resolvió esto con un mecanismo de configuración exportable a archivos,
precisamente porque el problema era real.

## 🔄 La reescritura sobre Symfony

Drupal 8 supuso una **reescritura profunda**: adoptó componentes de
[Symfony](symfony.md), espacios de nombres, inyección de dependencias y las
prácticas del PHP moderno [@symfony-components].

Fue una migración dura para el ecosistema de módulos —comparable en dificultad a
la de [AngularJS](angularjs.md)— y con una diferencia clave: se hizo **dentro del
mismo producto**, con guías y herramientas, en lugar de renombrarlo. Las
versiones posteriores han sido mucho más continuistas, lo que sugiere que la
lección se aprendió.

## ⚖️ Lo mismo que en WordPress

Dos advertencias del [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)
se aplican igual:

**Licencia copyleft.** GPL condiciona lo que se distribuye construido encima.

**Cadena de suministro.** Los módulos de terceros son dependencias con acceso
completo, y su calidad y mantenimiento son desiguales.

## 🎓 Las dos lecciones

**1. Configurar el modelo de datos desde una interfaz saca el dominio del
repositorio.** Es flexible y complica revisión, reproducibilidad y migración.

**2. Una reescritura puede hacerse dentro del mismo producto.** Drupal 8 cambió
casi todo y conservó el nombre, la comunidad y el camino de migración.

## 🔗 Enlaces

- Documentación oficial: <https://www.drupal.org/docs>
- [Ficha de WordPress](wordpress.md) · [Ficha de Symfony](symfony.md)
- [Módulo 06](../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@symfony-components] *Symfony Components*, Symfony — <https://symfony.com/components>
- [@wordpress-license] *WordPress License (GPL)*, WordPress — <https://wordpress.org/about/license/>
