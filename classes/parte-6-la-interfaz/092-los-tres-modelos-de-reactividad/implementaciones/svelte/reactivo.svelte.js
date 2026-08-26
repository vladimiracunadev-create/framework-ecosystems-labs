/**
 * UN MÓDULO `.svelte.js`: RUNAS FUERA DE UN COMPONENTE.
 *
 * Svelte 5 permite usar `$state` y `$effect` en archivos normales, siempre que
 * lleven la extensión `.svelte.js` — porque hay que compilarlos igual que un
 * componente. Es la señal más clara de que en Svelte la reactividad **no es una
 * biblioteca, es sintaxis**: sin compilador, este archivo no es JavaScript
 * válido.
 *
 * Ahí está la diferencia con Vue, que publica `@vue/reactivity` como paquete
 * usable en cualquier sitio. En Svelte el sistema reactivo no se puede importar:
 * se compila.
 */
export function medir(valores) {
  const cuenta = { a: 0, b: 0 };
  let a = $state(valores.a);
  let b = $state(valores.b);

  const parar = $effect.root(() => {
    // Leer la variable es lo que suscribe, igual que en Vue y en Solid. La
    // diferencia es que aquí se lee como una variable normal: el compilador ha
    // puesto el seguimiento por debajo.
    $effect(() => {
      a;
      cuenta.a += 1;
    });
    $effect(() => {
      b;
      cuenta.b += 1;
    });
  });

  return { cuenta, cambiar: () => { a = valores.a + 1; }, parar };
}
