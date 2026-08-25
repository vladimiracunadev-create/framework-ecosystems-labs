import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import { Injectable } from "@nestjs/common";

/**
 * LAS MEDIDAS.
 *
 * Exactamente las mismas cuatro que en la implementación de Express, calculadas
 * sobre los archivos de ESTA implementación. Los números no se declaran: se
 * cuentan cada vez que alguien pregunta.
 *
 * Se miran las fuentes de `src/`, no lo compilado en `dist/`: lo que cuesta
 * mantener es lo que se escribe, no lo que sale del compilador.
 */
@Injectable()
export class CosteService {
  private readonly raiz = process.cwd();

  /**
   * LOS CONCEPTOS QUE HAY QUE SABER PARA LEER ESTA IMPLEMENTACIÓN.
   *
   * Es la única de las cuatro medidas que se declara, porque no hay forma
   * honesta de contarla desde el código. Está aquí, al lado de lo que describe,
   * para que quien no esté de acuerdo pueda discutirla mirando los archivos.
   *
   * Compárala con la de Express: manejador, middleware y enrutado. Los tres
   * primeros también hacen falta aquí — NestJS corre sobre Express por debajo.
   */
  private readonly conceptos = [
    "manejador",
    "middleware",
    "enrutado",
    "módulo",
    "proveedor",
    "inyección por constructor",
    "decorador",
    "objeto de transferencia",
    "tubería de validación",
  ];

  private archivosDeCodigo(directorio = path.join(this.raiz, "src"), acumulado: string[] = []) {
    for (const entrada of readdirSync(directorio, { withFileTypes: true })) {
      if (["node_modules", "dist", ".pnpm-store"].includes(entrada.name)) continue;
      const ruta = path.join(directorio, entrada.name);
      if (entrada.isDirectory()) {
        this.archivosDeCodigo(ruta, acumulado);
      } else if (/\.(mjs|js|ts)$/.test(entrada.name)) {
        acumulado.push(ruta);
      }
    }
    return acumulado;
  }

  /**
   * Cuántos paquetes hay realmente debajo, contados en el archivo de bloqueo.
   *
   * No es el número de `dependencies`: es el de TODO lo que se descarga. Cada
   * uno es código que se ejecuta en tu proceso, que puede tener un fallo de
   * seguridad y que alguien tiene que actualizar.
   */
  private paquetesTransitivos(): number {
    const bloqueo = readFileSync(path.join(this.raiz, "pnpm-lock.yaml"), "utf8");
    const desde = bloqueo.indexOf("\npackages:");
    if (desde === -1) return 0;
    return bloqueo
      .slice(desde)
      .split(/\r?\n/)
      .filter((linea) => /^ {2}\S.*:$/.test(linea)).length;
  }

  private lineasDeCodigo(): number {
    return this.archivosDeCodigo()
      .flatMap((ruta) => readFileSync(ruta, "utf8").split(/\r?\n/))
      .filter((l) => l.trim() && !l.trim().startsWith("*") && !l.trim().startsWith("/")).length;
  }

  /** En cuántos archivos tuyos aparece el nombre del framework. */
  private archivosQueMencionanAlFramework(): number {
    return this.archivosDeCodigo().filter((ruta) =>
      /@nestjs/i.test(readFileSync(ruta, "utf8")),
    ).length;
  }

  dimensiones(): string[] {
    return ["aprender", "mantener", "contratar", "salir"];
  }

  medir(dimension: string): Record<string, unknown> | null {
    if (dimension === "aprender") {
      return {
        medido: true,
        conceptos_para_leerlo: this.conceptos,
        cuantos_conceptos: this.conceptos.length,
        archivos: this.archivosDeCodigo().length,
        lineas_de_codigo: this.lineasDeCodigo(),
        como_se_mide: "los archivos de código de esta implementación, sin lo descargado",
      };
    }
    if (dimension === "mantener") {
      const paquete = JSON.parse(
        readFileSync(path.join(this.raiz, "package.json"), "utf8"),
      );
      return {
        medido: true,
        dependencias_directas: Object.keys(paquete.dependencies ?? {}).length,
        paquetes_transitivos: this.paquetesTransitivos(),
        como_se_mide: "entradas de `packages:` en pnpm-lock.yaml",
      };
    }
    if (dimension === "contratar") {
      return {
        medido: false,
        por_que:
          "cuánta gente sabe esto y cuánto cobra no está en ningún archivo del repositorio",
        donde_se_mira:
          "encuestas públicas del sector y ofertas de tu mercado local, con su fecha",
        aviso: "inventarse este número es peor que no tenerlo",
      };
    }
    if (dimension === "salir") {
      return {
        medido: true,
        archivos_que_mencionan_al_framework: this.archivosQueMencionanAlFramework(),
        archivos_totales: this.archivosDeCodigo().length,
        como_se_mide: "archivos de código donde aparece el nombre del framework",
        que_significa:
          "los archivos que habría que reescribir para cambiar de framework, no los que se podrían mover tal cual",
      };
    }
    return null;
  }
}
