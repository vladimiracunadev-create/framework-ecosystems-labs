import { medir } from "../medicion.js";

export const dynamic = "force-dynamic";

/** El manejador de ruta recibe la petición entera, así que el `Host` sale de
 *  donde tiene que salir: de quien pidió. */
export async function GET(peticion) {
  const medido = await medir(peticion.headers.get("host"));
  return Response.json({
    framework: "nextjs",
    hidrata: true,
    que_hidrata: "todo archivo con \"use client\" y todo lo que ese archivo importe",
    mecanismo: "la carga RSC, empujada en trozos con self.__next_f.push",
    por_omision: "no hidratar: en el App Router un componente es de servidor salvo que se diga lo contrario",
    ...medido,
  });
}
