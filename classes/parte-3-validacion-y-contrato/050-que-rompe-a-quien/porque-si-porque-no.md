# Por qué sí y por qué no — Qué rompe a quién

> [⬅️ Clase 050](README.md) · [📚 Parte 3](../README.md)

Esta clase no compara frameworks: los cuatro se comportan igual porque el
problema no es de framework. Lo que cambia es **cuánto te ayudan a detectar el
cambio antes de publicarlo**.

| Framework | Qué aporta a la detección | Qué no |
| --- | --- | --- |
| [FastAPI](../../../atlas/fichas/fastapi.md) | El documento se deriva del modelo: dos versiones se pueden comparar | No avisa: comparar es cosa tuya |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | Igual, con springdoc | Igual |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | Igual, con el generador de la plataforma | Igual |
| [Express](../../../atlas/fichas/express.md) | Nada: el documento se escribe a mano | Puede divergir además de romper |

## 🧭 Lo que sí se puede automatizar

**Comparar el documento de OpenAPI de dos versiones.** Existen herramientas que
lo hacen y clasifican los cambios exactamente con las seis categorías de esta
clase.

Eso convierte «espero que esto no rompa nada» en una comprobación de la
integración continua: el cambio incompatible **falla la compilación** y quien lo
introduce se entera antes de publicarlo, no después.

Es viable solo si el documento se deriva del código —las tres primeras filas—.
Con el documento escrito a mano no sirve: compararías dos ficciones.

## ⚠️ La categoría que ninguna herramienta detecta

**El cambio de significado sin cambio de forma.**

Que `estado` pase de contar días naturales a días laborables. Que `total` pase de
incluir impuestos a no incluirlos. Que `activo` pase a significar «no
cancelado».

El esquema es idéntico. El documento no cambia. Ninguna herramienta dice nada. Y
**todos los clientes están mal desde ese despliegue**, calculando con datos que
significan otra cosa.

Es el argumento de fondo de que el contrato no es solo el esquema: **el
comportamiento también es contrato**, y esa parte solo la protege la
documentación escrita, las pruebas de la clase 049 y la conversación con quien
consume la API [@geewax-api-design-patterns].

## Fuentes

- [@geewax-api-design-patterns] Geewax, JJ. *API Design Patterns*. Manning, 2021. ISBN 9781617295850 — <https://openlibrary.org/isbn/9781617295850>
