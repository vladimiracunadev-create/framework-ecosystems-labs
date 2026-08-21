<script>
  // Dos rarezas de Svelte que esta clase saca a la luz, las dos del
  // COMPILADOR:
  //
  // 1. Se queda con los `<script>` que aparecen en la plantilla —son el
  //    bloque de script del componente—, así que un script con nonce hay que
  //    emitirlo por la vía cruda.
  // 2. Valida el anidamiento HTML en tiempo de COMPILACIÓN: un `<div>`
  //    dentro de `<html>` es un error de compilación, no una advertencia en
  //    consola. Los otros tres del elenco lo renderizan sin protestar.
  //
  // Las dos son la razón por la que SvelteKit no deja la política en manos
  // del componente y la genera él.
  let { nonce, inyectado } = $props();
  const legitimo = `<scr${"ipt"} nonce="${nonce}">window.saludo=1</scr${"ipt"}>`;
</script>

{@html legitimo}
<!-- El XSS que entró por la puerta explícita: {@html} con contenido ajeno. -->
<div>{@html inyectado}</div>
