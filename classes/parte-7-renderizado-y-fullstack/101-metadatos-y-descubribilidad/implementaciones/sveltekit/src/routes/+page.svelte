<script>
  import Cabeza from "$lib/Cabeza.svelte";
  let { data } = $props();
</script>

<Cabeza meta={data.meta} origen={data.origen} />
<h1>{data.meta.titulo}</h1>
<a href="/articulo/hola-mundo">un artículo</a>
