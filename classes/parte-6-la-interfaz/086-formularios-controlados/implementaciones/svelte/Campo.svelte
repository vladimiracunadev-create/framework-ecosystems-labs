<script>
  import { siguiente } from "./reglas.mjs";

  // SVELTE TAMBIÉN TIENE ATAJO: `bind:value`.
  //
  // Y en Svelte 5 es más que azúcar sintáctico: con `$bindable()`, un componente
  // puede declarar que una de sus propiedades es de DOS DIRECCIONES, y el padre
  // se ata a ella con `bind:`. Ninguno de los otros tres deja que la propiedad
  // misma sea bidireccional.
  //
  // Aquí no se usa el atajo a propósito: escribir las dos mitades —`value` y
  // `oninput`— es lo que deja ver dónde encaja la normalización. Con
  // `bind:value` puro no hay hueco donde meterla, igual que con `v-model`.
  let { texto = "", alEscribir = () => {} } = $props();
</script>

<input
  data-campo="controlado"
  value={texto}
  oninput={(evento) => alEscribir(siguiente(texto, evento.target.value.slice(-1)))}
/>
