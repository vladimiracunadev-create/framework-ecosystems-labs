import { useLoaderData } from "@remix-run/react";

import Panel from "../Panel.jsx";
import { enCascada } from "../fuente.js";

/** Tres `await` seguidos dentro del `loader`. Que la carga esté junto a la ruta
 *  —clase 097— no impide escribir una cascada: solo la mueve al servidor, donde
 *  al menos la red es rápida. */
export async function loader() {
  return { datos: await enCascada() };
}

export default function Cascada() {
  const { datos } = useLoaderData();
  return <Panel como="cascada" datos={datos} />;
}
