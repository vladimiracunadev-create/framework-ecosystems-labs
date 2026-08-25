<script>
  import { siguiente } from "./reglas.mjs";

  // `$state` DECLARA UN DATO QUE VIVE DENTRO.
  //
  // Y aquí Svelte 5 hace algo que ninguno de los otros siete: `valor` se lee y
  // se escribe como una variable normal. No hay `.value`, no hay función
  // `ponerValor`, no hay `$emit`. La runa marca la variable como reactiva y el
  // COMPILADOR se encarga del resto.
  //
  // Ese es el argumento de Svelte entero: si hay un compilador, la sintaxis no
  // tiene por qué pagar el precio de la reactividad.
  let { id = "sola", inicial = 0 } = $props();
  let valor = $state(inicial);
</script>

<div data-instancia={id} data-valor={valor}>
  <span>{valor}</span>
  <button onclick={() => (valor = siguiente(valor, 1))}>+1</button>
  <button onclick={() => (valor = siguiente(valor, -1))}>-1</button>
</div>
