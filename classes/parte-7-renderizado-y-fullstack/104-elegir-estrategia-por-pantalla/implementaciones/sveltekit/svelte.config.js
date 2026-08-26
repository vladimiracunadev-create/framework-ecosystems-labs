import adapter from "@sveltejs/adapter-node";

/**
 * EL ADAPTADOR DECIDE DÓNDE VA A CORRER ESTO.
 *
 * SvelteKit no supone un destino: `adapter-node` produce un servidor de Node,
 * `adapter-static` produce archivos, y hay adaptadores para las plataformas de
 * despliegue. El mismo código fuente sale de una forma o de otra según cuál se
 * ponga aquí.
 *
 * Es una decisión de arquitectura escondida en una línea de configuración, y
 * conviene saber que existe: cambiar de adaptador cambia qué estrategias están
 * disponibles.
 */
export default {
  kit: { adapter: adapter() },
};
