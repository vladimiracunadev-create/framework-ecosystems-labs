<script>
  let { data } = $props();
</script>

<main>
  <h1 data-parte="cabecera">Hola, {data.nombre}</h1>
  <!--
    `{#await}` es la otra mitad: mientras la promesa no se resuelve se pinta lo
    de en medio, y cuando llega se sustituye. Es el equivalente exacto de
    `<Suspense>`, escrito como una estructura de control del lenguaje de
    plantillas en lugar de como un componente.
  -->
  {#await data.tareas}
    <p data-parte="esperando">cargando la lista…</p>
  {:then tareas}
    <ul data-parte="lista">
      {#each tareas as tarea}
        <li>{tarea}</li>
      {/each}
    </ul>
  {/await}
</main>
