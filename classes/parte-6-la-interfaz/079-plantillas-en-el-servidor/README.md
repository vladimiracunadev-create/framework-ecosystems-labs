# Clase 079 — Plantillas en el servidor

> [⬅️ 078](../../parte-5-identidad-y-seguridad/078-dependencias-vulnerables/README.md) · [📚 Parte 6](../README.md) · [🎓 Clases](../../README.md) · [080 ➡️](../080-formularios-que-funcionan-sin-javascript/README.md)
>
> Parte **6 — La interfaz** · Nivel **🟢 introductorio** · Pista **`backend`**
>
> ✅ **Clase construida** — 6 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Generar HTML **donde están los datos**. Es la forma más antigua de pintar una
pantalla y sigue siendo la más simple: el servidor tiene la lista, el
servidor la convierte en HTML, y el navegador recibe algo que ya se puede
leer sin ejecutar nada.

## 🧩 La situación

Una lista de tres tareas recorrida por **seis motores de plantillas
distintos**. La tercera tarea es lo que un usuario escribió en un campo de
texto: `<script>alerta(1)</script>`. Cada motor la renderiza dos veces — por
su interpolación normal y por su puerta cruda.

Es la clase 073 al otro lado del cable: **la misma pregunta, en el
servidor**, y con la misma respuesta en los seis.

## 🧮 El contrato

| Petición | Respuesta | Qué mide |
| --- | --- | --- |
| `GET /tareas` | `content-type: text/html`, con `data-id="1"`, `"2"` y `"3"` | **el bucle se ejecutó**: tres elementos, no uno |
| `GET /tareas` | contiene `comprar pan`, `regar las plantas` | los datos se pintan donde están |
| `GET /tareas` | contiene `&lt;script`, **no** `<script>alerta(1)</script>` | la interpolación escapa por omisión |
| `GET /tareas` | contiene `alerta(1)` | **neutraliza, no recorta** |
| `GET /tareas-crudo` | contiene `<script>alerta(1)</script>` literal | la puerta cruda no escapa |

Los tres `data-id` son la prueba de que hubo un bucle: una plantilla que
pintara solo el primer elemento pasaría los demás casos. Y el cuarto
distingue escapar de filtrar, igual que en la 073: un motor que *borrara* el
script también pasaría el tercero, y estaría destruyendo datos del usuario.

## 🚪 Las puertas, por nombre

| Framework | Motor | Interpolación segura | La puerta cruda |
| --- | --- | --- | --- |
| Django | Django Templates | `{{ x }}` | `{{ x\|safe }}` |
| Flask | Jinja2 | `{{ x }}` | `{{ x\|safe }}` |
| Laravel | Blade | `{{ $x }}` | `{!! $x !!}` |
| Rails | ERB + SafeBuffer | `<%= x %>` | `<%= raw x %>` |
| Spring Boot | Thymeleaf | `th:text` | `th:utext` |
| Express | EJS (enchufado) | `<%= x %>` | `<%- x %>` |

Dos nombres merecen comentario:

- **`|safe`** (Django y Jinja) es el peor nombre del elenco: dice «seguro» y
  significa **«no lo revises»**. Se lee como una garantía y es una renuncia.
- **`html_safe`** (Rails) es su primo: no *vuelve* segura la cadena, declara
  que ya lo era. Cuando se declara sobre texto de un usuario, la declaración
  es falsa y el XSS es inmediato.

