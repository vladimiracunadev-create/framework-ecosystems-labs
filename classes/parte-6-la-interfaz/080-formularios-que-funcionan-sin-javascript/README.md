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

## 🌐 Las implementaciones

El elenco es el de los frameworks que hacen esto **de verdad y de serie** —
por eso están Django, Laravel, Rails y ASP.NET Core y no están Express ni
FastAPI, que pueden pero componiéndolo todo:

- **Django** — `{% csrf_token %}` en la plantilla, `CsrfViewMiddleware`
  validando, y `redirect()` tras el alta. Cada pieza se ve.
- **Laravel** — `@csrf` en Blade, y una decisión de arquitectura visible en
  `bootstrap/app.php`: el grupo de rutas **`web`** trae sesión y
  verificación CSRF; el grupo **`api`** no trae nada de eso. La diferencia
  entre los dos grupos *es* la clase 072.
- **Rails** — `protect_from_forgery` y el testigo en el formulario. Los
  ayudantes (`form_with`) lo pondrían solos; aquí va explícito para que se
  vea qué ponen.
- **ASP.NET Core** — Razor Pages: el *tag helper* de formulario **inyecta**
  el testigo y todo POST a una página **lo valida por omisión**. Es el único
  de los cuatro donde el rechazo del caso 2 ocurre sin que ninguna línea de
  la aplicación lo pida.

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
