# Por qué sí y por qué no — Filtrado y ordenación

> [⬅️ Clase 046](README.md) · [📚 Parte 3](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | `Comparator` tipado: el campo del cliente **elige** un comparador, no lo construye | Verboso cuando hay muchos campos | Un comparador por campo ordenable |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | Igual, con selectores tipados y LINQ | Igual | Igual |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Acceso directo a la cadena de consulta, muy legible | Sin tipos que impidan usar el texto del cliente | Disciplina en cada ruta |
| [Express](../../../atlas/fichas/express.md) | Control total | Igual, y el índice dinámico `a[campo]` **parece correcto** | La forma natural es la insegura |

## 🧭 La diferencia que importa

En Spring y en ASP.NET, el texto del cliente **no puede llegar a la consulta**:
solo selecciona entre comparadores que tú escribiste. El sistema de tipos hace
incómodo lo inseguro.

En Express y en FastAPI, `a[campo]` es una línea que funciona y parece razonable.
Ahí la lista blanca no es una precaución añadida: **es la única defensa**.

Eso no hace mejores a los dos primeros — hace que en los dos segundos la
comprobación tenga que estar escrita y probada, porque el lenguaje no la impone.
Y el contrato de esta clase existe para eso: el caso `?orden=id` falla si alguien
quita la lista blanca en un refactor.

## 🔒 Y el que no está en la tabla

**El ORM.** Muchos permiten `orderBy(campoDelCliente)` o construir filtros desde
un objeto que viene del cliente. Funciona, es cómodo, y traslada exactamente el
mismo problema una capa más abajo — con el agravante de que ahí ya no se ve.

La regla no cambia: **el nombre del campo lo eliges tú de una lista cerrada; el
cliente solo dice cuál de esos quiere**. Hoffman lo formula como la distinción
entre datos y código: en cuanto el dato del usuario decide *qué se ejecuta* en
lugar de *sobre qué se ejecuta*, hay una inyección esperando
[@hoffman-web-application-security].

## Fuentes

- [@hoffman-web-application-security] Hoffman, Andrew. *Web Application Security*. O'Reilly Media, 2020. ISBN 9781492053118 — <https://openlibrary.org/isbn/9781492053118>
