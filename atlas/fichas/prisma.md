# ▲🗄️ Prisma ORM — 2021

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Prisma define el esquema en **un lenguaje propio** y genera desde él un cliente
tipado. Es la apuesta más fuerte del ecosistema JavaScript por los tipos exactos,
y su decisión de tener un lenguaje aparte es lo que hay que evaluar.

| | |
|---|---|
| **Aparición** | 2021 (como Prisma 2) |
| **Clasificación** | `orm` |
| **Ecosistema** | JavaScript / TypeScript |
| **Licencia** | `Apache-2.0` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://www.prisma.io/docs> |

---

## 💡 Esquema propio, cliente generado

```prisma
model Tarea {
  id        String   @id @default(cuid())
  titulo    String   @db.VarChar(120)
  completada Boolean @default(false)
  usuario   Usuario  @relation(fields: [usuarioId], references: [id])
  usuarioId String
}
```

De ahí se generan el cliente tipado y las migraciones. La ventaja es real: **el
resultado de una consulta tiene el tipo exacto de lo que pediste**, incluidas las
relaciones que incluiste y solo esas.

Eso ataca directamente el fallo que la [ficha de Eloquent](eloquent.md) describe:
si el tipo refleja exactamente los campos seleccionados, **filtrar un campo
interno por accidente deja de ser posible**.

## ⚖️ El coste: un lenguaje más

Es la crítica principal y merece tomarse en serio, porque es la misma que la
[ficha de Gatsby](gatsby.md) plantea con GraphQL: **complejidad accidental es lo
que hay que aprender y no sirve fuera de la herramienta**.

[Drizzle](drizzle.md) responde a eso definiendo el esquema en TypeScript.

Y hay una segunda consideración operativa: Prisma ha usado un motor de consultas
en un binario aparte, lo que en entornos con restricciones —funciones sin
servidor, arquitecturas concretas— es un factor a comprobar antes de adoptar. Es
el tipo de detalle de despliegue que el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) sitúa en coste
total de operación.

## 🎓 Las dos lecciones

**1. Tipos exactos convierten la filtración de campos en un error de
compilación.** Es seguridad por diseño, no por disciplina.

**2. Un lenguaje propio es una barrera permanente.** Cada persona nueva lo
aprende, y no le sirve en ningún otro sitio.

## 🔗 Enlaces

- Documentación oficial: <https://www.prisma.io/docs>
- [Ficha de Drizzle](drizzle.md) · [Ficha de TypeORM](typeorm.md) · [Ficha de Eloquent](eloquent.md)
- [Módulo 06](../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@fowler-poeaa] Fowler, Martin. *Patterns of Enterprise Application Architecture*. Addison-Wesley, 2002. ISBN 9780321127426 — <https://openlibrary.org/isbn/9780321127426>
