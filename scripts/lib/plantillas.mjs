/** Hojas de estilo y guiones del sitio. Se mantienen aquí para que el
 *  generador quede legible y para que el sitio siga sin dependencias. */

export const ESTILOS = `*,*::before,*::after{box-sizing:border-box}
:root{
  --fondo:#ffffff;--panel:#f6f8fb;--panel-2:#eef2f8;--texto:#101720;--tenue:#5b6673;
  --borde:#dde3ec;--acento:#0b5fd0;--acento-2:#7b3fe4;--exito:#0f7b52;--aviso:#b45309;
  --codigo:#f4f6fa;--sombra:0 1px 2px rgba(16,24,40,.05),0 10px 30px rgba(16,24,40,.07);
  --radio:14px;--ancho:1320px;
}
@media (prefers-color-scheme:dark){:root:not([data-tema="claro"]){
  --fondo:#0b0f16;--panel:#121826;--panel-2:#182034;--texto:#e8eef7;--tenue:#9aa8bb;
  --borde:#232d40;--acento:#66a8ff;--acento-2:#b49bff;--exito:#4ed19b;--aviso:#f0b45e;
  --codigo:#111726;--sombra:0 1px 2px rgba(0,0,0,.5),0 12px 34px rgba(0,0,0,.4);
}}
:root[data-tema="oscuro"]{
  --fondo:#0b0f16;--panel:#121826;--panel-2:#182034;--texto:#e8eef7;--tenue:#9aa8bb;
  --borde:#232d40;--acento:#66a8ff;--acento-2:#b49bff;--exito:#4ed19b;--aviso:#f0b45e;
  --codigo:#111726;--sombra:0 1px 2px rgba(0,0,0,.5),0 12px 34px rgba(0,0,0,.4);
}
html{scroll-behavior:smooth;scroll-padding-top:5rem}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}*{animation:none!important;transition:none!important}}
body{margin:0;background:var(--fondo);color:var(--texto);
  font:16px/1.7 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  -webkit-text-size-adjust:100%;text-rendering:optimizeLegibility}
a{color:var(--acento);text-decoration:none}
a:hover{text-decoration:underline}
:focus-visible{outline:3px solid var(--acento);outline-offset:2px;border-radius:4px}
img{max-width:100%;height:auto}

.saltar{position:absolute;left:-9999px;top:0;background:var(--acento);color:#fff;padding:.6rem 1rem;z-index:100;border-radius:0 0 8px 0}
.saltar:focus{left:0}

header.barra{position:sticky;top:0;z-index:30;background:color-mix(in srgb,var(--fondo) 88%,transparent);
  backdrop-filter:blur(14px);border-bottom:1px solid var(--borde);padding:.65rem 1.1rem;
  display:flex;gap:1rem;align-items:center;flex-wrap:wrap}
.marca{font-weight:750;letter-spacing:-.02em;color:var(--texto);display:flex;gap:.55rem;align-items:center}
.marca svg{width:26px;height:26px;flex:0 0 auto}
.marca small{display:block;color:var(--tenue);font-weight:400;font-size:.76rem;letter-spacing:0}
header.barra nav{margin-left:auto;display:flex;gap:.35rem;flex-wrap:wrap;align-items:center;font-size:.9rem}
header.barra nav a{padding:.35rem .7rem;border-radius:8px;color:var(--texto)}
header.barra nav a:hover{background:var(--panel);text-decoration:none}
button.tema{background:var(--panel);border:1px solid var(--borde);color:var(--texto);
  border-radius:999px;padding:.35rem .85rem;cursor:pointer;font:inherit;font-size:.84rem}
button.tema:hover{border-color:var(--acento)}

.heroe{padding:4rem max(1.1rem,6vw) 3rem;border-bottom:1px solid var(--borde);
  background:radial-gradient(1200px 420px at 78% -30%,color-mix(in srgb,var(--acento-2) 22%,transparent),transparent 70%),var(--fondo)}
.encima{color:var(--exito);font-weight:750;letter-spacing:.14em;text-transform:uppercase;font-size:.76rem}
.heroe h1{max-width:22ch;font-size:clamp(2.1rem,5.4vw,4.1rem);line-height:1.03;letter-spacing:-.035em;margin:.9rem 0}
.degradado{background:linear-gradient(96deg,var(--acento),var(--acento-2));-webkit-background-clip:text;background-clip:text;color:transparent}
.entradilla{max-width:66ch;color:var(--tenue);font-size:1.12rem}
.cifras{display:flex;flex-wrap:wrap;gap:.8rem;margin:2rem 0 0;padding:0;list-style:none}
.cifra{min-width:132px;padding:.85rem 1.05rem;background:var(--panel);border:1px solid var(--borde);
  border-radius:var(--radio);box-shadow:var(--sombra)}
.cifra strong{display:block;font-size:1.6rem;letter-spacing:-.02em;line-height:1.2}
.cifra span{color:var(--tenue);font-size:.82rem}
.acciones{display:flex;flex-wrap:wrap;gap:.65rem;margin-top:1.9rem}
.boton{display:inline-block;padding:.72rem 1.3rem;border-radius:11px;font-weight:650;border:1px solid transparent}
.boton:hover{text-decoration:none;transform:translateY(-1px)}
.boton-primario{background:linear-gradient(96deg,var(--acento),var(--acento-2));color:#fff}
.boton-fantasma{border-color:var(--borde);background:var(--panel);color:var(--texto)}

main.contenedor{max-width:var(--ancho);margin:0 auto;padding:2.4rem max(1.1rem,6vw) 4.5rem}
section.bloque{margin:0 0 3.4rem}
section.bloque>h2{font-size:1.55rem;letter-spacing:-.02em;margin:0 0 .35rem}
section.bloque>p.sub{color:var(--tenue);margin:0 0 1.3rem;max-width:74ch}

.filtros{display:grid;grid-template-columns:minmax(220px,1fr) minmax(150px,.4fr) minmax(150px,.4fr);
  gap:.7rem;margin-bottom:1.2rem}
.filtros input,.filtros select{width:100%;padding:.72rem .9rem;font:inherit;color:var(--texto);
  background:var(--panel);border:1px solid var(--borde);border-radius:11px}
@media (max-width:760px){.filtros{grid-template-columns:1fr}}

.rejilla{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem}
.tarjeta{display:flex;flex-direction:column;gap:.6rem;padding:1.15rem;background:var(--panel);
  border:1px solid var(--borde);border-radius:var(--radio);box-shadow:var(--sombra);
  transition:transform .18s,border-color .18s}
.tarjeta:hover{transform:translateY(-3px);border-color:var(--acento)}
.tarjeta .meta{display:flex;justify-content:space-between;gap:.6rem;color:var(--tenue);font-size:.8rem}
.tarjeta h3{margin:0;font-size:1.12rem;letter-spacing:-.015em}
.tarjeta h3 a{color:var(--texto)}
.tarjeta p{margin:0;color:var(--tenue);font-size:.92rem}
.etiquetas{display:flex;flex-wrap:wrap;gap:.32rem;margin-top:auto}
.etiqueta{padding:.2rem .55rem;border:1px solid var(--borde);border-radius:999px;
  color:var(--tenue);font-size:.74rem;background:var(--fondo)}
.etiqueta.nivel-introductorio{border-color:var(--exito);color:var(--exito)}
.etiqueta.nivel-intermedio{border-color:var(--acento);color:var(--acento)}
.etiqueta.nivel-avanzado{border-color:var(--acento-2);color:var(--acento-2)}
.pie-tarjeta{display:flex;justify-content:space-between;align-items:center;gap:.6rem;
  border-top:1px solid var(--borde);padding-top:.6rem;font-size:.84rem;color:var(--tenue)}
.pie-tarjeta label{display:flex;gap:.4rem;align-items:center;cursor:pointer}
.pie-tarjeta input{accent-color:var(--exito);width:1.05rem;height:1.05rem}
.oculto{display:none!important}
.sin-resultados{color:var(--tenue);padding:1.4rem;border:1px dashed var(--borde);border-radius:var(--radio)}

.barra-progreso{height:8px;background:var(--panel-2);border-radius:999px;overflow:hidden;margin:.5rem 0 1.4rem}
.barra-progreso>i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--acento),var(--acento-2));transition:width .3s}

.envoltura{display:grid;grid-template-columns:290px minmax(0,1fr) 232px;gap:2.1rem;
  max-width:var(--ancho);margin:0 auto;padding:1.6rem max(1.1rem,3vw) 4rem;align-items:start}
aside.indice,aside.toc{position:sticky;top:4.6rem;align-self:start;max-height:calc(100vh - 6rem);
  overflow-y:auto;font-size:.9rem;padding-right:.4rem}
aside h2{font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;color:var(--tenue);margin:1.2rem 0 .45rem}
aside ul{list-style:none;margin:0;padding:0}
aside li{margin:.1rem 0}
aside a{display:block;padding:.3rem .6rem;border-radius:8px;color:var(--texto);
  overflow:hidden;text-overflow:ellipsis}
aside a:hover{background:var(--panel);text-decoration:none}
aside a[aria-current="page"]{background:var(--panel-2);font-weight:650;color:var(--acento)}
aside.toc a.n3{padding-left:1.3rem;font-size:.85rem;color:var(--tenue)}
@media (max-width:1180px){.envoltura{grid-template-columns:270px minmax(0,1fr)}aside.toc{display:none}}
@media (max-width:900px){.envoltura{grid-template-columns:1fr;gap:1rem}
  aside.indice{position:static;max-height:none;border-bottom:1px solid var(--borde);padding-bottom:1rem}}

article{min-width:0;max-width:80ch}
article h1{font-size:clamp(1.75rem,3.4vw,2.4rem);line-height:1.15;letter-spacing:-.03em;margin:.2rem 0 1rem}
article h2{font-size:1.4rem;letter-spacing:-.02em;margin:2.4rem 0 .7rem;padding-bottom:.35rem;border-bottom:1px solid var(--borde)}
article h3{font-size:1.09rem;margin:1.7rem 0 .5rem}
article h4{font-size:.98rem;margin:1.3rem 0 .4rem;color:var(--tenue)}
article p{margin:.85rem 0}
article ul,article ol{padding-left:1.35rem}
article li{margin:.32rem 0}
.ancla{margin-left:.45rem;color:var(--borde);font-weight:400;text-decoration:none;opacity:0}
h2:hover .ancla,h3:hover .ancla{opacity:1}
blockquote{margin:1.3rem 0;padding:.85rem 1.1rem;background:var(--panel);
  border-left:4px solid var(--acento);border-radius:0 10px 10px 0;color:var(--tenue)}
blockquote p{margin:0}
code{background:var(--codigo);padding:.13em .38em;border-radius:5px;
  font:.87em ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;border:1px solid var(--borde)}
.bloque-codigo{position:relative;margin:1.2rem 0}
.bloque-codigo[data-lenguaje]::before{content:attr(data-lenguaje);position:absolute;top:0;right:0;
  font:.7rem ui-monospace,Menlo,Consolas,monospace;color:var(--tenue);background:var(--panel-2);
  padding:.15rem .55rem;border-radius:0 10px 0 8px;border-left:1px solid var(--borde);border-bottom:1px solid var(--borde)}
pre{background:var(--codigo);border:1px solid var(--borde);border-radius:11px;padding:1rem 1.05rem;overflow-x:auto;margin:0}
pre code{background:none;padding:0;border:none;font-size:.86em;line-height:1.65}
pre.mermaid{background:var(--panel);text-align:center;font:.84em ui-monospace,Menlo,Consolas,monospace;
  color:var(--tenue);min-height:3rem;margin:1.3rem 0;padding:1.2rem}
pre.mermaid[data-processed="true"]{color:inherit;font:inherit}
pre.mermaid svg{max-width:100%;height:auto}
.tabla{overflow-x:auto;margin:1.2rem 0;border:1px solid var(--borde);border-radius:11px}
table{border-collapse:collapse;width:100%;font-size:.93rem}
th,td{text-align:left;padding:.58rem .8rem;border-bottom:1px solid var(--borde);vertical-align:top}
th{background:var(--panel);font-weight:650;position:sticky;top:0}
tbody tr:last-child td{border-bottom:none}
tbody tr:hover{background:color-mix(in srgb,var(--panel) 60%,transparent)}
hr{border:none;border-top:1px solid var(--borde);margin:2.2rem 0}

.cita{font-size:.82em;vertical-align:super;line-height:0;padding:.05em .3em;border-radius:5px;
  background:var(--panel-2);color:var(--acento);text-decoration:none;white-space:nowrap}
.cita:hover{background:var(--acento);color:var(--fondo);text-decoration:none}
.cita-rota{background:var(--aviso);color:#fff}

.ficha{display:flex;flex-wrap:wrap;gap:.5rem;margin:0 0 1.6rem;padding:0;list-style:none}
.ficha li{padding:.3rem .75rem;background:var(--panel);border:1px solid var(--borde);
  border-radius:999px;font-size:.82rem;color:var(--tenue)}
.ficha li b{color:var(--texto);font-weight:650}

.paginacion{display:flex;justify-content:space-between;gap:1rem;margin-top:3rem;
  padding-top:1.4rem;border-top:1px solid var(--borde);font-size:.92rem}
.paginacion a{max-width:46%;display:block}
.paginacion span{display:block;color:var(--tenue);font-size:.76rem;text-transform:uppercase;letter-spacing:.08em}

.buscador{width:100%;padding:.6rem .8rem;border:1px solid var(--borde);border-radius:10px;
  background:var(--panel);color:var(--texto);font:inherit;font-size:.9rem}
.resultados{margin-top:.5rem;max-height:46vh;overflow-y:auto}
.resultados li{margin:.15rem 0}
.resultados em{color:var(--tenue);font-style:normal;font-size:.8rem;display:block}

footer.pie{border-top:1px solid var(--borde);color:var(--tenue);font-size:.87rem;
  padding:2rem max(1.1rem,6vw);display:flex;gap:1rem;flex-wrap:wrap;justify-content:space-between}
footer.pie a{color:var(--tenue);text-decoration:underline}
@media print{
  header.barra,aside,.acciones,.filtros,.paginacion,footer.pie,.ancla{display:none!important}
  body{background:#fff;color:#000}
  .envoltura{display:block;padding:0}
  article{max-width:none}
  a{color:#000}
  .tabla,pre{break-inside:avoid}
}
`;

