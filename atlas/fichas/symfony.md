# 🎼 Symfony — 2005

> [⬅️ Atlas](../README.md) · [🐘 Ecosistema PHP](../ecosistemas/php.md) · [🗂️ Índice](../frameworks.md)

Symfony es **la dependencia invisible más importante del catálogo**. Laravel usa
sus componentes. Drupal usa sus componentes. Decenas de proyectos que jamás lo
nombrarían dependen de él. Y sin embargo, en las comparativas populares suele
aparecer como «la alternativa verbosa a Laravel».

> **🎯 Por qué está en este programa**
>
> **Porque es el ejemplo canónico de dependencia que no ves**
> ([módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)). Adoptar un
> framework es adoptar su árbol de dependencias completo, y el módulo 11 pide
> mirarlo antes de decidir. Symfony es la prueba de que la marca de la cima no
> dice quién sostiene el edificio.
>
> **Y porque es a la vez framework y conjunto de componentes**, lo que lo
> convierte en un buen ejercicio de taxonomía del
> [módulo 00](../../curriculum/00-taxonomia-y-diagnostico.md).

| | |
|---|---|
| **Aparición** | 2005, creado por Fabien Potencier (SensioLabs) |
| **Clasificación** | `web-framework` + biblioteca de componentes |
| **Ecosistema** | PHP |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo, con versiones de soporte extendido |
| **Documentación** | <https://symfony.com/doc/current/> |

---

## 💡 Componentes antes que framework

La decisión estructural de Symfony fue publicar sus piezas como **bibliotecas
independientes**, utilizables sin adoptar el framework
[@symfony-components]. Enrutado, contenedor de dependencias, consola, cliente
HTTP, validación, serialización, formularios, caché, mensajería: cada uno se
instala por separado.

Esa decisión explica su alcance real:

| Quién lo usa | Qué componentes |
| --- | --- |
| **Laravel** | Enrutado, consola, respuesta HTTP, proceso, varios más |
| **Drupal** | Buena parte del núcleo desde su versión 8 |
| Muchos proyectos PHP | Consola, validación, serialización, cliente HTTP |

Para el módulo 11 la consecuencia es concreta: **cuando evalúas la salud de
Laravel, estás evaluando también la de Symfony**. Y esa dependencia no aparece en
ninguna comparativa de funcionalidades.

## ⚖️ La comparación honesta con Laravel

No son competidores del mismo tipo, y presentarlos así confunde:

| | Symfony | Laravel |
| --- | --- | --- |
| Filosofía | Explícito; configuras lo que quieres | Convención; funciona sin decir nada |
| Curva inicial | Más alta | Más baja |
| Cuando el proyecto crece | La explicitud se paga sola | Hay que domar la magia |
| Componentes sueltos | Diseñados para eso | Acoplados al framework |
| Soporte a largo plazo | Versiones LTS con años de soporte | Cadencia anual |
| Encaja en | Sistemas grandes, equipos con criterio, vida larga | Productos que deben existir ya |

Symfony publica además sus **buenas prácticas oficiales** —estructura de
directorios, cuándo usar anotaciones, cómo organizar servicios— lo que reduce la
principal desventaja de un framework configurable: que cada equipo invente su
propia forma [@symfony-best-practices], [@potencier-symfony].

## 🧭 Lo que aporta al programa

**Un contenedor de dependencias de primera categoría.** El de Symfony compila el
grafo de servicios y detecta en construcción errores que otros descubren en
ejecución. Es el mismo patrón del [módulo 02](../../curriculum/02-arquitectura-de-frameworks.md)
que se ve en Spring y en Angular, aquí con una implementación especialmente
depurada.

**Estándares antes que invención.** Symfony fue de los primeros en adoptar los
estándares PSR de interoperabilidad, que permiten intercambiar middleware,
contenedores y registros **entre frameworks PHP rivales**. Ese nivel de acuerdo
entre competidores casi no existe en otros ecosistemas del Atlas.

**Soporte a largo plazo real.** Las versiones LTS con años de mantenimiento son
lo que permite usarlo en administración pública y banca, donde el horizonte del
producto se mide en décadas y no en modas.

## 🎓 Las tres lecciones

**1. La marca de la cima no dice quién sostiene el edificio.** Evaluar un
framework sin mirar su árbol de dependencias es evaluar la mitad.

**2. Publicar los componentes por separado multiplica el alcance.** Symfony tiene
mucha más presencia real que cuota como framework, y esa presencia es la que
importa para su sostenibilidad.

**3. Explícito y verboso no son sinónimos.** La explicitud cuesta al principio y
se cobra sola cuando el sistema crece y alguien nuevo tiene que entenderlo.

## 🔗 Enlaces

- Documentación oficial: <https://symfony.com/doc/current/>
- [Ficha de Laravel](laravel.md) — quien construye sobre él
- [Ecosistema PHP](../ecosistemas/php.md) · [Módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)

## Fuentes

- [@potencier-symfony] Potencier, Fabien. *Symfony 5: The Fast Track*. Symfony SAS, 2019. ISBN 9782918390374 — <https://openlibrary.org/isbn/9782918390374>
- [@symfony-components] *Symfony Components*, Symfony — <https://symfony.com/components>
- [@symfony-best-practices] *Symfony Best Practices*, Symfony — <https://symfony.com/doc/current/best_practices.html>
