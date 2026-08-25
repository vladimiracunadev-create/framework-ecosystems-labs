# Parte 11 — Legado, migración y decisión

> [⬅️ Parte 10](../parte-10-calidad-y-operacion/README.md) · [🎓 Todas las clases](../README.md) · [📖 Glosario](../../glosario/README.md)

**El trabajo que de verdad se hace: entender lo que ya existe, cambiarlo sin apagarlo y decidir con criterio.**

**Clases 138 a 149** · 12 en total · 0 construidas · 14 tecnologías en juego.

## 🧭 De qué va esta parte

Doce clases sobre el trabajo que ocupa la mayor parte de una carrera y casi nada de la formación: **entender, cambiar y a veces abandonar sistemas que no escribiste**.

Empieza por leer código ajeno sin romperlo, sigue por la técnica que hace posible migrar sin reescribir —la higuera estranguladora— y llega a las decisiones que hay que defender ante otras personas: cuándo migrar, cuándo no, qué framework elegir para un producto concreto y cómo se sale de uno.

Es el nivel experto del programa, y no por la tecnología. Es experto porque **todas las respuestas son «depende», y hay que decir de qué** — con un horizonte, un equipo y un riesgo declarados.

## 🎒 Qué da por sabido

- Todo lo anterior. Esta parte no enseña mecanismos nuevos: enseña a decidir sobre los que ya conoces.
- Haber visto al menos un sistema que no escribiste tú.

## 🎯 Qué sabrás hacer al terminarla

- Entrar en un sistema desconocido y construirte un mapa antes de tocar nada.
- Caracterizar el comportamiento actual con pruebas, para poder cambiar con red.
- Migrar de forma incremental con las dos versiones conviviendo detrás de una fachada.
- Hacer convivir dos frameworks en la misma página, y decir qué cuesta.
- Cambiar el esquema de datos sin cortar el servicio.
- Defender una decisión de framework con criterios declarados: producto, equipo, riesgo y horizonte.
- Reconocer cuándo **no** migrar, que es la respuesta correcta más veces de las que parece.

## 🧵 Por qué en este orden

Las tres primeras son el método para entrar: leer, caracterizar y estrangular.

Las cuatro del medio son las técnicas: dos frameworks conviviendo, micro-frontends, migrar datos sin parar y un caso real completo.

Las cinco últimas son de juicio: cuándo no migrar, fin de vida y soporte, cómo se elige, cómo se abandona, y el proyecto integrador donde todo lo anterior se defiende.

## 📚 Las clases

| # | Clase | Qué resuelve | Nivel | Estado |
| --- | --- | --- | --- | --- |
| [138](138-leer-un-sistema-que-no-escribiste/README.md) | [Leer un sistema que no escribiste](138-leer-un-sistema-que-no-escribiste/README.md) | Orientarse en un código ajeno sin cambiarlo todavía. | 🟡 intermedio | 🚧 Esqueleto |
| [139](139-caracterizar-con-pruebas/README.md) | [Caracterizar con pruebas](139-caracterizar-con-pruebas/README.md) | Fijar el comportamiento actual antes de tocarlo. | 🔴 avanzado | 🚧 Esqueleto |
| [140](140-la-higuera-estranguladora/README.md) | [La higuera estranguladora](140-la-higuera-estranguladora/README.md) | Sustituir por partes con el sistema en marcha. | 🔴 avanzado | 🚧 Esqueleto |
| [141](141-dos-frameworks-conviviendo/README.md) | [Dos frameworks conviviendo](141-dos-frameworks-conviviendo/README.md) | Montar lo nuevo dentro de lo viejo sin reescribir. | 🔴 avanzado | 🚧 Esqueleto |
| [142](142-micro-frontends/README.md) | [Micro-frontends](142-micro-frontends/README.md) | Repartir una interfaz entre equipos, con sus costes. | 🔴 avanzado | 🚧 Esqueleto |
| [143](143-migrar-datos-sin-parar/README.md) | [Migrar datos sin parar](143-migrar-datos-sin-parar/README.md) | Cambiar el esquema con la aplicación en producción. | 🔴 avanzado | 🚧 Esqueleto |
| [144](144-un-caso-real-de-migracion/README.md) | [Un caso real de migración](144-un-caso-real-de-migracion/README.md) | Recorrer una migración completa con sus decisiones documentadas. | 🔴 avanzado | 🚧 Esqueleto |
| [145](145-cuando-no-migrar/README.md) | [Cuándo no migrar](145-cuando-no-migrar/README.md) | Reconocer cuándo la reescritura es el error. | 🟡 intermedio | 🚧 Esqueleto |
| [146](146-fin-de-vida-y-soporte/README.md) | [Fin de vida y soporte](146-fin-de-vida-y-soporte/README.md) | Leer las señales de que una pieza va a dejar de sostenerse. | 🟡 intermedio | 🚧 Esqueleto |
| [147](147-elegir-framework-para-un-producto/README.md) | [Elegir framework para un producto](147-elegir-framework-para-un-producto/README.md) | Decidir con criterio explícito y dejarlo escrito. | 🔴 avanzado | 🚧 Esqueleto |
| [148](148-como-se-abandona-un-framework/README.md) | [Cómo se abandona un framework](148-como-se-abandona-un-framework/README.md) | Diseñar la salida antes de necesitarla. | 🔴 avanzado | 🚧 Esqueleto |
| [149](149-proyecto-integrador/README.md) | [Proyecto integrador](149-proyecto-integrador/README.md) | Construir y defender un producto completo con las decisiones justificadas. | 🔴 avanzado | 🚧 Esqueleto |

