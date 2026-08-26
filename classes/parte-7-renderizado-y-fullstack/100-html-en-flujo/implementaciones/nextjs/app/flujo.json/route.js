import { medir } from "../medicion.js";

export const dynamic = "force-dynamic";

export async function GET(peticion) {
  return Response.json({
    framework: "nextjs",
    como_se_declara: "<Suspense fallback={…}> alrededor del componente lento",
    quien_espera: "el componente aplazado, que es async y vive en su propio archivo",
    que_llega_primero: "el documento con el texto de espera en el hueco",
    ...(await medir(peticion.headers.get("host"))),
  });
}
