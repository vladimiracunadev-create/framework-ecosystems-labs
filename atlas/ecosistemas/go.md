# 🐹 Go

> [⬅️ Atlas](../README.md) · [🗂️ Índice](../frameworks.md) · [🧭 Taxonomía](../../docs/TAXONOMY.md)

El ecosistema donde la pregunta **«¿de verdad necesito un framework?»** tiene con
más frecuencia la respuesta «no». Su biblioteca estándar incluye un servidor HTTP
listo para producción, y eso cambia toda la conversación.

## Por qué este ecosistema es como es

| Condición del lenguaje | Consecuencia en sus frameworks |
| --- | --- |
| `net/http` en la **biblioteca estándar**, apto para producción | El framework compite contra «no usar framework», no contra otro framework |
| Interfaces **pequeñas y satisfechas implícitamente** | El middleware de un proyecto funciona en otro sin adaptador |
| Compila a **un binario estático** sin runtime que instalar | El despliegue es copiar un archivo; menos superficie que gestionar |
| Cultura explícita **contra la magia** y la reflexión | Casi no hay inyección de dependencias por contenedor; se pasan las cosas a mano |
| Errores como **valores devueltos**, no excepciones | El manejo de errores es visible en cada línea, no en un traductor central |

## Qué diferencia realmente a los candidatos

Como la base es común, las diferencias son más pequeñas de lo que sugieren las
comparativas:

| | Aporta sobre la biblioteca estándar |
| --- | --- |
| **chi** | Enrutado con parámetros, compatible con las interfaces estándar. Lo más cercano a no usar nada |
| **Gin** | Enrutado rápido, middleware, enlace de datos y validación |
| **Echo** | Lo mismo con una API algo más explícita y más utilidades incluidas |
| **Fiber** | Imita la API de Express para acortar la curva de quien llega de Node.js |
| **Beego** | Framework completo con ORM, caché y tareas: el más atípico del ecosistema |

La elección aquí rara vez es de arquitectura: es de cuánto azúcar quieres sobre
una base que ya funciona. Eso hace de Go un buen laboratorio para el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md), porque obliga a
puntuar dimensiones distintas de «qué trae en la caja».

## El detalle de Fiber que conviene mirar

Fiber copia deliberadamente la API de Express. Es una decisión de adopción
inteligente y también un aviso: **una API familiar no implica un modelo de
ejecución familiar**. Las garantías de concurrencia, el manejo de errores y el
ciclo de vida son los de Go, no los de Node.js. Confundir familiaridad de
sintaxis con familiaridad de semántica es un error caro y frecuente.

## Las 7 tecnologías

<!-- generado:tabla-ecosistema go -->
| Tecnología | Clasificación | Desde | Era | Estado | Licencia | Documentación |
| --- | --- | ---: | --- | --- | --- | --- |
| [**Beego**](../fichas/beego.md) | `full-stack-framework` | 2012 | 🏛️ Clásico | 🟢 activo | `Apache-2.0` | [oficial](https://beego.me/docs/intro/) |
| [**chi**](../fichas/chi.md) | `routing-library` | 2015 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://go-chi.io/) |
| [**Echo**](../fichas/echo.md) | `web-framework` | 2015 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://echo.labstack.com/docs) |
| [**esbuild**](../fichas/esbuild.md) | `build-tool` | 2020 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://esbuild.github.io/) |
| [**Fiber**](../fichas/fiber.md) | `web-framework` | 2020 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://docs.gofiber.io/) |
| [**Gin**](../fichas/gin.md) | `web-framework` | 2014 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://gin-gonic.com/en/docs/) |
| [**Hugo**](../fichas/hugo.md) | `static-site-generator` | 2013 | 🟢 Vigente | 🟢 activo | `Apache-2.0` | [oficial](https://gohugo.io/documentation/) |
<!-- fin -->

## Qué aportó cada una

<!-- generado:notas-ecosistema go -->
- **Beego** — Framework completo de Go con ORM, caché y tareas programadas, en un ecosistema que suele preferir bibliotecas pequeñas.
- **chi** — Enrutador compatible con las interfaces de la biblioteca estándar. Demuestra que en Go se puede llegar lejos sin adoptar un framework.
- **Echo** — Alternativa a Gin con enlace y validación de datos incluidos y una API algo más explícita.
- **esbuild** — Demostró que el cuello de botella de las herramientas de JavaScript no era el problema, sino el lenguaje en que estaban escritas.
- **Fiber** — Imita deliberadamente la API de Express para acortar la curva de quien llega desde Node.js.
- **Gin** — El framework HTTP más usado de Go: enrutado rápido y middleware, sobre la biblioteca estándar.
- **Hugo** — Generación estática de miles de páginas en segundos. Demuestra que el lenguaje de la herramienta importa más que el del contenido.
<!-- fin -->

## Para seguir

- [Módulo 01](../../curriculum/01-http-eventos-y-contratos.md) — la referencia sin framework del programa hace en Node.js lo que en Go es la opción natural.
