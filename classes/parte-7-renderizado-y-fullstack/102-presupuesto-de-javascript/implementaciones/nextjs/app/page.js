import Contador from "./Contador.jsx";

export const dynamic = "force-dynamic";

export default function Pagina() {
  return (
    <>
      <h1 data-pantalla="presupuesto">Una pantalla con un botón</h1>
      <Contador />
    </>
  );
}
