# ⛵ Sails.js — 2012

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Sails intentó ser **el Rails de Node.js**: convención sobre configuración, un ORM
incluido, generadores de código y una estructura de carpetas dada. Fue el primer
intento serio de traer a Node el marco completo en lugar del microframework.

| | |
|---|---|
| **Aparición** | 2012 |
| **Clasificación** | `full-stack-framework` |
| **Ecosistema** | Node.js |
| **Licencia** | `MIT` |
| **Estado** | 🟡 Mantenimiento |
| **Documentación** | <https://sailsjs.com/documentation> |

---

## 📜 El hueco que quería llenar

En 2012 Node tenía [Express](express.md) y poco más. Express da enrutado y
middleware; **todo lo demás lo decide cada equipo**: cómo hablar con la base de
datos, dónde poner la lógica, cómo autenticar, cómo estructurar carpetas.

Eso significa que dos proyectos Express del mismo equipo pueden no parecerse en
nada. Sails propuso lo contrario, el argumento de la
[ficha de Ruby on Rails](rails.md): **el acuerdo lo pone el framework**, y así
quien llega nuevo ya sabe dónde mirar.

Además incluía un ORM propio (Waterline) que abstraía sobre bases de datos
relacionales y no relacionales, y generación automática de una API REST desde los
modelos.

## ⚖️ Por qué no cuajó

Tres razones, y las tres son lecciones del
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md):

**1. La abstracción sobre bases de datos muy distintas filtra.** Una capa que
promete la misma API sobre un motor relacional y uno documental acaba ofreciendo
el mínimo común denominador — y cuando necesitas una consulta específica, sales de
la abstracción. Es lo contrario de la salida hacia abajo que la
[ficha de SQLAlchemy](sqlalchemy.md) defiende.

**2. La cultura de Node fue en la otra dirección.** El ecosistema premió las
piezas pequeñas y componibles. Sails llegó con una respuesta integrada a una
comunidad que quería elegir cada pieza.

**3. El desarrollo se ralentizó.** Y en el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md), la señal de salud
de un proyecto —ritmo de publicaciones, respuesta a fallos de seguridad, tamaño
del equipo que lo mantiene— pesa tanto como sus méritos técnicos.

## 🧭 Qué queda

La pregunta que Sails hizo sigue abierta y hoy la responden
[NestJS](nestjs.md) y [AdonisJS](adonisjs.md): **cuánta estructura debe imponer un
framework de Node**. Sails eligió mucha, demasiado pronto y con una abstracción de
datos demasiado ambiciosa.

## 🎓 Las dos lecciones

**1. La convención tiene valor real, y hay que llegar a tiempo.** El mismo
argumento que triunfó en Rails no funcionó en un ecosistema ya formado alrededor
de la composición.

**2. Una abstracción que unifica modelos de datos incompatibles ofrece el mínimo
común denominador.** Cuando el caso se complica, se abandona.

## 🔗 Enlaces

- Documentación oficial: <https://sailsjs.com/documentation>
- [Ficha de Express](express.md) · [Ficha de NestJS](nestjs.md) · [Ficha de Rails](rails.md)
- [Módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)

## Fuentes

- [@casciaro-node-patterns] Casciaro, Mario; Mammino, Luciano. *Node.js Design Patterns*, 3.ª ed. Packt, 2020. ISBN 9781839214110 — <https://openlibrary.org/isbn/9781839214110>
- [@endoflife-date] *endoflife.date* — <https://endoflife.date/>
