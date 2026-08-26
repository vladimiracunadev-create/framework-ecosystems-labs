import { Links, Meta, Outlet, Scripts } from "@remix-run/react";

/**
 * `<Meta />` ES EL HUECO DONDE REMIX PONE LO QUE CADA RUTA DECLARÓ.
 *
 * Que haya que escribirlo a mano en el documento raíz es coherente con el resto
 * del framework: aquí no hay un documento mágico, hay un componente que devuelve
 * HTML y dos huecos con nombre. Se ve dónde va todo.
 */
export default function App() {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
