# 🛤️ Ruby on Rails — 2004

> [⬅️ Atlas](../README.md) · [💎 Ecosistema Ruby](../ecosistemas/ruby.md) · [🗂️ Índice](../frameworks.md)

Si el [árbol genealógico del Atlas](../README.md) tuviera un nodo central, sería
este. **Django, CakePHP, CodeIgniter, Grails, Sails, AdonisJS y Laravel citan sus
convenciones**, y la mayoría de quienes las usan hoy no ha escrito nunca una
línea de Ruby.

Rails no inventó el patrón modelo-vista-controlador ni las bases de datos
relacionales. Inventó algo más difícil de copiar: **una postura sobre cómo debe
sentirse construir software**, y la defendió con suficiente coherencia como para
que el resto del campo la adoptara sin darse cuenta.

> **🎯 Por qué está en este programa**
>
> **Es el origen de «convención sobre configuración»**, el compromiso que estudia
> el [módulo 02](../../curriculum/02-arquitectura-de-frameworks.md). Rails es donde
> ese compromiso se ve en estado puro: máxima velocidad inicial a cambio de que
> muchísimo comportamiento sea implícito.
>
> **Y es donde nacieron las migraciones de base de datos** tal como las entiende
> hoy todo el mundo ([módulo 06](../../curriculum/06-persistencia-y-dominio.md)).
> Antes de Rails, cambiar un esquema en equipo era un documento de Word con
> instrucciones.

| | |
|---|---|
| **Aparición** | 2004, extraído de Basecamp por David Heinemeier Hansson |
| **Clasificación** | `full-stack-framework` |
| **Ecosistema** | Ruby |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://guides.rubyonrails.org/> |

---

## 📜 De dónde salió, y por qué importa

Rails no se diseñó en abstracto: se **extrajo** de un producto que ya funcionaba.
Esa procedencia explica sus decisiones mejor que cualquier manifiesto. Todo lo
que hay en Rails está porque hizo falta para construir una aplicación real, no
porque encajara en un modelo teórico.

El proyecto publica su filosofía de forma explícita —algo poco común— y merece
leerse entera, porque es un documento de diseño, no publicidad
[@rails-doctrine]. Sus dos ideas más productivas:

**«Optimizar para la felicidad de quien programa».** Suena blando y tiene una
consecuencia dura: cuando hay que elegir entre pureza arquitectónica y comodidad,
Rails elige comodidad y lo dice.

**«El menú es *omakase*».** El framework elige por ti el ORM, las plantillas, las
pruebas y la estructura. No es una limitación disimulada: es la propuesta. Quien
quiera elegir cada pieza está en el framework equivocado, y eso también es
información valiosa para el [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md).

## 💡 Las cinco ideas que todos copiaron

### 1. Convención sobre configuración

```ruby
# Sin una línea de configuración, Rails deduce:
#   clase Producto  ->  tabla "productos"
#   columna precio  ->  método .precio
#   /productos/7    ->  ProductosController#show con params[:id] = 7
class Producto < ApplicationRecord
  belongs_to :categoria
end
```

En 2004 el equivalente en Java eran cientos de líneas de XML. La reducción no era
del 20 %: era de un orden de magnitud [@ruby-thomas-agile-rails].

**El precio** es el del módulo 02: cuando la convención no se cumple, el error hay
que interpretarlo, porque el código no dice qué esperaba. Cuanto más implícito, mejor
tiene que ser el diagnóstico.

### 2. Migraciones versionadas

Esta es, probablemente, la aportación de Rails con más impacto y menos crédito:

```ruby
class AgregarPublicadoAProductos < ActiveRecord::Migration[7.0]
  def change
    add_column :productos, :publicado, :boolean, default: false
  end
end
```

Tres propiedades que hoy damos por supuestas y entonces no existían: el cambio de
esquema **vive en el repositorio** junto al código que lo necesita, se aplica en
**orden determinista** en cada entorno, y **se puede revertir**. Django, Laravel,
Entity Framework, Prisma y Flyway implementan hoy la misma idea.

Es la base del paso reversible que exige el
[módulo 06](../../curriculum/06-persistencia-y-dominio.md): una migración que solo
puede avanzar convierte cualquier despliegue fallido en una incidencia de datos.

