# 🌲 RedwoodJS — 2020

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Redwood propuso algo que casi nadie en JavaScript se había atrevido a proponer:
**una pila completa y opinada**, con React, GraphQL, Prisma y una estructura de
proyecto dada, para que el equipo no decidiera nada de eso.

| | |
|---|---|
| **Aparición** | 2020, creado por Tom Preston-Werner y otros |
| **Clasificación** | `full-stack-framework` |
| **Ecosistema** | JavaScript / TypeScript |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://redwoodjs.com/docs> |

---

## 💡 Decidir por ti, a propósito

La lista viene cerrada: React en el cliente, GraphQL como capa de datos, Prisma
para la base de datos, Jest y Storybook para pruebas, generadores de línea de
comandos y un monorepo con dos carpetas —`web` y `api`.

Es el argumento de [Rails](rails.md) trasladado a JavaScript, y también el de
[Laravel](laravel.md): **las decisiones tomadas de antemano son tiempo que no
gastas y discusiones que no tienes**. Para un equipo pequeño que quiere estar en
producción rápido, eso vale mucho.

Su aportación propia son las **celdas**: un archivo declara los estados de una
consulta y el framework decide cuál mostrar.

```jsx
export const QUERY = gql`{ tareas { id titulo } }`;
export const Loading = () => <Espera />;
export const Empty = () => <p>Nada pendiente.</p>;
export const Failure = ({ error }) => <Error mensaje={error.message} />;
export const Success = ({ tareas }) => <Lista items={tareas} />;
```

Eso convierte en obligatorio lo que suele olvidarse. **Los estados de carga,
vacío y error existen siempre**; lo que cambia es si alguien los diseñó o si
aparecen como una pantalla en blanco. Tidwell insiste en tratarlos como parte del
diseño, no como excepciones [@tidwell-designing-interfaces], y el
[módulo 03](../../curriculum/03-frontend-componentes-y-estado.md) lo exige en las entregas.

Que la estructura del archivo te obligue a escribirlos es diseño de herramienta al
servicio de la calidad: el camino fácil es también el correcto.

## ⚖️ El coste de una pila cerrada

**Aceptas GraphQL aunque tu caso no lo pida.** La
[ficha de Gatsby](gatsby.md) documenta a dónde lleva eso: complejidad accidental
para quien solo necesita leer unos registros.

**Y aceptas el conjunto entero.** Si una de las piezas se queda atrás —o si el
framework pierde impulso—, migrar afecta a todas a la vez. Es el riesgo que el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) llama acoplamiento
de decisiones: cuando eliges un paquete cerrado, sales de él también en paquete.

## 🎓 Las dos lecciones

**1. Una herramienta puede hacer obligatorio lo que la disciplina olvida.** Las
celdas obligan a tratar carga, vacío y error como parte del diseño.

**2. Una pila cerrada acopla todas sus decisiones.** Se entra junto y se sale
junto.

## 🔗 Enlaces

- Documentación oficial: <https://redwoodjs.com/docs>
- [Ficha de Prisma](prisma.md) · [Ficha de Gatsby](gatsby.md) · [Ficha de Next.js](nextjs.md)
- [Módulo 03](../../curriculum/03-frontend-componentes-y-estado.md)

## Fuentes

- [@tidwell-designing-interfaces] Tidwell, Jenifer. *Designing Interfaces: Patterns for Effective Interaction Design*. O'Reilly Media, 2005. ISBN 9780596008031 — <https://openlibrary.org/isbn/9780596008031>
- [@porcello-graphql] Porcello, Eve; Banks, Alex. *Learning GraphQL*. O'Reilly Media, 2018. ISBN 9781492030713 — <https://openlibrary.org/isbn/9781492030713>
