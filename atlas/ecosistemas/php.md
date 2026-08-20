# 🐘 PHP

> [⬅️ Atlas](../README.md) · [🗂️ Índice](../frameworks.md) · [🧭 Taxonomía](../../docs/TAXONOMY.md)

**El ecosistema que más web mueve y del que menos se habla en las conversaciones
sobre frameworks.** PHP nació en 1995 como un conjunto de guiones para páginas
personales y creció dentro del servidor web, no al lado de él. Esa historia
explica tanto su alcance como los prejuicios que arrastra.

## Por qué este ecosistema es como es

| Condición del lenguaje | Consecuencia en sus frameworks |
| --- | --- |
| **Un proceso por petición**, sin estado compartido entre ellas | El modelo mental es más simple: no hay fugas entre peticiones por diseño |
| Se **despliega copiando archivos** a un servidor | Barrera de entrada históricamente bajísima; también, prácticas inseguras heredadas |
| No tuvo **gestor de dependencias** hasta Composer (2012) | Antes, cada framework traía todo; después, el ecosistema se volvió componible |
| Los estándares **PSR** de interoperabilidad llegaron pronto | Middleware y contenedores intercambiables **entre frameworks distintos**, algo raro fuera de aquí |
| Adopción masiva en gestores de contenido | La mayor parte del PHP del mundo no está en un framework, sino en WordPress |

## La línea del tiempo

**2005-2006 · La llegada de las convenciones.** **CakePHP** trasladó Rails a PHP
casi literalmente. **Symfony** apareció el mismo año con otra apuesta:
componentes reutilizables antes que framework completo. **CodeIgniter** (2006)
fue la puerta de entrada de una generación entera, por una razón muy concreta —
funcionaba en los alojamientos compartidos baratos de la época, donde los demás
no.

**2006-2012 · La era empresarial.** **Zend Framework** intentó ser el framework
serio y corporativo de PHP. Lo consiguió a medias y a costa de una verbosidad
notable. Su relevo ordenado por **Laminas** bajo la Linux Foundation es una de
las transiciones de gobierno mejor documentadas del campo, y lectura obligada
antes de adoptar cualquier proyecto con un solo patrocinador.

**2011-hoy · Laravel.** Tomó las ideas de Rails, la infraestructura de Symfony y
añadió algo que PHP no tenía: **una experiencia de desarrollo cuidada**. ORM
expresivo, migraciones, colas, tareas programadas, pruebas, y un ecosistema
comercial propio para despliegue y administración. Hoy es, con diferencia, el
framework más usado del lenguaje.

**La dependencia invisible.** Laravel usa componentes de Symfony. Drupal usa
componentes de Symfony. Muchos proyectos que jamás nombrarían Symfony dependen
de él. Es el ejemplo perfecto de por qué el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) exige mirar el
árbol de dependencias y no solo la marca de la cima.

## El error de categoría más frecuente del ecosistema

**WordPress no es un framework.** Es un gestor de contenidos: un producto
completo que se administra, con su propio modelo de extensión. Compararlo con
Laravel es el error que el [módulo 00](../../curriculum/00-taxonomia-y-diagnostico.md)
enseña a detectar. Y su licencia copyleft (`GPL-2.0-or-later`) impone
obligaciones sobre los temas y complementos que se distribuyen, algo que casi
nunca aparece en las comparativas.

## Las 12 tecnologías

