# Por qué sí y por qué no — Plantillas en el servidor

> [⬅️ Clase 079](README.md) · [📚 Parte 6](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Django](../../../atlas/fichas/django.md) | Autoescapado del motor, encendido y difícil de apagar por descuido; el lenguaje de plantilla es deliberadamente limitado | Esa limitación duele cuando hace falta lógica: hay que escribir una etiqueta propia | Salir del lenguaje de plantillas para lo que otros hacen en línea |
| [Flask](../../../atlas/fichas/flask.md) | Jinja2 es potente y familiar; `render_template` trae la política de escapado puesta | **Jinja suelto no escapa**: fuera de `.html`, o usando Jinja directamente, la protección no está | Saber que la defensa la pone Flask y no la biblioteca |
| [Laravel](../../../atlas/fichas/laravel.md) | Blade compila a PHP y cachea: expresividad de PHP sin pagar interpretación por petición | Compilar significa una capa más entre lo que escribes y lo que falla: los errores apuntan al PHP generado | Depurar a veces sobre el fichero compilado |
| [Rails](../../../atlas/fichas/rails.md) | El escapado vive en el TIPO (`SafeBuffer`): viaja con el dato aunque cruce ayudantes y parciales | `html_safe` es un nombre que miente, y aparece en respuestas de foro como solución a «no se ve el HTML» | Vigilar `html_safe` y `raw` como palabras clave en revisión |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | La plantilla es **HTML válido**: se abre en el navegador y se ve la maqueta, útil cuando diseño y desarrollo son equipos distintos | Más ceremonia y más verboso; los atributos `th:` compiten con el marcado | Plantillas más largas a cambio de que sean previsualizables |
| [Express](../../../atlas/fichas/express.md) | Motor a elección: EJS, Pug, Handlebars… el mismo enchufe para todos | **Nada viene puesto**, ni el motor ni su política de escapado: eliges tú y respondes tú | Una decisión más, y la responsabilidad de conocer las omisiones del motor elegido |

## 🧭 El hallazgo

Cinco de los seis traen motor; Express trae el **enchufe**. Y en los cinco
que lo traen, **el escapado por omisión está puesto** — con una excepción
instructiva: en Flask la política es del framework, no de Jinja, así que
usar Jinja fuera de Flask deja la protección atrás.

Es la misma convergencia que en la 073, con veinte años más de historia
detrás: la generación anterior de plantillas de servidor —PHP crudo, JSP con
scriptlets— insertaba sin escapar por omisión y hacía del escapado el gesto
extra. Todo lo que se ganó fue **invertir esa omisión**, y por eso hoy el
XSS de servidor entra casi siempre por la puerta cruda usada mal.

## ⚖️ Dónde vive el escapado, y por qué importa

Los seis escapan, pero **en sitios distintos**, y el sitio decide qué se
puede olvidar:

- **En el motor** (Django, Thymeleaf, Blade, EJS): la plantilla escapa lo
  que interpola. Un dato que no pase por la plantilla —una respuesta JSON
  construida a mano, una cabecera— no está cubierto.
- **En el framework** (Flask sobre Jinja): la misma cobertura, más la
  posibilidad de perderla al salirse del framework.
- **En el tipo** (Rails): la cadena lleva su condición encima. Cruza
  ayudantes, parciales y concatenaciones sin perderla — la cobertura más
  amplia del elenco, y la razón de que `html_safe` sea tan peligroso:
  desactiva algo que iba a seguir protegiendo más allá de esta plantilla.

Ninguno de los tres sitios cubre los contextos que no son contenido —URL,
atributos construidos a mano, JavaScript en línea—, y ahí sigue haciendo
falta criterio [@owasp-cheatsheets].

## Fuentes

- [@owasp-cheatsheets] *OWASP Cheat Sheet Series* (XSS Prevention). OWASP — <https://cheatsheetseries.owasp.org/>
- [@fowler-poeaa] Fowler, Martin. *Patterns of Enterprise Application Architecture* (Template View). Addison-Wesley, 2002. ISBN 9780321127426 — <https://openlibrary.org/isbn/9780321127426>
