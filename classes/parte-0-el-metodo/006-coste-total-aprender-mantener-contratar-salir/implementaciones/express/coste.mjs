import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

/**
 * LAS MEDIDAS.
 *
 * Fíjate en lo que NO hay en este archivo: ni un `import express`. Es código
 * JavaScript corriente, y por eso se podría llevar a otro framework tal cual.
 *
 * Esa es exactamente la medida de la dimensión «salir»: cuántos archivos tuyos
 * mencionan al framework y cuántos no.
 */

const RAIZ = process.cwd();

/** Los archivos de código de esta implementación, sin lo descargado. */
export function archivosDeCodigo(directorio = RAIZ, acumulado = []) {
  for (const entrada of readdirSync(directorio, { withFileTypes: true })) {
    if (["node_modules", "dist", ".pnpm-store"].includes(entrada.name)) continue;
    const ruta = path.join(directorio, entrada.name);
    if (entrada.isDirectory()) {
      archivosDeCodigo(ruta, acumulado);
    } else if (/\.(mjs|js|ts)$/.test(entrada.name)) {
      acumulado.push(ruta);
    }
  }
  return acumulado;
}

/**
 * Cuántos paquetes hay realmente debajo, contados en el archivo de bloqueo.
 *
 * No es el número de `dependencies`: es el de TODO lo que se descarga. Cada uno
 * es código que se ejecuta en tu proceso, que puede tener un fallo de seguridad
 * y que alguien tiene que actualizar.
 */
function paquetesTransitivos() {
  const bloqueo = readFileSync(path.join(RAIZ, "pnpm-lock.yaml"), "utf8");
  const desde = bloqueo.indexOf("\npackages:");
  if (desde === -1) return 0;
  return bloqueo
    .slice(desde)
    .split(/\r?\n/)
    .filter((linea) => /^ {2}\S.*:$/.test(linea)).length;
}

function lineasDeCodigo() {
  return archivosDeCodigo()
    .flatMap((ruta) => readFileSync(ruta, "utf8").split(/\r?\n/))
    .filter((l) => l.trim() && !l.trim().startsWith("*") && !l.trim().startsWith("/")).length;
}

/** En cuántos archivos tuyos aparece el nombre del framework. */
function archivosQueMencionanAlFramework() {
  return archivosDeCodigo().filter((ruta) => /["']express["']/.test(readFileSync(ruta, "utf8")))
    .length;
}

/**
 * LOS CONCEPTOS QUE HAY QUE SABER PARA LEER ESTA IMPLEMENTACIÓN.
 *
 * Es la única de las cuatro medidas que se declara, porque no hay forma honesta
 * de contarla desde el código. Está aquí, al lado de lo que describe, para que
 * quien no esté de acuerdo pueda discutirla mirando los archivos.
 */
const CONCEPTOS = ["manejador", "middleware", "enrutado"];

export const DIMENSIONES = {
  aprender: () => ({
    medido: true,
    conceptos_para_leerlo: CONCEPTOS,
    cuantos_conceptos: CONCEPTOS.length,
    archivos: archivosDeCodigo().length,
    lineas_de_codigo: lineasDeCodigo(),
    como_se_mide: "los archivos de código de esta implementación, sin lo descargado",
  }),
  mantener: () => ({
    medido: true,
    dependencias_directas: Object.keys(
      JSON.parse(readFileSync(path.join(RAIZ, "package.json"), "utf8")).dependencies ?? {},
    ).length,
    paquetes_transitivos: paquetesTransitivos(),
    como_se_mide: "entradas de `packages:` en pnpm-lock.yaml",
  }),
  contratar: () => ({
    medido: false,
    por_que: "cuánta gente sabe esto y cuánto cobra no está en ningún archivo del repositorio",
    donde_se_mira: "encuestas públicas del sector y ofertas de tu mercado local, con su fecha",
    aviso: "inventarse este número es peor que no tenerlo",
  }),
  salir: () => ({
    medido: true,
    archivos_que_mencionan_al_framework: archivosQueMencionanAlFramework(),
    archivos_totales: archivosDeCodigo().length,
    como_se_mide: "archivos de código donde aparece el nombre del framework",
    que_significa:
      "los archivos que habría que reescribir para cambiar de framework, no los que se podrían mover tal cual",
  }),
};
