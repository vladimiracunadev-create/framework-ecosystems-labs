/**
 * EL DISEÑO RAÍZ, obligatorio en el enrutador de aplicación de Next.
 *
 * Aquí se escriben `<html>` y `<body>` a mano, cosa que en el enrutador antiguo
 * hacía el framework. Es más ceremonia y a cambio quita una capa de magia: el
 * documento es tuyo.
 */
export const metadata = { title: "Clase 093" };

export default function DisenoRaiz({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
