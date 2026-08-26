<script>
  import { anotar } from "./registro.js";

  // EL COMPONENTE. El bloque `<script>` de un componente de Svelte se ejecuta al
  // instanciarlo, y al renderizar en el servidor eso pasa DESPUÉS de que `load`
  // haya terminado. De ahí sale el `render` al final de la secuencia.
  let { tareas } = $props();
  anotar("render");
</script>

<ul data-lista="tareas">
  {#each tareas as tarea}
    <li data-tarea={tarea.id}>
      <a href="/tareas/{tarea.id}">{tarea.texto}</a>
    </li>
  {/each}
</ul>
