import { a4 as attr, a5 as ensure_array_like, e as escape_html } from "../../../chunks/index.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let tareas = [];
    let pendiente = "si";
    $$renderer2.push(`<ul data-estrategia="cliente"${attr("data-pendiente", pendiente)}><!--[-->`);
    const each_array = ensure_array_like(tareas);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let tarea = each_array[$$index];
      $$renderer2.push(`<li>${escape_html(tarea)}</li>`);
    }
    $$renderer2.push(`<!--]--></ul>`);
  });
}
export {
  _page as default
};
