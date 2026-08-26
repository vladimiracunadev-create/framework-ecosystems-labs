import { Outlet, useLoaderData } from "@remix-run/react";

import { pedirUsuario } from "../fuente.js";

/**
 * LA RUTA PADRE, CON SU PROPIA CARGA.
 *
 * Aquí está la ventaja de Remix que no se ve en un archivo suelto: **este
 * `loader` y el de la ruta hija se ejecutan a la vez**, no en cadena. Remix
 * conoce las dos rutas antes de empezar, sabe qué `loader` tiene cada una y las
 * lanza todas juntas.
 *
 * En un framework donde el diseño de la pantalla carga sus datos y luego pinta a
 * sus hijos, eso no puede pasar: el hijo no existe hasta que el padre termina.
 * `/cascada.json` mide la diferencia.
 */
export async function loader() {
  return { usuario: await pedirUsuario() };
}

export default function Anidada() {
  const { usuario } = useLoaderData();
  return (
    <div data-capa="padre" data-usuario={usuario.nombre}>
      <Outlet />
    </div>
  );
}
