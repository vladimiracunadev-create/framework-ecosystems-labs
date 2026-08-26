<script>
  import Rama from "./RamaPorAlmacen.svelte";

  // EL MISMO ÁRBOL, SIN QUE EL DATO LO ATRAVIESE.
  //
  // Ni este archivo ni los dos intermedios declaran nada. Compara sus `$props()`
  // con los de la versión anterior: ahí está el coste, y aquí su ausencia.
  let { dos = false } = $props();
</script>

{#if dos}
  <div data-nivel="pantalla"><Rama lado="izquierda" /><Rama lado="derecha" /></div>
{:else}
  <div data-nivel="pantalla"><Rama /></div>
{/if}
