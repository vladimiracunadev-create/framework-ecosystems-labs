# Por qué sí y por qué no — Negociación de contenido

> [⬅️ Clase 018](README.md) · [📚 Parte 1](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | `format` negocia, emite `Vary` y da el 406: los tres en una llamada | Poco conocido; casi nadie lo usa | Nada, salvo descubrir que existe |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | `produces` es declarativo y el 406 sale solo | El `Vary` hay que ponerlo a mano | Un método por representación |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Control total del algoritmo de selección | **No negocia nada**: analizar `Accept` es tuyo | Treinta líneas para algo que otros traen |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | Con controladores MVC hay formateadores configurables | En API mínimas, decisión manual | Subir a MVC o escribirlo |

## 🧭 Cuándo importa de verdad

La negociación de contenido tiene mala fama por una razón justa: **la mayoría de
las API sirven un solo formato**, y montar el mecanismo entero para eso es
complejidad sin retorno. Si tu API solo habla JSON, di `content-type:
application/json` y sigue.

Merece la pena cuando:

- **La misma URL sirve a un navegador y a un programa.** HTML para uno, JSON para
  otro, con un identificador único — que es la propuesta original de REST tal
  como Fielding la describe [@fielding-rest-dissertation].
- **Hay versiones del formato.** `application/vnd.tuempresa.v2+json` negocia la
  versión sin ensuciar la URL. La clase 044 lo compara con las alternativas.
- **Hay exportación.** CSV o PDF de un recurso que normalmente es JSON.

Y una advertencia que vale para las cuatro implementaciones: **el momento de
poner `Vary` es cuando escribes la negociación**, no cuando aparece el fallo. El
fallo aparece en producción, es intermitente y depende de quién pidió primero.

## Fuentes

- [@fielding-rest-dissertation] Fielding, Roy T. *Architectural Styles and the Design of Network-based Software Architectures*. Tesis doctoral, University of California, Irvine, 2000 — <https://ics.uci.edu/~fielding/pubs/dissertation/top.htm>
