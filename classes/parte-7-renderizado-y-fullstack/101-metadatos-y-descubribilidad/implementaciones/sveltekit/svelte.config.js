import adapter from "@sveltejs/adapter-node";

/**
 * `adapter-node` produce un servidor de Node, que es lo que esta clase necesita:
 * el endpoint `/coste.json` se pide a sí mismo por HTTP, y para eso tiene que
 * haber alguien escuchando.
 *
 * Con `adapter-static` no habría servidor, ni medición, ni pantalla que se
 * renderice en el servidor. El adaptador no es un detalle de despliegue: decide
 * qué es posible.
 */
export default {
  kit: { adapter: adapter() },
};
