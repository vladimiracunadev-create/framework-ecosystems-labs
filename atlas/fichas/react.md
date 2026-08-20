# ⚛️ React — 2013

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

React es **una biblioteca de interfaz, no un framework**, y esa distinción —que
casi todas las comparativas se saltan— es la clave para entender por qué ganó, y
también por qué necesitó un ecosistema entero a su alrededor.

Su aportación cabe en una fórmula: **`vista = f(estado)`**. En lugar de decirle a
la interfaz *qué cambiar*, describes *cómo debe verse* para un estado dado, y una
capa intermedia averigua el mínimo cambio necesario.

> **🎯 Por qué está en este programa**
>
> **Es el ejemplo canónico de la distinción biblioteca/framework**
> ([módulo 00](../../curriculum/00-taxonomia-y-diagnostico.md)). React no arranca
> tu aplicación, no define su ciclo de vida, no trae enrutado ni acceso a datos.
> Tú la llamas a ella. Angular sí hace todo eso. Compararlas de frente es un error
> de categoría de manual.
>
> **Introdujo el modelo declarativo que después se copió en todas partes**:
> SwiftUI, Jetpack Compose, Flutter y Blazor son, en lo esencial, la misma idea en
> otras plataformas ([módulo 03](../../curriculum/03-frontend-componentes-y-estado.md)).

| | |
|---|---|
| **Aparición** | 2013, publicado por Facebook (hoy Meta) |
| **Clasificación** | `ui-library` — **biblioteca**, no framework |
| **Ecosistema** | JavaScript / TypeScript |
| **Licencia** | `MIT` (fue BSD con cláusula de patentes hasta 2017) |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://react.dev/> |

---

## 📜 El problema que existía

En 2011, Facebook tenía un problema concreto y muy visible: **el contador de
mensajes no cuadraba**. Aparecía un número en la pestaña, otro en la barra
superior y otro al abrir la bandeja. No era un descuido: era la consecuencia
inevitable de un modelo en el que cada parte de la interfaz se actualiza por su
cuenta.

Con el enfoque de la época —jQuery o Backbone— el patrón era este:

```javascript
// Cada vez que cambia el número, hay que acordarse de TODOS los sitios
function alLlegarMensaje(nuevoTotal) {
  $("#pestana-contador").text(nuevoTotal);
  $("#barra-contador").text(nuevoTotal);
  $("#titulo").text("Tienes " + nuevoTotal + " mensajes");
  // ¿y el widget que añadió otro equipo la semana pasada?
}
```

El fallo no está en ninguna línea: está en que **la corrección depende de que
nadie olvide nada**, en un código que crece y que tocan decenas de personas. Es
lo que el [módulo 03](../../curriculum/03-frontend-componentes-y-estado.md) llama
**estado derivado duplicado**, y lo que Backbone ya había señalado sin llegar a
resolver del todo [@osmani-backbone].

El equipo lo explicó en su primera publicación pública sobre React con una frase
que resume la propuesta: en lugar de mutar la interfaz, **volver a describirla
entera** cada vez que el estado cambia [@react-why].

## 💡 La idea: describir, no mutar

```jsx
// El componente no dice "cambia el texto del contador".
// Dice "para este estado, la interfaz se ve así". Siempre.
function Bandeja({ mensajes }) {
  const pendientes = mensajes.filter((m) => !m.leido).length;   // derivado, no guardado
  return (
    <>
      <h1>Bandeja</h1>
      <p>Tienes {pendientes} mensajes sin leer</p>
      <ul>{mensajes.map((m) => <li key={m.id}>{m.asunto}</li>)}</ul>
    </>
  );
}
```

Tres consecuencias, y las tres importan más que la sintaxis:

**1. El estado derivado desaparece como categoría de error.** `pendientes` se
calcula al pintar. No hay ninguna variable que pueda quedar desactualizada porque
no existe ninguna variable.

**2. La función es predecible.** Con los mismos datos de entrada produce la misma
salida. Eso la hace comprobable sin abrir un navegador, y es la misma propiedad
que el [módulo 02](../../curriculum/02-arquitectura-de-frameworks.md) busca al
extraer reglas de dominio a funciones puras.

**3. Alguien tiene que calcular la diferencia.** Volver a describir la interfaz
entera sería carísimo si se aplicara literalmente al documento. React construye
una representación en memoria —el **árbol virtual**— y la compara con la
anterior para aplicar solo lo que cambió [@banks-porcello-learning-react].

## 🔍 El árbol virtual, y por qué se discute

Es la parte que más malentendidos genera. El árbol virtual **no es una
optimización**: es el precio que React paga por permitir el modelo declarativo.

| | Con árbol virtual | Con reactividad de grano fino |
| --- | --- | --- |
| Al cambiar el estado | Se vuelve a ejecutar la función y se compara el resultado | Solo se actualiza lo que leyó ese valor |
| El coste crece con | El tamaño del árbol que se vuelve a describir | El número de dependencias reales |
| Modelo mental | Simple: «se ejecuta todo otra vez» | Requiere entender qué depende de qué |
| Representantes | React, Preact | SolidJS, Svelte 5, Vue, Knockout |

