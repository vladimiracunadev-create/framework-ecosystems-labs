# 🥄 Slim — 2010

> [⬅️ Atlas](../README.md) · [🐘 Ecosistema PHP](../ecosistemas/php.md) · [🗂️ Índice](../frameworks.md)

Slim es el [Sinatra](sinatra.md) de PHP: un verbo, una ruta, una función. Y es,
además, **el mejor ejemplo del catálogo de interoperabilidad acordada entre
proyectos rivales**, porque se construye sobre los estándares PSR.

| | |
|---|---|
| **Aparición** | 2010, creado por Josh Lockhart |
| **Clasificación** | `web-framework` — microframework |
| **Ecosistema** | PHP |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://www.slimframework.com/docs/v4/> |

---

## 💡 Estándares en lugar de invención

Slim no define su propio objeto de petición ni su propio middleware: usa los
**estándares PSR** de la comunidad PHP [@php-fig-psr]. La consecuencia es poco
frecuente en cualquier ecosistema:

| Estándar | Qué permite |
| --- | --- |
| Mensajes HTTP | El mismo objeto de petición vale en Slim, Laravel o Laminas |
| Middleware | **Un middleware escrito para un framework funciona en otro** |
| Contenedor | Se puede usar el contenedor que prefieras |
| Registro | Cualquier biblioteca de registro conforme encaja |

La segunda fila es la notable. En casi todos los ecosistemas del Atlas, el
middleware está atado a su framework. Aquí, proyectos que compiten acordaron una
interfaz común — y eso convierte una decisión de framework en algo mucho menos
irreversible.

Para el [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md), es una
**estrategia de salida incorporada al ecosistema**: parte de tu código de
transporte sobrevive a un cambio de framework.

## ⚖️ Y el riesgo de siempre

Slim comparte el compromiso de todos los microframeworks, y el
[laboratorio 02](../../labs/02-express-api/README.md) lo enuncia bien: **se falla
por omisión**. Nada te recuerda que faltan el límite de tamaño del cuerpo, las
cabeceras de seguridad o un manejo uniforme de errores.

Es el mismo eje del [módulo 02](../../curriculum/02-arquitectura-de-frameworks.md):
lo explícito falla por omisión, lo implícito falla por sorpresa.

## 🎓 Las dos lecciones

**1. Un estándar acordado entre rivales reduce el coste de cambiar.** Es la mejor
noticia posible para la estrategia de salida, y casi ningún ecosistema la tiene.

**2. Los microframeworks trasladan responsabilidad, no la eliminan.** Lo que el
framework no hace lo hace alguien — o no lo hace nadie.

## 🔗 Enlaces

- Documentación oficial: <https://www.slimframework.com/docs/v4/>
- [Ficha de Sinatra](sinatra.md) — el patrón original · [Ficha de Symfony](symfony.md)
- [Ecosistema PHP](../ecosistemas/php.md)

## Fuentes

- [@php-fig-psr] *PSR — PHP Standards Recommendations*, PHP-FIG — <https://www.php-fig.org/psr/>
- [@lockhart-modern-php] Lockhart, Josh. *Modern PHP*. O'Reilly Media, 2015. ISBN 9781491905180 — <https://openlibrary.org/isbn/9781491905180>
