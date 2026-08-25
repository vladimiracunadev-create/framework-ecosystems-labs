# Clase 080 — Formularios que funcionan sin JavaScript

> [⬅️ 079](../079-plantillas-en-el-servidor/README.md) · [📚 Parte 6](../README.md) · [🎓 Clases](../../README.md) · [081 ➡️](../081-mejora-progresiva/README.md)
>
> Parte **6 — La interfaz** · Nivel **🟢 introductorio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Construir sobre **lo que el navegador ya sabe hacer**. Un `<form>` con
`method="post"` recoge los campos, los codifica y los envía — hace treinta
años que lo hace, sin una línea de JavaScript [@whatwg-html]. Esta clase
recorre el ciclo completo de un alta con las piezas de serie del navegador y
del framework, y nada más.

## 🧩 La situación

Una página con un formulario de alta de tareas y la lista debajo. Se envía,
el servidor guarda, **redirige**, y la lista muestra la tarea nueva. El
formulario lleva su testigo CSRF —el de la clase 072, ahora en su hábitat
natural— y lo que entra por él sale escapado — la 079 aplicada al dato que
acaba de llegar.

## 🧮 El contrato

| Petición | Respuesta | Qué mide |
| --- | --- | --- |
| `GET /tareas` | HTML con `method="post"`, `name="titulo"` y un campo `hidden` | el formulario es HTML de verdad, testigo incluido |
| `POST` **sin** testigo | `403` / `419` / `400` | la defensa CSRF está activa |
| `POST` con testigo | **`302`/`303` con `Location`** — no HTML | enviar-**redirigir**-mostrar |
| `GET /tareas` | contiene `pagar la luz` | y al seguir la redirección, la tarea está |
| `POST` con `<script>…` | redirige | el envío malicioso también entra |
| `GET /tareas` | `&lt;script`, **no** `<script>` literal | …y sale **escapado** |

El tercer caso es el corazón: la respuesta a un POST con éxito **no es la
página, es una redirección a la página**. El patrón se llama
*POST/Redirect/GET* y existe por algo que todo usuario ha visto: recargar
tras enviar y encontrarse el diálogo «¿volver a enviar el formulario?» — que
al aceptar, crea el pedido dos veces. La redirección convierte la
recarga en un GET inocuo [@rfc9110].

