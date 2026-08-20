# 🟩 Django — 2005

> [⬅️ Atlas](../README.md) · [🐍 Ecosistema Python](../ecosistemas/python.md) · [🗂️ Índice](../frameworks.md)

Django nació en la redacción de un periódico —el *Lawrence Journal-World*, en
Kansas— y veinte años después se sigue notando. Su lema, «el framework web para
perfeccionistas con plazos», describe con precisión inusual su compromiso
central: **estructura fuerte para poder ir rápido**, no a pesar de ir rápido.

Es el mejor representante vivo de «baterías incluidas», y su pareja natural de
comparación —Flask, en el mismo lenguaje— convierte al ecosistema Python en el
mejor laboratorio del catálogo para estudiar ese eje.

> **🎯 Por qué está en este programa**
>
> **Porque su panel de administración generado no tiene equivalente** en ningún
> otro ecosistema, y eso obliga a una conversación que el
> [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) quiere provocar:
> una sola capacidad puede decidir una elección de framework, si resuelve un
> problema caro del producto.
>
> **Y porque su política de versiones es de las mejores del campo**: fechas
> públicas, versiones con soporte extendido y guías de actualización detalladas
> [@django-releases]. Es el contraste directo con el caso AngularJS.

| | |
|---|---|
| **Aparición** | 2005, creado por Adrian Holovaty y Simon Willison |
| **Clasificación** | `web-framework` — completo, con ORM y administración |
| **Ecosistema** | Python |
| **Licencia** | `BSD-3-Clause` |
| **Gobierno** | Django Software Foundation |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://docs.djangoproject.com/> |

---

## 📜 El contexto: un periódico con plazos de horas

La redacción necesitaba publicar aplicaciones nuevas —un buscador de resultados
electorales, una base de datos de restaurantes— en cuestión de días, y que
periodistas sin formación técnica pudieran cargar el contenido. Esas dos
restricciones explican casi todo Django:

| Restricción de la redacción | Decisión de diseño |
| --- | --- |
| Publicar en días, no meses | Todo incluido: ORM, formularios, autenticación, plantillas |
| Que lo alimente gente no técnica | **Panel de administración generado desde el modelo** |
| Muchos sitios, mismo motor | Aplicaciones reutilizables e instalables |
| Contenido público y sensible | Protecciones de seguridad activadas por omisión |

## 💡 El panel de administración: la funcionalidad que decide proyectos

Es la capacidad más singular del catálogo entero. A partir de la definición del
modelo, Django genera una interfaz completa de gestión —listados con búsqueda y
filtros, formularios de alta y edición, permisos por usuario y grupo, historial
de cambios— sin escribir la interfaz.

```python
# models.py — se declara el dominio
class Articulo(models.Model):
    titulo = models.CharField(max_length=200)
    cuerpo = models.TextField()
    publicado = models.BooleanField(default=False)
    autor = models.ForeignKey(Usuario, on_delete=models.PROTECT)

# admin.py — y con esto ya existe un panel de gestión completo y con permisos
@admin.register(Articulo)
class ArticuloAdmin(admin.ModelAdmin):
    list_display = ("titulo", "autor", "publicado")
    list_filter = ("publicado", "autor")
    search_fields = ("titulo", "cuerpo")
```

Para un producto interno, un panel editorial o una herramienta de operaciones,
eso puede representar **semanas de trabajo que no se hacen**. Es un argumento
legítimo y medible para la matriz de decisión del módulo 11 — siempre que se
declare también su límite: el panel es una herramienta para personas de
confianza, no una interfaz de producto para clientes finales.

## 🛡️ Seguridad por omisión

Django es de los pocos frameworks del catálogo cuyo comportamiento por defecto
cubre, sin configurar nada, buena parte de los controles que el
[módulo 07](../../curriculum/07-identidad-y-seguridad.md) exige:

| Riesgo | Qué hace Django sin que lo pidas |
| --- | --- |
| Inyección SQL | El ORM parametriza siempre |
| Guiones entre sitios | Las plantillas escapan la salida por omisión |
| Petición forzada entre sitios | Testigo obligatorio en formularios POST |
| Secuestro de sesión | Cookies con banderas seguras configuradas |
| Contraseñas | Derivación con función lenta y sal, y comprobación contra listas comunes |
| Cabeceras de seguridad | Middleware incluido, solo hay que activarlo |

