import http from "node:http";

// Sin framework: esto es TODO lo que hay entre el socket y tu respuesta.
// Node analiza la línea de petición y las cabeceras; lo demás lo escribes tú.
const servidor = http.createServer((peticion, respuesta) => {
  // El enrutado es un `if`. Un framework lo sustituye por una tabla de rutas.
  if (peticion.method === "GET" && peticion.url === "/") {
    respuesta.writeHead(200, { "content-type": "application/json" });
    respuesta.end(JSON.stringify({ capa: "sin framework" }));
    return;
  }

  // El 404 tampoco viene puesto: es la rama final del `if`.
  respuesta.writeHead(404, { "content-type": "application/json" });
  respuesta.end(JSON.stringify({ error: "no existe" }));
});

servidor.listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
