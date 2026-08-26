import Articulo from "./Articulo.jsx";
import Contador from "./Contador.jsx";
import Filtro from "./Filtro.jsx";
import { TAREAS } from "./datos.js";

export const dynamic = "force-dynamic";

/**
 * La misma página, con las mismas dos zonas vivas.
 *
 * Fíjate en que aquí no hay ninguna directiva: la frontera está dentro de cada
 * componente, no en el sitio donde se usa. Es la decisión de diseño opuesta a la
 * de Astro, y tiene una consecuencia práctica: para saber si algo va al
 * navegador hay que abrir el archivo del componente, no la página.
 */
export default function Pagina() {
  return (
    <>
      <h1>Islas</h1>
      <Articulo />
      <Contador />
      <Filtro tareas={TAREAS} />
    </>
  );
}
