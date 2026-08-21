# Por qué sí y por qué no — Autorización por recurso

> [⬅️ Clase 071](README.md) · [📚 Parte 5](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | Nada que desaprender: la regla en la consulta es el único mecanismo que hay | Nada te avisa si un handler consulta sin el propietario | Disciplina de equipo como única barandilla |
| [FastAPI](../../../atlas/fichas/fastapi.md) | `Depends` puede entregar directamente «las tareas de este usuario» como dependencia | Mismo silencio: el framework no distingue una consulta filtrada de una que no | Lo mismo, con mejor sintaxis |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | `@PostAuthorize` y las consultas derivadas (`findByIdAndPropietaria`) dan forma idiomática al patrón | `@PostAuthorize` comprueba DESPUÉS de cargar: para listas no escala y el dato ya salió del almacén | Saber cuál de los dos mecanismos toca en cada caso |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | `IAuthorizationHandler` con requisitos por recurso: el patrón tiene nombre y sitio oficial | La ceremonia es notable para lo que hace, y también corre tras la carga | Más piezas que la consulta filtrada, para el mismo resultado |

## 🧭 El hallazgo

En la 070, los frameworks grandes traían el mecanismo y los pequeños no.
Aquí **nadie lo trae** — y no por descuido: la autorización por recurso
depende del **dato**, y el dato es tuyo, no del framework. `hasRole` se
puede escribir en una configuración porque el rol es finito y estático; «es
tuyo» no, porque cambia con cada fila.

Por eso el patrón de esta clase no es un middleware sino una **forma de
consulta**. Y por eso los mecanismos declarativos que existen
(`@PostAuthorize`, `IAuthorizationHandler`) comparten la limitación de
comprobar después de cargar: son azúcar sobre el `if`, no sobre el `WHERE`.

## ⚖️ 404 o 403

El contrato exige `404` para lo ajeno y la decisión merece su párrafo:

- **`403`** es honesto («existe y no puedes») y filtra existencia. Para
  recursos **compartidos con identificadores públicos** —un repositorio
  privado cuyo dueño te menciona— puede ser lo correcto.
- **`404`** miente piadosamente y no filtra nada. Para recursos **privados
  con identificadores enumerables** —facturas, pedidos, historiales— es lo
  único defendible: la diferencia entre `403` y `404` es un oráculo de qué
  números de factura existen [@owasp-cheatsheets].

GitHub responde `404` a los repositorios privados ajenos exactamente por
esto. La regla práctica: si el atacante puede iterar identificadores, `404`.

## Fuentes

- [@owasp-top10] *OWASP Top 10* (A01: Broken Access Control). OWASP — <https://owasp.org/www-project-top-ten/>
- [@owasp-cheatsheets] *OWASP Cheat Sheet Series* (IDOR Prevention). OWASP — <https://cheatsheetseries.owasp.org/>
