import { Links, Meta, Outlet, Scripts } from "@remix-run/react";

/**
 * EL DOCUMENTO, ESCRITO A MANO.
 *
 * `<Meta>` y `<Links>` reciben lo que cada ruta declare —clase 101— y
 * `<Scripts>` es lo que activa la aplicación en el navegador. Quitar
 * `<Scripts>` deja una página que sigue funcionando: es la mejora progresiva de
 * la clase 081, aquí como opción de una línea.
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
