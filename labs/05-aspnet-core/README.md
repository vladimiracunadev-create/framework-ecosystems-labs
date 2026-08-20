# Laboratorio 05 — ASP.NET Core

API mínima sobre .NET: poco ceremonial, con enlace de modelo automático y
serialización en `camelCase` por omisión.

```bash
node scripts/run-acceptance.mjs aspnet --prepare
```

Requiere .NET 10.

## El mismo compromiso que en la JVM

El enlace automático de modelo analizaría el cuerpo antes de que el manejador
mirase la clave de idempotencia. Como el contrato fija ese orden, aquí también se
lee el cuerpo a mano, de forma acotada y asíncrona.

El buffer tiene **un carácter más** que el límite: si se llena por completo, el
cuerpo lo superaba. Comprobarlo con `EndOfStream` sería una lectura síncrona, y
ASP.NET Core las prohíbe por omisión precisamente para no bloquear el hilo de la
petición. Es el tipo de detalle que solo aparece al implementar el contrato de
verdad, no al leer un tutorial.

## Lo que el framework da sin coste

| Necesidad del contrato | Coste en ASP.NET Core |
| --- | --- |
| `camelCase` en el JSON de salida | Ninguno: es el valor por omisión de las API mínimas |
| `Location` en el `201` | `Results.Created(ruta, cuerpo)` |
| `application/problem+json` | `Results.Json(..., contentType:)` |
| Ruta desconocida | `app.MapFallback` |
| `405` con `Allow` | A mano: `MapMethods` por ruta y cabecera explícita |

## Concurrencia visible

La colección se recorre bajo cerrojo para tomar una instantánea. Recorrerla
mientras otra petición la amplía produce una excepción intermitente que **solo
aparece con concurrencia**: exactamente el fallo que pasa todas las pruebas
locales y se manifiesta la primera semana en producción.
