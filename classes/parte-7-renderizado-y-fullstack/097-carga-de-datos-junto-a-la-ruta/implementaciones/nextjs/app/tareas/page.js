import Lista from "../Lista.jsx";
import Traza from "../Traza.jsx";
import { pedirLasTareas } from "../datos.js";

export const dynamic = "force-dynamic";

/**
 * LA CARGA ES UN `await` DENTRO DE LA PÁGINA, Y NADA MÁS.
 *
 * No hay `loader`, no hay `load`, no hay `getServerSideProps`. La página es una
 * función `async` y espera. Es lo más parecido a Astro de los cinco, con una
 * diferencia grande: aquí cualquier componente del árbol puede hacer lo mismo
 * —clase 096—, no solo la página.
 *
 * Lo que se pierde a cambio es lo mismo que pierde Astro: el framework no sabe
 * que esto es una carga de datos. No puede llamarla antes de navegar ni
 * ejecutarla en paralelo con la de otra ruta, porque para él es código.
 */
export default async function Pagina() {
  const tareas = await pedirLasTareas();
  return (
    <>
      <h1>Tareas</h1>
      <Lista tareas={tareas} />
      <Traza />
    </>
  );
}
