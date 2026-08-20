# 🍶 Flask — 2010

> [⬅️ Atlas](../README.md) · [🐍 Ecosistema Python](../ecosistemas/python.md) · [🗂️ Índice](../frameworks.md)

Flask nació como una broma del día de los inocentes y acabó siendo el
contrapunto exacto de Django dentro del mismo lenguaje. Esa coincidencia
—dos filosofías opuestas, maduras y mantenidas, en Python— convierte a este
ecosistema en el mejor laboratorio del Atlas para estudiar el eje entre
**«baterías incluidas»** y **«monta tú la pila»**.

> **🎯 Por qué está en este programa**
>
> Porque permite hacer la comparación que el
> [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) pide, **sin
> cambiar de lenguaje**. Django frente a Flask aísla la variable que interesa —qué
> trae el framework— manteniendo constante todo lo demás: lenguaje, personas,
> despliegue, ecosistema.

| | |
|---|---|
| **Aparición** | 2010, creado por Armin Ronacher |
| **Clasificación** | `web-framework` — microframework |
| **Ecosistema** | Python |
| **Licencia** | `BSD-3-Clause` |
| **Gobierno** | Pallets Projects |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://flask.palletsprojects.com/> |

---

## 💡 La propuesta: un núcleo pequeño y decisiones tuyas

```python
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.post("/tasks")
def crear_tarea():
    datos = request.get_json(silent=True) or {}
    titulo = (datos.get("title") or "").strip()
    if not titulo:                       # la validación la escribes tú
        return jsonify(code="TITLE_EMPTY"), 422
    return jsonify(id="t1", title=titulo), 201
```

Flask aporta enrutado, contexto de petición, plantillas y poco más. No trae ORM,
ni migraciones, ni validación, ni autenticación, ni estructura de proyecto. Todo
eso lo eliges tú, y esa es la propuesta entera.

Sus decisiones de diseño están documentadas explícitamente por el propio
proyecto, incluidas las que suelen criticarse —el uso de contextos globales de
petición, por ejemplo— con el razonamiento detrás [@flask-design]. Que un
framework publique **por qué** decidió lo que decidió es poco común y muy útil
para el módulo 11.

## ⚖️ El eje, con las dos columnas a la vista

| | Django | Flask |
| --- | --- | --- |
| ORM y migraciones | Incluidos | Eliges (SQLAlchemy, otro, ninguno) |
| Panel de administración | Generado desde el modelo | No existe |
| Autenticación | Incluida | Extensión o propia |
| Estructura del proyecto | Impuesta | Decisión tuya |
| Curva inicial | Media | Baja |
| Curva a los seis meses | Baja: todo está donde se espera | Depende de las decisiones que tomaste |
| Riesgo característico | Acoplamiento profundo al framework | Fallar **por omisión**: nada te recuerda lo que falta |

La última fila es la que más importa y la que menos se dice. En Django el riesgo
es que el dominio acabe dentro del ORM; en Flask, que nadie se acuerde de poner
límites de tamaño, cabeceras de seguridad o validación completa, porque el
framework no los pide.

Esa simetría reaparece en el [laboratorio 02](../../labs/02-express-api/README.md)
con Express: **lo explícito falla por omisión y lo implícito falla por sorpresa**.

## 🧭 Cuándo encaja

**Encaja bien** cuando el servicio es pequeño y bien delimitado, cuando el equipo
ya tiene opiniones formadas sobre ORM y estructura, o cuando el trabajo real
—ciencia de datos, automatización, integración— está fuera de la web y Flask solo
pone la fachada HTTP.

**Encaja mal** cuando el producto va a crecer sin una arquitectura decidida de
antemano. Sin convención, cada equipo inventa la suya, y a los dos años el
proyecto tiene tres formas distintas de hacer lo mismo.

## 🐍 El detalle del lenguaje

Flask se apoya en características muy idiomáticas de Python —decoradores,
gestores de contexto, tipado dinámico— que son también su superficie de
sorpresas: el contexto de petición es un objeto global que *parece* una variable
normal, y entender cómo funciona exige entender el modelo de datos del propio
lenguaje [@ramalho-fluent-python], [@grinberg-flask].

Es un buen recordatorio del [módulo 00](../../curriculum/00-taxonomia-y-diagnostico.md):
un framework hereda las virtudes **y las trampas** de su lenguaje.

## 🎓 Las tres lecciones

**1. «Micro» describe el núcleo, no el proyecto final.** Una aplicación Flask
madura tiene tantas piezas como una Django; la diferencia es quién las eligió y
quién las mantiene.

**2. Publicar las decisiones de diseño es una señal de salud.** Permite decidir
en minutos si un framework encaja con tu forma de trabajar.

**3. El eje incluido/mínimo no tiene ganador.** Tiene un ganador **por producto,
equipo y horizonte**, que es precisamente lo que la matriz del módulo 11 calcula.

## 🔗 Enlaces

- Documentación oficial: <https://flask.palletsprojects.com/>
- [Ficha de Django](django.md) — la otra columna · [Ficha de FastAPI](fastapi.md)
- [Ecosistema Python](../ecosistemas/python.md)

## Fuentes

- [@grinberg-flask] Grinberg, Miguel. *Flask Web Development*, 2.ª ed. O'Reilly Media, 2018. ISBN 9781491991732 — <https://openlibrary.org/isbn/9781491991732>
- [@ramalho-fluent-python] Ramalho, Luciano. *Fluent Python*, 2.ª ed. O'Reilly Media, 2021. ISBN 9781492056355 — <https://openlibrary.org/isbn/9781492056355>
- [@flask-design] *Design Decisions in Flask*, Pallets Projects — <https://flask.palletsprojects.com/en/stable/design/>
