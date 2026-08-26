<script>
  import Lista from "$lib/Lista.svelte";
  import Traza from "$lib/Traza.svelte";

  // El componente recibe lo que `load` devolvió. No pide nada y no espera nada.
  let { data } = $props();
</script>

<h1>Tareas</h1>
<Lista tareas={data.tareas} />
<Traza />
