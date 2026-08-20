# Por qué sí y por qué no — Levantar un servidor y responder

> [⬅️ Clase 011](README.md) · [📚 Parte 1](../README.md)

Esta página no reparte medallas. Para **este problema concreto** —un proceso que
escucha y responde texto— dice dónde cada framework es la elección natural, dónde
es una elección forzada, y qué se paga en cada caso.

Una advertencia que vale para todas las clases: **un framework que aquí queda mal
puede ser el correcto tres clases más adelante**. Levantar un «hola» favorece a
los pequeños por construcción. Es exactamente el error de razonamiento que el
[módulo 11](../../../curriculum/11-seleccion-y-sostenibilidad.md) enseña a evitar:
elegir con la evidencia del primer día para un proyecto que dura años.

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | La menor distancia entre la idea y el código. Ecosistema enorme | No trae nada más: validación, datos y autenticación los eliges tú | Cada proyecto acaba con una combinación distinta, y quien llega nuevo aprende esa combinación, no un framework |
| [Fastify](../../../atlas/fichas/fastify.md) | Lo mismo que Express con mejor rendimiento y esquemas de serie | Comunidad menor; algunas piezas de terceros solo existen para Express | Menos respuestas escritas cuando algo se atasca |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Tipos, validación y documentación de una sola declaración | Necesita servidor externo y comprensión del modelo asíncrono | Una pieza más en el despliegue, y trampas si mezclas código bloqueante |
| [Flask](../../../atlas/fichas/flask.md) | Mínimo y legible; excelente para aprender el modelo de petición | Sin ORM, migraciones ni autenticación | El montaje se repite en cada proyecto |
| [Django](../../../atlas/fichas/django.md) | Trae producto completo: ORM, administración, autenticación, seguridad | Exige configuración antes de la primera línea útil | Aprender su forma de hacer las cosas; salirse de ella cuesta |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | Autoconfiguración, ecosistema industrial y soporte a muy largo plazo | Arranque más lento y una capa de magia que hay que saber desactivar | Cuando la autoconfiguración se equivoca, depurar exige entender el mecanismo entero |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | API mínimas muy directas con una plataforma completa detrás | Ecosistema ligado a un proveedor, aunque el código sea abierto | Menor presencia fuera del mundo empresarial |
| [Laravel](../../../atlas/fichas/laravel.md) | Producto completo con la mejor experiencia de desarrollo de PHP | Asume su instalador: fuera de él afloran supuestos, como se vio en la clase | Sesión, caché y directorios hay que declararlos aunque no los uses |
| [Rails](../../../atlas/fichas/rails.md) | La convención elimina discusiones y acelera muchísimo al equipo que la conoce | Si no la conoces, el código no se lee: dice qué pasa, no dónde | Formación previa antes de ser productivo |
| [Gin](../../../atlas/fichas/gin.md) | Muy pequeño porque el lenguaje ya trae servidor HTTP | Casi todo lo demás lo montas tú | Más código propio, y menos convenciones compartidas entre proyectos |

## 🧭 Cómo se decide de verdad

Ninguna fila de arriba decide nada por sí sola. La decisión real se toma con tres
preguntas que esta clase todavía no puede responder:

1. **¿Qué más va a hacer este servicio?** Si necesita usuarios, permisos y panel
   de administración, la ventaja de Express desaparece en la clase 066.
2. **¿Quién lo va a mantener?** Un equipo que ya sabe Rails va más rápido con
   Rails aunque otro framework puntúe mejor sobre el papel.
3. **¿Cuánto va a durar?** A cinco años pesa más el soporte del ecosistema que la
   comodidad del primer día. Es el criterio de sostenibilidad del
   [módulo 11](../../../curriculum/11-seleccion-y-sostenibilidad.md), y Ford y
   sus coautores lo formulan como la capacidad de una arquitectura para cambiar
   sin romperse [@ford-evolutionary-architectures].

## Fuentes

- [@ford-evolutionary-architectures] Ford, Neal; Parsons, Rebecca; Kua, Patrick. *Building Evolutionary Architectures*. O'Reilly Media, 2017. ISBN 9781491986363 — <https://openlibrary.org/isbn/9781491986363>
