<script>
  // El caso base: un formulario de verdad, con method y action. En SvelteKit
  // esta idea tiene nombre y azúcar — las form actions y use:enhance, que
  // interceptan ESTE mismo formulario cuando hay JavaScript y lo dejan en
  // paz cuando no. Aquí, sin meta-framework, se sirve el caso base y la
  // bifurcación vive en el servidor.
  let { tareas } = $props();
</script>

<form method="post" action="/tareas">
  <input name="titulo" value="">
  <button type="submit">Crear</button>
</form>

<ul>
  {#each tareas as tarea (tarea.id)}
    <li data-id={tarea.id}>{tarea.titulo}</li>
  {/each}
</ul>