El testigo se captura del propio marcado con `guardar_cuerpo` (nuevo en el
verificador), **nombre y valor por separado**: cada framework llama distinto
a su campo —`csrfmiddlewaretoken`, `_token`, `authenticity_token`,
`__RequestVerificationToken`— y el contrato no debe casarse con ninguno.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Enviar-redirigir-mostrar**](../../../glosario/README.md#enviar-redirigir-mostrar) *(POST/Redirect/GET)* | Responder a un `POST` con una redirección en lugar de con la página. Sin ese patrón, recargar reenvía el formulario y el navegador pregunta «¿reenviar datos?» — creando otro registro. |

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **Django** | framework web de Python (Python) | 2005 | BSD-3-Clause | Django Software Foundation |
| **Laravel** | full-stack-framework de PHP (PHP) | 2011 | MIT | proyecto independiente |
| **Ruby on Rails** | full-stack-framework de Ruby (Ruby) | 2004 | MIT | proyecto independiente |
| **ASP.NET Core** | framework web de .NET (C#) | 2016 | MIT | Microsoft y .NET Foundation |

### 🔧 Django

Baterías incluidas: ORM, migraciones, panel de administración, autenticación y formularios. Su panel generado sigue siendo un argumento decisivo para productos internos.

- **Documentación oficial:** <https://docs.djangoproject.com/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `django>=5.0`
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
| `plantillas/tareas.html` | plantilla o marcado |
| `requirements.txt` | dependencias de Python, una por línea, con versión fijada |

### 🔧 Laravel

El framework más usado de PHP: ORM Eloquent, migraciones, colas, programación de tareas, pruebas y un ecosistema comercial propio. Redefinió lo que se espera de la experiencia de desarrollo en el lenguaje.

- **Documentación oficial:** <https://laravel.com/docs>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `php ^8.2, laravel/framework ^12.0`
- **Necesita en el PATH:** `php`, `composer`

Preparar sus dependencias, dentro de su directorio:

```bash
composer install --no-interaction --quiet
php -r @unlink(__DIR__.'/storage/tareas.json');
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
| `Gemfile` | dependencias de Ruby |
| `app/views/tareas/index.html.erb` | plantilla ERB |
| `config.ru` | punto de entrada de Rack, el estándar de servidores de Ruby |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

### 🔧 ASP.NET Core

Reescritura multiplataforma y de código abierto de la pila web de Microsoft. Sus API mínimas trajeron el estilo de los microframeworks al ecosistema .NET.

- **Documentación oficial:** <https://learn.microsoft.com/aspnet/core/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `net10.0`
- **Necesita en el PATH:** `dotnet`

Preparar sus dependencias, dentro de su directorio:

```bash
dotnet build -c Release --nologo -v quiet
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 dotnet run -c Release --no-build --urls http://127.0.0.1:3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `Clase080.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `Pages/Tareas.cshtml` | página Razor: marcado con código C# incrustado |
| `Pages/Tareas.cshtml.cs` | código C# |
| `Pages/_ViewImports.cshtml` | directivas comunes a todas las páginas Razor, incluidos los ayudantes de etiqueta |
| `Program.cs` | código C# |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

El elenco es el de los frameworks que hacen esto **de verdad y de serie**. Por
eso están Django, Laravel, Rails y ASP.NET Core, y no están Express ni FastAPI:
pueden, pero componiéndolo todo, y el elenco honesto de esta clase es el de los
frameworks donde el formulario de servidor es el camino pavimentado.

Léelas por lo mismo que se comparan: **cuánto de esto hay que escribir**.

### Django · [`django/plantillas/tareas.html`](implementaciones/django/plantillas/tareas.html)

```html
<form method="post" action="/tareas">
  {% csrf_token %}
  <input name="titulo" value="">
  <button type="submit">Crear</button>
</form>
```

Cuatro líneas y **cada pieza se ve**. `{% csrf_token %}` pinta el campo oculto
de la clase 072 y va el primero del formulario a propósito: es lo que un
formulario real nunca omite.

Y el otro extremo del ciclo, en [`django/app.py`](implementaciones/django/app.py):

```python
        return redirect("/tareas")
```

```python
    MIDDLEWARE=["django.middleware.csrf.CsrfViewMiddleware"],
```

Las dos mitades declaradas: quién valida el testigo y qué se responde al POST.
Django es el único del elenco donde las dos están escritas en la aplicación.

### Laravel · [`laravel/resources/views/tareas.blade.php`](implementaciones/laravel/resources/views/tareas.blade.php)

```blade
<form method="post" action="/tareas">
  @csrf
  <input name="titulo" value="">
  <button type="submit">Crear</button>
</form>
```

Lo mismo con otra sintaxis. Pero la decisión de arquitectura de Laravel no está
aquí — está en [`laravel/bootstrap/app.php`](implementaciones/laravel/bootstrap/app.php):

```php
    ->withRouting(web: __DIR__ . '/../routes/web.php')
```

**`web:` y no `api:`.** El grupo `web` trae sesión, cookies cifradas y la
verificación del testigo; el grupo `api` no trae nada de eso, porque una API con
token no lo necesita. Esa palabra de cuatro letras **es la clase 072 convertida
en arquitectura**: no se decide ruta a ruta, se decide al declarar de qué mundo
forma parte el archivo entero.

### Rails · [`rails/app/views/tareas/index.html.erb`](implementaciones/rails/app/views/tareas/index.html.erb)

```erb
  <input type="hidden" name="authenticity_token" value="<%= form_authenticity_token %>">
```

Aquí el testigo va **explícito a propósito**: `form_with` lo pondría solo, y
justo por eso se escribe a mano — para ver qué pone. Es la única forma de que
una clase sobre convenciones no acabe enseñando la convención en lugar del
mecanismo.

Y en [`rails/config.ru`](implementaciones/rails/config.ru), la parte que sí es
decisión:

```ruby
  protect_from_forgery with: :exception

  rescue_from ActionController::InvalidAuthenticityToken do
    head :forbidden
  end
```

```ruby
    redirect_to "/tareas", status: :see_other
```

`with: :exception` en lugar del comportamiento por omisión —que reinicia la
sesión en silencio— porque **el contrato mide el rechazo**: una defensa que no
se nota no se puede probar. Y `status: :see_other` es el único del elenco que
emite `303` en vez de `302`; los dos valen para el navegador, y el `303` es el
que dice literalmente «vuelve con un GET».

### ASP.NET Core · [`aspnet-core/Pages/Tareas.cshtml`](implementaciones/aspnet-core/Pages/Tareas.cshtml)

```html
<form method="post">
  <input name="titulo" value="">
  <button type="submit">Crear</button>
</form>
```

**No hay testigo en la plantilla.** Ni una directiva, ni una llamada. El
*tag helper* de formulario de Razor lo inyecta, y todo POST a una página se
valida por omisión — es el único de los cuatro donde el rechazo del segundo
caso ocurre sin que ninguna línea de la aplicación lo pida.

En [`aspnet-core/Pages/Tareas.cshtml.cs`](implementaciones/aspnet-core/Pages/Tareas.cshtml.cs):

```csharp
        return RedirectToPage();
```

Y en [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs), la
aplicación entera:

```csharp
constructor.Services.AddRazorPages();

var app = constructor.Build();
app.MapRazorPages();
```

> ⚠️ **«Por omisión» depende de una activación.** Este código llegó a `main`
> con todo lo anterior correcto y falló en el barrido nocturno: el POST se
> rechazaba siempre con `400`. Faltaba un archivo de una línea:
>
> ```csharp
> @addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers
> ```
>
> Sin él, `<form method="post">` es HTML plano —el ayudante no se aplica— y el
> campo oculto no se renderiza. La página se ve bien, la validación sigue
> activa, y el formulario no funciona nunca.
>
> Las plantillas de proyecto de ASP.NET Core traen ese `_ViewImports.cshtml`
> puesto, así que nadie lo ve. Aquí, sin generador, salió a la superficie — el
> mismo fenómeno que Laravel en la clase 011. **Lo que un framework hace «de
> serie» suele ser lo que su generador escribió por ti**, y solo se distingue
> lo uno de lo otro cuando algo falta.

## 📊 Comparación

| Framework | El testigo en la plantilla | La validación | Redirigir tras el alta |
| --- | --- | --- | --- |
| Django | `{% csrf_token %}` explícito | middleware que activas | `redirect()` tuyo |
| Laravel | `@csrf` explícito | del grupo `web`, puesta | `redirect()` tuyo |
| Rails | del ayudante (o explícito) | `protect_from_forgery` | `redirect_to` tuyo, `303` |
| ASP.NET Core | **del tag helper, solo** | **por omisión, sin pedirla** | `RedirectToPage()` tuyo |

La gradación va de «cada pieza se declara» (Django) a «todo viene puesto»
(ASP.NET). Ninguno de los cuatro redirige por ti: el *POST/Redirect/GET* es
en todos una decisión del código de la aplicación — el framework te da las
piezas de seguridad, pero el patrón de navegación sigue siendo tuyo.

## 📖 Por qué esto importa en 2026

Esta clase parece retro y es la línea base de la parte 6: **todo lo que
viene después se mide contra esto.** Un formulario servido así funciona con
JavaScript deshabilitado, en un lector de pantalla, con la red intermitente
y en el navegador de hace cinco años — porque quien hace el trabajo es el
navegador, no tu código. La clase 081 añadirá JavaScript **encima** de este
formulario sin romperlo; las siguientes moverán cada vez más trabajo al
cliente, y cada movimiento tendrá un precio que esta línea base hace
visible [@gross-hypermedia-systems].

## ⚠️ Errores frecuentes

- **Responder la página directamente al POST.** Funciona… hasta que alguien
  recarga. El tercer caso del contrato existe por esto.
- **Redirigir con `302` un POST y confiar en el navegador.** Los navegadores
  lo tratan como `303` por compatibilidad, pero el explícito es `303: See
  Other` — es su caso de uso literal [@rfc9110].
- **Apagar el CSRF «porque es un formulario interno».** El grupo `web` de
  Laravel y el middleware de Django existen para no tener que acordarse.
- **Validar solo con JavaScript.** Sin `required` ni validación del
  servidor, deshabilitar JavaScript salta la validación entera. El navegador
  valida (`required`, `type=email`) y el servidor decide.
- **Perder lo escrito al fallar la validación.** Volver a pintar el
  formulario **con los valores enviados** es la mitad del trabajo de un
  formulario de servidor bien hecho.
- **Un `<div onclick>` como botón de envío.** El botón de verdad
  (`type="submit"`) responde a Enter, al teclado y al lector de pantalla sin
  código.

## ✅ Verificación

```bash
node scripts/run-class.mjs 080
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta
las implementaciones que encuentre y declara las que omitió.

## 🧪 Reto de transferencia

Añade la validación con recuperación: un título vacío devuelve la página con
`422`, un mensaje de error **y el resto de los campos conservados**. Añade
los dos casos al contrato — el `422` y que el valor enviado reaparece en el
`value` del campo — y observa qué framework te da el repintado con errores
hecho (los formularios de Django, `old()` en Laravel, el `ModelState` de
Razor) y en cuál lo escribes tú.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 072 — CSRF](../../parte-5-identidad-y-seguridad/072-csrf/README.md) — el testigo, explicado
- [Clase 081 — Mejora progresiva](../081-mejora-progresiva/README.md) — JavaScript encima, sin romper esto

## Fuentes

- [@whatwg-html] *HTML Standard* (§ Forms). WHATWG — <https://html.spec.whatwg.org/>
- [@rfc9110] *RFC 9110 — HTTP Semantics* (§15.4.4 303 See Other). IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9110>
- [@gross-hypermedia-systems] Gross, C.; Stepinski, A.; Akşimşek, D. *Hypermedia Systems*. Big Sky Software, 2024. ISBN 9798990991804 — <https://openlibrary.org/isbn/9798990991804>
- [@mdn-progressive-enhancement] *Progressive Enhancement*. MDN Web Docs — <https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement>
