<script>
  // La puerta explícita: {@html} inyecta sin escapar. La documentación de
  // Svelte abre su descripción con la advertencia de XSS.
  let { texto } = $props();
</script>

<div>{@html texto}</div>
