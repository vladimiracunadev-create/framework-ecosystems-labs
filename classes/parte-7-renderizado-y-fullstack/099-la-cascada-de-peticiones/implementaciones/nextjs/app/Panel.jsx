/** La misma pantalla para las dos rutas. */
export default function Panel({ como, datos }) {
  return (
    <main data-como={como}>
      <h1>Hola, {datos.usuario.nombre}</h1>
      <p data-pedidos={datos.pedidos.length}>{datos.pedidos.length} pedidos</p>
      <ul>
        {datos.avisos.map((aviso) => (
          <li key={aviso}>{aviso}</li>
        ))}
      </ul>
    </main>
  );
}
