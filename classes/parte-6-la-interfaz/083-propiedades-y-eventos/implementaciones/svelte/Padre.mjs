/**
 * EL MANEJADOR DEL PADRE.
 *
 * Está en un archivo `.mjs` y no en un `.svelte` a propósito: **no necesita
 * componente**. Una función que calcula el estado siguiente a partir del actual
 * y de un evento es JavaScript corriente, se prueba sola y no se compila.
 *
 * Separarla así es lo que permite que el contrato la llame sin navegador — y en
 * un proyecto real, lo que permite probar la lógica sin montar la interfaz.
 */
export function alRecibirCambio(valorActual, paso) {
  return valorActual + paso;
}
