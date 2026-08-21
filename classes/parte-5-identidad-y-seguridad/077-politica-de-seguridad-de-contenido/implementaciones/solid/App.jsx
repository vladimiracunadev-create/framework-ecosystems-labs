import { renderToString } from "solid-js/web";

// Continuación de la 073: el escapado falló —alguien usó `innerHTML` con
// contenido de un usuario— y ese script está en la página. La política de
// seguridad de contenido es la red que hay debajo.
export const pagina = (nonce, inyectado) =>
  renderToString(() => (
    <html>
      {/* El script legítimo lleva el nonce de ESTA respuesta. */}
      <script nonce={nonce} innerHTML="window.saludo=1" />
      {/* El XSS que entró por la puerta explícita. */}
      <div innerHTML={inyectado} />
    </html>
  ));
