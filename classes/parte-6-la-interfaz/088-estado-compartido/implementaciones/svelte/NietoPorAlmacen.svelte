<script>
  import { leer } from "./almacen.mjs";

  // Lo pide directamente. En un proyecto real esto sería `$almacen` con un
  // almacén de la biblioteca estándar de Svelte, o `getContext`.
</script>

<span data-nivel="nieto">{leer()}</span>
