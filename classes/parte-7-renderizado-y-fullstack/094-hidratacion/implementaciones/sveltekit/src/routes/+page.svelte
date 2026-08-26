<script>
  // El mismo componente que se ejecutó en el servidor se ejecuta otra vez en el
  // navegador. `$state(0)` sale 0 las dos veces: el trabajo se repite entero
  // para que el `onclick` de abajo llegue a existir.
  //
  // Svelte tiene aquí una ventaja de tamaño —el compilador no manda un motor de
  // árbol virtual al navegador— pero no de naturaleza: el componente se vuelve a
  // ejecutar igual.
  let { data } = $props();
  let miradas = $state(0);
</script>

<h1>Hidratación</h1>
<section data-hidratacion="pendiente">
  <ul>
    {#each data.tareas as tarea}
      <li>{tarea}</li>
    {/each}
  </ul>
  <button
    data-interactivo="si"
    data-cuenta={miradas}
    onclick={() => (miradas += 1)}
  >
    He mirado la lista {miradas} veces
  </button>
</section>
