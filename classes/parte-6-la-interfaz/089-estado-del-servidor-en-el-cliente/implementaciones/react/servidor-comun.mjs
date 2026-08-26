import { readFileSync } from "node:fs";

import { PLAZO_MS, contador, invalidar, leer, reiniciar } from "./cache.mjs";

/**
 * LAS RUTAS, IGUALES EN LAS CUATRO IMPLEMENTACIONES.
 *
 * La caché es lógica pura y no depende del framework, así que las rutas que la
 * ejercitan tampoco. Lo que cambia entre las cuatro es **cómo la consume un
 * componente** y **qué biblioteca resuelve esto en su ecosistema** — y eso es lo
 * que cada `server.mjs` añade encima.
 *
 * Compartir esto es honesto: si cada implementación escribiera su propia versión
 * de las mismas rutas, la comparación mediría mi capacidad de repetirme.
 */
export function responder(url, ficha) {
  if (url.pathname === "/reiniciar") {
    reiniciar();
    return { json: { reiniciada: true, peticiones: contador.peticiones } };
  }

  if (url.pathname === "/datos") {
    const clave = url.searchParams.get("clave") ?? "usuarios";
    const resultado = leer(clave, { envejecer: url.searchParams.get("envejecer") === "si" });
    return { json: { clave, ...resultado, peticiones: contador.peticiones } };
  }

  if (url.pathname === "/invalidar") {
    return { json: invalidar(url.searchParams.get("clave") ?? "usuarios") };
  }

  if (url.pathname === "/cache.json") {
    const fuente = readFileSync(new URL("./cache.mjs", import.meta.url), "utf8");
    return {
      json: {
        leido_del_archivo: true,
        archivo: "cache.mjs",
        lineas: fuente.split(/\r?\n/).filter((l) => l.trim()).length,
        plazo_ms: PLAZO_MS,
        el_estado_del_servidor_no_es_estado_de_interfaz: true,
        ideas: ["clave", "marca de tiempo", "obsolescencia", "invalidación"],
        ...ficha,
      },
    };
  }

  return null;
}
