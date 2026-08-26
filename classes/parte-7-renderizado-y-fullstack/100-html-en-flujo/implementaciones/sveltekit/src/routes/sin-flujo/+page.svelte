<script>
  let { data } = $props();
</script>

<main>
  <h1 data-parte="cabecera">Hola, {data.nombre}</h1>
  <ul data-parte="lista">
    {#each data.tareas as tarea}
      <li>{tarea}</li>
    {/each}
  </ul>
</main>
