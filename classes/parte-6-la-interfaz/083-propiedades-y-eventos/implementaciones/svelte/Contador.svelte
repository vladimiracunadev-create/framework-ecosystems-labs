<script>
  // EL HIJO. Recibe el valor y la función de aviso, las dos por `$props()`.
  //
  // En Svelte 5 los eventos personalizados se fueron: lo que antes era
  // `createEventDispatcher` ahora es una propiedad que resulta ser función,
  // exactamente como en React. Es uno de los cambios más discutidos de la
  // versión 5, y la razón es la simetría — un solo canal en lugar de dos.
  //
  // La regla se mantiene: el hijo NO cambia `valor`. Avisa con `alCambiar`.
  let { valor, alCambiar } = $props();
</script>

<div data-hijo="contador" data-valor={valor}>
  <span>{valor}</span>
  <button onclick={() => alCambiar(1)}>+1</button>
  <button onclick={() => alCambiar(-1)}>-1</button>
</div>
