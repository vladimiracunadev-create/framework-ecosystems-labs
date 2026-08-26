import { Links, Meta, Outlet, Scripts } from "@remix-run/react";

/**
 * `<Scripts />` ES LA HIDRATACIÓN, Y ES UNA LÍNEA.
 *
 * Ahí se emiten dos cosas: el estado que devolvieron los `loader` —dentro de un
 * guion en línea— y el enlace al código de la aplicación. Quitar esta línea deja
 * un sitio que sigue funcionando con formularios y enlaces, que es la mejora
 * progresiva de la clase 081.
 *
 * Lo que Remix no ofrece es quitarla **para una ruta**: o está para todas o no
 * está para ninguna. Es el precio de no tener modos.
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
