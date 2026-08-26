import ListaViva from "../app/ListaViva.jsx";
import { TAREAS } from "./datos.js";

export const dynamic = "force-dynamic";

/**
 * Esta página es un componente de servidor: su código NO viaja al navegador.
 * Lo que viaja es `ListaViva`, porque lleva `"use client"`, y con él viajan sus
 * propiedades: la lista entera, serializada dentro del HTML.
 *
 * Ese es el peaje que el App Router cobra por cruzar la frontera. Todo lo que se
 * pasa de un componente de servidor a uno de cliente tiene que poder
 * serializarse, y todo lo que se serializa **se envía**. El dato que ya está
 * pintado en el `<ul>` viaja otra vez para que el navegador pueda repetir el
 * render y llegar al mismo sitio.
 */
export default function Pagina() {
  return (
    <>
      <h1>Hidratación</h1>
      <ListaViva tareas={TAREAS} />
    </>
  );
}
