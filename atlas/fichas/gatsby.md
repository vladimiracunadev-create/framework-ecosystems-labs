# 🟣 Gatsby — 2015

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Gatsby popularizó la generación estática con React y llegó a ser la opción por
omisión para sitios de contenidos. Hoy está en mantenimiento, y **su declive es
la parte interesante**: es el mejor caso del catálogo sobre el coste de una capa
de abstracción que hay que aprender aparte.

> **🎯 Por qué está en este programa**
>
> Porque enseña, con un caso real, la pregunta que el
> [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) formula como
> **complejidad accidental**: ¿cuánto de lo que hay que aprender para usar esta
> herramienta sirve para algo fuera de ella? En Gatsby, la respuesta acabó siendo
> «poco», y eso pesó más que sus virtudes técnicas.

| | |
|---|---|
| **Aparición** | 2015, creado por Kyle Mathews |
| **Clasificación** | `react-metaframework` |
| **Ecosistema** | JavaScript / TypeScript |
| **Licencia** | `MIT` |
| **Estado** | 🟡 Mantenimiento |
| **Documentación** | <https://www.gatsbyjs.com/docs/> |

---

## 💡 La idea: GraphQL como capa de datos unificada

La propuesta de Gatsby era elegante. Un sitio de contenidos toma datos de sitios
muy distintos —archivos Markdown, un gestor de contenidos remoto, una hoja de
cálculo, una API—, y cada uno tiene su forma de consultarse.

Gatsby los unificaba: todo entraba en una **capa de datos GraphQL** interna, y
las páginas consultaban siempre igual, viniera de donde viniera.

```jsx
// La misma consulta sirva el dato de un archivo local o de un CMS remoto.
export const query = graphql`
  query {
    allMarkdownRemark { nodes { frontmatter { title } } }
  }
`;
```

Sobre el papel es una abstracción muy buena: un solo lenguaje de consulta, y
cambiar la fuente de datos no cambia las páginas [@porcello-graphql].

## 📉 Por qué no bastó

**1. Había que aprender GraphQL para escribir un blog.** GraphQL es un lenguaje de
consulta serio, con su especificación, su esquema y sus reglas
[@graphql-spec]. Aprenderlo tiene sentido si consumes una API GraphQL de verdad;
tenerlo que aprender **solo para leer archivos Markdown del propio repositorio**
es complejidad que no viaja: no sirve fuera de Gatsby.

**2. El tiempo de construcción crecía con el contenido.** Un sitio de miles de
páginas tardaba mucho en construirse, y cada cambio pequeño implicaba pasar por
ese proceso.

**3. Llegaron alternativas sin esa capa.** Next.js podía generar estático sin
GraphQL. Astro apareció con la propuesta de no enviar JavaScript por omisión.
Ambos hacían el trabajo principal sin el peaje conceptual.

La conclusión no es que GraphQL sea malo —resuelve muy bien el problema para el
que se creó, y sigue siendo una elección excelente cuando hay clientes
heterogéneos consumiendo datos—. Es que **usarlo como capa interna obligatoria
puso una barrera donde no hacía falta**.

## 🧭 Lo que sí dejó

| Aportación | Dónde sigue |
| --- | --- |
| Generación estática con React como norma | Next.js, Astro, todos los metaframeworks |
| Sistema de complementos para fuentes de datos | El patrón se copió ampliamente |
| Optimización de imágenes integrada | Hoy es expectativa mínima |
| Concepto de sitio estático con contenido remoto | La base de todo el enfoque [@jamstack] |

Gatsby fue **quien normalizó la idea**, y eso explica por qué sus sucesores
parecen obvios hoy.

## 🎓 Las tres lecciones

**1. Complejidad accidental es lo que hay que aprender y no sirve fuera.** El
módulo 11 la puntúa por eso. Una abstracción elegante que exige un lenguaje
propio para tareas simples es un coste que se paga en cada persona que entra al
equipo.

**2. Un declive puede ser ordenado.** Gatsby sigue mantenido, sus sitios siguen
funcionando y el traspaso al resto del ecosistema fue gradual. «Mantenimiento» no
es «abandono», y la diferencia importa para quien tiene un proyecto en marcha.

**3. Una buena tecnología puede estar en el sitio equivocado.** GraphQL no falló:
falló ponerlo en el camino obligatorio de quien solo quería publicar texto.

## 🔗 Enlaces

- Documentación oficial: <https://www.gatsbyjs.com/docs/>
- [Ficha de Next.js](nextjs.md) · [Ficha de Astro](astro.md) — quienes recogieron el testigo
- [Módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)

## Fuentes

- [@porcello-graphql] Porcello, Eve; Banks, Alex. *Learning GraphQL*. O'Reilly Media, 2018. ISBN 9781492030713 — <https://openlibrary.org/isbn/9781492030713>
- [@graphql-spec] *GraphQL Specification*, GraphQL Foundation — <https://spec.graphql.org/>
- [@jamstack] *Jamstack* — <https://jamstack.org/>
