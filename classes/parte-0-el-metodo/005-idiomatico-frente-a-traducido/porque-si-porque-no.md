# Por qué sí y por qué no — Idiomático frente a traducido

> [⬅️ Clase 005](README.md) · [📚 Parte 0](../README.md)

La pregunta de esta tabla no es cuál valida mejor, sino **cuánto se pierde al
traducir hacia cada uno** — que es otra cosa, y depende de cuánto regalaba.

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | La regla está a la vista, en una función que se lee entera | Nadie la aplica por ti: hay que llamarla en cada ruta | Que el olvido no da ningún síntoma hasta que llega el dato raro |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Validación, conversión y documentación por declarar un tipo | Todo eso se apaga junto al escribir `Request` en la firma | Tres funcionalidades perdidas por una sola decisión que parece de estilo |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | `@NotBlank` es un estándar, no del framework: viaja entre proyectos | Sin `@Valid`, las anotaciones se leen bien y no se ejecutan | Que un `Map<String, Object>` deja al compilador sin nada que vigilar |
| [Ruby on Rails](../../../atlas/fichas/rails.md) | `presence: true` ya considera vacío un texto de solo espacios | Depende de convenciones que hay que conocer para no saltárselas | Leer el cuerpo crudo esquiva además los parámetros fuertes |

## 🧭 Lo que este contrato no puede probar

- **Que la versión idiomática sea la mejor escrita.** Es la que usa las piezas
  del framework. Puede haber razones para no usarlas —una regla que el
  framework no expresa, una migración a medias— y esa decisión es legítima
  **cuando se toma**, no cuando se hereda de otro ecosistema sin darse cuenta.
- **Que la traducción sea siempre peor.** Aquí lo es porque pierde
  comportamiento. Una traducción que no pierda nada es simplemente código con
  otro estilo, y el estilo se discute aparte.
- **Cuánto cuesta descubrirlo.** El contrato tarda un segundo en encontrar el
  fallo porque alguien escribió el caso de los cinco espacios. En un proyecto sin
  ese caso, el mismo fallo tarda meses y llega por una incidencia.

## 💡 Lo que hay que llevarse

Un framework es un trato: le cedes control y te devuelve comportamiento. La
traducción rompe el trato por un lado solo — **sigues pagando el framework y
dejas de cobrar lo que te daba**.

Por eso el síntoma no es que algo falle, sino que **algo deja de ocurrir**. Y las
ausencias no se ven revisando código: se ven preguntando «¿qué pieza del
framework debería aparecer aquí y no aparece?».

Ousterhout lo llama por su nombre: la complejidad no llega de golpe, llega en
incrementos que cada uno por separado parecía razonable
[@ousterhout-philosophy]. Una ruta traducida es exactamente eso — un incremento
razonable, escrito por alguien competente, que deja el sistema un poco peor de lo
que estaba.

La defensa práctica cabe en una pregunta, y sirve en cualquier ecosistema:
**¿qué está haciendo aquí el framework?** Si la respuesta es «nada», o estás ante
una decisión deliberada, o ante una traducción.

## Fuentes

- [@ousterhout-philosophy] Ousterhout, John. *A Philosophy of Software Design*, 2.ª ed. Yaknyam Press, 2021. ISBN 9781732102217 — <https://openlibrary.org/isbn/9781732102217>
- [@fastapi-features] *FastAPI Features*. FastAPI — <https://fastapi.tiangolo.com/features/>
- [@rails-doctrine] Hansson, David Heinemeier. *The Rails Doctrine*. Ruby on Rails — <https://rubyonrails.org/doctrine>
- [@walls-spring-in-action] Walls, Craig. *Spring in Action*, 6.ª ed. Manning Publications, 2022. ISBN 9781617297571 — <https://openlibrary.org/isbn/9781617297571>
