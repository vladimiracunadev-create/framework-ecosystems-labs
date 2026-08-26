import { T as TAREAS, s as sello } from "../../../chunks/datos.js";
const prerender = true;
function load() {
  return { tareas: TAREAS, marca: sello(), estrategia: "estatico" };
}
export {
  load,
  prerender
};
