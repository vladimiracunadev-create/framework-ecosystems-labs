import { medir } from "../medicion.js";

/** El `loader` recibe la petición estándar de la plataforma web. */
export async function loader({ request }) {
  const medido = await medir(request.headers.get("host"));
  return Response.json({
    framework: "remix",
    hidrata: true,
    que_hidrata: "la aplicación entera, sin excepciones por ruta",
    mecanismo: "un guion en línea con window.__remixContext y los datos de los loader",
    por_omision: "hidratar, y sin interruptor: o está <Scripts /> o no está",
    ...medido,
  });
}
