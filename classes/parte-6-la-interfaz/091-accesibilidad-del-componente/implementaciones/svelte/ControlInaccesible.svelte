<script>
  // LA VERSIÓN INACCESIBLE. Se ve exactamente igual.
  //
  // El `onclick` en el `<div>` está puesto a propósito: es lo que convierte a
  // ese div en un botón falso, y es exactamente lo que el compilador de Svelte
  // detecta. Al compilar este archivo salen avisos de accesibilidad SIN haber
  // instalado nada, y esos avisos se publican en `/accesibilidad.json`.
  //
  // Ninguno de los otros tres frameworks del elenco dice nada aquí.
  let { abierto = false } = $props();
</script>

<div data-version="inaccesible">
  <div class={abierto ? "boton abierto" : "boton"} onclick={() => {}}>Detalles</div>
  <div class={abierto ? "panel visible" : "panel"}>contenido</div>
  <span class="etiqueta">Título</span>
  <input name="titulo" tabindex="-1" />
</div>