export const GUION_INICIO = `(() => {
  const clave = "fel:progreso";
  const leer = () => { try { return new Set(JSON.parse(localStorage.getItem(clave) ?? "[]")); } catch { return new Set(); } };
  const guardar = (conjunto) => localStorage.setItem(clave, JSON.stringify([...conjunto]));
  let hechos = leer();

  const tarjetas = [...document.querySelectorAll("[data-modulo]")];
  const total = tarjetas.length;
  const contador = document.getElementById("progreso");
  const barra = document.querySelector(".barra-progreso > i");

  function pintarProgreso() {
    if (contador) contador.textContent = hechos.size + "/" + total;
    if (barra) barra.style.width = total ? (hechos.size / total) * 100 + "%" : "0";
  }

  for (const tarjeta of tarjetas) {
    const casilla = tarjeta.querySelector("input[type=checkbox]");
    if (!casilla) continue;
    casilla.checked = hechos.has(tarjeta.dataset.modulo);
    casilla.addEventListener("change", () => {
      casilla.checked ? hechos.add(tarjeta.dataset.modulo) : hechos.delete(tarjeta.dataset.modulo);
      guardar(hechos);
      pintarProgreso();
    });
  }
  pintarProgreso();

  const busqueda = document.getElementById("busqueda");
  const nivel = document.getElementById("nivel");
  const ruta = document.getElementById("ruta");
  const vacio = document.getElementById("sin-resultados");

  function filtrar() {
    const texto = (busqueda?.value ?? "").toLowerCase().trim();
    const nivelElegido = nivel?.value ?? "";
    const rutaElegida = ruta?.value ?? "";
    let visibles = 0;
    for (const tarjeta of tarjetas) {
      const coincideTexto = !texto || tarjeta.dataset.buscar.includes(texto);
      const coincideNivel = !nivelElegido || tarjeta.dataset.nivel === nivelElegido;
      const coincideRuta = !rutaElegida || (tarjeta.dataset.rutas ?? "").split(",").includes(rutaElegida);
      const visible = coincideTexto && coincideNivel && coincideRuta;
      tarjeta.classList.toggle("oculto", !visible);
      if (visible) visibles += 1;
    }
    if (vacio) vacio.classList.toggle("oculto", visibles > 0);
  }

  busqueda?.addEventListener("input", filtrar);
  nivel?.addEventListener("change", filtrar);
  ruta?.addEventListener("change", filtrar);
})();`;

