<script>
  import Traza from "$lib/Traza.svelte";
  import { anotar } from "$lib/registro.js";

  let { data } = $props();
  anotar("render");
</script>

<h1 data-tarea={data.tarea.id}>{data.tarea.texto}</h1>
<a href="/tareas">volver</a>
<Traza />
