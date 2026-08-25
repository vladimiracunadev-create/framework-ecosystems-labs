// LA BIBLIOTECA. `node:http` no es un framework: es una biblioteca de la
// plataforma. Tú creas el servidor, tú escribes el bucle de decisión y tú
// llamas a lo que hay que llamar. Nadie te llama a ti.
//
// Todo lo que aparece debajo lo hacen los otros tres por su cuenta. Esa
// diferencia —quién llama a quién— es la clase entera.
import { createServer } from "node:http";

createServer((peticion, respuesta) => {
  // 1. EMPAREJAR LA RUTA. Aquí no hay tabla de rutas: hay que separar la
  //    ruta de la cadena de consulta a mano, porque `peticion.url` las trae
  //    pegadas.
  const url = new URL(peticion.url, "http://127.0.0.1");

  if (url.pathname === "/saludo") {
    // 2. LEER EL PARÁMETRO Y DECODIFICARLO. `URLSearchParams` decodifica
    //    `%20` por nosotros; leer `peticion.url` con un `split("=")` —que es
    //    lo primero que se le ocurre a cualquiera— devolvería "ana%20maria"
    //    y el tercer caso del contrato fallaría.
    const nombre = url.searchParams.get("nombre");

    // 3. DECIDIR LA RESPUESTA POR OMISIÓN cuando el parámetro no viene.
    const cuerpo = nombre ? `hola ${nombre}` : "hola";

    // 4. PONER EL TIPO DE CONTENIDO. Sin esta cabecera no hay ninguna por
    //    omisión: la respuesta sale sin `content-type` y el contrato falla.
    respuesta.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
    respuesta.end(cuerpo);
    return;
  }

  // 5. EL 404. Es una línea que hay que escribir. En los otros tres no
  //    aparece en ninguna parte del código y aun así se emite.
  respuesta.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
  respuesta.end("no encontrado");
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
