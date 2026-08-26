<script>
  import Medio from "./MedioPorAlmacen.svelte";

  // Solo sabe de qué lado está. Del usuario, nada.
  let { lado = "unica" } = $props();
</script>

<div data-nivel="rama" data-rama={lado}><Medio /></div>