Eso **no significa que una aplicación Django sea segura**: significa que el punto
de partida está más arriba. La distinción es exactamente la que enseña el módulo
07 —un mecanismo disponible no es una configuración segura— y la que la lista de
verificación de despliegue del propio proyecto insiste en recorrer
[@vincent-django-professionals].

## ⚖️ El compromiso, sin adornos

### Lo que se gana

Estructura conocida. Cualquier persona con experiencia en Django encuentra el
código donde espera, porque el framework impone la organización. En un equipo con
rotación, eso es dinero.

### Lo que se paga

**1. El acoplamiento al ORM es profundo.** Las vistas genéricas, los formularios,
el panel y las señales asumen los modelos de Django. Salirse del ORM significa
renunciar a buena parte del framework. Es la advertencia del
[módulo 02](../../curriculum/02-arquitectura-de-frameworks.md) sobre mantener el
dominio independiente: en Django cuesta más trabajo que en la mayoría, y por eso
la comunidad publicó guías enteras sobre cómo estructurar proyectos grandes
[@greenfeld-two-scoops-django].

**2. La asincronía llegó después.** Django nació síncrono en 2005 y la
asincronía se añadió sobre esa base. Funciona, pero no es el mismo diseño de
origen que el de FastAPI o Litestar. Si el producto es intensivo en
entrada/salida concurrente, es una dimensión que hay que medir, no suponer.

**3. Las aplicaciones reutilizables son un ecosistema con calidad desigual.** La
comodidad de instalar una aplicación de terceros para autenticación social o
etiquetas trae consigo su mantenimiento, su licencia y su cadena de suministro.

## 🧪 Pruebas: la cultura del ecosistema

Django trae un arnés de pruebas integrado —cliente HTTP, base de datos de prueba
por ejecución, utilidades de aserción— y la comunidad construyó encima una
cultura de pruebas notablemente sólida. El libro de referencia del ecosistema
enseña Django **desde la prueba hacia el código**, no al revés
[@percival-tdd-python].

Para este programa eso encaja con el
[módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md): la pirámide
tiene esa forma por economía, y un framework que hace baratas las pruebas de
integración cambia el reparto óptimo.

## 🎓 Las tres lecciones

**1. Una sola capacidad puede decidir una elección.** El panel de administración
no es una funcionalidad más: para cierta clase de productos es *la* razón. La
matriz del módulo 11 debe permitir que una dimensión pese mucho cuando de verdad
pesa mucho.

**2. Los valores por omisión son una decisión de seguridad.** Que el escape y la
parametrización estén activos sin pedirlo evita una categoría entera de fallos.
Al comparar frameworks, «qué protege sin configurar» es una fila obligatoria.

**3. El origen condiciona el diseño durante décadas.** Django sigue siendo, en su
estructura, el framework de una redacción con plazos. Reconocer de qué problema
salió un framework predice para qué va a servirte mejor que su documentación.

## 🔗 Enlaces

- Documentación oficial: <https://docs.djangoproject.com/>
- [Ecosistema Python](../ecosistemas/python.md) · [Ficha de Rails](rails.md) — su influencia directa
- [Módulo 07](../../curriculum/07-identidad-y-seguridad.md) — qué protege un framework sin configurar

## Fuentes

- [@greenfeld-two-scoops-django] Roy Greenfeld, Daniel; Roy Greenfeld, Audrey. *Two Scoops of Django: Best Practices for Django*. Two Scoops Press, 2013. ISBN 9781481879705 — <https://openlibrary.org/isbn/9781481879705>
- [@vincent-django-professionals] Vincent, William S. *Django for Professionals: Production Websites with Python & Django*. Independently published, 2019. ISBN 9781081582166 — <https://openlibrary.org/isbn/9781081582166>
- [@percival-tdd-python] Percival, Harry J. W. *Test-Driven Development with Python: Obey the Testing Goat*, 2.ª ed. O'Reilly Media, 2017. ISBN 9781491958704 — <https://openlibrary.org/isbn/9781491958704>
- [@django-releases] *Django Release Notes*, Django Software Foundation — <https://docs.djangoproject.com/en/stable/releases/>
