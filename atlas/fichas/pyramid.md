# 🔺 Pyramid — 2010

> [⬅️ Atlas](../README.md) · [🐍 Ecosistema Python](../ecosistemas/python.md) · [🗂️ Índice](../frameworks.md)

Pyramid ocupa una posición poco común: **escala de microframework a aplicación
grande sin reescribir**. Empieza con un archivo, como Flask, y crece hacia una
estructura completa sin cambiar de herramienta.

Y tiene además una peculiaridad que lo hace útil para el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md): **su licencia no
corresponde a un identificador SPDX único**.

| | |
|---|---|
| **Aparición** | 2010, del proyecto Pylons |
| **Clasificación** | `web-framework` |
| **Ecosistema** | Python |
| **Licencia** | `NOASSERTION` — derivada de BSD, sin identificador SPDX propio |
| **Gobierno** | Pylons Project |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://docs.pylonsproject.org/projects/pyramid/en/latest/> |

---

## ⚖️ La licencia, como lección

El catálogo de este repositorio exige un identificador SPDX para cada entrada, y
Pyramid obliga a usar `NOASSERTION` — la convención de SPDX para «no corresponde
a un identificador único».

Eso **no significa que la licencia sea problemática**: es una licencia derivada de
BSD, permisiva. Significa que las herramientas automáticas de cumplimiento no la
reconocerán, y que alguien de tu organización tendrá que leerla y decidir.

Es exactamente lo que el módulo 11 quiere provocar: la casilla «licencia» de la
matriz no se rellena con «es de código abierto», sino con **el identificador
exacto y las obligaciones concretas** [@spdx-licenses], [@osi-licenses].

## 💡 Crecer sin reescribir

Pyramid permite empezar con una configuración mínima y añadir después
autenticación, autorización por recursos, plantillas y estructura por paquetes.
La propuesta responde a un problema real del eje del módulo 11: **elegir
microframework y descubrir a los dos años que hacía falta estructura**.

Su modelo de autorización por **recorrido de recursos** —los permisos se derivan
de la jerarquía del objeto solicitado, no de la ruta— es además una de las
implementaciones más limpias del principio del
[módulo 07](../../curriculum/07-identidad-y-seguridad.md): **autorizar el recurso,
no la ruta**.

## 🎓 Las dos lecciones

**1. Una licencia sin identificador SPDX es trabajo humano.** No es un problema
legal por sí mismo; es una casilla que no se puede automatizar.

**2. Autorizar por recurso y no por ruta evita la clase de fallo más común.** Que
un framework lo haga natural es una ventaja de seguridad real.

## 🔗 Enlaces

- Documentación oficial: <https://docs.pylonsproject.org/projects/pyramid/en/latest/>
- [Ficha de Flask](flask.md) · [Ficha de Django](django.md)
- [Módulo 07](../../curriculum/07-identidad-y-seguridad.md) · [Módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)

## Fuentes

- [@spdx-licenses] SPDX License List, Linux Foundation — <https://spdx.org/licenses/>
- [@osi-licenses] OSI Approved Licenses, Open Source Initiative — <https://opensource.org/licenses>
