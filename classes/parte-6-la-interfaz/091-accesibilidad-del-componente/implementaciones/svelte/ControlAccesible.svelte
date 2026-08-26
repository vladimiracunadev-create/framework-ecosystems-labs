<script>
  // LA VERSIÓN ACCESIBLE.
  //
  // Svelte es el único de los cuatro cuyo COMPILADOR avisa de problemas de
  // accesibilidad. Escribir un `<div>` con `on:click` y sin papel produce un
  // aviso de compilación —`a11y_click_events_have_key_events`— sin instalar
  // nada.
  //
  // No es un verificador completo, y el equipo lo dice: cubre lo que se puede
  // deducir del marcado estático. Pero que venga en la caja cambia cuánta gente
  // lo ve, y eso es la diferencia entre una regla y una costumbre.
  let { abierto = false } = $props();
</script>

<div data-version="accesible">
  <button type="button" aria-expanded={abierto ? "true" : "false"} aria-controls="panel">
    Detalles
  </button>
  <div id="panel" hidden={!abierto}>contenido</div>
  <label for="titulo">Título</label>
  <input id="titulo" name="titulo" />
</div>
