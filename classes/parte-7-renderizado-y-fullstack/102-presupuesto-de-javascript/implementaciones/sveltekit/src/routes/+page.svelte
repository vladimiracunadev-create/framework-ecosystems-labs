<script>
  // Lo único interactivo de la pantalla.
  let veces = $state(0);
</script>

<h1 data-pantalla="presupuesto">Una pantalla con un botón</h1>
<button data-cuenta={veces} onclick={() => (veces += 1)}>
  Pulsado {veces} veces
</button>
