/**
 * EL MISMO COMPONENTE, SIN PODER LEER NADA.
 *
 * Compara este archivo con el de Next: allí, `Inventario` importa el módulo del
 * servidor y llama a `cuantasCosasHay()`. Aquí no puede, porque este archivo
 * viaja al navegador y `node:fs` no existe allí.
 *
 * Así que recibe el número ya hecho. Funciona perfectamente, y esa es la mitad
 * honesta de la comparación: **lo que los componentes de servidor resuelven no
 * es un problema de imposibilidad, es uno de acoplamiento**. El dato tiene que
 * atravesar todo lo que haya entre la ruta y quien lo usa.
 */
export default function Inventario({ cuantos }) {
  return (
    <p data-desde="el-disco" data-cuantos={cuantos}>
      El almacén tiene {cuantos} artículos distintos.
    </p>
  );
}
