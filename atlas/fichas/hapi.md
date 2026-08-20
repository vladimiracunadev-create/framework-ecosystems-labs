# 🎪 hapi — 2011

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

hapi nació en un entorno de comercio electrónico de alta carga con una decisión
poco común: **configuración sobre código**. Las rutas se declaran como datos, no
como llamadas a funciones.

| | |
|---|---|
| **Aparición** | 2011, creado en Walmart Labs |
| **Clasificación** | `web-framework` |
| **Ecosistema** | Node.js |
| **Licencia** | `BSD-3-Clause` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://hapi.dev/> |

---

## 💡 La ruta como dato

```javascript
server.route({
  method: "POST",
  path: "/tasks",
  options: {
    validate: { payload: esquemaCrearTarea },   // declarado, no llamado
    auth: "sesion",
    tags: ["api"],
  },
  handler: async (peticion, h) => { /* ... */ },
});
```

Toda la configuración de la ruta —validación, autenticación, caché,
documentación— vive en un objeto. Eso tiene una propiedad valiosa: **la
configuración se puede inspeccionar**. Un programa puede recorrer las rutas y
verificar, por ejemplo, que ninguna quedó sin autenticación.

Es una idea afín a las **funciones de aptitud** del
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md): una propiedad de
arquitectura que se comprueba automáticamente en lugar de confiarse a la
disciplina.

## ⚖️ Frente a Express

| | Express | hapi |
| --- | --- | --- |
| Estilo | Imperativo: `app.post(...)` | Declarativo: objeto de configuración |
| Validación | Aparte | Integrada |
| Inspección de rutas | Difícil | **Natural** |
| Ecosistema | El mayor | Menor |
| Curva | Mínima | Mayor |

## 🎓 Las dos lecciones

**1. Lo declarativo se puede inspeccionar.** Una configuración que es un dato se
puede recorrer, auditar y verificar; una secuencia de llamadas, no.

**2. Nacer de una restricción real produce decisiones distintas.** hapi viene de
un contexto con requisitos de seguridad y auditoría fuertes, y se nota.

## 🔗 Enlaces

- Documentación oficial: <https://hapi.dev/>
- [Ficha de Express](express.md) · [Ficha de Fastify](fastify.md)
- [Módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)

## Fuentes

- [@casciaro-node-patterns] Casciaro, Mario; Mammino, Luciano. *Node.js Design Patterns*, 3.ª ed. Packt Publishing, 2020. ISBN 9781839214110 — <https://openlibrary.org/isbn/9781839214110>
