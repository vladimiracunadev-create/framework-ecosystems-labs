const TAREAS = ["comprar pan", "regar las plantas", "llamar al taller"];
function sello() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
export {
  TAREAS as T,
  sello as s
};
