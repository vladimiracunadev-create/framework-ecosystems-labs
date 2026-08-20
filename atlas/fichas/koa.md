# 🌊 Koa — 2013

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Koa lo escribió **el mismo equipo que [Express](express.md)**, para corregir dos
cosas de su diseño: las devoluciones de llamada y la cadena de middleware que
solo avanza hacia delante.

| | |
|---|---|
| **Aparición** | 2013 |
| **Clasificación** | `web-framework` |
| **Ecosistema** | Node.js |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://koajs.com/> |

---

## 💡 Middleware en cebolla

En Express, un middleware llama a `next()` y la ejecución sigue hacia delante.
Volver a hacer algo **después** de que el manejador responda exige trucos.

En Koa, el middleware es asíncrono y `await next()` devuelve el control **cuando
todo lo de dentro ha terminado**:

```javascript
app.use(async (ctx, next) => {
  const inicio = Date.now();
  await next();                                   // ...se ejecuta todo lo demás...
  ctx.set("X-Tiempo", `${Date.now() - inicio}`);  // ...y volvemos aquí
});
```

Ese modelo —entrar por las capas y salir por ellas en orden inverso, como una
cebolla— es el que hace naturales el registro de tiempos, el manejo de errores
envolvente y las transacciones que abarcan toda la petición
[@casciaro-node-patterns].

Es una mejora real sobre el mecanismo de extensión que describe el
[módulo 02](../../curriculum/02-arquitectura-de-frameworks.md), y explica por qué
casi todos los frameworks posteriores de Node.js adoptaron una forma parecida.

## ⚖️ Por qué no sustituyó a Express

**Trae menos.** Koa es deliberadamente mínimo: ni enrutado, ni análisis de cuerpo,
ni nada. Todo son módulos aparte.

**Express ya estaba en todas partes.** El ecosistema de middleware, los ejemplos y
las personas formadas seguían ahí. Es el mismo fenómeno que la
[ficha de Knockout](knockout.md) describe: **una mejora técnica no basta contra un
ecosistema establecido**.

## 🎓 Las dos lecciones

**1. El middleware en cebolla resuelve el «después» que la cadena lineal no
resuelve.** Es una diferencia pequeña con efecto grande en lo que se puede
escribir.

**2. Los mismos autores pueden mejorar su diseño y no ganar.** La inercia del
ecosistema es una fuerza que el módulo 11 puntúa como capacidades del equipo y
disponibilidad de personas.

## 🔗 Enlaces

- Documentación oficial: <https://koajs.com/>
- [Ficha de Express](express.md) · [Ficha de Fastify](fastify.md)
- [Módulo 02](../../curriculum/02-arquitectura-de-frameworks.md)

## Fuentes

- [@casciaro-node-patterns] Casciaro, Mario; Mammino, Luciano. *Node.js Design Patterns*, 3.ª ed. Packt Publishing, 2020. ISBN 9781839214110 — <https://openlibrary.org/isbn/9781839214110>
