<script>
  // LA PANTALLA.
  //
  // En SvelteKit no hay tabla que escribir: **las rutas son directorios**.
  // `src/routes/tareas/[id]/+page.svelte` es la ruta `/tareas/:id`, y el
  // parámetro llega en `data`. Es la convención sobre la configuración llevada
  // al enrutado, y es la diferencia más grande con los otros tres.
  //
  // La tabla de este archivo existe porque la clase no usa SvelteKit: enseña el
  // modelo, no el metaframework. Cómo se comporta el metaframework encima es la
  // parte 7.
  let { pantalla, parametros = {} } = $props();
</script>

{#if parametros.id}
  <div data-pantalla={pantalla} data-id={parametros.id}>{pantalla}</div>
{:else}
  <div data-pantalla={pantalla}>{pantalla}</div>
{/if}
