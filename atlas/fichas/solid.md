# 🔷 SolidJS — 2018

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

SolidJS tiene la sintaxis de [React](react.md) y **un modelo de ejecución
completamente distinto**: el componente se ejecuta **una sola vez**, y a partir de
ahí solo se actualizan las expresiones que leyeron el dato que cambió.

Es la reactividad de grano fino llevada al extremo, y la mejor demostración de
que **sintaxis y semántica son cosas separables**.

| | |
|---|---|
| **Aparición** | 2018, creado por Ryan Carniato |
| **Clasificación** | `ui-library` |
| **Ecosistema** | JavaScript / TypeScript |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://docs.solidjs.com/> |

---

## 💡 Se parece a React y no se comporta como React

```jsx
function Contador() {
  const [pendientes, setPendientes] = createSignal(0);

  // Este console.log se imprime UNA VEZ, no en cada actualización.
  console.log("el componente se ejecuta");

  return <p>Pendientes: {pendientes()}</p>;   // solo este texto se actualiza
}
```

La diferencia con React es total [@solid-reactivity]:

| | React | SolidJS |
| --- | --- | --- |
| El componente se ejecuta | En cada actualización | **Una sola vez** |
| Qué se actualiza | Se compara el árbol y se aplica la diferencia | La expresión concreta que leyó la señal |
| Se lee el estado | Como variable | **Como función**: `pendientes()` |
| Memorización | A menudo necesaria | Innecesaria por diseño |

La tercera fila es la que despista y es la clave: **leer la señal como función es
lo que permite registrar la dependencia**. Si se lee fuera de un contexto
reactivo, no se registra, y la actualización no ocurre — ese es el error
característico del modelo, igual que en Knockout y en Vue.

## 🧬 De dónde viene

De [Knockout](knockout.md), aunque casi nadie lo diga: valores observables que
registran a sus lectores y avisan solo a ellos. Solid añadió componentes,
sintaxis moderna y un compilador que evita el árbol virtual.

Y su influencia ha ido hacia arriba: [Angular](angular.md), [Svelte](svelte.md) y
[Vue](vue.md) incorporaron o reforzaron modelos de señales después. El
[Atlas](../README.md) lo registra como un caso claro de idea que circula.

## ⚖️ El compromiso

**Se gana** actualización mínima sin memorizar nada, y muy buen rendimiento en
interfaces con mucho dato cambiante.

**Se paga** un modelo mental que hay que aprender **precisamente porque la
sintaxis engaña**: quien llega de React asume que las reglas son las mismas y se
encuentra con que no lo son. Es el mismo aviso de la
[ficha de Fiber](fiber.md): API familiar, semántica distinta.

Y el ecosistema es mucho menor, con la consecuencia habitual para el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md).

## 🎓 Las dos lecciones

**1. Sintaxis y semántica se pueden separar por completo.** Solid lo demuestra
adoptando la de React con otro motor debajo.

**2. Parecerse mucho a algo conocido facilita la entrada y dificulta el
aprendizaje real.** El modelo hay que estudiarlo, no deducirlo.

## 🔗 Enlaces

- Documentación oficial: <https://docs.solidjs.com/>
- [Ficha de React](react.md) · [Ficha de Knockout](knockout.md) · [Ficha de Svelte](svelte.md)
- [Módulo 03](../../curriculum/03-frontend-componentes-y-estado.md)

## Fuentes

- [@solid-reactivity] *Intro to Reactivity*, SolidJS — <https://docs.solidjs.com/concepts/intro-to-reactivity>
