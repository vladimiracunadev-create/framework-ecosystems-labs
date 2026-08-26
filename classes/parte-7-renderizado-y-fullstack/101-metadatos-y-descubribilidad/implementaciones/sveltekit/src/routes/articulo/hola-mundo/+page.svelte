<script>
  import Cabeza from "$lib/Cabeza.svelte";
  let { data } = $props();
</script>

<Cabeza meta={data.meta} origen={data.origen} />
<svelte:head>
  <!--
    `{@html}` escribe sin escapar, que es lo que necesita un JSON dentro de un
    `<script>`. Los tres frameworks de plantilla tienen esta capacidad con tres
    nombres distintos y el mismo peligro — la clase 077.
  -->
  {@html `<script type="application/ld+json">${JSON.stringify(data.grafo)}<` + `/script>`}
</svelte:head>

<h1>{data.meta.titulo}</h1>
<p>{data.meta.descripcion}</p>
