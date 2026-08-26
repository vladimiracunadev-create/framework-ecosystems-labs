<script>
  import Nieto from "./NietoPorPropiedades.svelte";

  // OTRO NIVEL INTERMEDIO. Igual: lo acepta porque el de abajo lo necesita.
  let { usuario } = $props();
</script>

<div data-nivel="medio"><Nieto {usuario} /></div>
