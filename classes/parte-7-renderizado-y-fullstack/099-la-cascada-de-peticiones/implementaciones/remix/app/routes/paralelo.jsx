import { useLoaderData } from "@remix-run/react";

import Panel from "../Panel.jsx";
import { enParalelo } from "../fuente.js";

/** El mismo `loader` con `Promise.all`. La pantalla no se entera. */
export async function loader() {
  return { datos: await enParalelo() };
}

export default function Paralelo() {
  const { datos } = useLoaderData();
  return <Panel como="paralelo" datos={datos} />;
}