Rich Harris, autor de Svelte, tituló su crítica de forma deliberadamente
provocadora: el árbol virtual es *puro sobrecoste* [@svelte-vdom-essay]. El
argumento es correcto en su detalle técnico y también incompleto: el sobrecoste
compra un modelo mental más simple, y la simplicidad es una propiedad de diseño
con valor propio, no un capricho [@ousterhout-philosophy].

Para la comparación honesta del [módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md)
la conclusión es la de siempre: **es un compromiso, no una jerarquía**, y decidir
cuál conviene exige medir tu caso con un protocolo declarado.

## ⚖️ Lo que React no trae

Aquí está la consecuencia práctica de ser una biblioteca. Para construir un
producto real hace falta decidir, integrar y mantener:

| Necesidad | React trae | Hay que elegir |
| --- | --- | --- |
| Renderizar componentes | ✅ | — |
| Estado local del componente | ✅ | — |
| Enrutado | ❌ | React Router, TanStack Router… |
| Datos del servidor y caché | ❌ | TanStack Query, SWR, Apollo… |
| Estado global | ❌ | Zustand, Redux, Jotai, contexto… |
| Formularios y validación | ❌ | React Hook Form, Formik… |
| Construcción y empaquetado | ❌ | Vite, webpack… |
| Renderizado en servidor | Parcial | Next.js, Remix… |

Cada fila es una decisión con su propio ciclo de vida, su propio mantenedor y su
propio riesgo. **Ese es el coste real de la libertad**, y es lo que el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) obliga a puntuar:
no es «React frente a Angular», es «React más ocho decisiones frente a Angular».

Los metaframeworks —Next.js, Remix— existen exactamente para tomar esas ocho
decisiones por ti, y por eso terminan siendo la forma en que la mayoría de la
gente usa React.

## 🔄 Lo que se ha modernizado

React de 2013 y React de hoy comparten la idea y poco más:

- **Componentes de clase → funciones con enganches** (2019). Un cambio de modelo
  mental completo, hecho **sin romper compatibilidad**: ambos conviven. Es el
  contraejemplo perfecto de la migración de AngularJS a Angular.
- **Licencia MIT** desde 2017, tras la retirada de la cláusula de patentes que
  frenó su adopción en muchas empresas. Un cambio de licencia que costó adopción
  real, justo lo que el módulo 11 pide vigilar.
- **Renderizado concurrente**: la actualización puede interrumpirse para que la
  interfaz siga respondiendo.
- **Componentes de servidor**: componentes que se ejecutan solo en el servidor y
  nunca llegan al navegador [@react-server-components]. Es React acercándose al
  problema que Astro y Qwik atacan por otro lado.

## 🎓 Las cuatro lecciones

**1. Clasificar antes de comparar.** React es una biblioteca. Toda comparación
con un framework completo debe declarar qué se añadió para igualar el alcance, o
no significa nada ([módulo 00](../../curriculum/00-taxonomia-y-diagnostico.md)).

**2. Un modelo mental simple vale lo que cuesta.** React no ganó por ser el más
rápido: ganó porque «se ejecuta todo otra vez y yo calculo la diferencia» es
mucho más fácil de sostener en un equipo grande que un grafo de dependencias
[@ousterhout-philosophy].

**3. La libertad se paga en decisiones.** Ocho piezas que elegir es ocho
superficies que mantener y auditar. No es peor que la alternativa: es distinto, y
hay que contarlo.

**4. Se puede cambiar de paradigma sin romper.** El paso a los enganches movió el
modelo entero conservando el código existente. Es el listón contra el que hay que
medir cualquier migración mayor.

## 🔗 Enlaces

- Documentación oficial: <https://react.dev/>
- [Ecosistema JavaScript](../ecosistemas/javascript.md) · [Ficha de jQuery](jquery.md) · [Ficha de Astro](astro.md)
- [Módulo 03](../../curriculum/03-frontend-componentes-y-estado.md) — componentes y estado sin depender del framework

## Fuentes

- [@banks-porcello-learning-react] Banks, Alex; Porcello, Eve. *Learning React: Modern Patterns for Developing React Apps*, 2.ª ed. O'Reilly Media, 2020. ISBN 9781492051725 — <https://openlibrary.org/isbn/9781492051725>
- [@osmani-backbone] Osmani, Addy. *Developing Backbone.js Applications*. O'Reilly Media, 2012. ISBN 9781449328252 — <https://openlibrary.org/isbn/9781449328252>
- [@ousterhout-philosophy] Ousterhout, John K. *A Philosophy of Software Design*, 2.ª ed. Yaknyam Press, 2021. ISBN 9781732102217 — <https://openlibrary.org/isbn/9781732102217>
- [@react-why] *Why did we build React?*, Meta — React, 2013 — <https://legacy.reactjs.org/blog/2013/06/05/why-react.html>
- [@react-server-components] *React Server Components*, Meta — React — <https://react.dev/reference/rsc/server-components>
- [@svelte-vdom-essay] Harris, Rich. *Virtual DOM is pure overhead*, Svelte, 2018 — <https://svelte.dev/blog/virtual-dom-is-pure-overhead>
