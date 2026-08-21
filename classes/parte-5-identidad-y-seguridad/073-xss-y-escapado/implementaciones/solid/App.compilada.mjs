import { ssr as _$ssr } from "solid-js/web";
import { escape as _$escape } from "solid-js/web";
var _tmpl$ = ["<p>", "</p>"],
  _tmpl$2 = ["<div>", "</div>"];
// Solid es un compilador de JSX: este archivo se compila con su preset real
// de Babel (generate: "ssr") en el paso de preparación, y lo que el
// servidor ejecuta es el código que Solid escribió.
import { renderToString } from "solid-js/web";

// La interpolación normal: {texto} escapa por omisión.
export const seguro = texto => renderToString(() => _$ssr(_tmpl$, _$escape(texto)));

// La puerta explícita de Solid: la propiedad innerHTML, sin disfraz.
export const inseguro = texto => renderToString(() => _$ssr(_tmpl$2, texto));
