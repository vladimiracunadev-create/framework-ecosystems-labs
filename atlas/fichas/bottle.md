# 🍾 Bottle — 2009

> [⬅️ Atlas](../README.md) · [🐍 Ecosistema Python](../ecosistemas/python.md) · [🗂️ Índice](../frameworks.md)

Bottle es **un framework web completo en un único archivo y sin dependencias**.
Está en el Atlas por una razón didáctica: es el framework que se puede **leer
entero** en una tarde y entender qué hace realmente un framework web.

| | |
|---|---|
| **Aparición** | 2009, creado por Marcel Hellkamp |
| **Clasificación** | `web-framework` — microframework |
| **Ecosistema** | Python |
| **Licencia** | `MIT` |
| **Estado** | 🟡 Mantenimiento |
| **Documentación** | <https://bottlepy.org/docs/dev/> |

---

## 💡 Un archivo, cuatro responsabilidades

```python
from bottle import route, run

@route("/tasks")
def listar():
    return {"items": []}

run(host="127.0.0.1", port=3000)
```

Dentro de ese archivo único están las cuatro piezas que todo framework web tiene
y que el [módulo 02](../../curriculum/02-arquitectura-de-frameworks.md) enseña a
reconocer: **enrutado, plantillas, utilidades de petición y respuesta, y
servidor de desarrollo**.

Leer ese código es el mejor complemento posible a la referencia sin framework del
[módulo 01](../../curriculum/01-http-eventos-y-contratos.md): ahí se ve qué se
escribe a mano; aquí se ve cómo alguien lo empaquetó en una abstracción, sin
capas que oculten nada.

## ⚖️ Sin dependencias: ventaja y límite

**La ventaja** es la de [CodeIgniter](codeigniter.md) en PHP: copiar un archivo y
funcionar. Sin instalación, sin árbol de dependencias, sin cadena de suministro
que auditar — lo que el [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)
pide reducir al mínimo.

**El límite** es que un framework sin dependencias tampoco se integra con el
ecosistema. Y, como Bottle nació antes de la asincronía de Python, su modelo es
síncrono.

## 🎓 Las dos lecciones

**1. Leer el código de un framework es una forma de aprendizaje que casi nadie
usa.** Bottle es lo bastante pequeño para hacerlo entero.

**2. Cero dependencias es una decisión de arquitectura con dos caras.** Máxima
portabilidad, mínima integración.

## 🔗 Enlaces

- Documentación oficial: <https://bottlepy.org/docs/dev/>
- [Ficha de Flask](flask.md) · [Ficha de Sinatra](sinatra.md) — el patrón que comparte
- [Módulo 01](../../curriculum/01-http-eventos-y-contratos.md)

## Fuentes

- [@grinberg-flask] Grinberg, Miguel. *Flask Web Development*, 2.ª ed. O'Reilly Media, 2018. ISBN 9781491991732 — <https://openlibrary.org/isbn/9781491991732>
