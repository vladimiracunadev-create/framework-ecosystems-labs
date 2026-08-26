<script>
  import Medio from "./MedioPorPropiedades.svelte";

  // NIVEL INTERMEDIO. Recibe `usuario` y no lo usa: solo lo pasa.
  let { usuario } = $props();
</script>

<div data-nivel="rama"><Medio {usuario} /></div>
