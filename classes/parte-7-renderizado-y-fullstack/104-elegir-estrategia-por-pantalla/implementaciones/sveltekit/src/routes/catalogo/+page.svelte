<script>
  let { data } = $props();
</script>

<h1>Catálogo</h1>
<ul data-estrategia="estatico" data-sello={data.marca}>
  {#each data.productos as producto}
    <li>{producto}</li>
  {/each}
</ul>
