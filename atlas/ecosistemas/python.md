# 🐍 Python

> [⬅️ Atlas](../README.md) · [🗂️ Índice](../frameworks.md) · [🧭 Taxonomía](../../docs/TAXONOMY.md)

El ecosistema donde mejor se ve el **eje completo entre «baterías incluidas» y
«monta tú la pila»**, con los dos extremos vivos, mantenidos y con comunidades
grandes. Django y Flask llevan quince años siendo la mejor pareja de comparación
que existe para enseñar ese compromiso.

## Por qué este ecosistema es como es

| Condición del lenguaje | Consecuencia en sus frameworks |
| --- | --- |
| **Legibilidad como valor cultural** explícito | Las API tienden a ser explícitas; la magia se mira con desconfianza |
| El **tipado gradual** llegó tarde (2015) y es opcional | FastAPI convirtió esa anotación opcional en infraestructura de validación |
| La sintaxis **asíncrona** llegó en 2015, después de los frameworks clásicos | Hay una frontera clara: Django y Flask nacieron síncronos; FastAPI y Litestar, no |
| Fuerte presencia en **ciencia de datos y automatización** | Muchos servicios Python son fachadas HTTP sobre trabajo que no es web |

## La línea del tiempo

**2005 · Django.** Nació en la redacción de un periódico, y se nota: contenidos,
roles, publicación. Trajo ORM, migraciones, formularios, autenticación y **un
panel de administración generado a partir del modelo**. Ese panel sigue siendo,
veinte años después, un argumento decisivo para productos internos: ningún otro
ecosistema tiene un equivalente tan directo.

**2009-2010 · La reacción minimalista.** **Flask** apareció como una broma del día
de los inocentes y se convirtió en el contrapunto exacto de Django dentro del
mismo lenguaje: elige tú el ORM, la validación y la estructura. **Tornado** ya
había traído la entrada/salida no bloqueante antes de que el lenguaje tuviera
sintaxis para ello.

**2018 · FastAPI y el tipo como contrato.** La anotación de tipo de Python era
decorativa: no se comprobaba en ejecución. FastAPI la convirtió en la fuente de
la validación, la serialización **y la documentación OpenAPI**. Es el mejor
ejemplo del ecosistema de cómo una característica opcional del lenguaje puede
volverse infraestructura si alguien construye encima.

Su factura está documentada en el
[laboratorio 03](../../labs/03-fastapi/README.md): el framework valida por ti,
pero su vocabulario de errores no es el de tu contrato, y esa traducción es
trabajo propio que no desaparece.

## Distinción que conviene tener clara

- **Starlette** es el conjunto de herramientas asíncronas; **FastAPI** es el
  framework construido encima. Distinguirlos es un buen ejercicio de taxonomía:
  uno aporta el transporte, el otro la validación derivada de tipos.
- **SQLAlchemy** no es Django ORM. Separa explícitamente el constructor de
  consultas del mapeador, lo que permite bajar de nivel sin abandonarlo — el
  compromiso que el [módulo 06](../../curriculum/06-persistencia-y-dominio.md)
  analiza entre registro activo y mapeador de datos.

## Las 12 tecnologías

