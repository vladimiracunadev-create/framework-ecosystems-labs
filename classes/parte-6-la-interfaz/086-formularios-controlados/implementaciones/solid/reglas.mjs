/**
 * LA FUNCIÓN QUE CALCULA EL VALOR SIGUIENTE.
 *
 * Es el corazón de un campo controlado: cada pulsación no escribe en el campo,
 * **produce un valor nuevo** que pasa por aquí antes de volver a la pantalla.
 *
 * Eso permite dos cosas que un campo no controlado no da:
 *
 *   - NORMALIZAR — aquí, pasar la primera letra a minúscula al pegarla;
 *   - LIMITAR — aquí, diez caracteres, aplicados ANTES de escribir.
 *
 * «Antes de escribir» no es un detalle de estilo. Un límite aplicado después
 * deja que el usuario vea el carácter aparecer y desaparecer; aplicado antes, el
 * carácter no llega a existir.
 */
export const LIMITE = 10;

export function siguiente(valorActual, tecla) {
  const propuesto = `${valorActual}${tecla}`.toLowerCase();
  return propuesto.length > LIMITE ? valorActual : propuesto;
}