## 🎬 Las tecnologías que aparecen

Entre paréntesis, en cuántas clases de esta parte interviene cada una. **Estar aquí no es una recomendación**: es que el problema de esa clase existe de verdad para esa tecnología.

| Ecosistema | Tecnologías |
| --- | --- |
| **JavaScript/TypeScript** | [React](../../atlas/fichas/react.md) (3), [Lit](../../atlas/fichas/lit.md) (2), [Vue](../../atlas/fichas/vue.md) (2), [Next.js](../../atlas/fichas/nextjs.md) (1), [Prisma ORM](../../atlas/fichas/prisma.md) (1), [Svelte](../../atlas/fichas/svelte.md) (1) |
| **Python** | [FastAPI](../../atlas/fichas/fastapi.md) (9), [SQLAlchemy](../../atlas/fichas/sqlalchemy.md) (1) |
| **JVM** | [Spring Boot](../../atlas/fichas/spring-boot.md) (9), [Hibernate ORM](../../atlas/fichas/hibernate.md) (1) |
| **.NET** | [ASP.NET Core](../../atlas/fichas/aspnet-core.md) (8), [Entity Framework Core](../../atlas/fichas/entity-framework-core.md) (1) |
| **Node.js** | [Express](../../atlas/fichas/express.md) (8) |
| **TypeScript** | [Angular](../../atlas/fichas/angular.md) (1) |

## 📖 Las palabras que esta parte define

[**Prueba de caracterización**](../../glosario/README.md#prueba-de-caracterización) · [**Higuera estranguladora**](../../glosario/README.md#higuera-estranguladora) · [**Micro-frontend**](../../glosario/README.md#micro-frontend) · [**Migrar sin parar**](../../glosario/README.md#migrar-sin-parar) · [**Fin de vida**](../../glosario/README.md#fin-de-vida)

Todas, con su definición, en el [glosario](../../glosario/README.md).

## ✅ Cómo se ejecuta una clase de esta parte

```bash
node scripts/run-class.mjs 138
```

El verificador arranca cada implementación, la somete a su `contrato.json` y **declara cuáles omitió** por no encontrar su cadena de herramientas. Si te faltan cadenas, `node scripts/doctor.mjs` dice cuáles y cómo se instalan.

## ➡️ Y después

Aquí termina el programa de clases. El [módulo 12](../../curriculum/12-producto-final.md) del currículo recoge el producto final, y los programas hermanos siguen desde otros ángulos: [polyglot-programming-labs](https://github.com/vladimiracunadev-create/polyglot-programming-labs) para los lenguajes, [database-systems-labs](https://github.com/vladimiracunadev-create/database-systems-labs) para los datos y [multi-cloud-engineering-program](https://github.com/vladimiracunadev-create/multi-cloud-engineering-program) para el despliegue.