<!-- generado:tabla-ecosistema php -->
| Tecnología | Clasificación | Desde | Era | Estado | Licencia | Documentación |
| --- | --- | ---: | --- | --- | --- | --- |
| **CakePHP** | `full-stack-framework` | 2005 | 🌱 Pionero | 🟢 activo | `MIT` | [oficial](https://book.cakephp.org/) |
| **CodeIgniter** | `web-framework` | 2006 | 🌱 Pionero | 🟢 activo | `MIT` | [oficial](https://codeigniter.com/user_guide/) |
| **Drupal** | `cms` | 2001 | 🏛️ Clásico | 🟢 activo | `GPL-2.0-or-later` | [oficial](https://www.drupal.org/docs) |
| **Laminas** | `application-framework` | 2019 | 🏛️ Clásico | 🟢 activo | `BSD-3-Clause` | [oficial](https://docs.laminas.dev/) |
| **Phalcon** | `full-stack-framework` | 2012 | 🏛️ Clásico | 🟢 activo | `BSD-3-Clause` | [oficial](https://docs.phalcon.io/latest/) |
| **Slim** | `web-framework` | 2010 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://www.slimframework.com/docs/v4/) |
| **Symfony** | `web-framework` | 2005 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://symfony.com/doc/current/) |
| **WordPress** | `cms` | 2003 | 🏛️ Clásico | 🟢 activo | `GPL-2.0-or-later` | [oficial](https://developer.wordpress.org/) |
| **Yii** | `full-stack-framework` | 2008 | 🏛️ Clásico | 🟢 activo | `BSD-3-Clause` | [oficial](https://www.yiiframework.com/doc/guide/2.0/en) |
| **Zend Framework** | `application-framework` | 2006 | 🏛️ Clásico | ⚪ histórico | `BSD-3-Clause` | [oficial](https://docs.laminas.dev/migration/) |
| **Eloquent (Laravel)** | `orm` | 2011 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://laravel.com/docs/eloquent) |
| [**Laravel**](../fichas/laravel.md) | `full-stack-framework` | 2011 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://laravel.com/docs) |
<!-- fin -->

## Qué aportó cada una

<!-- generado:notas-ecosistema php -->
- **CakePHP** — Llevó las convenciones de Rails a PHP antes que nadie, con generación de código y ORM incluidos.
- **CodeIgniter** — Ligero y sin exigir configuración de servidor especial. Fue la puerta de entrada al patrón modelo-vista-controlador para una generación de programadores PHP.
- **Drupal** — Gestor de contenidos con modelo de datos configurable, construido sobre componentes de Symfony desde su versión 8.
- **Laminas** — Continuación de Zend Framework bajo gobierno de fundación. Ejemplo de transición ordenada de un proyecto corporativo a uno comunitario.
- **Phalcon** — Distribuido como extensión compilada de PHP en lugar de código fuente. Rendimiento a cambio de una instalación que no es la habitual del lenguaje.
- **Slim** — Microframework construido sobre los estándares PSR de interoperabilidad, que permiten intercambiar middleware entre frameworks PHP distintos.
- **Symfony** — Conjunto de componentes reutilizables además de framework. Buena parte de Laravel, Drupal y otros proyectos se apoya en sus piezas: un caso claro de dependencia invisible.
- **WordPress** — No es un framework general y compararlo con uno es un error de categoría. Su licencia copyleft y su modelo de complementos condicionan cualquier decisión construida encima.
- **Yii** — Rendimiento y generación de andamiaje como argumentos centrales, con carga perezosa de componentes.
- **Zend Framework** — Framework empresarial de PHP durante una década. Su relevo por Laminas es la guía de migración que conviene leer antes de adoptar cualquier proyecto de un solo patrocinador.
- **Eloquent (Laravel)** — Registro activo en PHP con relaciones expresivas. Su comodidad hace que la consulta N+1 aparezca con especial facilidad.
- **Laravel** — El framework más usado de PHP: ORM Eloquent, migraciones, colas, programación de tareas, pruebas y un ecosistema comercial propio. Redefinió lo que se espera de la experiencia de desarrollo en el lenguaje.
<!-- fin -->

## Para seguir

- [Ficha de Laravel](../fichas/laravel.md) — qué hizo distinto y qué se paga.
- [Módulo 02](../../curriculum/02-arquitectura-de-frameworks.md) — los estándares PSR son un caso ejemplar de mecanismo de extensión acordado entre proyectos rivales.