export const GUION_TEMA = `(() => {
  const clave = "fel:tema";
  const raiz = document.documentElement;
  const guardado = localStorage.getItem(clave);
  if (guardado) raiz.dataset.tema = guardado;
  window.alternarTema = () => {
    const oscuroAhora = getComputedStyle(raiz).getPropertyValue("--fondo").trim() !== "#ffffff";
    const siguiente = oscuroAhora ? "claro" : "oscuro";
    raiz.dataset.tema = siguiente;
    localStorage.setItem(clave, siguiente);
    for (const boton of document.querySelectorAll("button.tema")) {
      boton.setAttribute("aria-pressed", String(siguiente === "oscuro"));
    }
    document.dispatchEvent(new CustomEvent("tema-cambiado"));
  };
})();`;

export const GUION_BUSQUEDA = `(() => {
  const entrada = document.getElementById("buscador-doc");
  const lista = document.getElementById("resultados-doc");
  if (!entrada || !lista) return;
  let indice = null;

  async function cargar() {
    if (indice) return indice;
    const respuesta = await fetch(entrada.dataset.indice);
    indice = await respuesta.json();
    return indice;
  }

  let temporizador;
  entrada.addEventListener("input", () => {
    clearTimeout(temporizador);
    temporizador = setTimeout(async () => {
      const consulta = entrada.value.toLowerCase().trim();
      lista.innerHTML = "";
      if (consulta.length < 3) return;
      const datos = await cargar();
      const encontrados = datos
        .map((doc) => ({ doc, posicion: doc.texto.indexOf(consulta) }))
        .filter((r) => r.posicion >= 0 || r.doc.titulo.toLowerCase().includes(consulta))
        .slice(0, 12);
      if (!encontrados.length) {
        lista.innerHTML = "<li><em>Sin coincidencias.</em></li>";
        return;
      }
      for (const { doc, posicion } of encontrados) {
        const inicio = Math.max(0, posicion - 40);
        const extracto = posicion >= 0 ? "…" + doc.texto.slice(inicio, inicio + 120) + "…" : doc.seccion;
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = entrada.dataset.base + doc.url;
        a.textContent = doc.titulo;
        const em = document.createElement("em");
        em.textContent = extracto;
        li.append(a, em);
        lista.append(li);
      }
    }, 140);
  });
})();`;

