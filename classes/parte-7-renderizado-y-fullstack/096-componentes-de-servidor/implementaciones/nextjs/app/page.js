import Inventario from "./Inventario.jsx";
import Marco from "./Marco.jsx";

export const dynamic = "force-dynamic";

/**
 * Un componente de servidor dentro de uno de cliente, sin que el de servidor
 * pierda nada: sigue leyendo el disco.
 *
 * Fíjate en lo que NO hay aquí: ninguna función de carga de datos, ningún
 * `loader`, ningún objeto que baje por propiedades. La página compone y ya está;
 * quien necesita el dato va a buscarlo.
 */
export default function Pagina() {
  return (
    <>
      <h1>Componentes de servidor</h1>
      <Marco>
        <Inventario />
      </Marco>
    </>
  );
}