<!-- generado:tabla-ecosistema python -->
| Tecnología | Clasificación | Desde | Era | Estado | Licencia | Documentación |
| --- | --- | ---: | --- | --- | --- | --- |
| [**Tornado**](../fichas/tornado.md) | `web-framework` | 2009 | 🌱 Pionero | 🟡 mantenimiento | `Apache-2.0` | [oficial](https://www.tornadoweb.org/en/stable/) |
| [**Bottle**](../fichas/bottle.md) | `web-framework` | 2009 | 🏛️ Clásico | 🟡 mantenimiento | `MIT` | [oficial](https://bottlepy.org/docs/dev/) |
| [**Django**](../fichas/django.md) | `web-framework` | 2005 | 🏛️ Clásico | 🟢 activo | `BSD-3-Clause` | [oficial](https://docs.djangoproject.com/) |
| [**Flask**](../fichas/flask.md) | `web-framework` | 2010 | 🏛️ Clásico | 🟢 activo | `BSD-3-Clause` | [oficial](https://flask.palletsprojects.com/) |
| [**Kivy**](../fichas/kivy.md) | `ui-framework` | 2011 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://kivy.org/doc/stable/) |
| [**Pyramid**](../fichas/pyramid.md) | `web-framework` | 2010 | 🏛️ Clásico | 🟢 activo | `NOASSERTION` | [oficial](https://docs.pylonsproject.org/projects/pyramid/en/latest/) |
| [**Sanic**](../fichas/sanic.md) | `web-framework` | 2016 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://sanic.dev/en/guide/) |
| [**SQLAlchemy**](../fichas/sqlalchemy.md) | `orm` | 2006 | 🏛️ Clásico | 🟢 activo | `MIT` | [oficial](https://docs.sqlalchemy.org/) |
| [**aiohttp**](../fichas/aiohttp.md) | `http-toolkit` | 2014 | 🟢 Vigente | 🟢 activo | `Apache-2.0` | [oficial](https://docs.aiohttp.org/en/stable/) |
| [**FastAPI**](../fichas/fastapi.md) | `web-framework` | 2018 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://fastapi.tiangolo.com/) |
| [**Starlette**](../fichas/starlette.md) | `asgi-toolkit` | 2018 | 🟢 Vigente | 🟢 activo | `BSD-3-Clause` | [oficial](https://www.starlette.io/) |
| [**Litestar**](../fichas/litestar.md) | `web-framework` | 2021 | 🌊 Emergente | 🟢 activo | `MIT` | [oficial](https://docs.litestar.dev/) |
<!-- fin -->

## Qué aportó cada una

<!-- generado:notas-ecosistema python -->
- **Tornado** — Trajo la entrada/salida no bloqueante a Python años antes de que el lenguaje tuviera sintaxis asíncrona propia.
- **Bottle** — Un framework completo en un único archivo sin dependencias. Excelente para leerlo entero y entender qué hace realmente un framework web.
- **Django** — Baterías incluidas: ORM, migraciones, panel de administración, autenticación y formularios. Su panel generado sigue siendo un argumento decisivo para productos internos.
- **Flask** — Microframework que dejó a la persona elegir ORM, validación y estructura. El contrapunto exacto de Django dentro del mismo lenguaje.
- **Kivy** — Interfaces multiplataforma en Python con su propio motor de dibujo.
- **Pyramid** — Escala de microframework a aplicación grande sin reescribir. Su licencia derivada de BSD no corresponde a un identificador SPDX único, lo que ya es una lección del módulo 11.
- **Sanic** — Sintaxis próxima a Flask con ejecución asíncrona, en la transición de Python hacia el modelo no bloqueante.
- **SQLAlchemy** — Separa explícitamente el constructor de consultas del mapeador, de modo que se puede bajar de nivel sin abandonarlo.
- **aiohttp** — Cliente y servidor HTTP asíncronos sobre la biblioteca estándar. Útil para ver el nivel inmediatamente inferior a un framework.
- **FastAPI** — Deriva validación, serialización y documentación OpenAPI de las anotaciones de tipo. Demostró que el tipado opcional de Python podía ser infraestructura, no adorno.
- **Starlette** — La base asíncrona sobre la que se construye FastAPI. Distinguir uno de otro es un buen ejercicio de taxonomía.
- **Litestar** — Alternativa a FastAPI con inyección de dependencias por capas y controladores de clase.
<!-- fin -->

## Para seguir

- [Laboratorio 03](../../labs/03-fastapi/README.md) — FastAPI contra el contrato canónico.
- [Módulo 05](../../curriculum/05-backend-y-api.md) — el contrato antes que la implementación.
