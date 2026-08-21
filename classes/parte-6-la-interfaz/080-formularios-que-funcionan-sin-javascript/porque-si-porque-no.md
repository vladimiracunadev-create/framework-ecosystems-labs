# Por qué sí y por qué no — Formularios que funcionan sin JavaScript

> [⬅️ Clase 080](README.md) · [📚 Parte 6](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Django](../../../atlas/fichas/django.md) | Cada pieza se declara y se ve: `csrf_token`, middleware, `redirect()`. Ideal para APRENDER el ciclo | Lo explícito se vuelve repetitivo en el formulario número veinte | Los formularios de Django (la capa `forms`) existen para eso, y son otra curva |
| [Laravel](../../../atlas/fichas/laravel.md) | La frontera `web`/`api` hace visible una decisión de arquitectura que otros esconden | La magia del grupo `web` (sesión, cookies cifradas, testigo) es invisible hasta que algo falla | Saber qué middleware trae cada grupo antes de depurar un 419 |
| [Rails](../../../atlas/fichas/rails.md) | `form_with` genera formulario, testigo y hasta el método correcto; el patrón redirect es idioma de la casa | Tanta convención junta que cuesta ver qué es HTML y qué es Rails | Aprender la convención antes de poder desviarse de ella |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | Razor Pages valida el testigo POR OMISIÓN: el único donde el rechazo no lo pide nadie | El modelo página+handler (`OnGet`/`OnPost`) es propio y no se parece a nada del resto del elenco | Un modelo mental más, exclusivo de .NET |

## 🧭 El hallazgo

Los cuatro comparten el mismo esqueleto —formulario, testigo, validación,
redirección— y se diferencian en **cuánto de ese esqueleto se escribe**. La
gradación es nítida: Django lo declara todo, Laravel y Rails lo traen en sus
convenciones, ASP.NET lo impone por omisión.

Y hay una segunda gradación escondida en qué **no** hace ninguno: los cuatro
te dejan la redirección a ti. El *POST/Redirect/GET* es un patrón de
navegación, no de seguridad, y los frameworks han decidido —los cuatro, por
separado— que la seguridad se impone y la navegación se sugiere. Es un buen
mapa de dónde ponen la frontera entre proteger y opinar.

## ⚖️ Por qué Express y FastAPI no están

El manifiesto los dejó fuera y la razón merece escribirse: los dos **pueden**
servir este formulario, pero componiéndolo todo — motor de plantillas,
sesión, testigo CSRF (que Express perdió con csurf, clase 072) y el
repintado con errores. El resultado sería el ejercicio de la clase 072
repetido, no una clase sobre formularios.

El elenco de esta clase es el de los frameworks donde el formulario de
servidor es **el camino pavimentado**: los cuatro nacieron sirviendo
formularios y su valor está exactamente aquí. La comparación honesta no es
«quién puede» sino «para quién es el caso central» — y esa es también la
respuesta a cuándo elegirlos.

## Fuentes

- [@gross-hypermedia-systems] Gross, C.; Stepinski, A.; Akşimşek, D. *Hypermedia Systems*. Big Sky Software, 2024. ISBN 9798990991804 — <https://openlibrary.org/isbn/9798990991804>
- [@whatwg-html] *HTML Standard* (§ Forms). WHATWG — <https://html.spec.whatwg.org/>