### 3. Registro activo como opción por omisión

Rails popularizó el patrón que Fowler había catalogado: **el objeto sabe
guardarse a sí mismo**. Es la razón de su velocidad inicial y también de su límite
—cuando el dominio crece, el modelo acumula persistencia, validación, reglas de
negocio y presentación en la misma clase [@fernandez-rails-way].

El módulo 06 presenta la alternativa —mapeador de datos— sin declarar ganador: la
elección depende de cuánta lógica tiene el dominio, no de la moda.

### 4. El entorno de desarrollo es parte del producto

Generadores, consola interactiva contra la aplicación viva, recarga automática,
pruebas incluidas desde el primer día. Hoy es la expectativa mínima; en 2004 era
extraordinario.

### 5. Todo el ciclo, en la caja

Enrutado, controladores, vistas, ORM, migraciones, correo, trabajos en segundo
plano, caché, activos y despliegue. Cada elemento es una decisión que no tomas — y
el módulo 11 pide contarlas todas, porque son a la vez el ahorro y la atadura.

## 🔄 La segunda vida: Hotwire

Mientras el resto del campo mudaba el estado al navegador, Rails hizo lo
contrario. **Turbo** y **Stimulus** consiguen navegación instantánea y
actualizaciones parciales **sin escribir JavaScript de aplicación**, dejando el
estado donde estaba.

Es la misma apuesta que htmx y que Phoenix LiveView, y devolvió al debate una
pregunta incómoda: **¿cuántas de las aplicaciones que se construyeron como página
única lo necesitaban de verdad?** El [módulo 04](../../curriculum/04-fullstack-y-renderizado.md)
la plantea con la tabla de decisión por contenido, no por aplicación.

## ⚖️ Lo que hay que saber antes de elegirlo hoy

**La cuota bajó; la influencia no.** Rails ya no es la elección por defecto para
una aplicación nueva en la mayoría de las empresas. Sigue siendo excelente para
productos con mucho CRUD, equipos pequeños y plazos cortos — exactamente el
contexto del que salió.

**El rendimiento por proceso es menor** que el de las alternativas compiladas.
Para la mayoría de los productos eso no es el cuello de botella; para algunos sí,
y esa afirmación hay que medirla con el protocolo del
[módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md), no darla por
supuesta en ninguna dirección.

**La magia hay que aprenderla.** Un equipo que llega sin experiencia previa
tarda en saber qué está pasando cuando algo no funciona. Es un coste de formación
real que debe entrar en la matriz de decisión.

## 🎓 Las tres lecciones

**1. Extraer un framework de un producto real produce mejores decisiones que
diseñarlo en abstracto.** Todo lo que hay en Rails estaba porque hizo falta.

**2. Una postura explícita es más útil que una lista de funcionalidades.** Que
Rails publique su filosofía permite decidir en cinco minutos si encaja contigo.
Casi ningún proyecto lo hace, y debería.

**3. La influencia sobrevive a la cuota.** Rails puede no ser tu próxima
elección y aun así estar en tus migraciones, en tus convenciones de nombres y en
la estructura de tu framework favorito. Reconocer esa herencia es el objetivo del
Atlas.

## 🔗 Enlaces

- Documentación oficial: <https://guides.rubyonrails.org/>
- [Ecosistema Ruby](../ecosistemas/ruby.md) · [Ficha de Laravel](laravel.md) — su descendiente más exitoso
- [Módulo 06](../../curriculum/06-persistencia-y-dominio.md) — migraciones reversibles y patrones de persistencia

## Fuentes

- [@ruby-thomas-agile-rails] Ruby, Sam; Thomas, Dave. *Agile Web Development with Rails 7*. Pragmatic Bookshelf, 2022. ISBN 9781680509298 — <https://openlibrary.org/isbn/9781680509298>
- [@fernandez-rails-way] Fernandez, Obie. *The Rails Way*. Addison-Wesley Professional, 2007. ISBN 9780321445612 — <https://openlibrary.org/isbn/9780321445612>
- [@rails-doctrine] Hansson, David Heinemeier. *The Rails Doctrine*, Ruby on Rails — <https://rubyonrails.org/doctrine>
