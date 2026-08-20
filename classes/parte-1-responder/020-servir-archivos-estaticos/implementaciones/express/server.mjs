import path from "node:path";
import express from "express";

const app = express();

// `maxAge` se traduce a `Cache-Control: public, max-age=...`. Sin ella, el
// navegador revalida en cada carga y se pierde casi toda la ventaja.
app.use(
  "/estatico",
  express.static(path.join(import.meta.dirname, "publico"), {
    maxAge: "1h",
    // `dotfiles: deny` evita servir archivos que empiezan por punto, como
    // `.env`: es la clase de fuga que aparece al exponer un directorio entero.
    dotfiles: "deny",
    index: false,
  }),
);

app.listen(Number(process.env.PORT ?? 3000));