export const GUION_MERMAID = `// Los diagramas son el unico recurso externo del sitio. Version fijada a
// proposito: sin fijarla, una publicacion nueva de la biblioteca podria cambiar
// el dibujo sin que nadie tocase el repositorio. Si la carga falla -sin red,
// bloqueada, o en uso local- el bloque queda como texto legible y la pagina
// sigue funcionando.
import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11.12.0/dist/mermaid.esm.min.mjs";

const raiz = document.documentElement;
const esOscuro = () =>
  (raiz.dataset.tema || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "oscuro" : "claro")) === "oscuro";

async function pintar() {
  const nodos = document.querySelectorAll("pre.mermaid");
  if (!nodos.length) return;
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: esOscuro() ? "dark" : "default",
    flowchart: { curve: "basis", useMaxWidth: true },
    sequence: { useMaxWidth: true },
    fontFamily: 'ui-sans-serif, system-ui, "Segoe UI", Roboto, sans-serif',
  });
  for (const nodo of nodos) {
    if (!nodo.dataset.fuente) nodo.dataset.fuente = nodo.textContent;
    nodo.innerHTML = nodo.dataset.fuente;
    nodo.removeAttribute("data-processed");
  }
  try {
    await mermaid.run({ nodes: nodos });
  } catch {
    // Queda el codigo del diagrama a la vista: es informacion, no un hueco.
  }
}

pintar();
document.addEventListener("tema-cambiado", pintar);`;