Frente a ellos, `{!! !!}` y `<%- %>` no dicen nada, y `th:utext` al menos
lleva la `u` de *unescaped*. Ninguno llega al `dangerouslySetInnerHTML` de
React (clase 073): en el servidor, **la puerta peligrosa tiene mejor prensa
de la que merece**.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Escapado**](../../../glosario/README.md#escapado) | Neutralizar los caracteres que tendrían significado en el destino, **sin destruir el dato**: `<` se convierte en `&lt;` y el texto sigue entero. Escapar no es filtrar, y dónde vive el escapado —en el motor, en el framework o en el tipo— decide qué se puede olvidar. |

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **Django** | framework web de Python (Python) | 2005 | BSD-3-Clause | Django Software Foundation |
| **Flask** | framework web de Python (Python) | 2010 | BSD-3-Clause | Pallets Projects |
| **Laravel** | full-stack-framework de PHP (PHP) | 2011 | MIT | proyecto independiente |
| **Ruby on Rails** | full-stack-framework de Ruby (Ruby) | 2004 | MIT | proyecto independiente |
| **Spring Boot** | framework de aplicación de JVM (Java) | 2014 | Apache-2.0 | Broadcom/VMware y colaboradores |
| **Express** | framework web de Node.js (JavaScript) | 2010 | MIT | OpenJS Foundation |

### 🔧 Django

Baterías incluidas: ORM, migraciones, panel de administración, autenticación y formularios. Su panel generado sigue siendo un argumento decisivo para productos internos.

- **Documentación oficial:** <https://docs.djangoproject.com/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `django: la versión la fija la cadena de herramientas`
- **Necesita en el PATH:** `python`

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 python app.py
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `app.py` | código Python |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `plantillas/tareas-crudo.html` | plantilla o marcado |
| `plantillas/tareas.html` | plantilla o marcado |

### 🔧 Flask

Microframework que dejó a la persona elegir ORM, validación y estructura. El contrapunto exacto de Django dentro del mismo lenguaje.

- **Documentación oficial:** <https://flask.palletsprojects.com/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `flask>=3.0`
- **Necesita en el PATH:** `python`

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 python app.py
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `app.py` | código Python |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `requirements.txt` | dependencias de Python, una por línea, con versión fijada |
| `templates/tareas-crudo.html` | plantilla o marcado |
| `templates/tareas.html` | plantilla o marcado |

### 🔧 Laravel

El framework más usado de PHP: ORM Eloquent, migraciones, colas, programación de tareas, pruebas y un ecosistema comercial propio. Redefinió lo que se espera de la experiencia de desarrollo en el lenguaje.

- **Documentación oficial:** <https://laravel.com/docs>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `php ^8.2, laravel/framework ^12.0`
- **Necesita en el PATH:** `php`, `composer`

Preparar sus dependencias, dentro de su directorio:

```bash
composer install --no-interaction --quiet
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 php -S 127.0.0.1:3000 -t public
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `bootstrap/app.php` | arranque de Laravel: qué grupo de rutas, qué capas y qué manejo de errores |
| `bootstrap/providers.php` | código PHP |
| `composer.json` | manifiesto de Composer: la versión de PHP y las bibliotecas del proyecto |
| `config/app.php` | código PHP |
| `config/cache.php` | código PHP |
| `config/session.php` | código PHP |
| `config/view.php` | código PHP |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

### 🔧 Ruby on Rails

Origen de «convención sobre configuración» y de las migraciones de base de datos tal como se entienden hoy. Casi todos los frameworks completos posteriores citan su influencia.

- **Documentación oficial:** <https://guides.rubyonrails.org/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `rails ~> 8.0, puma ~> 6.4`
- **Necesita en el PATH:** `ruby`, `bundle`

Preparar sus dependencias, dentro de su directorio:

```bash
bundle install --quiet
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 bundle exec puma -b tcp://127.0.0.1:3000 config.ru
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `.bundle/config` | archivo del proyecto |
| `app/views/tareas/crudo.html.erb` | plantilla ERB |
| `app/views/tareas/index.html.erb` | plantilla ERB |
| `config.ru` | punto de entrada de Rack, el estándar de servidores de Ruby |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Gemfile` | dependencias de Ruby |

### 🔧 Spring Boot

Autoconfiguración y servidor incrustado sobre Spring. Convirtió un framework famoso por su configuración XML en uno de arranque inmediato.

- **Documentación oficial:** <https://spring.io/projects/spring-boot>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `spring-boot 3.5.6, Java 21, spring-boot-starter-web, spring-boot-starter-thymeleaf`
- **Necesita en el PATH:** `java`, `mvn`

Preparar sus dependencias, dentro de su directorio:

```bash
mvn -q -B package -DskipTests
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 java -jar target/clase-079-1.0.0.jar --server.port=3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `pom.xml` | manifiesto de Maven: el proyecto, su Java, sus dependencias y cómo se empaqueta |
| `src/main/java/labs/Aplicacion.java` | código Java |
| `src/main/resources/application.properties` | configuración de Spring Boot: lo que se ajusta sin tocar el código |
| `src/main/resources/templates/tareas-crudo.html` | plantilla o marcado |
| `src/main/resources/templates/tareas.html` | plantilla o marcado |

### 🔧 Express

Definió el modelo de middleware encadenado que copiaron casi todos los frameworks de Node.js. Minimalista no significa biblioteca: posee el bucle de peticiones.

- **Documentación oficial:** <https://expressjs.com/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `ejs ^3.1.10, express ^5.1.0`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm install --silent --ignore-scripts
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node server.mjs
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `server.mjs` | código JavaScript (módulo ES) |
| `vistas/tareas-crudo.ejs` | plantilla EJS |
| `vistas/tareas.ejs` | plantilla EJS |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Cinco de los seis traen su motor puesto; **Express no**. Cada uno pinta la
misma lista dos veces —por la vía normal y por la puerta cruda— y lo que hay
que mirar es **dónde vive el escapado**, porque el sitio decide qué se puede
olvidar.

### Django · [`django/plantillas/tareas.html`](implementaciones/django/plantillas/tareas.html)

```django
{% for tarea in tareas %}
  <li data-id="{{ tarea.id }}">{{ tarea.titulo }}</li>
{% endfor %}
```

Y la puerta, en [`tareas-crudo.html`](implementaciones/django/plantillas/tareas-crudo.html):

```django
  <li data-id="{{ tarea.id }}">{{ tarea.titulo|safe }}</li>
```

En Django el autoescapado es **del motor**: viene encendido y hay que pedir que
se apague. No hay configuración que alguien pueda olvidar activar.

`|safe` tiene el nombre más engañoso del elenco junto al de Jinja: **dice
«seguro» y significa «no lo revises»**.

### Flask · [`flask/templates/tareas.html`](implementaciones/flask/templates/tareas.html)

```jinja
{% for tarea in tareas %}
  <li data-id="{{ tarea.id }}">{{ tarea.titulo }}</li>
{% endfor %}
```

Idéntico a Django en la superficie, y **distinto en lo importante**: Jinja
suelto **no escapa por omisión**. Lo enciende Flask, y solo para los ficheros
`.html`.

La política es del *framework*, no de la biblioteca — y la consecuencia
práctica es grande: usar Jinja a pelo en un script, fuera de
`render_template`, deja la protección atrás sin que nada avise.

### Laravel · [`laravel/resources/views/tareas.blade.php`](implementaciones/laravel/resources/views/tareas.blade.php)

```blade
@foreach ($tareas as $tarea)
  <li data-id="{{ $tarea['id'] }}">{{ $tarea['titulo'] }}</li>
@endforeach
```

```blade
  <li data-id="{{ $tarea['id'] }}">{!! $tarea['titulo'] !!}</li>
```

Las llaves dobles compilan a `htmlspecialchars`. Y ahí está el rasgo propio de
Blade: **no interpreta la plantilla en cada petición, la compila a PHP una vez
y cachea el resultado**. El escapado no se paga en cada respuesta porque no hay
interpretación en cada respuesta.

El signo de admiración de `{!! !!}` es la advertencia: se lee distinto y se
teclea distinto.

### Rails · [`rails/app/views/tareas/index.html.erb`](implementaciones/rails/app/views/tareas/index.html.erb)

```erb
<% @tareas.each do |tarea| %>
  <li data-id="<%= tarea[:id] %>"><%= tarea[:titulo] %></li>
<% end %>
```

```erb
  <li data-id="<%= tarea[:id] %>"><%= raw tarea[:titulo] %></li>
```

**El diseño más distinto del elenco.** Aquí el escapado no es del motor: es
**del tipo**. Rails envuelve la salida en `SafeBuffer`, que escapa toda cadena
normal al interpolarla y deja pasar entera solo la marcada como `html_safe`.

La defensa **viaja con el dato**, no con la plantilla: atraviesa ayudantes,
parciales y capas. Es la cobertura más amplia del elenco — y la razón de que
`html_safe` sea el método más peligroso de Rails, porque desactiva algo que
iba a seguir protegiendo más allá de esa plantilla. Su nombre además **miente**:
no vuelve segura la cadena, declara que ya lo era.

### Spring Boot · [`spring-boot/…/tareas.html`](implementaciones/spring-boot/src/main/resources/templates/tareas.html)

```html
  <li th:each="tarea : ${tareas}" th:attr="data-id=${tarea.id}" th:text="${tarea.titulo}">
    marcador de posición que el motor sustituye
  </li>
```

```html
  <li th:each="tarea : ${tareas}" th:attr="data-id=${tarea.id}" th:utext="${tarea.titulo}">
```

El rasgo de Thymeleaf está en la línea de dentro: **una plantilla es HTML
válido**. Se abre en un navegador y se ve la maqueta, con los atributos `th:`
ignorados y el marcador de posición a la vista. Los otros cinco producen
ficheros que solo su motor entiende.

Y la puerta se llama `th:utext` — la `u` es de *unescaped*. **Una letra de
diferencia**, como el guion de EJS.

### Express · [`express/vistas/tareas.ejs`](implementaciones/express/vistas/tareas.ejs)

```ejs
<% for (const tarea of tareas) { %>
  <li data-id="<%= tarea.id %>"><%= tarea.titulo %></li>
<% } %>
```

```ejs
  <li data-id="<%= tarea.id %>"><%- tarea.titulo %></li>
```

Esta fila **no es un empate**: Express no trae motor, trae el **enchufe** para
uno. EJS, Pug o Handlebars cumplen el mismo contrato y la elección —con su
política de escapado— es tuya. Es la misma filosofía que el resto del
framework, y la razón de que aquí haya una dependencia donde los demás no la
necesitan.

`<%=` escapa y `<%-` no: **la diferencia es un guion**, el nombre más discreto
del elenco. Nada en el símbolo avisa de lo que hace.

> Dos tropiezos reales que quedaron documentados en el propio código porque son
> la misma familia de error en dos motores: ni el comentario de Django ni el de
> EJS pueden contener los delimitadores de su propio motor. En Django,
> `{# #}` es de **una sola línea** y un comentario de varias con llaves dentro
> es un error de sintaxis; en EJS, el analizador toma sus delimitadores por
> código y falla al compilar. Por eso los dos comentarios están escritos como
> están.

## 📊 Comparación

| Framework | ¿Trae motor? | Dónde vive el escapado | Rasgo propio |
| --- | --- | --- | --- |
| Django | sí | en el motor | autoescapado no desactivable por descuido |
| Flask | sí (Jinja2) | en el **framework**, no en la biblioteca | Jinja suelto no escapa |
| Laravel | sí (Blade) | en la compilación a PHP | plantilla compilada y cacheada |
| Rails | sí (ERB) | en el **tipo** (`SafeBuffer`) | la defensa viaja con el dato |
| Spring Boot | sí (Thymeleaf) | en el atributo (`th:text`) | la plantilla es HTML válido |
| Express | **no**: enchufe | en el motor que elijas | la elección es tuya, y la política también |

## ⚠️ Errores frecuentes

- **`|safe` sobre texto de un usuario.** El nombre invita y el resultado es
  un XSS. La puerta cruda es para HTML **propio o saneado**.
- **Escapar a mano antes de la plantilla.** Doble escapado: el usuario ve
  `&amp;lt;`, y el arreglo apresurado suele ser quitar el escapado del motor.
- **Construir HTML concatenando cadenas** y pasarlo por la puerta cruda. Es
  la misma familia que la inyección SQL de la 074: datos que acaban
  interpretados como código.
- **Confiar en que el escapado de contenido cubre los atributos y las URL.**
  `href="javascript:…"` no lleva `<` ni `>`.
- **Lógica de negocio en la plantilla.** La plantilla decide cómo se ve, no
  qué se calcula; una plantilla con consultas dentro es el problema N+1 de la
  clase 056 disfrazado de vista.
- **Olvidar que esto también es una API.** El HTML es una representación
  más: la clase 018 (negociación de contenido) es la misma ruta sirviendo
  JSON o HTML según quién pregunte.

## ✅ Verificación

```bash
node scripts/run-class.mjs 079
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta
las implementaciones que encuentre y declara las que omitió.

## 🧪 Reto de transferencia

Añade la **plantilla base**: una maqueta con cabecera y pie de la que
`tareas` herede — `{% extends %}` en Django y Jinja, `@extends` en Blade,
`layout` en Rails, `th:fragment`/decoradores en Thymeleaf, `include` en EJS.
Comprueba con el contrato que la lista sigue rindiendo los tres `data-id`
dentro de la maqueta, y observa cuál de los seis mecanismos de herencia es
composición y cuál es sustitución.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 073 — XSS y escapado](../../parte-5-identidad-y-seguridad/073-xss-y-escapado/README.md) — la misma pregunta en el navegador
- [Clase 080 — Formularios que funcionan sin JavaScript](../080-formularios-que-funcionan-sin-javascript/README.md) — lo que se hace con este HTML

## Fuentes

- [@owasp-cheatsheets] *OWASP Cheat Sheet Series* (Cross Site Scripting Prevention). OWASP — <https://cheatsheetseries.owasp.org/>
- [@whatwg-html] *HTML Standard*. WHATWG — <https://html.spec.whatwg.org/>
- [@fowler-poeaa] Fowler, Martin. *Patterns of Enterprise Application Architecture* (Template View). Addison-Wesley, 2002. ISBN 9780321127426 — <https://openlibrary.org/isbn/9780321127426>
- [@ruby-thomas-agile-rails] Ruby, S.; Thomas, D. *Agile Web Development with Rails 7*. Pragmatic Bookshelf, 2022. ISBN 9781680509298 — <https://openlibrary.org/isbn/9781680509298>
- [@stauffer-laravel] Stauffer, Matt. *Laravel: Up & Running*. O'Reilly Media. ISBN 9781492041214 — <https://openlibrary.org/isbn/9781492041214>
