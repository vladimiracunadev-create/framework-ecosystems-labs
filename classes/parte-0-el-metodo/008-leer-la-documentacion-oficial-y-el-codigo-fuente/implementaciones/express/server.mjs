import { createRequire } from "node:module";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import express from "express";

const app = express();

/**
 * CUATRO PREGUNTAS SOBRE EXPRESS, RESPONDIDAS ABRIENDO EXPRESS.
 *
 * Ninguna respuesta está escrita a mano. Todas salen del paquete que hay
 * instalado en este disco: su manifiesto, sus metadatos y sus archivos.
 *
 * La diferencia con un tutorial no es la calidad de la prosa: es que un tutorial
 * describe la versión que tenía su autor el día que lo escribió, y esto describe
 * la que tienes tú ahora.
 */

const require = createRequire(import.meta.url);

/**
 * `require.resolve` devuelve la ruta del archivo que Node cargaría de verdad.
 *
 * No es lo mismo que suponer `node_modules/express`: con enlaces simbólicos,
 * espacios de trabajo o versiones anidadas, el que se carga puede estar en otro
 * sitio. Preguntar al resolvedor es la única respuesta fiable.
 */
const manifiestoDeExpress = require.resolve("express/package.json");
const raizDeExpress = path.dirname(manifiestoDeExpress);
const metadatos = JSON.parse(readFileSync(manifiestoDeExpress, "utf8"));

/** Lo que este proyecto PIDIÓ, que casi nunca es una versión exacta. */
const rangoDeclarado = JSON.parse(readFileSync("package.json", "utf8")).dependencies.express;

/** Cuenta archivos de código dentro del paquete, sin bajar a sus dependencias. */
function archivosDeCodigo(directorio, acumulado = { total: 0, primero: null }) {
  for (const entrada of readdirSync(directorio, { withFileTypes: true })) {
    if (entrada.name === "node_modules") continue;
    const ruta = path.join(directorio, entrada.name);
    if (entrada.isDirectory()) {
      archivosDeCodigo(ruta, acumulado);
    } else if (entrada.name.endsWith(".js")) {
      acumulado.total += 1;
      acumulado.primero ??= path.relative(raizDeExpress, ruta).replaceAll("\\", "/");
    }
  }
  return acumulado;
}

const PREGUNTAS = {
  /**
   * QUÉ VERSIÓN HAY INSTALADA, no cuál se pidió.
   *
   * `^5.1.0` no es una versión: es un rango. Lo que se ejecuta es lo que el
   * gestor de paquetes resolvió, y en un informe de error la que importa es
   * esta.
   */
  version: () => ({
    respondida: true,
    leida_del_paquete: true,
    declarada_en_el_proyecto: rangoDeclarado,
    instalada: metadatos.version,
    satisface_lo_declarado: metadatos.version.startsWith(rangoDeclarado.replace(/^[\^~]/, "").split(".")[0]),
    de_donde_sale: path.relative(process.cwd(), manifiestoDeExpress).replaceAll("\\", "/"),
    por_que_importa:
      "un rango no identifica lo que se ejecuta; en un informe de error solo vale la versión exacta",
  }),

  /**
   * DÓNDE ESTÁ LA DOCUMENTACIÓN OFICIAL, según el propio paquete.
   *
   * El primer resultado de un buscador no es la fuente primaria: suele ser un
   * tutorial de hace tres versiones. La dirección buena la publica el paquete.
   */
  documentacion: () => ({
    respondida: true,
    leida_del_paquete: true,
    sitio: metadatos.homepage ?? "no lo declara",
    repositorio: metadatos.repository?.url ?? metadatos.repository ?? "no lo declara",
    incidencias: metadatos.bugs?.url ?? "no lo declara",
    licencia: metadatos.license,
    por_que_importa:
      "el buscador ordena por popularidad; el paquete declara dónde está la verdad de ESTA versión",
  }),

  /** DÓNDE VIVE en este disco. */
  "donde-vive": () => ({
    respondida: true,
    existe: statSync(raizDeExpress).isDirectory(),
    ruta: raizDeExpress.replaceAll("\\", "/"),
    punto_de_entrada: metadatos.main ?? "index.js",
    por_que_importa:
      "el código que se ejecuta está en tu disco: no hay que imaginarlo, se abre",
  }),

  /**
   * ¿PUEDES LEER SU CÓDIGO FUENTE SIN SALIR DE TU MÁQUINA?
   *
   * En Node la respuesta es sí, y es fácil olvidar lo raro que es. El paquete
   * que se descarga TRAE EL CÓDIGO, no un compilado. Se puede abrir, poner un
   * `console.log` y volver a ejecutar.
   *
   * En la JVM lo que viaja es bytecode, y para leer el original hay que pedir
   * aparte el archivo de fuentes o ir al repositorio.
   */
  "codigo-fuente": () => {
    const conteo = archivosDeCodigo(raizDeExpress);
    return {
      respondida: true,
      hay_codigo_fuente_en_disco: conteo.total > 0,
      archivos_de_codigo: conteo.total,
      por_ejemplo: conteo.primero,
      que_viaja_en_el_paquete: "el código fuente tal cual, sin compilar",
      como_leerlo: `abre ${raizDeExpress.replaceAll("\\", "/")}/${conteo.primero}`,
      por_que_importa:
        "cuando la documentación no contesta, el código sí; y aquí está a un `cat` de distancia",
    };
  },
};

app.get("/preguntas", (peticion, respuesta) =>
  respuesta.json({
    framework: "express",
    total: Object.keys(PREGUNTAS).length,
    preguntas: Object.keys(PREGUNTAS),
    todas_leidas_del_paquete: true,
  }),
);

app.get("/pregunta/:cual", (peticion, respuesta) => {
  const responder = PREGUNTAS[peticion.params.cual];
  if (!responder) {
    // Una pregunta que no está no se contesta con una aproximación. Es la misma
    // regla que la clase 006 aplica al coste de contratar.
    respuesta.status(404).json({
      code: "PREGUNTA_DESCONOCIDA",
      preguntas: Object.keys(PREGUNTAS),
    });
    return;
  }
  respuesta.json({ pregunta: peticion.params.cual, framework: "express", ...responder() });
});

app.listen(Number(process.env.PORT ?? 3000));