export const SERVICE_WORKER = `// Precarga el armazón y sirve el contenido ya visitado sin conexión.
const VERSION = "__VERSION__";
const CACHE = "framework-ecosystems-labs-" + VERSION;
const ARMAZON = __ARMAZON__;

self.addEventListener("install", (evento) => {
  evento.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ARMAZON)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((clave) => clave !== CACHE).map((clave) => caches.delete(clave))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (evento) => {
  if (evento.request.method !== "GET") return;
  // Red primero y caché de respaldo: el contenido cambia con cada publicación,
  // así que servir la caché por delante mostraría material desactualizado.
  evento.respondWith(
    fetch(evento.request)
      .then((respuesta) => {
        const copia = respuesta.clone();
        caches.open(CACHE).then((cache) => cache.put(evento.request, copia));
        return respuesta;
      })
      .catch(() => caches.match(evento.request).then((guardada) => guardada ?? caches.match("__BASE__index.html"))),
  );
});
`;

export const ICONO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Framework Ecosystems Labs">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#0b5fd0"/><stop offset="1" stop-color="#7b3fe4"/>
  </linearGradient></defs>
  <rect width="64" height="64" rx="14" fill="url(#g)"/>
  <path d="M20 20h24M20 32h16M20 44h20" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>
  <circle cx="47" cy="32" r="4.5" fill="#fff"/>
</svg>
`;
