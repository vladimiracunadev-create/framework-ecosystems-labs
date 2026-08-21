import { readFileSync } from "node:fs";
import express from "express";

const app = express();

// Los dos ficheros son DATOS congelados, no software instalado: el árbol de
// una aplicación de 2017 y la instantánea de la base de avisos. Este
// laboratorio no instala bibliotecas vulnerables — audita datos sobre ellas,
// que es lo que hace un auditor de verdad.
const arbol = JSON.parse(readFileSync(new URL("./datos/arbol.json", import.meta.url), "utf8"));
const base = JSON.parse(readFileSync(new URL("./datos/avisos.json", import.meta.url), "utf8"));

/**
 * Comparación NUMÉRICA de versiones, componente a componente.
 *
 * Comparar versiones como texto es el error que convierte una auditoría en
 * un tranquilizante: "2.5.9" > "2.5.10" es CIERTO alfabéticamente, así que
 * una comparación textual declararía sana una versión que está afectada. Y
 * un componente que falta cuenta como cero: 2.5.10 < 2.5.10.1.
 */
function menorQue(a, b) {
  const pa = String(a).split(".").map(Number);
  const pb = String(b).split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] ?? 0;
    const y = pb[i] ?? 0;
    if (x !== y) return x < y;
  }
  return false;
}

app.get("/dependencias", (peticion, respuesta) => {
  const directas = arbol.paquetes.filter((p) => p.directa);
  // El número que sorprende a todo el mundo la primera vez: lo que declaras
  // y lo que ejecutas no son la misma lista.
  respuesta.json({
    directas: directas.length,
    total: arbol.paquetes.length,
    paquetes: arbol.paquetes.map((p) => p.nombre),
  });
});

app.get("/dependencias/:nombre", (peticion, respuesta) => {
  const paquete = arbol.paquetes.find((p) => p.nombre === peticion.params.nombre);
  if (!paquete) return respuesta.status(404).json({ error: "no-esta-en-el-arbol" });
  respuesta.json(paquete);
});

app.get("/auditoria", (peticion, respuesta) => {
  // `?version=` permite preguntar «¿y si actualizo?» sin tocar el árbol: es
  // la pregunta que se hace antes de planificar la actualización.
  const forzada = peticion.query.version;
  const hallazgos = [];
  for (const aviso of base.avisos) {
    const paquete = arbol.paquetes.find((p) => p.nombre === aviso.paquete);
    if (!paquete) continue;
    const instalada = forzada ? String(forzada) : paquete.version;
    if (!menorQue(instalada, aviso.fijada_en)) continue;
    hallazgos.push({
      id: aviso.id,
      paquete: paquete.nombre,
      instalada,
      fijada_en: aviso.fijada_en,
      gravedad: aviso.gravedad,
      // Lo que convierte un hallazgo en accionable: si es transitiva, la
      // actualización no se hace sobre ella sino sobre quien la trajo.
      directa: paquete.directa,
      traida_por: paquete.traida_por,
      explotada_activamente: aviso.explotada_activamente === true,
    });
  }
  respuesta.json({
    instantanea: base.instantanea,
    avisos_conocidos: base.avisos.length,
    afectadas: hallazgos.length,
    hallazgos,
  });
});

app.listen(Number(process.env.PORT ?? 3000));
