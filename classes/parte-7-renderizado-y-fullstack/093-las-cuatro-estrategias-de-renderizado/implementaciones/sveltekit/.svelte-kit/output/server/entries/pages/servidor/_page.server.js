import { T as TAREAS, s as sello } from "../../../chunks/datos.js";
const prerender = false;
function load() {
  return { tareas: TAREAS, marca: sello(), estrategia: "servidor" };
}
export {
  load,
  prerender
};
