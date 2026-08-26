import { medir } from "../medicion.js";

export async function loader({ request }) {
  return Response.json({
    framework: "remix",
    como_se_declara: "no poniendo el await: el loader devuelve la promesa sin resolver",
    quien_espera: "<Suspense> con <Await resolve={…}> dentro",
    que_llega_primero: "el documento con el texto de espera en el hueco",
    ...(await medir(request.headers.get("host"))),
  });
}
