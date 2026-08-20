# 🧡 Svelte — 2016

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Svelte parte de una observación que suena a provocación y es un argumento
técnico: **buena parte del trabajo que un framework hace en el navegador podría
hacerse antes, al construir**. Su propuesta es mover el framework de la fase de
ejecución a la de compilación.

> **🎯 Por qué está en este programa**
>
> Porque hace explícito un compromiso que casi nadie enuncia
> ([módulo 04](../../curriculum/04-fullstack-y-renderizado.md) y
> [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)): **cambiar coste
> de ejecución por dependencia de la fase de construcción**. No es una mejora
> gratuita: es mover el gasto de sitio, y hay que saber a dónde.

| | |
|---|---|
| **Aparición** | 2016, creado por Rich Harris |
| **Clasificación** | `ui-framework` — con compilador |
| **Ecosistema** | JavaScript / TypeScript |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://svelte.dev/docs/svelte> |

---

## 📜 La tesis

Rich Harris la publicó con un título deliberadamente incómodo: **el árbol virtual
es puro sobrecoste** [@svelte-vdom-essay]. El argumento, resumido sin caricatura:

1. React vuelve a ejecutar la función del componente y construye una
   representación nueva de la interfaz.
2. La compara con la anterior para averiguar qué cambió.
3. Aplica esa diferencia al documento.

Los pasos 1 y 2 son **trabajo que solo existe porque el framework no sabe qué
cambió**. Pero un compilador que lee tu componente **sí puede saberlo**: ve qué
expresión depende de qué variable y puede generar el código exacto que actualiza
solo eso.

## 💡 Cómo se ve

```svelte
<script>
  let tareas = $state([]);
  // El compilador ve que esto depende de `tareas` y genera la actualización mínima.
  let pendientes = $derived(tareas.filter((t) => !t.done).length);
</script>

<h1>Tareas</h1>
<p>Pendientes: {pendientes}</p>
<button disabled={pendientes === 0}>Completar una</button>
```

No hay biblioteca de tiempo de ejecución que compare árboles. El código que llega
al navegador es, aproximadamente, el que habrías escrito a mano para actualizar
ese `<p>` — pero sin escribirlo.

Svelte 5 sustituyó su sistema de reactividad original —basado en asignaciones que
el compilador interceptaba— por **runas**: marcas explícitas de qué es estado y
qué es derivado [@svelte-runes]. El motivo es instructivo: el sistema anterior era
más mágico y **fallaba de formas difíciles de explicar** cuando el estado salía
del archivo del componente [@volkmann-svelte]. Es el aviso del
[módulo 02](../../curriculum/02-arquitectura-de-frameworks.md) aplicado a sí
mismo: *cuanto más implícito, mejor debe ser el diagnóstico* — y aquí el propio
proyecto concluyó que compensaba ser más explícito.

## ⚖️ Lo que se gana y lo que se paga

### Se gana

- **Menos código enviado** al navegador: no hay runtime de comparación.
- **Menos trabajo en ejecución**, sobre todo en dispositivos modestos.
- **Componentes muy legibles**: plantilla, lógica y estilos con poca ceremonia.

### Se paga

**1. Dependencia total de la fase de construcción.** Sin compilador no hay
Svelte. Eso descarta escenarios que otras bibliotecas permiten —añadir un
componente a una página existente sin herramientas— y ata el proyecto a la salud
del ecosistema de construcción. El módulo 11 lo trata como una dimensión de la
estrategia de salida.

**2. Lo que ejecutas no es lo que escribiste.** Al depurar ves el código
generado. Es un coste real de diagnóstico, el mismo que tienen todos los
lenguajes que se compilan a otro.

**3. Ecosistema menor.** Menos componentes de terceros, menos respuestas
publicadas, menos personas disponibles. A cambio, más coherencia.

## 🧬 Su lugar

Svelte comparte diagnóstico con SolidJS —ambos evitan el árbol virtual— y difiere
en el medio: Solid lo consigue con reactividad fina **en ejecución**, Svelte con
un **compilador**. Que dos proyectos lleguen a resultados parecidos por caminos
opuestos es la mejor prueba de que el problema era real.

Y su metaframework, SvelteKit, añade una decisión que el módulo 11 aprecia: los
**adaptadores de despliegue** intercambiables son una estrategia de salida
incorporada al diseño.

## 🎓 Las tres lecciones

**1. Mover trabajo a la compilación es un compromiso, no una victoria.** Se paga
en dependencia de herramientas y en distancia entre lo escrito y lo ejecutado.

**2. Un proyecto puede reconocer que su magia era excesiva.** El paso a runas fue
elegir explicitud sobre elegancia, y es un ejemplo poco frecuente de
autocorrección.

**3. La misma conclusión desde caminos distintos refuerza el diagnóstico.** Solid
y Svelte discrepan en el método y coinciden en el problema.

## 🔗 Enlaces

- Documentación oficial: <https://svelte.dev/docs/svelte>
- [Ficha de React](react.md) — el modelo que critica · [Ficha de Vue](vue.md) · [Ficha de Knockout](knockout.md)
- [Módulo 03](../../curriculum/03-frontend-componentes-y-estado.md)

## Fuentes

- [@volkmann-svelte] Volkmann, Mark. *Svelte and Sapper in Action*. Manning Publications, 2020. ISBN 9781617297946 — <https://openlibrary.org/isbn/9781617297946>
- [@svelte-vdom-essay] Harris, Rich. *Virtual DOM is pure overhead*, Svelte, 2018 — <https://svelte.dev/blog/virtual-dom-is-pure-overhead>
- [@svelte-runes] *Introducing runes*, Svelte — <https://svelte.dev/blog/runes>
