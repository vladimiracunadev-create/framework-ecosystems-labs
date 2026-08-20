# ⚡ FastAPI — 2018

> [⬅️ Atlas](../README.md) · [🐍 Ecosistema Python](../ecosistemas/python.md) · [🗂️ Índice](../frameworks.md)

FastAPI hizo algo que ningún otro framework del catálogo había conseguido:
**convertir una característica opcional y decorativa del lenguaje en
infraestructura**. Las anotaciones de tipo de Python no se comprobaban en
ejecución; FastAPI las usó como fuente de la validación, la serialización y la
documentación del contrato, las tres a la vez.

> **🎯 Por qué está en este programa**
>
> **Es uno de los cinco laboratorios ejecutables** del contrato canónico, y el
> que mejor muestra la factura de la validación declarativa
> ([laboratorio 03](../../labs/03-fastapi/README.md)): el framework valida por ti,
> y **traducir su vocabulario de errores al de tu contrato sigue siendo trabajo
> tuyo**.
>
> Y porque genera OpenAPI desde el código, lo que obliga a discutir la tesis del
> [módulo 05](../../curriculum/05-backend-y-api.md): ¿el contrato se escribe antes
> o se deriva después?

| | |
|---|---|
| **Aparición** | 2018, creado por Sebastián Ramírez |
| **Clasificación** | `web-framework` |
| **Ecosistema** | Python |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://fastapi.tiangolo.com/> |

---

## 💡 El tipo como contrato

```python
from typing import Annotated
from fastapi import FastAPI
from pydantic import BaseModel, StringConstraints

class CrearTarea(BaseModel):
    # De esta sola línea salen: la validación, el mensaje de error,
    # la deserialización y el esquema OpenAPI de la petición.
    title: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=120)]

app = FastAPI()

@app.post("/tasks", status_code=201)
def crear(entrada: CrearTarea) -> dict:
    return {"id": "t1", "title": entrada.title, "completed": False}
```

Cuatro cosas de una sola declaración [@fastapi-features]:

1. **Validación** en el límite, sin escribirla.
2. **Conversión** de tipos, con errores claros si no encaja.
3. **Documentación OpenAPI** generada, con interfaz interactiva incluida.
4. **Ayuda del editor**, porque el tipo es real y no un comentario.

Es una de las mejores relaciones esfuerzo/resultado del catálogo entero
[@lubanovic-fastapi].

## ⚖️ La factura, medida en el laboratorio

Implementar el contrato canónico del programa reveló tres costes que ningún
tutorial menciona ([laboratorio 03](../../labs/03-fastapi/README.md)):

**1. El vocabulario de errores es del framework, no tuyo.** Pydantic produce
códigos como `missing`, `string_too_short` o `string_type`. El contrato del
programa exige `TITLE_REQUIRED`, `TITLE_EMPTY`, `TITLE_TOO_LONG`. Entre ambos hay
una tabla de traducción que **hay que escribir y mantener**:

| Error de Pydantic | Código del contrato |
| --- | --- |
| `missing` / `string_type` | `TITLE_REQUIRED` |
| `string_too_short` | `TITLE_EMPTY` |
| `string_too_long` | `TITLE_TOO_LONG` |
| `json_invalid` | `400 MALFORMED_JSON` |

Sin esa tabla, una actualización de Pydantic puede cambiar tu contrato público
sin que nadie toque el repositorio. Es el mismo hallazgo que en
[Express](express.md) con los errores del analizador de cuerpo.

**2. El orden lo impone el contrato, no el framework.** El contrato fija que se
comprueba tamaño, tipo de contenido y clave de idempotencia **antes** de analizar
el cuerpo. El enlace automático analizaría primero, así que esas comprobaciones
van en un middleware previo. La regla general del
[módulo 02](../../curriculum/02-arquitectura-de-frameworks.md) reaparece: **el
automatismo es cómodo hasta que el contrato exige otro orden**.

**3. Faltan cosas que hay que añadir.** El `405` sin cabecera `Allow` y el sobre
`application/problem+json` en lugar del formato por omisión hubo que ponerlos a
mano.

## 🧭 Contrato antes o contrato después

FastAPI genera OpenAPI **desde el código**. Es cómodo y plantea una pregunta real
del [módulo 05](../../curriculum/05-backend-y-api.md):

| | Contrato primero | Contrato derivado |
| --- | --- | --- |
| Fuente de verdad | El documento OpenAPI | El código |
| Ventaja | Se acuerda antes de implementar; sirve a varios equipos | Nunca se desincroniza |
| Riesgo | El código puede desviarse del documento | **Un cambio accidental de código cambia el contrato público** |

El riesgo de la segunda columna es el serio: renombrar un campo es un cambio
local que rompe a todos los clientes. La defensa es la del programa: **pruebas de
aceptación derivadas del contrato**, que fallan si la forma cambia.

## 🎓 Las tres lecciones

**1. Una característica opcional del lenguaje puede volverse infraestructura** si
alguien construye encima. Los tipos de Python eran decorativos hasta que dejaron
de serlo.

**2. La validación automática no elimina trabajo: lo desplaza.** De escribir
comprobaciones a mantener una traducción entre dos vocabularios.

**3. Derivar el contrato del código tiene un riesgo específico** —cambios
accidentales— que solo se contiene con pruebas que verifiquen el contrato desde
fuera.

## 🔗 Enlaces

- Documentación oficial: <https://fastapi.tiangolo.com/>
- [Laboratorio 03](../../labs/03-fastapi/README.md) — contra el contrato canónico
- [Ficha de Flask](flask.md) · [Ficha de Django](django.md) · [Módulo 05](../../curriculum/05-backend-y-api.md)

## Fuentes

- [@lubanovic-fastapi] Lubanovic, Bill. *FastAPI: Modern Python Web Development*. O'Reilly Media, 2023. ISBN 9781098135508 — <https://openlibrary.org/isbn/9781098135508>
- [@fastapi-features] *FastAPI Features*, FastAPI — <https://fastapi.tiangolo.com/features/>
